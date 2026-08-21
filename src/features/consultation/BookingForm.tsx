import { useState, type FormEvent } from "react";
import { isValidEmail, TOPIC_CHIPS, TOPIC_OPTIONS, type BookingFormData } from "../../data/consultation";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./BookingForm.module.css";

interface BookingFormProps {
  dateTimeLabel: string;
  initialData: BookingFormData;
  onBack: () => void;
  onSubmit: (data: BookingFormData) => void;
}

interface FieldErrors {
  name?: string | undefined;
  email?: string | undefined;
  notes?: string | undefined;
}

export function BookingForm({ dateTimeLabel, initialData, onBack, onSubmit }: BookingFormProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<BookingFormData>(initialData);
  const [errors, setErrors] = useState<FieldErrors>({});

  const setField = <K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const validateEmail = (email: string): string | undefined => {
    const trimmed = email.trim();
    if (!trimmed) return t("cal_err_email_required");
    if (!isValidEmail(trimmed)) return t("cal_err_email");
    return undefined;
  };

  const handleEmailBlur = () => {
    setErrors((current) => ({ ...current, email: validateEmail(formData.email) }));
  };

  const handleEmailChange = (value: string) => {
    setField("email", value);
    if (errors.email) {
      setErrors((current) => ({ ...current, email: validateEmail(value) }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {
      name: formData.name.trim() ? undefined : t("cal_err_name_required"),
      email: validateEmail(formData.email),
      notes: formData.notes.trim() ? undefined : t("cal_err_notes_required"),
    };
    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.email || nextErrors.notes) return;

    onSubmit(formData);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.leftPanel}>
        <button type="button" className={styles.backToPickerBtn} onClick={onBack}>
          <span aria-hidden="true">←</span> <span>{t("cal_btn_change_time")}</span>
        </button>

        <div className={styles.profileHeader}>
          <div className={styles.avatar} aria-hidden="true">
            HC
          </div>
          <div className={styles.authorName}>{t("cal_mentor_name")}</div>
        </div>
        <h2 className={styles.eventTitle}>{t("cal_event_title")}</h2>

        <div className={styles.metaList}>
          <div className={`${styles.metaItem} ${styles.metaItemAccent}`}>
            <span aria-hidden="true">📅</span>
            <span>{dateTimeLabel}</span>
          </div>
          <div className={styles.metaItem}>
            <span aria-hidden="true">⏱</span>
            <span>{t("cal_meta_dur")}</span>
          </div>
          <div className={styles.metaItem}>
            <span aria-hidden="true">🎥</span>
            <span>{t("cal_meta_loc")}</span>
          </div>
          <div className={styles.metaItem}>
            <span aria-hidden="true">🌐</span>
            <span>{t("cal_meta_tz")}</span>
          </div>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formHeader}>
          <div className={styles.formHeaderTop}>
            <h3 className={styles.formTitle}>{t("cal_form_title")}</h3>
            <span className={styles.freeBadge}>{t("cal_form_free_badge")}</span>
          </div>
          <p className={styles.formDesc}>{t("cal_form_desc")}</p>
        </div>

        <div className={styles.recapCard}>
          <div className={styles.recapDetails}>
            <span aria-hidden="true">📅</span>
            <span>{dateTimeLabel}</span>
          </div>
          <button type="button" className={styles.recapChangeBtn} onClick={onBack}>
            {t("cal_btn_change_recap")}
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.formGrid2}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="cal-name">
                <span>
                  {t("cal_lbl_name")} <span className={styles.required}>*</span>
                </span>
              </label>
              <input
                type="text"
                id="cal-name"
                className={styles.formInput}
                placeholder={t("cal_ph_name")}
                autoComplete="name"
                required
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "cal-name-error" : undefined}
                value={formData.name}
                onChange={(event) => setField("name", event.target.value)}
              />
              {errors.name && (
                <span id="cal-name-error" className={styles.errorMsg} role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="cal-email">
                <span>
                  {t("cal_lbl_email")} <span className={styles.required}>*</span>
                </span>
                <span className={styles.formLabelHint} id="cal-email-hint">
                  {t("cal_hint_email")}
                </span>
              </label>
              <input
                type="email"
                id="cal-email"
                className={styles.formInput}
                placeholder={t("cal_ph_email")}
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "cal-email-error cal-email-hint" : "cal-email-hint"}
                value={formData.email}
                onChange={(event) => handleEmailChange(event.target.value)}
                onBlur={handleEmailBlur}
              />
              {errors.email && (
                <span id="cal-email-error" className={styles.errorMsg} role="alert">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formGrid2}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="cal-wa">
                <span>{t("cal_lbl_wa")}</span>
                <span className={styles.formLabelHint}>{t("cal_hint_wa")}</span>
              </label>
              <input
                type="tel"
                id="cal-wa"
                className={styles.formInput}
                placeholder={t("cal_ph_wa")}
                autoComplete="tel"
                value={formData.whatsapp}
                onChange={(event) => setField("whatsapp", event.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="cal-topic">
                <span>
                  {t("cal_lbl_topic")} <span className={styles.required}>*</span>
                </span>
              </label>
              <select
                id="cal-topic"
                className={styles.formSelect}
                required
                aria-required="true"
                value={formData.topic}
                onChange={(event) => setField("topic", event.target.value)}
              >
                {TOPIC_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>{t("cal_lbl_chips")}</span>
            </label>
            <div className={styles.topicChips} role="group" aria-label={t("cal_topic_chips_group_aria")}>
              {TOPIC_CHIPS.map((chip) => {
                const isActive = formData.topic === chip.value;
                return (
                  <button
                    key={chip.value}
                    type="button"
                    className={`${styles.topicChip} ${isActive ? styles.topicChipActive : ""}`}
                    aria-pressed={isActive}
                    onClick={() => setField("topic", chip.value)}
                  >
                    {t(chip.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="cal-notes">
              <span>
                {t("cal_lbl_notes")} <span className={styles.required}>*</span>
              </span>
              <span className={styles.formLabelHint} id="cal-notes-hint">
                {t("cal_hint_notes")}
              </span>
            </label>
            <textarea
              id="cal-notes"
              className={styles.formTextarea}
              placeholder={t("cal_ph_notes")}
              required
              aria-required="true"
              aria-invalid={!!errors.notes}
              aria-describedby={errors.notes ? "cal-notes-error cal-notes-hint" : "cal-notes-hint"}
              value={formData.notes}
              onChange={(event) => setField("notes", event.target.value)}
            />
            {errors.notes && (
              <span id="cal-notes-error" className={styles.errorMsg} role="alert">
                {errors.notes}
              </span>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnBack} onClick={onBack}>
              {t("cal_btn_back_form")}
            </button>
            <button type="submit" className={styles.submitBtn}>
              {t("cal_btn_submit")}
            </button>
          </div>

          <div className={styles.securityBadge}>{t("cal_security_notice")}</div>
        </form>
      </div>
    </div>
  );
}
