import { addDoc, collection, doc, getDoc, getDocs, increment, query, serverTimestamp, setDoc, where, writeBatch, type Firestore } from 'firebase/firestore';

export async function notify(db: Firestore, senderId: string, receiverId: string, type: 'profile_like'|'point_gift'|'comment_like'|'reply'|'message'|'moderation', text: string, href: string) {
  if (!receiverId || receiverId === senderId) return;
  await addDoc(collection(db, 'notifications'), { senderId, receiverId, type, text: text.slice(0, 140), href: href.slice(0, 180), read: false, createdAt: serverTimestamp() });
}

export async function likeProfile(db: Firestore, senderId: string, receiverId: string, senderName: string) {
  const likeRef = doc(db, 'profileLikes', `${senderId}_${receiverId}`);
  if ((await getDoc(likeRef)).exists()) return false;
  await setDoc(likeRef, { senderId, receiverId, createdAt: serverTimestamp() });
  await notify(db, senderId, receiverId, 'profile_like', `${senderName} profilinizi beğendi.`, `/uyeler/${senderId}`).catch(() => undefined);
  return true;
}

export async function sendPointGift(db: Firestore, senderId: string, receiverId: string, senderName: string) {
  const giftId = `${senderId}_${receiverId}`;
  const giftRef = doc(db, 'pointGifts', giftId);
  const senderRef = doc(db, 'members', senderId);
  const receiverRef = doc(db, 'members', receiverId);
  const senderLedgerRef = doc(db, 'memberLedger', `gift-${giftId}-sender`);
  const receiverLedgerRef = doc(db, 'memberLedger', `gift-${giftId}-receiver`);
  const notificationRef = doc(collection(db, 'notifications'));
  const [gift, sender] = await Promise.all([getDoc(giftRef), getDoc(senderRef)]);
  if (gift.exists()) return false;
  if (!sender.exists() || sender.data().status !== 'active') throw new Error('Aktif üye kaydı bulunamadı.');
  const senderPoints = Math.max(0, Math.trunc(Number(sender.data().points) || 0));
  if (senderPoints < 5) throw new Error('Puan göndermek için en az 5 puanınız olmalı.');
  const timestamp = serverTimestamp();
  const batch = writeBatch(db);
  batch.update(senderRef, { points: senderPoints - 5, lastPointGiftId: giftId, updatedAt: timestamp });
  batch.update(receiverRef, { points: increment(5), lastPointGiftId: giftId, updatedAt: timestamp });
  batch.set(giftRef, { senderId, receiverId, amount: 5, createdAt: timestamp });
  batch.set(senderLedgerRef, { memberId: senderId, kind: 'points', amount: -5, balanceAfter: senderPoints - 5, note: 'Bir üyeye topluluk puanı gönderildi', performedBy: senderId, giftId, createdAt: timestamp });
  batch.set(receiverLedgerRef, { memberId: receiverId, kind: 'points', amount: 5, note: `${senderName} size topluluk puanı gönderdi`, performedBy: senderId, giftId, createdAt: timestamp });
  batch.set(notificationRef, { senderId, receiverId, type: 'point_gift', text: `${senderName} size 5 topluluk puanı gönderdi.`, href: `/uyeler/${senderId}`, read: false, createdAt: timestamp });
  await batch.commit();
  return true;
}

export async function sendMessage(db: Firestore, senderId: string, receiverId: string, senderName: string, body: string) {
  await addDoc(collection(db, 'messages'), { senderId, receiverId, senderName: senderName.slice(0, 80), body: body.trim().slice(0, 600), createdAt: serverTimestamp() });
  await notify(db, senderId, receiverId, 'message', `${senderName} size mesaj gönderdi.`, '/hesabim/mesajlar').catch(() => undefined);
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
  // Eski serbest belge kimlikleri varsa ikinci kez abonelik açmamak isteriz.
  // Bu geri uyumluluk sorgusu indeks/erişim sorunu yaşarsa, zaten benzersiz
  // belge kimliğiyle korunan güncel abonelik akışını engellememelidir.
  const legacyMatches = await getDocs(
    query(collection(db, 'memberSubscriptions'), where('uid', '==', uid), where('targetId', '==', safeTarget)),
  ).catch(() => null);
  if (legacyMatches && !legacyMatches.empty) return false;
  await setDoc(subscriptionRef, { uid, targetId: safeTarget, title: title.slice(0, 120), href: href.slice(0, 180), createdAt: serverTimestamp() });
  return true;
}

export async function isFollowingContent(db: Firestore, uid: string, targetId: string) {
  const safeTarget = targetId.replace(/[^a-zA-Z0-9:_-]/g, '-').slice(0, 100);
  return (await getDoc(doc(db, 'memberSubscriptions', `${uid}_${safeTarget}`))).exists();
}
