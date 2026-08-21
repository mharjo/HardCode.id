import type { Locale } from "../../data/translations";
import { calculateQuote, type QuoteCategoryId, type QuoteState } from "./quoteConfig";

/**
 * Pure canned-response logic for the `{tanya}` chat tab, ported from
 * SOURCE's `generateBotResponse` (index.html ~L10555-10633). No React/DOM
 * dependency so it's directly unit-testable.
 *
 * SOURCE renders CTAs as inline `<button onclick="...">` HTML inside the
 * bot bubble string. That's unsafe/non-idiomatic in React, so this port
 * keeps the reply text as plain markdown-lite (`**bold**`, `` `code` ``)
 * and returns a typed `actions` list instead — `ChatConversation` renders
 * those as real React buttons wired to `ChatContext` actions.
 */

export type BotActionType = "open-quote" | "consult" | "projects" | "learning";

export interface BotAction {
  type: BotActionType;
}

export interface BotResponse {
  text: string;
  actions: BotAction[];
  /** Set when the question's keywords implied a specific quote category, so the caller can update quote state. */
  matchedCategory?: QuoteCategoryId;
}

export type QuickPromptId = "q1" | "q2" | "q3" | "q4" | "q5";

const QUOTE_KEYWORDS = [
  "quote",
  "estimasi",
  "biaya",
  "harga",
  "budget",
  "tarif",
  "hitung",
  "kalkulator",
  "calculator",
  "estimate",
  "pricing",
  "cost",
];

const CATEGORY_KEYWORD_MAP: [QuoteCategoryId, string[]][] = [
  ["landing", ["landing", "portofolio", "web profil"]],
  ["automation", ["otomasi", "automation", "n8n", "webhook"]],
  ["internal_tool", ["dashboard", "internal tool", "admin"]],
  ["ai_rag", ["ai", "llm", "rag", "chatbot"]],
  ["scraping", ["scrap", "crawler", "data pipeline"]],
  ["payment", ["payment", "midtrans", "xendit", "stripe"]],
  ["refactor", ["refactor", "audit", "bersihkan kode"]],
  ["custom_mvp", ["mvp", "fullstack", "aplikasi kustom"]],
];

function matchQuoteCategory(q: string): QuoteCategoryId | undefined {
  for (const [category, keywords] of CATEGORY_KEYWORD_MAP) {
    if (keywords.some((kw) => q.includes(kw))) return category;
  }
  return undefined;
}

function quoteResponse(q: string, lang: Locale, quoteState: QuoteState): BotResponse {
  const matchedCategory = matchQuoteCategory(q);
  const calc = calculateQuote(matchedCategory ? { ...quoteState, category: matchedCategory } : quoteState, lang);

  const text =
    lang === "en"
      ? `📊 **Quick Project Estimate:**\n• **Project:** ${calc.cat.nameEn} (${calc.comp.labelEn})\n• **Timeline:** \`${calc.timelineText}\`\n• **Est. Investment:** \`${calc.priceText}\`\n\nCustomize complexity & add-ons directly, or schedule a free session to discuss it.`
      : `📊 **Estimasi Project Transparan:**\n• **Layanan:** ${calc.cat.nameId} (${calc.comp.labelId})\n• **Timeline:** \`${calc.timelineText}\`\n• **Kisaran Biaya:** \`${calc.priceText}\`\n\nMau atur kompleksitas & fitur kustom sendiri, atau langsung konsultasi gratis?`;

  const base: BotResponse = { text, actions: [{ type: "open-quote" }, { type: "consult" }] };
  return matchedCategory ? { ...base, matchedCategory } : base;
}

