import { Activity, Bot, ChartNoAxesCombined, Database, FileText, GitPullRequest, Layers3, Workflow } from "lucide-react";
import { Pipeline } from "./Pipeline";

const diagrams = {
  "ai-rail": { icon: GitPullRequest, words: ["Issue", "Review", "Verify"], color: "graph-violet" },
  "model-frontier": { icon: ChartNoAxesCombined, words: ["Sources", "Validate", "Compare"], color: "graph-blue" },
  "tikbomb": { icon: Activity, words: ["Collect", "Isolate", "Display"], color: "graph-rose" },
  "docshape": { icon: FileText, words: ["Edit", "Index", "Render"], color: "graph-blue" },
  "blushtime": { icon: Database, words: ["Book", "Persist", "Notify"], color: "graph-rose" },
  "recruiter-assistant": { icon: Bot, words: ["Question", "Select topic", "Public answer"], color: "graph-violet" },
} as const;

export function ProjectVisual({ slug }: { slug: string }) {
  if (slug === "universal-subtitle-translator") return <Pipeline expanded />;
  const diagram = diagrams[slug as keyof typeof diagrams];
  if (!diagram) return null;
  const Icon = diagram.icon;
  return <div className={`project-graphic ${diagram.color}`} aria-hidden="true">
    <div><Layers3 size={19} /><span>{diagram.words[0]}</span></div>
    <div><Icon size={23} /><span>{diagram.words[1]}</span></div>
    <div><Workflow size={19} /><span>{diagram.words[2]}</span></div>
  </div>;
}
