'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import MemberUtilityShell from './MemberUtilityShell';

type Movement = { id: string; kind: string; amount: number; balanceAfter: number; note: string; createdAt: Date | null };
type Incoming = { id: string; payout: number; status: string; codeCount: number; currency: string; codeValue: number };

function money(value: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
}

export default function MemberWallet() {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [incoming, setIncoming] = useState<Incoming[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) { setLoading(false); return; }
    let stopMember = () => {};
    let stopLedger = () => {};
    let stopOperations = () => {};
    const stopAuth = onAuthStateChanged(auth, (nextUser) => {
      stopMember(); stopLedger(); stopOperations(); setUser(nextUser);
      if (!nextUser) { setLoading(false); return; }
      stopMember = onSnapshot(doc(db, 'members', nextUser.uid), (snapshot) => setBalance(Number(snapshot.data()?.balance) || 0));
      stopLedger = onSnapshot(query(collection(db, 'memberLedger'), where('memberId', '==', nextUser.uid)), (snapshot) => setMovements(snapshot.docs.map((item) => {
        const data = item.data();
        return { id: item.id, kind: String(data.kind || ''), amount: Number(data.amount) || 0, balanceAfter: Number(data.balanceAfter) || 0, note: String(data.note || 'Hesap hareketi'), createdAt: data.createdAt?.toDate?.() ?? null };
      }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))));
      stopOperations = onSnapshot(query(collection(db, 'operations'), where('memberId', '==', nextUser.uid)), (snapshot) => setIncoming(snapshot.docs.flatMap((item) => {
        const data = item.data();
        if (data.operationType !== 'code_sale' || data.payoutMethod !== 'balance' || ['completed', 'cancelled'].includes(String(data.status || ''))) return [];
        return [{ id: item.id, payout: Number(data.payout) || 0, status: String(data.status || 'new'), codeCount: Number(data.codeCount) || 0, currency: String(data.currency || 'TRY'), codeValue: Number(data.codeValue) || 0 }];
      })));
      setLoading(false);
    });
    return () => { stopAuth(); stopMember(); stopLedger(); stopOperations(); };
  }, []);

  const totalCredits = useMemo(() => movements.filter((item) => item.kind === 'balance' && item.amount > 0).reduce((sum, item) => sum + item.amount, 0), [movements]);
  const pendingApproved = useMemo(() => incoming.reduce((sum, item) => sum + item.payout, 0), [incoming]);

  if (!loading && !user) return <main className="member-loading"><div><h1>Cüzdan için üye girişi gerekli.</h1><p>Bakiye ve ödeme hareketleri yalnız hesap sahibine gösterilir.</p><Link href="/giris?next=%2Fhesabim%2Fcuzdan">Giriş yap</Link></div></main>;

  return <MemberUtilityShell eyebrow="SKY BOZUM CÜZDANI" title="Bakiyem ve ödemelerim" description="Kod satışından gelen tutarları, ürün alışverişlerini ve yönetici onaylı hesap hareketlerini tek yerde izleyin.">
    <section className="member-wallet-hero"><div><span>KULLANILABİLİR BAKİYE</span><strong>{money(balance)}</strong><p>Bu tutar Sky Bozum ürünlerinde kullanılabilir. Kullanıcı tarafından doğrudan değiştirilemez.</p></div><i aria-hidden="true">₺</i></section>
    <div className="member-wallet-stats"><article><span>Bekleyen bakiye ödemesi</span><strong>{pendingApproved > 0 ? money(pendingApproved) : 'Kontrol aşamasında'}</strong><small>{incoming.length} açık kod satış işlemi</small></article><article><span>Toplam bakiye girişi</span><strong>{money(totalCredits)}</strong><small>Deftere işlenen onaylı hareketler</small></article><article><span>Güvenlik</span><strong>Atomik kayıt</strong><small>Bakiye ve işlem geçmişi birlikte güncellenir</small></article></div>
    <div className="member-wallet-actions"><Link href="/hesabim/talepler?service=razer-gold-tl">Razer Gold kodu sat <span>→</span></Link><Link href="/urunler">Bakiyeyle ürün al <span>→</span></Link><Link href="/hesabim/banka-bilgileri">IBAN bilgilerim <span>→</span></Link></div>
    {incoming.length ? <section className="member-wallet-pending"><header><div><span>BEKLEYEN GİRİŞLER</span><h2>Kod kontrolündeki ödemeler</h2></div><b>{incoming.length}</b></header>{incoming.map((item) => <article key={item.id}><div><strong>{item.codeCount} × {item.codeValue.toLocaleString('tr-TR')} {item.currency === 'USD' ? 'USD' : 'TL'}</strong><span>İşlem no: {item.id.slice(0, 10).toUpperCase()}</span></div><b>{item.payout > 0 ? money(item.payout) : 'Tutar bekleniyor'}</b><em>{item.status === 'awaiting_payment' ? 'Ödeme onaylandı' : item.status === 'checking' ? 'Kod kontrolünde' : 'Talep alındı'}</em></article>)}</section> : null}
    <section className="member-wallet-ledger"><header><div><span>HESAP DEFTERİ</span><h2>Son bakiye ve puan hareketleri</h2></div><Link href="/hesabim/islem-gecmisi">Tüm geçmiş →</Link></header>{loading ? <p>Hareketler yükleniyor…</p> : movements.length ? <div>{movements.slice(0, 30).map((item) => <article key={item.id}><div><strong>{item.note}</strong><time>{item.createdAt?.toLocaleString('tr-TR') || 'Yeni'}</time></div><b className={item.amount >= 0 ? 'is-positive' : 'is-negative'}>{item.amount >= 0 ? '+' : ''}{item.kind === 'balance' ? money(item.amount) : `${item.amount} puan`}</b>{item.kind === 'balance' ? <small>Son bakiye: {money(item.balanceAfter)}</small> : null}</article>)}</div> : <p>Henüz cüzdan hareketiniz bulunmuyor.</p>}</section>
  </MemberUtilityShell>;
}
