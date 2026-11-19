import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import {
  Shield,
  Terminal,
  Mail,
  Github,
  Send,
  CheckCircle,
  AlertCircle,
  Code,
  GraduationCap,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { EDUCATION, PERSONAL_INFO, WORK_EXPERIENCE, PROJECTS, SKILL_CATEGORIES, SUGGESTED_QUESTIONS } from "./data";
import type { ChatMessage, ProjectData } from "./types";
import { OverviewHero } from "./components/OverviewHero";
import { PortfolioHeader, type PortfolioTab } from "./components/PortfolioHeader";
import { usePortfolioTheme } from "./usePortfolioTheme";

const Markdown = lazy(() => import("react-markdown"));
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const PUBLIC_EMAIL_LINK = `mailto:${PERSONAL_INFO.email}`;
const CHAT_WELCOME = "Ask about Afshin’s applied AI projects, Python and backend development, systems background, or fit for roles in Toronto and across Canada.";
const SKILL_ICONS = [Sparkles, Code, Terminal, Shield];

function TurnstileWidget({
  onVerify,
  theme,
}: {
  onVerify: (token: string) => void;
  theme: "light" | "dark";
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !containerRef.current) return;
    onVerify("");

    let widgetId = "";
    const interval = window.setInterval(() => {
      if (!containerRef.current || !window.turnstile || widgetId) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: onVerify,
        theme,
        size: containerRef.current.clientWidth < 300 ? "compact" : "flexible",
        "expired-callback": () => onVerify(""),
        "error-callback": () => onVerify(""),
      });
      window.clearInterval(interval);
    }, 250);

    return () => {
      window.clearInterval(interval);
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [theme, onVerify]);

  if (!TURNSTILE_SITE_KEY) {
    return <p className="text-sm text-muted">The form is unavailable here. You can <a className="text-accent underline" href={PUBLIC_EMAIL_LINK}>email Afshin directly</a>.</p>;
  }

  return <div ref={containerRef} className="min-h-[65px]" />;
}

function safeMarkdownUrl(url: string) {
  const trimmed = url.trim();
  const protocolMatch = /^([a-z][a-z0-9+.-]*):/i.exec(trimmed);
  if (!protocolMatch) return trimmed;

  const protocol = protocolMatch[1].toLowerCase();
  return ["http", "https"].includes(protocol) || trimmed === PUBLIC_EMAIL_LINK ? trimmed : "";
}

