import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.ts",
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:4191",
    reducedMotion: "reduce",
    colorScheme: "light",
    launchOptions: { executablePath: process.env.PORTFOLIO_CHROMIUM_EXECUTABLE },
  },
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4191 --strictPort",
    url: "http://127.0.0.1:4191/",
    env: { VITE_TURNSTILE_SITE_KEY: "1x00000000000000000000AA" },
    timeout: 90000,
  },
});
