export interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  OPENAI_MAX_OUTPUT_TOKENS?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_BYPASS?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  PORTFOLIO_RATE_LIMIT_KV?: KVNamespace;
  CHAT_PER_MINUTE_LIMIT?: string;
  CHAT_IP_DAILY_LIMIT?: string;
  CHAT_GLOBAL_DAILY_LIMIT?: string;
  CONTACT_PER_HOUR_LIMIT?: string;
  CONTACT_IP_DAILY_LIMIT?: string;
}

const MAX_JSON_BODY_BYTES = 20 * 1024;

export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export type PagesContext = {
  request: Request;
  env: Env;
};

export function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

export function genericError(status = 500) {
  return json({ error: "Unable to process this request right now." }, status);
}

export function parseLimit(value: string | undefined, fallback: number, min = 1, max = 100000) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.floor(parsed), min), max);
}

export async function readJson(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { ok: false as const, response: json({ error: "JSON request body required." }, 415) };
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BODY_BYTES) {
    return { ok: false as const, response: json({ error: "Request body is too large." }, 413) };
  }

  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_JSON_BODY_BYTES) {
      return { ok: false as const, response: json({ error: "Request body is too large." }, 413) };
    }

    const body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { ok: false as const, response: json({ error: "Invalid JSON request body." }, 400) };
    }

    return { ok: true as const, body };
  } catch {
    return { ok: false as const, response: json({ error: "Invalid JSON request body." }, 400) };
  }
}

export function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function clampText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function hasOnlyFields(body: Record<string, unknown>, allowedFields: string[]) {
  const allowed = new Set(allowedFields);
  return Object.keys(body).every((key) => allowed.has(key));
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function validateTurnstile(
  env: Env,
  token: unknown,
  ip: string,
) {
  if (env.TURNSTILE_BYPASS === "true") {
    console.warn("turnstile_bypass_enabled");
    return true;
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("turnstile_missing_secret");
    return false;
  }

  if (typeof token !== "string" || token.length < 10 || token.length > 4096) {
    return false;
  }

  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  if (ip !== "unknown") formData.append("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("turnstile_validation_error", { error: String(error) });
    return false;
  }
}

async function incrementCounter(env: Env, key: string, ttlSeconds: number) {
  if (!env.PORTFOLIO_RATE_LIMIT_KV) {
    console.error("quota_kv_missing", { key });
    return null;
  }

  const current = Number((await env.PORTFOLIO_RATE_LIMIT_KV.get(key)) || "0");
  const next = Number.isFinite(current) ? current + 1 : 1;
  await env.PORTFOLIO_RATE_LIMIT_KV.put(key, String(next), { expirationTtl: ttlSeconds });
  return next;
}

export async function enforceQuota(
  env: Env,
  checks: Array<{ key: string; limit: number; ttlSeconds: number; label: string }>,
) {
  for (const check of checks) {
    const next = await incrementCounter(env, check.key, check.ttlSeconds);
    if (next === null) {
      return {
        allowed: false as const,
        response: genericError(503),
      };
    }

    if (next > check.limit) {
      console.warn("request_blocked_quota", {
        label: check.label,
        key: check.key,
        count: next,
        limit: check.limit,
      });
      return {
        allowed: false as const,
        response: json({ error: "Too many requests. Please try again later." }, 429, {
          "retry-after": String(Math.min(check.ttlSeconds, 3600)),
        }),
      };
    }
  }

  return { allowed: true as const };
}

export async function blockDuplicate(
  env: Env,
  key: string,
  ttlSeconds: number,
  label: string,
) {
  if (!env.PORTFOLIO_RATE_LIMIT_KV) {
    console.error("duplicate_kv_missing", { key });
    return {
      blocked: true as const,
      response: genericError(503),
    };
  }

  const existing = await env.PORTFOLIO_RATE_LIMIT_KV.get(key);
  if (existing) {
    console.warn("request_blocked_duplicate", { label, key });
    return {
      blocked: true as const,
      response: json({ error: "This request was already received. Please try again later." }, 429, {
        "retry-after": String(Math.min(ttlSeconds, 3600)),
      }),
    };
  }

  await env.PORTFOLIO_RATE_LIMIT_KV.put(key, "1", { expirationTtl: ttlSeconds });
  return { blocked: false as const };
}
