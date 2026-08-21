import type { TranslationKey } from "../../data/translations";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useI18n } from "../../i18n/I18nContext";
import type { PageMeta } from "../../lib/seo";

const HOME_META_KEYS = { titleKey: "seo_home_title", descKey: "seo_home_desc" } as const;

interface SeoHeadProps {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  path: string;
  ogType?: PageMeta["ogType"];
  keywords?: string;
  publishedTime?: string;
  /** Overrides the resolved `t(titleKey)`/`t(descKey)` — for routes with per-record titles (e.g. an article slug). */
  title?: string;
  description?: string;
}

/**
 * Wraps `useDocumentMeta` so routes declare SEO via translation keys instead
 * of re-building a `PageMeta`/fallback pair by hand on every page.
 */
export function SeoHead({
  titleKey,
  descKey,
  path,
  ogType = "website",
  keywords,
  publishedTime,
  title,
  description,
}: SeoHeadProps) {
  const { t } = useI18n();

  const meta: PageMeta = {
    title: title ?? t(titleKey),
    description: description ?? t(descKey),
    path,
    ogType,
    ...(keywords ? { keywords } : {}),
    ...(publishedTime ? { publishedTime } : {}),
  };
  const fallback: PageMeta = {
    title: t(HOME_META_KEYS.titleKey),
    description: t(HOME_META_KEYS.descKey),
    path: "/",
    ogType: "website",
  };

  useDocumentMeta(meta, fallback);

  return null;
}
