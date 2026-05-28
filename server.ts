import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const geminiAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

type AiProvider = "openai" | "gemini";

function getActiveAiProvider(): AiProvider | null {
  const configuredProvider = process.env.AI_PROVIDER?.toLowerCase();
  if (configuredProvider === "openai" || configuredProvider === "gemini") {
    return configuredProvider;
  }
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return null;
}

function getMissingAiConfigMessage() {
  return "AI API is not configured on the server. Set AI_PROVIDER to openai or gemini, then configure the matching server-side API key.";
}

const RESUME_CONTEXT = `
NAME: AFSHIN SABERI
LOCATION: Montreal, QC (Open to relocation)
CONTACT:
  Phone: Available upon request via the website contact form
  Email: contact@theafshin.com
  LinkedIn: https://linkedin.com/in/afshinsb
  GitHub: https://github.com/afshinsb
  Portfolio: https://theafshin.com

SUMMARY:
IT professional with 8+ years of experience in systems administration and network operations, with a strong focus on security. Skilled in monitoring alerts, investigating incidents, and managing access controls across Windows and Linux environments. Hands-on experience supporting incident response processes, including triage, escalation, and log-based troubleshooting. Experienced in scripting automation and log analysis to improve system reliability and security posture.

CORE SKILLS:
- Security Operations: Security alert monitoring, triage, escalation, incident investigation, log analysis & troubleshooting, ticketing systems & documentation, incident response, system hardening, patching
- Threat & Network Security: Firewall & VPN security, Attack patterns (phishing, malware, scanning, DDoS), Network segmentation & access control
- Infrastructure & Cloud: Linux, Windows Server, VMware, Docker, AWS (EC2, VPC, S3, IAM), OCI
- Networking: TCP/IP, DNS, HTTP, Routing & switching, TLS/SSL, VPNs, Firewall Rules, Cloud Networking
- Tools & Scripting: Python, PowerShell, REST APIs, OAuth, Git/GitHub, Cloudflare, Tailscale, structured logging

PROFESSIONAL EXPERIENCE:
Enterprise Logistics & E-Commerce Systems Provider
Systems Administrator | Montreal, QC · Jan 2023 - Jan 2025
- Performed security monitoring by analyzing system and network alerts to investigate issues impacting availability.
- Supported incident response processes including triage, escalation, and resolution.
- Managed firewall rules and VPN access to reduce exposure.
- Applied system hardening and patching practices.
- Managed identity lifecycle and access control.
- Developed Python scripts to automate basic AWS instance provisioning and operational tasks.

High-Throughput Infrastructure & Digital Network Host
Network Systems Analyst | Mar 2018 - Jan 2022
- Maintained secure multi-site network environments on Linux servers and cloud infrastructure.
- Implemented firewall policies and VPN connectivity.
- Investigated anomalies and network incidents using Wireshark for packet analysis.
- Improved segmentation and access control.

Network Technician | Mar 2016 - Feb 2018
- Supported infrastructure installation and troubleshooting.
- Assisted in maintaining stable operations.

PROJECTS:
1. Self-Hosted Secure Infrastructure
   - Built and maintained a self-hosted Linux environment using Docker Compose, reverse proxying, Cloudflare Tunnel, private remote access, and controlled service exposure.
   - Built isolated KVM/libvirt Ubuntu environments for secure service testing and infrastructure experimentation.
   - Implemented backup, patching, monitoring, and container health validation workflows.

2. Universal Subtitle Translator — Dockerized Automation App (Live Demo: https://translate.theafshin.com/)
   - Built a Dockerized FastAPI automation app with secure config checks, authentication defaults, structured logging, batch processing, job progress tracking, cancellation handling, and SQLite job history.
   - Published on GitHub with versioned releases, documentation, and a safe static demo separated from the real backend.

EDUCATION:
Concordia University
Master of Engineering, Information Systems Security
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  async function generateAiText(systemInstruction: string, message: string, history: any[] = []) {
    const provider = getActiveAiProvider();
    if (!provider) {
      const error = new Error(getMissingAiConfigMessage());
      (error as any).status = 500;
      throw error;
    }

    if (provider === "openai") {
      if (!openai) {
        const error = new Error(getMissingAiConfigMessage());
        (error as any).status = 500;
        throw error;
      }

      const input: any[] = [];
      if (Array.isArray(history)) {
        for (const turn of history) {
          input.push({
            role: turn.sender === "user" ? "user" : "assistant",
            content: turn.text,
          });
        }
      }
      input.push({ role: "user", content: message });

      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: systemInstruction,
        input,
        temperature: 0.7,
      });

      return response.output_text;
    }

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.sender === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await geminiAi.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text;
  }

  // API endpoint for AI Recruiter Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const systemInstruction = `
