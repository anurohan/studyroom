# FocusNest Library

FocusNest Library is a React web application for browsing a study library, checking seat availability, and booking a study session. It includes a user dashboard and a separate administration area for managing library settings and the seat map.

## Features

- Landing page and authenticated user dashboard.
- Library seat map and seat-availability views.
- Booking records stored in Firestore, with user and shift/date queries.
- Booking status actions, including cancellation and attendance updates.
- QR-code display for booking-related flows.
- Admin sign-in, dashboard, library settings, and seat-map management.
- Light/dark theme, route-based layouts, and toast notifications.

## Tech stack

- React 18 and Vite.
- Firebase Authentication and Cloud Firestore.
- React Router for application routes.
- Tailwind CSS, Framer Motion, Lucide React, and `react-hot-toast`.
- `qrcode.react` for QR-code rendering.

## Getting started

Install Node.js/npm. Configure Firebase before starting the app:

1. Create a Firebase project and enable the Authentication providers used by the application.
2. Create a Cloud Firestore database and configure its security rules.
3. Copy `.env.example` to `.env.local` and fill in the project values for `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`.
4. Install dependencies and start the development server:

```sh
npm install
npm run dev
```

To check the production build and lint the project:

```sh
npm run build
npm run lint
```

See [`SETUP.md`](SETUP.md) for the Firebase, admin-user, Firestore-rules, and deployment walkthrough. Never commit `.env.local` or private credentials.

## Routes

- `/` — landing page.
- `/dashboard` — user library and booking dashboard.
- `/admin/login` — admin sign-in.
- `/admin` — library administration.

## Main code areas

- `src/pages/` — landing, user dashboard, and admin screens.
- `src/components/user/` — booking cards, seat availability, and QR display.
- `src/components/admin/` — admin dashboard, library settings, and seat map.
- `src/contexts/` — authentication, library data, and theme state.
- `src/firebase/` — Firebase initialization, auth helpers, and Firestore operations.

Firebase configuration and security rules are required for authenticated and data-backed features; a local frontend build alone does not configure a Firebase project.