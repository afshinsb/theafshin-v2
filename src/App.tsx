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

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
    document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

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
    codeBlock: isDarkMode ? "bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px]" : "bg-zinc-100 border border-zinc-300 text-zinc-800 text-[10px]",
    terminalInput: isDarkMode ? "bg-zinc-950 border border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-500" : "bg-zinc-100 border border-zinc-300 focus:border-sky-500 text-zinc-800 placeholder:text-zinc-500",
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
      text: `Hello. I can answer questions about Afshin's infrastructure, networking, security operations, education, and projects. \n\nAsk about his technical background, project details, or role fit, or use one of the suggested questions below.`,
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

  // Voxa Voice Studio Lab States
  const [voxaProvider, setVoxaProvider] = useState("OpenAI");
  const [voxaCharacter, setVoxaCharacter] = useState("Chloe");
  const [voxaTone, setVoxaTone] = useState("Warm");
  const [voxaMode, setVoxaMode] = useState("Balanced");
  const [voxaLogs, setVoxaLogs] = useState<string[]>([]);
  const [isVoxaGenerating, setIsVoxaGenerating] = useState(false);

  // Wireshark Incident Lab States
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [triageStep, setTriageStep] = useState<"select" | "investigate" | "mitigate" | "resolved">("select");
  const [mitigationLogs, setMitigationLogs] = useState<string[]>([]);
  const [isMitigating, setIsMitigating] = useState(false);

  // Contact Form (Client Simulation)
  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "success" | "error">("idle");
  const [contactError, setContactError] = useState("");
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

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

    logs.splice(
      0,
      logs.length,
      "Starting Universal Subtitle Translator mock job",
      "Checking auth gate and session settings",
      "Inspecting source with ffprobe subtitle stream scan",
      "External .srt priority check: preferred when available",
      "Preparing OpenAI translation batch with target locale: " + targetLang,
      "Writing job state to SQLite history",
      "Streaming logs, progress, cancellation token, and report metadata"
    );

    // Simulated staggered logs for visual realism
    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setTranslationLogs(prev => [...prev, logs[i]]);
    }

    setTranslationLogs(prev => [...prev, "Sample translation complete. Download report and translated .srt would be attached to the job."]);
    setTranslatedResult(
      targetLang === "Persian"
        ? `1\n00:00:01,500 --> 00:00:04,800\nما باید فایروال‌های امنیتی و DevOps خودکار را حفظ کنیم.\n\n2\n00:00:05,100 --> 00:00:09,200\nکانتینرهای Docker بازتولید و جداسازی عالی فراهم می‌کنند.`
        : `1\n00:00:01,500 --> 00:00:04,800\n[${targetLang}] We must maintain high-security firewalls and automated DevOps.\n\n2\n00:00:05,100 --> 00:00:09,200\n[${targetLang}] Docker containers provide excellent replication and isolation.`
    );
    setIsTranslating(false);
    return;

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

  const handleGenerateVoxaSample = async () => {
    if (isVoxaGenerating) return;
    setIsVoxaGenerating(true);
    setVoxaLogs([]);

    const steps = [
      "Loading Voxa provider adapter: " + voxaProvider,
      "Selecting voice character: " + voxaCharacter,
      "Applying tone preset: " + voxaTone,
      "Generation mode: " + voxaMode,
      "Checking server-only provider key boundary",
      "Preparing rewrite and bilingual text pipeline",
      "Caching generated audio metadata in browser history",
      "Sample ready for playback dock handoff"
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 420));
      setVoxaLogs(prev => [...prev, steps[i]]);
    }

    setIsVoxaGenerating(false);
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

  // Send contact form through the server-side email endpoint.
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitting(true);
    setContactStatus("idle");
    setContactError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to send the message.");
      }

      setContactStatus("success");
      setContactForm({ name: "", email: "", company: "", message: "" });
    } catch (err: any) {
      setContactStatus("error");
      setContactError(err.message || "Unable to send the message.");
    } finally {
      setIsContactSubmitting(false);
    }
  };

  const voxaLabCard = (
    <div className={"p-5 rounded-xl flex flex-col space-y-4 justify-between " + t.smallCard}>
      <div className="space-y-1.5">
        <span className={"text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border " + (isDarkMode ? "bg-violet-950/50 text-violet-300 border-violet-900" : "bg-violet-50 text-violet-700 border-violet-200")}>
          Lab Module 3: Multi-Provider AI Voice Studio
        </span>
        <h4 className={"text-base font-semibold " + t.textTitle}>Voxa Narration Pipeline</h4>
        <p className={"text-xs leading-relaxed " + t.textMuted}>
          I built Voxa as a prerelease Next.js voice studio for OpenAI, Gemini, ElevenLabs, and local mock audio. Test how provider, character, tone, and generation mode shape a secure server-routed narration workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="block text-[10px] font-mono text-zinc-500 uppercase">Provider</span>
          <select value={voxaProvider} onChange={(e) => setVoxaProvider(e.target.value)} className={"w-full border p-1.5 text-[11px] font-mono rounded " + t.input}>
            <option>OpenAI</option>
            <option>Gemini</option>
            <option>ElevenLabs</option>
            <option>Mock</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-[10px] font-mono text-zinc-500 uppercase">Character</span>
          <select value={voxaCharacter} onChange={(e) => setVoxaCharacter(e.target.value)} className={"w-full border p-1.5 text-[11px] font-mono rounded " + t.input}>
            <option>Chloe</option>
            <option>Vivian</option>
            <option>Mia</option>
            <option>Titan</option>
            <option>Vincent</option>
            <option>Adam</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-[10px] font-mono text-zinc-500 uppercase">Tone</span>
          <select value={voxaTone} onChange={(e) => setVoxaTone(e.target.value)} className={"w-full border p-1.5 text-[11px] font-mono rounded " + t.input}>
            <option>Calm</option>
            <option>Warm</option>
            <option>Cheerful</option>
            <option>Whisper</option>
            <option>Energetic</option>
            <option>Cinematic</option>
            <option>Intimate</option>
            <option>Storyteller</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-[10px] font-mono text-zinc-500 uppercase">Mode</span>
          <select value={voxaMode} onChange={(e) => setVoxaMode(e.target.value)} className={"w-full border p-1.5 text-[11px] font-mono rounded " + t.input}>
            <option>Lowest quota usage</option>
            <option>Balanced</option>
            <option>Highest consistency</option>
          </select>
        </label>
      </div>

      <div className={"p-3 rounded border " + (isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-zinc-100 border-zinc-250")}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] font-mono text-zinc-500 uppercase">Current Route</span>
            <p className={"text-xs font-mono mt-1 " + t.textTitle}>POST /api/tts</p>
          </div>
          <div className="flex gap-1.5">
            {["rewrite", "translate", "tts"].map((step) => (
              <span key={step} className={"px-2 py-1 rounded border text-[10px] font-mono uppercase " + t.badge}>
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={"p-3.5 rounded border text-[10px] font-mono h-[118px] overflow-y-auto space-y-1 select-all " + t.codeBlock}>
        <span className="text-zinc-500 block">VOXA PROVIDER CONSOLE:</span>
        {voxaLogs.length === 0 ? (
          <span className="text-zinc-500 italic block pt-2">Run a sample to inspect the narration pipeline.</span>
        ) : (
          voxaLogs.map((log, index) => (
            <div key={index}>{log}</div>
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a href="https://github.com/afshinsb/voxa" target="_blank" referrerPolicy="no-referrer" className={"px-3 py-2 text-xs font-semibold rounded border transition flex items-center justify-center gap-1.5 " + t.btnSec}>
          <Github className="h-3.5 w-3.5" /> Source
        </a>
        <button
          onClick={handleGenerateVoxaSample}
          disabled={isVoxaGenerating}
          className={"px-4 py-2 text-xs font-semibold rounded cursor-pointer transition flex items-center justify-center gap-1.5 disabled:opacity-50 " + (isDarkMode ? "bg-violet-400 hover:bg-violet-300 text-zinc-950" : "bg-violet-600 hover:bg-violet-700 text-white")}
        >
          {isVoxaGenerating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          Run Voxa Sample
        </button>
      </div>
    </div>
  );

  return (
    <div className={t.bg + " flex flex-col"}>
      
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
              <Sparkles className={"h-3 w-3 " + t.iconAccent} /> Ask About Experience
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
            <Sparkles className={"h-2 w-2 " + t.iconAccent} /> Q&A
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Core Profile Banner - displayed on top level of Overview */}
        {activeTab === "overview" && (
          <div className={"mb-8 p-6 sm:p-8 rounded-2xl relative overflow-hidden " + t.card}>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Shield className={"h-64 w-64 " + t.iconAccent} />
            </div>
            
            <div className="max-w-3xl">
              <h2 className={"text-3xl sm:text-4xl font-semibold tracking-tight mb-4 " + t.textTitle}>
                Infrastructure, networking & security operations
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
                  <Sparkles className="h-4 w-4" /> Ask About My Experience
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
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
                    <div className={"text-2xl font-bold font-mono mb-1 " + t.textTitle}>Zero Trust</div>
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

                  {PROJECTS.map((proj) => {
                    const isCoreProject = proj.id === "secure-infra" || proj.id === "subtitle-translator";
                    const isSupportingProject = proj.id === "voxa";

                    return (
                    <div
                      key={proj.id}
                      className={"p-5 rounded-xl space-y-4 transition " + t.smallCard + " " + (
                        isCoreProject
                          ? (isDarkMode ? "border-emerald-500/30" : "border-sky-300")
                          : isSupportingProject
                            ? "opacity-90"
                            : ""
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className={(isSupportingProject ? "text-base" : "text-lg") + " font-semibold " + t.textTitle}>{proj.title}</h4>
                            {isCoreProject && (
                              <span className={"px-1.5 py-0.5 rounded border text-[9px] font-mono uppercase " + t.badge}>Core</span>
                            )}
                          </div>
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

                      {proj.id === "secure-infra" && (
                        <div className={"p-3 rounded-lg border font-mono text-[10px] " + (isDarkMode ? "bg-zinc-950/70 border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-300 text-zinc-800")}>
                          <div className="mb-2 uppercase tracking-wider text-zinc-500">Sanitized Architecture</div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {["Browser", "Cloudflare Tunnel", "Reverse Proxy", "Docker Services", "Tailscale Admin Access"].map((node, nodeIdx) => (
                              <React.Fragment key={node}>
                                <span className={"px-2 py-1 rounded border " + (isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-300")}>{node}</span>
                                {nodeIdx < 4 && <span className="text-zinc-500">-&gt;</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      <ul className={"space-y-1.5 text-xs pt-2 border-t " + (isDarkMode ? "border-zinc-800/60" : "border-zinc-200")}>
                        {proj.features.slice(0, isSupportingProject ? 2 : 3).map((f, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <span className="text-zinc-500 mt-0.5">▪</span>
                            <span className={"text-[11px] " + t.textMuted}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    );
                  })}
                </div>

                {/* Secure Contact Portal Column */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono uppercase text-zinc-500 tracking-wider">Recruiter Contact</h3>
                  </div>

                  <div className={"p-5 rounded-xl space-y-4 relative " + t.smallCard}>
                    <h4 className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className={"h-1.5 w-1.5 rounded-full inline-block animate-ping " + t.pinger}></span>
                      Send Hiring Inquiry
                    </h4>
                    
                    <form onSubmit={handleContactSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Inquirer Name</label>
                        <input 
                          type="text" 
                          required
                          value={contactForm.name}
                          onChange={(e) => {
                            setContactStatus("idle");
                            setContactForm({ ...contactForm, name: e.target.value });
                          }}
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
                            onChange={(e) => {
                              setContactStatus("idle");
                              setContactForm({ ...contactForm, email: e.target.value });
                            }}
                            className={"w-full border rounded px-3 py-2 text-xs transition " + t.input} 
                            placeholder="recruiter@company.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Company / Org</label>
                          <input 
                            type="text" 
                            value={contactForm.company}
                            onChange={(e) => {
                              setContactStatus("idle");
                              setContactForm({ ...contactForm, company: e.target.value });
                            }}
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
                          onChange={(e) => {
                            setContactStatus("idle");
                            setContactForm({ ...contactForm, message: e.target.value });
                          }}
                          className={"w-full border rounded px-3 py-2 text-xs transition resize-none " + t.input} 
                          placeholder="Describe the open role, server requirements, or project details..."
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isContactSubmitting}
                        className={"w-full py-2.5 rounded text-xs font-mono transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 " + (isDarkMode ? "bg-zinc-850 hover:bg-zinc-800 text-white border border-zinc-700/60" : "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs")}
                      >
                        {isContactSubmitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        {isContactSubmitting ? "Sending..." : "Send Hiring Inquiry"}
                      </button>
                    </form>

                    <AnimatePresence>
                      {contactStatus === "success" && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={"absolute inset-0 flex flex-col items-center justify-center p-4 rounded-xl text-center space-y-2 border " + t.subCardOverlay}
                        >
                          <CheckCircle className={"h-8 w-8 " + t.iconAccent} />
                          <h5 className={"text-sm font-semibold " + t.textTitle}>Message Sent</h5>
                          <p className={"text-xs max-w-xs leading-relaxed " + t.textMuted}>
                            Your interview request was emailed to {PERSONAL_INFO.email}.
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
                      <div className={"p-3 rounded border text-xs leading-relaxed " + (isDarkMode ? "bg-rose-950/20 border-rose-900/50 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700")}>
                        {contactError}
                      </div>
                    )}
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
                    <h3 className={"text-sm font-semibold " + t.textTitle}>Interactive Technical Profile</h3>
                  </div>
                  <p className={"text-xs leading-relaxed mb-6 " + t.textMuted}>
                    Ask focused questions about my infrastructure, security operations, automation work, projects, education, or location availability.
                  </p>

                    <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">Suggested Questions</h4>
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
                  <div>MODEL: server-selected AI provider</div>
                  <div>LAST ACTIVE CLOUD: US-WEST1</div>
                </div>
              </div>

              {/* Central Chat Node */}
              <div className={"lg:col-span-8 flex flex-col rounded-xl overflow-hidden border " + (isDarkMode ? "bg-zinc-900/20 border-zinc-800" : "bg-white border-zinc-250 shadow-sm")}>
                
                {/* Chat Panel Header */}
                <div className={"px-4 py-3 border-b flex items-center justify-between " + (isDarkMode ? "bg-zinc-900/50 border-zinc-800/60" : "bg-zinc-100 border-zinc-200")}>
                  <div className="flex items-center space-x-2.5">
                    <div className={"h-2.5 w-2.5 rounded-full animate-pulse " + (isDarkMode ? "bg-emerald-500" : "bg-[#0284c7]")}></div>
                    <span className={"text-xs font-mono uppercase tracking-wider " + (isDarkMode ? "text-zinc-300" : "text-zinc-700")}>Technical_QA_Profile</span>
                  </div>
                  <button 
                    onClick={() => setMessages([
                      {
                        id: "welcome",
                        sender: "ai",
                        text: "Hello. What would you like to know about my infrastructure, networking, security operations, or project work?",
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
                          {m.sender === "user" ? "Recruiter" : "Technical Profile"} • {m.timestamp}
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
                      placeholder="Type a custom query (e.g., Explain my Docker setup...)"
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className={"h-5 w-5 " + t.iconAccent} />
                      <div>
                        <h3 className={"text-sm font-semibold " + t.textTitle}>M.Eng Information Systems Security</h3>
                        <p className={"text-[11px] font-mono " + t.subTextAccent}>Concordia University</p>
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
                      <div key={code} className={"flex items-center justify-between gap-3 rounded border px-3 py-2 " + (isDarkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                        <span className={"text-[10px] font-mono " + t.subTextAccent}>{code}</span>
                        <span className={"text-[11px] text-right " + t.textMuted}>{title}</span>
                      </div>
                    ))}
                  </div>

                  <p className={"text-xs leading-relaxed pt-2 border-t " + (isDarkMode ? "border-zinc-800" : "border-zinc-200") + " " + t.textMuted}>
                    My ISS coursework centered on cryptographic primitives, protocol and network attack surfaces, and OS-level controls such as isolation, authentication, access control, and secure system design.
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

                <div className={"space-y-8 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px " + (isDarkMode ? "before:bg-zinc-800" : "before:bg-zinc-400")}>
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
                    To satisfy standard audit verification, explore two native simulation pipelines representing my published resume solutions.
                  </p>
                </div>
                <div className={"text-xs font-mono px-2.5 py-1.5 rounded border flex items-center gap-2 " + t.badge}>
                  <Activity className={"h-4 w-4 " + t.iconAccent} />
                  <span>Host Sandbox Nodes: Online</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Lab 1: SOC Incident Triage Workbench */}
                <div className={"p-5 rounded-xl flex flex-col space-y-4 " + t.smallCard}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1.5">
                      <span className={"text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border " + (isDarkMode ? "bg-red-950/50 text-red-400 border-red-900" : "bg-red-50 text-red-700 border-red-200")}>
                        Lab Module 1: SOC Incident Triage
                      </span>
                      <h4 className={"text-base font-semibold " + t.textTitle}>Web Attack Investigation Workbench</h4>
                      <p className={"text-xs leading-relaxed max-w-2xl " + t.textMuted}>
                        A practical alert workflow for reviewing network evidence, identifying the source of hostile web traffic, and documenting containment actions.
                      </p>
                    </div>
                    <div className={"rounded-lg border px-3 py-2 font-mono text-[10px] " + (isDarkMode ? "border-red-900/70 bg-red-950/20 text-red-300" : "border-red-200 bg-red-50 text-red-700")}>
                      SEV-2 / Web Attack
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      ["Signal", "SQL injection pattern"],
                      ["Target", "Web service segment"],
                      ["Status", triageStep === "resolved" ? "Contained" : selectedIp === "198.51.100.22" ? "Confirmed" : "Needs review"]
                    ].map(([label, value]) => (
                      <div key={label} className={"rounded-lg border p-3 " + (isDarkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                        <div className="text-[10px] font-mono uppercase text-zinc-500">{label}</div>
                        <div className={"mt-1 text-xs font-semibold " + t.textTitle}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className={"rounded-lg border overflow-hidden " + (isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-300")}>
                    <div className={"grid grid-cols-[1.25fr_1.05fr_0.65fr_0.7fr] gap-2 border-b px-3 py-2 text-[10px] font-mono uppercase " + (isDarkMode ? "border-zinc-800 text-zinc-500" : "border-zinc-300 text-zinc-500")}>
                      <span>Source</span>
                      <span>Dest</span>
                      <span>Proto</span>
                      <span>Risk</span>
                    </div>
                    <div>
                      {[
                        ["192.168.1.10", "10.0.0.5", "TLS", "Normal", "Successful TLS handshake to service endpoint."],
                        ["198.51.100.22", "10.0.0.55", "HTTP", "High", "GET /wp-login.php with OR 1=1 injection payload."],
                        ["192.168.1.12", "8.8.8.8", "DNS", "Normal", "Resolver query for external domain."],
                        ["192.168.1.15", "10.0.0.5", "SSH", "Normal", "Authorized SSH key exchange from admin subnet."]
                      ].map(([source, dest, proto, risk, evidence]) => {
                        const isThreat = source === "198.51.100.22";
                        const isSelected = selectedIp === source;
                        return (
                          <button
                            key={source}
                            type="button"
                            onClick={() => handleSelectIP(source)}
                            className={"w-full px-3 py-2 text-left text-[11px] font-mono transition border-b last:border-b-0 " + (isDarkMode ? "border-zinc-900" : "border-zinc-200") + " " + (
                              isSelected
                                ? isThreat
                                  ? "bg-red-500/10 text-red-300"
                                  : "bg-sky-500/10"
                                : isDarkMode
                                  ? "text-zinc-300 hover:bg-zinc-900"
                                  : "text-zinc-800 hover:bg-white"
                            )}
                          >
                            <div className="grid grid-cols-[1.25fr_1.05fr_0.65fr_0.7fr] gap-2 items-center">
                              <span className={"truncate " + (isThreat ? "text-red-400 font-semibold" : "text-cyan-500")}>{source}</span>
                              <span className="truncate">{dest}</span>
                              <span className={proto === "HTTP" ? "text-red-400 font-semibold" : proto === "SSH" ? "text-amber-500" : "text-emerald-500"}>{proto}</span>
                              <span className={isThreat ? "text-red-400 font-semibold" : "text-zinc-500"}>{risk}</span>
                            </div>
                            <div className={"mt-1 whitespace-normal leading-relaxed " + (isThreat ? "text-red-300" : t.textMuted)}>{evidence}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={"rounded-lg border p-4 min-h-[160px] " + (isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                    {triageStep === "select" && (
                      <div className="grid gap-3 md:grid-cols-[auto_1fr] md:items-center">
                        <Search className="h-5 w-5 text-zinc-500" />
                        <div>
                          <div className={"text-xs font-semibold " + t.textTitle}>Review the alert evidence</div>
                          <p className={"mt-1 text-xs leading-relaxed " + t.textMuted}>
                            Select the high-risk HTTP row to populate detection rationale and containment actions.
                          </p>
                        </div>
                      </div>
                    )}

                    {triageStep === "investigate" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Confirmed hostile web request from 198.51.100.22</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className={"rounded border p-3 " + (isDarkMode ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white")}>
                            <div className="font-mono text-[10px] uppercase text-zinc-500">Detection rationale</div>
                            <p className={"mt-1 leading-relaxed " + t.textMuted}>
                              HTTP request targets an authentication path and includes a classic SQL injection condition. Source should be blocked and logged for follow-up.
                            </p>
                          </div>
                          <div className={"rounded border p-3 " + (isDarkMode ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white")}>
                            <div className="font-mono text-[10px] uppercase text-zinc-500">Recommended action</div>
                            <p className={"mt-1 leading-relaxed " + t.textMuted}>
                              Add temporary edge block, document the source, review web logs, and validate no successful authentication or database error occurred.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleMitigateThreat}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold font-mono rounded transition flex items-center justify-center gap-1.5"
                        >
                          <Lock className="h-3.5 w-3.5" /> Apply Containment Plan
                        </button>
                      </div>
                    )}

                    {triageStep === "resolved" && (
                      <div className="space-y-3">
                        <div className={"flex items-center gap-1.5 text-xs font-semibold " + (isDarkMode ? "text-emerald-400" : "text-emerald-700")}>
                          <CheckCircle className="h-4 w-4" />
                          <span>Incident contained and response notes generated</span>
                        </div>
                        <div className={"p-3 rounded text-[10px] font-mono max-h-[96px] overflow-y-auto space-y-1 border " + t.codeBlock}>
                          {mitigationLogs.map((l, lIdx) => (
                            <div key={lIdx}>{l}</div>
                          ))}
                        </div>
                        <button
                          onClick={handleResetIncident}
                          className={"px-3 py-1.5 text-[10px] font-mono rounded border transition " + t.btnSec}
                        >
                          Reset Workbench
                        </button>
                      </div>
                    )}

                    {isMitigating && (
                      <div className="text-center py-4 space-y-2">
                        <RefreshCw className={"h-5 w-5 animate-spin mx-auto " + t.iconAccent} />
                        <span className="text-zinc-400 text-[11px] font-mono">Applying containment and writing response notes...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lab 2: Universal Subtitle Translator Live Test Frame */}
                <div className={"p-5 rounded-xl flex flex-col space-y-4 justify-between " + t.smallCard}>
                  <div className="space-y-1.5">
                    <span className={"text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border " + (isDarkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-900" : "bg-sky-50 text-sky-700 border-sky-200")}>
                      Lab Module 2: Universal Subtitle Translator Mock
                    </span>
                    <h4 className={"text-base font-semibold " + t.textTitle}>Batch Subtitle Automation Console</h4>
                    <p className={"text-xs leading-relaxed " + t.textMuted}>
                      This mirrors my real FastAPI + Docker subtitle tool. It scans SRT or video sources, prioritizes external subtitles, falls back to ffmpeg extraction, translates with OpenAI, and records progress in SQLite job history.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Input Subtitle block */}
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Source SRT / Extracted Track Preview</span>
                      <textarea
                        value={subtitleText}
                        onChange={(e) => setSubtitleText(e.target.value)}
                        rows={5}
                        className={"w-full rounded px-2.5 py-1.5 text-xs font-mono resize-none leading-normal transition " + t.terminalInput}
                      ></textarea>
                    </div>

                    {/* Output translation block */}
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Translated .srt Output Preview</span>
                      <div className={"w-full h-[112px] rounded p-2.5 text-xs font-mono overflow-y-auto whitespace-pre-wrap leading-normal " + t.terminalInput}>
                        {isTranslating ? (
                          <div className={"flex items-center space-x-1 justify-center h-full text-[10px] " + (isDarkMode ? "text-zinc-500" : "text-zinc-600")}>
                            <span className="animate-spin">⏳</span>
                          <span>Awaiting batch worker output...</span>
                          </div>
                        ) : translatedResult ? (
                          translatedResult
                        ) : (
                          <span className={(isDarkMode ? "text-zinc-500" : "text-zinc-600") + " block text-[10px] text-center pt-8"}>Run a sample to preview translated subtitles</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Operational Settings Console */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">Target Language:</span>
                      <select 
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className={"border p-1 text-[11px] font-mono rounded " + t.input}
                      >
                        <option value="Persian">Persian (FA)</option>
                        <option value="Spanish">Spanish (ES)</option>
                        <option value="German">German (DE)</option>
                        <option value="French">French (FR)</option>
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
                      <Play className="h-3.5 w-3.5 fill-current" /> Run Sample
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={"px-2 py-1 rounded border text-[10px] font-mono " + t.badge}>FastAPI</span>
                    <span className={"px-2 py-1 rounded border text-[10px] font-mono " + t.badge}>Docker Compose</span>
                    <span className={"px-2 py-1 rounded border text-[10px] font-mono " + t.badge}>FFmpeg</span>
                    <span className={"px-2 py-1 rounded border text-[10px] font-mono " + t.badge}>SQLite Jobs</span>
                    <span className={"px-2 py-1 rounded border text-[10px] font-mono " + t.badge}>Auth + Reports</span>
                  </div>

                  {/* Console telemetry readout */}
                  <div className={"p-3.5 rounded border text-[10px] font-mono h-[100px] overflow-y-auto space-y-1 select-all " + t.codeBlock}>
                    <span className="text-zinc-500 block">SUBTITLE TRANSLATOR JOB LOG:</span>
                    {translationLogs.length === 0 ? (
                      <span className="text-zinc-500 italic block pt-2">Run a sample to initialize scan, extraction, translation, and report telemetry.</span>
                    ) : (
                      translationLogs.map((log, index) => (
                        <div key={index}>{log}</div>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a href="https://translate.theafshin.com/" target="_blank" referrerPolicy="no-referrer" className={"px-3 py-2 text-xs font-semibold rounded transition flex items-center justify-center gap-1.5 " + (isDarkMode ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950" : "bg-[#0284c7] hover:bg-[#0369a1] text-white")}>
                      <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </a>
                    <a href="https://github.com/afshinsb/universal-subtitle-translator" target="_blank" referrerPolicy="no-referrer" className={"px-3 py-2 text-xs font-semibold rounded border transition flex items-center justify-center gap-1.5 " + t.btnSec}>
                      <Github className="h-3.5 w-3.5" /> Source
                    </a>
                  </div>

                </div>

                {voxaLabCard}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Modern Professional Footer */}
      <footer className={"mt-auto border-t " + (isDarkMode ? "bg-zinc-950 border-zinc-900 text-zinc-500" : "bg-zinc-100 border-zinc-250 text-zinc-650")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs">
          <div className="flex flex-col gap-2 text-center text-[11px] font-mono sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <span>© {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.</span>
            <span>Secure contact: {PERSONAL_INFO.email}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
