import type { Bilingual } from "./articles";
import type { TranslationKey } from "./translations";

export type LearningTrack = "web" | "python" | "ai";

export type LearningStageNumber = 1 | 2 | 3 | 4;

export interface LearningModule {
  id: string;
  number: number;
  stage: LearningStageNumber;
  tracks: LearningTrack[];
  trackBadge: Bilingual;
  titleKey: TranslationKey;
  summary: Bilingual;
  tags: string[];
  prerequisite: Bilingual;
  asciiArt: string;
  bodyParagraphKeys: [TranslationKey, TranslationKey, TranslationKey];
  searchTerms: string[];
  isCapstone?: boolean;
}

export interface LearningStage {
  stage: LearningStageNumber;
  titleKey: TranslationKey;
  badgeKey: TranslationKey;
  moduleIds: string[];
}

/**
 * All 7 modules ported from SOURCE `#view-learning` (hand-authored HTML, not
 * i18n-array-driven there). Module title/body paragraphs reuse the existing
 * `learn_c{n}_*` translation keys (already bilingual in SOURCE `i18n.js`);
 * `summary`/`trackBadge`/`prerequisite` were plain, untranslated text in
 * SOURCE's markup, so they're carried here as inline `Bilingual` data with an
 * EN rendering added during migration (see migration-step.md).
 */
