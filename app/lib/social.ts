import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where, type Firestore } from 'firebase/firestore';

export async function notify(db: Firestore, senderId: string, receiverId: string, type: 'profile_like'|'point_gift'|'comment_like'|'reply'|'message'|'moderation', text: string, href: string) {
  if (!receiverId || receiverId === senderId) return;
  await addDoc(collection(db, 'notifications'), { senderId, receiverId, type, text: text.slice(0, 140), href: href.slice(0, 180), read: false, createdAt: serverTimestamp() });
}

export async function likeProfile(db: Firestore, senderId: string, receiverId: string, senderName: string) {
  await setDoc(doc(db, 'profileLikes', `${senderId}_${receiverId}`), { senderId, receiverId, createdAt: serverTimestamp() });
  await notify(db, senderId, receiverId, 'profile_like', `${senderName} profilinizi beğendi.`, `/uyeler/${senderId}`);
}

export async function sendPointGift(db: Firestore, senderId: string, receiverId: string, senderName: string) {
  await setDoc(doc(db, 'pointGifts', `${senderId}_${receiverId}`), { senderId, receiverId, amount: 5, createdAt: serverTimestamp() });
  await notify(db, senderId, receiverId, 'point_gift', `${senderName} size 5 topluluk puanı gönderdi.`, `/uyeler/${senderId}`);
}

export async function sendMessage(db: Firestore, senderId: string, receiverId: string, senderName: string, body: string) {
  await addDoc(collection(db, 'messages'), { senderId, receiverId, senderName: senderName.slice(0, 80), body: body.trim().slice(0, 600), createdAt: serverTimestamp() });
  await notify(db, senderId, receiverId, 'message', `${senderName} size mesaj gönderdi.`, '/hesabim/mesajlar');
}

export async function likeComment(db: Firestore, senderId: string, commentId: string, ownerId: string, senderName: string) {
  const likeRef = doc(db, 'commentLikes', `${senderId}_${commentId}`);
  if ((await getDoc(likeRef)).exists()) return false;
  await setDoc(likeRef, { senderId, receiverId: ownerId, commentId, createdAt: serverTimestamp() });
  await notify(db, senderId, ownerId, 'comment_like', `${senderName} yorumunuzu beğendi.`, '#community').catch(() => undefined);
  return true;
}

export async function followContent(db: Firestore, uid: string, targetId: string, title: string, href: string) {
  const safeTarget = targetId.replace(/[^a-zA-Z0-9:_-]/g, '-').slice(0, 100);
  const subscriptionRef = doc(db, 'memberSubscriptions', `${uid}_${safeTarget}`);
  if ((await getDoc(subscriptionRef)).exists()) return false;
  const legacyMatches = await getDocs(query(collection(db, 'memberSubscriptions'), where('uid', '==', uid), where('targetId', '==', safeTarget)));
  if (!legacyMatches.empty) return false;
  await setDoc(subscriptionRef, { uid, targetId: safeTarget, title: title.slice(0, 120), href: href.slice(0, 180), createdAt: serverTimestamp() });
  return true;
}
