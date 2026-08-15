'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState, type FormEvent } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import MemberUtilityShell from './MemberUtilityShell';

export default function MemberBankInfo() {
  const [ready, setReady] = useState(false);
  const [name, setName] = useState('');
  const [bank, setBank] = useState('');
  const [iban, setIban] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) { setReady(true); return; }
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { setReady(true); return; }
      const snapshot = await getDoc(doc(db, 'memberPrivate', user.uid));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setName(String(data.accountHolder || ''));
        setBank(String(data.bankName || ''));
        setIban(String(data.iban || ''));
      }
      setReady(true);
    });
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    const { auth, db } = getFirebaseClient();
    if (!auth?.currentUser || !db) return;
    await setDoc(doc(db, 'memberPrivate', auth.currentUser.uid), {
      accountHolder: name.trim(),
      bankName: bank.trim(),
      iban: iban.replace(/\s/g, '').toUpperCase(),
      updatedAt: serverTimestamp(),
    });
    setNotice('Banka bilgileriniz güvenle kaydedildi.');
  }

  if (!ready) return <main className="member-loading"><div><span className="member-loading__signal" /><h1>Hesap alanınız hazırlanıyor.</h1><p>Güvenli bilgileriniz yükleniyor.</p></div></main>;

  return <MemberUtilityShell eyebrow="ÖZEL HESAP ALANI" title="Banka bilgilerim" description="Ödeme bilgileriniz yalnızca size ve yetkili yöneticilere görünür.">
    <div className="member-privacy-note"><span aria-hidden="true">✓</span><div><strong>Özel ve kontrollü</strong><p>IBAN bilginiz topluluk profilinizde veya herkese açık alanlarda gösterilmez.</p></div></div>
    <form className="member-utility-form" onSubmit={save}>
      <label>Hesap sahibi<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} autoComplete="name" /></label>
      <label>Banka adı<input value={bank} onChange={(event) => setBank(event.target.value)} required autoComplete="organization" /></label>
      <label>IBAN<input value={iban} onChange={(event) => setIban(event.target.value)} required pattern="TR[0-9 ]{24,32}" placeholder="TR00 0000 0000 0000 0000 0000 00" autoComplete="off" /></label>
      <button>Bilgileri kaydet <span aria-hidden="true">→</span></button>
    </form>
    {notice && <p className="member-utility-notice" role="status">{notice}</p>}
  </MemberUtilityShell>;
}
