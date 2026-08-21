import { Link } from "react-router-dom";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { contactEmail } from "../../data/site";
import type { ServiceCard } from "../../data/services";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./ServicesSection.module.css";

interface ServicesSectionProps {
  services: ServiceCard[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const { t } = useI18n();

  return (
    <section id="layanan" aria-labelledby="layanan-heading">
      <SectionHeader index="01" title={t("sec_services_title")} headingId="layanan-heading" />

      {services.length > 0 ? (
        <div className={styles.grid}>
          {services.map((service) => (
            <article key={service.id} className={styles.card}>
              <div className={styles.topRow}>
                <div className={styles.icon} aria-hidden="true">
                  {service.icon}
                </div>
                <div className={`${styles.badge} ${service.badgeTone === "free" ? styles.badgeFree : styles.badgePaid}`}>
                  <span className={styles.badgeDot} aria-hidden="true">
                    ●
                  </span>
                  {t(service.badgeKey)}
                </div>
              </div>
              <h3>{t(service.titleKey)}</h3>
              <span className={styles.tagline}>{t(service.taglineKey)}</span>
              <p>{t(service.descKey)}</p>
              <ul className={styles.list}>
                {service.bulletKeys.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
              <div className={styles.subServices}>
                <span className={styles.subServicesTitle}>{t(service.topicsTitleKey)}</span>
                <div className={styles.tags}>
                  {service.tagKeys.map((key) => (
                    <span key={key}>{t(key)}</span>
                  ))}
                </div>
              </div>
              {service.linkTo ? (
                <Link to={service.linkTo} className={styles.action}>
                  {t(service.actionKey)}
                </Link>
              ) : (
                <a href={`mailto:${contactEmail}`} className={styles.action}>
                  {t(service.actionKey)}
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>{t("empty_services")}</p>
        </div>
      )}

      <div className={styles.ctaRow}>
        <a href={`mailto:${contactEmail}`} className={styles.btn}>
          {t("cta_email_btn")}
        </a>
        <span className={styles.ctaNote}>{contactEmail}</span>
      </div>
    </section>
  );
}
