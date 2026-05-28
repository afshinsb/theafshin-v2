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
  summary: "IT professional with 8+ years of experience in systems administration and network operations, with a strong focus on security. Skilled in monitoring alerts, investigating incidents, and managing access controls across Windows and Linux environments. Hands-on experience supporting incident response processes, including triage, escalation, and log-based troubleshooting. Experienced in scripting automation and log analysis to improve system reliability and security posture."
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
    subtitle: "Enterprise-grade sandboxing & containerization",
    description: "Built and maintained a highly secure, self-hosted Linux container cluster showcasing secure private exposure and automated operations management.",
    tech: ["Docker Compose", "Cloudflare Tunnel", "Linux", "KVM/libvirt", "Tailscale VPN", "Reverse Proxy"],
    features: [
      "Secured controlled service exposure with Cloudflare Tunnels (bypassing open-port ingress firewalls) and private Tailscale coordination.",
      "Created isolated, hypervisor-managed KVM/libvirt Ubuntu testing nodes for risk-free sandboxing and malicious deployment testing.",
      "Integrated systematic backup pipelines, automated patching templates, runtime monitoring alerts, and container health loops."
    ],
    githubUrl: "https://github.com/afshinsb/homelab-infra"
  },
  {
    id: "subtitle-translator",
    title: "Universal Subtitle Translator",
    subtitle: "Dockerized Translation Pipeline App (Live Demo Available)",
    description: "Architected a fully Dockerized FastAPI automation service to perform batch file translation with robust status diagnostics and structured execution pipelines.",
    tech: ["FastAPI", "Python", "Docker", "SQLite", "REST APIs", "Structured Logging", "OAuth"],
    features: [
      "Created containerized Python workers with secure configurations, default auth safeguards, and isolated SQLite job histories.",
      "Constructed a rich backend supporting async stream batch processing, real-time job progress tracking, and on-demand job cancellation.",
      "Published modular documentation and container registries on GitHub, keeping direct code execution distinct from a safe, frontend static sandbox."
    ],
    githubUrl: "https://github.com/afshinsb/universal-subtitle-translator",
    liveUrl: "https://translate.theafshin.com/"
  },
  {
    id: "voxa",
    title: "Voxa",
    subtitle: "Multi-Provider AI Voice Studio & Narrative Generator",
    description: "Developed a multi-provider AI voice studio for writing, refining, and generating natural narration with robust provider-specific adapters and zero client-exposed keys.",
    tech: ["Next.js", "TypeScript", "OpenAI API", "Gemini API", "ElevenLabs", "IndexedDB", "Docker Compose", "Tailwind CSS"],
    features: [
      "Integrates OpenAI, Gemini (experimental expressive provider), SevenLabs/ElevenLabs, and mock local testing routes server-side.",
      "Configured six distinct voice characters (Chloe, Vivian, Mia, Titan, Vincent, Adam) mapped with 8 configurable tonalities.",
      "Implemented offline-first browser features, storing and caching historical generations in IndexedDB alongside a persistent playback dock.",
      "Supports integrated flow for Persian and English text rewriting or translation before initiating the text-to-speech request."
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
      "Linux Administration (CentOS/Ubuntu/RedHat)",
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
