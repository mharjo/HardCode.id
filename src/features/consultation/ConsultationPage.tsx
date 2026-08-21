import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SeoHead } from "../../components/seo/SeoHead";
import {
  buildGoogleCalendarUrl,
  formatSelectedDateTime,
  getNextAvailableDate,
  MEET_LINK_PLACEHOLDER,
  type BookingFormData,
  EMPTY_BOOKING_FORM,
} from "../../data/consultation";
import { useI18n } from "../../i18n/I18nContext";
import { BookingCalendar } from "./BookingCalendar";
import { BookingForm } from "./BookingForm";
import { BookingSuccess } from "./BookingSuccess";
import styles from "./ConsultationPage.module.css";

type Step = "picker" | "form" | "success";

export interface BookingSummary extends BookingFormData {
  dateTimeLabel: string;
}

function initialSelectedDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getNextAvailableDate(tomorrow);
}

interface ConsultationLocationState {
  prefillNotes?: string;
  prefillTopic?: string;
}

/** Prefills the booking form's notes/topic when arriving from the {tanya} quote estimator's "bring to 1-on-1" action. */
function buildInitialBookingForm(state: ConsultationLocationState | null): BookingFormData {
  if (!state?.prefillNotes) return EMPTY_BOOKING_FORM;
  return { ...EMPTY_BOOKING_FORM, notes: state.prefillNotes, topic: state.prefillTopic ?? EMPTY_BOOKING_FORM.topic };
}

export function ConsultationPage() {
  const { t } = useI18n();
  const location = useLocation();
  const [initialBookingForm] = useState<BookingFormData>(() => buildInitialBookingForm(location.state as ConsultationLocationState | null));

  const [step, setStep] = useState<Step>("picker");
  const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate);
  const [viewYear, setViewYear] = useState(() => selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selectedDate.getMonth());
  const [selectedTime, setSelectedTime] = useState("20:00");
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [meetLink, setMeetLink] = useState(MEET_LINK_PLACEHOLDER);
  const [gcalUrl, setGcalUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setViewMonth((month) => {
      if (month === 0) {
        setViewYear((year) => year - 1);
        return 11;
      }
      return month - 1;
    });
  };

  const handleNextMonth = () => {
    setViewMonth((month) => {
      if (month === 11) {
        setViewYear((year) => year + 1);
        return 0;
      }
      return month + 1;
    });
  };

  const scrollToContainer = () => {
    containerRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };

  const handleConfirmSlot = () => {
    setStep("form");
    scrollToContainer();
  };

  const handleChangeSchedule = () => {
    setStep("picker");
  };

  const handleSubmit = (formData: BookingFormData) => {
    const dateTimeLabel = formatSelectedDateTime(selectedDate, selectedTime);
    setSummary({ ...formData, dateTimeLabel });
    setMeetLink(MEET_LINK_PLACEHOLDER);
    setGcalUrl(
      buildGoogleCalendarUrl({
        date: selectedDate,
        time: selectedTime,
        topic: formData.topic,
        name: formData.name,
        notes: formData.notes,
        meetLink: MEET_LINK_PLACEHOLDER,
      }),
    );
    setStep("success");
    scrollToContainer();
  };

  const handleReset = () => {
    setStep("picker");
    setSummary(null);
  };

  const dateTimeLabel = formatSelectedDateTime(selectedDate, selectedTime);

  return (
    <div className={styles.page}>
      <SeoHead titleKey="seo_konsultasi_title" descKey="seo_konsultasi_desc" path="/konsultasi" ogType="website" />
      <Link to="/" className={styles.backLink}>
        {t("cal_back_link")}
      </Link>
      <h1 className={styles.title}>{t("cal_main_title")}</h1>
      <p className={styles.desc}>{t("cal_main_desc")}</p>

      <div className={styles.card} ref={containerRef}>
        {step === "picker" && (
          <BookingCalendar
            viewYear={viewYear}
            viewMonth={viewMonth}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={handleSelectDate}
            onSelectTime={setSelectedTime}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onConfirmSlot={handleConfirmSlot}
          />
        )}

        {step === "form" && (
          <BookingForm
            dateTimeLabel={dateTimeLabel}
            initialData={initialBookingForm}
            onBack={handleChangeSchedule}
            onSubmit={handleSubmit}
          />
        )}

        {step === "success" && summary && (
          <BookingSuccess summary={summary} meetLink={meetLink} gcalUrl={gcalUrl} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
