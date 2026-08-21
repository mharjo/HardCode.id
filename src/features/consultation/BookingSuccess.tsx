import { useState } from "react";
import { TOPIC_OPTIONS } from "../../data/consultation";
import type { BookingSummary } from "./ConsultationPage";
import { copyText } from "../../lib/clipboard";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./BookingSuccess.module.css";

interface BookingSuccessProps {
  summary: BookingSummary;
  meetLink: string;
  gcalUrl: string;
  onReset: () => void;
}

export function BookingSuccess({ summary, meetLink, gcalUrl, onReset }: BookingSuccessProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const topicLabel = TOPIC_OPTIONS.find((option) => option.value === summary.topic)?.labelKey;

  const handleCopy = async () => {
    const succeeded = await copyText(`https://${meetLink}`);
    if (succeeded) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.card} role="region" aria-live="polite" aria-label={t("cal_succ_title")}>
      <div className={styles.emoji} aria-hidden="true">
        🎉
      </div>
      <h3 className={styles.title}>{t("cal_succ_title")}</h3>
      <p className={styles.desc}>{t("cal_succ_desc")}</p>

      <div className={styles.summaryList}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{t("cal_summary_name_label")}</span>
          <span className={styles.summaryVal}>{summary.name}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{t("cal_summary_email_label")}</span>
          <span className={styles.summaryVal}>
            {summary.email}
            {summary.whatsapp ? ` (${summary.whatsapp})` : ""}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{t("cal_summary_time_label")}</span>
          <span className={styles.summaryVal}>{summary.dateTimeLabel}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{t("cal_summary_dur_label")}</span>
          <span className={styles.summaryVal}>{t("cal_succ_dur_val")}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{t("cal_summary_topic_label")}</span>
          <span className={styles.summaryVal}>{topicLabel ? t(topicLabel) : summary.topic}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{t("cal_summary_notes_label")}</span>
          <span className={styles.summaryVal}>{summary.notes}</span>
        </div>
      </div>

      <div className={styles.meetLinkBox}>
        <span>
          {t("cal_summary_meet_label")} <strong>{meetLink}</strong>
        </span>
        <button type="button" className={styles.copyBtn} onClick={handleCopy}>
          {copied ? "✓" : t("cal_succ_copy_btn")}
        </button>
      </div>

      <div className={styles.actionsRow}>
        <a href={gcalUrl} target="_blank" rel="noopener noreferrer" className={styles.gcalBtn}>
          {t("cal_succ_gcal_btn")}
        </a>
        <button type="button" className={styles.resetBtn} onClick={onReset}>
          {t("cal_succ_reset_btn")}
        </button>
      </div>
    </div>
  );
}