function scheduleResponse(lang: Locale): BotResponse {
  const text =
    lang === "en"
      ? "📅 **1-on-1 Consultation Availability:**\n• **Mon–Fri:** `20:00 – 22:00 WIB` (UTC+7)\n• **Sat & Sun:** `13:00 – 20:00 WIB`\n• *(Unavailable on National Holidays)*\n\nReady to pick your slot?"
      : "📅 **Jadwal Konsultasi 1-on-1:**\n• **Senin–Jumat:** `20:00 – 22:00 WIB`\n• **Sabtu & Minggu:** `13:00 – 20:00 WIB`\n• *(Libur Nasional ditiadakan)*\n\nMau langsung booking slot?";
  return { text, actions: [{ type: "consult" }] };
}

function beginnerResponse(lang: Locale): BotResponse {
  const text =
    lang === "en"
      ? "🚀 **Beginner to Advanced Learning:**\nOur curriculum starts completely from scratch with hands-on 1-on-1 mentoring:\n• `HTML / CSS / JavaScript` fundamentals\n• `Python & Backend Systems`\n• `AI Prompt Engineering & LLM APIs`\n\nExplore our syllabus."
      : "🚀 **Belajar Dari Nol (Pemula - Mahir):**\nMateri dipandu secara privat 1-on-1 step-by-step:\n• `HTML, CSS, JavaScript` dasar hingga mahir\n• `Python & Backend Logic`\n• `Prompt Engineering & Integrasi AI`\n\nPelajari detail silabus.";
  return { text, actions: [{ type: "learning" }] };
}

function techStackResponse(lang: Locale): BotResponse {
  const text =
    lang === "en"
      ? "🛠️ **Our Core Tech Stack:**\n• **Frontend:** `TypeScript`, `React`, `Tailwind CSS`\n• **Backend:** `Node.js / Express`, `Python`\n• **Database & Cloud:** `PostgreSQL`, `REST & GraphQL`\n• **AI & Automation:** `Google Gemini`, `OpenAI`, `LLM APIs`"
      : "🛠️ **Tech Stack Utama HardCode:**\n• **Frontend:** `TypeScript`, `React`, `Tailwind CSS`\n• **Backend:** `Node.js`, `Python`\n• **Database:** `PostgreSQL`, `REST & GraphQL`\n• **AI Tools:** `Gemini AI`, `OpenAI API`, `Prompt Engineering`";
  return { text, actions: [] };
}

function projectResponse(lang: Locale): BotResponse {
  const text =
    lang === "en"
      ? "⚙️ **Engineering & MVPs:**\nWe build production-ready software:\n• Fullstack Web MVPs & AI Dashboards\n• Payment Gateway Integrations (`Midtrans`, `Xendit`, `Stripe`)\n• Data Pipelines & Scraping\n• Codebase Architecture Refactoring\n\nExplore live demos or calculate an instant quote."
      : "⚙️ **Layanan Pembuatan Aplikasi & MVP:**\n• Fullstack Web App & Dashboard AI\n• Integrasi Payment Gateway (`Midtrans` / `Xendit` / `Stripe`)\n• Data Scraping & Automasi\n• Optimasi Arsitektur & Refactoring Kode\n\nCek portofolio atau hitung estimasi fitur.";
  return { text, actions: [{ type: "projects" }, { type: "open-quote" }] };
}

function contactResponse(lang: Locale): BotResponse {
  const text =
    lang === "en"
      ? "✉️ **Get in Touch:**\n• **Email:** hello@hardcode.id\n• **1-on-1 Consultation:** book a free 60-min session\n\nWe usually reply within 24 business hours! 👋"
      : "✉️ **Hubungi Kami:**\n• **Email:** hello@hardcode.id\n• **Sesi 1-on-1:** pesan sesi konsultasi gratis\n\nKami siap membantu ide project atau rencana belajarmu! 👋";
  return { text, actions: [{ type: "consult" }] };
}

