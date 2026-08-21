import type { Locale, TranslationKey } from "./translations";

/**
 * Pure booking-calendar logic for `/konsultasi`, ported from SOURCE's
 * `calState`/`renderCalCalendar`/`renderCalSlots`/`getNationalHoliday`
 * (index.html, ~L8122-8640). No React/DOM dependency so it can be unit
 * tested directly and reused by both `BookingCalendar` and `BookingForm`.
 */

export interface TopicOption {
  value: string;
  labelKey: TranslationKey;
}

/** Mirrors SOURCE's `<select id="cal-topic">` options. */
export const TOPIC_OPTIONS: TopicOption[] = [
  { value: "Validasi Ide & Rencana Bikin Project", labelKey: "cal_opt_topic1" },
  { value: "Konsultasi Tech Stack & Arsitektur", labelKey: "cal_opt_topic2" },
  { value: "Roadmap Belajar Coding & AI", labelKey: "cal_opt_topic3" },
  { value: "Review Kode & Masalah Teknis", labelKey: "cal_opt_topic4" },
  { value: "Diskusi Santai & Tanya Jawab Umum", labelKey: "cal_opt_topic5" },
  { value: "Topik Khusus Lainnya", labelKey: "cal_opt_topic6" },
];

/** Mirrors SOURCE's `.cal-topic-chip` fast presets (first 5 topics only). */
export const TOPIC_CHIPS: TopicOption[] = [
  { value: "Validasi Ide & Rencana Bikin Project", labelKey: "cal_chip1" },
  { value: "Konsultasi Tech Stack & Arsitektur", labelKey: "cal_chip2" },
  { value: "Roadmap Belajar Coding & AI", labelKey: "cal_chip3" },
  { value: "Review Kode & Masalah Teknis", labelKey: "cal_chip4" },
  { value: "Diskusi Santai & Tanya Jawab Umum", labelKey: "cal_chip5" },
];

export const DEFAULT_TOPIC = TOPIC_OPTIONS[0]!.value;

/**
 * `t.translations` doesn't support array values (`t()` returns a single
 * string), so calendar month/day names — plain display data, not UI copy —
 * live here as locale-keyed arrays instead of translation keys.
 */
