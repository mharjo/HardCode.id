import { describe, expect, it } from "vitest";
import {
  calculateQuote,
  DEFAULT_QUOTE_STATE,
  formatIdr,
  formatIdrShorthand,
  formatUsd,
  generateQuoteSummaryText,
  toggleQuoteFeature,
  type QuoteState,
} from "./quoteConfig";

describe("formatIdrShorthand", () => {
  it("formats whole millions without a decimal", () => {
    expect(formatIdrShorthand(2000000)).toBe("2jt");
  });

  it("formats fractional millions with one decimal", () => {
    expect(formatIdrShorthand(2500000)).toBe("2.5jt");
  });

  it("formats sub-million amounts as thousands", () => {
    expect(formatIdrShorthand(500000)).toBe("500rb");
  });
});

describe("formatIdr / formatUsd", () => {
  it("formats full-precision IDR with the id-ID separator", () => {
    expect(formatIdr(2500000)).toBe("Rp 2.500.000");
  });

  it("formats full-precision USD with a leading dollar sign", () => {
    expect(formatUsd(1500)).toBe("$1,500");
  });
});

describe("calculateQuote", () => {
  it("matches the default landing/simple/[warranty] baseline", () => {
    const calc = calculateQuote(DEFAULT_QUOTE_STATE, "id");
    expect(calc.minDays).toBe(2);
    expect(calc.maxDays).toBe(2);
    expect(calc.minIdr).toBe(2500000);
    expect(calc.maxIdr).toBe(4500000);
    expect(calc.priceText).toBe("Rp 2.5jt – 4.5jt");
    expect(calc.timelineText).toBe("2 – 2 Hari Kerja");
  });

  it("adds +1 min/max day once any paid feature is selected", () => {
    const state: QuoteState = { category: "landing", complexity: "simple", features: ["warranty", "auth"] };
    const calc = calculateQuote(state, "id");
    expect(calc.minDays).toBe(3);
    expect(calc.maxDays).toBe(3);
    expect(calc.minIdr).toBe(2500000 + 1000000);
    expect(calc.maxIdr).toBe(4500000 + 2000000);
  });

  it("adds the dayMod-gated +1 to maxDays for non-simple complexity", () => {
    const state: QuoteState = { category: "landing", complexity: "medium", features: [] };
    const calc = calculateQuote(state, "id");
    // baseDays(medium)=4, no extra features -> minDays = 4 + 0, maxDays = 4 + 0 + 1 (dayMod>0)
    expect(calc.minDays).toBe(4);
    expect(calc.maxDays).toBe(5);
  });

  it("renders English copy when lang is en", () => {
    const calc = calculateQuote(DEFAULT_QUOTE_STATE, "en");
    expect(calc.priceText).toBe("$160 – $290");
    expect(calc.timelineText).toBe("2 – 2 Work Days");
  });

  it("falls back to the landing/simple entry for an unknown category or complexity", () => {
    const state = { category: "does-not-exist", complexity: "does-not-exist", features: [] } as unknown as QuoteState;
    const calc = calculateQuote(state, "id");
    expect(calc.cat.id).toBe("landing");
    expect(calc.comp.id).toBe("simple");
  });
});

describe("toggleQuoteFeature", () => {
  it("adds a feature not yet present", () => {
    expect(toggleQuoteFeature(["warranty"], "auth")).toEqual(["warranty", "auth"]);
  });

  it("removes a feature already present", () => {
    expect(toggleQuoteFeature(["warranty", "auth"], "auth")).toEqual(["warranty"]);
  });
});

describe("generateQuoteSummaryText", () => {
  it("includes category, complexity, and feature names in Indonesian", () => {
    const now = new Date(2026, 7, 21);
    const text = generateQuoteSummaryText(DEFAULT_QUOTE_STATE, "id", now);
    expect(text).toContain("[ESTIMASI PROJECT VIA HARDCODE.ID]");
    expect(text).toContain("Landing Page & Portofolio");
    expect(text).toContain("Garansi 30 Hari & Handover Walkthrough");
  });

  it("uses the English template when lang is en", () => {
    const now = new Date(2026, 7, 21);
    const text = generateQuoteSummaryText(DEFAULT_QUOTE_STATE, "en", now);
    expect(text).toContain("[PROJECT ESTIMATE VIA HARDCODE.ID]");
  });
});
