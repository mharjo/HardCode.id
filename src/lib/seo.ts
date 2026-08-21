export interface PageMeta {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/artikel/my-slug" or "/". */
  path: string;
  ogType: "website" | "article";
  keywords?: string;
  publishedTime?: string;
}

function siteOrigin(): string {
  const configured = import.meta.env.VITE_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

function setMetaByName(name: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

/** Placeholder social preview image — swap for a real asset once one exists. */
const OG_IMAGE_URL = "https://hardcode.id/og-image.png";
const TWITTER_SITE_HANDLE = "@hardcodeid";

/** Applies a route's SEO metadata to `document.head`, mirroring SOURCE's `updateDocumentMetaForArticle`/`resetDocumentMeta`. */
export function applyPageMeta(meta: PageMeta): void {
  if (typeof document === "undefined") return;
  const url = `${siteOrigin()}${meta.path}`;

  document.title = meta.title;
  setMetaByName("description", meta.description);
  if (meta.keywords) setMetaByName("keywords", meta.keywords);

  setMetaByProperty("og:site_name", "hardcode.id");
  setMetaByProperty("og:title", meta.title);
  setMetaByProperty("og:description", meta.description);
  setMetaByProperty("og:type", meta.ogType);
  setMetaByProperty("og:url", url);
  setMetaByProperty("og:image", OG_IMAGE_URL);
  if (meta.publishedTime) setMetaByProperty("article:published_time", meta.publishedTime);

  setMetaByName("twitter:card", "summary_large_image");
  setMetaByName("twitter:site", TWITTER_SITE_HANDLE);
  setMetaByName("twitter:title", meta.title);
  setMetaByName("twitter:description", meta.description);
  setMetaByName("twitter:image", OG_IMAGE_URL);

  setCanonical(url);
}

/** Injects the site-wide Organization JSON-LD block once, ahead of any per-page structured data. */
export function applyOrganizationJsonLd(): void {
  if (typeof document === "undefined") return;
  const id = "ld-organization";
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HardCode",
    url: siteOrigin() || "https://hardcode.id",
    description: "Belajar coding dan AI dengan pendekatan intuisi dan mental model, bukan hafalan sintaks.",
  });
}
