import { useId } from "react";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number | null;
}

export function HeroSection({ query, onQueryChange, resultCount }: HeroSectionProps) {
  const { t } = useI18n();
  const searchInputId = useId();

  const statsLabel =
    resultCount === null
      ? null
      : t("hero_search_stats").replace("{count}", String(resultCount)).replace("{query}", query);

  return (
    <div className={styles.hero}>
      <div className={styles.bgGlyph} aria-hidden="true">
        {"{ }"}
      </div>
      <div className={styles.pill}>
        <span className={styles.pillDot} aria-hidden="true">
          ●
        </span>
        {t("hero_pill")}
      </div>
      <h1 className={styles.title}>
        {t("hero_title_main")} <em>{t("hero_title_em")}</em>
      </h1>
      <p className={styles.desc}>{t("hero_desc")}</p>

      <div className={styles.searchWrapper}>
        <label htmlFor={searchInputId} className="visually-hidden">
          {t("hero_search_ph")}
        </label>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">
            🔍
          </span>
          <input
            id={searchInputId}
            type="text"
            className={styles.searchInput}
            placeholder={t("hero_search_ph")}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {query.length > 0 && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => onQueryChange("")}
              title={t("hero_search_clear_aria")}
              aria-label={t("hero_search_clear_aria")}
            >
              ✕
            </button>
          )}
        </div>
        {statsLabel !== null && (
          <div className={styles.searchStats} role="status">
            {statsLabel}
          </div>
        )}
      </div>
    </div>
  );
}
