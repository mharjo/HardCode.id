import type { Locale, TranslationKey } from "../../data/translations";

/**
 * Pure quote-estimator pricing data & calculator, ported verbatim from
 * SOURCE's `QUOTE_CATEGORIES` / `QUOTE_COMPLEXITIES` / `QUOTE_FEATURES` /
 * `calculateTanyaQuote` (index.html ~L8698-8894). No React/DOM dependency so
 * it's directly unit-testable and reusable by `QuoteEstimator` and
 * `chatResponses`.
 */

export type QuoteCategoryId =
  | "landing"
  | "automation"
  | "internal_tool"
  | "ai_rag"
  | "scraping"
  | "payment"
  | "refactor"
  | "custom_mvp";

export type QuoteComplexityId = "simple" | "medium" | "complex" | "enterprise";

export type QuoteFeatureId = "auth" | "payment" | "sync" | "ai" | "scraping" | "deploy" | "warranty";

export interface QuoteCategory {
  id: QuoteCategoryId;
  icon: string;
  nameId: string;
  nameEn: string;
  baseDays: Record<QuoteComplexityId, number>;
  baseIdr: Record<QuoteComplexityId, [number, number]>;
  baseUsd: Record<QuoteComplexityId, [number, number]>;
}

export interface QuoteComplexity {
  id: QuoteComplexityId;
  labelId: string;
  labelEn: string;
  badgeId: string;
  badgeEn: string;
  dayMod: number;
  mult: number;
}

export interface QuoteFeature {
  id: QuoteFeatureId;
  nameId: string;
  nameEn: string;
  extraDays: number;
  extraIdr: [number, number];
  extraUsd: [number, number];
}

export const QUOTE_CATEGORY_ORDER: QuoteCategoryId[] = [
  "landing",
  "automation",
  "internal_tool",
  "ai_rag",
  "scraping",
  "payment",
  "refactor",
  "custom_mvp",
];

export const QUOTE_CATEGORIES: Record<QuoteCategoryId, QuoteCategory> = {
  landing: {
    id: "landing",
    icon: "🌐",
    nameId: "Landing Page & Portofolio",
    nameEn: "Landing Page & Portfolio",
    baseDays: { simple: 2, medium: 4, complex: 7, enterprise: 14 },
    baseIdr: {
      simple: [2500000, 4500000],
      medium: [4500000, 7500000],
      complex: [8000000, 14000000],
      enterprise: [16000000, 28000000],
    },
    baseUsd: { simple: [160, 290], medium: [290, 480], complex: [510, 900], enterprise: [1000, 1800] },
  },
  automation: {
    id: "automation",
    icon: "⚙️",
    nameId: "Otomasi Workflow & Webhook",
    nameEn: "Workflow Automation & Webhooks",
    baseDays: { simple: 2, medium: 5, complex: 9, enterprise: 16 },
    baseIdr: {
      simple: [3000000, 5000000],
      medium: [5500000, 9000000],
      complex: [9500000, 16000000],
      enterprise: [18000000, 32000000],
    },
    baseUsd: { simple: [190, 320], medium: [350, 580], complex: [610, 1030], enterprise: [1150, 2050] },
  },
  internal_tool: {
    id: "internal_tool",
    icon: "📊",
    nameId: "Internal Dashboard & CRUD",
    nameEn: "Internal Dashboard & CRUD",
    baseDays: { simple: 3, medium: 6, complex: 11, enterprise: 18 },
    baseIdr: {
      simple: [4000000, 6500000],
      medium: [7000000, 11500000],
      complex: [12000000, 20000000],
      enterprise: [22000000, 38000000],
    },
    baseUsd: { simple: [250, 420], medium: [450, 740], complex: [770, 1280], enterprise: [1410, 2430] },
  },
  ai_rag: {
    id: "ai_rag",
    icon: "🤖",
    nameId: "AI Chatbot & RAG Vector DB",
    nameEn: "AI Chatbot & RAG Vector DB",
    baseDays: { simple: 3, medium: 7, complex: 12, enterprise: 20 },
    baseIdr: {
      simple: [4500000, 7500000],
      medium: [8000000, 13500000],
      complex: [14000000, 24000000],
      enterprise: [26000000, 45000000],
    },
    baseUsd: { simple: [290, 480], medium: [510, 860], complex: [900, 1540], enterprise: [1660, 2880] },
  },
  scraping: {
    id: "scraping",
    icon: "🕷️",
    nameId: "Web Scraping & Data Pipeline",
    nameEn: "Web Scraping & Data Pipeline",
    baseDays: { simple: 2, medium: 5, complex: 9, enterprise: 16 },
    baseIdr: {
      simple: [3000000, 5000000],
      medium: [5500000, 9000000],
      complex: [9500000, 16000000],
      enterprise: [18000000, 30000000],
    },
    baseUsd: { simple: [190, 320], medium: [350, 580], complex: [610, 1030], enterprise: [1150, 1920] },
  },
  payment: {
    id: "payment",
    icon: "💳",
    nameId: "Payment Gateway Integration",
    nameEn: "Payment Gateway Integration",
    baseDays: { simple: 2, medium: 4, complex: 8, enterprise: 15 },
    baseIdr: {
      simple: [3000000, 5000000],
      medium: [5500000, 8500000],
      complex: [9000000, 15000000],
      enterprise: [17000000, 30000000],
    },
    baseUsd: { simple: [190, 320], medium: [350, 540], complex: [580, 960], enterprise: [1090, 1920] },
  },
  refactor: {
    id: "refactor",
    icon: "🧹",
    nameId: "Code Refactoring & Audit",
    nameEn: "Code Refactoring & Audit",
    baseDays: { simple: 2, medium: 5, complex: 9, enterprise: 16 },
    baseIdr: {
      simple: [3000000, 5000000],
      medium: [5500000, 9500000],
      complex: [10000000, 17000000],
      enterprise: [19000000, 34000000],
    },
    baseUsd: { simple: [190, 320], medium: [350, 610], complex: [640, 1090], enterprise: [1220, 2180] },
  },
  custom_mvp: {
    id: "custom_mvp",
    icon: "🚀",
    nameId: "Custom Fullstack MVP",
    nameEn: "Custom Fullstack MVP",
    baseDays: { simple: 4, medium: 8, complex: 14, enterprise: 24 },
    baseIdr: {
      simple: [5500000, 9000000],
      medium: [9500000, 16000000],
      complex: [17000000, 29000000],
      enterprise: [32000000, 55000000],
    },
    baseUsd: { simple: [350, 580], medium: [610, 1030], complex: [1090, 1860], enterprise: [2050, 3520] },
  },
};

