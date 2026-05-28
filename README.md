# Afshin Saberi | Security Operations & Systems Administration Portfolio

An interactive, responsive, and robust portfolio application showcasing 8+ years of expertise in IT systems administration, host infrastructure security, and container orchestration. It features real-time, sandbox-inspired modular workbenches and a full-stack responsive interface.

---

## 🚀 Key Features

- **Interactive AI Recruiter Twin**: Built with a custom, secure server-side conversational agent helper using the contemporary Google Gemini AI integration to answer recruiter and technical queries based directly on professional experience telemetry data.
- **Security Operations Dashboard (SIEM simulation)**: Active container threat analysis tools, mock threat mitigation simulations, subnet quarantines, and live container metrics tracking.
- **Universal Translation Automation**: A simulated FastAPI container utility workbench to translate work details and subtitle logs on demand.
- **Universal Responsiveness & Adaptive Theme**: Highly polished, custom theme modes (eye-safe Dark Slate / Minimal Sky Blue Light theme) featuring a layout with high-contrast accessibility and fluent responsive breakpoints.

---

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vite.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Animation**: [Motion](https://motion.dev/) (advanced reactive animations) and [Lucide React Icons](https://lucide.dev/)
- **Backend & Middleware**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) configuration with server-side proxy handlers for complete security of credentials.
- **AI Integrations**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
- **Tooling**: TypeScript, esbuild bundling, tsx, and dynamic build orchestration pipelines.

---

## ⚙️ Project Architecture & Security

To maintain strict security standards and prevent any API key leakage, this project is architected with a strict separation between client and server layers:
- **Server-Side API Proxy**: The Gemini API keys are accessed solely in `server.ts` via server-side process environments. No credentials are ever exposed to the client-side browser bundle.
- **Environmental Safety**: Local settings and API keys are stored in a `.env` file, which is listed inside `.gitignore` so it is never committed or pushed to public code repositories on GitHub.

---

## 📦 How to Setup & Run Locally

### 1. Prerequisites
Ensure you have **Node.js (version 18 or higher)** and npm installed.

### 2. Install Dependencies
Clone the repository and run:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your secret Gemini key:
```env
# .env
GEMINI_API_KEY=your_actual_sec_api_key_here
```
*(The `.env` file is automatically ignored by Git to secure your secrets).*

### 4. Run Development Server
Boot both the Express API and the Vite React frontend concurrently:
```bash
npm run dev
```
The server will bind to port `3000`. Open `http://localhost:3000` in your browser.

---

## 🏗️ Production Build & Porting

To compile the application for high-performance production hosting (e.g., Cloud Run, AWS, VPS, or Vercel):

### Build Static Assets & Server Bundle
```bash
npm run build
```
This builds your React application to the `dist/` directory and compiles your Express backend into a single, self-contained `dist/server.cjs` file using `esbuild`.

### Run Production Server
```bash
npm run start
```

---

## 📄 License
All rights enforced. Developed by **Afshin Saberi**.
