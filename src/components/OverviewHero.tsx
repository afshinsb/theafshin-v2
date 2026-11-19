import { useState } from "react";
import { AudioLines, Braces, Captions, Check, FileOutput, Github, Layers3, MessageSquare, RotateCcw, Waypoints } from "lucide-react";
import { PERSONAL_INFO } from "../data";

const stages = [
  { name: "Extract", icon: Captions, before: ["Input", "Subtitle or media file"], after: ["Selected track", "English text cues"], detail: "Prefer a matching SRT sidecar, or extract an embedded text track with FFmpeg." },
  { name: "Batch", icon: Layers3, before: ["Cue ID", "cue 12"], after: ["Source text", "We can start here."], detail: "Group non-empty cues for one model request. Keep the original times with each source cue." },
  { name: "Translate", icon: AudioLines, before: ["Request", "cue 12 · English → French"], after: ["Model response", "On peut commencer ici."], detail: "Send batched text to OpenAI and request a translation for each cue ID." },
  { name: "Validate", icon: Braces, before: ["Expected ID", "cue 12"], after: ["Check", "ID matches · text present"], detail: "Check that the response includes the expected cue IDs and non-empty translated text." },
  { name: "Repair", icon: RotateCcw, before: ["Example failure", "cue 12 · empty text"], after: ["Repair response", "On peut commencer ici."], detail: "Retry incomplete output within set limits and request repairs for missing or empty cues." },
  { name: "Export", icon: FileOutput, before: ["00:00:02.125", "We can start here."], after: ["00:00:02.125", "On peut commencer ici."], detail: "Write a UTF-8 SRT with the original dialogue timing and record the result in SQLite." },
] as const;

function SubtitlePipeline() {
  const [active, setActive] = useState(2);
  const { before, after, detail } = stages[active];

  return (
    <figure className="subtitle-pipeline" aria-labelledby="pipeline-label">
      <figcaption className="pipeline-header">
        <span id="pipeline-label"><Waypoints size={18} aria-hidden="true" /> Subtitle translation</span>
        <span className="pipeline-sample">Sample data</span>
      </figcaption>
      <div className="pipeline-body">
        <div className="pipeline-stages" role="group" aria-label="Translation stages">
          {stages.map(({ name, icon: Icon }, index) => (
            <button
              key={name}
              type="button"
              aria-pressed={index === active}
              aria-controls="pipeline-output"
              data-passed={index < active ? "" : undefined}
              onClick={() => setActive(index)}
            >
              <span className="pipeline-node"><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></span>
              <span>{name}</span>
            </button>
          ))}
        </div>
        <div id="pipeline-output" className="pipeline-output" aria-live="polite" aria-atomic="true">
          <div key={active} className="pipeline-sample-detail">
            <dl>
              <div><dt>{before[0]}</dt><dd>{before[1]}</dd></div>
              <div><dt>{after[0]}</dt><dd>{after[1]}</dd></div>
            </dl>
            <p><Check size={15} aria-hidden="true" />{detail}</p>
          </div>
        </div>
      </div>
    </figure>
  );
}

export function OverviewHero({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <section className="overview-hero" aria-labelledby="overview-title">
      <div className="portfolio-shell hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">Software developer · Toronto</p>
          <h1 id="overview-title">Software that makes <em>AI useful.</em></h1>
          <p className="hero-description">{PERSONAL_INFO.summary}</p>
          <div className="hero-actions">
            <a className="site-button site-button-primary" href="#projects">Explore projects</a>
            <a className="site-button site-button-secondary" href={PERSONAL_INFO.github}><Github size={18} aria-hidden="true" /> GitHub</a>
          </div>
          <button className="hero-chat" type="button" onClick={onOpenChat}><MessageSquare size={17} aria-hidden="true" /> Open Recruiter Q&amp;A</button>
        </div>
        <div className="hero-visual">
          <SubtitlePipeline />
          <div className="pipeline-credit">
            <span>From Universal Subtitle Translator</span>
            <a href="#subtitle-translator">See the project</a>
          </div>
        </div>
      </div>
    </section>
  );
}
