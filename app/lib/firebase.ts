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
export const isFirebaseAppCheckConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_KEY?.trim());
const canInitializeFirebase = typeof window !== 'undefined' && isFirebaseConfigured;

function getFirebaseApp() {
  if (!canInitializeFirebase) return null;
  try {
    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  } catch {
    return null;
  }
}

function getFirebaseServices() {
  const app = getFirebaseApp();
  if (!app) return { auth: null, db: null };

  try {
    return { auth: getAuth(app), db: getFirestore(app) };
  } catch {
    // Firebase'in servis paketi henüz yüklenmediyse veya bağlantı geçici olarak
    // kullanılamıyorsa sayfanın tamamını hata sınırına düşürmeyiz.
    return { auth: null, db: null };
  }
}

export const firebaseApp = getFirebaseApp();
const initialServices = getFirebaseServices();
export const db = initialServices.db;
export const auth = initialServices.auth;

export function getFirebaseClient() {
  if (typeof window === 'undefined' || !isFirebaseConfigured) {
    return { auth: null, db: null };
  }

  return getFirebaseServices();
}

let appCheckStarted = false;

/**
 * Firebase App Check is deliberately started only in the browser and only
 * when the production reCAPTCHA key has been configured. This keeps local
 * development and preview deployments usable while allowing Firestore to
 * receive App Check tokens as soon as enforcement is enabled in Firebase.
 */
export async function initializeFirebaseAppCheck() {
  if (typeof window === 'undefined' || appCheckStarted) return appCheckStarted;

  const siteKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_KEY?.trim();
  const app = getFirebaseApp();
  if (!siteKey || !app) return false;

  try {
    const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    appCheckStarted = true;
    return true;
  } catch {
    // An unavailable App Check provider must not interrupt customer pages.
    // Firebase enforcement remains the final authority for protected data.
    return false;
  }
}
