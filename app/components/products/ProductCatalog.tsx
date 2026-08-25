'use client';

import type { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from '../DeferredLink';
import { formatStoreMoney, storePackKey, type StoreCatalogEntry, type StoreOrder } from '../../lib/store';
import type { ProductItem } from '../../lib/products';
import ProductCover from './ProductCover';
import { deferClientTask } from '../../lib/defer-client-task';
import { trackConversion } from '../../lib/conversion';

export default function ProductCatalog({ product }: { product: ProductItem }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(product.packs[0]?.id ?? '');
  const [catalog, setCatalog] = useState<Record<string, StoreCatalogEntry>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [notice, setNotice] = useState('');
  const [delivered, setDelivered] = useState<StoreOrder | null>(null);
  const [copied, setCopied] = useState(false);
  const [stockAlertActive, setStockAlertActive] = useState(false);
  const [alertingStock, setAlertingStock] = useState(false);
  const selected = useMemo(() => product.packs.find((pack) => pack.id === selectedId) ?? product.packs[0], [product.packs, selectedId]);
  const selectedCatalog = selected ? catalog[selected.id] : undefined;
  const available = selectedCatalog?.active === true && selectedCatalog.stockCount > 0 && selectedCatalog.priceMinor !== null;

  useEffect(() => {
    const storedPack = window.sessionStorage.getItem(`sky-product-selection:${product.slug}`);
    if (storedPack && product.packs.some((pack) => pack.id === storedPack)) setSelectedId(storedPack);
  }, [product.packs, product.slug]);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => {};
    const cancel = deferClientTask(async () => {
      const [{ getFirebaseClient }, { collection, onSnapshot, query, where }] = await Promise.all([
        import('../../lib/firebase'),
        import('firebase/firestore'),
      ]);
      if (!active) return;
      const { db } = getFirebaseClient();
      if (!db) { setLoading(false); return; }
      unsubscribe = onSnapshot(query(collection(db, 'productCatalog'), where('productSlug', '==', product.slug)), (snapshot) => {
        const entries = snapshot.docs.map((item) => {
          const data = item.data();
          return { key: item.id, productSlug: String(data.productSlug || ''), productName: String(data.productName || ''), packId: String(data.packId || ''), packLabel: String(data.packLabel || ''), priceMinor: Number.isSafeInteger(Number(data.priceMinor)) ? Number(data.priceMinor) : null, stockCount: Math.max(0, Math.trunc(Number(data.stockCount) || 0)), active: data.active === true } satisfies StoreCatalogEntry;
        });
        setCatalog(Object.fromEntries(entries.map((entry) => [entry.packId, entry]))); setLoading(false);
      }, () => setLoading(false));
    }, { delay: 1_200, intentEvents: false });
    return () => { active = false; cancel(); unsubscribe(); };
  }, [product.slug]);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => {};
    const knownSession = window.localStorage.getItem('sky-bozum-member-session') === '1';
    const cancel = deferClientTask(async () => {
      const [{ getFirebaseClient }, { onAuthStateChanged }] = await Promise.all([
        import('../../lib/firebase'),
        import('firebase/auth'),
      ]);
      if (!active) return;
      const { auth } = getFirebaseClient();
      if (!auth) return;
      unsubscribe = onAuthStateChanged(auth, setUser);
    }, { delay: 1_000, eager: knownSession, intentEvents: true });
    return () => { active = false; cancel(); unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!selected || !user) { setStockAlertActive(false); return; }
    let active = true;
    let unsubscribe = () => {};
    const cancel = deferClientTask(async () => {
      const [{ getFirebaseClient }, { doc, onSnapshot }] = await Promise.all([
        import('../../lib/firebase'),
        import('firebase/firestore'),
      ]);
      if (!active) return;
      const { db } = getFirebaseClient();
      if (!db) return;
      unsubscribe = onSnapshot(doc(db, 'stockAlerts', `${user.uid}_${storePackKey(product.slug, selected.id)}`), (snapshot) => {
        if (active) setStockAlertActive(snapshot.exists());
      }, () => active && setStockAlertActive(false));
    }, { delay: 700, intentEvents: true });
    return () => { active = false; cancel(); unsubscribe(); };
  }, [product.slug, selected, user]);

  async function requestStockAlert() {
    if (!selected || alertingStock) return;
    if (!user) { router.push(`/giris?next=${encodeURIComponent(`/urunler/${product.slug}`)}`); return; }
    setAlertingStock(true);
    setNotice('');
    try {
      const [{ getFirebaseClient }, { doc, serverTimestamp, setDoc }] = await Promise.all([
        import('../../lib/firebase'),
        import('firebase/firestore'),
      ]);
      const { db } = getFirebaseClient();
      if (!db) throw new Error('Bildirim bağlantısı kurulamadı.');
      const catalogKey = storePackKey(product.slug, selected.id);
      await setDoc(doc(db, 'stockAlerts', `${user.uid}_${catalogKey}`), {
        userId: user.uid, catalogKey, productSlug: product.slug, packId: selected.id,
        productName: product.shortName, packLabel: selected.label, createdAt: serverTimestamp(),
      });
      setStockAlertActive(true);
      trackConversion('stock_alert_requested', { product: product.slug, pack: selected.id });
      setNotice('Stok bildirimi kaydedildi. Bu paket yeniden satışa açıldığında bildirim merkezinizde göreceksiniz.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Stok bildirimi kaydedilemedi.');
    } finally {
      setAlertingStock(false);
    }
  }

  async function purchase() {
    if (!selected || buying) return;
    const [{ getFirebaseClient }, firestoreModule] = await Promise.all([
      import('../../lib/firebase'),
      import('firebase/firestore'),
    ]);
    const { collection, doc, getDocs, limit, query, runTransaction, serverTimestamp, where } = firestoreModule;
    const { auth } = getFirebaseClient();
    const activeUser = user ?? auth?.currentUser ?? null;
    if (!activeUser) { router.push(`/giris?next=${encodeURIComponent(`/urunler/${product.slug}`)}`); return; }
    setBuying(true);
    setNotice('');
    setDelivered(null);
    let completedOrderId = '';
    try {
      if (!activeUser.emailVerified) throw new Error('Satın alma için e-posta adresinizi doğrulayın.');
      const { db } = getFirebaseClient();
      if (!db) throw new Error('Güvenli mağaza bağlantısı kurulamadı.');
      const catalogKey = storePackKey(product.slug, selected.id);
      const catalogRef = doc(db, 'productCatalog', catalogKey);
      const memberRef = doc(db, 'members', activeUser.uid);
      const orderRef = doc(collection(db, 'productOrders'));
      const ledgerRef = doc(db, 'memberLedger', `store-${orderRef.id}`);
      const availableCodes = await getDocs(query(collection(catalogRef, 'codes'), where('status', '==', 'available'), limit(1)));
      if (availableCodes.empty) throw new Error('Bu paket şu anda stokta değil.');
      const selectedCodeRef = availableCodes.docs[0].ref;
      await runTransaction(db, async (transaction) => {
        const [catalogSnapshot, memberSnapshot, codeDocument] = await Promise.all([transaction.get(catalogRef), transaction.get(memberRef), transaction.get(selectedCodeRef)]);
        const catalogData = catalogSnapshot.data(); const memberData = memberSnapshot.data();
        if (!catalogSnapshot.exists() || catalogData?.active !== true) throw new Error('Bu ürün şu anda satışa açık değil.');
        if (!memberSnapshot.exists() || memberData?.status !== 'active') throw new Error('Aktif bir üye hesabı gerekiyor.');
        const priceMinor = Number(catalogData.priceMinor); const stockCount = Math.max(0, Math.trunc(Number(catalogData.stockCount) || 0));
        if (!Number.isSafeInteger(priceMinor) || priceMinor <= 0 || stockCount <= 0) throw new Error('Bu paket şu anda stokta değil.');
        const balanceMinor = Math.round((Number(memberData.balance) || 0) * 100);
        if (!Number.isSafeInteger(balanceMinor) || balanceMinor < priceMinor) throw new Error('Bakiyeniz bu sipariş için yetersiz.');
        const codeEncrypted = String(codeDocument.data()?.codeEncrypted || '');
        if (!codeDocument.exists() || codeDocument.data()?.status !== 'available' || !codeEncrypted) throw new Error('Seçilen stok başka bir siparişe ayrıldı; lütfen yeniden deneyin.');
        const timestamp = serverTimestamp(); const balanceAfter = (balanceMinor - priceMinor) / 100;
        transaction.update(memberRef, { balance: balanceAfter, lastStoreOrderId: orderRef.id, updatedAt: timestamp });
        transaction.update(selectedCodeRef, { status: 'delivered', deliveredTo: activeUser.uid, deliveredAt: timestamp, orderId: orderRef.id });
        transaction.update(catalogRef, { stockCount: stockCount - 1, lastOrderId: orderRef.id, updatedAt: timestamp });
        transaction.set(orderRef, { userId: activeUser.uid, userEmail: activeUser.email || '', productSlug: product.slug, productName: product.shortName, packId: selected.id, packLabel: selected.label, catalogKey, codeId: codeDocument.id, codeEncrypted, priceMinor, status: 'delivered', createdAt: timestamp, deliveredAt: timestamp });
        transaction.set(ledgerRef, { memberId: activeUser.uid, kind: 'balance', amount: -(priceMinor / 100), balanceAfter, note: `${product.shortName} · ${selected.label} satın alımı`, orderId: orderRef.id, performedBy: 'store', createdAt: timestamp });
      });
      completedOrderId = orderRef.id;
      const response = await fetch('/api/store/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await activeUser.getIdToken()}` },
        body: JSON.stringify({ orderId: orderRef.id }),
      });
      const payload = await response.json().catch(() => ({})) as { order?: StoreOrder; error?: string };
      if (!response.ok || !payload.order) throw new Error(payload.error || 'Satın alma tamamlanamadı.');
      setDelivered(payload.order);
      setNotice('Satın alma tamamlandı; ürün kodunuz güvenli biçimde teslim edildi.');
    } catch (error) {
      setNotice(completedOrderId
        ? 'Satın alma ve bakiye işlemi tamamlandı. Kodunuz Siparişlerim alanına kaydedildi; görüntülemek için alanı yeniden açın.'
        : error instanceof Error ? error.message : 'Satın alma tamamlanamadı.');
    } finally {
      setBuying(false);
    }
  }

  async function copyCode() {
    if (!delivered?.code) return;
    await navigator.clipboard.writeText(delivered.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return <section id="paketler" className="product-catalog" aria-labelledby="product-packs-title">
    <div className="product-catalog__heading">
      <div><p className="product-kicker">01 / Ürününü seç</p><h2 id="product-packs-title">{product.shortName} seçenekleri</h2><p>{product.intro}</p></div>
      <span className="product-catalog__note">Fiyat ve stok bilgisi satın alma öncesinde anlık doğrulanır.</span>
    </div>
    <div className="product-catalog__layout">
      <div className="product-pack-grid">
        {product.packs.map((pack) => {
          const entry = catalog[pack.id];
          const isSelected = pack.id === selected?.id;
          const inStock = entry?.active === true && entry.stockCount > 0 && entry.priceMinor !== null;
          return <button key={pack.id} type="button" className={`product-pack ${isSelected ? 'is-selected' : ''}`} onClick={() => { setSelectedId(pack.id); window.sessionStorage.setItem(`sky-product-selection:${product.slug}`, pack.id); setDelivered(null); setNotice(''); }} aria-pressed={isSelected}>
            <span className="product-pack__media"><ProductCover product={product} compact /><span className="product-pack__amount">{pack.label}</span></span>
            <span className="product-pack__title">{pack.label}</span><span className="product-pack__description">{pack.description}</span>
            <span className={`product-pack__stock ${inStock ? 'is-available' : ''}`}>{loading && !entry ? 'Stok kontrol ediliyor…' : inStock ? `${entry.stockCount} adet stokta` : 'Stok yok'}</span>
            <strong className="product-pack__price">{inStock ? formatStoreMoney(entry.priceMinor) : '—'}</strong>
            <span className="product-pack__action">{isSelected ? 'Seçildi' : 'Ürünü seç'}</span>
          </button>;
        })}
      </div>
      <aside className="product-selection" aria-live="polite">
        <p className="product-kicker">Seçimin</p><h3>{selected?.label ?? product.shortName}</h3><p>{selected?.description ?? product.description}</p>
        <strong className="product-selection__price">{available ? formatStoreMoney(selectedCatalog?.priceMinor) : 'Fiyat stokla birlikte açılır'}</strong>
        <div className={`product-selection__stock ${available ? 'is-available' : ''}`}><span /> {available ? `${selectedCatalog?.stockCount} adet stokta` : 'Stok yok'}</div>
        <p className="product-selection__help">{available ? 'Satın al dediğinizde ücret bakiyenizden tek seferde düşülür ve kullanılmamış kod yalnız size teslim edilir.' : 'Satın alma şu an kapalıdır. Yönetim stok ve fiyat eklediğinde buton otomatik açılır.'}</p>
        <div className="product-selection__actions">
          <button type="button" className={available ? 'is-enabled' : ''} disabled={!available || buying} onClick={() => void purchase()}>{buying ? 'Güvenli işlem yapılıyor…' : !user && available ? 'Giriş yap ve satın al' : available ? 'Bakiyemden satın al' : 'Satın alma kapalı'}</button>
          {!available ? <button type="button" className="product-selection__stock-alert" disabled={alertingStock || stockAlertActive} onClick={() => void requestStockAlert()}>{stockAlertActive ? 'Stok bildirimi açık' : alertingStock ? 'Kaydediliyor…' : 'Stok gelince bildir'}</button> : null}
          <Link href="/hesabim/siparisler" className="product-selection__orders">Siparişlerim <span aria-hidden="true">→</span></Link>
          {product.slug === 'razer-gold' ? <Link href="/hesabim/talepler?service=razer-gold-tl" className="product-selection__sell">Elindeki Razer kodunu sat <span aria-hidden="true">→</span></Link> : null}
          <Link href="/iletisim" className="product-selection__support">Destek al <span aria-hidden="true">→</span></Link>
        </div>
        {notice ? <p className={`product-selection__notice ${delivered ? 'is-success' : ''}`}>{notice}{!delivered && selected ? <small> Seçiminiz bu oturum için korundu; stok veya bağlantı yenilendiğinde aynı paketi güvenle yeniden deneyebilirsiniz.</small> : null}</p> : null}
        {delivered ? <div className="product-delivery"><span>TESLİM EDİLEN KOD</span><code>{delivered.code}</code><button type="button" onClick={() => void copyCode()}>{copied ? 'Kopyalandı' : 'Kodu kopyala'}</button><small>Kodu güvenli yerde saklayın; ayrıca Siparişlerim alanından yeniden görüntüleyebilirsiniz.</small></div> : null}
      </aside>
    </div>
  </section>;
}
