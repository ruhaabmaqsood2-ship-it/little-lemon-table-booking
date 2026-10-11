import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingForm from "./BookingForm.jsx";
import Reservations from "./Reservations.jsx";
import {
  addDays,
  formatDateLabel,
  toDateInputValue,
} from "../utils/bookingValidation";

// Dates are calculated from the real "today" so the tests never go out of date.
const today = new Date();
const yesterdayValue = toDateInputValue(addDays(today, -1));
const nextWeekValue = toDateInputValue(addDays(today, 7));

// Helpers --------------------------------------------------------------------
const getFields = () => ({
  guests: screen.getByLabelText(/number of guests/i),
  date: screen.getByLabelText(/reservation date/i),
  time: screen.getByLabelText(/available time/i),
  occasion: screen.getByLabelText(/occasion/i),
  seating: screen.getByLabelText(/seating preference/i),
  submit: screen.getByRole("button", { name: /confirm reservation/i }),
});

async function fillValidBooking(user) {
  const fields = getFields();
  fireEvent.change(fields.guests, { target: { value: "4" } });
  fireEvent.change(fields.date, { target: { value: nextWeekValue } });
  await user.selectOptions(fields.time, "19:00");
  await user.selectOptions(fields.occasion, "birthday");
  await user.selectOptions(fields.seating, "outdoor");
}

// Tests ----------------------------------------------------------------------
describe("BookingForm", () => {
  it("renders every field with a label, plus the demo notice and submit button", () => {
    render(<BookingForm onSubmit={vi.fn()} />);
    const fields = getFields();

    expect(fields.guests).toHaveAttribute("type", "number");
    expect(fields.date).toHaveAttribute("type", "date");
    expect(fields.time.tagName).toBe("SELECT");
    expect(fields.occasion.tagName).toBe("SELECT");
    expect(fields.seating.tagName).toBe("SELECT");
    expect(fields.submit).toBeInTheDocument();
    expect(screen.getByText(/this website has no backend/i)).toBeInTheDocument();
  });

  it("marks guests, date and time as required but not occasion or seating", () => {
    render(<BookingForm onSubmit={vi.fn()} />);
    const fields = getFields();

    expect(fields.guests).toBeRequired();
    expect(fields.date).toBeRequired();
    expect(fields.time).toBeRequired();
    expect(fields.occasion).not.toBeRequired();
    expect(fields.seating).not.toBeRequired();
  });

  it("blocks past dates in the date picker with a min attribute set to today", () => {
    render(<BookingForm onSubmit={vi.fn()} />);
    expect(getFields().date).toHaveAttribute("min", toDateInputValue(new Date()));
  });

  it("offers the available time slots", () => {
    render(<BookingForm onSubmit={vi.fn()} />);
    fireEvent.change(getFields().date, { target: { value: nextWeekValue } });

    expect(screen.getByRole("option", { name: "5:00 PM" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "10:00 PM" })).toBeInTheDocument();
  });

  it("shows required-field errors and does not submit an empty form", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);

    await user.click(getFields().submit);

    expect(screen.getByText(/please choose a reservation date/i)).toBeInTheDocument();
    expect(screen.getByText(/please choose a time/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("links error messages to their fields for screen readers and focuses the first error", async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={vi.fn()} />);

    await user.click(getFields().submit);
    const { date, time } = getFields();

    expect(date).toHaveAttribute("aria-invalid", "true");
    expect(date).toHaveAccessibleDescription(/please choose a reservation date/i);
    expect(time).toHaveAttribute("aria-invalid", "true");
    expect(date).toHaveFocus();
  });

  it("shows an error when the number of guests is missing", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);

    fireEvent.change(getFields().guests, { target: { value: "" } });
    await user.click(getFields().submit);

    expect(screen.getByText(/please enter the number of guests/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it.each(["0", "11", "2.5"])("rejects %s guests", async (guests) => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);

    await fillValidBooking(user);
    fireEvent.change(getFields().guests, { target: { value: guests } });
    await user.click(getFields().submit);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("rejects a past date typed into the date field", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);

    await fillValidBooking(user);
    fireEvent.change(getFields().date, { target: { value: yesterdayValue } });
    await user.click(getFields().submit);

    expect(screen.getByText(/reservation date cannot be in the past/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("keeps the chosen time when the date changes to another day with the same slots", async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={vi.fn()} />);

    fireEvent.change(getFields().date, { target: { value: nextWeekValue } });
    await user.selectOptions(getFields().time, "17:00");
    fireEvent.change(getFields().date, { target: { value: toDateInputValue(addDays(today, 8)) } });

    expect(getFields().time).toHaveValue("17:00");
  });

  it("updates error messages as the user fixes problems after a failed submit", async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={vi.fn()} />);

    await user.click(getFields().submit);
    expect(screen.getByText(/please choose a reservation date/i)).toBeInTheDocument();

    fireEvent.change(getFields().date, { target: { value: nextWeekValue } });
    expect(screen.queryByText(/please choose a reservation date/i)).not.toBeInTheDocument();
  });

  it("submits the entered values when the booking is valid", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BookingForm onSubmit={handleSubmit} />);

    await fillValidBooking(user);
    await user.click(getFields().submit);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      guests: "4",
      date: nextWeekValue,
      time: "19:00",
      occasion: "birthday",
      seating: "outdoor",
    });
  });
});

describe("Reservations (form + confirmation)", () => {
  it("shows a confirmation with the booking details after a valid submission", async () => {
    const user = userEvent.setup();
    render(<Reservations />);

    await fillValidBooking(user);
    await user.click(getFields().submit);

    expect(screen.getByRole("heading", { name: /your table is booked/i })).toBeInTheDocument();
    expect(screen.getByText("4 guests")).toBeInTheDocument();
    expect(screen.getByText(formatDateLabel(nextWeekValue))).toBeInTheDocument();
    expect(screen.getByText("7:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Birthday")).toBeInTheDocument();
    expect(screen.getByText("Outdoor patio")).toBeInTheDocument();
    expect(screen.getByText(/this is a demo/i)).toBeInTheDocument();

    // The form is replaced by the confirmation.
    expect(screen.queryByRole("button", { name: /confirm reservation/i })).not.toBeInTheDocument();
  });

  it("does not show the confirmation when the form is invalid", async () => {
    const user = userEvent.setup();
    render(<Reservations />);

    await user.click(getFields().submit);

    expect(screen.queryByRole("heading", { name: /your table is booked/i })).not.toBeInTheDocument();
  });

  it("lets the user start a new booking from the confirmation", async () => {
    const user = userEvent.setup();
    render(<Reservations />);

    await fillValidBooking(user);
    await user.click(getFields().submit);
    await user.click(screen.getByRole("button", { name: /make another booking/i }));

    expect(screen.getByRole("button", { name: /confirm reservation/i })).toBeInTheDocument();
    expect(getFields().date).toHaveValue("");
  });
});
