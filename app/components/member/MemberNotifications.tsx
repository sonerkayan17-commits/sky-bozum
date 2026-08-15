'use client';

import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';

type Notice = { id: string; text: string; href: string; read: boolean; createdAt: Date | null };

export default function MemberNotifications() {
  const [items, setItems] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) return;
    let stopItems = () => {};
    const stopAuth = onAuthStateChanged(auth, (user) => {
      stopItems();
      setSignedIn(Boolean(user));
      setOpen(false);
      if (!user) { setItems([]); return; }
      stopItems = onSnapshot(
        query(collection(db, 'notifications'), where('receiverId', '==', user.uid)),
        (snapshot) => setItems(snapshot.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            text: String(data.text || 'Yeni bildirim'),
            href: String(data.href || '/hesabim'),
            read: Boolean(data.read),
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)).slice(0, 8)),
        () => setItems([]),
      );
    });
    return () => { stopAuth(); stopItems(); };
  }, []);

  const unread = items.filter((item) => !item.read).length;

  async function mark(item: Notice) {
    const { db } = getFirebaseClient();
    if (db && !item.read) await updateDoc(doc(db, 'notifications', item.id), { read: true });
    setOpen(false);
  }

  if (!signedIn) return null;

  return (
    <div className="member-notification">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Bildirimler" aria-expanded={open}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8ZM10 21h4" /></svg>
        {unread > 0 && <b>{unread}</b>}
      </button>
      {open && <div className="member-notification__panel">
        <header><div><span>BİLDİRİM MERKEZİ</span><strong>Bildirimler</strong></div><Link href="/hesabim/mesajlar">Mesajlar →</Link></header>
        {items.length ? <div className="member-notification__list">{items.map((item) => <Link key={item.id} href={item.href} onClick={() => void mark(item)} className={item.read ? '' : 'unread'}>
          <i aria-hidden="true" />
          <span>{item.text}<small>{item.createdAt?.toLocaleDateString('tr-TR') || 'Yeni'}</small></span>
        </Link>)}</div> : <div className="member-notification-empty"><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12 2.2 2.2L16 9M12 3l7 3v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3Z" /></svg></span><strong>Her şey güncel</strong><p>Yeni bildirim veya yanıt geldiğinde burada göreceksiniz.</p></div>}
      </div>}
    </div>
  );
}
