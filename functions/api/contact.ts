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
    hasEmailApiKey: Boolean(env.RESEND_API_KEY),
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
    !env.RESEND_API_KEY ||
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

  const sourceUrl = new URL(request.url).origin;
  const safeSubjectName = escapeHeader(name);
  const subject = safeSubjectName ? `Portfolio inquiry: ${safeSubjectName}` : "Portfolio inquiry";
  const text = [
    "New portfolio inquiry",
    "Sent from theafshin.com",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "Not provided"}`,
    `Source: ${sourceUrl}`,
    "",
    "Message:",
    "",
    message,
  ].join("\n");
  const fields = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "Not provided"],
    ["Source", sourceUrl],
  ];
  const html = [
    '<div style="margin:0;padding:18px;font-family:Arial,Helvetica,sans-serif;color:#18181b;">',
    '<div style="max-width:600px;margin:0 auto;">',
    '<div style="padding:8px 2px 16px;">',
    '<h1 style="margin:0;font-size:22px;line-height:1.3;color:#111827;">Portfolio inquiry</h1>',
    '<p style="margin:6px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">Sent from theafshin.com</p>',
    "</div>",
    '<div style="display:block;width:100%;box-sizing:border-box;margin:0 0 14px;padding:14px 16px;border:1px solid #e5e7eb;border-radius:10px;">',
    ...fields.map(([label, value]) => [
      `<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#374151;word-break:break-word;overflow-wrap:anywhere;"><strong style="color:#111827;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`,
    ].join("")),
    "</div>",
    '<div style="display:block;width:100%;box-sizing:border-box;padding:14px 16px;border:1px solid #e5e7eb;border-radius:10px;">',
    '<h2 style="margin:0 0 8px;font-size:16px;line-height:1.4;color:#111827;">Message</h2>',
    `<div style="display:block;width:100%;box-sizing:border-box;white-space:pre-wrap;font-size:15px;line-height:1.65;color:#1f2937;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(message)}</div>`,
    "</div>",
    "</div>",
    "</div>",
  ].join("");

  try {
    console.info("contact_email_send_start", {
      provider: "resend",
      hasEmailApiKey: Boolean(env.RESEND_API_KEY),
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
        html,
      }),
    });

    console.info("contact_email_send_result", {
      provider: "resend",
      ok: response.ok,
      status: response.status,
    });

    if (!response.ok) {
      const responseBody = await response.text();
      console.error("contact_email_send_error", {
        provider: "resend",
        status: response.status,
        responseBody: responseBody.slice(0, 1000),
      });
      return genericError(502);
    }

    return json({ ok: true });
  } catch {
    console.error("contact_email_send_error", { provider: "resend", branch: "resend_fetch_catch" });
    return genericError(502);
  }
};
