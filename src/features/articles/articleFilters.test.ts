import { describe, expect, it } from "vitest";
import { articles } from "../../data/articles";
import { filterAndSortArticles, getAllArticleTags, normalizeTag } from "./articleFilters";

describe("normalizeTag", () => {
  it("strips a leading #, trims, and lowercases", () => {
    expect(normalizeTag("  #Python  ")).toBe("python");
    expect(normalizeTag("AI-Era")).toBe("ai-era");
  });
});

describe("getAllArticleTags", () => {
  it("dedupes tags across articles and counts occurrences", () => {
    const tags = getAllArticleTags(articles);
    const automation = tags.find((tag) => tag.clean === "automation");
    expect(automation).toBeDefined();
    expect(automation?.count).toBeGreaterThanOrEqual(2);
    expect(automation?.display).toBe("#automation");
  });

  it("sorts by descending count, then alphabetically", () => {
    const tags = getAllArticleTags(articles);
    for (let i = 1; i < tags.length; i += 1) {
      const prev = tags[i - 1]!;
      const curr = tags[i]!;
      expect(prev.count >= curr.count).toBe(true);
    }
  });
});

describe("filterAndSortArticles", () => {
  const baseParams = { category: "all" as const, activeTag: null, search: "", sort: "newest" as const, locale: "id" as const };

  it("defaults to newest-first ordering", () => {
    const result = filterAndSortArticles(articles, baseParams);
    expect(result[0]?.id).toBe("menghafal-sintaks");
    expect(result[result.length - 1]?.id).toBe("spreadsheet-ke-crud-dashboard");
  });

  it("sorts alphabetically by localized title when requested", () => {
    const result = filterAndSortArticles(articles, { ...baseParams, sort: "alphabetical" });
    const titles = result.map((a) => a.title.id);
    const expected = [...titles].sort((a, b) => a.localeCompare(b, "id"));
    expect(titles).toEqual(expected);
  });

  it("filters by category", () => {
    const result = filterAndSortArticles(articles, { ...baseParams, category: "python-automation" });
    expect(result.every((a) => a.category === "python-automation")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by active tag (normalized, partial match)", () => {
    const result = filterAndSortArticles(articles, { ...baseParams, activeTag: "#automation" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((a) => a.tags.some((t) => normalizeTag(t).includes("automation")))).toBe(true);
  });

  it("filters by search query across id/en title, excerpt, tags, category", () => {
    const result = filterAndSortArticles(articles, { ...baseParams, search: "scraper" });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("python-web-scraper");
  });

  it("matches search terms only present in the non-active locale", () => {
    const result = filterAndSortArticles(articles, { ...baseParams, search: "Weak Prompt".toLowerCase() });
    expect(result).toEqual([]);
    const englishOnly = filterAndSortArticles(articles, { ...baseParams, search: "hallucinat" });
    expect(englishOnly.length).toBeGreaterThan(0);
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterAndSortArticles(articles, { ...baseParams, search: "no-such-topic-xyz" });
    expect(result).toEqual([]);
  });
});
