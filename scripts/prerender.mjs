import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { paths, render } from "../dist/render/entry-server.js";

const directory = "dist/public";
const template = await readFile(join(directory, "index.html"), "utf8");
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const path of [...paths, "/404/"]) {
  const page = render(path);
  const is404 = path === "/404/";
  const meta = [
    `<meta name="description" content="${escape(page.description)}" />`,
    ...(is404 ? ['<meta name="robots" content="noindex" />'] : [
      `<link rel="canonical" href="${escape(page.canonical)}" />`,
      `<meta property="og:title" content="${escape(page.title)}" />`,
      `<meta property="og:description" content="${escape(page.description)}" />`,
      `<meta property="og:url" content="${escape(page.canonical)}" />`,
      `<meta property="og:image" content="${escape(page.image)}" />`,
      '<meta property="og:image:alt" content="Afshin Saberi, Applied AI and Python Developer in Toronto" />',
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      `<meta property="og:type" content="${path === "/" ? "website" : "article"}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
      `<script type="application/ld+json">${JSON.stringify(page.schema).replaceAll("<", "\\u003c")}</script>`,
    ]),
  ].join("\n    ");
  const html = template.replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace("<!-- page-metadata -->", () => meta)
    .replace('<div id="root"></div>', () => `<div id="root">${page.html}</div>`);
  const file = join(directory, is404 ? "404.html" : path.slice(1) + "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
const urls = paths.map((path) => `  <url><loc>${escape(render(path).canonical)}</loc></url>`).join("\n");
await writeFile(join(directory, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
