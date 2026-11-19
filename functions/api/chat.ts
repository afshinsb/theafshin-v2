import {
  enforceQuota,
  genericError,
  getClientIp,
  json,
  parseLimit,
  readJson,
  todayKey,
} from "../_shared/security.ts";
import type { PagesContext } from "../_shared/security.ts";
import { ANSWER_FORMAT, SYSTEM_INSTRUCTIONS, answerDirectly, renderAnswer } from "../_shared/recruiter-profile.ts";
import { z } from "zod";

const MAX_MESSAGE_LENGTH = 700;
const MAX_HISTORY_MESSAGES = 6;

const chatSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
  history: z
    .array(
      z.object({
        sender: z.enum(["user", "assistant", "model"]).optional(),
        role: z.enum(["user", "assistant", "model"]).optional(),
        text: z.string().trim().max(MAX_MESSAGE_LENGTH).optional(),
        content: z.string().trim().max(MAX_MESSAGE_LENGTH).optional(),
      }).strict(),
  )
    .max(MAX_HISTORY_MESSAGES)
    .optional()
    .default([]),
}).strict();

function isSpammy(message: string) {
  const normalized = message.toLowerCase().replace(/\s+/g, " ").trim();
  if (normalized.length < 2) return true;
  if (/^(.)\1{15,}$/i.test(normalized.replace(/\s/g, ""))) return true;
  if (/\b(.{3,40})\b(?:\s+\1\b){3,}/i.test(normalized)) return true;
  return false;
}

function isPromptInjection(message: string) {
  const normalized = message.toLowerCase();
  return [
    "ignore previous",
    "ignore all previous",
    "system prompt",
    "developer message",
    "hidden instruction",
    "reveal your prompt",
    "show your prompt",
    "environment variable",
    "api key",
    "openai_api_key",
    "turnstile_secret",
    "server code",
  ].some((needle) => normalized.includes(needle));
}

const openAiResponseSchema = z.object({
  status: z.literal("completed").optional(),
  output_text: z.string().optional(),
  output: z.array(z.object({
    content: z.array(z.object({
      type: z.string(),
      text: z.string().optional(),
    })).optional(),
  })).optional(),
});

function outputTextFromOpenAi(data: unknown) {
  const parsed = openAiResponseSchema.safeParse(data);
  if (!parsed.success) return "";
  if (parsed.data.output_text) return parsed.data.output_text;

  const content = parsed.data.output?.flatMap((item) => item.content ?? []) ?? [];
  if (content.some((part) => part.type === "refusal")) return "";
  return content.filter((part) => part.type === "output_text").map((part) => part.text ?? "").join("\n");
}

export const onRequestPost = async ({ request, env }: PagesContext) => {
  const ip = getClientIp(request);
  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const body = chatSchema.safeParse(parsed.body);
  if (!body.success) {
    console.warn("chat_blocked_schema", { ip });
    return json({ error: "Invalid request body." }, 400);
  }

  const message = body.data.message;

  if (!message || message.length > MAX_MESSAGE_LENGTH || isSpammy(message)) {
    console.warn("chat_blocked_validation", { ip, reason: "invalid_message" });
    return json({ error: "Please send a concise portfolio-related question." }, 400);
  }

  if (isPromptInjection(message)) {
    console.warn("chat_blocked_prompt_injection", { ip });
    return json({ error: "Please ask a portfolio-related question about Afshin's background." }, 400);
  }

  const day = todayKey();
  const quota = await enforceQuota(env, [
    {
      key: `chat:minute:${ip}:${Math.floor(Date.now() / 60000)}`,
      limit: parseLimit(env.CHAT_PER_MINUTE_LIMIT, 3, 1, 20),
      ttlSeconds: 90,
      label: "chat_per_minute",
    },
    {
      key: `chat:ip:${day}:${ip}`,
      limit: parseLimit(env.CHAT_IP_DAILY_LIMIT, 5, 1, 500),
      ttlSeconds: 172800,
      label: "chat_ip_daily",
    },
    {
      key: `chat:global:${day}`,
      limit: parseLimit(env.CHAT_GLOBAL_DAILY_LIMIT, 100, 1, 10000),
      ttlSeconds: 172800,
      label: "chat_global_daily",
    },
  ]);
  if (!quota.allowed) return quota.response;

  const directAnswer = answerDirectly(message);
  if (directAnswer) return json({ text: directAnswer });

  if (!env.OPENAI_API_KEY) {
    console.error("openai_missing_key");
    return genericError(503);
  }

  const maxOutputTokens = parseLimit(env.OPENAI_MAX_OUTPUT_TOKENS, 400, 400, 400);
  const model = env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    console.info("chat_request_count", { ip, model });
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: SYSTEM_INSTRUCTIONS,
        input: [{ role: "user", content: message }],
        temperature: 0.4,
        max_output_tokens: maxOutputTokens,
        store: false,
        text: { format: ANSWER_FORMAT },
      }),
    });

    if (!openAiResponse.ok) {
      console.error("openai_provider_error", {
        status: openAiResponse.status,
        requestId: openAiResponse.headers.get("x-request-id"),
      });
      return genericError(502);
    }

    const data = await openAiResponse.json();
    return json({ text: renderAnswer(outputTextFromOpenAi(data)) });
  } catch {
    console.error("openai_request_error");
    return genericError(502);
  }
};
