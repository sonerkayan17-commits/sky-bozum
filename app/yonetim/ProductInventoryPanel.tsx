'use client';

import type { User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { getFirebaseClient } from '../lib/firebase';
import { products } from '../lib/products';
import { formatStoreMoney, parsePriceMinor, storePackKey, type StoreCatalogEntry } from '../lib/store';
import './inventory.css';

type AdminOrder = { id: string; userEmail: string; productName: string; packLabel: string; priceMinor: number; status: string; createdAt: string | null };
type StockCodeRecord = { id: string; status: string; orderId: string; createdAt: string | null };

export default function ProductInventoryPanel({ user }: { user: User }) {
  const [productSlug, setProductSlug] = useState(products[0]?.slug || '');
  const product = useMemo(() => products.find((item) => item.slug === productSlug) || products[0], [productSlug]);
  const [packId, setPackId] = useState(product?.packs[0]?.id || '');
  const [price, setPrice] = useState('');
  const [codes, setCodes] = useState('');
  const [active, setActive] = useState(true);
  const [entries, setEntries] = useState<StoreCatalogEntry[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stockCodes, setStockCodes] = useState<StockCodeRecord[]>([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const preparedCodes = useMemo(() => [...new Set(codes.split(/\r?\n/).map((code) => code.trim()).filter(Boolean))], [codes]);
  const duplicateCodeCount = Math.max(0, codes.split(/\r?\n/).map((code) => code.trim()).filter(Boolean).length - preparedCodes.length);
  const selectedEntry = useMemo(
    () => entries.find((item) => item.productSlug === productSlug && item.packId === packId) || null,
    [entries, packId, productSlug],
  );
  const selectedAvailableCount = stockCodes.filter((item) => item.status === 'available').length;
  const selectedStockMismatch = selectedEntry ? selectedEntry.stockCount - selectedAvailableCount : 0;
  const inventoryMetrics = useMemo(() => {
    const delivered = orders.filter((order) => order.status === 'delivered');
    const todayKey = new Date().toLocaleDateString('tr-TR');
    const today = delivered.filter((order) => order.createdAt && new Date(order.createdAt).toLocaleDateString('tr-TR') === todayKey);
    return {
      availableCodes: entries.filter((entry) => entry.active).reduce((total, entry) => total + entry.stockCount, 0),
      lowStock: entries.filter((entry) => entry.active && entry.stockCount > 0 && entry.stockCount <= 3).length,
      todayRevenue: today.reduce((total, order) => total + order.priceMinor, 0),
      deliveredRevenue: delivered.reduce((total, order) => total + order.priceMinor, 0),
    };
  }, [entries, orders]);

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

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db || !productSlug || !packId) return;
    const catalogKey = storePackKey(productSlug, packId);
    return onSnapshot(collection(db, 'productCatalog', catalogKey, 'codes'), (snapshot) => setStockCodes(snapshot.docs.map((item) => {
      const data = item.data();
      return { id: item.id, status: String(data.status || 'available'), orderId: String(data.orderId || ''), createdAt: data.createdAt?.toDate?.().toISOString() || null };
    })), (reason) => setError(reason.message));
  }, [packId, productSlug]);

  async function toggleSale(entry: StoreCatalogEntry) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const { db } = getFirebaseClient();
      if (!db) throw new Error('Firebase bağlantısı kurulamadı.');
      const nextActive = !entry.active;
      const batch = writeBatch(db);
      batch.update(doc(db, 'productCatalog', entry.key), { active: nextActive, updatedAt: serverTimestamp(), updatedBy: user.uid });
      batch.set(doc(collection(db, 'contentAudit')), { action: nextActive ? 'stock:sale-enabled' : 'stock:sale-disabled', articleSlug: entry.key, actorId: user.uid, createdAt: serverTimestamp() });
      await batch.commit();
      setNotice(`${entry.productName} · ${entry.packLabel} satışı ${nextActive ? 'açıldı' : 'durduruldu'}.`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Satış durumu güncellenemedi.'); }
    finally { setBusy(false); }
  }

  async function reconcileInventory(targets = entries) {
    if (reconciling || !targets.length) return;
    setReconciling(true); setError(''); setNotice('');
    try {
      const { db } = getFirebaseClient();
      if (!db) throw new Error('Firebase bağlantısı kurulamadı.');
      let corrected = 0;
      let inspected = 0;
      for (let offset = 0; offset < targets.length; offset += 350) {
        const chunk = targets.slice(offset, offset + 350);
        const counts = await Promise.all(chunk.map(async (entry) => {
          const snapshot = await getDocs(collection(db, 'productCatalog', entry.key, 'codes'));
          return snapshot.docs.filter((code) => code.data().status === 'available').length;
        }));
        const mismatches = chunk.flatMap((entry, index) => entry.stockCount === counts[index] ? [] : [{ entry, available: counts[index] }]);
        inspected += chunk.length;
        if (!mismatches.length) continue;
        const batch = writeBatch(db);
        const timestamp = serverTimestamp();
        mismatches.forEach(({ entry, available }) => {
          batch.update(doc(db, 'productCatalog', entry.key), {
            stockCount: available,
            reconciledAt: timestamp,
            reconciledBy: user.uid,
            updatedAt: timestamp,
            updatedBy: user.uid,
          });
        });
        batch.set(doc(collection(db, 'contentAudit')), {
          action: 'stock:reconciled',
          articleSlug: mismatches.map(({ entry }) => entry.key).join(',').slice(0, 1000),
          actorId: user.uid,
          correctedCount: mismatches.length,
          createdAt: timestamp,
        });
        await batch.commit();
        corrected += mismatches.length;
      }
      setNotice(`${inspected} paket denetlendi; ${corrected ? `${corrected} stok sayacı gerçek kod kayıtlarıyla eşitlendi` : 'stok sayaçlarının tamamı doğru'}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Stok mutabakatı tamamlanamadı.');
    } finally {
      setReconciling(false);
    }
  }

  function selectEntry(entry: StoreCatalogEntry) {
    setProductSlug(entry.productSlug);
    setPackId(entry.packId);
    setPrice(entry.priceMinor ? String(entry.priceMinor / 100).replace('.', ',') : '');
    setActive(entry.active);
    document.querySelector('.inventory-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const priceMinor = parsePriceMinor(price);
      if (!priceMinor) throw new Error('Sıfırdan büyük geçerli bir TL fiyatı girin.');
      if (preparedCodes.length > 100) throw new Error('Tek seferde en fazla 100 kod ekleyin. Daha büyük stokları parti parti aktarın.');
      const response = await fetch('/api/admin/store/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
        body: JSON.stringify({ productSlug, packId, codes: preparedCodes.join('\n') }),
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
        transaction.set(doc(collection(db, 'contentAudit')), { action: 'stock:batch-updated', articleSlug: catalogKey, actorId: user.uid, addedCodes: missing.length, updatedAt: timestamp, createdAt: timestamp });
        return missing.length;
      });
      let notified = 0;
      if (added > 0) {
        const alerts = await getDocs(query(collection(db, 'stockAlerts'), where('catalogKey', '==', catalogKey)));
        const recipients = [...new Set(alerts.docs.map((entry) => String(entry.data().userId || '')).filter(Boolean))];
        await Promise.all(recipients.map((receiverId) => addDoc(collection(db, 'notifications'), {
          senderId: user.uid, receiverId, type: 'stock_available',
          text: `${product.shortName} · ${resolvedPack.label} yeniden stokta.`,
          href: `/urunler/${productSlug}#paketler`, read: false, createdAt: serverTimestamp(),
        })));
        notified = recipients.length;
        await Promise.all(alerts.docs.map((entry) => deleteDoc(entry.ref)));
      }
      setNotice(`${added} yeni kod eklendi${encrypted.length - added ? ` · ${encrypted.length - added} tekrar atlandı` : ''}${duplicateCodeCount ? ` · ${duplicateCodeCount} yinelenen satır yüklenmeden temizlendi` : ''}${notified ? ` · ${notified} üyeye stok bildirimi gönderildi` : ''}.`);
      setCodes('');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Stok kaydedilemedi.'); }
    finally { setBusy(false); }
  }

  return <section className="admin-section inventory-panel">
    <div className="admin-section-head"><div><span>DİJİTAL ÜRÜN KASASI</span><h2>Ürün, fiyat, stok ve teslimat</h2></div><p>Desteklenen ürünü yayına alma, fiyat güncelleme, stok tazeleme ve satış durdurma tek merkezden yapılır. Kodlar şifreli kalır.</p></div>
    <div className="inventory-metrics" aria-label="Stok ve satış özeti"><article><strong>{inventoryMetrics.availableCodes}</strong><span>satışa açık kod</span></article><article className={inventoryMetrics.lowStock ? 'is-warning' : ''}><strong>{inventoryMetrics.lowStock}</strong><span>azalan stok</span></article><article><strong>{formatStoreMoney(inventoryMetrics.todayRevenue)}</strong><span>bugün teslim edilen</span></article><article><strong>{formatStoreMoney(inventoryMetrics.deliveredRevenue)}</strong><span>toplam teslimat değeri</span></article></div>
    <div className="inventory-reconciliation" role="status">
      <div><strong>Stok mutabakatı</strong><span>{selectedEntry ? selectedStockMismatch === 0 ? 'Seçili paketin sayacı gerçek kod kayıtlarıyla uyumlu.' : `Seçili pakette ${Math.abs(selectedStockMismatch)} kodluk sayaç farkı bulundu.` : 'Denetlemek için kayıtlı bir paket seçin.'}</span></div>
      <button type="button" className="admin-secondary compact" disabled={reconciling || !selectedEntry} onClick={() => void reconcileInventory(selectedEntry ? [selectedEntry] : [])}>Seçili paketi denetle</button>
      <button type="button" className="admin-primary compact" disabled={reconciling || !entries.length} onClick={() => void reconcileInventory()}>{reconciling ? 'Kod kayıtları sayılıyor…' : 'Tüm stokları eşitle'}</button>
    </div>
    <div className="inventory-layout">
      <form onSubmit={save} className="inventory-form">
        <label>Ürün<select value={productSlug} onChange={(event) => setProductSlug(event.target.value)}>{products.map((item) => <option key={item.slug} value={item.slug}>{item.shortName}</option>)}</select></label>
        <label>Paket<select value={packId} onChange={(event) => setPackId(event.target.value)}>{product?.packs.map((pack) => <option key={pack.id} value={pack.id}>{pack.label}</option>)}</select></label>
        <label>Satış fiyatı (TL)<input inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Örn. 129,90" required /></label>
        <label className="inventory-toggle"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Paket satışa açık</label>
        <label>Kodlar<textarea value={codes} onChange={(event) => setCodes(event.target.value)} placeholder={'Her satıra bir kullanılmamış kod\nABC-123-XYZ\nDEF-456-QWE'} spellCheck={false} /></label>
        <small>Kodlar panelde tekrar açık gösterilmez. Aynı ürün/pakette yinelenen kodlar güvenli karma ile atlanır. Tek partide en fazla 100 benzersiz kod yazabilirsiniz.</small>
        {preparedCodes.length ? <p className="inventory-batch-preview"><b>{preparedCodes.length} benzersiz kod</b>{duplicateCodeCount ? <span> · {duplicateCodeCount} tekrar temizlenecek</span> : null}</p> : null}
        <button className="admin-primary" disabled={busy}>{busy ? 'Güvenli kasaya yazılıyor…' : 'Fiyatı ve stokları kaydet'}</button>
        {error ? <p className="inventory-message is-error">{error}</p> : null}{notice ? <p className="inventory-message is-success">{notice}</p> : null}
      </form>
      <div className="inventory-summary"><h3>Canlı paket durumu</h3><div>{entries.map((entry) => <article key={entry.key}><div><strong>{entry.productName}</strong><span>{entry.packLabel}</span></div><b>{entry.stockCount} kod</b><span>{entry.priceMinor ? formatStoreMoney(entry.priceMinor) : 'Fiyat yok'}</span><em className={entry.active ? 'is-live' : ''}>{entry.active ? 'Açık' : 'Kapalı'}</em><div className="inventory-row-actions"><button type="button" onClick={() => selectEntry(entry)}>Düzenle</button><button type="button" className={entry.active ? 'is-stop' : ''} disabled={busy} onClick={() => void toggleSale(entry)}>{entry.active ? 'Satışı durdur' : 'Satışı aç'}</button></div></article>)}</div></div>
    </div>
    <section className="inventory-code-register"><header><div><span>ŞİFRELİ STOK DEFTERİ</span><h3>Seçili paketin kod hareketleri</h3></div><b>{stockCodes.filter((item) => item.status === 'available').length} kullanılabilir · {stockCodes.filter((item) => item.status === 'delivered').length} satıldı</b></header><p>Kod içeriği güvenlik nedeniyle toplu biçimde açılmaz. Kimlik, durum, sipariş bağı ve kayıt zamanı denetlenebilir.</p><div>{stockCodes.length ? stockCodes.slice(0, 100).map((item) => <article key={item.id}><code>{item.id.slice(0, 12)}…</code><strong className={item.status === 'available' ? 'is-available' : ''}>{item.status === 'available' ? 'Stokta' : item.status === 'delivered' ? 'Teslim edildi' : item.status}</strong><span>{item.orderId ? `Sipariş: ${item.orderId.slice(0, 10)}…` : 'Siparişe bağlanmadı'}</span><time>{item.createdAt ? new Date(item.createdAt).toLocaleString('tr-TR') : '—'}</time></article>) : <p className="admin-empty">Seçili pakette henüz kod kaydı yok.</p>}</div></section>
    <section className="inventory-orders"><header><h3>Son teslimatlar</h3><span>{orders.length} kayıt</span></header>{orders.length ? orders.map((order) => <article key={order.id}><div><strong>{order.productName} · {order.packLabel}</strong><span>{order.userEmail}</span></div><b>{formatStoreMoney(order.priceMinor)}</b><em>{order.status === 'delivered' ? 'Teslim edildi' : order.status}</em><time>{order.createdAt ? new Date(order.createdAt).toLocaleString('tr-TR') : '—'}</time></article>) : <p className="admin-empty">Henüz tamamlanan ürün siparişi yok.</p>}</section>
  </section>;
}
