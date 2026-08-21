import { Link } from "react-router-dom";
import type { Article } from "../../data/articles";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps {
  article: Article;
  activeTag?: string | null;
  onTagClick?: (tag: string) => void;
}

export function ArticleCard({ article, activeTag, onTagClick }: ArticleCardProps) {
  const { locale, t } = useI18n();

  return (
    <article className={styles.card}>
      <Link to={`/artikel/${article.id}`} className={styles.cardLink}>
        <div className={styles.cardHeader}>
          <span className={styles.categoryBadge}>{article.categoryLabel[locale]}</span>
          <span className={styles.meta}>
            <span>{article.readingTime[locale]}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date[locale]}</span>
          </span>
        </div>
        <h3 className={styles.title}>{article.title[locale]}</h3>
        <p className={styles.excerpt}>{article.excerpt[locale]}</p>
      </Link>

      <div className={styles.tags}>
        {article.tags.map((tag) => {
          const isActive = activeTag != null && tag.toLowerCase() === activeTag.toLowerCase();
          return onTagClick ? (
            <button
              key={tag}
              type="button"
              className={`${styles.tag} ${isActive ? styles.tagActive : ""}`}
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </button>
          ) : (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          );
        })}
      </div>

      <Link to={`/artikel/${article.id}`} className={styles.cardFooter}>
        <span className={styles.readMore}>{t("articles_read_more")}</span>
      </Link>
    </article>
  );
}
