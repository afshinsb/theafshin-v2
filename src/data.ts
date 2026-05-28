import { WorkExperience, ProjectData, SkillCategory } from "./types";

export const PERSONAL_INFO = {
  name: "AFSHIN SABERI",
  title: "IT Security & Systems Operations Specialist",
  location: "",
  email: "contact@theafshin.com", // Used the portfolio domain
  phone: "Available upon request", // Hidden for privacy
  linkedin: "https://linkedin.com/in/theafshin", // Updated to match user's actual linkedin username
  github: "https://github.com/afshinsb",
  portfolio: "https://theafshin.com",
  summary: "Infrastructure and security professional with 8+ years of experience across Linux, Windows, networking, VPNs, cloud platforms, and operational security. Focused on reliable systems, automation, monitoring, and secure infrastructure operations."
};

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: "tzanet",
    company: "Enterprise Logistics & E-Commerce Systems Provider",
    role: "Systems Administrator",
    location: "",
    period: "Jan 2023 - Jan 2025",
    bullets: [
      "Performed security monitoring by analyzing system and network alerts to investigate issues impacting availability.",
      "Supported incident response processes including triage, escalation, and resolution.",
      "Managed firewall rules and VPN access to reduce security exposure and enforce least-privilege policies.",
      "Applied strict system hardening practices, automated patch cycles, and maintained OS distributions.",
      "Managed identity lifecycle and fine-grained access control solutions across the cloud tenant and directory environments.",
      "Developed robust Python scripts to automate basic AWS instance provisioning and routine operational tasks."
    ]
  },
  {
    id: "arin-analyst",
    company: "High-Throughput Infrastructure & Digital Network Host",
    role: "Network Systems Analyst",
    location: "",
    period: "Mar 2018 - Jan 2022",
    bullets: [
      "Maintained secure multi-site network environments across enterprise Linux servers and public/hybrid cloud infrastructure.",
      "Implemented enterprise firewall policies and secure site-to-site VPN connectivity.",
      "Investigated network anomalies and security incidents using Wireshark for direct packet analysis and threat diagnosis.",
      "Improved infrastructure segmentation and access control mechanisms to minimize blast radius."
    ]
  },
  {
    id: "arin-technician",
    company: "High-Throughput Infrastructure & Digital Network Host",
    role: "Network Technician",
    location: "",
    period: "Mar 2016 - Feb 2018",
    bullets: [
      "Supported enterprise physical and virtual infrastructure installation, wiring, optimization, and system troubleshooting.",
      "Assisted senior engineers in maintaining stable, highly available, and secure day-to-day operations."
    ]
  }
];

export const PROJECTS: ProjectData[] = [
  {
    id: "secure-infra",
    title: "Self-Hosted Secure Infrastructure",
    subtitle: "Private Linux services, tunnels, VPN access",
    description: "A small homelab stack for running private services without exposing unnecessary ports.",
    tech: ["Docker Compose", "Cloudflare Tunnel", "Linux", "KVM/libvirt", "Tailscale VPN", "Reverse Proxy"],
    features: [
      "Published selected services through Cloudflare Tunnel and kept admin paths private over Tailscale.",
      "Used Docker Compose for repeatable service layout, health checks, and recovery.",
      "Tested changes in isolated KVM/libvirt Ubuntu guests before touching live services."
    ],
    githubUrl: "https://github.com/afshinsb/homelab-infra"
  },
  {
    id: "subtitle-translator",
    title: "Universal Subtitle Translator",
    subtitle: "FastAPI app for SRT and media batch translation",
    description: "A Dockerized tool for translating subtitle files and media folders, with a safe public demo.",
    tech: ["FastAPI", "Python", "Docker", "SQLite", "REST APIs", "Structured Logging", "OAuth"],
    features: [
      "Handles single SRT uploads, video subtitle extraction, and mounted-folder batch jobs.",
      "Tracks progress, logs, cancellation, and job history in SQLite.",
      "Keeps the public demo separate from the authenticated Docker/FastAPI app."
    ],
    githubUrl: "https://github.com/afshinsb/universal-subtitle-translator",
    liveUrl: "https://translate.theafshin.com/"
  },
  {
    id: "voxa",
    title: "Voxa",
    subtitle: "Multi-provider AI voice studio",
    description: "A prerelease Next.js app for rewriting text and generating narration through server-side provider adapters.",
    tech: ["Next.js", "TypeScript", "OpenAI API", "Gemini API", "ElevenLabs", "IndexedDB", "Docker Compose", "Tailwind CSS"],
    features: [
      "Supports OpenAI, Gemini, ElevenLabs, and mock local generation behind server routes.",
      "Maps six voice characters to eight tone presets without exposing provider keys.",
      "Stores generation history and cached audio locally with IndexedDB.",
      "Includes Persian/English rewrite and translation before text-to-speech."
    ],
    githubUrl: "https://github.com/afshinsb/voxa"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Security Operations",
    iconName: "ShieldAlert",
    skills: [
      "Security Alert Monitoring",
      "Incident Response & Investigation",
      "Network/Log Parsing & Troubleshooting",
      "Ticketing Systems & SLA Docs",
      "System Hardening & Vulnerability Patching"
    ]
  },
  {
    title: "Threat & Network Security",
    iconName: "Lock",
    skills: [
      "Firewall Rules & Policies",
      "Enterprise IPSec & SSL VPNs",
      "Attack Pattern Defense (Phishing, malware, DDoS)",
      "Network Microsegmentation",
      "Access Control Audits"
    ]
  },
  {
    title: "Networking & Protocol Analysis",
    iconName: "Network",
    skills: [
      "TCP/IP, HTTP, DNS, TLS/SSL",
      "Wireshark packet capture & inspection",
      "Routing & Custom Switching",
      "Cloud Virtual Networks (AWS VPC, Subnets)"
    ]
  },
  {
    title: "Infrastructure & Virtualization",
    iconName: "Server",
    skills: [
      "Linux Administration (Debian/Ubuntu)",
      "Windows Server & Microsoft 365 Core",
      "Docker & multi-container Docker Compose orchestration",
      "VMware virtualization & KVM hypervisors",
      "AWS Cloud Infrastructure & Services"
    ]
  },
  {
    title: "Scripting & DevTools",
    iconName: "Terminal",
    skills: [
      "Python Scripting for Automation",
      "PowerShell & Bash Scripting",
      "Cloudflare Tunnels & Edge Config",
      "Git / GitHub release versioning",
      "Structured JSON logs & REST API automation"
    ]
  }
];

export const SUGGESTED_QUESTIONS = [
  "What is your security experience?",
  "Tell me about your Concordia University Master's degree.",
  "What automation scripting do you write?",
  "What systems administration tools do you use?",
  "Detail your work at your previous logistics role."
];
