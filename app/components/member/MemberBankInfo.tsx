'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import MemberUtilityShell from './MemberUtilityShell';
import './member-commerce.css';

const commonBanks = ['Akbank', 'DenizBank', 'Garanti BBVA', 'Halkbank', 'ING', 'İş Bankası', 'Kuveyt Türk', 'QNB', 'TEB', 'VakıfBank', 'Yapı Kredi', 'Ziraat Bankası'];

function validTurkishIban(value: string) {
  const clean = value.replace(/\s/g, '').toUpperCase();
  if (!/^TR\d{24}$/.test(clean)) return false;
  const numeric = `${clean.slice(4)}${clean.slice(0, 4)}`.replace(/[A-Z]/g, (letter) => String(letter.charCodeAt(0) - 55));
  let remainder = 0;
  for (const digit of numeric) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}

function formatIban(value: string) {
  return value.replace(/\s/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim();
}

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
    const normalizedIban = iban.replace(/\s/g, '').toUpperCase();
    if (!validTurkishIban(normalizedIban)) { setNotice('IBAN geçerli bir Türkiye IBAN’ı değil. 26 karakteri ve kontrol hanesini doğrulayın.'); return; }
    try {
      await setDoc(doc(db, 'memberPrivate', auth.currentUser.uid), { accountHolder: name.trim(), bankName: bank.trim(), iban: normalizedIban, updatedAt: serverTimestamp() });
      setIban(formatIban(normalizedIban));
      setNotice('Banka bilgileriniz güvenle kaydedildi ve IBAN ödeme seçeneği açıldı.');
    } catch { setNotice('Banka bilgileri kaydedilemedi. Hesap durumunuzu ve bağlantınızı kontrol edin.'); }
  }

  if (!ready) return <main className="member-loading"><div><span className="member-loading__signal" /><h1>Hesap alanınız hazırlanıyor.</h1><p>Güvenli bilgileriniz yükleniyor.</p></div></main>;

  return <MemberUtilityShell eyebrow="ÖZEL HESAP ALANI" title="Banka bilgilerim" description="Ödeme bilgileriniz yalnızca size ve yetkili yöneticilere görünür.">
    <section className="member-bank-payout-info"><div><span>RAZER GOLD KOD SATIŞI</span><strong>Onaylanan ödemenizi kayıtlı IBAN’ınıza alın.</strong><p>Yönetici kodları tek tek doğrular, net tutarı onaylar ve banka transfer referansını işlem kaydınıza ekler.</p></div><Link href="/hesabim/talepler?service=razer-gold-tl">Kod satışı başlat →</Link></section>
    <div className="member-privacy-note"><span aria-hidden="true">✓</span><div><strong>Özel ve kontrollü</strong><p>IBAN bilginiz topluluk profilinizde veya herkese açık alanlarda gösterilmez.</p></div></div>
    <form className="member-utility-form" onSubmit={save}>
      <label>Hesap sahibi<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} autoComplete="name" /></label>
      <label>Banka adı<input value={bank} onChange={(event) => setBank(event.target.value)} required autoComplete="organization" list="sky-bank-list" /><datalist id="sky-bank-list">{commonBanks.map((item) => <option value={item} key={item} />)}</datalist></label>
      <label>IBAN<input value={iban} onChange={(event) => setIban(formatIban(event.target.value))} required maxLength={32} pattern="TR[0-9 ]{24,30}" placeholder="TR00 0000 0000 0000 0000 0000 00" autoComplete="off" /><small>Yalnız size ait, TR ile başlayan 26 karakterli IBAN kabul edilir.</small></label>
      <button>Bilgileri kaydet <span aria-hidden="true">→</span></button>
    </form>
    {notice && <p className="member-utility-notice" role="status">{notice}</p>}
  </MemberUtilityShell>;
}
