import { describe, expect, it } from "vitest";
import {
  BOOKING_WINDOW_DAYS,
  TIME_SLOTS,
  addDays,
  formatTimeLabel,
  getAvailableTimes,
  parseDateInput,
  toDateInputValue,
  validateBooking,
} from "./bookingValidation";

// A fixed "now" so the tests give the same result every day: Monday, June 15 2026, 6:00 PM (local time).
const now = new Date(2026, 5, 15, 18, 0);
const today = "2026-06-15";

const validBooking = {
  guests: "4",
  date: "2026-06-20",
  time: "19:00",
  occasion: "birthday",
  seating: "indoor",
};

describe("date helpers", () => {
  it("formats a date as YYYY-MM-DD in local time", () => {
    expect(toDateInputValue(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("parses real dates and rejects impossible ones", () => {
    expect(parseDateInput("2026-12-25")).toEqual(new Date(2026, 11, 25));
    expect(parseDateInput("2026-02-30")).toBeNull();
    expect(parseDateInput("not-a-date")).toBeNull();
    expect(parseDateInput("")).toBeNull();
  });

  it("formats time labels for display", () => {
    expect(formatTimeLabel("17:00")).toBe("5:00 PM");
    expect(formatTimeLabel("21:30")).toBe("9:30 PM");
    expect(formatTimeLabel("12:00")).toBe("12:00 PM");
    expect(formatTimeLabel("00:15")).toBe("12:15 AM");
  });
});

describe("getAvailableTimes", () => {
  it("returns every slot for a future date", () => {
    expect(getAvailableTimes("2026-06-20", now)).toEqual(TIME_SLOTS);
  });

  it("returns every slot while no date is chosen", () => {
    expect(getAvailableTimes("", now)).toEqual(TIME_SLOTS);
  });

  it("removes slots that already passed or start within 30 minutes today", () => {
    // It is 6:00 PM, so 6:30 PM is too soon and the first slot left is 7:00 PM.
    const times = getAvailableTimes(today, now);
    expect(times[0]).toBe("19:00");
    expect(times).not.toContain("17:00");
    expect(times).not.toContain("18:30");
  });

  it("returns no slots late at night on the same day", () => {
    const lateNow = new Date(2026, 5, 15, 21, 45);
    expect(getAvailableTimes(today, lateNow)).toEqual([]);
  });
});

describe("validateBooking", () => {
  it("accepts a valid booking", () => {
    expect(validateBooking(validBooking, now)).toEqual({});
  });

  it("requires guests, date and time", () => {
    const errors = validateBooking({ ...validBooking, guests: "", date: "", time: "" }, now);
    expect(errors.guests).toMatch(/enter the number of guests/i);
    expect(errors.date).toMatch(/choose a reservation date/i);
    expect(errors.time).toMatch(/choose a time/i);
  });

  it("rejects dates in the past", () => {
    const errors = validateBooking({ ...validBooking, date: "2026-06-14" }, now);
    expect(errors.date).toMatch(/cannot be in the past/i);
  });

  it("accepts today when the time is still available", () => {
    expect(validateBooking({ ...validBooking, date: today, time: "20:00" }, now)).toEqual({});
  });

  it("rejects a time that has already passed today", () => {
    const errors = validateBooking({ ...validBooking, date: today, time: "17:30" }, now);
    expect(errors.time).toMatch(/too soon or has already passed/i);
  });

  it("rejects dates too far in the future", () => {
    const tooFar = toDateInputValue(addDays(new Date(2026, 5, 15), BOOKING_WINDOW_DAYS + 1));
    const lastDay = toDateInputValue(addDays(new Date(2026, 5, 15), BOOKING_WINDOW_DAYS));
    expect(validateBooking({ ...validBooking, date: tooFar }, now).date).toMatch(/in advance/i);
    expect(validateBooking({ ...validBooking, date: lastDay }, now)).toEqual({});
  });

  it("rejects impossible dates", () => {
    const errors = validateBooking({ ...validBooking, date: "2026-02-30" }, now);
    expect(errors.date).toMatch(/valid date/i);
  });

  it.each(["0", "11", "-2", "2.5", "abc"])("rejects %s guests", (guests) => {
    const errors = validateBooking({ ...validBooking, guests }, now);
    expect(errors.guests).toBeTruthy();
  });

  it.each(["1", "10"])("accepts %s guest(s)", (guests) => {
    expect(validateBooking({ ...validBooking, guests }, now).guests).toBeUndefined();
  });

  it("rejects a time that is not one of the offered slots", () => {
    const errors = validateBooking({ ...validBooking, time: "03:00" }, now);
    expect(errors.time).toMatch(/available times/i);
  });

  it("rejects unknown occasion and seating values", () => {
    const errors = validateBooking({ ...validBooking, occasion: "party-bus", seating: "roof" }, now);
    expect(errors.occasion).toBeTruthy();
    expect(errors.seating).toBeTruthy();
  });
});
