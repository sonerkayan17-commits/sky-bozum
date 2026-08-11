'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseClient } from '../lib/firebase';
import './account-access.css';

export default function AccountAccess({ mode }: { mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setReady(true), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(''); setStatus('');
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) { setError('Güvenli bağlantı hazırlanamadı. Sayfayı yenileyin.'); return; }

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        window.location.assign('/yonetim');
        return;
      }

      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, 'members', result.user.uid), {
        displayName: name.trim(),
        email: email.trim(),
        role: 'member',
        status: 'pending',
        balance: 0,
        points: 0,
        permissions: [],
        createdAt: serverTimestamp(),
      });
      setStatus('Kaydınız alındı. Yönetici onayı sonrasında hesabınız etkinleşir.');
      setName(''); setEmail(''); setPassword('');
    } catch (nextError) {
      const code = typeof nextError === 'object' && nextError && 'code' in nextError ? String(nextError.code) : '';
      setError(code.includes('email-already-in-use') ? 'Bu e-posta ile kayıtlı bir hesap var.' : code.includes('weak-password') ? 'Parola en az 6 karakter olmalı.' : 'İşlem tamamlanamadı. Bilgileri kontrol edip tekrar deneyin.');
    }
  }

  return <main className="account-page"><section className="account-card"><span>SKY BOZUM / HESAP</span><h1>{mode === 'login' ? 'Hesabına dön.' : 'Hesabını oluştur.'}</h1><p>{mode === 'login' ? 'Yönetim ve üye alanlarına güvenli erişim.' : 'Kayıt sonrası hesabınız yönetici onayına alınır.'}</p><form onSubmit={submit}>{mode === 'register' && <label>Ad soyad<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={2} required /></label>}<label>E-posta<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Parola<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required /></label><button type="submit" disabled={!ready}>{mode === 'login' ? 'Giriş yap' : 'Kayıt ol'} <span>→</span></button></form>{error && <p className="account-error">{error}</p>}{status && <p className="account-success">{status}</p>}<div className="account-switch">{mode === 'login' ? <>Hesabın yok mu? <Link href="/kayit">Kayıt ol</Link></> : <>Zaten hesabın var mı? <Link href="/giris">Giriş yap</Link></>}</div></section></main>;
}