function defaultResponse(lang: Locale): BotResponse {
  const text =
    lang === "en"
      ? "💡 **Great question!** For in-depth discussions, architecture reviews, or live code breakdowns, feel free to book a free 60-min 1-on-1 consultation or try our project quote estimator. ✨"
      : "💡 **Pertanyaan yang menarik!** Untuk pembahasan arsitektur atau konsultasi coding langsung, yuk jadwalkan konsultasi 1-on-1 gratis 60 menit atau cek kalkulator estimasi project. ✨";
  return { text, actions: [{ type: "consult" }, { type: "open-quote" }] };
}

const QUICK_PROMPT_RESPONSES: Record<QuickPromptId, (lang: Locale, quoteState: QuoteState) => BotResponse> = {
  q1: (lang) => scheduleResponse(lang),
  q2: (lang, quoteState) => quoteResponse("biaya", lang, quoteState),
  q3: (lang) => beginnerResponse(lang),
  q4: (lang) => techStackResponse(lang),
  q5: (lang, quoteState) => quoteResponse("estimasi", lang, quoteState),
};

/**
 * Resolves the bot's reply. `quickPromptId` (set when the user tapped one
 * of the 5 suggested chips) bypasses keyword search entirely and returns a
 * fixed response per the task spec; free-typed `question` text runs through
 * the same keyword matching SOURCE uses.
 */
export function getBotResponse(
  question: string,
  lang: Locale,
  quoteState: QuoteState,
  quickPromptId?: QuickPromptId,
): BotResponse {
  if (quickPromptId) return QUICK_PROMPT_RESPONSES[quickPromptId](lang, quoteState);

  const q = question.toLowerCase();

  if (QUOTE_KEYWORDS.some((kw) => q.includes(kw))) {
    return quoteResponse(q, lang, quoteState);
  }

  if (lang === "en") {
    if (["schedule", "time", "when", "hours", "days", "jadwal", "jam"].some((kw) => q.includes(kw))) {
      return scheduleResponse(lang);
    }
    if (["beginner", "learn", "scratch", "start", "syllabus", "course", "pemula", "belajar"].some((kw) => q.includes(kw))) {
      return beginnerResponse(lang);
    }
    if (["stack", "tech", "technology", "framework", "react", "python"].some((kw) => q.includes(kw))) {
      return techStackResponse(lang);
    }
    if (["project", "build", "mvp", "app", "website", "custom", "bikin"].some((kw) => q.includes(kw))) {
      return projectResponse(lang);
    }
    if (["contact", "email", "whatsapp", "reach", "kontak"].some((kw) => q.includes(kw))) {
      return contactResponse(lang);
    }
    return defaultResponse(lang);
  }

  if (["jadwal", "jam", "kapan", "waktu", "hari"].some((kw) => q.includes(kw))) {
    return scheduleResponse(lang);
  }
  if (["pemula", "belajar", "nol", "materi", "coding", "kursus"].some((kw) => q.includes(kw))) {
    return beginnerResponse(lang);
  }
  if (["stack", "teknologi", "framework", "react", "python"].some((kw) => q.includes(kw))) {
    return techStackResponse(lang);
  }
  if (["project", "bikin", "buat", "mvp", "aplikasi", "website"].some((kw) => q.includes(kw))) {
    return projectResponse(lang);
  }
  if (["kontak", "email", "wa", "whatsapp", "hubungi"].some((kw) => q.includes(kw))) {
    return contactResponse(lang);
  }
  return defaultResponse(lang);
}

export interface MarkdownSegment {
  type: "text" | "bold" | "code";
  value: string;
}

/** Splits `**bold**` and `` `code` `` spans out of a line of markdown-lite text, preserving order. Used by `ChatConversation` to render bot replies without `dangerouslySetInnerHTML`. */
export function parseMarkdownLiteLine(line: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = [];
  const pattern = /\*\*(.+?)\*\*|`(.+?)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: line.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: "bold", value: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: "code", value: match[2] });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < line.length) {
    segments.push({ type: "text", value: line.slice(lastIndex) });
  }

  return segments;
}
