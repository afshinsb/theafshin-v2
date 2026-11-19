/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  turnstile?: {
    render: (
      container: string | HTMLElement,
      options: {
        sitekey: string;
        callback: (token: string) => void;
        theme?: "auto" | "light" | "dark";
        size?: "compact" | "flexible";
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
      },
    ) => string;
    reset: (widget?: string | HTMLElement) => void;
    remove: (widget: string) => void;
  };
}
