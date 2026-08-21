import type { TranslationKey } from "./translations";

export interface ProjectType {
  id: string;
  number: number;
  titleKey: TranslationKey;
  bodyParagraphKeys: [TranslationKey, TranslationKey, TranslationKey];
  asciiArt: string;
  searchTerms: string[];
}

/**
 * All 7 project types ported from SOURCE `#view-project` (hand-authored HTML,
 * not i18n-array-driven there — same situation as `learning.ts`). Title/body
 * paragraphs reuse the existing `proj_c{n}_*` translation keys (already
 * bilingual in SOURCE `i18n.js`). `searchTerms` are ported from each card's
 * `data-search` attribute. ASCII art is copied byte-for-byte from SOURCE,
 * including its leading-space indentation and (for #5) doubled backslashes.
 */
export const projectTypes: ProjectType[] = [
  {
    id: "proj-card-1",
    number: 1,
    titleKey: "proj_c1_title",
    bodyParagraphKeys: ["proj_c1_p1", "proj_c1_p2", "proj_c1_p3"],
    asciiArt: " +---------+\n | Header  |\n +---------+\n | [ BUY ] |\n +---------+",
    searchTerms: ["landing page", "bisnis", "portofolio", "website", "company profile", "cepat", "modern", "domain"],
  },
  {
    id: "proj-card-2",
    number: 2,
    titleKey: "proj_c2_title",
    bodyParagraphKeys: ["proj_c2_p1", "proj_c2_p2", "proj_c2_p3"],
    asciiArt: " (A) -> [X]\n         |\n        (B) -> [Y]",
    searchTerms: ["sistem automasi", "workflow", "webhook", "zapier", "make", "crm", "google sheets", "integrasi"],
  },
  {
    id: "proj-card-3",
    number: 3,
    titleKey: "proj_c3_title",
    bodyParagraphKeys: ["proj_c3_p1", "proj_c3_p2", "proj_c3_p3"],
    asciiArt: " +---+---+---+\n | A | B | C |\n +---+---+---+\n | 1 | 2 | 3 |\n +---+---+---+",
    searchTerms: ["internal tools", "dashboard", "crud", "database", "panel admin", "gudang", "inventori", "rbac"],
  },
  {
    id: "proj-card-4",
    number: 4,
    titleKey: "proj_c4_title",
    bodyParagraphKeys: ["proj_c4_p1", "proj_c4_p2", "proj_c4_p3"],
    asciiArt: "   [ User ]\n      |\n   [ AI ] -- DB\n      |\n   [ Ans  ]",
    searchTerms: ["chatbot", "ai", "custom", "rag", "customer service", "whatsapp bot", "dokumen", "vector db"],
  },
  {
    id: "proj-card-5",
    number: 5,
    titleKey: "proj_c5_title",
    bodyParagraphKeys: ["proj_c5_p1", "proj_c5_p2", "proj_c5_p3"],
    asciiArt: " \\\\\n  \\\\\n   Spider\n   Web",
    searchTerms: ["ekstraksi data", "web scraping", "scraper", "data marketplace", "csv", "json"],
  },
  {
    id: "proj-card-6",
    number: 6,
    titleKey: "proj_c6_title",
    bodyParagraphKeys: ["proj_c6_p1", "proj_c6_p2", "proj_c6_p3"],
    asciiArt: " +----------+\n |  [$$$$]  |\n |  VALID   |\n +----------+",
    searchTerms: ["integrasi payment gateway", "pembayaran", "midtrans", "xendit", "qris", "otomatis", "invoice"],
  },
  {
    id: "proj-card-7",
    number: 7,
    titleKey: "proj_c7_title",
    bodyParagraphKeys: ["proj_c7_p1", "proj_c7_p2", "proj_c7_p3"],
    asciiArt: " { code } ->\n   [===]\n { CLEAN }",
    searchTerms: ["refactoring", "perbaikan kode", "optimasi", "speed", "bug fix", "clean code", "arsitektur"],
  },
];
