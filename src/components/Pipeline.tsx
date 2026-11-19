import { useState } from "react";
import { AudioLines, Braces, Captions, Check, FileOutput, Layers3, RotateCcw, Waypoints } from "lucide-react";
import { projects } from "../content/projects";

const stages = projects[0].architecture;
const icons = [Captions, Layers3, AudioLines, Braces, RotateCcw, FileOutput];
const examples = [
  ["English source", "We can start here.", "French subtitle", "On peut commencer ici."],
  ["Cue ID", "cue 12", "Source text", "We can start here."],
  ["Request", "cue 12 · English → French", "Model response", "On peut commencer ici."],
  ["Expected ID", "cue 12", "Validation", "ID matches · text present"],
  ["Example failure", "cue 12 · empty text", "Repair response", "On peut commencer ici."],
  ["00:00:02.125", "We can start here.", "00:00:02.125", "On peut commencer ici."],
];

export function Pipeline({ expanded = false }: { expanded?: boolean }) {
  const [active, setActive] = useState(2);
  const [labelOne, first, labelTwo, second] = examples[active];
  return (
    <figure className={`pipeline ${expanded ? "pipeline-expanded" : ""}`} aria-label="Subtitle translation pipeline">
      <div className="pipeline-top">
        <span className="pipeline-title"><Waypoints size={17} aria-hidden="true" /> Subtitle translation</span>
        <span className="pipeline-sample">Sample data</span>
      </div>
      <div className="pipeline-body">
        <div className="stage-rail" role="group" aria-label="Pipeline stages">
          {stages.map(([name], i) => {
            const Icon = icons[i];
            return <button key={name} type="button" className="stage" aria-pressed={active === i} onClick={() => setActive(i)}>
              <span className="stage-icon"><Icon aria-hidden="true" size={18} strokeWidth={1.7} /></span>
              <span>{name}</span>
            </button>;
          })}
        </div>
        <div className="pipeline-detail" aria-live="polite" aria-atomic="true">
          <div className="pipeline-examples">
            <div><span>{labelOne}</span><p>{first}</p></div>
            <div><span>{labelTwo}</span><p>{second}</p></div>
          </div>
          <p className="pipeline-stage-caption"><Check size={14} aria-hidden="true" /> {expanded ? stages[active][1] : "Original cue timing stays with the source."}</p>
        </div>
      </div>
    </figure>
  );
}