export const learningModules: LearningModule[] = [
  {
    id: "learn-card-1",
    number: 1,
    stage: 1,
    tracks: ["web"],
    trackBadge: { id: "🌐 Web Track", en: "🌐 Web Track" },
    titleKey: "learn_c1_title",
    summary: {
      id: "Anatomi web, semantik DOM, responsive layout & interaktivitas JavaScript murni.",
      en: "Web anatomy, semantic DOM, responsive layout & vanilla JavaScript interactivity.",
    },
    tags: ["HTML5", "CSS3", "Vanilla JS", "DOM"],
    prerequisite: { id: "Prerequisite: Nol", en: "Prerequisite: None" },
    asciiArt: "+-----------------+\n| [x] [-] [O]     |\n|-----------------|\n|                 |\n|  Hello World!   |\n|                 |\n+-----------------+",
    bodyParagraphKeys: ["learn_c1_p1", "learn_c1_p2", "learn_c1_p3"],
    searchTerms: ["dasar", "web", "html", "css", "js", "javascript", "website", "frontend", "landing page"],
  },
  {
    id: "learn-card-2",
    number: 2,
    stage: 1,
    tracks: ["python", "ai"],
    trackBadge: { id: "🐍 Python Track", en: "🐍 Python Track" },
    titleKey: "learn_c2_title",
    summary: {
      id: "Sintaks manusiawi, computational logic, loops, conditionals, list & dictionary.",
      en: "Human-readable syntax, computational logic, loops, conditionals, lists & dictionaries.",
    },
    tags: ["Variables", "Loops", "Functions", "Data Structures"],
    prerequisite: { id: "Prerequisite: Nol", en: "Prerequisite: None" },
    asciiArt: "    ____\n   / . .\\\n   \\  ---<\n    \\  /\n  __/ /\n /___/",
    bodyParagraphKeys: ["learn_c2_p1", "learn_c2_p2", "learn_c2_p3"],
    searchTerms: ["pemrograman", "python", "logika", "data", "loop", "variable", "data science", "machine learning"],
  },
  {
    id: "learn-card-3",
    number: 3,
    stage: 2,
    tracks: ["ai"],
    trackBadge: { id: "🤖 AI & LLM Track", en: "🤖 AI & LLM Track" },
    titleKey: "learn_c3_title",
    summary: {
      id: "Pemrograman LLM presisi: context steering, Chain of Thought, JSON & few-shot formatting.",
      en: "Precision LLM programming: context steering, Chain of Thought, JSON & few-shot formatting.",
    },
    tags: ["LLM Context", "Chain of Thought", "JSON Schema", "Few-Shot"],
    prerequisite: { id: "Hubungan: AI Foundation", en: "Builds on: AI Foundation" },
    asciiArt: "   .---------.\n  |   LLM   |\n  |  BRAIN  |\n   `----. .-'\n        |/",
    bodyParagraphKeys: ["learn_c3_p1", "learn_c3_p2", "learn_c3_p3"],
    searchTerms: ["prompt engineering", "llm", "chatgpt", "claude", "ai", "instruksi", "chain of thought"],
  },
  {
    id: "learn-card-4",
    number: 4,
    stage: 2,
    tracks: ["python"],
    trackBadge: { id: "🐍 Python Track", en: "🐍 Python Track" },
    titleKey: "learn_c4_title",
    summary: {
      id: "RPA scripting: olah file massal, parse PDF, manipulasi spreadsheet & automasi email.",
      en: "RPA scripting: bulk file processing, PDF parsing, spreadsheet manipulation & email automation.",
    },
    tags: ["File System", "PDF / Excel", "Bulk Processing", "RPA Bots"],
    prerequisite: { id: "Hubungan: Lanjutan M2", en: "Builds on: Extension of M2" },
    asciiArt: "     _   _\n   /   \\\n  | (O) |\n   \\ _ /",
    bodyParagraphKeys: ["learn_c4_p1", "learn_c4_p2", "learn_c4_p3"],
    searchTerms: ["otomatisasi", "tugas harian", "script", "excel", "email", "pdf", "robot", "bot", "admin"],
  },
  {
    id: "learn-card-5",
    number: 5,
    stage: 3,
    tracks: ["python", "ai"],
    trackBadge: { id: "🤖 AI & Data Track", en: "🤖 AI & Data Track" },
    titleKey: "learn_c5_title",
    summary: {
      id: "Intuisi algoritmik, pola data empiris, regresi prediktif, klasifikasi & klastering.",
      en: "Algorithmic intuition, empirical data patterns, predictive regression, classification & clustering.",
    },
    tags: ["Data Patterns", "Regression", "Classification", "Model Intuition"],
    prerequisite: { id: "Hubungan: Lanjutan M2", en: "Builds on: Extension of M2" },
    asciiArt: "    o---o---o\n   / \\ / \\\n  o---o---o\n   \\ / \\ /\n    o---o",
    bodyParagraphKeys: ["learn_c5_p1", "learn_c5_p2", "learn_c5_p3"],
    searchTerms: ["machine learning", "ai", "konsep dasar", "regresi", "klasifikasi", "pola", "model", "data"],
  },
  {
    id: "learn-card-6",
    number: 6,
    stage: 3,
    tracks: ["web"],
    trackBadge: { id: "🌐 Web Track", en: "🌐 Web Track" },
    titleKey: "learn_c6_title",
    summary: {
      id: "SPA reactive architecture, reusable component design, hooks, state & Tailwind CSS.",
      en: "SPA reactive architecture, reusable component design, hooks, state & Tailwind CSS.",
    },
    tags: ["React.js", "Vite", "SPA State", "Tailwind"],
    prerequisite: { id: "Hubungan: Lanjutan M1", en: "Builds on: Extension of M1" },
    asciiArt: "    / \\\n   /   \\\n  /_____\\\n  \\     /\n   \\   /\n    \\ /",
    bodyParagraphKeys: ["learn_c6_p1", "learn_c6_p2", "learn_c6_p3"],
    searchTerms: ["frontend", "modern", "react", "vite", "spa", "component", "tailwind", "web", "interaktif"],
  },
  {
    id: "learn-card-7",
    number: 7,
    stage: 4,
    tracks: ["web", "python", "ai"],
    trackBadge: { id: "🚀 Full-Stack AI Integration", en: "🚀 Full-Stack AI Integration" },
    titleKey: "learn_c7_title",
    summary: {
      id: "Menggabungkan frontend modern, backend, dan AI API (OpenAI & Google Gemini) dengan authenticated REST endpoints, streaming responses, JSON schema generation, dan deployment produk nyata.",
      en: "Combining a modern frontend, backend, and AI API (OpenAI & Google Gemini) with authenticated REST endpoints, streaming responses, JSON schema generation, and real production deployment.",
    },
    tags: ["OpenAI & Gemini API", "Real-Time Streaming", "Full-Stack AI Apps", "JSON Schema Parsing", "Telegram/Web Assistants"],
    prerequisite: { id: "Konvergensi: M1, M2, M3, M6", en: "Convergence: M1, M2, M3, M6" },
    asciiArt: "  [ API ]\n    |\n    v\n  { JSON }\n    |\n    v\n  [ APP ]",
    bodyParagraphKeys: ["learn_c7_p1", "learn_c7_p2", "learn_c7_p3"],
    searchTerms: ["integrasi", "ai", "api", "openai", "gemini", "streaming", "json", "rest api", "bot"],
    isCapstone: true,
  },
];

/** Stage grouping + tree-flow render order, mirroring SOURCE's tier layout (module 6 renders before 5 in Stage 3). */
export const learningStages: LearningStage[] = [
  { stage: 1, titleKey: "learn_path_stage1_title", badgeKey: "learn_path_stage1_badge", moduleIds: ["learn-card-1", "learn-card-2"] },
  { stage: 2, titleKey: "learn_path_stage2_title", badgeKey: "learn_path_stage2_badge", moduleIds: ["learn-card-3", "learn-card-4"] },
  { stage: 3, titleKey: "learn_path_stage3_title", badgeKey: "learn_path_stage3_badge", moduleIds: ["learn-card-6", "learn-card-5"] },
  { stage: 4, titleKey: "learn_path_stage4_title", badgeKey: "learn_path_stage4_badge", moduleIds: ["learn-card-7"] },
];

export const learningTrackTabs: Array<{ value: LearningTrack | "all"; key: TranslationKey }> = [
  { value: "all", key: "learn_path_tab_all" },
  { value: "web", key: "learn_path_tab_web" },
  { value: "python", key: "learn_path_tab_python" },
  { value: "ai", key: "learn_path_tab_ai" },
];
