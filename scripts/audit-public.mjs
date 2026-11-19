import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const root = "dist/public";
const files = await readdir(root, { recursive: true, withFileTypes: true });
const invalid = [];
const textExtensions = new Set(["", ".js", ".html", ".css", ".txt", ".xml", ".webmanifest", ".json", ".svg"]);
const disallowed = [
  ["private or unexpected email", /[a-z0-9.%+_!-]+@[a-z0-9.-]+\.[a-z]{2,}/gi],
  ["sensitive artifact", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bsk-(?:proj-)?[a-zA-Z0-9_-]{24,}|\b(?:OPENAI_API_KEY|TURNSTILE_SECRET_KEY|RESEND_API_KEY|CONTACT_TO_EMAIL)\b/i],
  ["phone-like value", /(?:\+1[ .-]?)?\(\d{3}\)[ .-]?\d{3}[- .]\d{4}|\b\d{3}[ -]\d{3}[- ]\d{4}\b/],
];
const approved = new Set(["contact@theafshin.com"]);
for (const file of files) {
  if (!file.isFile()) continue;
  const path = join(file.parentPath, file.name);
  const extension = extname(path);
  if ([".pdf", ".map", ".env", ".pem", ".key", ".zip"].includes(extension)) invalid.push([path, "unexpected artifact"]);
  if (!textExtensions.has(extension)) continue;
  const contents = await readFile(path, "utf8");
  for (const [label, expression] of disallowed) {
    const matches = contents.match(expression) ?? [];
    if (matches.some((match) => label !== "private or unexpected email" || !approved.has(match.toLowerCase()))) invalid.push([path, label]);
  }
}
if (invalid.length) {
  for (const [path, label] of invalid) console.error(`${path}: ${label}`);
  process.exitCode = 1;
} else {
  console.log(`Reviewed ${files.filter((file) => file.isFile()).length} public build files. No unexpected contact matches, secret markers or disallowed artifacts.`);
}
