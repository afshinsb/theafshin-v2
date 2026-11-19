import { useState } from "react";
import { AudioLines, Braces, Captions, Check, FileOutput, Layers3, RotateCcw, Waypoints } from "lucide-react";

const stages = [
  {
    name: "Extract",
    Icon: Captions,
    examples: [["English source", "We can start here."], ["French subtitle", "On peut commencer ici."]],
    explanation: "Read a supplied SRT, prefer an available sidecar, or use FFmpeg to extract an eligible embedded text track.",
  },
  {
    name: "Batch",
    Icon: Layers3,
    examples: [["Cue ID", "cue 12"], ["Source text", "We can start here."]],
    explanation: "Group non-empty cues with stable IDs. Keep dialogue timestamps with the source cues.",
  },
  {
    name: "Translate",
    Icon: AudioLines,
    examples: [["Request", "cue 12 · English → French"], ["Model response", "On peut commencer ici."]],
    explanation: "Send batched text to the configured OpenAI model and request translations keyed by cue ID.",
  },
  {
    name: "Validate",
    Icon: Braces,
    examples: [["Expected ID", "cue 12"], ["Validation", "ID matches · text present"]],
    explanation: "Align returned IDs with source cues and check for missing or empty text.",
  },
  {
    name: "Repair",
    Icon: RotateCcw,
    examples: [["Example failure", "cue 12 · empty text"], ["Repair response", "On peut commencer ici."]],
    explanation: "Retry within a bounded policy and request repairs before accepting incomplete batches.",
  },
  {
    name: "Export",
    Icon: FileOutput,
    examples: [["00:00:02.125", "We can start here."], ["00:00:02.125", "On peut commencer ici."]],
    explanation: "Write UTF-8 SRT atomically with original dialogue timing. Update job state and logs in SQLite.",
  },
];

export function SubtitlePipeline() {
  const [active, setActive] = useState(2);
  const stage = stages[active];

  return (
    <figure className="subtitle-pipeline" aria-labelledby="subtitle-pipeline-title">
      <figcaption className="subtitle-pipeline__header">
        <span id="subtitle-pipeline-title"><Waypoints size={18} aria-hidden="true" /> Subtitle Translation Pipeline</span>
        <span className="subtitle-pipeline__sample">Sample data</span>
      </figcaption>
      <div className="subtitle-pipeline__body">
        <div className="subtitle-pipeline__rail" role="group" aria-label="Pipeline stages">
          {stages.map(({ name, Icon }, index) => (
            <button key={name} type="button" aria-pressed={index === active} onClick={() => setActive(index)}>
              <span className="subtitle-pipeline__icon"><Icon size={19} aria-hidden="true" /></span>
              {name}
            </button>
          ))}
        </div>
        <div className="subtitle-pipeline__detail" aria-live="polite" aria-atomic="true">
          <dl className="subtitle-pipeline__examples">
            {stage.examples.map(([label, example], index) => (
              <div key={index}>
                <dt>{label}</dt>
                <dd>{example}</dd>
              </div>
            ))}
          </dl>
          <p className="subtitle-pipeline__explanation"><Check size={15} aria-hidden="true" /> {stage.explanation}</p>
        </div>
      </div>
    </figure>
  );
}
