import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
const canInitializeFirebase = typeof window !== 'undefined' && isFirebaseConfigured;

export const firebaseApp = canInitializeFirebase
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;

export function getFirebaseClient() {
  if (typeof window === 'undefined' || !isFirebaseConfigured) {
    return { auth: null, db: null };
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return { auth: getAuth(app), db: getFirestore(app) };
}
