import { Link } from "react-router-dom";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { articles } from "../../data/articles";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./ArticlesPreviewSection.module.css";

const PREVIEW_COUNT = 3;

export function ArticlesPreviewSection() {
  const { locale, t } = useI18n();
  const preview = articles.slice(0, PREVIEW_COUNT);

  return (
    <section id="tulisan" aria-labelledby="tulisan-heading">
      <SectionHeader index="05" title={t("sec_articles_title")} headingId="tulisan-heading" />
      <p className={styles.subtitle}>{t("sec_articles_subtitle")}</p>

      <div className={styles.grid} role="feed" aria-label={t("sec_articles_title")}>
        {preview.map((article) => (
          <article key={article.id} className={styles.card}>
            <Link to={`/artikel/${article.id}`} className={styles.cardLink}>
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge}>{article.categoryLabel[locale]}</span>
                <span className={styles.meta}>
                  <span>{article.date[locale]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readingTime[locale]}</span>
                </span>
              </div>
              <h3 className={styles.title}>{article.title[locale]}</h3>
              <p className={styles.excerpt}>{article.excerpt[locale]}</p>
            </Link>
            <div className={styles.tags}>
              {article.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <Link to={`/artikel/${article.id}`} className={styles.cardFooter}>
              <span className={styles.readMore}>{t("articles_read_more")}</span>
            </Link>
          </article>
        ))}
      </div>

      <Link to="/artikel" className={styles.viewAll}>
        {t("articles_view_all")}
      </Link>
    </section>
  );
}
