import { WorkExperience, ProjectData, SkillCategory } from "./types";

export const PERSONAL_INFO = {
  name: "AFSHIN SABERI",
  title: "Infrastructure / Cloud Operations / Security Operations",
  location: "",
  email: "contact@theafshin.com",
  phone: "Available upon request",
  linkedin: "https://linkedin.com/in/theafshin",
  github: "https://github.com/afshinsb",
  portfolio: "https://theafshin.com",
  summary: "Infrastructure and security operations professional focused on reliable Linux/Windows environments, controlled network exposure, monitoring, incident triage, and practical automation."
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
    subtitle: "Private Linux services with controlled exposure",
    description: "Run private Linux services safely with controlled public exposure and private admin access.",
    purpose: "Run private Linux services with controlled public exposure and private admin access.",
    built: "Docker Compose on Debian/Linux with ZFS, reverse proxying, Cloudflare Tunnel, Tailscale, DNS filtering, and restore planning.",
    demonstrates: "Linux operations, Docker service management, secure access design, storage awareness, and restore-aware infrastructure.",
    tech: ["Debian", "Docker Compose", "ZFS", "Cloudflare Tunnel", "Tailscale", "Reverse proxy", "DNS", "KVM/libvirt"],
    features: [],
    githubUrl: "https://github.com/afshinsb/homelab-infra"
  },
  {
    id: "ai-rail",
    title: "AI Rail — Local-First AI Development Workflow CLI",
    subtitle: "Scoped AI-assisted development workflow",
    description: "Make AI-assisted coding safer and more controlled by forcing one scoped issue at a time.",
    purpose: "Make AI-assisted coding safer by forcing one scoped issue at a time.",
    built: "A Python CLI for GitHub Issue workflows with project memory, review packs, safety checks, release validation, and pipx install.",
    demonstrates: "Python automation, CLI design, Git/GitHub workflow control, safety checks, and release-ready packaging.",
    tech: ["Python", "GitHub Issues", "Git", "pipx", "CLI tooling", "CI/testing", "Markdown workflows"],
    features: [],
    githubUrl: "https://github.com/afshinsb/ai-rail"
  },
  {
    id: "subtitle-translator",
    title: "Universal Subtitle Translator",
    subtitle: "Dockerized subtitle and media translation jobs",
    description: "Translate subtitle files and media-folder subtitles in a controlled Dockerized workflow.",
    purpose: "Translate subtitle files and media-folder subtitles in a controlled Dockerized workflow.",
    built: "A FastAPI app using FFmpeg/ffprobe, OpenAI API, SQLite history, batch jobs, live progress, cancellation, logs, and admin defaults.",
    demonstrates: "Python service design, Dockerized workloads, API integration, job state, media automation, safe demos, and operational logging.",
    tech: ["FastAPI", "Python", "Docker", "SQLite", "FFmpeg/ffprobe", "OpenAI API", "REST APIs", "Cloudflare Pages demo"],
    features: [],
    githubUrl: "https://github.com/afshinsb/universal-subtitle-translator",
    liveUrl: "https://translate.theafshin.com/"
  },
  {
    id: "applyflow",
    title: "ApplyFlow Automation — n8n Workflow Automation System",
    subtitle: "Job search tracking and workflow automation",
    description: "Automate job-search tracking and reduce repeated manual work around job alerts, ranking, and application follow-up.",
    purpose: "Automate job-search tracking around alerts, ranking, and follow-up.",
    built: "An n8n workflow with Gmail, Google Sheets, JavaScript nodes, HTTP fetches, OpenAI review, deduplication, logs, and separated config.",
    demonstrates: "Workflow automation, operations thinking, structured data handling, API integration, deduplication, and maintainable automation.",
    tech: ["n8n", "Gmail", "Google Sheets", "JavaScript code nodes", "HTTP APIs", "OpenAI API", "Structured logs"],
    features: []
  },
  {
    id: "glowbook",
    title: "GlowBook — Multi-Tenant Booking SaaS Demo/MVP",
    subtitle: "Multi-tenant booking platform",
    description: "Build a SaaS-style booking platform with tenant-aware workflows, staff/service management, appointments, and role-based access.",
    purpose: "Build a SaaS-style booking platform with tenant-aware workflows and role-based access.",
    built: "A React/TypeScript + Node/Express demo with tenant APIs, audit logs, appointments, staff/services, clients, notifications, and dashboards.",
    demonstrates: "Full-stack architecture, multi-tenant thinking, audit logs, business workflows, and production-boundary awareness.",
    tech: ["React", "TypeScript", "Node.js", "Express", "Audit logs", "REST APIs", "Dashboard UI"],
    features: [],
    githubUrl: "https://github.com/afshinsb/Glow"
  },
  {
    id: "voxa",
    title: "Voxa — Supporting Creative AI Voice Studio",
    subtitle: "Supporting creative AI project",
    description: "Explore AI narration workflows with multiple provider options and local history.",
    purpose: "Explore AI narration workflows with multiple provider options and local history.",
    built: "A prerelease app for rewriting, translation, narration presets, local history, cached audio metadata, and provider adapters.",
    demonstrates: "TypeScript UI work, API boundaries, provider abstraction, local persistence, and creative prototyping.",
    tech: ["Next.js", "TypeScript", "OpenAI API", "Gemini API", "ElevenLabs", "IndexedDB", "Server-side provider routes"],
    features: [],
    githubUrl: "https://github.com/afshinsb/voxa"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Systems & Infrastructure",
    iconName: "Server",
    skills: [
      "Linux administration",
      "Windows Server / Microsoft 365 basics",
      "Docker and Docker Compose",
      "KVM/libvirt virtualization",
      "Backup and restore validation"
    ]
  },
  {
    title: "Cloud & Identity",
    iconName: "Cloud",
    skills: [
      "AWS: EC2, VPC, IAM",
      "Cloudflare Tunnel and DNS",
      "Identity lifecycle support",
      "Access control reviews",
      "Least-privilege habits"
    ]
  },
  {
    title: "Network & Security",
    iconName: "Lock",
    skills: [
      "TCP/IP, DNS, HTTP, TLS",
      "Firewall rules and policy changes",
      "VPN access and tunnel design",
      "Wireshark packet review",
      "Segmentation and exposure reduction"
    ]
  },
  {
    title: "Automation & DevTools",
    iconName: "Terminal",
    skills: [
      "Python automation",
      "Bash and PowerShell scripting",
      "Git and GitHub workflows",
      "REST API automation",
      "Structured logs and CLI tooling"
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
