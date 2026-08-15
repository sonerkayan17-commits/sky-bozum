'use client';

import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import MemberUtilityShell from './MemberUtilityShell';

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

  return <MemberUtilityShell eyebrow="TAKİP MERKEZİ" title="Aboneliklerim" description="Takip ettiğiniz konu ve içeriklerdeki yeni hareketlere kolayca geri dönün.">
    <div className="member-utility-tabs" role="navigation" aria-label="Arşiv türü"><Link href="/hesabim/abonelikler" aria-current="page">Takip ettiklerim</Link><Link href="/hesabim/kaydedilenler">Kaydettiklerim</Link></div>
    <div className="member-utility-list">{items.length ? items.map((item) => <article key={item.id}>
      <div className="member-utility-list__mark" aria-hidden="true">↻</div><div><strong>{item.title}</strong><p>Yeni yanıtları ve yorumları takip edin.</p><Link href={item.href}>Konuya git →</Link></div>
    </article>) : <div className="member-empty-premium"><span aria-hidden="true">↻</span><h2>Henüz aboneliğiniz yok</h2><p>Bilgi Merkezi veya topluluk içeriklerinde “Takip et” seçeneğini kullanarak güncellemeleri burada toplayın.</p><Link href="/bilgi-merkezi">İçerikleri keşfet →</Link></div>}</div>
  </MemberUtilityShell>;
}
