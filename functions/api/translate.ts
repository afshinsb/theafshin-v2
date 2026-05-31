import {
  enforceQuota,
  genericError,
  getClientIp,
  json,
  parseLimit,
  readJson,
  todayKey,
  validateTurnstile,
} from "../_shared/security";
import type { PagesContext } from "../_shared/security";
import { z } from "zod";

const translateSchema = z.object({
  text: z.string().trim().min(1).max(700),
  targetLang: z.string().trim().min(2).max(40).regex(/^[\p{L}\s()-]+$/u),
  turnstileToken: z.string().min(10).max(4096),
}).strict();

function hiddenNotFound() {
  return new Response(null, {
    status: 404,
    headers: {
      "cache-control": "no-store",
    },
  });
}

export const onRequestPost = async ({ request, env }: PagesContext) => {
  if (env.ENABLE_TRANSLATE_API !== "true") {
    return hiddenNotFound();
  }

  const ip = getClientIp(request);
  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const body = translateSchema.safeParse(parsed.body);
  if (!body.success) {
    console.warn("translate_blocked_schema", { ip });
    return json({ error: "Invalid request body." }, 400);
  }

  const turnstileOk = await validateTurnstile(env, body.data.turnstileToken, ip);
  if (!turnstileOk) {
    console.warn("translate_blocked_turnstile", { ip });
    return json({ error: "Verification failed. Please refresh and try again." }, 403);
  }

  const day = todayKey();
  const quota = await enforceQuota(env, [
    {
      key: `translate:minute:${ip}:${Math.floor(Date.now() / 60000)}`,
      limit: parseLimit(env.TRANSLATE_PER_MINUTE_LIMIT, 3, 1, 20),
      ttlSeconds: 90,
      label: "translate_per_minute",
    },
    {
      key: `translate:ip:${day}:${ip}`,
      limit: parseLimit(env.TRANSLATE_IP_DAILY_LIMIT, 5, 1, 100),
      ttlSeconds: 172800,
      label: "translate_ip_daily",
    },
    {
      key: `chat:global:${day}`,
      limit: parseLimit(env.CHAT_GLOBAL_DAILY_LIMIT, 100, 1, 10000),
      ttlSeconds: 172800,
      label: "ai_global_daily",
    },
  ]);
  if (!quota.allowed) return quota.response;

  if (!env.GEMINI_API_KEY) {
    console.error("gemini_missing_key");
    return genericError(503);
  }

  const model = env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;

  try {
    console.info("translate_request_count", { ip, model });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Translate this subtitle sample to ${body.data.targetLang}. Keep SRT numbering and timestamps unchanged. Return only the translated subtitle text.\n\n${body.data.text}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 400,
        },
      }),
    });

    if (!response.ok) {
      console.error("gemini_provider_error", { status: response.status });
      return genericError(502);
    }

    const data = (await response.json()) as any;
    const translated = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("")
      .trim();

    return json({ translated: translated || "" });
  } catch (error) {
    console.error("gemini_request_error", { error: String(error) });
    return genericError(502);
  }
};

export const onRequest = () => hiddenNotFound();
