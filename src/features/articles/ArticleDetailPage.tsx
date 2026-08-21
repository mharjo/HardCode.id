import { Link, useParams } from "react-router-dom";
import { SeoHead } from "../../components/seo/SeoHead";
import { articles } from "../../data/articles";
import { contactEmail } from "../../data/site";
import { useI18n } from "../../i18n/I18nContext";
import { ArticleBody } from "./ArticleBody";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { ShareButton } from "./ShareButton";
import { countWords } from "./readingStats";
import styles from "./ArticleDetailPage.module.css";

const RELATED_COUNT = 2;

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale, t } = useI18n();
  const article = articles.find((a) => a.id === slug);

  if (!article) {
    return (
      <div className={styles.notFound}>
        <SeoHead titleKey="article_not_found_title" descKey="article_not_found_desc" path="/artikel" ogType="website" />
        <h1>{t("article_not_found_title")}</h1>
        <p>{t("article_not_found_desc")}</p>
        <Link to="/artikel">{t("article_not_found_back")}</Link>
      </div>
    );
  }

  const wordCount = countWords(article.content[locale]);
  const related = articles.filter((a) => a.id !== article.id).slice(0, RELATED_COUNT);
  const sharePath = `/artikel/${article.id}`;

  return (
    <div className={styles.page}>
      <SeoHead
        titleKey="seo_articles_title"
        descKey="seo_articles_desc"
        title={`${article.title[locale]} — hardcode.id`}
        description={article.excerpt[locale]}
        path={`/artikel/${article.id}`}
        ogType="article"
        keywords={article.tags.map((tag) => tag.replace(/^#/, "")).join(", ")}
        publishedTime={article.dateIso}
      />
      <ReadingProgressBar />

      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <ol className={styles.breadcrumbList}>
          <li>
            <Link to="/">{t("breadcrumb_home")}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/artikel">{t("breadcrumb_articles")}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className={styles.breadcrumbCurrent}>
            {article.title[locale]}
          </li>
        </ol>
      </nav>

      <div className={styles.navBar}>
        <Link to="/artikel" className={styles.backBtn}>
          <span aria-hidden="true">←</span> <span>{t("article_back_btn")}</span>
        </Link>
        <ShareButton path={sharePath} label={t("article_share_btn")} />
      </div>

      <article className={styles.sheet}>
        <header className={styles.readerHeader}>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>{article.categoryLabel[locale]}</span>
            <span className={styles.metaItem}>
              ⏱️ {article.readingTime[locale]} ({wordCount} {t("article_words_suffix")})
            </span>
            <span className={styles.metaItem}>📅 {article.date[locale]}</span>
          </div>

          <h1 className={styles.title}>{article.title[locale]}</h1>

          <div className={styles.authorRow}>
            <div className={styles.avatar} aria-hidden="true">
              HC
            </div>
            <div>
              <div className={styles.authorName}>{article.author}</div>
              <div className={styles.authorDesc}>
                {locale === "en" ? "Practical Software Engineering & AI Mentorship" : "Praktisi Rekayasa Perangkat Lunak & Mentoring AI"}
              </div>
            </div>
          </div>
        </header>

        <div className={styles.divider} />

        <ArticleBody html={article.content[locale]} />

        <div className={styles.footerTags}>
          <div className={styles.footerTagsGroup}>
            <span className={styles.footerTagsLabel}>{t("article_footer_tags_label")}</span>
            <div className={styles.footerTagsList}>
              {article.tags.map((tag) => (
                <Link key={tag} to={`/artikel?tag=${encodeURIComponent(tag)}`} className={styles.footerTag}>
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <ShareButton path={sharePath} label={t("article_share_btn_footer")} className={styles.footerShareBtn} />
        </div>

        <div className={styles.ctaBox}>
          <div className={styles.ctaIcon} aria-hidden="true">
            💡
          </div>
          <div>
            <h2 className={styles.ctaTitle}>{t("article_cta_title")}</h2>
            <p className={styles.ctaDesc}>{t("article_cta_desc")}</p>
            <a className={styles.ctaAction} href={`mailto:${contactEmail}`}>
              {t("article_cta_action")}
            </a>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className={styles.relatedSection} aria-labelledby="related-articles-heading">
          <div className={styles.relatedHeader}>
            <h2 id="related-articles-heading" className={styles.relatedHeading}>
              {t("article_related_heading")}
            </h2>
            <p className={styles.relatedSub}>{t("article_related_sub")}</p>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((rel) => (
              <Link key={rel.id} to={`/artikel/${rel.id}`} className={styles.relatedCard}>
                <div className={styles.relatedCardTop}>
                  <span className={styles.categoryBadge}>{rel.categoryLabel[locale]}</span>
                  <span className={styles.relatedMeta}>
                    ⏱️ {rel.readingTime[locale]} · {rel.date[locale]}
                  </span>
                </div>
                <h3 className={styles.relatedTitle}>{rel.title[locale]}</h3>
                <span className={styles.relatedLink}>{t("articles_read_more")}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
