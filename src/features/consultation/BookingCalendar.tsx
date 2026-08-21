import { useRef, type KeyboardEvent } from "react";
import { buildMonthMatrix, DAY_NAMES_SHORT, getSlotsForDate, MONTH_NAMES, WEEKDAY_HEADER } from "../../data/consultation";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./BookingCalendar.module.css";

const GRID_COLUMNS = 7;

interface BookingCalendarProps {
  viewYear: number;
  viewMonth: number;
  selectedDate: Date;
  selectedTime: string;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onConfirmSlot: () => void;
}

export function BookingCalendar({
  viewYear,
  viewMonth,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onPrevMonth,
  onNextMonth,
  onConfirmSlot,
}: BookingCalendarProps) {
  const { t, locale } = useI18n();
  const dayButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const monthNames = MONTH_NAMES[locale];
  const dayNamesShort = DAY_NAMES_SHORT[locale];
  const cells = buildMonthMatrix(viewYear, viewMonth, selectedDate);

  const focusDayCell = (index: number) => {
    const target = dayButtonRefs.current[index];
    if (target && !target.disabled) target.focus();
  };

  const handleGridKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -GRID_COLUMNS,
      ArrowDown: GRID_COLUMNS,
    };
    const delta = deltas[event.key];
    if (delta === undefined) return;
    event.preventDefault();

    let next = index + delta;
    while (next >= 0 && next < cells.length && !cells[next]) next += delta;
    if (next >= 0 && next < cells.length) focusDayCell(next);
  };
  const slots = getSlotsForDate(selectedDate);
  const holidayName = slots.length === 0 ? cells.find((c) => c?.isSelected)?.holidayName : null;

  const selectedDayLabel = `${dayNamesShort[selectedDate.getDay()]} ${selectedDate.getDate()}`;

  return (
    <div className={styles.layout}>
      <div className={styles.leftPanel}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar} aria-hidden="true">
            HC
          </div>
          <div className={styles.authorName}>{t("cal_mentor_name")}</div>
        </div>

        <h2 className={styles.eventTitle}>{t("cal_event_title")}</h2>

        <div className={styles.eventDesc}>
          <p>{t("cal_event_greeting")}</p>
          <p>{t("cal_event_subhint")}</p>
        </div>

        <div className={styles.metaList}>
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

        <div className={styles.perksBox}>
          <div className={styles.perksTitle}>{t("cal_perks_title")}</div>
          <ul className={styles.perksList}>
            <li>{t("cal_perk1")}</li>
            <li>{t("cal_perk2")}</li>
            <li>{t("cal_perk3")}</li>
            <li>{t("cal_perk4")}</li>
          </ul>
        </div>
      </div>

      <div className={styles.calendarPanel}>
        <div className={styles.calendarHeader}>
          <h3 className={styles.monthTitle}>
            {monthNames[viewMonth]} {viewYear}
          </h3>
          <div className={styles.monthNav}>
            <button type="button" className={styles.navBtn} onClick={onPrevMonth} aria-label={t("cal_month_prev_aria")}>
              ‹
            </button>
            <button type="button" className={styles.navBtn} onClick={onNextMonth} aria-label={t("cal_month_next_aria")}>
              ›
            </button>
          </div>
        </div>

        <div className={styles.weekdaysRow}>
          {WEEKDAY_HEADER.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className={styles.daysGrid} role="grid" aria-label={`${monthNames[viewMonth]} ${viewYear}`}>
          {cells.map((cell, index) => {
            if (!cell) return <div key={`empty-${index}`} className={`${styles.dayCell} ${styles.empty}`} />;

            const label = `${cell.day} ${monthNames[viewMonth]} ${viewYear}${cell.holidayName ? ` - ${cell.holidayName}` : ""}`;

            if (cell.holidayName) {
              return (
                <div
                  key={cell.day}
                  className={`${styles.dayCell} ${styles.holiday} ${cell.isSelected ? styles.active : ""}`}
                  title={cell.holidayName}
                >
                  <button
                    ref={(el) => {
                      dayButtonRefs.current[index] = el;
                    }}
                    type="button"
                    className={styles.dayCellBtn}
                    disabled
                    aria-disabled="true"
                    aria-label={label}
                    tabIndex={-1}
                    onKeyDown={(event) => handleGridKeyDown(event, index)}
                  >
                    <span>{cell.day}</span>
                    <span className={styles.holidayTag}>{locale === "en" ? "HOLIDAY" : "LIBUR"}</span>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={cell.day}
                className={`${styles.dayCell} ${cell.isPast ? styles.past : styles.available} ${cell.isSelected ? styles.active : ""}`}
              >
                <button
                  ref={(el) => {
                    dayButtonRefs.current[index] = el;
                  }}
                  type="button"
                  className={styles.dayCellBtn}
                  disabled={cell.isPast}
                  aria-disabled={cell.isPast}
                  aria-selected={cell.isSelected}
                  aria-label={label}
                  tabIndex={cell.isSelected ? 0 : -1}
                  onClick={() => onSelectDate(cell.date)}
                  onKeyDown={(event) => handleGridKeyDown(event, index)}
                >
                  <span>{cell.day}</span>
                  {cell.isSelected && <span className={styles.dot} aria-hidden="true" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className={styles.scheduleInfo}>{t("cal_schedule_rule")}</div>
      </div>

      <div className={styles.timePanel}>
        <div className={styles.timeHeader}>
          <span className={styles.selectedDayLabel}>{selectedDayLabel}</span>
          <div className={styles.formatPill}>12h / 24h</div>
        </div>

        <div className={styles.slotsList}>
          {slots.length === 0 ? (
            <div className={styles.holidayNotice}>
              <div className={styles.holidayNoticeIcon} aria-hidden="true">
                🏖️
              </div>
              <h4 className={styles.holidayNoticeTitle}>{t("cal_holiday_title")}</h4>
              {holidayName && <p className={styles.holidayNoticeName}>{holidayName}</p>}
              <p className={styles.holidayNoticeDesc}>{t("cal_holiday_desc")}</p>
            </div>
          ) : (
            slots.map((time) => {
              const isActive = time === selectedTime;
              return (
                <div key={time} className={styles.slotCard}>
                  <button
                    type="button"
                    className={`${styles.slotBtn} ${isActive ? styles.slotBtnActive : ""}`}
                    aria-pressed={isActive}
                    onClick={() => onSelectTime(time)}
                  >
                    {time}
                  </button>
                  {isActive && (
                    <button type="button" className={styles.confirmBtn} onClick={onConfirmSlot}>
                      {t("cal_slot_confirm_btn")}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
