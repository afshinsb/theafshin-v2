import { json, type PagesContext } from "../_shared/security";

const methods = new Map([
  ["/api/chat", ["POST"]],
  ["/api/contact", ["GET", "POST"]],
  ["/api/translate", ["POST"]],
]);

export async function onRequest({ request, next, env }: PagesContext & { next: () => Promise<Response> }) {
  const path = new URL(request.url).pathname;
  const allowed = methods.get(path);
  if (!allowed || (path === "/api/translate" && env.ENABLE_TRANSLATE_API !== "true")) return json({ error: "Not found." }, 404);
  if (!allowed.includes(request.method)) return json({ error: "Method not allowed." }, 405, { allow: allowed.join(", ") });
  try {
    return await next();
  } catch {
    return json({ error: "Unable to process this request right now." }, 500);
  }
}
