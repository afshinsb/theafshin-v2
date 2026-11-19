import { useEffect, useRef, useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { site } from "../content/projects";
import { GithubIcon, LinkedInIcon } from "./Icons";

type Turnstile = {
  render: (target: HTMLElement, options: {
    sitekey: string; action: string; size: "flexible" | "compact"; callback: (token: string) => void;
    "expired-callback": () => void; "error-callback": () => void;
  }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();
const turnstileUrl = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<Turnstile> | undefined;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = turnstileUrl;
    script.async = true;
    const failed = () => { script.remove(); reject(new Error("Verification unavailable")); };
    const timer = window.setTimeout(failed, 12000);
    script.onload = () => {
      window.clearTimeout(timer);
      if (window.turnstile) resolve(window.turnstile);
      else failed();
    };
    script.onerror = () => { window.clearTimeout(timer); failed(); };
    document.head.append(script);
  }).catch((error: unknown) => { loading = undefined; throw error; });
  return loading;
}

export function Contact() {
  const [requested, setRequested] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [token, setToken] = useState("");
  const [widgetError, setWidgetError] = useState(false);
  const [state, setState] = useState<{ type: "idle" | "sending" | "sent" | "error"; message: string }>({ type: "idle", message: "" });
  const widget = useRef<HTMLDivElement>(null);
  const idle = useRef<() => void>(() => {});

  useEffect(() => {
    if (!requested || !siteKey) return;
    let active = true;
    let release = () => {};
    loadTurnstile().then((api) => {
      if (!active || !widget.current) return;
      const id = api.render(widget.current, {
        sitekey: siteKey, action: "contact", size: widget.current.clientWidth < 300 ? "compact" : "flexible",
        callback: (value) => { setWidgetError(false); setToken(value); },
        "expired-callback": () => setToken(""),
        "error-callback": () => { setToken(""); setWidgetError(true); },
      });
      idle.current = () => api.reset(id);
      release = () => api.remove(id);
    }).catch(() => { if (active) setWidgetError(true); });
    return () => { active = false; release(); idle.current = () => {}; };
  }, [requested, attempt]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.type === "sending") return;
    if (!siteKey || !token) {
      setRequested(true);
      setState({ type: "error", message: siteKey ? "Complete the verification before sending." : "The form is unavailable in this preview. You can send an email directly." });
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);
    setState({ type: "sending", message: "Sending your message…" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token }),
        signal: AbortSignal.timeout(18000),
      });
      if (!response.ok) {
        const message = response.status === 429 ? "Please wait before sending another message." :
          response.status === 403 ? "Verification expired. Please try again." : "The message could not be sent. Please try again or email me directly.";
        setState({ type: "error", message });
        return;
      }
      const result = await response.json() as { ok?: boolean };
      if (result.ok !== true) throw new Error("Unconfirmed delivery");
      form.reset();
      setState({ type: "sent", message: "Thanks. Your message was sent." });
    } catch {
      setState({ type: "error", message: "The message could not be sent. Please try again or email me directly." });
    } finally {
      setToken("");
      idle.current();
    }
  }

  return <section className="section contact-section" id="contact">
    <div className="shell contact-grid">
      <div className="section-heading">
        <p className="eyebrow"><span /> Contact</p>
        <h2>Let’s talk.</h2>
        <p>I’m looking for applied AI and software engineering roles in Toronto or remote across Canada.</p>
        <ul className="contact-links">
          <li><a href={`mailto:${site.email}`}><Mail size={18} aria-hidden="true" />{site.email}</a></li>
          <li><a href={site.linkedin}><LinkedInIcon size={18} aria-hidden="true" />LinkedIn</a></li>
          <li><a href={site.github}><GithubIcon size={18} aria-hidden="true" />GitHub</a></li>
        </ul>
      </div>
      <form className="contact-form" onSubmit={submit} onFocus={() => setRequested(true)}>
        <div className="field-row">
          <label>Name<input name="name" autoComplete="name" required minLength={2} maxLength={80} /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required maxLength={120} /></label>
        </div>
        <label>Company <span>(optional)</span><input name="company" autoComplete="organization" maxLength={120} /></label>
        <label>Message<textarea name="message" rows={4} required maxLength={1500} /></label>
        <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        {siteKey && <div ref={widget} className="verification" />}
        {widgetError && <p className="form-status">Verification couldn’t load. <button type="button" className="plain-link" onClick={() => { setWidgetError(false); setAttempt((count) => count + 1); }}>Try again</button></p>}
        <button className="button button-primary" type="submit" disabled={state.type === "sending"}>Send message</button>
        <p className="form-status" role="status">{state.message}</p>
      </form>
    </div>
  </section>;
}
