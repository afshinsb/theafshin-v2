import { useEffect, useRef, useState } from "react";
import { Github, Play } from "lucide-react";

type Stage = "select" | "started" | "verified" | "shipped";

interface AiRailWorkflowLabProps {
  isDarkMode: boolean;
  className?: string;
}

const sampleIssues = [
  {
    id: "21",
    title: "Add backup validation check",
    type: "Infrastructure",
    risk: "Scripts + docs",
    branch: "rail/21-backup-validation-check",
    command: "rail n",
    commit: "fix(backup): add validation check",
    allowedFiles: ["scripts/backup-check.sh", "docs/backup.md", "tests/backup-check.test.js"],
    blockedExamples: [".env", "dist/", "node_modules/", ".rail/state/"]
  },
  {
    id: "22",
    title: "Harden contact API rate-limit handling",
    type: "Security",
    risk: "API route",
    branch: "rail/22-contact-rate-limit",
    command: "rail n",
    commit: "fix(contact): harden rate-limit handling",
    allowedFiles: ["functions/api/contact.ts", "src/lib/contactValidation.ts", "tests/contact-rate-limit.test.ts"],
    blockedExamples: [".env", "dist/", "node_modules/", "private keys"]
  },
  {
    id: "23",
    title: "Update deployment README notes",
    type: "Docs",
    risk: "Low",
    branch: "rail/23-deployment-readme",
    command: "rail n",
    commit: "docs(deploy): update deployment notes",
    allowedFiles: ["README.md", "docs/deployment.md"],
    blockedExamples: [".env", "dist/", "secrets", ".rail/state/"]
  }
];

const reviewChecklist = [
  "Diff captured",
  "Changed files reviewed",
  "Dangerous paths checked",
  "Configured checks passed",
  "Review prompt generated",
  "Verified snapshot saved"
];

const shipTimeline = [
  "Issue branch committed",
  "Default branch synced",
  "Branch merged safely",
  "Default branch pushed",
  "GitHub issue closed",
  "Active state cleared"
];

