import { PROJECTS } from "../data";
import type { ProjectData } from "../types";

export function ProjectCards() {
  return (
    <div className="portfolio-project-list">
      {Object.entries(PROJECTS).map(([key, project]: [string, ProjectData]) => (
        <article key={key} className="portfolio-project-card">
          <header className="portfolio-project-heading">
            <h3>{project.title}</h3>
            <p>{project.subtitle}</p>
            {project.githubUrl && (
              <a className="portfolio-project-link" href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} on GitHub`}>
                GitHub
              </a>
            )}
          </header>
          <div className="portfolio-project-description">
            <p>{project.description}</p>
            {project.details && <p>{project.details}</p>}
          </div>
          <ul className="portfolio-project-stack" aria-label="Technologies">
            {project.tech.map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
        </article>
      ))}
    </div>
  );
}
