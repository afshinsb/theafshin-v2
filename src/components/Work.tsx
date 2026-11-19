import { useState } from "react";
import { filters, projects, type ProjectFilter } from "../content/projects";
import { ProjectVisual } from "./ProjectVisual";

export function Stack({ stack }: { stack: string[] }) {
  return <ul className="stack" aria-label="Technologies">{stack.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function Work() {
  const [filter, setFilter] = useState<ProjectFilter>("All projects");
  const visible = projects.filter((project) => filter === "All projects" || project.filters.includes(filter));
  return <section className="section work-section" id="work">
    <div className="shell">
      <div className="section-heading">
        <p className="eyebrow"><span /> Project case studies</p>
        <h2>Selected engineering work</h2>
        <p>Explore the architecture, trade-offs, and evidence behind each project.</p>
      </div>
      <div className="filters" role="group" aria-label="Filter projects">
        {filters.map((choice) => <button key={choice} type="button" aria-pressed={filter === choice} onClick={() => setFilter(choice)}>{choice}</button>)}
      </div>
      <span className="sr-only" role="status">{visible.length} projects shown</span>
      <div className="project-grid">
        {visible.map((project) => {
          const flagship = project.slug === projects[0].slug;
          return <article className={flagship ? "project-card flagship" : "project-card"} key={project.slug}>
            <div className="project-copy">
              <p className="discipline">{project.discipline}</p>
              <h3><a href={`/projects/${project.slug}/`}>{project.name}</a></h3>
              <p className="project-description">{project.description}</p>
              <Stack stack={project.stack} />
              <a className="text-link" href={`/projects/${project.slug}/`} aria-label={`Read case study for ${project.name}`}>Read case study</a>
            </div>
            <ProjectVisual slug={project.slug} />
          </article>;
        })}
      </div>
      <p className="additional-work">Explore <a className="text-link" href="https://github.com/afshinsb/voxa">Voxa</a> on GitHub, a prerelease AI narration studio with multiple voice providers.</p>
    </div>
  </section>;
}
