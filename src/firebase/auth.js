// src/firebase/auth.js
// Auth helpers: Google sign-in, email/password sign-in, sign-out
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

const googleProvider = new GoogleAuthProvider();

// Sign in with Google popup
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  // Upsert user document in Firestore
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      role: 'student',
      createdAt: serverTimestamp(),
    });
  }
  return user;
};

// Admin email/password sign-in
export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Sign out current user
export const logOut = () => signOut(auth);

// Subscribe to auth state changes
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
