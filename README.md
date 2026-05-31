# theafshin-v2

Static React/Vite portfolio for Afshin Saberi, deployed on Cloudflare Pages with server-side API routes implemented as Cloudflare Pages Functions.

## Architecture

- Frontend: Cloudflare Pages static build from `dist/public`.
- API: Cloudflare Pages Functions under `functions/api/`.
- Public API routes:
  - `POST /api/chat`
  - `POST /api/contact`
- Disabled by default:
  - `POST /api/translate` returns a generic `404` unless `ENABLE_TRANSLATE_API=true`. If enabled, it requires Turnstile, KV quotas, JSON validation, and Gemini budget controls.

Secrets are read only in Pages Functions. Do not put `OPENAI_API_KEY`, Resend keys, SMTP passwords, or `TURNSTILE_SECRET_KEY` in frontend code or `VITE_*` variables.

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend only:

```bash
npm run dev
```

Run a production-like Pages Functions preview:

```bash
npm run build
npx wrangler pages dev dist/public --kv PORTFOLIO_RATE_LIMIT_KV
```

The npm helper uses the configured public output directory:

```bash
npm run pages:dev
```

For local function testing, create a local `.dev.vars` file with the server-side values below. Turnstile validation is always enforced by the API routes; use Cloudflare Turnstile test keys for local or preview testing.

## Required Environment Variables

Frontend Pages build variable:

```env
VITE_TURNSTILE_SITE_KEY=your_public_turnstile_site_key
```

Cloudflare Pages Functions secrets/vars:

```env
OPENAI_API_KEY=set_as_cloudflare_secret
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_OUTPUT_TOKENS=400
GEMINI_API_KEY=set_as_cloudflare_secret_if_translate_is_enabled
GEMINI_MODEL=gemini-1.5-flash
ENABLE_TRANSLATE_API=false
TURNSTILE_SECRET_KEY=set_as_cloudflare_secret
RESEND_API_KEY=set_as_cloudflare_secret
CONTACT_TO_EMAIL=contact@theafshin.com
CONTACT_FROM_EMAIL=contact@theafshin.com
CHAT_PER_MINUTE_LIMIT=3
CHAT_IP_DAILY_LIMIT=5
CHAT_GLOBAL_DAILY_LIMIT=100
CONTACT_PER_HOUR_LIMIT=3
CONTACT_IP_DAILY_LIMIT=5
TRANSLATE_PER_MINUTE_LIMIT=3
TRANSLATE_IP_DAILY_LIMIT=5
```

Required Cloudflare binding:

```text
PORTFOLIO_RATE_LIMIT_KV
```

Create it as a KV namespace and bind it to the Pages project. The API intentionally returns a generic `503` if the quota KV binding is missing.

## Cloudflare Pages Deployment

1. Connect the repository to Cloudflare Pages.
2. Set build command: `npm run build`.
3. Set build output directory: `dist/public`.
4. Add `VITE_TURNSTILE_SITE_KEY` as a Pages build variable.
5. Add all server-side values as Pages Function secrets or environment variables.
6. Bind KV namespace `PORTFOLIO_RATE_LIMIT_KV`.
7. Deploy.

Cloudflare automatically deploys files in `functions/api/` as Pages Functions beside the static Vite site.

There is no Express production server in this deployment and no `server.cjs` build artifact. Do not place server bundles, source maps, or secrets inside `dist/public`.

## Turnstile Setup

1. Create a Cloudflare Turnstile widget for `theafshin.com` and preview domains.
2. Put the public site key in `VITE_TURNSTILE_SITE_KEY`.
3. Put the secret key in `TURNSTILE_SECRET_KEY`.
4. Keep server-side validation enabled in production. There is no production bypass for Turnstile validation.

## OpenAI Budget Setup

1. Use an OpenAI project-scoped API key.
2. Set project budget alerts and a hard monthly budget in OpenAI billing.
3. Keep `OPENAI_MODEL=gpt-4o-mini`.
4. Keep `OPENAI_MAX_OUTPUT_TOKENS=400`.
5. Keep conservative Cloudflare quotas: `CHAT_IP_DAILY_LIMIT=5` and `CHAT_GLOBAL_DAILY_LIMIT=100` or lower.

The chat route hard-stops before calling OpenAI when a quota is exceeded.

The translation route is disabled by default. If `ENABLE_TRANSLATE_API=true`, set `GEMINI_API_KEY` only as a Cloudflare secret, keep `GEMINI_MODEL=gemini-1.5-flash` or another budgeted model, and keep Gemini `maxOutputTokens` at `400`.

## Email Provider Setup

The contact form uses Resend because SMTP/Nodemailer is not a good fit for Cloudflare Workers.

1. Verify the sending domain in Resend.
2. Create a Resend API key.
3. Set `RESEND_API_KEY`.
4. Set `CONTACT_TO_EMAIL` to the inbox that should receive recruiter messages.
5. Set `CONTACT_FROM_EMAIL` to a fixed verified sender such as `contact@theafshin.com`.

The sender is fixed from `CONTACT_FROM_EMAIL`. Visitor email addresses are used only as `Reply-To`.

## Cloudflare Security Rules

Add Cloudflare WAF/rate-limit rules in front of the Pages project:

Server-side KV counters are a second line of defense, not the only control. Cloudflare KV increments are not atomic under high parallel abuse, so production WAF and Cloudflare rate-limit rules are required for `/api/*`.

- Rate limit `POST /api/chat` by IP in addition to the server-side KV quota.
- Rate limit `POST /api/contact` separately from chat.
- Challenge or block non-POST requests to `/api/chat` and `/api/contact`.
- Block common malicious paths: `/.env`, `/wp-admin`, `/wp-login.php`, `/phpmyadmin`, `/config`, `/server-status`, and backup/archive extensions.
- Do not add wildcard CORS headers to protected API routes. Keep these APIs same-origin.
- Allow only the production domain and required Cloudflare preview domains in Turnstile widget settings.
- Keep Cloudflare bot protection enabled for `/api/*`.

## Production Safety Checklist

- `OPENAI_API_KEY` exists only as a Cloudflare server-side secret.
- `TURNSTILE_SECRET_KEY` exists only as a Cloudflare server-side secret.
- `RESEND_API_KEY` exists only as a Cloudflare server-side secret.
- `GEMINI_API_KEY` is set only if translation is intentionally enabled.
- `VITE_TURNSTILE_SITE_KEY` is the only Turnstile value exposed to the browser.
- Vite builds public frontend assets to `dist/public`; no server bundle or source map is served from public output.
- `.env*` files are ignored by Git except `.env.example`.
- Chat and contact both require Turnstile client tokens and server validation.
- Chat has per-IP rate limit, `5` requests per IP per day, and `100` global AI requests per day by default.
- Contact has `3` requests per IP per hour, daily quotas, duplicate detection, and a honeypot.
- API requests accept JSON only and reject bodies over 20 KB.
- Chat validates request bodies with Zod, rejects malformed, empty, repeated, prompt-injection-like, and over-700-character messages.
- Chat accepts the current validated message only for OpenAI input and caps output tokens at 400.
- Chat is restricted to Afshin's resume, experience, projects, infrastructure, networking, and security background.
- Contact uses a fixed From address and puts visitor email only in Reply-To.
- React Markdown does not render raw HTML and blocks unsafe URL protocols such as `javascript:`.
- API errors are generic and do not expose stack traces or provider responses.
- `/api/translate` is disabled unless explicitly enabled, and then uses the same Turnstile/quota posture as chat.

## Checks

```bash
npm run lint
npm run build
npm audit
```

## License

All rights reserved.
