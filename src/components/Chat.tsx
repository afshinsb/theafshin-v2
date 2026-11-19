import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Send } from "lucide-react";
import { site, projects } from "../content/projects";

import { suggestedQuestions } from "../content/assistant-prompts";
const approvedLinks = new Set<string>([
  `mailto:${site.email}`, site.github, site.linkedin, "/#about", "/#contact", "/#work",
  ...projects.map((project) => `/projects/${project.slug}/`),
  ...projects.flatMap((project) => project.links.map((link) => link.href)),
]);

function Answer({ text }: { text: string }) {
  // A small Markdown subset. React escapes every string. There is no HTML parser.
  return text.split(/\n\n/).map((line, index) => <p key={index}>
    {line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (link) return approvedLinks.has(link[2]) ? <a key={partIndex} href={link[2]}>{link[1]}</a> : link[1];
      return part;
    })}
  </p>);
}

type Turn = { role: "user" | "assistant"; text: string };
type Reply = { text?: string; topic?: string; error?: string };

export default function Chat() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState("");
  const [topic, setTopic] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const questionInput = useRef<HTMLInputElement>(null);
  const transcript = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = transcript.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, busy, error]);

  async function send(question: string) {
    const message = question.trim();
    if (!message || busy) return;
    setBusy(true);
    setError("");
    setValue("");
    setTurns((prior) => [...prior, { role: "user", text: message }]);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, topic }),
        signal: AbortSignal.timeout(18000),
      });
      if (response.status === 429) {
        setError("The assistant has reached its request limit. Please try again later.");
      } else if (!response.ok) {
        setError("The assistant is temporarily unavailable. You can still explore the project case studies.");
      } else {
        const data: Reply = await response.json();
        if (typeof data.text !== "string" || !data.text.trim()) throw new Error("Empty reply");
        setTopic(data.topic);
        setTurns((prior) => [...prior, { role: "assistant", text: data.text! }]);
      }
    } catch {
      setError("The assistant is temporarily unavailable. You can still explore the project case studies.");
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void send(value);
  }

  return <div className="chat-app">
    <div className="chat-head"><span className="chat-icon"><Bot size={22} aria-hidden="true" /></span><div><strong>Recruiter assistant</strong><small>Project and career Q&A</small></div></div>
    <div className="chat-log" ref={transcript} role="log" aria-label="Conversation" aria-live="polite" tabIndex={0}>
      <div className="chat-turn assistant-turn"><p>Ask me about Afshin’s projects, how they’re built, or the roles he’s pursuing.</p></div>
      {turns.map((turn, index) => <div key={index} className={`chat-turn ${turn.role}-turn`}>
        <span className="sr-only">{turn.role === "user" ? "You" : "Assistant"}</span>
        {turn.role === "assistant" ? <Answer text={turn.text} /> : <p>{turn.text}</p>}
      </div>)}
      {busy && <p className="chat-status">Finding a relevant answer…</p>}
      {error && <div className="chat-status">{error} <a href="#work">Browse projects</a></div>}
    </div>
    {!turns.length && <div className="chat-suggestions" aria-label="Suggested questions">
      {suggestedQuestions.map(({ question }) => <button type="button" key={question} onClick={() => { questionInput.current?.focus(); void send(question); }}>{question}</button>)}
    </div>}
    <form className="chat-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="chat-question">Your portfolio question</label>
      <input ref={questionInput} id="chat-question" maxLength={700} autoComplete="off" placeholder="Ask a portfolio question…" value={value} onChange={(event) => setValue(event.target.value)} />
      <button className="button chat-send" type="submit" disabled={busy} aria-disabled={!value.trim() || busy} aria-label="Send question"><Send size={18} aria-hidden="true" /></button>
    </form>
  </div>;
}
