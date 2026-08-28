'use client';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getFirebaseClient } from '../lib/firebase';
import { forumRoutes } from '../lib/forumRoutes';

export type ForumSearchItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  href: string;
  source: 'Yönetim rehberi' | 'Üye konusu';
};

function normalize(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}

function plainText(value: unknown) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function ForumSearch({ staticItems, publicKeys }: { staticItems: ForumSearchItem[]; publicKeys: string[] }) {
  const [term, setTerm] = useState('');
  const [liveItems, setLiveItems] = useState<ForumSearchItem[]>([]);

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db || publicKeys.length === 0) return;
    return onSnapshot(query(
      collection(db, 'memberPosts'),
      where('status', '==', 'published'),
      where('visibility', '==', 'public'),
      where('forumKey', 'in', publicKeys),
    ), (snapshot) => {
      setLiveItems(snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          title: plainText(data.title) || 'Başlıksız konu',
          summary: plainText(data.body).slice(0, 180),
          category: plainText(data.subCategory || data.category) || 'Topluluk',
          href: forumRoutes.memberTopic(item.id),
          source: 'Üye konusu' as const,
        };
      }));
    }, () => setLiveItems([]));
  }, [publicKeys]);

  const results = useMemo(() => {
    const needle = normalize(term.trim());
    if (needle.length < 2) return [];
    return [...liveItems, ...staticItems].filter((item) => normalize(`${item.title} ${item.summary} ${item.category}`).includes(needle)).slice(0, 8);
  }, [liveItems, staticItems, term]);

  const active = term.trim().length >= 2;
  return <section className="forum-search" aria-labelledby="forum-search-title">
    <div className="forum-search__head">
      <div><span>TOPLULUK ARAMASI</span><h2 id="forum-search-title">Sorunuzu veya ürün adını arayın.</h2></div>
      <label><span className="sr-only">Forum konularında ara</span><input type="search" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Örn. Razer kodu geçersiz, Paycell beklemede…" /></label>
    </div>
    {active ? <div className="forum-search__results" aria-live="polite">
      {results.length ? results.map((item) => <Link key={`${item.source}-${item.id}`} href={item.href}>
        <div><small>{item.source} · {item.category}</small><strong>{item.title}</strong><p>{item.summary}</p></div><b aria-hidden="true">→</b>
      </Link>) : <p className="forum-search__empty">Bu ifadeyle eşleşen yayınlanmış konu bulunamadı. <Link href="/hesabim/yeni-konu">Yeni konu açabilirsiniz.</Link></p>}
    </div> : null}
  </section>;
}
