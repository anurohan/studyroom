// src/firebase/firestore.js
// Firestore CRUD helpers for bookings, settings, users, attendance
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ─── Library Settings ────────────────────────────────────────────────────────

/** Fetch library settings (singleton doc) */
export const getLibrarySettings = async () => {
  const ref = doc(db, 'settings', 'library');
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

/** Subscribe to live library settings */
export const subscribeSettings = (callback) =>
  onSnapshot(doc(db, 'settings', 'library'), (snap) => {
    if (snap.exists()) callback(snap.data());
  });

/** Update library settings */
export const updateLibrarySettings = (data) =>
  setDoc(doc(db, 'settings', 'library'), data, { merge: true });

/** Seed default settings if not present */
export const seedDefaultSettings = async () => {
  const ref = doc(db, 'settings', 'library');
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      libraryName: 'FocusNest Library',
      address: '123 Study Lane, Knowledge City, India',
      totalSeats: 51,
      shifts: [
        { id: 'morning',   label: 'Morning',   time: '10:00 AM – 2:00 PM',  price: 300 },
        { id: 'afternoon', label: 'Afternoon',  time: '2:00 PM – 6:00 PM',   price: 300 },
        { id: 'evening',   label: 'Evening',    time: '6:00 PM – 10:00 PM',  price: 300 },
      ],
      facilities: ['High-Speed WiFi', 'Air Conditioning', 'Quiet Zone', 'Power Sockets', 'Purified Water', 'CCTV Security', 'Locker Facility', 'Printing Service'],
      whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999',
      createdAt: serverTimestamp(),
    });
  }
};

// ─── Bookings ────────────────────────────────────────────────────────────────

/** Create a new booking and return its ID */
export const createBooking = async (bookingData) => {
  const ref = await addDoc(collection(db, 'bookings'), {
    ...bookingData,
    status: 'confirmed',
    attendance: 'not-checked-in',
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

/** Get all bookings for a specific user */
export const getUserBookings = async (uid) => {
  const q = query(
    collection(db, 'bookings'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/** Subscribe to user's bookings in real-time */
export const subscribeUserBookings = (uid, callback) => {
  const q = query(
    collection(db, 'bookings'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

/** Get bookings for a specific date + shift */
export const getShiftBookings = async (date, shiftId) => {
  const q = query(
    collection(db, 'bookings'),
    where('date', '==', date),
    where('shiftId', '==', shiftId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter(b => b.status !== 'cancelled');
};

/** Subscribe to live bookings for a date+shift */
export const subscribeShiftBookings = (date, shiftId, callback) => {
  const q = query(
    collection(db, 'bookings'),
    where('date', '==', date),
    where('shiftId', '==', shiftId)
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

/** Mark attendance by booking ID */
export const markAttendance = (bookingId, status) =>
  updateDoc(doc(db, 'bookings', bookingId), {
    attendance: status,
    [`${status}At`]: serverTimestamp(),
  });

/** Cancel a booking */
export const cancelBooking = (bookingId) =>
  updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });

/** Get all bookings (admin) */
export const getAllBookings = async (dateFilter) => {
  let q;
  if (dateFilter) {
    q = query(
      collection(db, 'bookings'),
      where('date', '==', dateFilter),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/** Subscribe to all bookings in real-time (admin) */
export const subscribeAllBookings = (callback) => {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

// ─── Users ───────────────────────────────────────────────────────────────────

/** Get all users (admin) */
export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/** Subscribe to all users real-time (admin) */
export const subscribeAllUsers = (callback) =>
  onSnapshot(collection(db, 'users'), (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

/** Get a single user */
export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
