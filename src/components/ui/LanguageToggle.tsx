import { useI18n } from "../../i18n/I18nContext";
import styles from "./LanguageToggle.module.css";

export function LanguageToggle() {
  const { locale, toggleLocale, t } = useI18n();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleLocale}
      aria-label={t("lang_toggle_aria")}
      title={t("lang_toggle_aria")}
    >
      <span className={locale === "id" ? styles.optionActive : styles.option}>ID</span>
      <span className={styles.separator}>|</span>
      <span className={locale === "en" ? styles.optionActive : styles.option}>EN</span>
    </button>
  );
}
