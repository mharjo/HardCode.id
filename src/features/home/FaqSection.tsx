import { useState } from "react";
import { SectionHeader } from "../../components/ui/SectionHeader";
import type { FaqItem } from "../../data/faq";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./FaqSection.module.css";

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  const { t } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-heading">
      <SectionHeader index="03" title={t("sec_faq_title")} headingId="faq-heading" />

      {items.length > 0 ? (
        <div className={styles.list}>
          {items.map((item) => {
            const isOpen = openId === item.id;
            const bodyId = `${item.id}-body`;
            return (
              <div key={item.id} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
                <button
                  type="button"
                  className={styles.header}
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <h3 className={styles.question}>{t(item.questionKey)}</h3>
                  <span className={styles.icon} aria-hidden="true">
                    +
                  </span>
                </button>
                <div id={bodyId} className={styles.body} role="region">
                  <p>{t(item.answerKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>{t("empty_faq")}</p>
        </div>
      )}
    </section>
  );
}
