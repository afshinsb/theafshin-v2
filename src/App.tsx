import React, { useState, useRef, useEffect } from "react";
import { 
  Shield, 
  ShieldAlert, 
  Lock, 
  Network, 
  Server, 
  Terminal, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  ExternalLink, 
  Send, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Code, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  RefreshCw, 
  Play, 
  Trash2, 
  Search, 
  Layers,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";

import { PERSONAL_INFO, WORK_EXPERIENCE, PROJECTS, SKILL_CATEGORIES, SUGGESTED_QUESTIONS } from "./data";
import { ChatMessage } from "./types";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"overview" | "chat" | "experience" | "labs">("overview");

  // Theme Management
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("portfolio-theme");
    return saved !== null ? saved === "dark" : true;
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("portfolio-theme", next ? "dark" : "light");
      return next;
    });
  };

  const t = {
    bg: isDarkMode ? "min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-400 transition-colors duration-200" : "min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-sky-100 selection:text-sky-900 transition-colors duration-200",
    header: isDarkMode ? "border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-50 backdrop-blur-md" : "border-b border-zinc-200 bg-white/90 sticky top-0 z-50 backdrop-blur-md shadow-xs",
    headerText: isDarkMode ? "text-white" : "text-zinc-900",
    card: isDarkMode ? "border border-zinc-800 bg-linear-to-b from-zinc-900 to-zinc-950" : "border border-zinc-200 bg-linear-to-b from-white to-zinc-100/70 shadow-xs",
    smallCard: isDarkMode ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-zinc-250/60 shadow-2xs",
    subCard: isDarkMode ? "bg-zinc-900/40 p-5 rounded-xl border border-zinc-800" : "bg-white p-5 rounded-xl border border-zinc-250/60 shadow-sm",
    subCardOverlay: isDarkMode ? "bg-zinc-950/95 border-emerald-500/30" : "bg-white/98 border-sky-300/30 shadow-md",
    textMuted: isDarkMode ? "text-zinc-400" : "text-zinc-650",
    textTitle: isDarkMode ? "text-white" : "text-zinc-900",
    badge: isDarkMode ? "bg-zinc-800 text-zinc-300 border border-zinc-700/60" : "bg-zinc-150 text-zinc-800 border border-zinc-300/75",
    tabBg: isDarkMode ? "bg-zinc-950 p-1 border border-zinc-800" : "bg-zinc-200/90 p-1 border border-zinc-300/85",
    input: isDarkMode ? "bg-zinc-950 border border-zinc-800 focus:border-zinc-700 text-zinc-200" : "bg-white border border-zinc-300 focus:border-sky-500 text-zinc-900 focus:ring-1 focus:ring-sky-500",
    codeBlock: isDarkMode ? "bg-zinc-950 border border-zinc-900 text-zinc-450 text-[10px]" : "bg-zinc-100 border border-zinc-250 text-zinc-850 text-[10px]",
    bullet: isDarkMode ? "text-emerald-500" : "text-[#0284c7]",
    textHeading: isDarkMode ? "text-zinc-400" : "text-zinc-700",
    divider: isDarkMode ? "bg-zinc-800" : "bg-zinc-250",
    btnSec: isDarkMode ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300",
    tabAct: isDarkMode ? "bg-zinc-800 text-white border-zinc-700" : "bg-white text-zinc-900 border-zinc-300/80 shadow-xs",
    tabInact: isDarkMode ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-550 hover:text-zinc-900",

    // Responsive Accents
    iconAccent: isDarkMode ? "text-emerald-500" : "text-[#0284c7]",
    subTextAccent: isDarkMode ? "text-emerald-400" : "text-[#0284c7] font-semibold",
    textLinkHover: isDarkMode ? "hover:text-emerald-400" : "hover:text-sky-700",
    borderLinkHover: isDarkMode ? "hover:border-emerald-900/40" : "hover:border-sky-400",
    pinger: isDarkMode ? "bg-emerald-500" : "bg-[#0284c7]",
    bgLinkAccent: isDarkMode ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950" : "bg-[#0284c7] hover:bg-[#0369a1] text-white"
  };

  // AI Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Hello there! I am **Afshin's AI Assistant (AI Twin)**. \n\nI am fully trained on Afshin's professional qualifications, master's degree research, and 8+ years of security, network administration, and DevOps experience. \n\nFeel free to ask me anything about his credentials, ask details about his specific projects, or click one of the suggested questions below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Subtitle Translator Lab States
  const [subtitleText, setSubtitleText] = useState<string>(
    `1\n00:00:01,500 --> 00:00:04,800\nWe must maintain high-security firewalls and automated DevOps.\n\n2\n00:00:05,100 --> 00:00:09,200\nDocker containers provide excellent replication and isolation.`
  );
  const [targetLang, setTargetLang] = useState("French");
  const [translationLogs, setTranslationLogs] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedResult, setTranslatedResult] = useState<string>("");

  // Wireshark Incident Lab States
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [triageStep, setTriageStep] = useState<"select" | "investigate" | "mitigate" | "resolved">("select");
  const [mitigationLogs, setMitigationLogs] = useState<string[]>([]);
  const [isMitigating, setIsMitigating] = useState(false);

  // Contact Form (Client Simulation)
  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Autoscroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  // Handle Send Chat
  const handleSendChat = async (textToSend?: string) => {
    const rawMsg = textToSend || inputText;
    if (!rawMsg.trim()) return;

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
          message: rawMsg,
          history: messages.map(m => ({ sender: m.sender === "user" ? "user" : "model", text: m.text }))
        })
      });

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: data.text || data.error || "I processed your request, but did not receive structured feedback. Please connect directly at contact@theafshin.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: "**Connection Offline**: There was a network issue querying the AI system. You can connect with Afshin directly at **contact@theafshin.com**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Run Subtitle Translation Call with simulation log pacing
  const handleTranslateSubtitle = async () => {
    if (!subtitleText.trim() || isTranslating) return;
    setIsTranslating(true);
    setTranslationLogs([]);
    setTranslatedResult("");

    const logs = [
      "🔄 Initializing container workload environment...",
      "🐳 Docker worker container ID [sub-9428-fasp] provisioned dynamically",
      "🔑 Validating default environment authentication parameters: PASSED",
      "📝 SQLite history state record instantiated",
      "📂 Injecting raw SRT subtitle buffers into container pipeline...",
      "🤖 Executing secure translation API pipeline with server-side AI..."
    ];

    // Simulated staggered logs for visual realism
    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setTranslationLogs(prev => [...prev, logs[i]]);
    }

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: subtitleText, targetLang })
      });
      const data = await response.json();
      
      if (data.translated) {
        setTranslationLogs(prev => [...prev, `✅ Translation success. Writing batch to stdout.`]);
        setTranslatedResult(data.translated);
      } else {
        throw new Error(data.error || "Blank response");
      }
    } catch (err: any) {
      setTranslationLogs(prev => [...prev, `❌ Pipeline failure: ${err.message || 'Server connection error'}`]);
      setTranslatedResult("/* TRANSLATION CONTAINER OFFLINE. CONTACT AFSHIN FOR THE SOURCE REPOSITORY. */");
    } finally {
      setIsTranslating(false);
    }
  };

  // Wireshark Incident Lab Logic
  const handleSelectIP = (ip: string) => {
    setSelectedIp(ip);
    if (ip === "198.51.100.22") {
      setTriageStep("investigate");
    } else {
      setTriageStep("select");
    }
  };

  const handleMitigateThreat = async () => {
    if (isMitigating) return;
    setIsMitigating(true);
    setMitigationLogs([]);

    const steps = [
      "🔍 Extracting anomalous packet payloads...",
      "⚠️ Matching signature: SYN Scanning + SQL Injection (OR 1=1 block detected)",
      "🛡️ Formulating defensive security orchestrations...",
      "⚙️ Injecting iptables command to drop ingress from 198.51.100.22...",
      "☁️ Transmitting Cloudflare edge filter blocking policy for 198.51.100.22...",
      "📬 Filing ticket incident SLA documentation under Security Operations...",
      "🎯 Infrastructure state normalized. Threat quarantined completely."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 750));
      setMitigationLogs(prev => [...prev, steps[i]]);
    }

    setIsMitigating(false);
    setTriageStep("resolved");
  };

  const handleResetIncident = () => {
    setSelectedIp(null);
    setTriageStep("select");
    setMitigationLogs([]);
  };

  // Simple clean message feedback
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({ name: "", email: "", company: "", message: "" });
    }, 4000);
  };

  return (
    <div className={t.bg}>
      
      {/* Structural Minimal Top Navbar */}
      <header className={t.header}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className={"w-10 h-10 rounded-lg border flex items-center justify-center font-mono " + 
              (isDarkMode 
                ? "bg-emerald-950/80 border-emerald-800/60 text-emerald-400" 
                : "bg-cyan-50 border border-cyan-200 text-[#0284c7] font-semibold text-base")}>
              {isDarkMode ? <Shield className="h-5 w-5" /> : <span>[ ]</span>}
            </div>
            <div>
              <h1 className={"text-lg font-semibold tracking-tight font-sans " + t.textTitle}>{PERSONAL_INFO.name}</h1>
              <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 leading-none">
                <span className={"h-2 w-2 rounded-full inline-block animate-pulse " + (isDarkMode ? "bg-emerald-500" : "bg-[#0284c7]")}></span>
                IT Security & Systems Administrator
              </span>
            </div>
          </div>

          {/* Desktop Tabs */}
          <nav className={"hidden md:flex space-x-1 p-1 rounded-lg " + t.tabBg}>
            <button 
              id="tab-overview"
              onClick={() => setActiveTab("overview")} 
              className={"px-4 py-1.5 text-xs font-medium rounded-md transition " + (activeTab === "overview" ? t.tabAct : t.tabInact)}
            >
              Command Center
            </button>
            <button 
              id="tab-experience"
              onClick={() => setActiveTab("experience")} 
              className={"px-4 py-1.5 text-xs font-medium rounded-md transition " + (activeTab === "experience" ? t.tabAct : t.tabInact)}
            >
              Career Timeline
            </button>
            <button 
              id="tab-labs"
              onClick={() => setActiveTab("labs")} 
              className={"px-4 py-1.5 text-xs font-medium rounded-md transition " + (activeTab === "labs" ? t.tabAct : t.tabInact)}
            >
              Interactive Labs
            </button>
            <button 
              id="tab-chat"
              onClick={() => setActiveTab("chat")} 
              className={"px-4 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1.5 " + (activeTab === "chat" ? t.tabAct : t.tabInact)}
            >
              <Sparkles className={"h-3 w-3 " + t.iconAccent} /> Ask AI Twin
            </button>
          </nav>

          {/* Contact Fast-link panel & Theme Toggle */}
          <div className="flex items-center space-x-2">
            <button 
              id="theme-toggle"
              onClick={toggleTheme}
              className={"p-2 rounded-lg border transition cursor-pointer " + (isDarkMode ? "text-zinc-400 border-zinc-850 bg-zinc-900/50 hover:bg-zinc-800 hover:text-zinc-200" : "text-zinc-500 border-zinc-300 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-850")}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <a 
              id="link-email"
              href={"mailto:" + PERSONAL_INFO.email} 
              className={"p-2 rounded-lg border transition " + (isDarkMode ? "text-zinc-400 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white" : "text-zinc-600 border-zinc-300 bg-zinc-100/80 hover:bg-zinc-200 hover:text-zinc-950")} 
              title="Send Direct Email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a 
              id="link-github"
              href={PERSONAL_INFO.github} 
              target="_blank" 
              referrerPolicy="no-referrer" 
              className={"p-2 rounded-lg border transition " + (isDarkMode ? "text-zinc-400 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white" : "text-zinc-600 border-zinc-300 bg-zinc-100/80 hover:bg-zinc-200 hover:text-zinc-950")}
              title="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>
            <a 
              id="link-linkedin"
              href={PERSONAL_INFO.linkedin} 
              target="_blank" 
              referrerPolicy="no-referrer" 
              className={"p-2 rounded-lg border transition " + (isDarkMode ? "text-zinc-400 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white" : "text-zinc-600 border-zinc-300 bg-zinc-100/80 hover:bg-zinc-200 hover:text-zinc-950")}
              title="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className={"md:hidden flex space-x-1 justify-around px-2 py-2 border-t border-b " + (isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-zinc-200 border-zinc-300 text-zinc-800")}>
          <button onClick={() => setActiveTab("overview")} className={"flex-1 py-1 text-center text-[10px] uppercase font-mono tracking-wider " + (activeTab === "overview" ? t.tabAct + " rounded" : t.tabInact)}>
            Command
          </button>
          <button onClick={() => setActiveTab("experience")} className={"flex-1 py-1 text-center text-[10px] uppercase font-mono tracking-wider " + (activeTab === "experience" ? t.tabAct + " rounded" : t.tabInact)}>
            Career
          </button>
          <button onClick={() => setActiveTab("labs")} className={"flex-1 py-1 text-center text-[10px] uppercase font-mono tracking-wider " + (activeTab === "labs" ? t.tabAct + " rounded" : t.tabInact)}>
            Labs
          </button>
          <button onClick={() => setActiveTab("chat")} className={"flex-1 py-1 text-center text-[10px] uppercase font-mono tracking-wider flex justify-center items-center gap-0.5 " + (activeTab === "chat" ? t.tabAct + " rounded" : t.tabInact)}>
            <Sparkles className={"h-2 w-2 " + t.iconAccent} /> AI
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Core Profile Banner - displayed on top level of Overview */}
        {activeTab === "overview" && (
          <div className={"mb-8 p-6 sm:p-8 rounded-2xl relative overflow-hidden " + t.card}>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Shield className={"h-64 w-64 " + t.iconAccent} />
            </div>
            
            <div className="max-w-3xl">
              <h2 className={"text-3xl sm:text-4xl font-semibold tracking-tight mb-4 " + t.textTitle}>
                Securing host infrastructure, optimizing hybrid systems.
              </h2>
              <p className={"text-sm leading-relaxed mb-6 " + t.textMuted}>
                {PERSONAL_INFO.summary}
              </p>

              <div className={"flex flex-wrap gap-4 text-xs font-mono " + (isDarkMode ? "text-zinc-400" : "text-zinc-600")}>
                <a 
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition " + t.textLinkHover + " " + (isDarkMode ? "bg-zinc-900/80 border-zinc-800 text-zinc-400 " + t.borderLinkHover : "bg-white border-zinc-250 text-zinc-700 shadow-2xs " + t.borderLinkHover)}
                >
                  <Linkedin className={"h-3.5 w-3.5 " + t.iconAccent} /> linkedin.com/in/theafshin
                </a>
                <a 
                  href={"mailto:" + PERSONAL_INFO.email}
                  className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition " + t.textLinkHover + " " + (isDarkMode ? "bg-zinc-900/80 border-zinc-800 text-zinc-400 " + t.borderLinkHover : "bg-white border-zinc-250 text-zinc-700 shadow-2xs " + t.borderLinkHover)}
                >
                  <Mail className={"h-3.5 w-3.5 " + t.iconAccent} /> {PERSONAL_INFO.email}
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button 
                  onClick={() => setActiveTab("chat")} 
                  className={"px-5 py-2.5 text-xs font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg " + 
                    (isDarkMode 
                      ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/25" 
                      : "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-sky-600/15")}
                >
                  <Sparkles className="h-4 w-4" /> Interview Afshin's AI Twin
                </button>
                <button 
                  onClick={() => setActiveTab("labs")} 
                  className={"px-5 py-2.5 text-xs font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer " + t.btnSec}
                >
                  <Terminal className="h-4 w-4" /> Experiment in Sandbox Labs
                </button>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Overview Content */}
          {activeTab === "overview" && (
            <motion.div 
              id="content-overview"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Performance Metrics Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className={t.smallCard + " p-5 rounded-xl flex flex-col justify-between"}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider">Expertise Age</span>
                    <Activity className={"h-4 w-4 " + t.iconAccent} />
                  </div>
                  <div>
                    <div className={"text-2xl font-bold font-mono mb-1 " + t.textTitle}>8+ Years</div>
                    <span className={t.textMuted + " text-xs"}>Systems & Network Security Ops</span>
                  </div>
                </div>

                <div className={t.smallCard + " p-5 rounded-xl flex flex-col justify-between"}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider">Education Level</span>
                    <GraduationCap className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div>
                    <div className={"text-xl font-bold font-sans mb-1 " + t.textTitle}>M.Eng (ISS)</div>
                    <span className={t.textMuted + " text-xs"}>Information Systems Security</span>
                  </div>
                </div>

                <div className={t.smallCard + " p-5 rounded-xl flex flex-col justify-between"}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider">Host Capabilities</span>
                    <Server className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <div className={"text-2xl font-bold font-mono mb-1 " + t.textTitle}>Linux & AWS</div>
                    <span className={t.textMuted + " text-xs"}>Docker, KVM, Shell, Cloud</span>
                  </div>
                </div>

                <div className={t.smallCard + " p-5 rounded-xl flex flex-col justify-between"}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider">Threat Minimization</span>
                    <Lock className="h-4 w-4 text-rose-500" />
                  </div>
                  <div>
                    <div className={"text-2xl font-bold font-mono mb-1 " + t.textTitle}>Zero Zero Trust</div>
                    <span className={t.textMuted + " text-xs"}>Firewalls, VPN logs, Tunnels</span>
                  </div>
                </div>

              </div>

              {/* Skill Matrix Segment */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono uppercase text-zinc-500 tracking-wider">Security Operations Matrix</h3>
                  <div className={"h-px flex-1 ml-4 " + t.divider}></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SKILL_CATEGORIES.slice(0, 3).map((cat, idx) => (
                    <div key={idx} className={t.smallCard + " p-5 rounded-xl transition duration-200 " + (isDarkMode ? "hover:border-emerald-500/50" : "hover:border-[#0284c7]/40")}>
                      <div className="flex items-center gap-2 mb-3">
                        {idx === 0 ? <ShieldAlert className={"h-4 w-4 " + t.iconAccent} /> : idx === 1 ? <Lock className="h-4 w-4 text-cyan-500" /> : <Network className="h-4 w-4 text-amber-500" />}
                        <h4 className={"text-sm font-semibold " + t.textTitle}>{cat.title}</h4>
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
                  ))}
                </div>
              </div>

              {/* Profile Dashboard Row: Core Projects & Mock Ticketing System */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Featured Projects Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-lighter">Featured Engineering Work</h3>
                    <span onClick={() => setActiveTab("labs")} className={"text-xs font-mono hover:underline transition cursor-pointer flex items-center gap-1 " + t.subTextAccent + " " + t.textLinkHover}>
                      Run Live Demos <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>

                  {PROJECTS.map((proj) => (
                    <div key={proj.id} className={"p-5 rounded-xl space-y-4 " + t.smallCard}>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className={"text-lg font-semibold " + t.textTitle}>{proj.title}</h4>
                          <span className={"p-1 text-zinc-500 transition cursor-pointer " + t.textLinkHover}>
                            <Github className="h-4 w-4" onClick={() => window.open(proj.githubUrl, "_blank")} />
                          </span>
                        </div>
                        <p className={"text-xs font-mono " + t.subTextAccent}>{proj.subtitle}</p>
                      </div>

                      <p className={"text-xs leading-relaxed " + t.textMuted}>{proj.description}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {proj.tech.map((tItem) => (
                          <span key={tItem} className={"px-2 py-0.5 rounded text-[10px] font-mono border " + t.badge}>
                            {tItem}
                          </span>
                        ))}
                      </div>

                      {proj.liveUrl && (
                        <button
                          onClick={() => window.open(proj.liveUrl, "_blank", "noopener,noreferrer")}
                          className={"w-full py-2 px-3 text-[11px] font-mono font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer border " + 
                            (isDarkMode 
                              ? "bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 border-emerald-900/50 hover:border-emerald-500/30" 
                              : "bg-sky-50 hover:bg-sky-100 text-[#0284c7] border-sky-200 hover:border-sky-300")}
                        >
                          <Play className="h-3 w-3 fill-current" /> Launch Live Demo
                        </button>
                      )}

                      {proj.highlights && (
                        <div className={"p-2.5 rounded-lg text-xs flex flex-col gap-1 border " + (isDarkMode ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-sky-50 border-sky-200/60 text-[#0284c7]")}>
                          {proj.highlights.map((high, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-1.5 font-mono text-[11px]">
                              <span className={"h-1 w-1 rounded-full inline-block animate-ping " + t.pinger}></span>
                              <span>{high}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <ul className={"space-y-1.5 text-xs pt-2 border-t " + (isDarkMode ? "border-zinc-800/60" : "border-zinc-200")}>
                        {proj.features.map((f, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <span className="text-zinc-500 mt-0.5">▪</span>
                            <span className={"text-[11px] " + t.textMuted}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Secure Contact Portal Column */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono uppercase text-zinc-500 tracking-wider">Secure Placement Console</h3>
                  </div>

                  <div className={"p-5 rounded-xl space-y-4 relative " + t.smallCard}>
                    <h4 className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className={"h-1.5 w-1.5 rounded-full inline-block animate-ping " + t.pinger}></span>
                      Submit Interview SLA Request
                    </h4>
                    
                    <form onSubmit={handleContactSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Inquirer Name</label>
                        <input 
                          type="text" 
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className={"w-full border rounded px-3 py-2 text-xs transition " + t.input} 
                          placeholder="Agent / Recruiter / Hiring Mgr"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Secure Email</label>
                          <input 
                            type="email" 
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className={"w-full border rounded px-3 py-2 text-xs transition " + t.input} 
                            placeholder="recruiter@company.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Company / Org</label>
                          <input 
                            type="text" 
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                            className={"w-full border rounded px-3 py-2 text-xs transition " + t.input} 
                            placeholder="Enterprise Inc."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Request Parameters (Message)</label>
                        <textarea 
                          rows={3}
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className={"w-full border rounded px-3 py-2 text-xs transition resize-none " + t.input} 
                          placeholder="Describe the open role, server requirements, or project details..."
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        className={"w-full py-2.5 rounded text-xs font-mono transition flex items-center justify-center gap-2 cursor-pointer " + (isDarkMode ? "bg-zinc-850 hover:bg-zinc-800 text-white border border-zinc-700/60" : "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs")}
                      >
                        <Send className="h-3.5 w-3.5" /> Transmit Ingress Application
                      </button>
                    </form>

                    <AnimatePresence>
                      {contactSuccess && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={"absolute inset-0 flex flex-col items-center justify-center p-4 rounded-xl text-center space-y-2 border " + t.subCardOverlay}
                        >
                          <CheckCircle className={"h-8 w-8 " + t.iconAccent} />
                          <h5 className={"text-sm font-semibold " + t.textTitle}>SLA Packet Dispatched!</h5>
                          <p className={"text-xs max-w-xs leading-relaxed " + t.textMuted}>
                            Simulated routing to {PERSONAL_INFO.email} is successful! Afshin will review your credentials request.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Operational Status Panel - clean metric elements */}
                  <div className={t.smallCard + " p-5 rounded-xl space-y-3 font-mono text-xs"}>
                    <h4 className="text-[10px] text-zinc-550 dark:text-zinc-400 uppercase tracking-widest font-bold">SysAdmin Console Logs</h4>
                    <div className={"space-y-2 text-[11px] leading-tight " + t.textMuted}>
                      <div className="flex items-center gap-1.5">
                        <span className={t.bullet}>✔</span>
                        <span>Docker subnet static bridging [OK]</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={t.bullet}>✔</span>
                        <span>Cloudflare Tunnel tunnels: active, stable</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={t.bullet}>✔</span>
                        <span>M.Eng Security database rules: ENFORCED</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={t.bullet}>✔</span>
                        <span>Canada Ingress availability: Core Node ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

           {/* AI Chat View */}
          {activeTab === "chat" && (
            <motion.div 
              id="content-chat"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)] min-h-[500px]"
            >
              {/* Suggestion Sidebar panel */}
              <div className={"lg:col-span-4 p-5 rounded-xl flex flex-col justify-between space-y-4 " + t.smallCard}>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className={"h-4.5 w-4.5 " + t.iconAccent} />
                    <h3 className={"text-sm font-semibold " + t.textTitle}>AI Twin Recruiter Console</h3>
                  </div>
                  <p className={"text-xs leading-relaxed mb-6 " + t.textMuted}>
                    This interactive bot acts as Afshin's AI Twin. Feel free to investigate his experience, check details of his Dockerized FastAPI translator, evaluate Concordia courses, or review his location availability.
                  </p>

                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">Suggested Interview Triggers</h4>
                  <div className="space-y-2">
                    {SUGGESTED_QUESTIONS.map((q, qidx) => (
                      <button
                        key={qidx}
                        onClick={() => handleSendChat(q)}
                        disabled={isAiTyping}
                        className={"w-full text-left p-2.5 text-[11px] font-sans border rounded-sm transition duration-150 flex items-center justify-between cursor-pointer disabled:opacity-50 " + t.input}
                      >
                        <span>{q}</span>
                        <Send className={"h-2.5 w-2.5 text-zinc-500 transition " + t.textLinkHover} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={"p-3.5 rounded border font-mono text-[10px] text-zinc-550 space-y-1 " + t.codeBlock}>
                  <div>ENDPOINT: /api/chat</div>
                  <div>MODEL: gemini-3.5-flash</div>
                  <div>LAST ACTIVE CLOUD: US-WEST1</div>
                </div>
              </div>

              {/* Central Chat Node */}
              <div className={"lg:col-span-8 flex flex-col rounded-xl overflow-hidden border " + (isDarkMode ? "bg-zinc-900/20 border-zinc-800" : "bg-white border-zinc-250 shadow-sm")}>
                
                {/* Chat Panel Header */}
                <div className={"px-4 py-3 border-b flex items-center justify-between " + (isDarkMode ? "bg-zinc-900/50 border-zinc-800/60" : "bg-zinc-100 border-zinc-200")}>
                  <div className="flex items-center space-x-2.5">
                    <div className={"h-2.5 w-2.5 rounded-full animate-pulse " + (isDarkMode ? "bg-emerald-500" : "bg-[#0284c7]")}></div>
                    <span className={"text-xs font-mono uppercase tracking-wider " + (isDarkMode ? "text-zinc-300" : "text-zinc-700")}>Afshin_AI_Twin_v3.5</span>
                  </div>
                  <button 
                    onClick={() => setMessages([
                      {
                        id: "welcome",
                        sender: "ai",
                        text: "Hello! I have cleared my memory cells. How can I help represent Afshin's systems security engineering background to you today?",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ])}
                    className={"p-1 px-2 text-[10px] uppercase font-mono rounded border transition cursor-pointer " + t.btnSec}
                  >
                    Clear Slate
                  </button>
                </div>

                {/* Messages Hub */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={"flex " + (m.sender === "user" ? "justify-end" : "justify-start")}
                    >
                      <div className={"max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed " + (
                        m.sender === "user" 
                          ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-[#0284c7] text-white") 
                          : (isDarkMode ? "bg-zinc-900/60 text-zinc-350 border border-zinc-850" : "bg-zinc-100/90 text-zinc-900 border border-zinc-250") + " select-text"
                      )}>
                        
                        <div className={"font-mono text-[9px] mb-1 leading-none uppercase tracking-wider " + (m.sender === "user" ? (isDarkMode ? "text-zinc-400" : "text-sky-100") : "text-zinc-500")}>
                          {m.sender === "user" ? "Recruiter" : "Afshin's Agent"} • {m.timestamp}
                        </div>
                        
                        <div className="markdown-body select-text">
                          <Markdown>{m.text}</Markdown>
                        </div>

                      </div>
                    </div>
                  ))}

                  {isAiTyping && (
                    <div className="flex justify-start">
                      <div className={"rounded-xl px-4 py-3 text-xs border flex items-center space-x-2 " + (isDarkMode ? "bg-zinc-900/30 text-zinc-400 border-zinc-850/60" : "bg-zinc-150 text-zinc-750 border-zinc-250")}>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Consulting resume telemetry data</span>
                        <span className="flex space-x-1">
                          <span className={"h-1.5 w-1.5 rounded-full animate-bounce " + t.pinger} style={{ animationDelay: '0ms' }}></span>
                          <span className={"h-1.5 w-1.5 rounded-full animate-bounce " + t.pinger} style={{ animationDelay: '150ms' }}></span>
                          <span className={"h-1.5 w-1.5 rounded-full animate-bounce " + t.pinger} style={{ animationDelay: '300ms' }}></span>
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Bottom Input Area */}
                <div className={"p-3.5 border-t " + (isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-100/90 border-zinc-200")}>
                  <div className="flex space-x-2">
                    <input 
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                      disabled={isAiTyping}
                      className={"flex-1 border rounded px-3 py-2 text-xs transition disabled:opacity-50 " + t.input}
                      placeholder="Type a custom query (e.g., Explain Afshin's Docker setup...)"
                    />
                    <button 
                      onClick={() => handleSendChat()}
                      disabled={isAiTyping || !inputText.trim()}
                      className={"p-2 px-3.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 " + 
                        (isDarkMode 
                          ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950" 
                          : "bg-[#0284c7] hover:bg-[#0369a1] text-white")}
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
              id="content-experience"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Credentials / Education profile column */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className={t.smallCard + " p-5 rounded-xl space-y-4"}>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className={"h-5 w-5 " + t.iconAccent} />
                    <h3 className={"text-sm font-semibold " + t.textTitle}>Academic Foundation</h3>
                  </div>
                  <div>
                    <h4 className={"text-xs font-semibold " + t.textTitle}>Master of Engineering (M.Eng)</h4>
                    <p className={"text-[11px] font-mono " + t.subTextAccent}>Information Systems Security</p>
                    <p className={"text-xs mt-1.5 " + t.textMuted}>Concordia University</p>
                  </div>
                  <p className={"text-xs leading-relaxed pt-2 border-t " + t.divider + " " + t.textMuted}>
                    Acquired advanced core methodologies surrounding threat models, cryptography schemas, network security compliance audits, and security operations engineering.
                  </p>
                </div>

                <div className={t.smallCard + " p-5 rounded-xl space-y-4"}>
                  <h3 className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Auxiliary Competency Matrix</h3>
                  
                  {SKILL_CATEGORIES.slice(3).map((cat, sidx) => (
                    <div key={sidx} className="space-y-4">
                      <h4 className={"text-xs font-bold flex items-center gap-1.5 uppercase " + (isDarkMode ? "text-zinc-300" : "text-zinc-700")}>
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
                  <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Chronological Security Experience logs</h3>
                  <span className={"text-[10px] font-mono tracking-wider " + t.subTextAccent}>8+ Years Total Experience</span>
                </div>

                <div className={"space-y-8 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px " + (isDarkMode ? "before:bg-zinc-800" : "before:bg-zinc-250")}>
                  {WORK_EXPERIENCE.map((job) => (
                    <div key={job.id} className="relative pl-10 group">
                      
                      {/* Timeline Node Selector */}
                      <span className={"absolute left-1.5 top-1.5 h-4 w-4 rounded-full border flex items-center justify-center transition group-hover:scale-110 duration-200 " + (isDarkMode ? "bg-zinc-950 border-emerald-500 group-hover:bg-emerald-500" : "bg-white border-sky-500 group-hover:bg-[#0284c7]")}>
                        <span className={"h-1.5 w-1.5 rounded-full transition " + (isDarkMode ? "bg-emerald-500 group-hover:bg-zinc-950" : "bg-[#0284c7] group-hover:bg-white")}></span>
                      </span>

                      <div className={t.smallCard + " p-5 rounded-xl space-y-3 transition " + (isDarkMode ? "hover:border-emerald-500/50" : "hover:border-sky-500/40")}>
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

          {/* Interactive Lab Center */}
          {activeTab === "labs" && (
            <motion.div 
              id="content-labs"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              
              {/* Introduction header */}
              <div className={"p-5 rounded-xl flex flex-wrap justify-between items-center gap-4 " + t.smallCard}>
                <div>
                  <h3 className={"text-lg font-semibold " + t.textTitle}>Operations Sandbox Live Labs</h3>
                  <p className={"text-xs mt-1 " + t.textMuted}>
                    To satisfy standard audit verification, explore two native simulation pipelines representing Afshin's published resume solutions.
                  </p>
                </div>
                <div className={"text-xs font-mono px-2.5 py-1.5 rounded border flex items-center gap-2 " + t.badge}>
                  <Activity className={"h-4 w-4 " + t.iconAccent} />
                  <span>Host Sandbox Nodes: Online</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lab 1: Interactive Wireshark Packet Investigator (Incident Response Game) */}
                <div className={"p-5 rounded-xl flex flex-col space-y-4 justify-between " + t.smallCard}>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase bg-red-950/50 text-red-500 border border-red-900 px-2 py-0.5 rounded-sm">
                      Lab Module 1: Alert Triage & Network Packet Auditing
                    </span>
                    <h4 className={"text-base font-semibold " + t.textTitle}>Wireshark Anomalous Stream Triage</h4>
                    <p className={"text-xs leading-relaxed " + t.textMuted}>
                      Afshin investigated network incidents and managed firewall segments at Arin Pars Media. Analyze this mock live packet trace, isolate the malicious scanning threat IP executing SQL Injection, and neutralize it.
                    </p>
                  </div>

                  {/* Packet visualizer feed */}
                  <div className={"p-3 rounded font-mono text-[9px] space-y-1.5 border " + (isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-zinc-100 border-zinc-250")}>
                    <div className={"grid grid-cols-12 pb-1 border-b " + (isDarkMode ? "text-zinc-500 border-zinc-900" : "text-zinc-550 border-zinc-200")}>
                      <span className="col-span-2">Source IP</span>
                      <span className="col-span-2">Dest IP</span>
                      <span className="col-span-1">Proto</span>
                      <span className="col-span-7">Frame Info Summary</span>
                    </div>

                    <div 
                      onClick={() => handleSelectIP("192.168.1.10")}
                      className={"grid grid-cols-12 py-1 px-1 rounded cursor-pointer leading-tight " + (selectedIp === "192.168.1.10" ? "bg-zinc-800 text-zinc-100 dark:text-zinc-100" : t.textMuted + " hover:bg-zinc-200 dark:hover:bg-zinc-900/60")}
                    >
                      <span className="col-span-2 text-cyan-500 dark:text-cyan-400">192.168.1.10</span>
                      <span className="col-span-2">10.0.0.5</span>
                      <span className={"col-span-1 font-bold " + (isDarkMode ? "text-emerald-400" : "text-sky-600")}>TCP</span>
                      <span className="col-span-7">Secure handshake SSL on 443 [STABLE]</span>
                    </div>

                    <div 
                      onClick={() => handleSelectIP("198.51.100.22")}
                      className={"grid grid-cols-12 py-1 px-1 rounded cursor-pointer leading-tight " + (selectedIp === "198.51.100.22" ? "bg-red-500/10 text-rose-600 dark:text-rose-300 border border-red-550/30 animate-pulse" : t.textMuted + " hover:bg-zinc-200 dark:hover:bg-zinc-900/60")}
                    >
                      <span className="col-span-2 text-rose-600 dark:text-rose-400 font-bold">198.51.100.22</span>
                      <span className="col-span-2">10.0.0.55</span>
                      <span className="col-span-1 text-rose-600 dark:text-rose-500">HTTP</span>
                      <span className="col-span-7 font-bold">Warning: GET /wp-login.php with SQLi payload OR 1=1</span>
                    </div>

                    <div 
                      onClick={() => handleSelectIP("192.168.1.12")}
                      className={"grid grid-cols-12 py-1 px-1 rounded cursor-pointer leading-tight " + (selectedIp === "192.168.1.12" ? "bg-zinc-800 text-zinc-100 dark:text-zinc-100" : t.textMuted + " hover:bg-zinc-200 dark:hover:bg-zinc-900/60")}
                    >
                      <span className="col-span-2 text-cyan-500 dark:text-cyan-400">192.168.1.12</span>
                      <span className="col-span-2">8.8.8.8</span>
                      <span className={"col-span-1 font-bold " + (isDarkMode ? "text-emerald-400" : "text-sky-600")}>DNS</span>
                      <span className="col-span-7">Querying DNS resolver cloudflare.com</span>
                    </div>

                    <div 
                      onClick={() => handleSelectIP("192.168.1.15")}
                      className={"grid grid-cols-12 py-1 px-1 rounded cursor-pointer leading-tight " + (selectedIp === "192.168.1.15" ? "bg-zinc-800 text-zinc-100 dark:text-zinc-100" : t.textMuted + " hover:bg-zinc-200 dark:hover:bg-zinc-900/60")}
                    >
                      <span className="col-span-2 text-cyan-500 dark:text-cyan-400">192.168.1.15</span>
                      <span className="col-span-2">10.0.0.5</span>
                      <span className="col-span-1 text-yellow-600 dark:text-yellow-500">SSH</span>
                      <span className="col-span-7">Authorized SSH console login key exchange</span>
                    </div>
                  </div>

                  {/* Interactive steps based on selected packet IP */}
                  <div className={"p-4 rounded border min-h-[140px] flex flex-col justify-between " + t.codeBlock}>
                    
                    {triageStep === "select" && (
                      <div className="text-center py-4 space-y-2">
                        <Search className="h-5 w-5 text-zinc-500 mx-auto" />
                        <p className={t.textMuted + " text-xs"}>
                          {selectedIp 
                            ? "IP [" + selectedIp + "] looks clean. Intranet system node." 
                            : "Select a suspicious packet trace from the Wireshark PCAP panel above."}
                        </p>
                      </div>
                    )}

                    {triageStep === "investigate" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200 text-xs font-semibold">
                          <AlertTriangle className="h-4 w-4 text-amber-500 animate-bounce" />
                          <span>Threat Class Identified: Web Vulnerability SQL Injection</span>
                        </div>
                        <p className={"text-[11px] leading-relaxed " + t.textMuted}>
                          Intruder IP **198.51.100.22** is performing scanning and automated SQL parameter modification. This asset is a primary vector of compromise.
                        </p>
                        <button 
                          onClick={handleMitigateThreat}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold font-mono rounded cursor-pointer transition uppercase tracking-wide flex items-center justify-center gap-1.5"
                        >
                          <Lock className="h-3.5 w-3.5" /> Block Vector & Apply Cisco ACL Rules
                        </button>
                      </div>
                    )}

                    {triageStep === "resolved" && (
                      <div className="space-y-3">
                        <div className={"flex items-center gap-1.5 text-xs font-semibold " + (isDarkMode ? "text-emerald-400" : "text-sky-650 text-[#0284c7]")}>
                          <CheckCircle className="h-4 w-4" />
                          <span>Threat Neutralized | IP Quarantined</span>
                        </div>
                        <div className={"p-2 rounded text-[9px] font-mono max-h-[80px] overflow-y-auto space-y-0.5 border " + (isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200")}>
                          {mitigationLogs.map((l, lIdx) => (
                            <div key={lIdx}>{l}</div>
                          ))}
                        </div>
                        <button 
                          onClick={handleResetIncident}
                          className="px-3 py-1.5 bg-zinc-900 text-zinc-300 text-[10px] font-mono border border-zinc-800 rounded hover:bg-zinc-800 transition cursor-pointer"
                        >
                          Clear Simulator Slate
                        </button>
                      </div>
                    )}

                    {isMitigating && (
                      <div className="text-center py-4 space-y-2">
                        <RefreshCw className={"h-5 w-5 animate-spin mx-auto " + t.iconAccent} />
                        <span className="text-zinc-400 text-[11px] font-mono">Pushing security rules to subnet clusters...</span>
                      </div>
                    )}

                  </div>
                </div>

                {/* Lab 2: Universal Subtitle Translator Live Test Frame */}
                <div className={"p-5 rounded-xl flex flex-col space-y-4 justify-between " + t.smallCard}>
                  <div className="space-y-1.5">
                    <span className={"text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border " + (isDarkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-900" : "bg-sky-50 text-sky-700 border-sky-200")}>
                      Lab Module 2: Container Automation & FastAPI Utilities
                    </span>
                    <h4 className={"text-base font-semibold " + t.textTitle}>Dockerized Subtitle Translation Workbench</h4>
                    <p className={"text-xs leading-relaxed " + t.textMuted}>
                      This represents his **Universal Subtitle Translator** app. Paste a segment of real subtitle text, pick a target system locale, and spin up a translation thread directly via our backend.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Input Subtitle block */}
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Source Subtitle Input (SRT format)</span>
                      <textarea
                        value={subtitleText}
                        onChange={(e) => setSubtitleText(e.target.value)}
                        rows={5}
                        className={"w-full border rounded px-2.5 py-1.5 text-xs font-mono resize-none leading-normal " + t.input}
                      ></textarea>
                    </div>

                    {/* Output translation block */}
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Translation Output stdout</span>
                      <div className={"w-full h-[112px] border rounded p-2.5 text-xs font-mono overflow-y-auto whitespace-pre-wrap leading-normal " + (isDarkMode ? "text-emerald-400" : "text-[#0284c7]") + " " + t.input}>
                        {isTranslating ? (
                          <div className="flex items-center space-x-1 justify-center h-full text-[10px] text-zinc-500">
                            <span className="animate-spin">⏳</span>
                            <span>Awaiting thread stdout...</span>
                          </div>
                        ) : translatedResult ? (
                          translatedResult
                        ) : (
                          <span className="text-zinc-500 block text-[10px] text-center pt-8">Translate to capture localized buffer</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Operational Settings Console */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">Target Locale:</span>
                      <select 
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className={"border p-1 text-[11px] font-mono rounded " + t.input}
                      >
                        <option value="French">French (FR)</option>
                        <option value="Spanish">Spanish (ES)</option>
                        <option value="German">German (DE)</option>
                        <option value="Persian">Persian (FA)</option>
                        <option value="Italian">Italian (IT)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleTranslateSubtitle}
                      disabled={isTranslating || !subtitleText.trim()}
                      className={"px-4 py-2 text-xs font-semibold rounded cursor-pointer transition flex items-center justify-center gap-1.5 disabled:opacity-50 " + 
                        (isDarkMode 
                          ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950" 
                          : "bg-[#0284c7] hover:bg-[#0369a1] text-white")}
                    >
                      <Play className="h-3.5 w-3.5 fill-current" /> Run Translation Worker
                    </button>
                  </div>

                  {/* Console telemetry readout */}
                  <div className={"p-3.5 rounded border text-[10px] font-mono h-[100px] overflow-y-auto space-y-1 select-all " + t.codeBlock}>
                    <span className="text-zinc-500 block">CONTAINER CONSOLE STDOUT:</span>
                    {translationLogs.length === 0 ? (
                      <span className="text-zinc-500 italic block pt-2">Translate workload to initialize environment telemetry.</span>
                    ) : (
                      translationLogs.map((log, index) => (
                        <div key={index}>{log}</div>
                      ))
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Modern Professional Footer */}
      <footer className={"border-t mt-16 py-8 " + (isDarkMode ? "bg-zinc-950 border-zinc-900 text-zinc-500" : "bg-zinc-150 border-zinc-250 text-zinc-650")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between text-xs">
          <p className="font-mono">
            © {new Date().getFullYear()} {PERSONAL_INFO.name}. All Rights Enforced.
          </p>
        </div>
      </footer>

    </div>
  );
}
