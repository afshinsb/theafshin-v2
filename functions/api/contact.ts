import {
  blockDuplicate,
  clampText,
  enforceQuota,
  genericError,
  getClientIp,
  hasOnlyFields,
  json,
  parseLimit,
  readJson,
  sha256Hex,
  todayKey,
  validateTurnstile,
} from "../_shared/security";
import type { PagesContext } from "../_shared/security";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 160;
const MAX_COMPANY_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_FIELDS = ["name", "email", "company", "message", "website", "turnstileToken"];
const FIXED_FROM_EMAIL = "contact@theafshin.com";

function escapeHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export const onRequestPost = async ({ request, env }: PagesContext) => {
  const ip = getClientIp(request);
  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const body = parsed.body as Record<string, unknown>;
  if (!hasOnlyFields(body, CONTACT_FIELDS)) {
    console.warn("contact_blocked_schema", { ip });
    return json({ error: "Invalid request body." }, 400);
  }

  if (typeof body.website === "string" && body.website.trim()) {
    console.warn("contact_blocked_honeypot", { ip });
    return json({ ok: true });
  }

  const name = clampText(body.name, MAX_NAME_LENGTH);
  const email = clampText(body.email, MAX_EMAIL_LENGTH).toLowerCase();
  const company = clampText(body.company, MAX_COMPANY_LENGTH);
  const message = clampText(body.message, MAX_MESSAGE_LENGTH + 1);

  if (
    name.length < 2 ||
    !EMAIL_RE.test(email) ||
    company.length < 2 ||
    !message ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    console.warn("contact_blocked_validation", { ip });
    return json({ error: "Please complete all required fields with valid details." }, 400);
  }

  const turnstileOk = await validateTurnstile(env, body.turnstileToken, ip);
  if (!turnstileOk) {
    console.warn("contact_blocked_turnstile", { ip });
    return json({ error: "Verification failed. Please refresh and try again." }, 403);
  }

  const day = todayKey();
  const hour = new Date().toISOString().slice(0, 13);
  const quota = await enforceQuota(env, [
    {
      key: `contact:hour:${hour}:${ip}`,
      limit: parseLimit(env.CONTACT_PER_HOUR_LIMIT, 2, 1, 20),
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

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    console.error("contact_email_missing_config");
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
        from: `Portfolio Contact <${FIXED_FROM_EMAIL}>`,
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
