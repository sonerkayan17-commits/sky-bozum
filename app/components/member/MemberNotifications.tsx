'use client';

import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';

type Notice = { id: string; type: string; text: string; href: string; read: boolean; createdAt: Date | null };
type NoticePreferences = { social: boolean; messages: boolean; stock: boolean };

const defaultPreferences: NoticePreferences = { social: true, messages: true, stock: true };

function preferenceKey(type: string): keyof NoticePreferences | null {
  if (type === 'stock_available') return 'stock';
  if (type === 'message') return 'messages';
  if (['profile_like', 'point_gift', 'comment_like', 'reply'].includes(type)) return 'social';
  return null;
}

export default function MemberNotifications() {
  const [items, setItems] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState<NoticePreferences>(defaultPreferences);
  const [savingPreferences, setSavingPreferences] = useState(false);

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) return;
    let stopItems = () => {};
    let stopPreferences = () => {};
    const stopAuth = onAuthStateChanged(auth, (user) => {
      stopItems();
      stopPreferences();
      setSignedIn(Boolean(user));
      setUserId(user?.uid || '');
      setOpen(false);
      setSettingsOpen(false);
      if (!user) { setItems([]); setPreferences(defaultPreferences); return; }
      stopPreferences = onSnapshot(doc(db, 'notificationPreferences', user.uid), (snapshot) => {
        const data = snapshot.data();
        setPreferences({ social: data?.social !== false, messages: data?.messages !== false, stock: data?.stock !== false });
      }, () => setPreferences(defaultPreferences));
      stopItems = onSnapshot(
        query(collection(db, 'notifications'), where('receiverId', '==', user.uid)),
        (snapshot) => setItems(snapshot.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            type: String(data.type || 'general'),
            text: String(data.text || 'Yeni bildirim'),
            href: String(data.href || '/hesabim'),
            read: Boolean(data.read),
            createdAt: data.createdAt?.toDate?.() ?? null,
          };
        }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)).slice(0, 8)),
        () => setItems([]),
      );
    });
    return () => { stopAuth(); stopItems(); stopPreferences(); };
  }, []);

  const visibleItems = items.filter((item) => {
    const key = preferenceKey(item.type);
    return key ? preferences[key] : true;
  });
  const unread = visibleItems.filter((item) => !item.read).length;

  async function mark(item: Notice) {
    const { db } = getFirebaseClient();
    if (db && !item.read) await updateDoc(doc(db, 'notifications', item.id), { read: true });
    setOpen(false);
  }

  async function togglePreference(key: keyof NoticePreferences) {
    if (!userId || savingPreferences) return;
    const previous = preferences;
    const next = { ...preferences, [key]: !preferences[key] };
    setPreferences(next);
    setSavingPreferences(true);
    try {
      const { db } = getFirebaseClient();
      if (!db) throw new Error('Bildirim bağlantısı yok.');
      await setDoc(doc(db, 'notificationPreferences', userId), { userId, ...next, updatedAt: serverTimestamp() });
    } catch {
      setPreferences(previous);
    } finally {
      setSavingPreferences(false);
    }
  }

  if (!signedIn) return null;

  return (
    <div className="member-notification">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Bildirimler" aria-expanded={open}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8ZM10 21h4" /></svg>
        {unread > 0 && <b>{unread}</b>}
      </button>
      {open && <div className="member-notification__panel">
        <header><div><span>BİLDİRİM MERKEZİ</span><strong>Bildirimler</strong></div><div className="member-notification__links"><button type="button" onClick={() => setSettingsOpen((value) => !value)} aria-expanded={settingsOpen}>Tercihler</button><Link href="/hesabim/mesajlar">Mesajlar →</Link></div></header>
        {settingsOpen ? <section className="member-notification__preferences" aria-label="Bildirim tercihleri">
          <p>İşlem, ödeme ve güvenlik bildirimleri hesap güvenliği için daima açıktır.</p>
          <label><span><b>Sosyal bildirimler</b><small>Beğeni, yanıt ve puan hareketleri</small></span><input type="checkbox" checked={preferences.social} disabled={savingPreferences} onChange={() => void togglePreference('social')} /></label>
          <label><span><b>Mesaj bildirimleri</b><small>Üyelerden ve yönetimden gelen mesajlar</small></span><input type="checkbox" checked={preferences.messages} disabled={savingPreferences} onChange={() => void togglePreference('messages')} /></label>
          <label><span><b>Stok bildirimleri</b><small>Takip ettiğiniz paket yeniden açıldığında</small></span><input type="checkbox" checked={preferences.stock} disabled={savingPreferences} onChange={() => void togglePreference('stock')} /></label>
        </section> : null}
        {visibleItems.length ? <div className="member-notification__list">{visibleItems.map((item) => <Link key={item.id} href={item.href} onClick={() => void mark(item)} className={item.read ? '' : 'unread'}>
          <i aria-hidden="true" />
          <span>{item.text}<small>{item.createdAt?.toLocaleDateString('tr-TR') || 'Yeni'}</small></span>
        </Link>)}</div> : <div className="member-notification-empty"><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12 2.2 2.2L16 9M12 3l7 3v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3Z" /></svg></span><strong>Her şey güncel</strong><p>Yeni bildirim veya yanıt geldiğinde burada göreceksiniz.</p></div>}
      </div>}
    </div>
  );
}
