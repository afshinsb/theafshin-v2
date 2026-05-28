# Afshin Saberi Portfolio

Interactive portfolio for infrastructure, networking, and security operations work.

The app presents a command-center style profile with project demos, a recruiter contact form, and a server-side technical Q&A assistant. API keys stay on the Express server and are never exposed in the browser bundle.

## Features

- Professional overview for infrastructure, networking, and security operations roles.
- Interactive Technical Profile powered by either OpenAI or Gemini.
- Recruiter Contact form with real SMTP email delivery when configured.
- Labs section with:
  - SOC incident triage workbench.
  - Universal Subtitle Translator project mock with live demo/source links.
  - Voxa multi-provider voice studio project mock.
- Responsive dark/light theme with custom scrollbars.
- Production build bundles the React app and Express server.

## Stack

- React 19
- Vite
- Tailwind CSS v4
- Express
- TypeScript
- Motion
- Lucide React
- OpenAI SDK
- Google GenAI SDK
- Nodemailer

## Local Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure at least one AI provider for the Technical Profile.

OpenAI example:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Gemini example:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
```

If `AI_PROVIDER` is omitted, the server auto-picks OpenAI when `OPENAI_API_KEY` exists, otherwise Gemini when `GEMINI_API_KEY` exists.

## Contact Form Email

The contact form sends real email only when SMTP settings are configured:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=username@example.com
SMTP_PASS=your_smtp_or_app_password
CONTACT_TO_EMAIL=contact@theafshin.com
CONTACT_FROM_EMAIL=portfolio@theafshin.com
```

For Gmail, use an app password instead of the normal account password.

## Run

Development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build And Start

Build the React app and Express server bundle:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

## Checks

Type-check:

```bash
npm run lint
```

Security audit:

```bash
npm audit
```

## Environment Safety

- `.env` is ignored by Git.
- AI provider keys are read only by `server.ts`.
- SMTP credentials are read only by `server.ts`.
- The browser communicates with server routes such as `/api/chat` and `/api/contact`.

## License

All rights reserved. Developed by Afshin Saberi.
