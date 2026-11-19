import { z } from "zod";
import { enforceQuota, genericError, getClientIp, json, parseLimit, readJson, reserveAiBudget, todayKey, validateTurnstile, type PagesContext } from "../_shared/security";

const translateSchema = z.object({
  text: z.string().trim().min(1).max(700),
  targetLang: z.string().trim().min(2).max(40).regex(/^[\p{L}\s()-]+$/u),
  turnstileToken: z.string().min(10).max(2048),
}).strict();

function hiddenNotFound() {
  return new Response(null, { status: 404, headers: { "cache-control": "no-store" } });
}

export const onRequestPost = async ({ request, env }: PagesContext) => {
  if (env.ENABLE_TRANSLATE_API !== "true") return hiddenNotFound();
  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;
  const body = translateSchema.safeParse(parsed.body);
  if (!body.success) return json({ error: "Invalid request body." }, 400);
  if (!env.GEMINI_API_KEY) return genericError(503);
  const ip = getClientIp(request);
  if (!await validateTurnstile(env, body.data.turnstileToken, ip)) return json({ error: "Verification failed." }, 403);

  const day = todayKey();
  const quota = await enforceQuota(env, [
    { key: `translate:minute:${ip}:${Math.floor(Date.now() / 60000)}`, limit: parseLimit(env.TRANSLATE_PER_MINUTE_LIMIT, 3, 1, 20), ttlSeconds: 90 },
    { key: `translate:ip:${day}:${ip}`, limit: parseLimit(env.TRANSLATE_IP_DAILY_LIMIT, 5, 1, 100), ttlSeconds: 172800 },
  ]);
  if (!quota.allowed) return quota.response;
  const budget = await reserveAiBudget(env, day);
  if (budget) return budget;

  const model = env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{
          text: `Translate this subtitle sample to ${body.data.targetLang}. Preserve SRT numbering and timestamps. Return only the translated subtitle text.\n\n${body.data.text}`,
        }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
      }),
    });
    if (!response.ok) return genericError(502);
    const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const translated = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim().slice(0, 4000);
    return json({ translated: translated ?? "" });
  } catch {
    return genericError(502);
  }
};

export const onRequest = () => hiddenNotFound();
