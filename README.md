# theafshin-v2

Static React/Vite portfolio for Afshin Saberi, deployed on Cloudflare Pages with server-side API routes implemented as Cloudflare Pages Functions.

## Architecture

- Frontend: Cloudflare Pages static build from `dist/`.
- API: Cloudflare Pages Functions under `functions/api/`.
- Public API routes:
  - `POST /api/chat`
  - `POST /api/contact`
- Protected/removed endpoint:
  - `POST /api/translate` returns `404`; the public portfolio does not expose an expensive translation API.

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
npx wrangler pages dev dist --kv PORTFOLIO_RATE_LIMIT_KV
```

For local function testing, create a local `.dev.vars` file with the server-side values below. You may set `TURNSTILE_BYPASS=true` locally only.

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
TURNSTILE_SECRET_KEY=set_as_cloudflare_secret
RESEND_API_KEY=set_as_cloudflare_secret
CONTACT_TO_EMAIL=contact@theafshin.com
CHAT_PER_MINUTE_LIMIT=3
CHAT_IP_DAILY_LIMIT=20
CHAT_GLOBAL_DAILY_LIMIT=200
CONTACT_PER_HOUR_LIMIT=2
CONTACT_IP_DAILY_LIMIT=5
```

Required Cloudflare binding:

```text
PORTFOLIO_RATE_LIMIT_KV
```

Create it as a KV namespace and bind it to the Pages project. The API intentionally returns a generic `503` if the quota KV binding is missing.

## Cloudflare Pages Deployment

1. Connect the repository to Cloudflare Pages.
2. Set build command: `npm run build`.
3. Set build output directory: `dist`.
4. Add `VITE_TURNSTILE_SITE_KEY` as a Pages build variable.
5. Add all server-side values as Pages Function secrets or environment variables.
6. Bind KV namespace `PORTFOLIO_RATE_LIMIT_KV`.
7. Deploy.

Cloudflare automatically deploys files in `functions/api/` as Pages Functions beside the static Vite site.

## Turnstile Setup

1. Create a Cloudflare Turnstile widget for `theafshin.com` and preview domains.
2. Put the public site key in `VITE_TURNSTILE_SITE_KEY`.
3. Put the secret key in `TURNSTILE_SECRET_KEY`.
4. Keep server-side validation enabled in production. Do not set `TURNSTILE_BYPASS=true` outside local development.

## OpenAI Budget Setup

1. Use an OpenAI project-scoped API key.
2. Set project budget alerts and a hard monthly budget in OpenAI billing.
3. Keep `OPENAI_MODEL=gpt-4o-mini`.
4. Keep `OPENAI_MAX_OUTPUT_TOKENS` between `300` and `500`; default is `400`.
5. Keep conservative Cloudflare quotas: per-minute, per-IP daily, and global daily limits.

The chat route hard-stops before calling OpenAI when a quota is exceeded.

No Gemini route is active in this deployment. If a future Gemini-powered route is added, store `GEMINI_API_KEY` only as a Cloudflare secret, add the same Turnstile and KV quotas, and set a provider-side budget before enabling it publicly.

## Email Provider Setup

The contact form uses Resend because SMTP/Nodemailer is not a good fit for Cloudflare Workers.

1. Verify the sending domain in Resend.
2. Create a Resend API key.
3. Set `RESEND_API_KEY`.
4. Set `CONTACT_TO_EMAIL` to the inbox that should receive recruiter messages.

The sender is fixed in code as `Portfolio Contact <contact@theafshin.com>`. Visitor email addresses are used only as `Reply-To`.

## Cloudflare Security Rules

Add Cloudflare WAF/rate-limit rules in front of the Pages project:

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
- `VITE_TURNSTILE_SITE_KEY` is the only Turnstile value exposed to the browser.
- `.env*` files are ignored by Git except `.env.example`.
- Chat and contact both require Turnstile client tokens and server validation.
- Chat has per-IP rate limit, per-IP daily quota, and global daily quota.
- Contact has per-IP hourly and daily quotas, duplicate detection, and a honeypot.
- API requests accept JSON only and reject bodies over 20 KB.
- Chat rejects malformed, empty, repeated, prompt-injection-like, and over-700-character messages.
- Chat sends only the last 6 history messages and caps output tokens.
- Chat is restricted to Afshin's resume, experience, projects, infrastructure, networking, and security background.
- Contact uses a fixed From address and puts visitor email only in Reply-To.
- React Markdown does not render raw HTML and blocks unsafe URL protocols such as `javascript:`.
- API errors are generic and do not expose stack traces or provider responses.
- `/api/translate` is not an expensive public API.

## Checks

```bash
npm run lint
npm run build
npm audit
```

## License

All rights reserved.
