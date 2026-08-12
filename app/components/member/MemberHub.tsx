'use client';
/* eslint-disable react-hooks/immutability */

import Link from 'next/link';
import { onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signOut, updateProfile, type Auth, type User } from 'firebase/auth';
import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import { getMemberLevel, memberLevels, subscribeToMemberActivities, type MemberActivity } from '../../lib/memberProgress';
import './member-fixes.css';

export type MemberView = 'overview' | 'account' | 'profile' | 'history' | 'tasks';
type MemberData = { displayName: string; phone: string; email: string; status: string; balance: number; points: number };
type Ledger = { id: string; kind: string; amount: number; note: string; createdAt: Date | null };

const navigation: Array<[MemberView, string, string]> = [
  ['overview', 'Profil özeti', '/hesabim'], ['account', 'Hesap işlemleri', '/hesabim/hesap-islemleri'], ['profile', 'Üyelik bilgileri', '/hesabim/uyelik-bilgileri'], ['history', 'İşlem geçmişi', '/hesabim/islem-gecmisi'], ['tasks', 'Görev merkezi', '/hesabim/gorev-merkezi'],
];

export default function MemberHub({ view }: { view: MemberView }) {
  const [user, setUser] = useState<(User & { auth: Auth }) | null>(null);
  const [member, setMember] = useState<MemberData | null>(null);
  const [activities, setActivities] = useState<MemberActivity[]>([]);
  const [ledger, setLedger] = useState<Ledger[]>([]);
  const [giftPoints, setGiftPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(''); const [phone, setPhone] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) { setLoading(false); return; }
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser as (User & { auth: Auth }) | null); setLoading(false);
      if (!nextUser) return;
      const stopMember = onSnapshot(doc(db, 'members', nextUser.uid), (snapshot) => {
        const data = snapshot.data(); if (!data) return;
        const next = { displayName: String(data.displayName || nextUser.displayName || ''), phone: String(data.phone || ''), email: String(data.email || nextUser.email || ''), status: String(data.status || 'pending'), balance: Number(data.balance) || 0, points: Number(data.points) || 0 };
        setMember(next); setName(next.displayName); setPhone(next.phone);
      });
      const stopActivities = subscribeToMemberActivities(db, nextUser.uid, setActivities);
      const stopGifts = onSnapshot(query(collection(db, 'pointGifts'), where('receiverId', '==', nextUser.uid)), (snapshot) => setGiftPoints(snapshot.docs.reduce((sum, item) => sum + Number(item.data().amount || 0), 0)));
      const stopLedger = onSnapshot(query(collection(db, 'memberLedger'), where('memberId', '==', nextUser.uid)), (snapshot) => setLedger(snapshot.docs.map((item) => { const data = item.data(); return { id: item.id, kind: String(data.kind || ''), amount: Number(data.amount) || 0, note: String(data.note || ''), createdAt: data.createdAt?.toDate?.() ?? null }; }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))));
      return () => { stopMember(); stopActivities(); stopGifts(); stopLedger(); };
    });
  }, []);

  const counts = useMemo(() => ({ like: activities.filter((item) => item.type === 'like').length, comment: activities.filter((item) => item.type === 'comment').length, share: activities.filter((item) => item.type === 'share').length }), [activities]);
  const taskBonus = (counts.like >= 10 ? 50 : 0) + (counts.comment >= 5 ? 75 : 0) + (counts.share >= 1 ? 100 : 0);
  const totalPoints = (member?.points || 0) + giftPoints + activities.reduce((sum, item) => sum + item.points, 0) + taskBonus;
  const level = getMemberLevel(totalPoints);
  const nextLevel = memberLevels.find((item) => item.min > totalPoints);
  const progress = nextLevel ? Math.min(100, Math.round(((totalPoints - level.min) / (nextLevel.min - level.min)) * 100)) : 100;

  async function saveProfile(event: FormEvent) {
    event.preventDefault(); const { auth, db } = getFirebaseClient(); if (!auth?.currentUser || !db) return;
    await updateProfile(auth.currentUser, { displayName: name.trim() });
    await updateDoc(doc(db, 'members', auth.currentUser.uid), { displayName: name.trim(), phone: phone.trim() });
    await setDoc(doc(db, 'publicProfiles', auth.currentUser.uid), { displayName: name.trim(), createdAt: serverTimestamp() });
    setNotice('Üyelik bilgileriniz güncellendi.');
  }

  if (loading) return <main className="member-loading">Hesabınız hazırlanıyor…</main>;
  if (!user) return <main className="member-loading"><div><h1>Üye girişi gerekli</h1><p>Profilinizi görüntülemek için hesabınıza giriş yapın.</p><Link href="/giris">Giriş yap</Link></div></main>;

  return <main className="member-page"><div className="member-shell"><aside className="member-sidebar"><div className="member-avatar">{(member?.displayName || user.email || 'Ü').charAt(0).toUpperCase()}</div><h1>{member?.displayName || 'Sky Bozum üyesi'}</h1><p>{level.name} üye · {totalPoints} puan</p><nav>{navigation.map(([id,label,href]) => <Link key={id} href={href} aria-current={view === id ? 'page' : undefined}>{label}<span>›</span></Link>)}</nav></aside><section className="member-content">+    {view === 'overview' && <><header className="member-head"><span>ÜYE PROFİLİ</span><h2>Hesabınız tek bakışta.</h2><p>Seviyenizi, görevlerinizi ve hesap hareketlerinizi buradan takip edin.</p></header><div className="member-stats"><article><span>Seviye</span><strong>{level.name}</strong><small>{level.benefit}</small></article><article><span>Toplam puan</span><strong>{totalPoints}</strong><small>{nextLevel ? `${nextLevel.min - totalPoints} puan sonra ${nextLevel.name}` : 'En üst seviyedesiniz'}</small></article><article><span>Bakiye</span><strong>{(member?.balance || 0).toLocaleString('tr-TR')} TL</strong><small>Yönetici onaylı bakiye</small></article></div><section className="member-level-card"><div><span>SEVİYE İLERLEMESİ</span><h3>{level.name}{nextLevel ? ` → ${nextLevel.name}` : ''}</h3></div><b>{progress}%</b><div className="member-progress"><i style={{width:`${progress}%`}} /></div></section><div className="member-quick">{navigation.slice(1).map(([id,label,href]) => <Link key={id} href={href}><strong>{label}</strong><span>Alanı aç →</span></Link>)}</div></>}
    {view === 'account' && <><header className="member-head"><span>HESAP İŞLEMLERİ</span><h2>Güvenlik ve erişim.</h2><p>E-posta doğrulama, parola yenileme ve oturum seçenekleri.</p></header><div className="member-action-list"><article><div><strong>E-posta doğrulama</strong><span>{user.emailVerified ? 'E-posta adresiniz doğrulandı.' : 'Doğrulama bekleniyor.'}</span></div>{!user.emailVerified && <button onClick={async()=>{user.auth.languageCode='tr';await sendEmailVerification(user);setNotice('Doğrulama e-postası gönderildi.');}}>Tekrar gönder</button>}</article><article><div><strong>Parolayı yenile</strong><span>Yenileme bağlantısı kayıtlı e-postanıza gider.</span></div><button onClick={async()=>{if(user.email){user.auth.languageCode='tr';await sendPasswordResetEmail(user.auth,user.email);setNotice('Parola yenileme e-postası gönderildi.');}}}>Bağlantı gönder</button></article><article><div><strong>Oturumu kapat</strong><span>Bu cihazdaki üyelik oturumunu güvenle sonlandırın.</span></div><button className="danger" onClick={async()=>{await signOut(user.auth);location.assign('/');}}>Çıkış yap</button></article></div></>}
    {view === 'profile' && <><header className="member-head"><span>ÜYELİK BİLGİLERİ</span><h2>Profilinizi güncelleyin.</h2><p>Forumda görünen adınızı ve iletişim numaranızı yönetin.</p></header><form className="member-form" onSubmit={saveProfile}><label>Ad soyad<input value={name} onChange={(e)=>setName(e.target.value)} minLength={2} required /></label><label>Telefon numarası<input value={phone} onChange={(e)=>setPhone(e.target.value)} inputMode="tel" /></label><label>E-posta<input value={member?.email || user.email || ''} disabled /><small>E-posta değişikliği güvenlik nedeniyle destek üzerinden yapılır.</small></label><button>Bilgileri kaydet</button></form></>}
    {view === 'history' && <><header className="member-head"><span>İŞLEM GEÇMİŞİ</span><h2>Hesap hareketleriniz.</h2><p>Onaylanmış bakiye ve puan işlemleriniz burada görünür.</p></header><div className="member-history">{ledger.length ? ledger.map((item)=><article key={item.id}><div><strong>{item.note || 'Hesap hareketi'}</strong><span>{item.createdAt?.toLocaleDateString('tr-TR') || 'Yeni'}</span></div><b>{item.amount>0?'+':''}{item.amount.toLocaleString('tr-TR')} {item.kind==='balance'?'TL':'puan'}</b></article>) : <p>Henüz kayıtlı bir hesap hareketiniz bulunmuyor.</p>}</div></>}
    {view === 'tasks' && <><header className="member-head"><span>GÖREV MERKEZİ</span><h2>Katılın, puan kazanın.</h2><p>Görevleri tamamlayarak üyelik seviyenizi yükseltin.</p></header><div className="member-tasks"><Task title="10 makaleyi beğen" current={counts.like} target={10} points={50} href="/bilgi-merkezi"/><Task title="5 makaleye yorum yap" current={counts.comment} target={5} points={75} href="/bilgi-merkezi"/><Task title="1 makale veya durum paylaş" current={counts.share} target={1} points={100} href="/bilgi-merkezi"/></div><section className="member-levels"><h3>Üyelik seviyeleri</h3>{memberLevels.map((item)=><article key={item.name} className={level.name===item.name?'active':''}><strong>{item.name}</strong><span>{item.min} puan</span><p>{item.benefit}</p></article>)}</section></>}
    {notice && <p className="member-notice">{notice}</p>}
  </section></div></main>;
}

function Task({title,current,target,points,href}:{title:string;current:number;target:number;points:number;href:string}) { const done=current>=target; const percent=Math.min(100,Math.round(current/target*100)); return <article className={done?'done':''}><div><span>{done?'TAMAMLANDI':'AKTİF GÖREV'}</span><b>+{points} puan</b></div><h3>{title}</h3><p>{Math.min(current,target)} / {target}</p><div><i style={{width:`${percent}%`}} /></div><Link href={href}>{done?'Görev tamamlandı':'İçeriklere git →'}</Link></article> }
