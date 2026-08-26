import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./BackToTop.module.css";

export function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 260);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const label = t("top_aria");

  return (
    <button
      id="back-to-top"
      className={`${styles.backToTop} ${visible ? styles.visible : ""}`}
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
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