export const site = {
  name: "Afshin Saberi",
  url: "https://theafshin.com",
  email: "contact@theafshin.com",
  github: "https://github.com/afshinsb",
  linkedin: "https://linkedin.com/in/theafshin",
  title: "Afshin Saberi | Applied AI & Python Developer in Toronto",
  description: "Toronto software developer building practical LLM applications, Python backends, and tools for reliable software delivery. Explore the code and architecture.",
} as const;

export const filters = ["All projects", "Applied AI", "Python", "TypeScript", "Developer tools"] as const;
export type ProjectFilter = (typeof filters)[number];

type Link = { label: string; href: string };
type Project = {
  slug: string;
  name: string;
  discipline: string;
  description: string;
  stack: string[];
  filters: ProjectFilter[];
  problem: string;
  approach: string;
  architecture: [name: string, detail: string][];
  evidence: string;
  links: Link[];
  image?: { src: string; alt: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    slug: "universal-subtitle-translator",
    name: "Universal Subtitle Translator",
    discipline: "Applied AI · Python backend",
    description: "A Python service that extracts and translates subtitles with OpenAI while preserving dialogue timing, even when model output needs repair.",
    stack: ["Python", "FastAPI", "OpenAI", "FFmpeg", "SQLite", "Docker"],
    filters: ["Applied AI", "Python"],
    problem: "Translating a subtitle file takes more than translating its text. A dropped cue or shifted timestamp can make the result unusable, and a failed file should be visible when processing a media folder.",
    approach: "Group non-empty cues into batches with stable identifiers. Check translated IDs and values before merging them with the original timing. Request bounded repairs for missing or empty translations, then write the SRT atomically. FastAPI exposes job progress and cancellation, and SQLite records job state and logs.",
    architecture: [
      ["Extract", "Read a supplied SRT, prefer an available sidecar, or use FFmpeg to extract an eligible embedded text track."],
      ["Batch", "Group non-empty cues with stable IDs. Keep dialogue timestamps with the source cues."],
      ["Translate", "Send batched text to the configured OpenAI model and request translations keyed by cue ID."],
      ["Validate", "Align returned IDs with source cues and check for missing or empty text."],
      ["Repair", "Retry within a bounded policy and request repairs before accepting incomplete batches."],
      ["Export", "Write UTF-8 SRT atomically with original dialogue timing. Update job state and logs in SQLite."],
    ],
    evidence: "The repository’s 1.8.2 verification report records 79 passing tests on both Python 3.10 and 3.12. A smoke test with real FFmpeg, SQLite and a mocked model transport verified full-track selection and exact dialogue timing.",
    links: [
      { label: "Repository", href: "https://github.com/afshinsb/universal-subtitle-translator" },
      { label: "Verification report", href: "https://github.com/afshinsb/universal-subtitle-translator/blob/16422fb80fe9e6578d0953684e09d9009140dc16/docs/AUDIT-1.8.2.md" },
      { label: "Project demo", href: "https://translate.theafshin.com/" },
    ],
    image: { src: "/projects/subtitle-translator.webp", alt: "Universal Subtitle Translator application interface with a media upload form and a folder translation option", width: 1440, height: 690 },
  },
  {
    slug: "ai-rail",
    name: "AI Rail",
    discipline: "Python · Developer tools",
    description: "A local Python CLI that gives AI-assisted coding a scoped GitHub issue, a review checkpoint, and a repeatable release workflow.",
    stack: ["Python", "Git", "GitHub CLI", "pytest"],
    filters: ["Python", "Developer tools"],
    problem: "AI-assisted edits are harder to resume and review when the current task, diff and quality checks live in separate tools.",
    approach: "Use GitHub Issues as task inputs. Produce local handoff prompts and review packs, then tie verification to the reviewed repository state. The developer brings their own coding assistant and controls the release.",
    architecture: [
      ["Scope", "Select one GitHub issue and record the agreed boundaries."],
      ["Review", "Generate a review pack from the current diff and local project context."],
      ["Verify", "Run configured checks and record what was reviewed."],
      ["Release", "Check the verified state before the developer ships the change."],
    ],
    evidence: "The public test suite exercises issue selection, verification, and Git safety checks. The project publishes its Python test workflow on GitHub Actions.",
    links: [
      { label: "Repository", href: "https://github.com/afshinsb/ai-rail" },
      { label: "Test workflow", href: "https://github.com/afshinsb/ai-rail/actions/workflows/tests.yml" },
    ],
    image: { src: "/projects/ai-rail.webp", alt: "AI Rail project diagram showing an issue moving through implementation, review and release", width: 1200, height: 675 },
  },
  {
    slug: "model-frontier",
    name: "Model Frontier",
    discipline: "Applied AI · Data visualization",
    description: "A comparison dashboard for exploring the cost and capability of AI model configurations with evidence-aware filters.",
    stack: ["React", "TypeScript", "Data validation"],
    filters: ["Applied AI", "TypeScript"],
    problem: "Headline scores hide the differences between model configurations and the workloads that produced a result.",
    approach: "Validate candidate datasets before review. Keep the scatter plot, table and comparison tray on the same filtered dataset, and surface provenance and compatibility rules beside the observations.",
    architecture: [
      ["Ingest", "Validate canonical records and retain source references."],
      ["Review", "Inspect dataset changes and release a reviewed version."],
      ["Compare", "Filter configurations across the plot and table and compare compatible observations."],
    ],
    evidence: "Source tests cover dataset contracts, filter behavior, CSV export and comparison logic. The dataset and results are private.",
    links: [],
  },
  {
    slug: "tikbomb",
    name: "TIKBOMB",
    discipline: "Desktop · Developer tools",
    description: "A native Windows widget for viewing Codex usage allowances with asynchronous reads and account-separated state.",
    stack: ["C#", ".NET", "Windows"],
    filters: ["Developer tools"],
    problem: "Developers need a quick view of usage without opening a dashboard or confusing stale values with current allowances.",
    approach: "Separate collection from the widget display, keep readings distinct by account, and represent unavailable values explicitly. Offer compact display formats for different desktop layouts.",
    architecture: [
      ["Collect", "Poll for usage asynchronously."],
      ["Isolate", "Maintain account-specific reading and availability state."],
      ["Display", "Render the state in gauges, compact cards and a taskbar view."],
    ],
    evidence: "The private source includes build and installer verification scripts.",
    links: [],
  },
  {
    slug: "docshape",
    name: "DocShape",
    discipline: "Web platform · Document tooling",
    description: "A file-first document development workspace with revision-aware editing and browser-rendered previews.",
    stack: ["TypeScript", "React", "Cloudflare"],
    filters: ["TypeScript", "Developer tools"],
    problem: "Document source, preview and revision history can drift when each lives in a different tool.",
    approach: "Treat source files as the document’s authoritative content. Track file revisions and checkpoints, derive a rebuildable index, and render persisted source in a browser for inspection and export.",
    architecture: [
      ["Edit", "Update source with revision checks."],
      ["Index", "Rebuild an index of document structure from saved files."],
      ["Render", "Open persisted source in a browser for layout inspection and PDF export."],
    ],
    evidence: "The private source includes workspace, rendering, revision, and authorization tests.",
    links: [],
  },
  {
    slug: "blushtime",
    name: "Blushtime",
    discipline: "Project-based work · Business software",
    description: "A booking and administration application that integrates scheduling, authentication, payments and transactional notifications.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],
    filters: ["TypeScript"],
    problem: "Booking changes need to stay consistent across customer-facing flows, administration and external integrations.",
    approach: "Use a PostgreSQL-backed booking workflow with separate authenticated administration. Handle payment and notification integrations around booking state changes.",
    architecture: [
      ["Book", "Collect the reservation through a customer-facing flow."],
      ["Persist", "Store and manage booking state in PostgreSQL."],
      ["Notify", "Connect the relevant workflow changes to payment and notification integrations."],
    ],
    evidence: "The private source includes checks for booking concurrency, time zones and transactional notifications.",
    links: [],
  },
  {
    slug: "recruiter-assistant",
    name: "Portfolio Recruiter Assistant",
    discipline: "Applied AI · Serverless APIs",
    description: "A recruiter Q&A tool that uses a server-side LLM to select answers from a curated set of public portfolio facts.",
    stack: ["React", "TypeScript", "OpenAI", "Cloudflare Pages", "D1"],
    filters: ["Applied AI", "TypeScript"],
    problem: "Recruiters may want to ask a specific technical question without reading every case study. Answers need to stay grounded and provider spending needs a hard ceiling.",
    approach: "Bound the request, apply per-visitor quotas, and reserve a global budget slot atomically before inference. Ask the model to return a topic identifier. Map valid identifiers to reviewed public answers and links on the server.",
    architecture: [
      ["Validate", "Check request origin, payload size and shape."],
      ["Reserve", "Apply visitor limits and reserve a daily slot in D1."],
      ["Classify", "Ask OpenAI to select a public answer topic."],
      ["Respond", "Return the reviewed answer with approved links."],
    ],
    evidence: "Automated tests exercise response allowlisting, quota handling, request validation and generic provider failures.",
    links: [{ label: "Try the assistant", href: "/#assistant" }],
  },
];
