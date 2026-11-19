import { renderToString } from "react-dom/server";
import { App, getProject } from "./App";
import { site, projects } from "./content/projects";

export const paths = ["/", ...projects.map((p) => `/projects/${p.slug}/`)];
export function render(path: string) {
  const project = getProject(path);
  const home = path === "/";
  const title = home ? site.title : project ? `${project.name} | Afshin Saberi` : "Page not found | Afshin Saberi";
  const description = project?.description ?? site.description;
  const canonical = site.url + path;
  const image = `${site.url}/social.png`;
  const schema = home ? {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: site.email,
    jobTitle: "Software Developer",
    workLocation: { "@type": "City", name: "Toronto" },
    sameAs: [site.github, site.linkedin],
    knowsAbout: ["Python", "Backend Engineering", "Large Language Model Applications"],
  } : project ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.name,
    description,
    url: canonical,
    author: { "@type": "Person", name: site.name, url: site.url },
    image,
  } : null;
  return { html: renderToString(<App path={path} />), title, description, canonical, image, schema };
}
