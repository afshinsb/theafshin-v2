# theafshin-v2

This is my portfolio site for infrastructure, networking, and security operations work.

It is a React/Vite frontend with an Express server. The site includes a short professional profile, project cards, interactive lab-style demos, a technical Q&A assistant, and a recruiter contact form.

I use the backend for anything that needs a secret, such as AI provider keys or SMTP credentials. Those keys should stay in `.env` and never go into the browser bundle.

## What is in it

- Overview page for my infrastructure/security background.
- Project cards for:
  - Self-hosted secure infrastructure.
  - Universal Subtitle Translator.
  - Voxa.
- Interactive labs for:
  - SOC-style incident triage.
  - Subtitle translator sample workflow.
  - Voxa voice provider workflow.
- Technical Q&A route that can use OpenAI or Gemini.
- Contact form that can send email through SMTP when configured.
- Dark/light theme.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Express
- Motion
- Lucide React
- OpenAI SDK
- Google GenAI SDK
- Nodemailer

## Setup

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
cp .env.example .env
```

Configure one AI provider.

OpenAI:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Gemini:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
```

If `AI_PROVIDER` is not set, the server tries OpenAI first when `OPENAI_API_KEY` exists, then Gemini when `GEMINI_API_KEY` exists.

## Contact Form

The contact form only sends real email if SMTP is configured:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=username@example.com
SMTP_PASS=your_smtp_or_app_password
CONTACT_TO_EMAIL=contact@theafshin.com
CONTACT_FROM_EMAIL=portfolio@theafshin.com
```

For Gmail, use an app password.

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Checks

```bash
npm run lint
npm audit
```

## Notes

- `.env` is ignored by Git.
- AI and SMTP secrets stay server-side in `server.ts`.
- The frontend calls backend routes like `/api/chat` and `/api/contact`.

## License

All rights reserved.
