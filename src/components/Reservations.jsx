import { useState } from "react";
import BookingForm from "./BookingForm.jsx";
import BookingConfirmation from "./BookingConfirmation.jsx";

// Holds the confirmed booking. No booking yet -> show the form. Booking made -> show the confirmation.
function Reservations() {
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  return (
    <section
      id="reservations"
      className="section section--neutral"
      aria-labelledby="reservations-heading"
    >
      <div className="container container--narrow">
        <h2 id="reservations-heading" className="section__title">
          Reserve a table
        </h2>

        {confirmedBooking ? (
          <BookingConfirmation
            booking={confirmedBooking}
            onReset={() => setConfirmedBooking(null)}
          />
        ) : (
          <BookingForm onSubmit={setConfirmedBooking} />
        )}
      </div>
    </section>
  );
}

export default Reservations;
