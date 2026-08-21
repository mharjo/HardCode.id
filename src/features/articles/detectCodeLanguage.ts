/**
 * Best-effort language/label detection for a code block, given its `<code>`
 * element's `class` attribute (e.g. `language-python`) and raw text.
 * Mirrors SOURCE's `enhanceArticleCodeBlocks` heuristics, simplified to the
 * patterns actually present across the 6 migrated articles.
 */
export function detectCodeLanguage(className: string, code: string): string {
  const cls = className.toLowerCase();
  if (cls.includes("python")) return "Python";
  if (cls.includes("typescript") || /\bts\b/.test(cls)) return "TypeScript";
  if (cls.includes("javascript") || /\bjs\b/.test(cls)) return "JavaScript";
  if (cls.includes("bash") || cls.includes("shell") || /\bsh\b/.test(cls)) return "Bash";
  if (cls.includes("html")) return "HTML";
  if (cls.includes("css")) return "CSS";
  if (cls.includes("sql")) return "SQL";
  if (cls.includes("json")) return "JSON";

  if (/^\/\/\s*server\.js/i.test(code) || /GoogleGenAI/.test(code)) return "server.js";
  if (code.includes("[ Browser Client ]")) return "Architecture Flow";
  return "Code";
}