You are the AI Recruiter Agent (AI Twin) for Afshin Saberi. Your job is to represent Afshin to potential employers, recruiters, and engineering managers who are visiting his portfolio website (theafshin.com).
Answer questions about his skills, projects, work history, availability, education, and credentials in a professional, polite, and confident manner.

Afshin's Resume Summary & Details:
${RESUME_CONTEXT}

SECURITY & BILLING CAUTIONS FOR RECRUITERS:
If asked about billing, abuse, or how this AI Twin works, note that this runs through a secure server-side AI API proxy with API keys kept only in server environment variables. It does NOT have access to Afshin's personal accounts, calendar, billing accounts, or private systems. It is isolated from the browser client.

RULES:
1. Always base your answers on Afshin's actual background. Do not invent any credentials, roles, or employers. To shield private client data, refer to his work history using the descriptive company names (e.g. "Enterprise Logistics & E-Commerce Systems Provider" or "High-Throughput Infrastructure & Digital Network Host").
2. If asked about something not in his resume, politely state that he is eager to learn or explain his current knowledge in adjacent areas.
3. Keep your answers clear, concise, and professional.
4. Format your output with neat bullet points, bold text, or short paragraphs using markdown where appropriate.
5. If someone asks for an interview, meeting, or how to contact him, provide his secure domain contact email: contact@theafshin.com, and encourage them to use the Recruiter Contact form in the overview tab.
6. He is currently located in Montreal, QC, but is open to relocation. He has 8+ years of Systems Administration and Network analysis experience. He holds a Master's degree in Information Systems Security from Concordia University.
`;

      const text = await generateAiText(systemInstruction, message, history);
      return res.json({ text, provider: getActiveAiProvider() });
    } catch (e: any) {
      console.error("AI API error:", e);
      return res.status(e.status || 500).json({ 
        error: e.message || "An error occurred while communicating with the AI agent." 
      });
    }
  });

  // API endpoint for Subtitle Translation (matches Subtitle Translator project)
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLang } = req.body;
      if (!text || !targetLang) {
        return res.status(400).json({ error: "Text and target language are required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "AI translation API is not configured on the server." 
        });
      }

      const response = await geminiAi.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
        contents: `Translate the following subtitle segment into ${targetLang}. Keep the exact SRT numbering lines, timestamp markers, and structural layout intact. Do not add explanations or wrapper text. Return only the translated SRT output:

${text}`,
      });

      return res.json({ translated: response.text });
    } catch (e: any) {
      console.error("Translation API error:", e);
      return res.status(500).json({ error: e.message || "Failed to translate subtitle text." });
    }
  });

  // API endpoint for real contact form delivery
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, company, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
      }

      const requiredConfig = [
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "CONTACT_TO_EMAIL"
      ];
      const missingConfig = requiredConfig.filter((key) => !process.env[key]);
      if (missingConfig.length > 0) {
        return res.status(503).json({
          error: "Email service is not configured.",
          missing: missingConfig
        });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
      const subject = `Portfolio interview request from ${name}`;
      const body = [
        "New recruiter contact request",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "Not provided"}`,
        "",
        "Message:",
        message,
      ].join("\n");

      await transporter.sendMail({
        from: `"Portfolio Contact" <${fromEmail}>`,
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: email,
        subject,
        text: body,
      });

      return res.json({ ok: true });
    } catch (e: any) {
      console.error("Contact email error:", e);
      return res.status(500).json({
        error: e.message || "Failed to send contact email."
      });
    }
  });

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support single page application routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
