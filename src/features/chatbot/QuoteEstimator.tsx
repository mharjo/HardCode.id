import { useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { useChat } from "./ChatContext";
import {
  calculateQuote,
  generateQuoteSummaryText,
  QUOTE_CATEGORIES,
  QUOTE_CATEGORY_ORDER,
  QUOTE_COMPLEXITIES,
  QUOTE_COMPLEXITY_ORDER,
  QUOTE_FEATURE_ORDER,
  QUOTE_FEATURES,
} from "./quoteConfig";
import styles from "./QuoteEstimator.module.css";

function copyToClipboard(text: string, onDone: () => void) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onDone).catch(() => fallbackCopy(text, onDone));
    return;
  }
  fallbackCopy(text, onDone);
}

function fallbackCopy(text: string, onDone: () => void) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } catch {
    // Clipboard access unavailable — silently skip; user can still select the text manually.
  }
  document.body.removeChild(textarea);
  onDone();
}

export function QuoteEstimator() {
  const { t, locale } = useI18n();
  const { quote, setQuoteCategory, setQuoteComplexity, toggleQuoteFeature, resetQuote, applyQuoteToConsultation, sendQuoteToChat } = useChat();
  const [copied, setCopied] = useState(false);

  const calc = calculateQuote(quote, locale);

  const handleCopy = () => {
    const summary = generateQuoteSummaryText(quote, locale);
    copyToClipboard(summary, () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const now = new Date();
  const printDateStr = now.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.quote}>
      <div className={styles.body}>
        <div className={styles.intro}>
          <h4 className={styles.heading}>{t("quote_title")}</h4>
          <p className={styles.subtext}>{t("quote_subtitle")}</p>
        </div>

        <div className={styles.configCol}>
          <div className={styles.sec}>
            <span className={styles.secLabel}>{t("quote_type_label")}</span>
            <div className={styles.catGrid} role="group" aria-label={t("quote_category_grid_aria")}>
              {QUOTE_CATEGORY_ORDER.map((catId) => {
                const cat = QUOTE_CATEGORIES[catId];
                const isActive = quote.category === catId;
                return (
                  <button
                    key={catId}
                    type="button"
                    className={`${styles.catBtn} ${isActive ? styles.catBtnActive : ""}`}
                    aria-pressed={isActive}
                    onClick={() => setQuoteCategory(catId)}
                  >
                    {cat.icon} {locale === "en" ? cat.nameEn : cat.nameId}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.sec}>
            <span className={styles.secLabel}>{t("quote_complexity_label")}</span>
            <div className={styles.compGrid} role="group" aria-label={t("quote_complexity_grid_aria")}>
              {QUOTE_COMPLEXITY_ORDER.map((compId) => {
                const comp = QUOTE_COMPLEXITIES[compId];
                const isActive = quote.complexity === compId;
                return (
                  <button
                    key={compId}
                    type="button"
                    className={`${styles.compBtn} ${isActive ? styles.compBtnActive : ""}`}
                    aria-pressed={isActive}
                    onClick={() => setQuoteComplexity(compId)}
                  >
                    <span>{locale === "en" ? comp.labelEn : comp.labelId}</span>
                    <span className={styles.compBadge}>{locale === "en" ? comp.badgeEn : comp.badgeId}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.sec}>
            <span className={styles.secLabel}>{t("quote_features_label")}</span>
            <div className={styles.featGrid} role="group" aria-label={t("quote_features_grid_aria")}>
              {QUOTE_FEATURE_ORDER.map((featId) => {
                const feat = QUOTE_FEATURES[featId];
                const isActive = quote.features.includes(featId);
                const isWarranty = featId === "warranty";
                return (
                  <button
                    key={featId}
                    type="button"
                    className={`${styles.featChip} ${isActive ? styles.featChipActive : ""}`}
                    aria-pressed={isActive}
                    disabled={isWarranty}
                    onClick={() => !isWarranty && toggleQuoteFeature(featId)}
                  >
                    <span className={styles.checkIcon} aria-hidden="true">
                      {isActive ? "✓" : "□"}
                    </span>{" "}
                    {locale === "en" ? feat.nameEn : feat.nameId}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.summaryCol}>
          <div className={styles.resultCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span aria-hidden="true">📊</span> <span>{t("quote_result_title")}</span>
              </div>
              <span className={styles.cardTypeTag}>{calc.typeTag}</span>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metricBox}>
                <span className={styles.metricLbl}>{t("quote_est_timeline")}</span>
                <span className={styles.metricVal}>{calc.timelineText}</span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.metricLbl}>{t("quote_est_investment")}</span>
                <span className={styles.metricVal}>{calc.priceText}</span>
              </div>
            </div>

            <div className={styles.breakdownList}>
              <div className={styles.breakdownItem}>
                <span className={styles.itemName}>
                  {calc.cat.icon} <strong>{locale === "en" ? calc.cat.nameEn : calc.cat.nameId}</strong>
                </span>
                <span className={styles.itemMeta}>{locale === "en" ? calc.comp.labelEn : calc.comp.labelId}</span>
              </div>
              {calc.features.map((feat) => (
                <div key={feat.id} className={styles.breakdownItem}>
                  <span className={styles.itemName}>✓ {locale === "en" ? feat.nameEn : feat.nameId}</span>
                  <span className={styles.itemMetaFaint}>{feat.id === "warranty" ? t("quote_included") : `+${feat.extraDays}d`}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnPrimary} onClick={applyQuoteToConsultation}>
              {t("quote_btn_consult")}
            </button>
            <div className={styles.btnRow}>
              <button type="button" className={styles.btnSecondary} onClick={handlePrint} title={t("quote_btn_print")}>
                {t("quote_btn_print")}
              </button>
              <button type="button" className={styles.btnSecondary} onClick={handleCopy}>
                {copied ? "✓" : t("quote_btn_copy")}
              </button>
              <button type="button" className={styles.btnSecondary} onClick={sendQuoteToChat}>
                {t("quote_btn_send_chat")}
              </button>
              <button type="button" className={styles.btnIcon} onClick={resetQuote} title={t("quote_btn_reset")} aria-label={t("quote_btn_reset")}>
                🔄
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only view — shown exclusively via @media print in QuoteEstimator.module.css */}
      <div className={styles.printArea}>
        <div className={styles.printHeader}>
          <div className={styles.printLogo}>{"{"}tanya{"}"} · hardcode.id</div>
          <div className={styles.printMeta}>{printDateStr}</div>
        </div>
        <h1 className={styles.printTitle}>{t("quote_print_summary_title")}</h1>
        <table className={styles.printTable}>
          <tbody>
            <tr>
              <td>{t("quote_type_label")}</td>
              <td>
                {calc.cat.icon} {locale === "en" ? calc.cat.nameEn : calc.cat.nameId}
              </td>
            </tr>
            <tr>
              <td>{t("quote_complexity_label")}</td>
              <td>{locale === "en" ? calc.comp.labelEn : calc.comp.labelId}</td>
            </tr>
            <tr>
              <td>{t("quote_est_timeline")}</td>
              <td>{calc.timelineText}</td>
            </tr>
            <tr>
              <td>{t("quote_est_investment")}</td>
              <td>{calc.priceText}</td>
            </tr>
          </tbody>
        </table>
        <table className={styles.printTable}>
          <thead>
            <tr>
              <th>{t("quote_features_label")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {calc.features.map((feat) => (
              <tr key={feat.id}>
                <td>{locale === "en" ? feat.nameEn : feat.nameId}</td>
                <td>{feat.id === "warranty" ? t("quote_included") : `+${feat.extraDays}d`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.printFooter}>{t("quote_print_footer")}</p>
      </div>
    </div>
  );
}
