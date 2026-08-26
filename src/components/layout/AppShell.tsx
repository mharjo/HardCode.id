import type { ReactNode } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { BackToTop } from "../ui/BackToTop";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./AppShell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="container">
      <a href="#main-content" className={styles.skipLink}>
        {t("skip_to_content")}
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
