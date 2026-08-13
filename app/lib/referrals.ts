import { collection, getDocs, limit, query, where, type Firestore } from 'firebase/firestore';

export function getReferralCode(uid: string) {
  return `SKY-${uid.slice(0, 8).toUpperCase()}`;
}

export function getReferralLink(uid: string) {
  return `${window.location.origin}/kayit?ref=${getReferralCode(uid)}`;
}

export async function findReferrerId(db: Firestore, code: string) {
  const cleanCode = code.trim().toUpperCase().slice(0, 20);
  if (!cleanCode) return null;
  const snapshot = await getDocs(query(collection(db, 'publicProfiles'), where('referralCode', '==', cleanCode), limit(1)));
  return snapshot.docs[0]?.id ?? null;
}
