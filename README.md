# Little Lemon Restaurant: Table Booking Website

A responsive React website for the fictional Mediterranean restaurant **Little Lemon**. Visitors can read about the restaurant and reserve a table using a validated booking form. Built as a front-end project for a Coursera peer-graded assignment.

> **Demo only.** There is no backend. Bookings are not saved, emailed, or sent anywhere. The address, phone number, and email in the footer are fictional.

---

## Features

- Header with logo, restaurant name, and navigation (Home, About, Reservations, Contact)
- Hero section introducing the restaurant, with a "Reserve a table" button
- Short "Why people love Little Lemon" section
- **Working booking form** with:
  - Number of guests (1–10)
  - Reservation date (past dates blocked in the date picker and rejected by validation)
  - Available time (5:00 PM – 10:00 PM, every 30 minutes)
  - Occasion (optional)
  - Seating preference (optional)
- Clear error messages for missing or invalid values
- Confirmation screen with a booking summary after a valid submission, and a button to make another booking
- Same-day edge case handled: times that have passed (or start within 30 minutes) are not offered
- Footer with opening hours and contact details
- Accessible and responsive (mobile, tablet, desktop)
- Unit tests for the form and the validation rules

## Technologies used

| Tool | Purpose |
| --- | --- |
| React 19 (JavaScript) | User interface, hooks (`useState`, `useRef`, `useEffect`) |
| Vite | Development server and production build |
| HTML5 and CSS3 | Semantic markup, CSS Grid, Flexbox, media queries, CSS variables |
| Vitest | Test runner |
| React Testing Library and user-event | Testing the form the way a user uses it |
| jest-dom | Extra test checks such as `toBeRequired()` |
| jsdom | Simulated browser for tests |

The project does not use TypeScript or any extra UI libraries.

> **Why Vite and not Create React App?** Create React App is no longer maintained. Vite is the standard way to start a React project today, and it still uses the usual `src/`, `public/`, and `package.json` layout and npm commands.

## Prerequisites

- **Node.js 22.12 or newer** (Node 22 LTS or 24 LTS recommended). Check with `node -v`. Download from <https://nodejs.org>.
- **npm** (installed together with Node.js)
- **VS Code** (or any code editor)
- **Git** (only needed to upload to GitHub)

## Installation

1. Extract `little-lemon-table-booking.zip`.
2. Open the extracted `little-lemon-table-booking` folder in VS Code (**File > Open Folder**).
3. Open the VS Code terminal (**Terminal > New Terminal**) and run:

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

