import { collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, where, type Firestore } from 'firebase/firestore';

export type MemberActivityType = 'like' | 'comment' | 'share';
export type MemberActivity = { id: string; type: MemberActivityType; targetId: string; href: string; title: string; points: number; createdAt: Date | null };
const activityPoints: Record<MemberActivityType, number> = { like: 1, comment: 2, share: 3 };

export async function recordMemberActivity(db: Firestore, uid: string, type: MemberActivityType, targetId: string, title = 'İçerik', href = '/bilgi-merkezi') {
  const safeTarget = targetId.replace(/[^a-zA-Z0-9:_-]/g, '-').slice(0, 100);
  const activityRef = doc(db, 'memberActivities', `${uid}_${type}_${safeTarget}`);
  if ((await getDoc(activityRef)).exists()) return;
  await setDoc(activityRef, { uid, type, targetId: safeTarget, title: title.slice(0, 140), href: href.slice(0, 180), points: activityPoints[type], createdAt: serverTimestamp() });
  const member = (await getDoc(doc(db, 'members', uid))).data();
  if (typeof member?.referredBy === 'string' && member.referredBy) {
    await setDoc(doc(db, 'referralRewards', `${uid}_${type}_${safeTarget}`), {
      referrerId: member.referredBy,
      refereeId: uid,
      sourceTargetId: safeTarget,
      sourcePoints: activityPoints[type],
      rewardPoints: activityPoints[type] / 10,
      createdAt: serverTimestamp(),
    });
  }
}

export function subscribeToMemberActivities(db: Firestore, uid: string, onChange: (items: MemberActivity[]) => void) {
  return onSnapshot(query(collection(db, 'memberActivities'), where('uid', '==', uid)), (snapshot) => onChange(snapshot.docs.map((item) => {
    const data = item.data();
    const type = data.type as MemberActivityType;
    return { id: item.id, type, targetId: String(data.targetId || ''), title: String(data.title || 'İçerik'), href: String(data.href || '/bilgi-merkezi'), points: activityPoints[type] || 0, createdAt: data.createdAt?.toDate?.() ?? null };
  })));
}

export const memberLevels = [
  { name: 'Bronz', min: 0, benefit: 'Standart sabit oran' },
  { name: 'Gümüş', min: 1500, benefit: 'Bozumlarda %3 ek oran' },
  { name: 'Altın', min: 5000, benefit: 'Bozumlarda %5 ek oran' },
  { name: 'Platin', min: 12000, benefit: 'Bozumlarda %7 ek oran' },
  { name: 'Diamond', min: 30000, benefit: 'Özel ek hediye kartı fırsatları' },
] as const;

export function getMemberLevel(points: number) { return [...memberLevels].reverse().find((level) => points >= level.min) || memberLevels[0]; }
