'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseClient } from '../lib/firebase';
import './account-access.css';

export default function AccountAccess({ mode }: { mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setReady(true), []);

  async function saveMember(user: User, displayName: string, phoneNumber = '') {
    const { db } = getFirebaseClient();
    if (!db) throw new Error('database-unavailable');
    const memberRef = doc(db, 'members', user.uid);
    if ((await getDoc(memberRef)).exists()) return;
    await setDoc(memberRef, {
      displayName: displayName.trim() || user.displayName || 'Sky Bozum üyesi',
      avatar: '',
      phone: phoneNumber.trim(),
      email: user.email || email.trim(),
      role: 'member',
      status: 'pending',
      balance: 0,
      points: 0,
      permissions: [],
      createdAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'publicProfiles', user.uid), {
      displayName: displayName.trim() || user.displayName || 'Sky Bozum üyesi',
      createdAt: serverTimestamp(),
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(''); setStatus('');
    const { auth } = getFirebaseClient();
    if (!auth) { setError('Güvenli bağlantı hazırlanamadı. Sayfayı yenileyin.'); return; }
    auth.languageCode = 'tr';

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        window.location.assign('/bilgi-merkezi');
        return;
      }

      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(result.user, { displayName: name.trim() });
      await saveMember(result.user, name, phone);
      await sendEmailVerification(result.user);
      setStatus('Kaydınız alındı. E-posta adresinize doğrulama bağlantısı gönderdik; hesabınızı bu bağlantıyla onaylayın. Telefonunuza kod gönderilmez.');
      setName(''); setPhone(''); setEmail(''); setPassword('');
    } catch (nextError) {
      const code = typeof nextError === 'object' && nextError && 'code' in nextError ? String(nextError.code) : '';
      setError(code.includes('email-already-in-use') ? 'Bu e-posta ile kayıtlı bir hesap var.' : code.includes('weak-password') ? 'Parola en az 6 karakter olmalı.' : 'İşlem tamamlanamadı. Bilgileri kontrol edip tekrar deneyin.');
    }
  }

  async function googleLogin() {
    setError(''); setStatus('');
    const { auth } = getFirebaseClient();
    if (!auth) { setError('Güvenli bağlantı hazırlanamadı.'); return; }
    auth.languageCode = 'tr';
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await saveMember(result.user, result.user.displayName || 'Google kullanıcısı');
      window.location.assign('/bilgi-merkezi');
    } catch { setError('Google ile giriş tamamlanamadı. Açılır pencereye izin verip tekrar deneyin.'); }
  }

  async function forgotPassword() {
    setError(''); setStatus('');
    if (!email.trim()) { setError('Önce e-posta adresinizi yazın.'); return; }
    const { auth } = getFirebaseClient();
    if (!auth) { setError('Güvenli bağlantı hazırlanamadı.'); return; }
    auth.languageCode = 'tr';
    try { await sendPasswordResetEmail(auth, email.trim()); setStatus('Parola yenileme bağlantısı e-posta adresinize gönderildi.'); }
    catch { setError('Parola yenileme e-postası gönderilemedi. Adresi kontrol edin.'); }
  }

  return <main className="account-page"><section className="account-card"><span>SKY BOZUM / ÜYE HESABI</span><h1>{mode === 'login' ? 'Tekrar hoş geldin.' : 'Aramıza katıl.'}</h1><p>{mode === 'login' ? 'Forum, yorumlar ve ücretsiz içeriklere sınırsız erişim.' : 'Ücretsiz hesabınızı oluşturun; telefon doğrulaması istemiyoruz.'}</p><button type="button" className="account-google" onClick={googleLogin} disabled={!ready}><b>G</b> Google ile devam et</button><div className="account-divider"><span>veya e-posta ile</span></div><form onSubmit={submit}>{mode === 'register' && <><label>Ad soyad<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={2} required /></label><label>Telefon numarası<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" minLength={10} placeholder="05xx xxx xx xx" required /><small>Numaranıza onay kodu gönderilmez.</small></label></>}<label>E-posta<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Parola<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required /></label><button type="submit" disabled={!ready}>{mode === 'login' ? 'Giriş yap' : 'Kayıt ol ve e-postamı doğrula'} <span>→</span></button></form>{mode === 'login' && <div className="account-recovery"><button type="button" onClick={forgotPassword}>Şifremi unuttum</button><button type="button" onClick={() => setStatus('Sky Bozum hesabına kullanıcı adı yerine e-posta adresinle giriş yapabilirsin.')}>Kullanıcı adımı unuttum</button></div>}{error && <p className="account-error">{error}</p>}{status && <p className="account-success">{status}</p>}<div className="account-switch">{mode === 'login' ? <>Hesabın yok mu? <Link href="/kayit">Ücretsiz kayıt ol</Link></> : <>Zaten hesabın var mı? <Link href="/giris">Giriş yap</Link></>}</div></section></main>;
}
