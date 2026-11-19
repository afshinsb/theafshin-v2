import type { WorkExperience, ProjectData, SkillCategory } from "./types";

export const PERSONAL_INFO = {
  name: "Afshin Saberi",
  title: "Software Developer | Applied AI, LLM Applications & Python Backend Engineering",
  location: "Toronto, Ontario, Canada",
  email: "contact@theafshin.com",
  linkedin: "https://linkedin.com/in/theafshin",
  github: "https://github.com/afshinsb",
  portfolio: "https://theafshin.com",
  summary: [
    "I’m a Toronto-based software developer focused on Python applications, LLM integrations, backend systems, and engineering automation.",
    "I build AI features into software with validation, automated tests, and deployment in mind. My systems administration background informs how I design for reliability, security, and maintainability.",
  ],
};

export const EDUCATION = {
  degree: "MEng in Information Systems Security",
  institution: "Concordia University",
  period: "May 2022 – Dec 2023",
  focus: "Coursework covered cryptographic protocols, network and operating system security, and security evaluation.",
};

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: "private-employer",
    company: "Private Employer",
    role: "Systems Administrator",
    location: "Montreal, QC",
    period: "Jan 2023 – Jan 2025",
    bullets: [
      "Managed Microsoft 365 accounts, permissions, and MFA, and resolved authentication and access issues.",
      "Supported VPN, firewall, and DNS troubleshooting for remote access.",
      "Maintained Windows and Linux systems through patching, health checks, and backup and restore work.",
      "Used logs to investigate system, network, and application incidents.",
    ],
  },
  {
    id: "airin-pars-media",
    company: "Airin Pars Media",
    role: "Network Technician",
    location: "Shiraz, Iran",
    period: "Sep 2017 – Feb 2021",
    bullets: [
      "Supported routing, switching, VPNs, firewall policies, segmentation, and access control across multiple sites.",
      "Diagnosed connectivity and access issues with Wireshark and logs, and documented configuration changes and resolutions.",
    ],
  },
];

export const PROJECTS = {
  subtitleTranslator: {
    title: "Universal Subtitle Translator",
    subtitle: "Python backend and LLM integration",
    description: "A FastAPI service that extracts subtitles with FFmpeg and translates subtitle files or media folders in batches through the OpenAI API.",
    details: "Validates structured replies against source cue IDs to catch missing, duplicate, or misaligned translations. Retries failed batches and records interrupted jobs in SQLite. Includes automated tests and Docker deployment.",
    tech: ["Python", "FastAPI", "OpenAI API", "FFmpeg", "SQLite", "Docker", "pytest"],
    githubUrl: "https://github.com/afshinsb/universal-subtitle-translator",
    liveUrl: "https://translate.theafshin.com/",
  },
  aiRail: {
    title: "AI Rail",
    subtitle: "Python CLI and engineering automation",
    description: "A local Python CLI that scopes AI-assisted coding to one GitHub issue at a time and prepares prompts and review packs for existing coding tools.",
    details: "Runs project checks and records a verified snapshot so the release step can detect changes made after verification.",
    tech: ["Python", "Git", "GitHub Issues", "GitHub CLI", "pytest", "pipx"],
    githubUrl: "https://github.com/afshinsb/ai-rail",
  },
  recruiterChat: {
    title: "Portfolio AI Recruiter Chatbot",
    subtitle: "LLM application and API design",
    description: "A recruiter Q&A built with TypeScript and Cloudflare Pages Functions. It uses the OpenAI Responses API to match questions to reviewed portfolio answers.",
    details: "Validates requests and answer selections, enforces per-IP and daily quotas with Cloudflare KV, and limits replies to approved professional information.",
    tech: ["TypeScript", "Cloudflare Pages Functions", "Cloudflare KV", "OpenAI Responses API", "Zod"],
    githubUrl: "https://github.com/afshinsb/theafshin-v2",
  },
  modelFrontier: {
    title: "Model Frontier",
    subtitle: "AI model comparison dashboard",
    description: "A React and TypeScript dashboard for exploring published AI model measurements with filters, plots, and side-by-side comparisons.",
    details: "Uses validated data schemas and retains source provenance so readers can see which measurements are comparable.",
    tech: ["React", "TypeScript", "Zod"],
  },
  docShape: {
    title: "DocShape",
    subtitle: "Document rendering and export",
    description: "A document layout and export tool with a React editor and a server-side browser renderer for PDF output.",
    details: "Separates the editing view from the export renderer and tests the layout and rendering behavior.",
    tech: ["React", "TypeScript", "Cloudflare Workers", "Vitest"],
  },
  blushtime: {
    title: "Blushtime",
    subtitle: "Booking and administration software",
    description: "A Next.js and TypeScript application for booking and appointment administration.",
    details: "Validates booking requests and supports authenticated administration and appointment status changes with PostgreSQL.",
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Cloudflare"],
  },
  homelab: {
    title: "Security & Infrastructure Homelab",
    subtitle: "Systems reliability practice",
    description: "An independent Linux and Docker lab for practicing deployment, service monitoring, troubleshooting, and backup and recovery.",
    tech: ["Linux", "Docker", "Monitoring", "Backup and recovery"],
  },
} satisfies Record<string, ProjectData>;

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Applied AI & Python",
    skills: ["Python", "LLM API integration", "Structured outputs and validation", "Batch processing and retries"],
  },
  {
    title: "Backend & Data",
    skills: ["FastAPI and REST APIs", "TypeScript and Next.js", "SQL, PostgreSQL, and SQLite", "Job state and application workflows"],
  },
  {
    title: "Testing & Delivery",
    skills: ["Automated testing", "Git and GitHub workflows", "Docker and Docker Compose", "Cloudflare Pages and Workers"],
  },
  {
    title: "Infrastructure & Security",
    skills: ["Linux and Windows administration", "DNS, networking, and secure access", "Log-based troubleshooting", "Backup and recovery"],
  },
];

export const SUGGESTED_QUESTIONS = [
  "What AI applications has Afshin built?",
  "What Python and backend experience does he have?",
  "How does his subtitle translator use LLMs?",
  "What does AI Rail do?",
  "Does he have production ML training experience?",
  "How does his infrastructure background support AI engineering?",
  "Which AI and software roles are a good fit?",
  "How can I reach Afshin for an interview?",
];
