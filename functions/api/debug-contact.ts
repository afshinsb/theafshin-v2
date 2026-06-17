import { json } from "../_shared/security";
import type { PagesContext } from "../_shared/security";
import { z } from "zod";

const emailSchema = z.string().email();

export const onRequestGet = async ({ env }: PagesContext) => {
  const hasContactToEmail = Boolean(env.CONTACT_TO_EMAIL);
  const hasContactFromEmail = Boolean(env.CONTACT_FROM_EMAIL);

  return json({
    ok: true,
    hasTurnstileSecret: Boolean(env.TURNSTILE_SECRET_KEY),
    hasResendApiKey: Boolean(env.RESEND_API_KEY),
    hasContactToEmail,
    hasContactFromEmail,
    contactToEmailValid: emailSchema.safeParse(env.CONTACT_TO_EMAIL).success,
    contactFromEmailValid: emailSchema.safeParse(env.CONTACT_FROM_EMAIL).success,
    hasKvBinding: Boolean(env.PORTFOLIO_RATE_LIMIT_KV),
  });
};
