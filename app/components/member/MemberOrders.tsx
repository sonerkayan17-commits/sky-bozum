'use client';

import Link from 'next/link';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, onSnapshot, query, where, type Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import { formatStoreMoney, type StoreOrder } from '../../lib/store';
import MemberUtilityShell from './MemberUtilityShell';
import MemberCommerceCase from './MemberCommerceCase';
import type { CommerceCase } from '../../lib/commerceCases';

export default function MemberOrders() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [cases, setCases] = useState<CommerceCase[]>([]);
  const [db, setDb] = useState<Firestore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    setDb(db);
    if (!auth || !db) { setLoading(false); return; }
    let stopOrders = () => {};
    let stopCases = () => {};
    const stopAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) { setLoading(false); return; }
      stopOrders();
      stopCases();
      stopOrders = onSnapshot(query(collection(db, 'productOrders'), where('userId', '==', nextUser.uid)), (snapshot) => {
        const orderIds = snapshot.docs.map((item) => item.id);
        if (!orderIds.length) { setOrders([]); setLoading(false); return; }
        void nextUser.getIdToken().then((token) => fetch('/api/store/reveal', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ orderIds }), cache: 'no-store' }))
        .then(async (response) => {
          const payload = await response.json() as { orders?: StoreOrder[]; error?: string };
          if (!response.ok) throw new Error(payload.error || 'Siparişler alınamadı.');
          setOrders((payload.orders || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
        }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Siparişler alınamadı.')).finally(() => setLoading(false));
      }, () => { setError('Sipariş kayıtları okunamadı.'); setLoading(false); });
      stopCases = onSnapshot(query(collection(db, 'commerceCases'), where('memberId', '==', nextUser.uid)), (snapshot) => {
        setCases(snapshot.docs.map((entry) => { const data = entry.data(); return { id: entry.id, memberId: String(data.memberId || ''), targetType: data.targetType === 'operation' ? 'operation' : 'order', targetId: String(data.targetId || ''), kind: data.kind, reason: String(data.reason || ''), status: data.status, resolution: String(data.resolution || ''), createdAt: data.createdAt?.toDate?.() ?? null, updatedAt: data.updatedAt?.toDate?.() ?? null } as CommerceCase; }));
      }, () => setError('Sipariş inceleme kayıtları okunamadı.'));
    });
    return () => { stopAuth(); stopOrders(); stopCases(); };
  }, []);

  async function copy(order: StoreOrder) {
    await navigator.clipboard.writeText(order.code);
    setCopied(order.id);
    window.setTimeout(() => setCopied(''), 1500);
  }

  if (!loading && !user) return <main className="member-loading"><div><h1>Siparişler için üye girişi gerekli.</h1><p>Teslim edilen kodlar yalnız hesap sahibine gösterilir.</p><Link href="/giris?next=%2Fhesabim%2Fsiparisler">Giriş yap</Link></div></main>;

  return <MemberUtilityShell eyebrow="DİJİTAL TESLİMAT" title="Siparişlerim" description="Satın aldığınız kodları, tutarları ve teslim tarihlerini yalnız size açık bu alandan görüntüleyin.">
    <aside className="member-order-policy" aria-label="Teslimat ve iptal bilgisi">
      <div><span>TESLİMAT DURUMU</span><strong>Kod teslimi işlem kaydıyla doğrulanır</strong><p>Satın alma, bakiye düşümü ve kod teslimi tek güvenli işlem içinde tamamlanır. İşlem yarıda kalırsa bakiye ve stok birlikte değişmez.</p></div>
      <div><span>İPTAL / SORUN BİLDİRİMİ</span><strong>Teslim edilmemiş işlem ayrıca incelenir</strong><p>Dijital kod görüntülendikten sonra otomatik iptal yapılamaz. Kod görünmüyorsa, geçersizse veya işlem kaydında tutarsızlık varsa sipariş numaranızla destek isteği açın.</p><Link href="/iletisim">Sipariş sorunu bildir →</Link></div>
    </aside>
    {loading ? <p className="member-orders-status">Siparişler güvenli biçimde yükleniyor…</p> : error ? <p className="member-orders-status is-error">{error}</p> : orders.length ? <div className="member-orders-list">{orders.map((order) => <article key={order.id}>
      <header><div><small>{order.productName}</small><h2>{order.packLabel}</h2></div><strong>{formatStoreMoney(order.priceMinor)}</strong></header>
      <div className="member-order-code"><code>{order.code}</code><button type="button" onClick={() => void copy(order)}>{copied === order.id ? 'Kopyalandı' : 'Kopyala'}</button></div>
      <footer><span>Sipariş no: {order.id}</span><time>{order.createdAt ? new Date(order.createdAt).toLocaleString('tr-TR') : 'Teslim edildi'}</time></footer>
      {db && user ? <MemberCommerceCase db={db} memberId={user.uid} targetType="order" targetId={order.id} allowedKinds={['delivery_issue', 'invalid_code']} existing={cases} /> : null}
    </article>)}</div> : <div className="member-empty-premium"><span aria-hidden="true">◇</span><h2>Henüz dijital ürün siparişiniz yok</h2><p>Stoktaki ürünleri inceleyip bakiyenizle güvenli satın alma yapabilirsiniz.</p><Link href="/urunler">Ürünleri incele →</Link></div>}
  </MemberUtilityShell>;
}
