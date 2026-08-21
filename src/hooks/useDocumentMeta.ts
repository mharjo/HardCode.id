import { useEffect, useRef } from "react";
import { applyPageMeta, type PageMeta } from "../lib/seo";

/**
 * Applies `meta` to `document.head` on mount and whenever its fields change
 * (e.g. locale toggle), then restores `fallback` on unmount so navigating
 * away leaves the document in a sane state for the next route — mirrors
 * SOURCE's `updateDocumentMetaForArticle` + `resetDocumentMeta` pairing.
 */
export function useDocumentMeta(meta: PageMeta, fallback: PageMeta): void {
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  useEffect(() => {
    applyPageMeta(meta);
    return () => {
      applyPageMeta(fallbackRef.current);
    };
    // Effect intentionally keyed on primitive fields, not the `meta`/`fallback`
    // object identities, which change every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.title, meta.description, meta.path, meta.ogType, meta.keywords, meta.publishedTime]);
}
