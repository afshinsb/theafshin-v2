import {
  blockDuplicate,
  enforceQuota,
  genericError,
  getClientIp,
  json,
  parseLimit,
  readJson,
  sha256Hex,
  stripCrlf,
  todayKey,
  validateTurnstile,
} from "../_shared/security";
import type { PagesContext } from "../_shared/security";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80).transform(stripCrlf),
  email: z.string().trim().toLowerCase().max(120).email().transform(stripCrlf),
  company: z.string().trim().max(120).transform(stripCrlf).optional().default(""),
  message: z.string().trim().min(1).max(1500),
  website: z.string().optional().default(""),
  turnstileToken: z.string().min(10).max(4096),
}).strict();

const emailSchema = z.string().email();

function escapeHeader(value: string) {
  return stripCrlf(value);
}

export const onRequestPost = async ({ request, env }: PagesContext) => {
  const ip = getClientIp(request);
  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const body = contactSchema.safeParse(parsed.body);
  if (!body.success) {
    console.warn("contact_blocked_schema", { ip });
    return json({ error: "Invalid request body." }, 400);
  }

  if (body.data.website.trim()) {
    console.warn("contact_blocked_honeypot", { ip });
    return json({ ok: true });
  }

  const { name, email, company, message } = body.data;

  const turnstileOk = await validateTurnstile(env, body.data.turnstileToken, ip);
  if (!turnstileOk) {
    console.warn("contact_blocked_turnstile", { ip });
    return json({ error: "Verification failed. Please refresh and try again." }, 403);
  }

  const day = todayKey();
  const hour = new Date().toISOString().slice(0, 13);
  const quota = await enforceQuota(env, [
    {
      key: `contact:hour:${hour}:${ip}`,
      limit: parseLimit(env.CONTACT_PER_HOUR_LIMIT, 3, 1, 20),
      ttlSeconds: 7200,
      label: "contact_per_hour",
    },
    {
      key: `contact:ip:${day}:${ip}`,
      limit: parseLimit(env.CONTACT_IP_DAILY_LIMIT, 5, 1, 100),
      ttlSeconds: 172800,
      label: "contact_ip_daily",
    },
  ]);
  if (!quota.allowed) return quota.response;

  const duplicateHash = await sha256Hex(`${email}:${company.toLowerCase()}:${message.toLowerCase()}`);
  const duplicate = await blockDuplicate(
    env,
    `contact:duplicate:${duplicateHash}`,
    3600,
    "contact_duplicate",
  );
  if (duplicate.blocked) return duplicate.response;

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    console.error("contact_email_missing_config");
    return genericError(503);
  }

  if (!emailSchema.safeParse(env.CONTACT_FROM_EMAIL).success || !emailSchema.safeParse(env.CONTACT_TO_EMAIL).success) {
    console.error("contact_email_invalid_config");
    return genericError(503);
  }

  const subject = `Portfolio inquiry from ${escapeHeader(name)}`;
  const text = [
    "New portfolio contact request",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Source IP: ${ip}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    console.info("contact_request_count", { ip });
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: `Portfolio Contact <${env.CONTACT_FROM_EMAIL}>`,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      console.error("resend_provider_error", { status: response.status });
      return genericError(502);
    }

    return json({ ok: true });
  } catch (error) {
    console.error("contact_email_error", { error: String(error) });
    return genericError(502);
  }
};
