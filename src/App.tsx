import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { Braces, Cpu, GraduationCap, MapPin, MessageSquare, Server, Workflow } from "lucide-react";
import { site, projects } from "./content/projects";
import { capabilities, background } from "./content/profile";
import { Brand, SiteHeader } from "./components/SiteHeader";
import { Pipeline } from "./components/Pipeline";
import { ProjectVisual } from "./components/ProjectVisual";
import { Stack, Work } from "./components/Work";
import { GithubIcon, LinkedInIcon } from "./components/Icons";
import { Contact } from "./components/Contact";

const Chat = lazy(() => import("./components/Chat"));
const capabilityIcons = [Cpu, Server, Braces, Workflow, GraduationCap];

class AssistantBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p className="assistant-fallback">The assistant is temporarily unavailable. <a href="#work">Explore the project case studies.</a></p> : this.props.children;
  }
}

function Assistant() {
  const item = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const node = item.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) { setActive(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setActive(true); observer.disconnect(); }
    }, { rootMargin: "240px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const fallback = <div className="assistant-fallback" role="status">Loading the recruiter assistant…</div>;
  return <section className="section assistant-section" id="assistant" ref={item}>
    <div className="shell assistant-grid">
      <div className="section-heading">
        <p className="eyebrow"><span /> Recruiter Q&A</p>
        <h2>Ask about my work.</h2>
        <p>Get a concise answer about a project, a technical decision, or my background. The assistant uses reviewed public portfolio information.</p>
        <a className="text-link" href="/projects/recruiter-assistant/">Read how it works</a>
      </div>
      <AssistantBoundary><Suspense fallback={fallback}>{active ? <Chat /> : fallback}</Suspense></AssistantBoundary>
    </div>
  </section>;
}

function Home() {
  return <>
    <section className="hero">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Software developer · Applied AI</p>
          <h1>Software that makes <em>AI useful.</em></h1>
          <p className="hero-description">I’m Afshin, a Toronto software developer building Python backends and LLM applications. I bring an infrastructure background to the work of making them reliable.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore projects</a>
            <a className="button button-outline" href={site.github}><GithubIcon size={18} aria-hidden="true" /> GitHub</a>
          </div>
          <a href="#assistant" className="hero-assistant"><MessageSquare size={17} aria-hidden="true" /> Ask my AI assistant</a>
        </div>
        <div className="hero-visual">
          <Pipeline />
          <div className="hero-caption"><span>From the Subtitle Translator case study</span><a href="/projects/universal-subtitle-translator/">See architecture</a></div>
        </div>
      </div>
    </section>
    <Work />
    <section className="section about-section" id="about">
      <div className="shell">
        <div className="about-grid">
          <div className="section-heading">
            <p className="eyebrow"><span /> About</p>
            <h2>From infrastructure to applied AI.</h2>
            <p>Working in systems and networking taught me to think about how software behaves after it ships. Today I build applications and automation with the same focus on validation, troubleshooting, and recovery.</p>
            <p className="location"><MapPin size={17} aria-hidden="true" /> Toronto, Ontario, Canada</p>
          </div>
          <div>
            <ul className="timeline">
              {background.map((item) => <li key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></li>)}
            </ul>
            <div className="education">
              <GraduationCap size={22} aria-hidden="true" />
              <div><h3>Education</h3><p>Master of Engineering, Information Systems Security · Concordia University</p><p>Bachelor of Engineering, Information Technology</p></div>
            </div>
          </div>
        </div>
        <div className="skills">
          <h3>Engineering capabilities</h3>
          <div className="skill-grid">{capabilities.map((item, i) => {
            const Icon = capabilityIcons[i];
            return <article key={item.title}><Icon size={21} aria-hidden="true" /><h4>{item.title}</h4><p>{item.detail}</p></article>;
          })}</div>
        </div>
      </div>
    </section>
    <Assistant />
    <Contact />
  </>;
}

export function getProject(path: string) {
  return projects.find((project) => `/projects/${project.slug}/` === path.replace(/\/?$/, "/"));
}

function CaseStudy({ project }: { project: (typeof projects)[number] }) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <article className="case-study">
    <header className="case-header">
      <div className="shell">
        <a className="text-link" href="/#work">All projects</a>
        <p className="eyebrow"><span /> {project.discipline}</p>
        <h1>{project.name}</h1>
        <p className="case-summary">{project.description}</p>
        <Stack stack={project.stack} />
        {project.links.length > 0 && <div className="case-actions">{project.links.map(({ label, href }) => <a key={href} className="button button-outline" href={href}>{label}</a>)}</div>}
      </div>
    </header>
    <div className="shell case-content">
      <div className="case-overview">
        <div><h2>The problem</h2><p>{project.problem}</p></div>
        <div><h2>Engineering approach</h2><p>{project.approach}</p></div>
      </div>
      <section className="case-architecture">
        <h2>Architecture</h2>
        <ProjectVisual slug={project.slug} />
        <ol>{project.architecture.map(([step, detail]) => <li key={step}><h3>{step}</h3><p>{detail}</p></li>)}</ol>
      </section>
      <section className="case-evidence">
        <h2>Implementation evidence</h2><p>{project.evidence}</p>
        {project.image && <figure><img {...project.image} loading="lazy" decoding="async" /><figcaption>{project.image.alt}</figcaption></figure>}
      </section>
      <div className="case-next"><span>Next project</span><a className="text-link" href={`/projects/${next.slug}/`}>{next.name}</a></div>
    </div>
  </article>;
}

function Footer() {
  return <footer className="site-footer"><div className="shell footer-grid">
    <Brand /><span>Toronto, Canada</span>
    <div><a href={site.github} aria-label="GitHub"><GithubIcon size={20} aria-hidden="true" /></a><a href={site.linkedin} aria-label="LinkedIn"><LinkedInIcon size={20} aria-hidden="true" /></a></div>
  </div></footer>;
}

export function App({ path }: { path: string }) {
  const home = path === "/";
  const project = getProject(path);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader home={home} />
    <main id="main" tabIndex={-1}>
      {home ? <Home /> : project ? <CaseStudy project={project} /> :
        <section className="section shell"><h1>Page not found</h1><p><a className="text-link" href="/">Return to the portfolio</a></p></section>}
    </main>
    <Footer />
  </>;
}