export const QUOTE_COMPLEXITY_ORDER: QuoteComplexityId[] = ["simple", "medium", "complex", "enterprise"];

export const QUOTE_COMPLEXITIES: Record<QuoteComplexityId, QuoteComplexity> = {
  simple: {
    id: "simple",
    labelId: "Ringan (MVP Cepat)",
    labelEn: "Simple (Fast MVP)",
    badgeId: "1–3 Hari",
    badgeEn: "1–3 Days",
    dayMod: 0,
    mult: 1.0,
  },
  medium: {
    id: "medium",
    labelId: "Menengah (Standar)",
    labelEn: "Medium (Standard)",
    badgeId: "4–8 Hari",
    badgeEn: "4–8 Days",
    dayMod: 2,
    mult: 1.3,
  },
  complex: {
    id: "complex",
    labelId: "Kompleks (Multi-Sistem)",
    labelEn: "Complex (Multi-System)",
    badgeId: "9–18 Hari",
    badgeEn: "9–18 Days",
    dayMod: 4,
    mult: 1.7,
  },
  enterprise: {
    id: "enterprise",
    labelId: "Skala Besar / Custom",
    labelEn: "Enterprise / Custom",
    badgeId: "20+ Hari",
    badgeEn: "20+ Days",
    dayMod: 8,
    mult: 2.3,
  },
};

export const QUOTE_FEATURE_ORDER: QuoteFeatureId[] = ["auth", "payment", "sync", "ai", "scraping", "deploy", "warranty"];

export const QUOTE_FEATURES: Record<QuoteFeatureId, QuoteFeature> = {
  auth: {
    id: "auth",
    nameId: "Auth & Multi-Role Permissions",
    nameEn: "Auth & Multi-Role Permissions",
    extraDays: 1,
    extraIdr: [1000000, 2000000],
    extraUsd: [65, 130],
  },
  payment: {
    id: "payment",
    nameId: "Payment Gateway Webhook (Midtrans/Stripe)",
    nameEn: "Payment Gateway Webhook (Midtrans/Stripe)",
    extraDays: 1,
    extraIdr: [1200000, 2200000],
    extraUsd: [75, 140],
  },
  sync: {
    id: "sync",
    nameId: "Sync Google Sheets / Telegram Bot",
    nameEn: "Sync Google Sheets / Telegram Bot",
    extraDays: 1,
    extraIdr: [800000, 1500000],
    extraUsd: [50, 95],
  },
  ai: {
    id: "ai",
    nameId: "Integrasi Gemini AI / LLM Pipeline",
    nameEn: "Gemini AI Integration / LLM Pipeline",
    extraDays: 2,
    extraIdr: [1500000, 3000000],
    extraUsd: [95, 190],
  },
  scraping: {
    id: "scraping",
    nameId: "Scraper Otomatis & CRON Worker",
    nameEn: "Automated Scraper & CRON Worker",
    extraDays: 1,
    extraIdr: [1000000, 2000000],
    extraUsd: [65, 130],
  },
  deploy: {
    id: "deploy",
    nameId: "Cloud Deployment (SSL + Domain)",
    nameEn: "Cloud Deployment (SSL + Domain)",
    extraDays: 1,
    extraIdr: [600000, 1200000],
    extraUsd: [40, 75],
  },
  warranty: {
    id: "warranty",
    nameId: "Garansi 30 Hari & Handover Walkthrough",
    nameEn: "30-Day Warranty & Handover Walkthrough",
    extraDays: 0,
    extraIdr: [0, 0],
    extraUsd: [0, 0],
  },
};

