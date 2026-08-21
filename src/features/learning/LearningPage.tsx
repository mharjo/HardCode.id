import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SeoHead } from "../../components/seo/SeoHead";
import { learningModules, learningStages } from "../../data/learning";
import type { LearningTrack } from "../../data/learning";
import { useI18n } from "../../i18n/I18nContext";
import { filterLearningModules } from "./learningFilters";
import { ModuleCard } from "./ModuleCard";
import { SkillPathRoadmap } from "./SkillPathRoadmap";
import styles from "./LearningPage.module.css";

export function LearningPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState<LearningTrack | "all">("all");

  const filtered = useMemo(() => filterLearningModules(learningModules, { track, search }), [track, search]);

  const hasActiveFilters = track !== "all" || search.trim().length > 0;

  const resetFilters = () => {
    setSearch("");
    setTrack("all");
  };

  return (
    <div className={styles.page}>
      <SeoHead titleKey="seo_learning_title" descKey="seo_learning_desc" path="/belajar" ogType="website" />
      <Link to="/" className={styles.backLink}>
        {t("learn_back_link")}
      </Link>
      <h1 className={styles.title}>{t("learn_main_title")}</h1>
      <p className={styles.desc}>{t("learn_main_desc")}</p>

      <div className={styles.searchRow}>
        <label htmlFor="learning-search-input" className="visually-hidden">
          {t("learn_search_ph")}
        </label>
        <input
          id="learning-search-input"
          type="search"
          className={styles.searchInput}
          placeholder={t("learn_search_ph")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {search.length > 0 && (
          <button
            type="button"
            className={styles.searchClear}
            onClick={() => setSearch("")}
            aria-label={t("learn_search_clear_aria")}
          >
            ×
          </button>
        )}
      </div>

      <SkillPathRoadmap modules={filtered} stages={learningStages} track={track} onTrackChange={setTrack} />

      <div className={styles.resultBar}>
        <span>
          {hasActiveFilters
            ? t("learn_result_count").replace("{count}", String(filtered.length)).replace("{total}", String(learningModules.length))
            : t("learn_result_count_all").replace("{count}", String(filtered.length))}
        </span>
        {hasActiveFilters && (
          <button type="button" className={styles.resetBtn} onClick={resetFilters}>
            {t("learn_reset_btn")}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>{t("learn_empty_title")}</p>
          <p className={styles.emptyDesc}>{t("learn_empty")}</p>
          <button type="button" className={styles.resetBtn} onClick={resetFilters}>
            {t("learn_reset_btn")}
          </button>
        </div>
      ) : (
        <div className={styles.cardsList}>
          {filtered.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      )}
    </div>
  );
}
