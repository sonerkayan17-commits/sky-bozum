import { getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from './firebase-app';

/** Returns Firestore without importing or starting Firebase Auth. */
export function getFirebaseFirestore() {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch {
    return null;
  }
}
