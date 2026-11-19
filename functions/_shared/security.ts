export interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  OPENAI_MAX_OUTPUT_TOKENS?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  ENABLE_TRANSLATE_API?: string;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  PORTFOLIO_RATE_LIMIT_KV?: KVNamespace;
  PORTFOLIO_AI_BUDGET?: BudgetDatabase;
  CHAT_PER_MINUTE_LIMIT?: string;
  CHAT_IP_DAILY_LIMIT?: string;
  CHAT_GLOBAL_DAILY_LIMIT?: string;
  CONTACT_PER_HOUR_LIMIT?: string;
  CONTACT_IP_DAILY_LIMIT?: string;
  TRANSLATE_PER_MINUTE_LIMIT?: string;
  TRANSLATE_IP_DAILY_LIMIT?: string;
}

export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface BudgetDatabase {
  prepare(query: string): {
    bind(day: string, limit: number): {
      run(): Promise<{ success: boolean; meta: { changes: number } }>;
    };
  };
}

export type PagesContext = { request: Request; env: Env };
const MAX_JSON_BODY_BYTES = 20 * 1024;

export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...headers,
    },
  });
}

export function genericError(status = 500) {
  return json({ error: "Unable to process this request right now." }, status);
}

export function parseLimit(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value?.trim() || NaN);
  return Number.isFinite(parsed) ? Math.min(Math.max(Math.floor(parsed), min), max) : fallback;
}

export async function readJson(request: Request) {
  const denied = (response: Response) => ({ ok: false as const, response });
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return denied(genericError(403));
  }
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") return denied(json({ error: "JSON request body required." }, 415));

  const tooLarge = () => denied(json({ error: "Request body is too large." }, 413));
  if (Number(request.headers.get("content-length")) > MAX_JSON_BODY_BYTES) return tooLarge();

  const invalid = () => denied(json({ error: "Invalid JSON request body." }, 400));
  const reader = request.body?.getReader();
  if (!reader) return invalid();
  try {
    const buffer = new Uint8Array(MAX_JSON_BODY_BYTES);
    let length = 0;
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
      if (length + chunk.value.byteLength > MAX_JSON_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        return tooLarge();
      }
      buffer.set(chunk.value, length);
      length += chunk.value.byteLength;
    }
    const body: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer.subarray(0, length)));
    if (!body || typeof body !== "object" || Array.isArray(body)) return invalid();
    return { ok: true as const, body };
  } catch {
    return invalid();
  } finally {
    reader.releaseLock();
  }
}

export function getClientIp(request: Request) {
  const ip = request.headers.get("cf-connecting-ip");
  return ip && /^[0-9a-f:.]{2,45}$/i.test(ip) ? ip : "unknown";
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function stripCrlf(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function validateTurnstile(env: Env, token: string, ip: string, expected?: { hostname: string; action: string }) {
  if (!env.TURNSTILE_SECRET_KEY || token.length < 10 || token.length > 2048) return false;
  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  if (ip !== "unknown") formData.append("remoteip", ip);
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(5500),
    });
    if (!response.ok) return false;
    const result = await response.json() as { success?: boolean; hostname?: string; action?: string };
    if (result.success !== true) return false;
    // Cloudflare's official dummy verification uses fixed metadata and is restricted to local preview.
    if (expected && ["localhost", "127.0.0.1"].includes(expected.hostname) &&
        env.TURNSTILE_SECRET_KEY === "1x0000000000000000000000000000000AA") return true;
    return !expected || (result.hostname === expected.hostname && result.action === expected.action);
  } catch {
    return false;
  }
}

function quotaReached(retryAfter: number) {
  return json({ error: "Too many requests. Please try again later." }, 429, { "retry-after": String(retryAfter) });
}

export async function enforceQuota(env: Env, checks: Array<{ key: string; limit: number; ttlSeconds: number }>) {
  const kv = env.PORTFOLIO_RATE_LIMIT_KV;
  if (!kv) return { allowed: false as const, response: genericError(503) };
  try {
    for (const check of checks) {
      const current = Number(await kv.get(check.key) ?? "0");
      if (!Number.isSafeInteger(current) || current < 0) return { allowed: false as const, response: genericError(503) };
      if (current >= check.limit) return { allowed: false as const, response: quotaReached(Math.min(check.ttlSeconds, 3600)) };
      await kv.put(check.key, String(current + 1), { expirationTtl: check.ttlSeconds });
    }
    return { allowed: true as const };
  } catch {
    return { allowed: false as const, response: genericError(503) };
  }
}

export async function reserveAiBudget(env: Env, day: string): Promise<Response | undefined> {
  if (!env.PORTFOLIO_AI_BUDGET) return genericError(503);
  const limit = parseLimit(env.CHAT_GLOBAL_DAILY_LIMIT, 100, 1, 1000);
  try {
    const result = await env.PORTFOLIO_AI_BUDGET.prepare(
      "INSERT INTO ai_daily_budget (day, used) VALUES (?1, 1) ON CONFLICT(day) DO UPDATE SET used = used + 1 WHERE used < ?2",
    ).bind(day, limit).run();
    if (!result.success) return genericError(503);
    if (result.meta.changes !== 1) return quotaReached(3600);
  } catch {
    return genericError(503);
  }
}
