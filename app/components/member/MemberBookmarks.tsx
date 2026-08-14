'use client';

import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';

type Bookmark = { id: string; title: string; href: string; createdAt: Date | null };

export default function MemberBookmarks() {
  const [items, setItems] = useState<Bookmark[]>([]);

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) return;
    let unsubscribe = () => {};
    const stop = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (!user) { setItems([]); return; }
      unsubscribe = onSnapshot(query(collection(db, 'memberBookmarks'), where('uid', '==', user.uid)), (snapshot) => {
        setItems(snapshot.docs.map((entry) => {
          const data = entry.data();
          return { id: entry.id, title: String(data.title || 'Kaydedilen içerik'), href: String(data.href || '/'), createdAt: data.createdAt?.toDate?.() ?? null };
        }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
      });
    });
    return () => { stop(); unsubscribe(); };
  }, []);

  return <main className="utility-page"><section><p>KİŞİSEL ARŞİV</p><h1>Kaydettiklerim</h1><span>Daha sonra dönmek istediğiniz konu, rehber ve içerikler burada tutulur.</span><div className="utility-list">{items.length ? items.map((item) => <article key={item.id}><strong>{item.title}</strong><p>{item.createdAt?.toLocaleDateString('tr-TR') || 'Yeni kaydedildi'}</p><Link href={item.href}>İçeriğe git →</Link></article>) : <article><strong>Henüz kaydedilen içerik yok</strong><p>Bir konu veya rehberde “Kaydet” düğmesine dokunarak kişisel arşivinize ekleyin.</p><Link href="/bilgi-merkezi">İçerikleri keşfet →</Link></article>}</div></section></main>;
}
