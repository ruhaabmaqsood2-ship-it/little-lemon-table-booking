import { useEffect, useRef } from "react";
import { formatDateLabel, formatTimeLabel, OCCASIONS, SEATING_OPTIONS } from "../utils/bookingValidation";

function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function BookingConfirmation({ booking, onReset }) {
  const headingRef = useRef(null);

  // Move keyboard and screen reader focus to the message when it appears.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const guestCount = Number(booking.guests);

  return (
    <div className="confirmation" role="status">
      <h3 ref={headingRef} tabIndex={-1}>
        Your table is booked!
      </h3>
      <p>
        Thank you for choosing Little Lemon. This is a demo, so no real reservation was made and
        no confirmation email will be sent.
      </p>

      <dl className="summary">
        <div>
          <dt>Guests</dt>
          <dd>{guestCount === 1 ? "1 guest" : `${guestCount} guests`}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatDateLabel(booking.date)}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{formatTimeLabel(booking.time)}</dd>
        </div>
        <div>
          <dt>Occasion</dt>
          <dd>{labelFor(OCCASIONS, booking.occasion)}</dd>
        </div>
        <div>
          <dt>Seating</dt>
          <dd>{labelFor(SEATING_OPTIONS, booking.seating)}</dd>
        </div>
      </dl>

      <button type="button" className="button" onClick={onReset}>
        Make another booking
      </button>
    </div>
  );
}

export default BookingConfirmation;
