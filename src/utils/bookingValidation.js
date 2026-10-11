// Booking rules and validation helpers.
// Everything here is plain JavaScript (no React) so it is easy to test.

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 10;
export const BOOKING_WINDOW_DAYS = 90; // how far ahead guests can book
export const MIN_LEAD_MINUTES = 30; // a same-day table must be booked 30+ minutes ahead

// Demo opening hours: a table can start every 30 minutes from 5:00 PM to 10:00 PM.
export const TIME_SLOTS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

export const OCCASIONS = [
  { value: "none", label: "No special occasion" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "engagement", label: "Engagement" },
  { value: "business", label: "Business dinner" },
  { value: "other", label: "Other" },
];

export const SEATING_OPTIONS = [
  { value: "no-preference", label: "No preference" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor patio" },
  { value: "bar", label: "Bar counter" },
];

/** Turns a Date into "YYYY-MM-DD" using the user's LOCAL time zone (what <input type="date"> uses). */
export function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns a new Date that is `days` days after `date`. */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Turns "YYYY-MM-DD" into a Date at local midnight.
 * Returns null for anything that is not a real calendar date (for example "2026-02-30").
 */
export function parseDateInput(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  // If JavaScript "fixed" the date (Feb 30 -> Mar 2), the original was not valid.
  return toDateInputValue(date) === value ? date : null;
}

/** "19:30" -> "7:30 PM" */
export function formatTimeLabel(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** "2026-12-25" -> "Friday, December 25, 2026" */
export function formatDateLabel(value) {
  const date = parseDateInput(value);
  if (!date) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Time slots a guest can pick for a given date.
 * For today's date, slots that are too soon (or already passed) are removed.
 */
export function getAvailableTimes(dateValue, now = new Date()) {
  if (dateValue !== toDateInputValue(now)) {
    return TIME_SLOTS;
  }
  const earliestMinutes = now.getHours() * 60 + now.getMinutes() + MIN_LEAD_MINUTES;
  return TIME_SLOTS.filter((slot) => toMinutes(slot) > earliestMinutes);
}

/**
 * Checks the booking values and returns an object of error messages.
 * An empty object means the booking is valid.
 * Example: { date: "Reservation date cannot be in the past." }
 */
export function validateBooking(values, now = new Date()) {
  const errors = {};

  // Guests
  const guests = String(values.guests ?? "").trim();
  if (guests === "") {
    errors.guests = "Please enter the number of guests.";
  } else if (!/^\d+$/.test(guests)) {
    errors.guests = "Number of guests must be a whole number, like 2 or 4.";
  } else if (Number(guests) < MIN_GUESTS || Number(guests) > MAX_GUESTS) {
    errors.guests = `We can seat ${MIN_GUESTS} to ${MAX_GUESTS} guests online. For larger groups, please call us.`;
  }

  // Date
  const dateValue = values.date ?? "";
  const reservationDate = parseDateInput(dateValue);
  if (dateValue === "") {
    errors.date = "Please choose a reservation date.";
  } else if (!reservationDate) {
    errors.date = "Please enter a valid date.";
  } else {
    const today = parseDateInput(toDateInputValue(now));
    const lastBookableDay = addDays(today, BOOKING_WINDOW_DAYS);
    if (reservationDate < today) {
      errors.date = "Reservation date cannot be in the past.";
    } else if (reservationDate > lastBookableDay) {
      errors.date = `We take bookings up to ${BOOKING_WINDOW_DAYS} days in advance.`;
    }
  }

  // Time
  const time = values.time ?? "";
  if (time === "") {
    errors.time = "Please choose a time.";
  } else if (!TIME_SLOTS.includes(time)) {
    errors.time = "Please choose one of the available times.";
  } else if (reservationDate && !errors.date && !getAvailableTimes(dateValue, now).includes(time)) {
    errors.time = "That time is too soon or has already passed today. Please choose a later time.";
  }

  // Optional fields: only check that the value is one we offer.
  if (!OCCASIONS.some((option) => option.value === values.occasion)) {
    errors.occasion = "Please choose an occasion from the list.";
  }
  if (!SEATING_OPTIONS.some((option) => option.value === values.seating)) {
    errors.seating = "Please choose a seating preference from the list.";
  }

  return errors;
}
