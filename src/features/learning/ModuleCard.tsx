import type { LearningModule } from "../../data/learning";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./ModuleCard.module.css";

interface ModuleCardProps {
  module: LearningModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const { t, locale } = useI18n();

  return (
    <div id={module.id} tabIndex={-1} className={styles.card} data-track={module.tracks.join(" ")}>
      <div className={styles.asciiWrapper} aria-hidden="true">
        <pre className={styles.asciiArt}>{module.asciiArt}</pre>
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.numberPill}>
            {t("learn_module_prefix")} {String(module.number).padStart(2, "0")}
          </span>
          <span className={styles.trackBadge}>{module.trackBadge[locale]}</span>
        </div>
        <h2 className={styles.title}>{t(module.titleKey)}</h2>
        {module.bodyParagraphKeys.map((key) => (
          <p key={key}>{t(key)}</p>
        ))}
        <div className={styles.tags}>
          {module.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
