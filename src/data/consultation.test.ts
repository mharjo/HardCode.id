import { describe, expect, it } from "vitest";
import {
  buildGoogleCalendarUrl,
  buildMonthMatrix,
  formatSelectedDateTime,
  getNationalHoliday,
  getNextAvailableDate,
  getSlotsForDate,
  isDateAvailable,
  isPastDate,
  isValidEmail,
} from "./consultation";

const TODAY = new Date(2026, 7, 20); // 2026-08-20 (Thursday)

describe("getNationalHoliday", () => {
  it("recognizes a dated national holiday", () => {
    expect(getNationalHoliday(new Date(2026, 7, 17))).toBe("Hari Kemerdekaan Republik Indonesia ke-81");
  });

  it("recognizes a fixed recurring holiday outside the explicit table", () => {
    expect(getNationalHoliday(new Date(2028, 0, 1))).toBe("Tahun Baru Masehi");
  });

  it("returns null for a regular working day", () => {
    expect(getNationalHoliday(new Date(2026, 7, 19))).toBeNull();
  });
});

describe("isPastDate / isDateAvailable", () => {
  it("treats today as not past", () => {
    expect(isPastDate(TODAY, TODAY)).toBe(false);
  });

  it("treats yesterday as past", () => {
    expect(isPastDate(new Date(2026, 7, 19), TODAY)).toBe(true);
  });

  it("marks a holiday as unavailable even if it's in the future", () => {
    expect(isDateAvailable(new Date(2026, 7, 25), TODAY)).toBe(false);
  });

  it("marks a future working day as available", () => {
    expect(isDateAvailable(new Date(2026, 7, 21), TODAY)).toBe(true);
  });
});

describe("getSlotsForDate", () => {
  it("returns 4 weekday slots for a Wednesday", () => {
    expect(getSlotsForDate(new Date(2026, 7, 19))).toEqual(["20:00", "20:30", "21:00", "21:30"]);
  });

  it("returns 5 weekend slots for a Saturday", () => {
    expect(getSlotsForDate(new Date(2026, 7, 22))).toEqual(["13:00", "14:30", "16:00", "17:30", "19:00"]);
  });

  it("returns no slots on a national holiday", () => {
    expect(getSlotsForDate(new Date(2026, 7, 17))).toEqual([]);
  });
});

describe("getNextAvailableDate", () => {
  it("skips a holiday landing on the start date", () => {
    const result = getNextAvailableDate(new Date(2026, 11, 25), TODAY); // Christmas Day
    expect(result.getDate()).toBe(26);
    expect(result.getMonth()).toBe(11);
  });

  it("returns the same date when already available", () => {
    const result = getNextAvailableDate(new Date(2026, 7, 21), TODAY);
    expect(result.getDate()).toBe(21);
  });
});

describe("buildMonthMatrix", () => {
  it("pads leading empty cells for the first week and includes every day of the month", () => {
    const cells = buildMonthMatrix(2026, 7, null, TODAY); // August 2026
    const firstDayIndex = new Date(2026, 7, 1).getDay();
    expect(cells.slice(0, firstDayIndex).every((c) => c === null)).toBe(true);
    const days = cells.filter((c): c is NonNullable<typeof c> => c !== null);
    expect(days).toHaveLength(31);
    expect(days.at(-1)?.day).toBe(31);
  });

  it("marks the selected date and flags holidays as unavailable", () => {
    const selected = new Date(2026, 7, 21);
    const cells = buildMonthMatrix(2026, 7, selected, TODAY).filter((c) => c !== null);
    const selectedCell = cells.find((c) => c!.day === 21)!;
    const holidayCell = cells.find((c) => c!.day === 17)!;
    expect(selectedCell.isSelected).toBe(true);
    expect(holidayCell.isAvailable).toBe(false);
    expect(holidayCell.holidayName).toBe("Hari Kemerdekaan Republik Indonesia ke-81");
  });
});

describe("formatSelectedDateTime", () => {
  it("formats a date/time into the SOURCE-style Indonesian recap string", () => {
    expect(formatSelectedDateTime(new Date(2026, 7, 19), "20:00")).toBe("Rabu, 19 Agu 2026 @ 20:00 WIB");
  });
});

describe("isValidEmail", () => {
  it("accepts a well-formed email", () => {
    expect(isValidEmail("arya@gmail.com")).toBe(true);
  });

  it("rejects a malformed email", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("missing@domain")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("buildGoogleCalendarUrl", () => {
  it("builds a calendar.google.com add-event link with encoded event details", () => {
    const start = new Date(2026, 7, 19);
    start.setHours(20, 0, 0, 0);
    const expectedStart = start.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(start.getTime() + 60 * 60000);
    const expectedEnd = end.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const url = buildGoogleCalendarUrl({
      date: new Date(2026, 7, 19),
      time: "20:00",
      topic: "Roadmap Belajar Coding & AI",
      name: "Arya",
      notes: "Bahas roadmap belajar",
      meetLink: "meet.google.com/hrc-live-call",
    });
    expect(url).toContain("https://calendar.google.com/calendar/render?action=TEMPLATE");
    expect(url).toContain(`dates=${expectedStart}/${expectedEnd}`);
    expect(decodeURIComponent(url)).toContain("Nama: Arya");
  });
});
