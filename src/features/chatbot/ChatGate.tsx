import { useState, type FormEvent } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { TOPIC_CHIPS, useChat } from "./ChatContext";
import styles from "./ChatGate.module.css";

export function ChatGate() {
  const { t } = useI18n();
  const { selectedTopic, setSelectedTopic, submitGate } = useChat();
  const [contact, setContact] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contact.trim()) return;
    submitGate(contact);
  };

  const handleChipClick = (topic: string) => {
    setSelectedTopic(selectedTopic === topic ? "" : topic);
  };

  return (
    <div className={styles.gate}>
      <p className={styles.desc}>{t("bot_gate_desc")}</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <label className={styles.label} htmlFor="tanya-gate-input">
            {t("bot_gate_lbl_contact")}
          </label>
          <input
            type="text"
            id="tanya-gate-input"
            className={styles.input}
            placeholder={t("bot_gate_ph_contact")}
            required
            autoComplete="email"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
          />
        </div>

        <div className={styles.quickTopics}>
          <span className={styles.topicsTitle}>{t("bot_gate_quick_title")}</span>
          <div className={styles.chips} role="group" aria-label={t("bot_gate_quick_title")}>
            {TOPIC_CHIPS.map((chip) => {
              const isActive = selectedTopic === chip.topic;
              return (
                <button
                  key={chip.topic}
                  type="button"
                  className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                  aria-pressed={isActive}
                  onClick={() => handleChipClick(chip.topic)}
                >
                  {t(chip.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          {t("bot_gate_btn")}
        </button>
      </form>
    </div>
  );
}