export const DEFAULT_QUOTE_STATE: QuoteState = {
  category: "landing",
  complexity: "simple",
  features: ["warranty"],
};

export interface QuoteState {
  category: QuoteCategoryId;
  complexity: QuoteComplexityId;
  features: QuoteFeatureId[];
}

export interface QuoteCalculation {
  cat: QuoteCategory;
  comp: QuoteComplexity;
  features: QuoteFeature[];
  minDays: number;
  maxDays: number;
  minIdr: number;
  maxIdr: number;
  minUsd: number;
  maxUsd: number;
  timelineText: string;
  priceText: string;
  typeTag: string;
}

/** e.g. 2500000 -> "2.5jt", 500000 -> "500rb" — mirrors SOURCE's local `formatIdrShorthand`. */
export function formatIdrShorthand(num: number): string {
  if (num >= 1000000) {
    const mil = num / 1000000;
    return (mil % 1 === 0 ? mil.toFixed(0) : mil.toFixed(1)) + "jt";
  }
  return (num / 1000).toFixed(0) + "rb";
}

/** Full-precision IDR, for the copy/print summary — mirrors SOURCE's `formatIdr`. */
export function formatIdr(num: number): string {
  return "Rp " + num.toLocaleString("id-ID");
}

/** Full-precision USD, for the copy/print summary — mirrors SOURCE's `formatUsd`. */
export function formatUsd(num: number): string {
  return "$" + num.toLocaleString("en-US");
}

/**
 * Mirrors SOURCE's `calculateTanyaQuote` exactly, including its quirk that
 * `comp.mult` is read but never applied to price (each complexity tier
 * already carries its own base price range) — `dayMod` is only used as a
 * boolean gate on `maxDays`, not added directly.
 */
export function calculateQuote(state: QuoteState, lang: Locale): QuoteCalculation {
  const cat = QUOTE_CATEGORIES[state.category] ?? QUOTE_CATEGORIES.landing;
  const comp = QUOTE_COMPLEXITIES[state.complexity] ?? QUOTE_COMPLEXITIES.simple;

  const baseDays = cat.baseDays[state.complexity] ?? 3;
  const [baseMinIdr, baseMaxIdr] = cat.baseIdr[state.complexity] ?? [2500000, 4500000];
  const [baseMinUsd, baseMaxUsd] = cat.baseUsd[state.complexity] ?? [160, 290];

  let totalExtraDays = 0;
  let totalExtraIdrMin = 0;
  let totalExtraIdrMax = 0;
  let totalExtraUsdMin = 0;
  let totalExtraUsdMax = 0;
  const features: QuoteFeature[] = [];

  for (const fKey of state.features) {
    const feat = QUOTE_FEATURES[fKey];
    if (!feat) continue;
    totalExtraDays += feat.extraDays;
    totalExtraIdrMin += feat.extraIdr[0];
    totalExtraIdrMax += feat.extraIdr[1];
    totalExtraUsdMin += feat.extraUsd[0];
    totalExtraUsdMax += feat.extraUsd[1];
    features.push(feat);
  }

  const minDays = baseDays + (totalExtraDays > 0 ? 1 : 0);
  const maxDays = baseDays + totalExtraDays + (comp.dayMod > 0 ? 1 : 0);

  const minIdr = baseMinIdr + totalExtraIdrMin;
  const maxIdr = baseMaxIdr + totalExtraIdrMax;
  const minUsd = baseMinUsd + totalExtraUsdMin;
  const maxUsd = baseMaxUsd + totalExtraUsdMax;

  const timelineText =
    lang === "en" ? `${minDays} – ${maxDays} Work Days` : `${minDays} – ${maxDays} Hari Kerja`;

  const priceText =
    lang === "en"
      ? `$${minUsd.toLocaleString()} – $${maxUsd.toLocaleString()}`
      : `Rp ${formatIdrShorthand(minIdr)} – ${formatIdrShorthand(maxIdr)}`;

  const typeTag = `${lang === "en" ? cat.nameEn : cat.nameId} • ${lang === "en" ? comp.labelEn : comp.labelId}`;

  return { cat, comp, features, minDays, maxDays, minIdr, maxIdr, minUsd, maxUsd, timelineText, priceText, typeTag };
}

