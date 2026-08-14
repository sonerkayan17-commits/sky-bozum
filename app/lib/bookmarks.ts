import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';

export function bookmarkKey(uid: string, targetId: string) {
  const safeUid = uid.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80);
  const safeTarget = targetId.replace(/[^a-zA-Z0-9:_-]/g, '-').slice(0, 120);
  return `${safeUid}_${safeTarget}`;
}

export async function isBookmarked(db: Firestore, uid: string, targetId: string) {
  return (await getDoc(doc(db, 'memberBookmarks', bookmarkKey(uid, targetId)))).exists();
}

export async function saveBookmark(db: Firestore, uid: string, targetId: string, title: string, href: string) {
  await setDoc(doc(db, 'memberBookmarks', bookmarkKey(uid, targetId)), {
    uid,
    targetId: targetId.slice(0, 120),
    title: title.slice(0, 140),
    href: href.slice(0, 180),
    createdAt: serverTimestamp(),
  });
}

export async function removeBookmark(db: Firestore, uid: string, targetId: string) {
  await deleteDoc(doc(db, 'memberBookmarks', bookmarkKey(uid, targetId)));
}
