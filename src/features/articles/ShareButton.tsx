import { useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { copyText } from "../../lib/clipboard";
import styles from "./ShareButton.module.css";

interface ShareButtonProps {
  path: string;
  label: string;
  className?: string | undefined;
}

const RESET_DELAY_MS = 2400;

export function ShareButton({ path, label, className }: ShareButtonProps) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const handleShare = async () => {
    const origin = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") || window.location.origin;
    const succeeded = await copyText(`${origin}${path}`);
    setState(succeeded ? "copied" : "failed");
    window.setTimeout(() => setState("idle"), RESET_DELAY_MS);
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${state === "copied" ? styles.copied : ""} ${className ?? ""}`}
      onClick={() => void handleShare()}
      title={t("article_share_btn")}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <span aria-live="polite">
        {state === "copied" ? t("article_share_copied") : state === "failed" ? t("article_share_failed") : label}
      </span>
    </button>
  );
}
