import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SeoHead } from "../../components/seo/SeoHead";
import { projectTypes } from "../../data/projects";
import { useI18n } from "../../i18n/I18nContext";
import { filterProjectsBySearch } from "./projectFilters";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectsPage.module.css";

export function ProjectsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => filterProjectsBySearch(projectTypes, search), [search]);

  const hasActiveFilters = search.trim().length > 0;

  const resetFilters = () => setSearch("");

  return (
    <div className={styles.page}>
      <SeoHead titleKey="seo_proyek_title" descKey="seo_proyek_desc" path="/proyek" ogType="website" />
      <Link to="/" className={styles.backLink}>
        {t("proj_back_link")}
      </Link>
      <h1 className={styles.title}>{t("proj_main_title")}</h1>
      <p className={styles.desc}>{t("proj_main_desc")}</p>

      <div className={styles.searchRow}>
        <label htmlFor="projects-search-input" className="visually-hidden">
          {t("proj_search_ph")}
        </label>
        <input
          id="projects-search-input"
          type="search"
          className={styles.searchInput}
          placeholder={t("proj_search_ph")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {search.length > 0 && (
          <button
            type="button"
            className={styles.searchClear}
            onClick={() => setSearch("")}
            aria-label={t("proj_search_clear_aria")}
          >
            ×
          </button>
        )}
      </div>

      <div className={styles.resultBar}>
        <span>
          {hasActiveFilters
            ? t("proj_result_count").replace("{count}", String(filtered.length)).replace("{total}", String(projectTypes.length))
            : t("proj_result_count_all").replace("{count}", String(filtered.length))}
        </span>
        {hasActiveFilters && (
          <button type="button" className={styles.resetBtn} onClick={resetFilters}>
            {t("proj_reset_btn")}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>{t("proj_empty_title")}</p>
          <p className={styles.emptyDesc}>{t("proj_empty")}</p>
          <button type="button" className={styles.resetBtn} onClick={resetFilters}>
            {t("proj_reset_btn")}
          </button>
        </div>
      ) : (
        <div className={styles.cardsList}>
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
