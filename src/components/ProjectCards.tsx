import {
  Activity, AudioLines, Bot, Braces, CalendarDays, Captions, ChartNoAxesCombined, CheckCircle,
  Database, FileOutput, FileText, GitPullRequest, Github, HardDriveDownload, Layers3, MessageSquare,
  Server, Shield, SquarePen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PROJECTS } from "../data";
import type { ProjectData } from "../types";

type Diagram = {
  color: "violet" | "blue" | "rose";
  steps: readonly [[string, LucideIcon], [string, LucideIcon], [string, LucideIcon]];
};

const diagrams: Record<keyof typeof PROJECTS, Diagram> = {
  subtitleTranslator: {
    color: "violet",
    steps: [["Extract", Captions], ["Translate", AudioLines], ["Validate & export", FileOutput]],
  },
  aiRail: {
    color: "violet",
    steps: [["Scope issue", GitPullRequest], ["Review diff", FileText], ["Verify", CheckCircle]],
  },
  recruiterChat: {
    color: "violet",
    steps: [["Question", MessageSquare], ["Select topic", Bot], ["Public answer", Shield]],
  },
  modelFrontier: {
    color: "blue",
    steps: [["Read sources", Layers3], ["Validate", Braces], ["Compare", ChartNoAxesCombined]],
  },
  docShape: {
    color: "blue",
    steps: [["Edit layout", SquarePen], ["Render", FileText], ["Export PDF", FileOutput]],
  },
  blushtime: {
    color: "rose",
    steps: [["Book", CalendarDays], ["Store appointment", Database], ["Manage status", CheckCircle]],
  },
  homelab: {
    color: "blue",
    steps: [["Deploy", Server], ["Monitor", Activity], ["Back up", HardDriveDownload]],
  },
};

export function ProjectCards() {
  const keys = Object.keys(PROJECTS) as (keyof typeof PROJECTS)[];

  return (
    <div className="portfolio-project-grid">
      {keys.map((key) => {
        const project: ProjectData = PROJECTS[key];
        const { color, steps } = diagrams[key];

        return (
          <article key={key} className="portfolio-project-card">
            <ol className={`portfolio-project-diagram portfolio-project-diagram--${color}`} aria-label={`${project.title} workflow`}>
              {steps.map(([label, Icon]) => (
                <li key={label}><Icon size={21} aria-hidden="true" /><span>{label}</span></li>
              ))}
            </ol>
            <div className="portfolio-project-copy">
              <p className="portfolio-project-discipline">{project.subtitle}</p>
              <h3>{project.title}</h3>
              <div className="portfolio-project-description">
                <p>{project.description}</p>
                {project.details && <p>{project.details}</p>}
              </div>
              <ul className="portfolio-project-stack" aria-label="Technologies">
                {project.tech.map((tech) => <li key={tech}>{tech}</li>)}
              </ul>
              {project.githubUrl && (
                <a className="portfolio-project-link" href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} on GitHub`}>
                  <Github size={16} aria-hidden="true" /> GitHub
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
