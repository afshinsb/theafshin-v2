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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function contactEnvState(env: PagesContext["env"]) {
  const contactToEmailValid = emailSchema.safeParse(env.CONTACT_TO_EMAIL).success;
  const contactFromEmailValid = emailSchema.safeParse(env.CONTACT_FROM_EMAIL).success;
  return {
    hasTurnstileSecret: Boolean(env.TURNSTILE_SECRET_KEY),
    hasCloudflareAccountId: Boolean(env.CLOUDFLARE_ACCOUNT_ID),
    hasCloudflareEmailApiToken: Boolean(env.CLOUDFLARE_EMAIL_API_TOKEN),
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

  if (
    !env.CLOUDFLARE_ACCOUNT_ID ||
    !env.CLOUDFLARE_EMAIL_API_TOKEN ||
    !env.CONTACT_TO_EMAIL ||
    !env.CONTACT_FROM_EMAIL
  ) {
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

  const timestamp = new Date().toISOString();
  const sourceUrl = new URL(request.url).origin;
  const subject = `New portfolio contact message from ${escapeHeader(name)}`;
  const text = [
    "New portfolio contact message",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Timestamp: ${timestamp}`,
    `Source URL: ${sourceUrl}`,
    "",
    "Message:",
    message,
  ].join("\n");
  const html = [
    "<h2>New portfolio contact message</h2>",
    "<dl>",
    `<dt>Name</dt><dd>${escapeHtml(name)}</dd>`,
    `<dt>Email</dt><dd>${escapeHtml(email)}</dd>`,
    `<dt>Company</dt><dd>${escapeHtml(company || "Not provided")}</dd>`,
    `<dt>Timestamp</dt><dd>${escapeHtml(timestamp)}</dd>`,
    `<dt>Source URL</dt><dd>${escapeHtml(sourceUrl)}</dd>`,
    "</dl>",
    "<h3>Message</h3>",
    `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  ].join("");

  try {
    console.info("contact_email_send_start", {
      hasCloudflareAccountId: Boolean(env.CLOUDFLARE_ACCOUNT_ID),
      hasCloudflareEmailApiToken: Boolean(env.CLOUDFLARE_EMAIL_API_TOKEN),
      contactFromEmailValid,
      contactToEmailValid,
    });

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(env.CLOUDFLARE_ACCOUNT_ID)}/email/sending/send`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          to: env.CONTACT_TO_EMAIL,
          from: env.CONTACT_FROM_EMAIL,
          subject,
          text,
          html,
        }),
      },
    );

    console.info("contact_email_send_result", {
      ok: response.ok,
      status: response.status,
    });

    if (!response.ok) return genericError(502);

    return json({ ok: true });
  } catch {
    console.error("contact_email_send_error", { branch: "cloudflare_email_rest_catch" });
    return genericError(502);
  }
};
