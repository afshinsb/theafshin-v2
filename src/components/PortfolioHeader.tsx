import { Github, Linkedin, Mail, Moon, Sparkles, Sun } from "lucide-react";
import { PERSONAL_INFO } from "../data";

export type PortfolioTab = "overview" | "experience" | "chat";
const tabs = [
  { name: "Overview", id: "overview" },
  { name: "Experience", id: "experience" },
  { name: "Recruiter Q&A", id: "chat" },
] as const;

type Props = {
  activeTab: PortfolioTab;
  onNavigate: (tab: PortfolioTab) => void;
  dark: boolean;
  onToggleTheme: () => void;
};

export function PortfolioHeader({ activeTab, onNavigate, dark, onToggleTheme }: Props) {
  return (
    <header className="portfolio-header">
      <div className="portfolio-shell header-grid">
        <button type="button" className="portfolio-brand" onClick={() => onNavigate("overview")} aria-label="Afshin Saberi, overview">
          <span className="portfolio-mark" aria-hidden="true"><i /><i /><i /></span>
          {PERSONAL_INFO.name.toUpperCase()}
        </button>
        <nav className="portfolio-nav" aria-label="Portfolio">
          {tabs.map(({ name, id }) => (
            <button key={id} type="button" id={`tab-${id}`} aria-current={activeTab === id ? "page" : undefined} onClick={() => onNavigate(id)}>
              {id === "chat" && <Sparkles size={15} aria-hidden="true" />}
              {name}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="header-icon" id="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Dark mode" aria-pressed={dark}>
            {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>
          <a className="header-icon" id="link-email" href={`mailto:${PERSONAL_INFO.email}`} aria-label="Email Afshin"><Mail size={17} aria-hidden="true" /></a>
          <a className="header-icon header-profile" id="link-github" href={PERSONAL_INFO.github} aria-label="GitHub profile"><Github size={17} aria-hidden="true" /></a>
          <a className="header-icon header-profile" id="link-linkedin" href={PERSONAL_INFO.linkedin} aria-label="LinkedIn profile"><Linkedin size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </header>
  );
}
