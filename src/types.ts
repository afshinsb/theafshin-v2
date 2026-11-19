export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface ProjectData {
  title: string;
  subtitle: string;
  description: string;
  details?: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
