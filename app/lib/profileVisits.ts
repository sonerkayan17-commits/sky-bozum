import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, where, type Firestore } from 'firebase/firestore';

export type ProfileVisitor = { id: string; name: string; avatar: string; viewedAt: Date | null };

export async function recordProfileVisit(db: Firestore, profileId: string, visitor: { id: string; name: string; avatar?: string }) {
  if (!visitor.id || visitor.id === profileId) return;
  await setDoc(doc(db, 'profileVisits', `${profileId}_${visitor.id}`), {
    profileId,
    visitorId: visitor.id,
    visitorName: visitor.name.slice(0, 80),
    visitorAvatar: String(visitor.avatar || '').slice(0, 30000),
    viewedAt: serverTimestamp(),
  });
}

export function subscribeToProfileVisitors(db: Firestore, profileId: string, onChange: (visitors: ProfileVisitor[], count: number) => void, onError: () => void) {
  return onSnapshot(
    query(collection(db, 'profileVisits'), where('profileId', '==', profileId)),
    (snapshot) => onChange(snapshot.docs.map((item) => {
      const data = item.data();
      return { id: String(data.visitorId || item.id), name: String(data.visitorName || 'Üye'), avatar: String(data.visitorAvatar || ''), viewedAt: data.viewedAt?.toDate?.() ?? null };
    }).sort((first, second) => (second.viewedAt?.getTime() || 0) - (first.viewedAt?.getTime() || 0)).slice(0, 12), snapshot.size),
    onError,
  );
}
