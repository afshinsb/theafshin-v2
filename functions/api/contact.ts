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

function contactEnvState(env: PagesContext["env"]) {
  const contactToEmailValid = emailSchema.safeParse(env.CONTACT_TO_EMAIL).success;
  const contactFromEmailValid = emailSchema.safeParse(env.CONTACT_FROM_EMAIL).success;
  return {
    hasTurnstileSecret: Boolean(env.TURNSTILE_SECRET_KEY),
    hasResendApiKey: Boolean(env.RESEND_API_KEY),
    hasContactToEmail: Boolean(env.CONTACT_TO_EMAIL),
    hasContactFromEmail: Boolean(env.CONTACT_FROM_EMAIL),
    contactToEmailValid,
    contactFromEmailValid,
    hasKvBinding: Boolean(env.PORTFOLIO_RATE_LIMIT_KV),
  };
}

export const onRequestGet = async () => json({
  ok: true,
  route: "/api/contact",
  methods: ["POST"],
});

export const onRequestPost = async ({ request, env }: PagesContext) => {
  const ip = getClientIp(request);
  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const body = contactSchema.safeParse(parsed.body);
  if (!body.success) {
    console.warn("contact_blocked_schema");
    return json({ error: "Invalid request body." }, 400);
  }

  if (body.data.website.trim()) {
    console.warn("contact_blocked_honeypot");
    return json({ ok: true });
  }

  const { name, email, company, message } = body.data;

  console.info("contact_turnstile_start", {
    hasTurnstileSecret: Boolean(env.TURNSTILE_SECRET_KEY),
  });
  const turnstileOk = await validateTurnstile(env, body.data.turnstileToken, ip);
  console.info("contact_turnstile_result", { success: turnstileOk });
  if (!turnstileOk) {
    console.warn("contact_blocked_turnstile");
    return json({ error: "Verification failed. Please refresh and try again." }, 403);
  }

  const day = todayKey();
  const hour = new Date().toISOString().slice(0, 13);
  console.info("contact_quota_start", {
    hasKvBinding: Boolean(env.PORTFOLIO_RATE_LIMIT_KV),
  });
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
  console.info("contact_quota_result", { allowed: quota.allowed });
  if (!quota.allowed) return quota.response;

  console.info("contact_duplicate_start", {
    hasKvBinding: Boolean(env.PORTFOLIO_RATE_LIMIT_KV),
  });
  const duplicateHash = await sha256Hex(`${email}:${company.toLowerCase()}:${message.toLowerCase()}`);
  const duplicate = await blockDuplicate(
    env,
    `contact:duplicate:${duplicateHash}`,
    3600,
    "contact_duplicate",
  );
  console.info("contact_duplicate_result", { blocked: duplicate.blocked });
  if (duplicate.blocked) return duplicate.response;

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    console.error("contact_email_missing_config", contactEnvState(env));
    return genericError(503);
  }

  const contactFromEmailValid = emailSchema.safeParse(env.CONTACT_FROM_EMAIL).success;
  const contactToEmailValid = emailSchema.safeParse(env.CONTACT_TO_EMAIL).success;
  if (!contactFromEmailValid || !contactToEmailValid) {
    console.error("contact_email_invalid_config", {
      contactFromEmailValid,
      contactToEmailValid,
    });
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
    console.info("contact_resend_start", {
      hasResendApiKey: Boolean(env.RESEND_API_KEY),
      contactFromEmailValid,
      contactToEmailValid,
    });
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

    console.info("contact_resend_result", { status: response.status });
    return json({ ok: true });
  } catch {
    console.error("contact_email_error", { branch: "resend_fetch_catch" });
    return genericError(502);
  }
};