Open the address shown in the terminal (usually <http://localhost:5173>). Press `Ctrl + C` in the terminal to stop the server.

## Run the tests

```bash
npm test
```

This runs all tests once. To re-run tests automatically while you edit files:

```bash
npm run test:watch
```

### What the tests cover

- `src/components/BookingForm.test.jsx`
  - The form renders with all labelled fields and the demo notice
  - Required fields are marked as required (and optional ones are not)
  - The date picker blocks past dates (`min` attribute)
  - Empty required fields show error messages and nothing is submitted
  - Errors are linked to fields for screen readers and the first error receives focus
  - Missing guest numbers, out-of-range guest numbers (0, 11), and decimals (2.5) are rejected
  - A past date is rejected
  - Errors update as the user fixes them
  - A valid booking is submitted with the correct values
  - The confirmation screen appears with the booking details, and "Make another booking" returns to an empty form
- `src/utils/bookingValidation.test.js`
  - Date and time helpers, available times for today and future dates
  - All validation rules, including impossible dates (such as 30 February), the 90-day booking window, and same-day times that have passed

## Build for production

```bash
npm run build      # creates the dist/ folder
npm run preview    # serves the production build locally
```

## Project folder structure

```text
little-lemon-table-booking/
├── public/
│   └── logo.svg                    # Logo and favicon
├── src/
│   ├── components/
│   │   ├── About.jsx               # "Why people love Little Lemon" cards
│   │   ├── BookingConfirmation.jsx # Success screen with booking summary
│   │   ├── BookingForm.jsx         # Controlled form (useState) + validation on submit
│   │   ├── BookingForm.test.jsx    # Tests for the form and confirmation
│   │   ├── FormField.jsx           # Reusable label + hint + error wrapper
│   │   ├── Footer.jsx              # Hours and contact information
│   │   ├── Header.jsx              # Logo and navigation
│   │   ├── Hero.jsx                # Introduction section
│   │   └── Reservations.jsx        # Switches between the form and the confirmation
│   ├── utils/
│   │   ├── bookingValidation.js    # Booking rules, time slots, validation
│   │   └── bookingValidation.test.js
│   ├── App.jsx                     # Page layout
│   ├── index.css                   # All styles (variables, layout, components, media queries)
│   ├── main.jsx                    # React entry point
│   └── setupTests.js               # Test setup (jest-dom matchers)
├── .gitignore
├── index.html
├── package-lock.json               # Exact dependency versions (keep this file)
├── package.json
├── README.md
└── vite.config.js                  # Vite and Vitest settings
```

## How the booking form works

1. Each input is a **controlled component**: its value lives in React state (`useState`) and updates on every change.
2. When the user presses **Confirm reservation**, `event.preventDefault()` stops the page from reloading and `validateBooking()` checks the values.
3. If there are errors, they are shown under the matching fields, each field gets `aria-invalid`, and the first invalid field receives focus. The form is **not** submitted.
4. If everything is valid, `Reservations` stores the booking and shows `BookingConfirmation`.
5. After a first failed attempt, errors update live as the user corrects the form.

The form uses `noValidate` so the app shows its own clear, consistent messages instead of the browser's default pop-ups. Required fields still carry the `required` attribute for assistive technology.

## Accessibility notes

- Every control has a visible `<label>`; required fields show `*` and carry the `required` attribute
- Error messages use `role="alert"` and are connected to their fields with `aria-describedby`
- Visible focus outline on all links, buttons, and form controls
- "Skip to main content" link for keyboard users
- Semantic elements: `header`, `nav`, `main`, `section`, `form`, `footer`, `address`
- The confirmation message moves focus to its heading so screen reader users hear it
- Touch targets are at least 48px tall; smooth scrolling is turned off for users who prefer reduced motion

## Known limitations

- **No backend or database.** Bookings are not stored, and there is no check for real table availability. All time slots are always offered (except times that have already passed today).
- No confirmation email or SMS is sent.
- Restaurant details (address, phone, email, hours) are made up for the demo.
- Dates and times use the visitor's device clock and time zone.
- The hero photo is loaded from Unsplash, so it needs an internet connection. If it cannot load, the hero shows a dark green box with the image description instead.
- Opening hours, time slots, and the 1–10 guest limit are fixed in `src/utils/bookingValidation.js`.
- The layout is written with mobile, tablet, and desktop breakpoints (640px and 900px). Please also check it yourself in your browser's device toolbar before submitting.

## Upload the project to a new GitHub repository

1. Create a free account at <https://github.com> if you do not have one, and [install Git](https://git-scm.com/downloads).
2. On GitHub, click **+ > New repository**.
   - Name it, for example, `little-lemon-table-booking`.
   - Leave **Add a README**, **.gitignore**, and **license** unchecked (the project already has them).
   - Click **Create repository** and copy the repository URL.
3. In the VS Code terminal, inside the project folder, run (replace the URL with yours):

```bash
git init
git add .
git commit -m "Initial commit: Little Lemon table booking website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/little-lemon-table-booking.git
git push -u origin main
```

4. Refresh the GitHub page. Your files should appear. `node_modules` is ignored by `.gitignore`, so it is not uploaded.

If Git asks who you are, set your name and email once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

When you push, GitHub may ask you to sign in through the browser or with a personal access token instead of your password.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm test` | Runs all tests once |
| `npm run test:watch` | Re-runs tests when files change |
| `npm run build` | Creates the production build in `dist/` |
| `npm run preview` | Previews the production build |
