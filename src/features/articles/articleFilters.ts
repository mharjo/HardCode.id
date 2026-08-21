import type { Article, ArticleCategory } from "../../data/articles";
import type { Locale } from "../../data/translations";

export type ArticleSortOrder = "newest" | "alphabetical";

export interface ArticleTagCount {
  display: string;
  clean: string;
  count: number;
}

/** Strips a leading '#', trims, and lowercases a tag for comparison/dedupe. */
export function normalizeTag(tag: string): string {
  return tag.trim().replace(/^#/, "").toLowerCase();
}

/** Unique tags across all articles, sorted by frequency then alphabetically, mirroring SOURCE's `getAllArticleTags`. */
export function getAllArticleTags(articles: Article[]): ArticleTagCount[] {
  const map = new Map<string, ArticleTagCount>();
  for (const article of articles) {
    for (const rawTag of article.tags) {
      const clean = normalizeTag(rawTag);
      if (!clean) continue;
      const existing = map.get(clean);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(clean, { display: rawTag.startsWith("#") ? rawTag : `#${rawTag}`, clean, count: 1 });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.display.localeCompare(b.display));
}

export interface ArticleFilterParams {
  category: ArticleCategory | "all";
  activeTag: string | null;
  search: string;
  sort: ArticleSortOrder;
  locale: Locale;
}

/** Case-insensitive substring match against both locales' title/excerpt/tags/category, matching SOURCE's dual-language search. */
function matchesSearch(article: Article, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    article.title.id,
    article.title.en,
    article.excerpt.id,
    article.excerpt.en,
    article.tags.join(" "),
    article.categoryLabel.id,
    article.categoryLabel.en,
    article.category,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function matchesTag(article: Article, activeCleanTag: string): boolean {
  return article.tags.some((tag) => {
    const cleanTag = normalizeTag(tag);
    return cleanTag === activeCleanTag || cleanTag.includes(activeCleanTag) || activeCleanTag.includes(cleanTag);
  });
}

/** Filters then sorts articles per the given params, mirroring SOURCE's `renderArticlesGrid` filter/sort pipeline. */
export function filterAndSortArticles(articles: Article[], params: ArticleFilterParams): Article[] {
  const activeCleanTag = params.activeTag ? normalizeTag(params.activeTag) : null;

  const filtered = articles.filter((article) => {
    if (params.category !== "all" && article.category !== params.category) return false;
    if (activeCleanTag && !matchesTag(article, activeCleanTag)) return false;
    if (!matchesSearch(article, params.search)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (params.sort === "alphabetical") {
      return a.title[params.locale].localeCompare(b.title[params.locale], params.locale);
    }
    return new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime();
  });

  return sorted;
}
