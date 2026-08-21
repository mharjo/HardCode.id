import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SeoHead } from "../../components/seo/SeoHead";
import type { ArticleCategory } from "../../data/articles";
import { articles } from "../../data/articles";
import type { TranslationKey } from "../../data/translations";
import { useI18n } from "../../i18n/I18nContext";
import { ArticleCard } from "./ArticleCard";
import { filterAndSortArticles, getAllArticleTags, normalizeTag, type ArticleSortOrder } from "./articleFilters";
import styles from "./ArticlesPage.module.css";

const CATEGORY_TABS: Array<{ value: ArticleCategory | "all"; key: TranslationKey }> = [
  { value: "all", key: "articles_filter_all" },
  { value: "mental-model", key: "articles_filter_mental" },
  { value: "ai-llm", key: "articles_filter_ai" },
  { value: "python-automation", key: "articles_filter_python" },
  { value: "web-frontend", key: "articles_filter_web" },
];

export function ArticlesPage() {
  const { locale, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ArticleCategory | "all">("all");
  const [activeTag, setActiveTag] = useState<string | null>(() => searchParams.get("tag"));
  const [sort, setSort] = useState<ArticleSortOrder>("newest");

  const allTags = useMemo(() => getAllArticleTags(articles), []);

  const filtered = useMemo(
    () => filterAndSortArticles(articles, { category, activeTag, search, sort, locale }),
    [category, activeTag, search, sort, locale],
  );

  const hasActiveFilters = category !== "all" || activeTag !== null || search.trim().length > 0;

  const updateTag = (tag: string | null) => {
    setActiveTag(tag);
    setSearchParams(tag ? { tag } : {}, { replace: true });
  };

  const handleTagClick = (tag: string) => {
    updateTag(activeTag && normalizeTag(activeTag) === normalizeTag(tag) ? null : tag);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    updateTag(null);
    setSort("newest");
  };

  return (
    <div className={styles.page}>
      <SeoHead titleKey="seo_articles_title" descKey="seo_articles_desc" path="/artikel" ogType="website" />
      <header className={styles.header}>
        <h1 className={styles.title}>{t("articles_page_title")}</h1>
        <p className={styles.subtitle}>{t("sec_articles_subtitle")}</p>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchRow}>
          <label htmlFor="articles-search-input" className="visually-hidden">
            {t("articles_search_ph")}
          </label>
          <input
            id="articles-search-input"
            type="search"
            className={styles.searchInput}
            placeholder={t("articles_search_ph")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search.length > 0 && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setSearch("")}
              aria-label={t("articles_search_clear_aria")}
            >
              ×
            </button>
          )}

          <label htmlFor="articles-sort-select" className={styles.sortLabel}>
            {t("articles_sort_label")}
          </label>
          <select
            id="articles-sort-select"
            className={styles.sortSelect}
            value={sort}
            onChange={(event) => setSort(event.target.value as ArticleSortOrder)}
          >
            <option value="newest">{t("articles_sort_newest")}</option>
            <option value="alphabetical">{t("articles_sort_alpha")}</option>
          </select>
        </div>

        <div className={styles.categoryTabs} role="tablist" aria-label={t("articles_page_title")}>
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={category === tab.value}
              className={`${styles.categoryTab} ${category === tab.value ? styles.categoryTabActive : ""}`}
              onClick={() => setCategory(tab.value)}
            >
              {t(tab.key)}
            </button>
          ))}
        </div>

        <div className={styles.tagCloud}>
          <button
            type="button"
            className={`${styles.tagPill} ${activeTag === null ? styles.tagPillActive : ""}`}
            onClick={() => updateTag(null)}
          >
            {t("articles_tags_all")} <span className={styles.tagCount}>{articles.length}</span>
          </button>
          {allTags.map((tag) => (
            <button
              key={tag.clean}
              type="button"
              className={`${styles.tagPill} ${activeTag && normalizeTag(activeTag) === tag.clean ? styles.tagPillActive : ""}`}
              onClick={() => handleTagClick(tag.display)}
            >
              {tag.display} <span className={styles.tagCount}>{tag.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultBar}>
        <span>
          {hasActiveFilters
            ? t("articles_result_count").replace("{count}", String(filtered.length)).replace("{total}", String(articles.length))
            : t("articles_result_count_all").replace("{count}", String(filtered.length))}
        </span>
        {hasActiveFilters && (
          <button type="button" className={styles.resetBtn} onClick={resetFilters}>
            {t("articles_reset_btn")}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>{t("articles_empty_title")}</p>
          <p className={styles.emptyDesc}>{t("articles_empty_desc")}</p>
          <button type="button" className={styles.resetBtn} onClick={resetFilters}>
            {t("articles_reset_btn")}
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} activeTag={activeTag} onTagClick={handleTagClick} />
          ))}
        </div>
      )}
    </div>
  );
}
