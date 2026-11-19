import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

type Theme = "dark" | "light";
const sections = [["Projects", "#work"], ["About", "#about"], ["AI assistant", "#assistant"], ["Contact", "#contact"]];

export function Brand() {
  return <a className="brand" href="/" aria-label="Afshin Saberi homepage">
    <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
    <span>Afshin Saberi</span>
  </a>;
}

export function SiteHeader({ home }: { home: boolean }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" :
      document.documentElement.dataset.theme === "light" ? "light" : media.matches ? "dark" : "light");
    read();
    media.addEventListener("change", read);
    return () => media.removeEventListener("change", read);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Optional preference. */ }
    setTheme(next);
  }

  return <header className="site-header" onKeyDown={(event) => {
    if (event.key === "Escape" && open) {
      setOpen(false);
      document.getElementById("menu-button")?.focus();
    }
  }}>
    <div className="shell nav-shell">
      <Brand />
      <nav className={open ? "main-nav nav-open" : "main-nav"} id="primary-nav" aria-label="Main navigation">
        {sections.map(([label, href]) => <a key={href} href={(home ? "" : "/") + href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="nav-actions">
        <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle color theme" aria-pressed={theme === "dark"}>
          <Moon className="theme-moon" size={18} aria-hidden="true" /><Sun className="theme-sun" size={18} aria-hidden="true" />
        </button>
        <button className="icon-button menu-toggle" id="menu-button" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="primary-nav">
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
    </div>
  </header>;
}
