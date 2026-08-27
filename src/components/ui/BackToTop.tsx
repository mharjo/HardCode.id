import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./BackToTop.module.css";

const SCROLL_SHOW_THRESHOLD = 260;

export function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      setVisible(window.scrollY > SCROLL_SHOW_THRESHOLD);
    };

    checkScrollPosition();
    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={visible ? `${styles.button} ${styles.visible}` : styles.button}
      onClick={handleClick}
      aria-label={t("top_aria")}
      title={t("top_aria")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
