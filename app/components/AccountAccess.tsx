'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseClient } from '../lib/firebase';
import { findReferrerId, getReferralCode } from '../lib/referrals';
import { trackConversion } from '../lib/conversion';
import './account-access.css';

export default function AccountAccess({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('ref');
    if (code) window.localStorage.setItem('sky-referral-code', code.trim().toUpperCase());
    setReady(true);
  }, []);

  async function saveMember(user: User, displayName: string, phoneNumber = '') {
    const { db } = getFirebaseClient();
    if (!db) throw new Error('database-unavailable');
    const referralCode = window.localStorage.getItem('sky-referral-code') || '';
    const referredBy = referralCode ? await findReferrerId(db, referralCode) : null;
    const ownReferralCode = getReferralCode(user.uid);
    const memberRef = doc(db, 'members', user.uid);
    const memberSnapshot = await getDoc(memberRef);
    const memberName = displayName.trim() || user.displayName || 'Sky Bozum üyesi';
    const isNewMember = !memberSnapshot.exists();
    const recordedReferrer = isNewMember ? referredBy : String(memberSnapshot.data()?.referredBy || '') || null;
    if (isNewMember) await setDoc(memberRef, {
      displayName: memberName,
      avatar: '',
      phone: phoneNumber.trim(),
      email: user.email || email.trim(),
      role: 'member',
      status: 'pending',
      balance: 0,
      points: 0,
      permissions: [],
      referralCode: ownReferralCode,
      referredBy: recordedReferrer,
      createdAt: serverTimestamp(),
    });
    const profileRef = doc(db, 'publicProfiles', user.uid);
    if (!(await getDoc(profileRef)).exists()) await setDoc(profileRef, {
      avatar: '',
      referralCode: ownReferralCode,
      displayName: memberName,
      createdAt: serverTimestamp(),
    });
    if (user.emailVerified && recordedReferrer) {
      const relationRef = doc(db, 'referralRelations', user.uid);
      if (!(await getDoc(relationRef)).exists()) await setDoc(relationRef, {
        referrerId: recordedReferrer,
        refereeId: user.uid,
        refereeName: memberName,
        referralCode,
        createdAt: serverTimestamp(),
      });
      window.localStorage.removeItem('sky-referral-code');
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(''); setStatus('');
    const { auth } = getFirebaseClient();
    if (!auth) { setError('Güvenli bağlantı hazırlanamadı. Sayfayı yenileyin.'); return; }
    auth.languageCode = 'tr';
    setBusy(true);

    try {
      if (mode === 'login') {
        trackConversion('account_login_attempted', { method: 'email' });
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);
        await result.user.reload();
        if (!result.user.emailVerified) {
          await sendEmailVerification(result.user).catch(() => undefined);
          await signOut(auth);
          setStatus('E-posta doğrulamanız bekleniyor. Gelen kutunuzu kontrol edin; yeni doğrulama bağlantısı da gönderildi.');
          return;
        }
        await saveMember(result.user, result.user.displayName || email.trim().split('@')[0]);
        router.push('/bilgi-merkezi');
        return;
      }

      trackConversion('account_register_attempted', { method: 'email' });
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(result.user, { displayName: name.trim() });
      await saveMember(result.user, name, phone);
      await sendEmailVerification(result.user);
      await signOut(auth);
      setStatus('Kaydınız alındı. E-posta adresinize doğrulama bağlantısı gönderdik. Bağlantıyı onayladıktan sonra giriş yapabilirsiniz; telefonunuza kod gönderilmez.');
      setName(''); setPhone(''); setEmail(''); setPassword('');
    } catch (nextError) {
      const code = typeof nextError === 'object' && nextError && 'code' in nextError ? String(nextError.code) : '';
      setError(code.includes('email-already-in-use') ? 'Bu e-posta ile kayıtlı bir hesap var.' : code.includes('weak-password') ? 'Parola en az 6 karakter olmalı.' : code.includes('invalid-credential') || code.includes('wrong-password') ? 'E-posta veya parola doğru değil.' : code.includes('too-many-requests') ? 'Çok fazla deneme yapıldı. Lütfen kısa süre sonra tekrar deneyin.' : code.includes('network-request-failed') ? 'Bağlantı kurulamadı. İnternetinizi kontrol edip tekrar deneyin.' : 'İşlem tamamlanamadı. Bilgileri kontrol edip tekrar deneyin.');
    } finally { setBusy(false); }
  }

  async function googleLogin() {
    if (busy) return;
    setError(''); setStatus('');
    const { auth } = getFirebaseClient();
    if (!auth) { setError('Güvenli bağlantı hazırlanamadı.'); return; }
    auth.languageCode = 'tr';
    setBusy(true);
    try {
      trackConversion(mode === 'login' ? 'account_login_attempted' : 'account_register_attempted', { method: 'google' });
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await saveMember(result.user, result.user.displayName || 'Google kullanıcısı');
      router.push('/bilgi-merkezi');
    } catch { setError('Google ile giriş tamamlanamadı. Açılır pencereye izin verip tekrar deneyin.'); }
    finally { setBusy(false); }
  }

  async function forgotPassword() {
    if (busy) return;
    setError(''); setStatus('');
    if (!email.trim()) { setError('Önce e-posta adresinizi yazın.'); return; }
    const { auth } = getFirebaseClient();
    if (!auth) { setError('Güvenli bağlantı hazırlanamadı.'); return; }
    auth.languageCode = 'tr';
    setBusy(true);
    try { trackConversion('password_reset_requested', { method: 'email' }); await sendPasswordResetEmail(auth, email.trim()); setStatus('Parola yenileme bağlantısı e-posta adresinize gönderildi.'); }
    catch { setError('Parola yenileme e-postası gönderilemedi. Adresi kontrol edin.'); }
    finally { setBusy(false); }
  }

  return <main className="account-page"><div className="account-shell">
    <aside className="account-assurance">
      <Link href="/" className="account-assurance__brand"><span>SKY</span><strong>BOZUM</strong></Link>
      <p>ÜYE DENEYİMİ</p>
      <h2>İçerik, topluluk ve hesabınız tek merkezde.</h2>
      <span>Ücretsiz hesabınızla yalnızca size ait araçlara erişin; topluluk hareketlerinizi ve bildirimlerinizi düzenli biçimde takip edin.</span>
      <ul>
        <li><b>01</b><div><strong>Kişisel hesap merkezi</strong><small>Profil, görev, puan ve hareketlerinizi yönetin.</small></div></li>
        <li><b>02</b><div><strong>Topluluk katılımı</strong><small>Yorum yapın, konuları takip edin ve içerik kaydedin.</small></div></li>
        <li><b>03</b><div><strong>Kontrollü iletişim</strong><small>Bildirim ve mesajlarınıza tek alandan ulaşın.</small></div></li>
      </ul>
      <div className="account-assurance__trust"><i /> Telefonunuza kayıt onay kodu gönderilmez.</div>
    </aside>
    <section className="account-card">
      <span>SKY BOZUM / ÜYE HESABI</span>
      <h1>{mode === 'login' ? 'Tekrar hoş geldin.' : 'Aramıza katıl.'}</h1>
      <p>{mode === 'login' ? 'Forum, yorumlar ve ücretsiz içeriklere sınırsız erişim.' : 'Ücretsiz hesabınızı oluşturun; telefon doğrulaması istemiyoruz.'}</p>
      <button type="button" className="account-google" onClick={googleLogin} disabled={!ready || busy}><b>G</b> {busy ? 'İşleniyor…' : 'Google ile devam et'}</button>
      <div className="account-divider"><span>veya e-posta ile</span></div>
      <form onSubmit={submit}>
        {mode === 'register' && <><label>Ad soyad<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={2} required disabled={busy} /></label><label>Telefon numarası<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" minLength={10} placeholder="05xx xxx xx xx" required disabled={busy} /><small>Numaranıza onay kodu gönderilmez.</small></label></>}
        <label>E-posta<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required disabled={busy} /></label>
        <label>Parola<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required disabled={busy} /></label>
        <button type="submit" disabled={!ready || busy}>{busy ? 'İşleniyor…' : mode === 'login' ? 'Giriş yap' : 'Kayıt ol ve e-postamı doğrula'} <span>→</span></button>
      </form>
      {mode === 'login' && <div className="account-recovery"><button type="button" onClick={forgotPassword} disabled={busy}>Şifremi unuttum</button><button type="button" disabled={busy} onClick={() => setStatus('Sky Bozum hesabına kullanıcı adı yerine e-posta adresinle giriş yapabilirsin.')}>Kullanıcı adımı unuttum</button></div>}
      {error && <p className="account-error" role="alert">{error}</p>}{status && <p className="account-success" role="status">{status}</p>}
      <div className="account-switch">{mode === 'login' ? <>Hesabın yok mu? <Link href="/kayit">Ücretsiz kayıt ol</Link></> : <>Zaten hesabın var mı? <Link href="/giris">Giriş yap</Link></>}</div>
    </section>
  </div></main>;
}
