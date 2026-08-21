import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const articlesFile = path.join(rootDir, "src", "data", "articles.ts");
const outFile = path.join(rootDir, "public", "sitemap.xml");

const BASE_URL = "https://hardcode.id";

const source = readFileSync(articlesFile, "utf8");

/** Each article record is `{ id: "slug", ..., dateIso: "YYYY-MM-DD", ... }` — walk both fields per record in source order. */
const recordPattern = /id:\s*"([a-z0-9-]+)"[\s\S]*?dateIso:\s*"(\d{4}-\d{2}-\d{2})"/g;
const articleEntries = [];
let match;
while ((match = recordPattern.exec(source)) !== null) {
  articleEntries.push({ slug: match[1], dateIso: match[2] });
}

const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  { path: "/", changefreq: "monthly", priority: "1.0" },
  { path: "/artikel", changefreq: "monthly", priority: "0.8" },
  { path: "/belajar", changefreq: "monthly", priority: "0.8" },
  { path: "/proyek", changefreq: "monthly", priority: "0.8" },
  { path: "/konsultasi", changefreq: "monthly", priority: "0.8" },
];

const urlEntries = [
  ...staticPages.map((page) => ({ ...page, lastmod: today })),
  ...articleEntries.map((article) => ({
    path: `/artikel/${article.slug}`,
    changefreq: "weekly",
    priority: "0.6",
    lastmod: article.dateIso,
  })),
];

const urls = urlEntries
  .map(
    (entry) =>
      `  <url>\n    <loc>${BASE_URL}${entry.path}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(outFile, xml, "utf8");
console.log(`sitemap.xml written with ${urlEntries.length} URLs`);
