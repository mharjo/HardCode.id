import { SectionHeader } from "../../components/ui/SectionHeader";
import { steps } from "../../data/steps";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./HowItWorksSection.module.css";

export function HowItWorksSection() {
  const { t } = useI18n();

  return (
    <section id="cara-kerja" aria-labelledby="cara-kerja-heading">
      <SectionHeader index="02" title={t("sec_how_title")} headingId="cara-kerja-heading" />
      <ol className={styles.steps}>
        {steps.map((step) => (
          <li key={step.id} className={styles.step}>
            <div className={styles.number} aria-hidden="true">
              {step.number}
            </div>
            <div className={styles.content}>
              <h3>{t(step.titleKey)}</h3>
              <p>{t(step.descKey)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
