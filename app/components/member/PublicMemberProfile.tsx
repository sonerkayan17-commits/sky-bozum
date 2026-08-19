'use client';

import Link from 'next/link';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useEffect, useState, type FormEvent } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import { getReferralCode, getReferralLink } from '../../lib/referrals';
import { recordProfileVisit, subscribeToProfileVisitors, type ProfileVisitor } from '../../lib/profileVisits';
import { likeProfile, sendMessage, sendPointGift } from '../../lib/social';

type ReferralMember = { id: string; name: string };

export default function PublicMemberProfile({ memberId }: { memberId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('Sky Bozum üyesi');
  const [avatar, setAvatar] = useState('');
  const [likes, setLikes] = useState(0);
  const [gifts, setGifts] = useState(0);
  const [views, setViews] = useState(0);
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<ReferralMember[]>([]);
  const [referralPoints, setReferralPoints] = useState(0);
  const [referredByName, setReferredByName] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [profileAction, setProfileAction] = useState<'like' | 'gift' | null>(null);
  const [likedProfile, setLikedProfile] = useState(false);
  const [giftSent, setGiftSent] = useState(false);

  useEffect(() => {
    setProfileAction(null);
    setLikedProfile(false);
    setGiftSent(false);
  }, [memberId]);

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) return;
    let stopVisitors: (() => void) | undefined;
    let stopRelations: (() => void) | undefined;
    let stopRewards: (() => void) | undefined;
    let stopLikes: (() => void) | undefined;
    let stopGifts: (() => void) | undefined;
    const loadProfile = async (nextUser: User | null) => {
      const profile = await getDoc(doc(db, 'publicProfiles', memberId));
      const profileData = profile.data() || {};
      const profileName = String(profileData.displayName || 'Sky Bozum üyesi');
      const profileAvatar = String(profileData.avatar || '');
      setName(profileName);
      setAvatar(profileAvatar);
      setReferralCode(String(profileData.referralCode || ''));
      stopLikes = onSnapshot(query(collection(db, 'profileLikes'), where('receiverId', '==', memberId)), (snapshot) => setLikes(snapshot.size), () => setLikes(0));
      if (nextUser?.uid === memberId) {
        stopGifts = onSnapshot(query(collection(db, 'pointGifts'), where('receiverId', '==', memberId)), (snapshot) => {
          setGifts(snapshot.docs.reduce((total, item) => total + Number(item.data().amount || 0), 0));
        }, () => setGifts(0));
        const ownMember = await getDoc(doc(db, 'members', memberId));
        const referredBy = String(ownMember.data()?.referredBy || '');
        if (referredBy) {
          const referrerProfile = await getDoc(doc(db, 'publicProfiles', referredBy));
          setReferredByName(String(referrerProfile.data()?.displayName || 'Bir üye'));
        }
        if (!profileData.referralCode) {
          const ownReferralCode = getReferralCode(memberId);
          await setDoc(doc(db, 'publicProfiles', memberId), { displayName: profileName, avatar: profileAvatar, referralCode: ownReferralCode, createdAt: serverTimestamp() });
          setReferralCode(ownReferralCode);
        }
      }
      if (nextUser?.uid === memberId) {
        stopVisitors = subscribeToProfileVisitors(db, memberId, (items, count) => { setVisitors(items); setViews(count); }, () => undefined);
      }

      if (nextUser && nextUser.uid !== memberId) {
        const visitorProfile = await getDoc(doc(db, 'publicProfiles', nextUser.uid));
        await recordProfileVisit(db, memberId, {
          id: nextUser.uid,
          name: nextUser.displayName || nextUser.email?.split('@')[0] || 'Bir üye',
          avatar: String(visitorProfile.data()?.avatar || ''),
        }).catch(() => undefined);
      }

      if (nextUser?.uid === memberId) {
        stopRelations = onSnapshot(query(collection(db, 'referralRelations'), where('referrerId', '==', memberId)), (snapshot) => {
          setReferrals(snapshot.docs.map((item) => ({ id: String(item.data().refereeId || item.id), name: String(item.data().refereeName || 'Sky Bozum üyesi') })));
        }, () => undefined);
        stopRewards = onSnapshot(query(collection(db, 'referralRewards'), where('referrerId', '==', memberId)), (snapshot) => {
          setReferralPoints(snapshot.docs.reduce((sum, item) => sum + Number(item.data().rewardPoints || 0), 0));
        }, () => undefined);
      }
    };
    const stopAuth = onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); void loadProfile(nextUser); });
    return () => { stopAuth(); stopVisitors?.(); stopRelations?.(); stopRewards?.(); stopLikes?.(); stopGifts?.(); };
  }, [memberId]);

  const senderName = user?.displayName || user?.email?.split('@')[0] || 'Bir üye';
  const referralLink = user?.uid === memberId && referralCode ? getReferralLink(memberId) : '';
  const isOwnProfile = user?.uid === memberId;

  async function act(kind: 'like' | 'gift') {
    const { db } = getFirebaseClient();
    if (!user || !db) { location.assign('/giris'); return; }
    if (profileAction || (kind === 'like' && likedProfile) || (kind === 'gift' && giftSent)) return;
    setProfileAction(kind);
    try {
      if (kind === 'like') {
        const created = await likeProfile(db, user.uid, memberId, senderName);
        setLikedProfile(true);
        if (created) setLikes((value) => value + 1);
        setNotice(created ? 'Profil beğenildi.' : 'Bu profili zaten beğendiniz.');
      } else {
        const created = await sendPointGift(db, user.uid, memberId, senderName);
        setGiftSent(true);
        if (created) setGifts((value) => value + 5);
        setNotice(created ? '5 topluluk puanı gönderildi.' : 'Bu üyeye daha önce puan gönderdiniz.');
      }
    } catch (actionError) { setNotice(kind === 'like' ? 'Profil beğenilemedi. Lütfen tekrar deneyin.' : actionError instanceof Error ? actionError.message : 'Puan gönderilemedi. Lütfen tekrar deneyin.'); }
    finally { setProfileAction(null); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const { db } = getFirebaseClient();
    if (!user || !db) { location.assign('/giris'); return; }
    if (sending) return;
    setSending(true);
    try {
      await sendMessage(db, user.uid, memberId, senderName, message);
      setMessage('');
      setNotice('Mesajınız gönderildi.');
    } catch {
      setNotice('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  }

  async function copyReferralLink() {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <main className="public-profile-page"><section className="public-profile-card">
    <div className="public-profile-avatar" style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: 'cover' } : undefined}>{avatar ? null : name.charAt(0).toUpperCase()}</div>
    <p>TOPLULUK PROFİLİ</p><h1>{name}</h1>
    <div className="public-profile-stats"><span><b>{likes}</b> profil beğenisi</span>{isOwnProfile && <span><b>{gifts}</b> gelen puan</span>}{isOwnProfile && <span><b>{views}</b> profil görüntülenmesi</span>}</div>
    <section className="public-profile-visitors"><h2>Son girenler</h2><div>{visitors.length ? visitors.map((visitor) => <Link key={visitor.id} href={`/uyeler/${visitor.id}`} title={visitor.viewedAt ? visitor.viewedAt.toLocaleString('tr-TR') : undefined}><span className="public-profile-visitor-avatar" style={visitor.avatar ? { backgroundImage: `url(${visitor.avatar})` } : undefined}>{visitor.avatar ? null : visitor.name.charAt(0).toUpperCase()}</span><span>{visitor.name}</span></Link>) : <small>Henüz görüntülenme bulunmuyor.</small>}</div></section>
    {isOwnProfile ? <>
      <Link href="/hesabim" className="public-profile-primary">Profilimi yönet</Link>
      <section className="public-profile-referral"><h2>Referans bağlantın</h2><p>Bu bağlantıyla katılan üyelerin topluluk puanlarının onda biri sana referans puanı olarak yazılır.</p><div><input readOnly value={referralLink} aria-label="Referans bağlantınız" /><button type="button" onClick={copyReferralLink}>{copied ? 'Kopyalandı' : 'Kopyala'}</button></div><small>{referrals.length} üye katıldı · {referralPoints.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} referans puanı</small>{referrals.length ? <ul>{referrals.map((item) => <li key={item.id}><Link href={`/uyeler/${item.id}`}>{item.name}</Link></li>)}</ul> : null}</section>
      {referredByName ? <p className="public-profile-referrer">Sizi davet eden üye: <strong>{referredByName}</strong></p> : null}
    </> : <><div className="public-profile-actions"><button type="button" onClick={() => void act('like')} disabled={Boolean(profileAction) || likedProfile}>{likedProfile ? '♥ Profil beğenildi' : profileAction === 'like' ? 'Beğeniliyor…' : '♡ Profili beğen'}</button><button type="button" onClick={() => void act('gift')} disabled={Boolean(profileAction) || giftSent}>{giftSent ? '✓ 5 puan gönderildi' : profileAction === 'gift' ? 'Gönderiliyor…' : '✦ 5 puan gönder'}</button></div><form onSubmit={submit}><label>Özel mesaj<textarea value={message} onChange={(event) => setMessage(event.target.value)} minLength={1} maxLength={600} required placeholder="Kısa ve saygılı bir mesaj yazın…" /></label><button disabled={sending}>{sending ? 'Gönderiliyor…' : 'Mesaj gönder'}</button></form></>}
    {notice && <div className="public-profile-notice">{notice}</div>}
  </section></main>;
}
