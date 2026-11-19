import { z } from "zod";
import { enforceQuota, genericError, getClientIp, json, parseLimit, readJson, sha256Hex, stripCrlf, todayKey, validateTurnstile, type PagesContext } from "../_shared/security";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80).transform(stripCrlf),
  email: z.string().trim().toLowerCase().max(120).email(),
  company: z.string().trim().max(120).transform(stripCrlf).optional().default(""),
  message: z.string().trim().min(1).max(1500),
  website: z.string().max(200).optional().default(""),
  turnstileToken: z.string().min(10).max(2048),
}).strict();

const address = z.string().email();

export const onRequestGet = async () => json({ ok: true, route: "/api/contact", methods: ["POST"] });

export const onRequestPost = async ({ request, env }: PagesContext) => {
  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;
  const body = contactSchema.safeParse(parsed.body);
  if (!body.success) return json({ error: "Invalid request body." }, 400);
  if (body.data.website.trim()) return json({ ok: true });
  if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY || !env.PORTFOLIO_RATE_LIMIT_KV ||
      !address.safeParse(env.CONTACT_FROM_EMAIL).success || !address.safeParse(env.CONTACT_TO_EMAIL).success) {
    return genericError(503);
  }

  const ip = getClientIp(request);
  const { name, email, company, message, turnstileToken } = body.data;
  const hostname = new URL(request.url).hostname;
  if (!await validateTurnstile(env, turnstileToken, ip, { hostname, action: "contact" })) {
    return json({ error: "Verification failed. Please try again." }, 403);
  }

  const key = await sha256Hex(JSON.stringify([name, email, company, message]));
  const duplicateKey = `contact:sent:${key}`;
  try {
    if (await env.PORTFOLIO_RATE_LIMIT_KV.get(duplicateKey)) return json({ ok: true });
  } catch {
    return genericError(503);
  }
  const quota = await enforceQuota(env, [
    { key: `contact:hour:${new Date().toISOString().slice(0, 13)}:${ip}`, limit: parseLimit(env.CONTACT_PER_HOUR_LIMIT, 3, 1, 20), ttlSeconds: 7200 },
    { key: `contact:ip:${todayKey()}:${ip}`, limit: parseLimit(env.CONTACT_IP_DAILY_LIMIT, 5, 1, 100), ttlSeconds: 172800 },
  ]);
  if (!quota.allowed) return quota.response;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
        "idempotency-key": `portfolio-contact/${key}`,
      },
      body: JSON.stringify({
        from: `Portfolio Contact <${env.CONTACT_FROM_EMAIL}>`,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio inquiry from ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, `Company: ${company || "Not provided"}`, "", message].join("\n"),
      }),
      signal: AbortSignal.timeout(9500),
    });
    if (!response.ok) return genericError(502);
    // Provider idempotency still protects a retry if the advisory marker cannot be written.
    await env.PORTFOLIO_RATE_LIMIT_KV.put(duplicateKey, "1", { expirationTtl: 3600 }).catch(() => {});
    return json({ ok: true });
  } catch {
    return genericError(502);
  }
};
