'use client';

import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';

type Item = { id: string; title: string; href: string };

export default function MemberSubscriptions() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) return;
    let unsubscribe = () => {};
    const stop = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (!user) { setItems([]); return; }
      unsubscribe = onSnapshot(query(collection(db, 'memberSubscriptions'), where('uid', '==', user.uid)), (snapshot) => setItems(snapshot.docs.map((entry) => ({ id: entry.id, title: String(entry.data().title || 'Takip edilen içerik'), href: String(entry.data().href || '/') }))));
    });
    return () => { stop(); unsubscribe(); };
  }, []);

  return <main className="utility-page"><section><p>TAKİP MERKEZİ</p><h1>Aboneliklerim</h1><span>Takip ettiğiniz konu ve mesaj hareketlerine buradan dönün.</span><nav className="mt-6 flex gap-3 text-sm font-bold"><Link href="/hesabim/abonelikler" className="rounded-lg border border-rose-400/40 px-4 py-2 text-rose-300">Takip ettiklerim</Link><Link href="/hesabim/kaydedilenler" className="rounded-lg border border-white/10 px-4 py-2 text-slate-300">Kaydettiklerim</Link></nav><div className="utility-list">{items.length ? items.map((item) => <article key={item.id}><strong>{item.title}</strong><p>Yeni yanıtları ve yorumları takip edin.</p><Link href={item.href}>Konuya git →</Link></article>) : <article><strong>Henüz aboneliğiniz yok</strong><p>Bilgi Merkezi içeriklerinde “Takip et” düğmesini kullanın.</p><Link href="/bilgi-merkezi">İçerikleri keşfet →</Link></article>}</div></section></main>;
}
