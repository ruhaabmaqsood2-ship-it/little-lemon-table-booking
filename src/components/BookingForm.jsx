import { useState } from "react";
import FormField from "./FormField.jsx";
import {
  BOOKING_WINDOW_DAYS,
  MAX_GUESTS,
  MIN_GUESTS,
  OCCASIONS,
  SEATING_OPTIONS,
  addDays,
  formatTimeLabel,
  getAvailableTimes,
  toDateInputValue,
  validateBooking,
} from "../utils/bookingValidation";

const initialValues = {
  guests: "2",
  date: "",
  time: "",
  occasion: "none",
  seating: "no-preference",
};

// Order of the fields on the page, used to focus the first one with an error.
const fieldOrder = ["guests", "date", "time", "occasion", "seating"];

function BookingForm({ onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

  const now = new Date();
  const minDate = toDateInputValue(now); // blocks past dates in the date picker
  const maxDate = toDateInputValue(addDays(now, BOOKING_WINDOW_DAYS));
  const availableTimes = getAvailableTimes(values.date, now);

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };

    // If the chosen time is not available on the new date, clear it.
    if (name === "date" && !getAvailableTimes(value, now).includes(nextValues.time)) {
      nextValues.time = "";
    }

    setValues(nextValues);

    // After the first submit attempt, keep the error messages up to date while the user types.
    if (hasTriedToSubmit) {
      setErrors(validateBooking(nextValues, now));
    }
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setHasTriedToSubmit(true);

    const validationErrors = validateBooking(values, now);
    setErrors(validationErrors);

    const firstInvalidField = fieldOrder.find((name) => validationErrors[name]);
    if (firstInvalidField) {
      document.getElementById(`booking-${firstInvalidField}`)?.focus();
      return;
    }

    onSubmit(values);
  }

  // Props shared by every control: id, value, change handler, and accessibility links to messages.
  function controlProps(name, hasHint = false) {
    const describedBy = [hasHint && `booking-${name}-hint`, errors[name] && `booking-${name}-error`]
      .filter(Boolean)
      .join(" ");

    return {
      id: `booking-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      "aria-invalid": errors[name] ? "true" : undefined,
      "aria-describedby": describedBy || undefined,
    };
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <p className="demo-note">
        <strong>Demo only:</strong> this website has no backend, so bookings are not saved or sent
        to the restaurant.
      </p>

      <p className="required-note">
        Fields marked with <span aria-hidden="true">*</span>
        <span className="visually-hidden">an asterisk</span> are required.
      </p>

      <div className="form-grid">
        <FormField
          name="guests"
          label="Number of guests"
          required
          hint={`Between ${MIN_GUESTS} and ${MAX_GUESTS} guests.`}
          error={errors.guests}
        >
          <input
            type="number"
            min={MIN_GUESTS}
            max={MAX_GUESTS}
            step="1"
            inputMode="numeric"
            required
            {...controlProps("guests", true)}
          />
        </FormField>

        <FormField name="date" label="Reservation date" required error={errors.date}>
          <input type="date" min={minDate} max={maxDate} required {...controlProps("date")} />
        </FormField>

        <FormField
          name="time"
          label="Available time"
          required
          hint={
            availableTimes.length === 0
              ? "No more tables are available today. Please choose another date."
              : "We seat guests from 5:00 PM to 10:00 PM."
          }
          error={errors.time}
        >
          <select required {...controlProps("time", true)}>
            <option value="">Select a time</option>
            {availableTimes.map((slot) => (
              <option key={slot} value={slot}>
                {formatTimeLabel(slot)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField name="occasion" label="Occasion" error={errors.occasion}>
          <select {...controlProps("occasion")}>
            {OCCASIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField name="seating" label="Seating preference" error={errors.seating}>
          <select {...controlProps("seating")}>
            {SEATING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <button type="submit" className="button">
        Confirm reservation
      </button>
    </form>
  );
}

export default BookingForm;
