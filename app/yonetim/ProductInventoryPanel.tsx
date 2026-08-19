'use client';

import type { User } from 'firebase/auth';
import { collection, doc, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp } from 'firebase/firestore';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { getFirebaseClient } from '../lib/firebase';
import { products } from '../lib/products';
import { formatStoreMoney, parsePriceMinor, storePackKey, type StoreCatalogEntry } from '../lib/store';
import './inventory.css';

type AdminOrder = { id: string; userEmail: string; productName: string; packLabel: string; priceMinor: number; status: string; createdAt: string | null };

export default function ProductInventoryPanel({ user }: { user: User }) {
  const [productSlug, setProductSlug] = useState(products[0]?.slug || '');
  const product = useMemo(() => products.find((item) => item.slug === productSlug) || products[0], [productSlug]);
  const [packId, setPackId] = useState(product?.packs[0]?.id || '');
  const [price, setPrice] = useState('');
  const [codes, setCodes] = useState('');
  const [active, setActive] = useState(true);
  const [entries, setEntries] = useState<StoreCatalogEntry[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { setPackId(product?.packs[0]?.id || ''); }, [product]);

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db) { setError('Firebase bağlantısı kurulamadı.'); return; }
    const stopCatalog = onSnapshot(collection(db, 'productCatalog'), (snapshot) => setEntries(snapshot.docs.map((item) => {
      const data = item.data();
      return { key: item.id, productSlug: String(data.productSlug || ''), productName: String(data.productName || ''), packId: String(data.packId || ''), packLabel: String(data.packLabel || ''), priceMinor: Number.isSafeInteger(Number(data.priceMinor)) ? Number(data.priceMinor) : null, stockCount: Math.max(0, Math.trunc(Number(data.stockCount) || 0)), active: data.active === true };
    })), (reason) => setError(reason.message));
    const stopOrders = onSnapshot(query(collection(db, 'productOrders'), orderBy('createdAt', 'desc'), limit(30)), (snapshot) => setOrders(snapshot.docs.map((item) => {
      const data = item.data(); return { id: item.id, userEmail: String(data.userEmail || data.userId || ''), productName: String(data.productName || ''), packLabel: String(data.packLabel || ''), priceMinor: Number(data.priceMinor) || 0, status: String(data.status || ''), createdAt: data.createdAt?.toDate?.().toISOString() || null };
    })), (reason) => setError(reason.message));
    return () => { stopCatalog(); stopOrders(); };
  }, []);
  useEffect(() => {
    const current = entries.find((item) => item.productSlug === productSlug && item.packId === packId);
    setPrice(current?.priceMinor ? String(current.priceMinor / 100).replace('.', ',') : '');
    setActive(current?.active !== false);
  }, [entries, packId, productSlug]);

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const priceMinor = parsePriceMinor(price);
      if (!priceMinor) throw new Error('Sıfırdan büyük geçerli bir TL fiyatı girin.');
      const response = await fetch('/api/admin/store/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
        body: JSON.stringify({ productSlug, packId, codes }),
      });
      const payload = await response.json() as { encrypted?: Array<{ id: string; codeEncrypted: string }>; error?: string };
      if (!response.ok) throw new Error(payload.error || 'Stok kaydedilemedi.');
      const { db } = getFirebaseClient();
      if (!db) throw new Error('Firebase bağlantısı kurulamadı.');
      const resolvedPack = product?.packs.find((item) => item.id === packId);
      if (!product || !resolvedPack) throw new Error('Ürün paketi bulunamadı.');
      const catalogKey = storePackKey(productSlug, packId); const catalogRef = doc(db, 'productCatalog', catalogKey);
      const encrypted = payload.encrypted || [];
      const added = await runTransaction(db, async (transaction) => {
        const catalogSnapshot = await transaction.get(catalogRef);
        const codesCollection = collection(catalogRef, 'codes');
        const codeRefs = encrypted.map((item) => doc(codesCollection, item.id));
        const codeSnapshots = await Promise.all(codeRefs.map((reference) => transaction.get(reference)));
        const missing = encrypted.filter((_, index) => !codeSnapshots[index].exists());
        const timestamp = serverTimestamp();
        missing.forEach((item) => transaction.set(doc(codesCollection, item.id), { codeEncrypted: item.codeEncrypted, status: 'available', createdAt: timestamp, createdBy: user.uid }));
        transaction.set(catalogRef, { productSlug, productName: product.shortName, packId, packLabel: resolvedPack.label, priceMinor, stockCount: Math.max(0, Math.trunc(Number(catalogSnapshot.data()?.stockCount) || 0)) + missing.length, active, updatedAt: timestamp, updatedBy: user.uid }, { merge: true });
        return missing.length;
      });
      setNotice(`${added} yeni kod eklendi${encrypted.length - added ? ` · ${encrypted.length - added} tekrar atlandı` : ''}.`);
      setCodes('');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Stok kaydedilemedi.'); }
    finally { setBusy(false); }
  }

  return <section className="admin-section inventory-panel">
    <div className="admin-section-head"><div><span>DİJİTAL ÜRÜN KASASI</span><h2>Fiyat, stok ve teslimat</h2></div><p>Kodlar şifrelenir; müşteriye yalnız tamamlanan satın alımın tek kodu gösterilir.</p></div>
    <div className="inventory-layout">
      <form onSubmit={save} className="inventory-form">
        <label>Ürün<select value={productSlug} onChange={(event) => setProductSlug(event.target.value)}>{products.map((item) => <option key={item.slug} value={item.slug}>{item.shortName}</option>)}</select></label>
        <label>Paket<select value={packId} onChange={(event) => setPackId(event.target.value)}>{product?.packs.map((pack) => <option key={pack.id} value={pack.id}>{pack.label}</option>)}</select></label>
        <label>Satış fiyatı (TL)<input inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Örn. 129,90" required /></label>
        <label className="inventory-toggle"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Paket satışa açık</label>
        <label>Kodlar<textarea value={codes} onChange={(event) => setCodes(event.target.value)} placeholder={'Her satıra bir kullanılmamış kod\nABC-123-XYZ\nDEF-456-QWE'} spellCheck={false} /></label>
        <small>Kodlar panelde tekrar açık gösterilmez. Aynı ürün/pakette yinelenen kodlar güvenli karma ile atlanır.</small>
        <button className="admin-primary" disabled={busy}>{busy ? 'Güvenli kasaya yazılıyor…' : 'Fiyatı ve stokları kaydet'}</button>
        {error ? <p className="inventory-message is-error">{error}</p> : null}{notice ? <p className="inventory-message is-success">{notice}</p> : null}
      </form>
      <div className="inventory-summary"><h3>Canlı paket durumu</h3><div>{entries.map((entry) => <article key={entry.key}><div><strong>{entry.productName}</strong><span>{entry.packLabel}</span></div><b>{entry.stockCount} kod</b><span>{entry.priceMinor ? formatStoreMoney(entry.priceMinor) : 'Fiyat yok'}</span><em className={entry.active ? 'is-live' : ''}>{entry.active ? 'Açık' : 'Kapalı'}</em></article>)}</div></div>
    </div>
    <section className="inventory-orders"><header><h3>Son teslimatlar</h3><span>{orders.length} kayıt</span></header>{orders.length ? orders.map((order) => <article key={order.id}><div><strong>{order.productName} · {order.packLabel}</strong><span>{order.userEmail}</span></div><b>{formatStoreMoney(order.priceMinor)}</b><em>{order.status === 'delivered' ? 'Teslim edildi' : order.status}</em><time>{order.createdAt ? new Date(order.createdAt).toLocaleString('tr-TR') : '—'}</time></article>) : <p className="admin-empty">Henüz tamamlanan ürün siparişi yok.</p>}</section>
  </section>;
}
