# FocusNest Library — Firebase Setup & Deployment Guide

## Step 1: Install Node.js

1. Download Node.js LTS from https://nodejs.org/
2. Run the installer (just click Next → Next → Install)
3. After installation, **restart your terminal / VS Code**
4. Verify: `node --version` and `npm --version` should both print version numbers

---

## Step 2: Install Project Dependencies

Open a terminal in `d:\lpu\sem 5\library\` and run:

```bash
npm install
```

This installs React, Vite, Tailwind CSS, Firebase, and all other dependencies.

---

## Step 3: Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** → Name it `focusnest-library` → Continue
3. Disable Google Analytics (optional) → **Create project**

### Enable Authentication
1. In your Firebase project → **Build → Authentication → Get started**
2. **Sign-in method → Google** → Enable → Add your support email → Save
3. **Sign-in method → Email/Password** → Enable → Save

### Create the Admin User
1. In **Authentication → Users → Add user**
2. Email: `admin@focusnest.com` | Password: `admin123`
3. Click **Add user**

### Enable Firestore
1. **Build → Firestore Database → Create database**
2. Choose **Start in test mode** → Select your region → Enable

### Firestore Security Rules (update after testing)
Go to **Firestore → Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for settings
    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth.token.email == 'admin@focusnest.com';
    }
    // Users: read/write own profile
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      allow read: if request.auth.token.email == 'admin@focusnest.com';
    }
    // Bookings: users manage their own; admin has full access
    match /bookings/{bookingId} {
      allow read, create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (resource.data.uid == request.auth.uid ||
         request.auth.token.email == 'admin@focusnest.com');
    }
  }
}
```

---

## Step 4: Get Firebase Config Keys

1. In Firebase Console → **Project settings** (⚙️ gear icon)
2. Scroll to **"Your apps"** → Click **</>** (Web) → Register app
3. Name: `FocusNest Web` → **Register app**
4. Copy the `firebaseConfig` object values

---

## Step 5: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Firebase values:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=focusnest-library.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=focusnest-library
   VITE_FIREBASE_STORAGE_BUCKET=focusnest-library.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_ADMIN_EMAIL=admin@focusnest.com
   VITE_WHATSAPP_NUMBER=919999999999
   ```

---

## Step 6: Add Your Domain to Firebase Auth

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Click **Add domain** → Add `localhost` (already there) and your Vercel domain later

---

## Step 7: Run Locally

```bash
npm run dev
```

Visit: http://localhost:5173

**Test the app:**
- Click "Sign In with Google" → should open Google OAuth popup
- Click "Admin" → go to `/admin/login` → use `admin@focusnest.com` / `admin123`
- Book a seat → QR code should appear
- Check admin dashboard for live data

---

## Step 8: Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```
When prompted, set the **build command** to `npm run build` and **output directory** to `dist`.

### Option B — Vercel Dashboard (Easier)
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: FocusNest Library"
   git remote add origin https://github.com/YOUR_USERNAME/focusnest-library.git
   git push -u origin main
   ```
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. In **Environment Variables**, add all your `.env` variables
5. Click **Deploy**

### After Deployment
- Add your Vercel domain to Firebase Auth Authorized Domains
- Add your Vercel domain to Google OAuth Authorized redirect URIs

---

## Folder Structure Summary

```
d:\lpu\sem 5\library\
├── public/favicon.svg
├── src/
│   ├── firebase/         # Firebase config, auth helpers, Firestore CRUD
│   ├── contexts/         # AuthContext, ThemeContext, LibraryContext
│   ├── components/
│   │   ├── layout/       # Navbar, Footer, WhatsApp button
│   │   ├── landing/      # Hero, Facilities, Pricing, Testimonials, Map
│   │   ├── user/         # Dashboard, BookingCard, QRCodeDisplay, SeatAvailability
│   │   └── admin/        # AdminDashboard, SeatMap, LibrarySettings
│   ├── pages/            # LandingPage, UserDashboard, AdminPanel, AdminLogin
│   └── utils/            # dateHelpers, qrcode utils
├── .env.example
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Default Credentials

| Role  | Email                    | Password |
|-------|--------------------------|----------|
| Admin | admin@focusnest.com      | admin123 |
| Users | Google OAuth (any Gmail) | —        |

> ⚠️ Change the admin password after your first login via Firebase Console → Authentication → Users.
