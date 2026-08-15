'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import MemberUtilityShell from './MemberUtilityShell';

type Message = { id: string; senderId: string; receiverId: string; senderName: string; body: string; createdAt: Date | null };

export default function MemberMessages() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Message[]>([]);

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) return;
    let incoming = () => {};
    let outgoing = () => {};
    const stop = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser); incoming(); outgoing();
      if (!nextUser) return;
      const collect = (snapshot: any) => setItems((current) => {
        const map = new Map(current.map((item) => [item.id, item]));
        snapshot.docs.forEach((item: any) => {
          const data = item.data();
          map.set(item.id, { id: item.id, senderId: String(data.senderId), receiverId: String(data.receiverId), senderName: String(data.senderName || 'Üye'), body: String(data.body || ''), createdAt: data.createdAt?.toDate?.() ?? null });
        });
        return [...map.values()].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      });
      incoming = onSnapshot(query(collection(db, 'messages'), where('receiverId', '==', nextUser.uid)), collect);
      outgoing = onSnapshot(query(collection(db, 'messages'), where('senderId', '==', nextUser.uid)), collect);
    });
    return () => { stop(); incoming(); outgoing(); };
  }, []);

  if (!user) return <main className="member-loading"><div><h1>Mesajlar için üye girişi gerekli.</h1><p>Özel mesajlarınızı görüntülemek için hesabınıza giriş yapın.</p><Link href="/giris">Giriş yap</Link></div></main>;

  return <MemberUtilityShell eyebrow="ÜYE İLETİŞİMİ" title="Mesaj kutusu" description="Üyeler ve yönetim ekibiyle yaptığınız özel görüşmeleri güvenli hesap alanınızdan takip edin.">
    <div className="member-message-list">{items.length ? items.map((item) => <article key={item.id}>
      <div className="member-message-list__avatar" aria-hidden="true">{(item.senderId === user.uid ? 'S' : item.senderName.charAt(0)).toUpperCase()}</div>
      <div><header><strong>{item.senderId === user.uid ? 'Gönderildi' : item.senderName}</strong><small>{item.createdAt?.toLocaleDateString('tr-TR') || 'Yeni'}</small></header><p>{item.body}</p>{item.senderId !== user.uid && <Link href={`/uyeler/${item.senderId}`}>Profile git ve yanıtla →</Link>}</div>
    </article>) : <div className="member-empty-premium"><span aria-hidden="true">✉</span><h2>Henüz mesajınız bulunmuyor</h2><p>Toplulukta bir üyenin profiline giderek güvenli bir özel mesaj başlatabilirsiniz.</p><Link href="/topluluk">Topluluğu keşfet →</Link></div>}</div>
  </MemberUtilityShell>;
}
