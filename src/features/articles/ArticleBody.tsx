import { useEffect, useRef } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { enhanceCodeBlocks } from "./enhanceCodeBlocks";
import styles from "./ArticleBody.module.css";

interface ArticleBodyProps {
  html: string;
}

/**
 * Renders a single article's reader body.
 *
 * SECURITY BOUNDARY: `html` is only ever a hard-coded string from
 * `src/data/articles.ts`, authored at build time and never sourced from a
 * CMS, database, query param, or any other runtime/user input. It is
 * rendered with `dangerouslySetInnerHTML` on that basis. If article content
 * is ever made editable at runtime (CMS, API, user submissions), this
 * component must be paired with an HTML sanitizer (e.g. DOMPurify) before
 * that content reaches this component — do not widen this trust boundary
 * without adding one.
 *
 * After the trusted HTML is set, an effect walks the rendered `<pre><code>`
 * blocks and wraps each one with a language badge + working copy button
 * (`enhanceCodeBlocks`) via direct DOM manipulation, mirroring SOURCE's
 * `enhanceArticleCodeBlocks`. This preserves surrounding decorative markup
 * (e.g. the side-by-side "code-box" comparison cards) that a string-based
 * HTML split would otherwise break.
 */
export function ArticleBody({ html }: ArticleBodyProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return enhanceCodeBlocks(container, { copy: t("article_code_copy"), copied: t("article_code_copied") });
  }, [html, t]);

  return (
    <div
      ref={containerRef}
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
