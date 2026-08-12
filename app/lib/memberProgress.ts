import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, where, type Firestore } from 'firebase/firestore';

export type MemberActivityType = 'like' | 'comment' | 'share';
export type MemberActivity = { id: string; type: MemberActivityType; targetId: string; points: number; createdAt: Date | null };
const activityPoints: Record<MemberActivityType, number> = { like: 2, comment: 5, share: 10 };

export async function recordMemberActivity(db: Firestore, uid: string, type: MemberActivityType, targetId: string) {
  const safeTarget = targetId.replace(/[^a-zA-Z0-9:_-]/g, '-').slice(0, 100);
  await setDoc(doc(db, 'memberActivities', `${uid}_${type}_${safeTarget}`), { uid, type, targetId: safeTarget, points: activityPoints[type], createdAt: serverTimestamp() });
}

export function subscribeToMemberActivities(db: Firestore, uid: string, onChange: (items: MemberActivity[]) => void) {
  return onSnapshot(query(collection(db, 'memberActivities'), where('uid', '==', uid)), (snapshot) => onChange(snapshot.docs.map((item) => {
    const data = item.data();
    return { id: item.id, type: data.type as MemberActivityType, targetId: String(data.targetId || ''), points: Number(data.points) || 0, createdAt: data.createdAt?.toDate?.() ?? null };
  })));
}

export const memberLevels = [
  { name: 'Bronz', min: 0, benefit: 'Standart sabit oran' },
  { name: 'Gümüş', min: 100, benefit: 'Bozumlarda %3 ek oran' },
  { name: 'Altın', min: 250, benefit: 'Bozumlarda %5 ek oran' },
  { name: 'Platin', min: 500, benefit: 'Bozumlarda %7 ek oran' },
  { name: 'Diamond', min: 1000, benefit: 'Özel ek hediye kartı fırsatları' },
] as const;

export function getMemberLevel(points: number) { return [...memberLevels].reverse().find((level) => points >= level.min) || memberLevels[0]; }
