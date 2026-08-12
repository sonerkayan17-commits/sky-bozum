import { addDoc, collection, doc, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';

export async function notify(db: Firestore, senderId: string, receiverId: string, type: 'profile_like'|'point_gift'|'comment_like'|'reply'|'message', text: string, href: string) {
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
  await setDoc(doc(db, 'commentLikes', `${senderId}_${commentId}`), { senderId, receiverId: ownerId, commentId, createdAt: serverTimestamp() });
  await notify(db, senderId, ownerId, 'comment_like', `${senderName} yorumunuzu beğendi.`, '#community');
}
