import type { WorkExperience, ProjectData, SkillCategory } from "./types";

export const PERSONAL_INFO = {
  name: "Afshin Saberi",
  title: "Software Developer | Applied AI, LLM Applications & Python Backend Engineering",
  location: "Toronto, Ontario, Canada",
  email: "contact@theafshin.com",
  linkedin: "https://linkedin.com/in/theafshin",
  github: "https://github.com/afshinsb",
  portfolio: "https://theafshin.com",
  summary: "I’m Afshin. I built a FastAPI subtitle translator that checks and repairs OpenAI output, and a Python CLI that ties AI-assisted changes to GitHub issues and review checks.",
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
    description: "This FastAPI service extracts text tracks with FFmpeg, sends batches of cues to OpenAI, and writes translated SRT files with the original dialogue timing.",
    details: "The service checks each reply against the original cue IDs, retries or repairs incomplete results, and tracks jobs in SQLite. The 1.8.2 report records 79 passing tests on each of Python 3.10 and 3.12, plus a real FFmpeg smoke test using a mocked model transport.",
    tech: ["Python", "FastAPI", "OpenAI API", "FFmpeg", "SQLite", "Docker", "pytest"],
    githubUrl: "https://github.com/afshinsb/universal-subtitle-translator",
    evidence: { label: "Read the verification report", url: "https://github.com/afshinsb/universal-subtitle-translator/blob/16422fb80fe9e6578d0953684e09d9009140dc16/docs/AUDIT-1.8.2.md" },
  },
  aiRail: {
    title: "AI Rail",
    subtitle: "Python CLI and engineering automation",
    description: "This local Python CLI turns one GitHub issue into a scoped handoff and gathers the working diff into a review pack.",
    details: "It records a verified snapshot of the repository state that passed local checks and flags changes made before release.",
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
    description: "This React and TypeScript dashboard keeps the scatter plot, results table, and comparison tray on the same filtered set of model configurations.",
    details: "It validates imported records and shows the sources and compatibility rules behind each comparison.",
    tech: ["React", "TypeScript", "Zod"],
  },
  docShape: {
    title: "DocShape",
    subtitle: "Document rendering and export",
    description: "This document workspace tracks source file revisions and opens saved HTML and CSS in a browser for inspection and PDF export.",
    details: "Separates the editing view from the export renderer and tests the layout and rendering behavior.",
    tech: ["React", "TypeScript", "Cloudflare Workers", "Vitest"],
  },
  blushtime: {
    title: "Blushtime",
    subtitle: "Booking and administration software",
    description: "This project uses Next.js and PostgreSQL for appointment booking and administration.",
    details: "The app validates booking requests and keeps appointment changes in an authenticated admin workflow.",
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
