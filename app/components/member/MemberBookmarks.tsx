'use client';

import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import { removeBookmark } from '../../lib/bookmarks';
import MemberUtilityShell from './MemberUtilityShell';

type Bookmark = { id: string; targetId: string; title: string; href: string; createdAt: Date | null };

export default function MemberBookmarks() {
  const [items, setItems] = useState<Bookmark[]>([]);
  const [uid, setUid] = useState('');

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) return;
    let unsubscribe = () => {};
    const stop = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (!user) { setUid(''); setItems([]); return; }
      setUid(user.uid);
      unsubscribe = onSnapshot(query(collection(db, 'memberBookmarks'), where('uid', '==', user.uid)), (snapshot) => {
        setItems(snapshot.docs.map((entry) => {
          const data = entry.data();
          return { id: entry.id, targetId: String(data.targetId || ''), title: String(data.title || 'Kaydedilen içerik'), href: String(data.href || '/'), createdAt: data.createdAt?.toDate?.() ?? null };
        }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
      });
    });
    return () => { stop(); unsubscribe(); };
  }, []);

  async function remove(item: Bookmark) {
    const { db } = getFirebaseClient();
    if (!db || !uid) return;
    await removeBookmark(db, uid, item.targetId);
    setItems((current) => current.filter((entry) => entry.id !== item.id));
  }

  return <MemberUtilityShell eyebrow="KİŞİSEL ARŞİV" title="Kaydettiklerim" description="Daha sonra dönmek istediğiniz konu, rehber ve içerikleri tek yerde yönetin.">
    <div className="member-utility-list">{items.length ? items.map((item) => <article key={item.id}>
      <div className="member-utility-list__mark" aria-hidden="true">◇</div>
      <div><strong>{item.title}</strong><p>{item.createdAt?.toLocaleDateString('tr-TR') || 'Yeni kaydedildi'}</p><div><Link href={item.href}>İçeriğe git →</Link><button type="button" onClick={() => void remove(item)}>Kaldır</button></div></div>
    </article>) : <div className="member-empty-premium"><span aria-hidden="true">◇</span><h2>Henüz kaydedilen içerik yok</h2><p>Bir konu veya rehberde “Kaydet” düğmesine dokunarak kişisel arşivinizi oluşturmaya başlayın.</p><Link href="/bilgi-merkezi">İçerikleri keşfet →</Link></div>}</div>
  </MemberUtilityShell>;
}