export const MONTH_NAMES: Record<Locale, string[]> = {
  id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

export const DAY_NAMES_SHORT: Record<Locale, string[]> = {
  id: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export const WEEKDAY_HEADER = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const DAY_NAMES_FULL: Record<Locale, string[]> = {
  id: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

/** Indonesian national holidays, ported verbatim from SOURCE `indonesianHolidays`. Keyed `YYYY-MM-DD`. */
const NATIONAL_HOLIDAYS: Record<string, string> = {
  // 2025
  "2025-01-01": "Tahun Baru 2025 Masehi",
  "2025-01-27": "Isra Mi'raj Nabi Muhammad SAW",
  "2025-01-29": "Tahun Baru Imlek 2576 Kongzili",
  "2025-03-29": "Hari Suci Nyepi (Tahun Baru Saka 1947)",
  "2025-03-31": "Hari Raya Idul Fitri 1446 H",
  "2025-04-01": "Hari Raya Idul Fitri 1446 H",
  "2025-04-18": "Wafat Yesus Kristus",
  "2025-04-20": "Kebangkitan Yesus Kristus (Paskah)",
  "2025-05-01": "Hari Buruh Internasional",
  "2025-05-12": "Hari Raya Waisak 2569 BE",
  "2025-05-29": "Kenaikan Yesus Kristus",
  "2025-06-01": "Hari Lahir Pancasila",
  "2025-06-07": "Hari Raya Idul Adha 1446 H",
  "2025-06-27": "1 Muharam / Tahun Baru Islam 1447 H",
  "2025-08-17": "Hari Kemerdekaan Republik Indonesia ke-80",
  "2025-09-05": "Maulid Nabi Muhammad SAW",
  "2025-12-25": "Hari Raya Natal",
  // 2026
  "2026-01-01": "Tahun Baru 2026 Masehi",
  "2026-01-16": "Isra Mi'raj Nabi Muhammad SAW",
  "2026-02-17": "Tahun Baru Imlek 2577 Kongzili",
  "2026-03-20": "Hari Raya Idul Fitri 1447 H",
  "2026-03-21": "Hari Raya Idul Fitri 1447 H",
  "2026-03-22": "Hari Suci Nyepi (Tahun Baru Saka 1948)",
  "2026-04-03": "Wafat Yesus Kristus (Jumat Agung)",
  "2026-04-05": "Hari Paskah",
  "2026-05-01": "Hari Buruh Internasional",
  "2026-05-14": "Kenaikan Yesus Kristus",
  "2026-05-27": "Hari Raya Idul Adha 1447 H",
  "2026-05-31": "Hari Raya Waisak 2570 BE",
  "2026-06-01": "Hari Lahir Pancasila",
  "2026-06-16": "1 Muharam / Tahun Baru Islam 1448 H",
  "2026-08-17": "Hari Kemerdekaan Republik Indonesia ke-81",
  "2026-08-25": "Maulid Nabi Muhammad SAW",
  "2026-12-25": "Hari Raya Natal",
  // 2027
  "2027-01-01": "Tahun Baru 2027 Masehi",
  "2027-01-05": "Isra Mi'raj Nabi Muhammad SAW",
  "2027-02-06": "Tahun Baru Imlek 2578 Kongzili",
  "2027-03-08": "Hari Suci Nyepi (Tahun Baru Saka 1949)",
  "2027-03-09": "Hari Raya Idul Fitri 1448 H",
  "2027-03-10": "Hari Raya Idul Fitri 1448 H",
  "2027-03-26": "Wafat Yesus Kristus",
  "2027-05-01": "Hari Buruh Internasional",
  "2027-05-06": "Kenaikan Yesus Kristus",
  "2027-05-16": "Hari Raya Idul Adha 1448 H",
  "2027-05-20": "Hari Raya Waisak 2571 BE",
  "2027-06-01": "Hari Lahir Pancasila",
  "2027-06-06": "1 Muharam / Tahun Baru Islam 1449 H",
  "2027-08-15": "Maulid Nabi Muhammad SAW",
  "2027-08-17": "Hari Kemerdekaan Republik Indonesia ke-82",
  "2027-12-25": "Hari Raya Natal",
};

function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Returns the Indonesian holiday name for `date`, or `null` if it's a regular day. */
export function getNationalHoliday(date: Date): string | null {
  const key = dateKey(date);
  if (NATIONAL_HOLIDAYS[key]) return NATIONAL_HOLIDAYS[key];

  const fixedKey = key.slice(5); // MM-DD
  if (fixedKey === "01-01") return "Tahun Baru Masehi";
  if (fixedKey === "05-01") return "Hari Buruh Internasional";
  if (fixedKey === "06-01") return "Hari Lahir Pancasila";
  if (fixedKey === "08-17") return "Hari Kemerdekaan RI";
  if (fixedKey === "12-25") return "Hari Raya Natal";

  return null;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isPastDate(date: Date, today: Date = new Date()): boolean {
  return startOfDay(date).getTime() < startOfDay(today).getTime();
}

export function isDateAvailable(date: Date, today: Date = new Date()): boolean {
  return !isPastDate(date, today) && !getNationalHoliday(date);
}

/** Weekday (Mon-Fri): 20:00-21:30 in 30-min steps. Weekend (Sat/Sun): 13:00-19:00 in 90-min steps. */
export function getSlotsForDate(date: Date): string[] {
  if (getNationalHoliday(date)) return [];
  const dayOfWeek = date.getDay();
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return ["20:00", "20:30", "21:00", "21:30"];
  }
  return ["13:00", "14:30", "16:00", "17:30", "19:00"];
}

/** Walks forward from `startDate` (inclusive) up to 90 days to find the next available (non-past, non-holiday) date. */
export function getNextAvailableDate(startDate: Date, today: Date = new Date()): Date {
  const cur = startOfDay(startDate);
  for (let i = 0; i < 90; i++) {
    if (isDateAvailable(cur, today)) return new Date(cur);
    cur.setDate(cur.getDate() + 1);
  }
  return startOfDay(startDate);
}

export interface CalendarDay {
  date: Date;
  day: number;
  isPast: boolean;
  holidayName: string | null;
  isAvailable: boolean;
  isSelected: boolean;
}

/** Builds the leading-blank-padded day matrix for `year`/`month` (0-indexed), mirroring SOURCE's `renderCalCalendar` grid. */
export function buildMonthMatrix(
  year: number,
  month: number,
  selectedDate: Date | null,
  today: Date = new Date(),
): (CalendarDay | null)[] {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (CalendarDay | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const holidayName = getNationalHoliday(cellDate);
    const isPast = isPastDate(cellDate, today);
    const isSelected =
      !!selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === d;

    cells.push({
      date: cellDate,
      day: d,
      isPast,
      holidayName,
      isAvailable: !isPast && !holidayName,
      isSelected,
    });
  }

  return cells;
}

/** e.g. "Rabu, 19 Agu 2026 @ 20:00 WIB" — mirrors SOURCE's `getFormattedSelectedDate` (always Indonesian, as in SOURCE). */
export function formatSelectedDateTime(date: Date, time: string): string {
  const dayName = DAY_NAMES_FULL.id[date.getDay()];
  const monthShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][date.getMonth()];
  return `${dayName}, ${date.getDate()} ${monthShort} ${date.getFullYear()} @ ${time} WIB`;
}

export function isValidEmail(email: string): boolean {
  const pattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return pattern.test(email);
}

/**
 * Placeholder Google Meet link — SOURCE (`handleCalBookingSubmit`) generated a
 * random-suffixed link per booking, but there's no real backend to actually
 * provision a Meet room, so this build keeps a single fixed placeholder
 * (see migration-step.md Open Decision #4) rather than fabricating a fake
 * unique link per submission.
 */
export const MEET_LINK_PLACEHOLDER = "meet.google.com/hrc-live-call";

export interface GoogleCalendarLinkParams {
  date: Date;
  time: string;
  topic: string;
  name: string;
  notes: string;
  meetLink: string;
}

function formatGCalTime(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
}

/** Builds a `calendar.google.com/calendar/render?action=TEMPLATE` add-event link, mirroring SOURCE's `handleCalBookingSubmit`. */
export function buildGoogleCalendarUrl({ date, time, topic, name, notes, meetLink }: GoogleCalendarLinkParams): string {
  const [hourStr = "20", minStr = "0"] = time.split(":");
  const startDate = new Date(date);
  startDate.setHours(parseInt(hourStr, 10) || 20, parseInt(minStr, 10) || 0, 0, 0);
  const endDate = new Date(startDate.getTime() + 60 * 60000);

  const title = encodeURIComponent(`1-on-1 Sesi Konsultasi: ${topic} (HardCode.id)`);
  const details = encodeURIComponent(
    `Sesi 1-on-1 Konsultasi & Mentoring Gratis (60 Menit) via Google Meet\n\nNama: ${name}\nKategori: ${topic}\nTopik Bahasan: ${notes}\nLink Meet: https://${meetLink}\n\nDiselenggarakan oleh HardCode.id`,
  );
  const location = encodeURIComponent(`https://${meetLink}`);
  const dates = `${formatGCalTime(startDate)}/${formatGCalTime(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export interface BookingFormData {
  name: string;
  email: string;
  whatsapp: string;
  topic: string;
  notes: string;
}

export const EMPTY_BOOKING_FORM: BookingFormData = {
  name: "",
  email: "",
  whatsapp: "",
  topic: DEFAULT_TOPIC,
  notes: "",
};
