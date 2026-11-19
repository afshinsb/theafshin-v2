# Afshin Saberi · Engineering Portfolio

A React and TypeScript portfolio about applied AI, Python backends and software reliability. Vite prerenders the homepage, seven case studies, and the 404 page into `dist/public`. Cloudflare Pages Functions handle the API. Deploy only `dist/public` as static assets.

## Local review

Requires Node.js 22.12 or later.

```sh
npm ci
npm run build
npx wrangler d1 execute PORTFOLIO_AI_BUDGET --config wrangler.local.jsonc --local --file migrations/0001_ai_daily_budget.sql
npm run pages:dev
```

Open [the local Pages preview](http://127.0.0.1:8788/). It includes the actual API routes. Suggested recruiter questions use reviewed answers and work with no provider credentials. A custom question requires OpenAI configuration. The contact form falls back to the public email when verification or mail delivery is unavailable.

For a configured local test, put server-side values in the ignored `.dev.vars` file and set `VITE_TURNSTILE_SITE_KEY` as a build variable. Rebuild after changing the public site key. The official always-pass Turnstile test pair is suitable for localhost. Use separate credentials and an approved test inbox for any real provider smoke test.

## Verify a change

```sh
npm run lint
npm test
npx playwright install chromium --only-shell
npm run test:browser
npm run build
npm run audit:public
npm audit
```

The browser suite builds with an official Turnstile test site key and intercepts network requests to external providers. Run a clean build with your intended build variables after the browser suite. The API suite uses an in-memory SQLite database, mock KV, and mocked provider responses.

## Cloudflare Pages rollout after approval

1. Keep the existing Pages project, repository root, production branch, and domain settings. Use `npm run build` and output directory `dist/public`. Set the Pages build runtime to a supported Node version.
2. For Preview, create a dedicated D1 database, run [the migration](migrations/0001_ai_daily_budget.sql) against it, and bind it as `PORTFOLIO_AI_BUDGET`. Keep or provision `PORTFOLIO_RATE_LIMIT_KV`. Keep Preview quota stores and provider credentials separate from Production.
3. Set `VITE_TURNSTILE_SITE_KEY` in the build environment. Allow the exact preview hostname on the Turnstile widget, then set `TURNSTILE_SECRET_KEY` in the matching Pages Functions environment.
4. Set `OPENAI_API_KEY` and a Structured Outputs-capable `OPENAI_MODEL` such as `gpt-4o-mini`. Keep conservative daily and per-visitor limits. Configure usage alerts in the provider project. Set `RESEND_API_KEY`, a verified `CONTACT_FROM_EMAIL`, and the private `CONTACT_TO_EMAIL` as server-side values. Keep `ENABLE_TRANSLATE_API=false` unless the legacy route is intentionally enabled.
5. Verify a suggested question, a custom question, one approved contact delivery, case-study URLs, a missing page, CSP and the built public assets in Preview. Confirm Cloudflare edge rules protect paid endpoints and verify that provider errors remain generic.
6. After approval, repeat the Preview binding and schema setup for Production with a separate database. Confirm production Turnstile hostname authorization, environment values, and WAF rules. Merge and check the resulting Pages deployment. If a regression is observed, roll back using the previous successful Pages deployment.

### Runtime settings

| Setting | Purpose or default |
| --- | --- |
| `PORTFOLIO_RATE_LIMIT_KV` | Per-visitor counters and advisory contact duplicate markers |
| `PORTFOLIO_AI_BUDGET` | Atomic shared daily reservation before paid chat or optional legacy translate calls |
| `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_MAX_OUTPUT_TOKENS` | Server-only model key, model selection, and output cap. Default cap 100 and hard maximum 400 |
| `CHAT_PER_MINUTE_LIMIT`, `CHAT_IP_DAILY_LIMIT`, `CHAT_GLOBAL_DAILY_LIMIT` | Defaults 3, 5, and 100. Global limit hard maximum 1,000 |
| `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Server-only verification and email settings |
| `CONTACT_PER_HOUR_LIMIT`, `CONTACT_IP_DAILY_LIMIT` | Defaults 3 and 5 |
| `ENABLE_TRANSLATE_API`, `GEMINI_API_KEY`, `GEMINI_MODEL` | Legacy route opt-in and provider settings. Keep disabled by default |
| `TRANSLATE_PER_MINUTE_LIMIT`, `TRANSLATE_IP_DAILY_LIMIT` | Optional legacy defaults 3 and 5 |

See [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/), [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), and [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs/).

## Security and content boundaries

The assistant passes the current question and a valid prior topic to the model. It renders reviewed answers and allowlisted links on the server's selected topic. It has no tools, private documents, or client-supplied transcripts in model context. Free-form queries may be processed by OpenAI, and a topic can be misclassified. Provider requests that fail still count against the daily cap. A distributed caller can consume the daily allowance, so keep Cloudflare edge rate limits in place alongside the eventually consistent KV counters.

Turnstile token validation binds contact requests to the hostname and form action. The email provider receives plain text and an idempotency key. The recipient and credentials remain server-side. Apply edge rate limits to protect Turnstile and the contact route, including when a provider is slow or unavailable.

Private projects are described through sanitized summaries and purpose-built diagrams. The two repository visuals are derived from public project media. The subtitle screenshot is cropped to the upload controls. The site contains no résumé download.
