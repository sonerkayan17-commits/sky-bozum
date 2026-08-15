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

  return <div className="member-notification">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Bildirimler" aria-expanded={open}>
      ♢{unread > 0 && <b>{unread}</b>}
    </button>
    {open && <div>
      <header><strong>Bildirimler</strong><Link href="/hesabim/mesajlar">Mesajlar</Link></header>
      {items.length ? items.map((item) => <Link key={item.id} href={item.href} onClick={() => void mark(item)} className={item.read ? '' : 'unread'}>
        {item.text}<small>{item.createdAt?.toLocaleDateString('tr-TR') || 'Yeni'}</small>
      </Link>) : <p className="member-notification-empty">Yeni bildiriminiz yok.</p>}
    </div>}
  </div>;
}
