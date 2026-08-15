import { doc, getDoc, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';

export type ReportTargetType = 'comment' | 'forum_post';

function reportId(uid: string, targetType: ReportTargetType, targetId: string) {
  return `${uid}_${targetType}_${targetId}`;
}

export async function hasReportedContent(db: Firestore, uid: string, targetType: ReportTargetType, targetId: string) {
  return (await getDoc(doc(db, 'contentReports', reportId(uid, targetType, targetId)))).exists();
}

export async function reportContent(db: Firestore, uid: string, targetType: ReportTargetType, targetId: string, reason: string) {
  const reportRef = doc(db, 'contentReports', reportId(uid, targetType, targetId));
  if ((await getDoc(reportRef)).exists()) return false;
  await setDoc(reportRef, { targetType, targetId, reporterId: uid, reason: reason.slice(0, 240), status: 'open', createdAt: serverTimestamp() });
  return true;
}
