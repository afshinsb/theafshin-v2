import { WorkExperience, ProjectData, SkillCategory } from "./types";

export const PERSONAL_INFO = {
  name: "AFSHIN SABERI",
  title: "Security Operations | Infrastructure Security",
  location: "Montreal, QC",
  email: "contact@theafshin.com",
  phone: "Available upon request",
  linkedin: "https://linkedin.com/in/theafshin",
  github: "https://github.com/afshinsb",
  portfolio: "https://theafshin.com",
  summary: "Security and infrastructure professional with a networking foundation, systems administration experience, and hands-on security-focused infrastructure project work. Focused on identity and access, secure connectivity, Windows/Linux operations, log-based troubleshooting, and resilient self-hosted services."
};

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: "private-employer",
    company: "Private Employer",
    role: "Systems Administrator — Infrastructure & Security Operations",
    location: "Montreal, QC",
    period: "Jan 2023 - Jan 2025",
    bullets: [
      "Microsoft 365 & Identity: Managed user accounts, permissions, MFA, and authentication/access issues.",
      "Network & Secure Access: Supported VPN connectivity, firewall rules, DNS, and remote-access troubleshooting.",
      "Windows/Linux Operations: Performed patching, service checks, backup/restore, and general systems maintenance.",
      "Troubleshooting: Investigated system, network, and application incidents using logs."
    ]
  },
  {
    id: "airin-pars-media",
    company: "Airin Pars Media",
    role: "Network Technician",
    location: "Shiraz, Iran",
    period: "Sep 2017 - Feb 2021",
    bullets: [
      "Supported multi-site LAN/WAN infrastructure across routing, switching, VPNs, firewall policies, network segmentation, and access-control changes using Ubiquiti and MikroTik equipment.",
      "Diagnosed outages, connectivity, and access issues with Wireshark, logs, firewall-rule reviews, and network diagnostics; documented configuration changes and resolutions."
    ]
  }
];

export const PROJECTS: ProjectData[] = [
  {
    id: "secure-infra",
    title: "Security & Infrastructure Homelab",
    subtitle: "Primary security and infrastructure project",
    period: "Feb 2025 - Present",
    repositoryVisibility: "private",
    description: "Build and operate a Linux-based self-hosted environment with controlled service exposure and private remote access.",
    purpose: "Develop deeper hands-on security and infrastructure operations experience in a private lab environment.",
    built: "A Linux-based self-hosted environment using Docker, DNS, reverse proxying, VPN/private remote access, monitoring, backup and recovery, and security-focused service configuration.",
    demonstrates: "Service exposure management, network access control, credential handling, system updates, troubleshooting, monitoring, and recovery documentation.",
    tech: ["Linux", "Docker", "DNS", "Reverse proxy", "VPN", "Monitoring", "Backup and recovery"],
    features: []
  },
  {
    id: "blushtime",
    title: "Blushtime — Family Business Technology Project",
    subtitle: "Private family-business project work",
    period: "Feb 2025 - Aug 2026",
    repositoryVisibility: "private",
    description: "Built and supported a booking and administration platform while helping with operational setup during the business launch.",
    purpose: "Support a family business launch with a practical booking and administration platform.",
    built: "A Next.js and TypeScript platform using Supabase/PostgreSQL, authentication, payments, notifications, integrations, and Cloudflare deployment.",
    demonstrates: "Applied platform development, access-aware workflows, integrations, deployment, troubleshooting, and operational launch support.",
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Authentication", "Payments", "Cloudflare"],
    features: []
  },
  {
    id: "ai-rail",
    title: "AI Rail",
    subtitle: "Supporting public project",
    repositoryVisibility: "public",
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
    subtitle: "Supporting public project",
    repositoryVisibility: "public",
    description: "Translate subtitle files and media-folder subtitles in a controlled Dockerized workflow.",
    purpose: "Translate subtitle files and media-folder subtitles in a controlled Dockerized workflow.",
    built: "A FastAPI app using FFmpeg/ffprobe, OpenAI API, SQLite history, batch jobs, live progress, cancellation, logs, and admin defaults.",
    demonstrates: "Python service design, Dockerized workloads, API integration, job state, media automation, safe demos, and operational logging.",
    tech: ["FastAPI", "Python", "Docker", "SQLite", "FFmpeg/ffprobe", "OpenAI API", "REST APIs", "Cloudflare Pages demo"],
    features: [],
    githubUrl: "https://github.com/afshinsb/universal-subtitle-translator",
    liveUrl: "https://translate.theafshin.com/"
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
      "Backup and restore validation"
    ]
  },
  {
    title: "Identity & Secure Access",
    iconName: "Lock",
    skills: [
      "Microsoft 365 user administration",
      "Permissions and MFA support",
      "Authentication and access troubleshooting",
      "VPN and private remote access",
      "Credentials and service exposure management"
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
  "Tell me about your security and infrastructure background.",
  "Why are you moving deeper into Security Operations?",
  "What did you do as a Systems Administrator?",
  "How does your networking background apply to security?",
  "Tell me about your Security & Infrastructure Homelab.",
  "What was your role in the Blushtime project?",
  "What have you been working on since early 2025?",
  "What security or infrastructure roles are the best fit?"
];