const introLines = [
  "$ rail resume",
  "No active issue.",
  ".rail/PROJECT.md project brain loaded.",
  "Select one implementation issue, then run rail n.",
  "Simulated safe demo output."
];

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function AiRailWorkflowLab({ isDarkMode, className = "" }: AiRailWorkflowLabProps) {
  const [selectedIssueId, setSelectedIssueId] = useState("21");
  const [stage, setStage] = useState<Stage>("select");
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>(introLines);
  const terminalRef = useRef<HTMLDivElement>(null);

  const selectedIssue = sampleIssues.find((issue) => issue.id === selectedIssueId) || sampleIssues[0];
  const hasStarted = stage === "started" || stage === "verified" || stage === "shipped";
  const hasVerified = stage === "verified" || stage === "shipped";

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
  }, [terminalLines]);

  const c = {
    textTitle: isDarkMode ? "text-white" : "text-zinc-900",
    textMuted: isDarkMode ? "text-zinc-400" : "text-zinc-600",
    accent: isDarkMode ? "text-emerald-400" : "text-sky-700",
    badge: isDarkMode ? "bg-zinc-800 text-zinc-300 border-zinc-700/60" : "bg-zinc-100 text-zinc-800 border-zinc-300/75",
    panel: isDarkMode ? "bg-zinc-950/70 border-zinc-800" : "bg-zinc-50 border-zinc-200",
    terminal: isDarkMode ? "bg-zinc-950 border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-300 text-zinc-800",
    primary: isDarkMode ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950" : "bg-[#0284c7] hover:bg-[#0369a1] text-white",
    secondary: isDarkMode ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300"
  };

  const runLines = async (lines: string[], nextStage?: Stage, clearFirst = false) => {
    if (isRunning) return;
    setIsRunning(true);
    if (clearFirst) setTerminalLines([]);

    for (const line of lines) {
      await wait(260);
      setTerminalLines((current) => [...current, line]);
    }

    if (nextStage) setStage(nextStage);
    setIsRunning(false);
  };

  const startIssue = () => {
    const lines = [
      `$ ${selectedIssue.command}`,
      "alias: rail next --copy",
      `Starting GitHub issue #${selectedIssue.id}: ${selectedIssue.title}`,
      `Branch: ${selectedIssue.branch}`,
      "Interaction model: codex",
      "Scope: one issue only",
      "Project brain: .rail/PROJECT.md",
      "Prompt target: coding agent",
      "Clipboard: implementation prompt prepared",
      "",
      "Prompt preview:",
      `  You are working on GitHub issue #${selectedIssue.id} only.`,
      `  Goal: ${selectedIssue.title}.`,
      "  Stay inside the allowed files.",
      "  Do not commit or close the issue.",
      "  Return changed files, checks run, and review notes."
    ];
    void runLines(lines, "started", true);
  };

  const showAllowedFiles = () => {
    const lines = [
      "$ rail prompt codex --scope",
      "Allowed files:",
      ...selectedIssue.allowedFiles.map((file) => `  + ${file}`),
      "Blocked examples:",
      ...selectedIssue.blockedExamples.map((file) => `  - ${file}`),
      "Rule: no unrelated files, secrets, generated output, or private state."
    ];
    void runLines(lines);
  };

  const verifyGate = () => {
    const lines = [
      "$ rail v",
      "alias: rail verify --copy",
      "Simulated safe demo output:",
      "Review pack: .rail/state/last-review.md",
      "Verified snapshot: .rail/state/last-verify.json",
      ...reviewChecklist.map((item) => `  pass: ${item}`),
      "Checks:",
      "  npm run lint: passed",
      "  npm run build: passed",
      "  unsafe paths: none",
      "  stale diff: none"
    ];
    void runLines(lines, "verified");
  };

  const shipIssue = () => {
    const lines = [
      `$ rail s "${selectedIssue.commit}"`,
      "alias: rail ship",
      "Verified snapshot matches current diff.",
      ...shipTimeline.map((item) => `  done: ${item}`),
      "Ready to ship"
    ];
    void runLines(lines, "shipped");
  };

  const resetDemo = () => {
    setStage("select");
    setIsRunning(false);
    setTerminalLines(introLines);
  };

  const nextButtonClass = stage === "select"
    ? (isDarkMode ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950" : "bg-emerald-600 hover:bg-emerald-700 text-white")
    : stage === "started"
      ? (isDarkMode ? "bg-amber-400 hover:bg-amber-300 text-zinc-950" : "bg-amber-500 hover:bg-amber-600 text-white")
      : stage === "verified"
        ? (isDarkMode ? "bg-sky-400 hover:bg-sky-300 text-zinc-950" : "bg-emerald-600 hover:bg-emerald-700 text-white")
        : (isDarkMode ? "bg-violet-400 hover:bg-violet-300 text-zinc-950" : "bg-violet-600 hover:bg-violet-700 text-white");

  const nextAction = stage === "select"
    ? { label: "Start issue", icon: "play", action: startIssue, disabled: isRunning }
    : stage === "started"
      ? { label: "◆ Run gate", icon: "text", action: verifyGate, disabled: isRunning }
      : stage === "verified"
        ? { label: "▲ Ship", icon: "text", action: shipIssue, disabled: isRunning }
        : { label: "✓ Ready to ship", icon: "text", action: resetDemo, disabled: isRunning };

  return (
    <div className={"p-5 rounded-xl flex flex-col space-y-4 " + className}>
      <div className="space-y-1.5">
        <span className={"text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border " + (isDarkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-900" : "bg-sky-50 text-sky-700 border-sky-200")}>
          Lab Module: AI Rail
        </span>
        <h4 className={"text-base font-semibold " + c.textTitle}>AI Rail Workflow Simulator</h4>
        <p className={"text-xs leading-relaxed " + c.textMuted}>
          AI Rail is a local CLI that turns GitHub Issues into scoped prompts, review packs, check gates, and safer shipping steps for AI-assisted coding.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {sampleIssues.map((issue) => {
          const isSelected = issue.id === selectedIssue.id;
          return (
            <button
              key={issue.id}
              type="button"
              disabled={isRunning}
              onClick={() => {
                setSelectedIssueId(issue.id);
                setStage("select");
                void runLines([
                  "$ rail issue-list --open",
                  `Selected issue #${issue.id}: ${issue.title}`,
                  `Type: ${issue.type}`,
                  `Risk: ${issue.risk}`,
                  "Ready for rail n."
                ], "select", true);
              }}
              className={"rounded-lg border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 " + (isSelected ? (isDarkMode ? "border-emerald-500/50 bg-emerald-500/10" : "border-sky-300 bg-sky-50") : c.panel)}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={"text-xs font-semibold " + c.textTitle}>#{issue.id} {issue.title}</span>
                <span className={"rounded border px-2 py-0.5 text-[10px] font-mono " + c.badge}>{issue.type}</span>
              </div>
              <div className={"mt-1 text-[10px] font-mono " + c.textMuted}>Risk: {issue.risk}</div>
            </button>
          );
        })}
      </div>

      <div className={"rounded-lg border overflow-hidden " + c.terminal}>
        <div className={"flex items-center justify-between border-b px-3 py-2 " + (isDarkMode ? "border-zinc-800" : "border-zinc-300")}>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500/80"></span>
            <span className="h-2 w-2 rounded-full bg-amber-400/80"></span>
            <span className="h-2 w-2 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className={"text-[10px] font-mono " + c.textMuted}>ai-rail-demo</span>
        </div>
        <div ref={terminalRef} className="h-[208px] overflow-y-auto p-3 font-mono text-[10px] leading-relaxed">
          {terminalLines.map((line, index) => (
            <div key={index} className={line.startsWith("$") || line === "Ready to ship" ? c.accent : ""}>
              {line || "\u00a0"}
            </div>
          ))}
          {isRunning && (
            <div>
              <span className={c.accent}>running</span>
              <span className={"ml-1 inline-block h-3 w-1 translate-y-0.5 animate-pulse " + (isDarkMode ? "bg-emerald-400" : "bg-sky-600")}></span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={nextAction.action} disabled={nextAction.disabled} className={"min-w-0 rounded px-2 py-2.5 text-[11px] font-semibold transition disabled:opacity-50 flex items-center justify-center gap-1.5 " + nextButtonClass}>
          {nextAction.icon === "play" && <Play className="mr-1.5 inline h-3.5 w-3.5 fill-current align-[-2px]" />}
          <span className="truncate">{nextAction.label}</span>
        </button>
        <button type="button" onClick={showAllowedFiles} disabled={isRunning || !hasStarted} className={"min-w-0 rounded border px-2 py-2.5 text-[11px] font-semibold transition disabled:opacity-50 flex items-center justify-center " + c.secondary}>Scope</button>
        <a href="https://github.com/afshinsb/ai-rail" target="_blank" referrerPolicy="no-referrer" className={"min-w-0 rounded border px-2 py-2.5 text-[11px] font-semibold transition flex items-center justify-center gap-1.5 whitespace-nowrap " + c.secondary}>
          <Github className="h-3.5 w-3.5" /> Source
        </a>
      </div>

      <div className={"rounded-lg border p-3 text-[10px] leading-relaxed " + c.panel + " " + c.textMuted}>
        This demo is simulated. The real AI Rail CLI runs locally against your repo, GitHub Issues, git, gh, and configured checks.
      </div>
    </div>
  );
}
