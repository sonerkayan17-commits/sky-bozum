'use client';

import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import { removeBookmark } from '../../lib/bookmarks';

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

  return <main className="utility-page"><section><p>KİŞİSEL ARŞİV</p><h1>Kaydettiklerim</h1><span>Daha sonra dönmek istediğiniz konu, rehber ve içerikler burada tutulur.</span><div className="utility-list">{items.length ? items.map((item) => <article key={item.id}><strong>{item.title}</strong><p>{item.createdAt?.toLocaleDateString('tr-TR') || 'Yeni kaydedildi'}</p><div><Link href={item.href}>İçeriğe git →</Link><button type="button" onClick={() => void remove(item)}>Kaldır</button></div></article>) : <article><strong>Henüz kaydedilen içerik yok</strong><p>Bir konu veya rehberde “Kaydet” düğmesine dokunarak kişisel arşivinize ekleyin.</p><Link href="/bilgi-merkezi">İçerikleri keşfet →</Link></article>}</div></section></main>;
}
