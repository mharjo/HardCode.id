import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import { LanguageToggle } from "../ui/LanguageToggle";
import { ThemeToggle } from "../ui/ThemeToggle";
import styles from "./Header.module.css";

// Anchor links always target the homepage's sections; `HomePage` scrolls to
// `location.hash` on mount so these work whether you're already on `/` or
// navigating in from another route (e.g. `/artikel`).
const ANCHOR_NAV_LINKS = [
  { hash: "#layanan", key: "nav_layanan" },
  { hash: "#cara-kerja", key: "nav_cara_kerja" },
  { hash: "#faq", key: "nav_faq" },
  { hash: "#testimoni", key: "nav_testimoni" },
] as const;

export function Header() {
  const { t } = useI18n();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.wordmark}>
        <span className={styles.brace}>{"{"}</span>
        <span className={styles.text}>hardcode</span>
        <span className={styles.dot}>.</span>
        id
        <span className={styles.brace}>{"}"}</span>
      </Link>
      <nav className={styles.nav} aria-label="Navigasi utama">
        {ANCHOR_NAV_LINKS.map((link) => (
          <Link key={link.hash} to={`/${link.hash}`} className={styles.navLink}>
            <span className={styles.navBullet} aria-hidden="true">
              ·
            </span>
            {t(link.key)}
          </Link>
        ))}
        <Link to="/artikel" className={styles.navLink}>
          <span className={styles.navBullet} aria-hidden="true">
            ·
          </span>
          {t("nav_tulisan")}
        </Link>
        <LanguageToggle />
        <ThemeToggle />
      </nav>
    </header>
  );
}