/** Mirrors SOURCE's `generateQuoteSummaryText` (used for copy-to-clipboard and the /konsultasi prefill). */
export function generateQuoteSummaryText(state: QuoteState, lang: Locale, now: Date = new Date()): string {
  const calc = calculateQuote(state, lang);
  const catName = lang === "en" ? calc.cat.nameEn : calc.cat.nameId;
  const compLabel = lang === "en" ? calc.comp.labelEn : calc.comp.labelId;
  const featNames = calc.features.map((f) => `  • ${lang === "en" ? f.nameEn : f.nameId}`).join("\n");

  if (lang === "en") {
    return (
      `[PROJECT ESTIMATE VIA HARDCODE.ID]\n` +
      `• Project Type: ${catName}\n` +
      `• Complexity: ${compLabel}\n` +
      `• Features:\n${featNames || "  • Standard Baseline"}\n` +
      `• Estimated Timeline: ${calc.timelineText}\n` +
      `• Investment Range: ${calc.priceText}\n` +
      `• Generated on: ${now.toLocaleDateString("en-US")}`
    );
  }

  return (
    `[ESTIMASI PROJECT VIA HARDCODE.ID]\n` +
    `• Jenis Project: ${catName}\n` +
    `• Kompleksitas: ${compLabel}\n` +
    `• Fitur Tambahan:\n${featNames || "  • Paket Standar"}\n` +
    `• Estimasi Timeline: ${calc.timelineText}\n` +
    `• Kisaran Investasi: ${calc.priceText}\n` +
    `• Dibuat pada: ${now.toLocaleDateString("id-ID")}`
  );
}

export function toggleQuoteFeature(features: QuoteFeatureId[], featKey: QuoteFeatureId): QuoteFeatureId[] {
  return features.includes(featKey) ? features.filter((f) => f !== featKey) : [...features, featKey];
}

export function generatePrintableQuoteHtml(calc: QuoteCalculation, lang: Locale, t: (key: TranslationKey) => string, now: Date = new Date()): string {
  const printDateStr = now.toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const catName = lang === "en" ? calc.cat.nameEn : calc.cat.nameId;
  const compLabel = lang === "en" ? calc.comp.labelEn : calc.comp.labelId;

  const featuresRows = calc.features
    .map((feat) => {
      const featName = lang === "en" ? feat.nameEn : feat.nameId;
      const featMeta = feat.id === "warranty" ? t("quote_included") : `+${feat.extraDays}d`;
      return `<tr><td>${featName}</td><td>${featMeta}</td></tr>`;
    })
    .join("\n            ");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${t("quote_print_summary_title")}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #1a1a1a; padding: 2rem; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #eaeaea; padding-bottom: 12px; margin-bottom: 16px; }
    .logo { font-family: monospace; font-weight: 700; font-size: 16px; }
    .meta { font-family: monospace; font-size: 11px; color: #666; }
    h1 { font-size: 20px; margin: 0 0 14px 0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
    th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eaeaea; }
    td:first-child, th:first-child { width: 40%; color: #666; }
    th { font-weight: 700; }
    .footer { font-size: 10.5px; color: #888; border-top: 1px solid #eaeaea; padding-top: 10px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">{tanya} &middot; hardcode.id</div>
    <div class="meta">${printDateStr}</div>
  </div>
  <h1>${t("quote_print_summary_title")}</h1>
  <table>
    <tbody>
      <tr>
        <td>${t("quote_type_label")}</td>
        <td>${calc.cat.icon} ${catName}</td>
      </tr>
      <tr>
        <td>${t("quote_complexity_label")}</td>
        <td>${compLabel}</td>
      </tr>
      <tr>
        <td>${t("quote_est_timeline")}</td>
        <td>${calc.timelineText}</td>
      </tr>
      <tr>
        <td>${t("quote_est_investment")}</td>
        <td>${calc.priceText}</td>
      </tr>
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th>${t("quote_features_label")}</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${featuresRows}
    </tbody>
  </table>
  <p class="footer">${t("quote_print_footer")}</p>
</body>
</html>`;
}