const t = {
  bg: "min-h-screen bg-page text-ink font-sans selection:bg-accent-soft",
  smallCard: "border border-line bg-surface shadow-panel",
  subCardOverlay: "bg-surface border-accent/50 shadow-panel",
  textMuted: "text-muted",
  textTitle: "text-ink",
  badge: "bg-surface-soft text-muted border-line",
  input: "bg-page border-field-line text-ink focus:border-accent placeholder:text-muted",
  bullet: "text-accent",
  divider: "bg-line",
  btnSec: "bg-surface hover:bg-surface-soft text-ink border-line",
  iconAccent: "text-accent",
  subTextAccent: "text-accent font-semibold",
  pinger: "bg-accent",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<PortfolioTab>("overview");
  const { dark, toggleTheme } = usePortfolioTheme();
  const reduceMotion = useReducedMotion();
  const panelMotion = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 9 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0 : 0.18 },
  };

  function navigate(tab: PortfolioTab) {
    if (tab !== activeTab) setActiveTab(tab);
    if (window.location.hash) window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  // AI Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: CHAT_WELCOME,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);
  const setChatLog = useCallback((node: HTMLDivElement | null) => {
    chatLogRef.current = node;
    if (node) node.scrollTop = node.scrollHeight;
  }, []);

  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", message: "", website: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "success" | "error">("idle");
  const [contactError, setContactError] = useState("");
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactTurnstileToken, setContactTurnstileToken] = useState("");
  const [contactChallenge, setContactChallenge] = useState(0);

  useEffect(() => {
    if (TURNSTILE_SITE_KEY && !document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Autoscroll Chat
  useEffect(() => {
    const log = chatLogRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, isAiTyping]);

  // Handle Send Chat
  const handleSendChat = async (textToSend?: string) => {
    const rawMsg = textToSend || inputText;
    if (!rawMsg.trim()) return;

    if (rawMsg.trim().length > 700) {
      const validationMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: "Please keep questions under 700 characters.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, validationMessage]);
      return;
    }

    if (!textToSend) setInputText("");

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: rawMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAiTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: rawMsg
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The AI chat is temporarily unavailable.");
      }

      const botMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: data.text || `You can reach Afshin through the contact form or at [${PERSONAL_INFO.email}](${PUBLIC_EMAIL_LINK}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: `${err?.message || "The AI chat is temporarily unavailable."}\n\nFor professional inquiries, email [${PERSONAL_INFO.email}](${PUBLIC_EMAIL_LINK}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Send contact form through the server-side email endpoint.
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitting(true);
    setContactStatus("idle");
    setContactError("");

    if (!contactTurnstileToken) {
      setContactStatus("error");
      setContactError("Please complete the verification before sending.");
      setIsContactSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contactForm, turnstileToken: contactTurnstileToken }),
      });
      const responseText = await response.text();
      let data: { error?: string; ok?: boolean } = {};
      const contentType = response.headers.get("content-type") || "";

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          const isHtmlFallback = responseText.trimStart().toLowerCase().startsWith("<!doctype")
            || contentType.toLowerCase().includes("text/html");
          console.warn("contact_api_unreadable_response", {
            status: response.status,
            contentType,
            htmlFallback: isHtmlFallback,
          });
          throw new Error(isHtmlFallback
            ? "Contact API route is not available in this deployment."
            : "Contact API returned an unreadable response.");
        }
      }

      if (!response.ok) {
        console.warn("contact_api_error_response", {
          status: response.status,
          contentType,
          body: data,
        });
        throw new Error(data.error || "Unable to send the message.");
      }

      setContactStatus("success");
      setContactForm({ name: "", email: "", company: "", message: "", website: "" });
    } catch (err: any) {
      setContactStatus("error");
      setContactError(err.message || "Unable to send the message.");
    } finally {
      setContactTurnstileToken("");
      setContactChallenge((attempt) => attempt + 1);
      setIsContactSubmitting(false);
    }
  };

  return (
    <div className={t.bg + " flex flex-col"}>

      <a className="skip-to-content" href="#main-content">Skip to content</a>
      <PortfolioHeader activeTab={activeTab} onNavigate={navigate} dark={dark} onToggleTheme={toggleTheme} />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
          {/* Overview Content */}
          {activeTab === "overview" && (
            <motion.div key="overview" id="content-overview" {...panelMotion}>
              <OverviewHero onOpenChat={() => {
                navigate("chat");
                document.getElementById("tab-chat")?.focus({ preventScroll: true });
              }} />
              <div className="portfolio-shell overview-content">
                {/* Featured projects and recruiter contact */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                  {/* Featured Projects Column */}
                  <section id="projects" aria-labelledby="projects-title" className="lg:col-span-8 min-w-0 space-y-5">
                    <div>
                      <h2 id="projects-title" className="section-title">Selected projects</h2>
                      <p className="text-muted mt-2">How I handle model output, build backend workflows, and verify changes.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(PROJECTS).map(([key, project]: [string, ProjectData]) => (
                        <article key={key} id={key === "subtitleTranslator" ? "subtitle-translator" : undefined} className={"p-5 sm:p-6 rounded-xl space-y-4 min-w-0 " + t.smallCard + (key === "subtitleTranslator" ? " sm:col-span-2" : "")}>
                          <div>
                            <h3 className={"text-lg font-semibold leading-snug " + t.textTitle}>{project.title}</h3>
                            <p className={"text-xs font-mono " + t.subTextAccent}>{project.subtitle}</p>
                          </div>
                          <div className={"space-y-2 text-[.94rem] leading-relaxed " + t.textMuted}>
                            <p>{project.description}</p>
                            {project.details && <p>{project.details}</p>}
                          </div>
                          <ul aria-label="Technologies" className="flex flex-wrap gap-1.5">
                            {project.tech.map((tech) => (
                              <li key={tech} className={"px-2 py-0.5 rounded border text-[11px] font-mono " + t.badge}>{tech}</li>
                            ))}
                          </ul>
                          {(project.githubUrl || project.evidence) && <div className="flex flex-wrap gap-3">
                            {project.githubUrl && <a href={project.githubUrl} className="project-link" aria-label={"GitHub for " + project.title}><Github size={17} aria-hidden="true" /> GitHub</a>}
                            {project.evidence && <a className="project-link" href={project.evidence.url}>{project.evidence.label}</a>}
                          </div>}
                        </article>
                      ))}
                    </div>
                  </section>

                  {/* Recruiter contact */}
                  <section aria-labelledby="contact-title" className="lg:col-span-4 min-w-0 space-y-5">
                    <h2 id="contact-title" className="section-title contact-title">Recruiter contact</h2>
                    <div className={"p-5 rounded-xl space-y-4 relative " + t.smallCard}>
                      <p className="text-muted text-sm">I’m looking for applied AI and Python roles in Toronto or remotely across Canada.</p>
                      <a href={PUBLIC_EMAIL_LINK} className={"inline-block text-sm hover:underline " + t.subTextAccent}>{PERSONAL_INFO.email}</a>

                      <form onSubmit={handleContactSubmit} className="space-y-3.5">
                        <div>
                          <label htmlFor="contact-name" className="block text-sm font-semibold text-ink mb-1">Name</label>
                          <input
                            id="contact-name"
                            type="text"
                            autoComplete="name"
                            required
                            maxLength={80}
                            value={contactForm.name}
                            onChange={(e) => {
                              setContactStatus("idle");
                              setContactForm({ ...contactForm, name: e.target.value });
                            }}
                            className={"w-full min-w-0 border rounded-lg px-3 py-2 text-base transition " + t.input}
                            placeholder="Your name"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="contact-email" className="block text-sm font-semibold text-ink mb-1">Email</label>
                            <input
                              id="contact-email"
                              type="email"
                              autoComplete="email"
                              required
                              maxLength={120}
                              value={contactForm.email}
                              onChange={(e) => {
                                setContactStatus("idle");
                                setContactForm({ ...contactForm, email: e.target.value });
                              }}
                              className={"w-full min-w-0 border rounded-lg px-3 py-2 text-base transition " + t.input}
                              placeholder="Your work email"
                            />
                          </div>
                          <div>
                            <label htmlFor="contact-company" className="block text-sm font-semibold text-ink mb-1">Company <span className="font-normal text-muted">(optional)</span></label>
                            <input
                              id="contact-company"
                              type="text"
                              autoComplete="organization"
                              maxLength={120}
                              value={contactForm.company}
                              onChange={(e) => {
                                setContactStatus("idle");
                                setContactForm({ ...contactForm, company: e.target.value });
                              }}
                              className={"w-full min-w-0 border rounded-lg px-3 py-2 text-base transition " + t.input}
                              placeholder="Company name"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="contact-message" className="block text-sm font-semibold text-ink mb-1">Message</label>
                          <textarea
                            id="contact-message"
                            rows={3}
                            required
                            maxLength={1500}
                            value={contactForm.message}
                            onChange={(e) => {
                              setContactStatus("idle");
                              setContactForm({ ...contactForm, message: e.target.value });
                            }}
                            className={"w-full border rounded px-3 py-2 text-base transition resize-none " + t.input}
                            placeholder="Tell me about the role or what you would like to discuss..."
                          ></textarea>
                        </div>

                        <div className="hidden" aria-hidden="true">
                          <label>
                            Website
                            <input
                              type="text"
                              tabIndex={-1}
                              autoComplete="off"
                              value={contactForm.website}
                              onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                            />
                          </label>
                        </div>

                        <TurnstileWidget key={contactChallenge} onVerify={setContactTurnstileToken} theme={dark ? "dark" : "light"} />

                        <p className={"text-[10px] leading-relaxed " + t.textMuted}>
                          To prevent abuse, this form may use basic technical metadata such as IP address, request timing, and verification status.
                        </p>

                        <button
                          type="submit"
                          disabled={isContactSubmitting || !contactTurnstileToken}
                          className="w-full site-button site-button-primary disabled:opacity-60"
                        >
                          {isContactSubmitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                          {isContactSubmitting ? "Sending..." : "Send Hiring Inquiry"}
                        </button>
                      </form>

                      <AnimatePresence>
                        {contactStatus === "success" && (
                          <motion.div
                            {...panelMotion}
                            role="status"
                            className={"absolute inset-0 flex flex-col items-center justify-center p-4 rounded-xl text-center space-y-2 border " + t.subCardOverlay}
                          >
                            <CheckCircle className={"h-8 w-8 " + t.iconAccent} />
                            <h5 className={"text-sm font-semibold " + t.textTitle}>Message Sent</h5>
                            <p className={"text-xs max-w-xs leading-relaxed " + t.textMuted}>
                              Your inquiry has been sent. You can also reach Afshin at <a href={PUBLIC_EMAIL_LINK} className="underline">{PERSONAL_INFO.email}</a>.
                            </p>
                            <button
                              type="button"
                              onClick={() => setContactStatus("idle")}
                              className={"px-3 py-1.5 rounded text-[10px] font-mono border " + t.btnSec}
                            >
                              Close
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {contactStatus === "error" && (
                        <div role="alert" className="p-3 rounded border text-sm leading-relaxed form-error">
                          {contactError}
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Skill Matrix Segment */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-mono uppercase text-muted tracking-wider">Technical Skills</h2>
                    <div className={"h-px flex-1 ml-4 " + t.divider}></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {SKILL_CATEGORIES.map((cat, idx) => {
                      const Icon = SKILL_ICONS[idx];
                      return (
                      <div key={cat.title} className={t.smallCard + " p-5 rounded-xl transition duration-200 hover:border-accent/50"}>
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className={"h-4 w-4 " + t.iconAccent} />
                          <h3 className={"text-sm font-semibold " + t.textTitle}>{cat.title}</h3>
                        </div>
                        <ul className="space-y-1.5 text-xs">
                          {cat.skills.map((skill, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5">
                              <span className={t.bullet + " mt-0.5"}>•</span>
                              <span className={t.textMuted}>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

           {/* AI Chat View */}
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              id="content-chat"
              {...panelMotion}
              className="portfolio-shell tab-content chat-layout grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8"
            >
              {/* Suggestion Sidebar panel */}
              <div className={"order-2 lg:order-1 lg:col-span-4 p-5 rounded-xl flex flex-col justify-between space-y-4 " + t.smallCard}>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className={"h-4.5 w-4.5 " + t.iconAccent} />
                    <h1 className={"text-lg font-semibold " + t.textTitle}>Ask about Afshin</h1>
                  </div>
                  <p className={"text-xs leading-relaxed mb-6 " + t.textMuted}>
                    Ask how the subtitle translator recovers missing cues, how AI Rail verifies changes, or what Afshin learned troubleshooting Windows and Linux systems.
                  </p>

                    <h4 className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">Suggested Questions</h4>
                  <div className="space-y-2">
                    {SUGGESTED_QUESTIONS.map((q, qidx) => (
                      <button
                        key={qidx}
                        onClick={() => handleSendChat(q)}
                        disabled={isAiTyping}
                        className={"w-full min-h-11 text-left p-2.5 text-sm font-sans border rounded-md transition duration-150 flex items-center justify-between cursor-pointer disabled:opacity-50 " + t.input}
                      >
                        <span>{q}</span>
                        <Send className={"h-2.5 w-2.5 text-muted transition"} />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Central Chat Node */}
              <div className={"order-1 lg:order-2 lg:col-span-8 flex flex-col rounded-xl min-w-0 overflow-hidden chat-panel " + t.smallCard}>

                {/* Chat Panel Header */}
                <div className="px-4 py-3 border-b flex items-center justify-between bg-surface-soft border-line">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-2.5 w-2.5 rounded-full animate-pulse bg-accent"></div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted">Recruiter Q&A</span>
                  </div>
                  <button
                    onClick={() => setMessages([
                      {
                        id: "welcome",
                        sender: "ai",
                        text: CHAT_WELCOME,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ])}
                    className={"p-1 px-2 text-[10px] uppercase font-mono rounded border transition cursor-pointer " + t.btnSec}
                  >
                    Clear Chat
                  </button>
                </div>

                {/* Messages Hub */}
                <div ref={setChatLog} role="log" aria-label="Conversation" tabIndex={0} className="chat-log flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={"flex " + (m.sender === "user" ? "justify-end" : "justify-start")}
                    >
                      <div className={"max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed " + (
                        m.sender === "user"
                          ? "bg-accent-soft text-ink"
                          : "bg-page text-ink border border-line" + " select-text"
                      )}>

                        <div className={"font-mono text-[9px] mb-1 leading-none uppercase tracking-wider " + (m.sender === "user" ? "text-accent" : "text-muted")}>
                          {m.sender === "user" ? "You" : "Portfolio Assistant"} • {m.timestamp}
                        </div>

                        {m.sender === "user" ? (
                          <p className="whitespace-pre-wrap wrap-anywhere">{m.text}</p>
                        ) : (
                          <div className="markdown-body select-text wrap-anywhere">
                            <Suspense fallback={<p>{m.text}</p>}>
                              <Markdown urlTransform={safeMarkdownUrl}>{m.text}</Markdown>
                            </Suspense>
                          </div>
                        )}

                      </div>
                    </div>
                  ))}

                  {isAiTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-xl px-4 py-3 text-xs border flex items-center space-x-2 bg-page text-muted border-line">
                        <span className="text-[10px] font-mono text-muted uppercase">Finding an answer</span>
                        <span className="flex space-x-1">
                          <span className={"h-1.5 w-1.5 rounded-full animate-bounce " + t.pinger} style={{ animationDelay: '0ms' }}></span>
                          <span className={"h-1.5 w-1.5 rounded-full animate-bounce " + t.pinger} style={{ animationDelay: '150ms' }}></span>
                          <span className={"h-1.5 w-1.5 rounded-full animate-bounce " + t.pinger} style={{ animationDelay: '300ms' }}></span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Input Area */}
                <div className="p-3.5 border-t bg-surface-soft border-line">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                      disabled={isAiTyping}
                      maxLength={700}
                      className={"min-w-0 flex-1 border rounded-lg px-3 py-2 text-base transition disabled:opacity-50 " + t.input}
                      aria-label="Question"
                      placeholder="Ask about Python projects, LLMs, or role fit"
                    />
                    <button
                      onClick={() => handleSendChat()}
                      disabled={isAiTyping || !inputText.trim()}
                      aria-label="Send question"
                      className="site-button site-button-primary shrink-0 disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Career Path Timeline */}
          {activeTab === "experience" && (
            <motion.div
              key="experience"
              id="content-experience"
              {...panelMotion}
              className="portfolio-shell tab-content grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
            >
              {/* Credentials / Education profile column */}
              <div className="lg:col-span-4 space-y-6">

                <div className={t.smallCard + " p-5 rounded-xl space-y-4"}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className={"h-5 w-5 " + t.iconAccent} />
                      <div>
                        <h3 className={"text-sm font-semibold " + t.textTitle}>{EDUCATION.degree}</h3>
                        <p className={"text-[11px] font-mono " + t.subTextAccent}>{EDUCATION.institution} · {EDUCATION.period}</p>
                      </div>
                    </div>
                    <span className={"px-2 py-1 rounded border text-[10px] font-mono shrink-0 " + t.badge}>ISS</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {[
                      ["INSE 6120", "Crypto-Protocol & Network Security"],
                      ["INSE 6130", "Operating Systems Security"],
                      ["INSE 6630", "Blockchain Technology"],
                      ["INSE 6150", "Security Evaluation Methodologies"]
                    ].map(([code, title]) => (
                      <div key={code} className="flex items-center justify-between gap-3 rounded border px-3 py-2 bg-page border border-line">
                        <span className={"text-[10px] font-mono " + t.subTextAccent}>{code}</span>
                        <span className={"text-[11px] text-right " + t.textMuted}>{title}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs leading-relaxed pt-2 border-t border-line text-muted">
                    {EDUCATION.focus}
                  </p>
                </div>

                <div className={t.smallCard + " p-5 rounded-xl space-y-4"}>
                  <h3 className="text-xs font-mono uppercase text-muted tracking-wider">Transferable Skills</h3>

                  {SKILL_CATEGORIES.slice(3).map((cat, sidx) => (
                    <div key={sidx} className="space-y-4">
                      <h4 className="text-xs font-bold flex items-center gap-1.5 uppercase text-muted">
                        {cat.title}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((skill, skIdx) => (
                          <span key={skIdx} className={"px-2 py-0.5 rounded text-[10px] font-sans border " + t.badge}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Dynamic work history timelining */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="section-title">Professional experience</h1>
                </div>

                <p className="text-muted">I managed Microsoft 365 access, investigated incidents through logs, and maintained Windows and Linux systems. That work shapes how I build applications that are easier to diagnose and recover.</p>
                <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-line">
                  {WORK_EXPERIENCE.map((job) => (
                    <div key={job.id} className="relative pl-10 group">

                      {/* Timeline Node Selector */}
                      <span className="absolute left-1.5 top-1.5 h-4 w-4 rounded-full border flex items-center justify-center transition group-hover:scale-110 duration-200 bg-surface border-accent">
                        <span className="h-1.5 w-1.5 rounded-full transition bg-accent"></span>
                      </span>

                      <div className={t.smallCard + " p-5 rounded-xl space-y-3 transition hover:border-accent/50"}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className={"text-base font-semibold " + t.textTitle}>{job.role}</h4>
                            <p className={"text-xs font-mono " + t.subTextAccent}>{job.company}{job.location ? " — " + job.location : ""}</p>
                          </div>
                          <span className={"px-2.5 py-1 text-[10px] font-mono font-medium rounded-md border " + t.badge}>
                            {job.period}
                          </span>
                        </div>

                        <ul className="space-y-2 text-xs">
                          {job.bullets.map((bullet, bidx) => (
                            <li key={bidx} className="flex items-start gap-1.5">
                              <span className={t.bullet + " font-mono leading-none mt-1"}>•</span>
                              <span className={"leading-relaxed " + t.textMuted}>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Modern Professional Footer */}
      <footer className="mt-auto border-t bg-surface border-line text-muted">
        <div className="portfolio-shell py-6 text-xs">
          <div className="flex flex-col gap-2 text-center text-xs sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <span>© {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.</span>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <a href={PUBLIC_EMAIL_LINK} className="hover:underline">{PERSONAL_INFO.email}</a>
              <a href={PERSONAL_INFO.github} className="hover:underline">GitHub</a>
              <a href={PERSONAL_INFO.linkedin} className="hover:underline">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
