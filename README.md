# SchoolDesk — clickable school management prototype

A local, browser-based demo for validating a school management SaaS concept with school principals and correspondents.

## Requirements
- Node.js 20 LTS or newer
- npm
- VS Code (recommended)

## Run locally
1. Extract this folder and open it in VS Code.
2. Open Terminal → New Terminal.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL Vite prints, usually `http://localhost:5173`.

## Production build check
Run `npm run build`. To preview a production build, run `npm run preview`.

## Included
- Overview dashboard with sample metrics and charts
- Student directory, search, filters, profile modal, add-student form
- Attendance marking with recalculated counts
- Fee list, simulated payment flow, receipt preview
- Reports with date/report filters and CSV download
- Staff directory and demo permission toggles
- Classes and divisions
- Editable demo school settings
- Local browser persistence and reset-to-demo-data control
- Responsive layout and mobile navigation

## Important demo limitations
- All school, student, staff, attendance, and fee records are fictional.
- Payments and receipts are simulations only. No money is collected.
- Demo permissions are visual only, not security controls.
- `localStorage` is not secure storage and must never be used for real student records.
- There is no real authentication, backend, database, WhatsApp/SMS, or production export service.

Use this prototype to discuss workflows and test demand, not to operate a real school.
