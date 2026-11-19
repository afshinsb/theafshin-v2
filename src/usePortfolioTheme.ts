import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function readPreference(): Theme | null {
  const theme = document.documentElement.dataset.theme;
  return theme === "light" || theme === "dark" ? theme : null;
}

export function usePortfolioTheme() {
  const [preference, setPreference] = useState(readPreference);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const dark = preference ? preference === "dark" : systemDark;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#10111b" : "#f7f8fd");
  }, [dark]);

  function toggleTheme() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setPreference(next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      // Apply the setting for the current visit when storage is unavailable.
    }
  }

  return { dark, toggleTheme };
}
