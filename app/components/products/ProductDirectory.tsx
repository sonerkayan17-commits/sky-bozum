'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from '../DeferredLink';
import { products } from '../../lib/products';
import type { StoreCatalogEntry } from '../../lib/store';
import ProductCover from './ProductCover';
import { deferClientTask } from '../../lib/defer-client-task';

export default function ProductDirectory() {
  const [entries, setEntries] = useState<StoreCatalogEntry[]>([]);
  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => {};
    const cancel = deferClientTask(async () => {
      const [{ getFirebaseFirestore }, { collection, onSnapshot }] = await Promise.all([
        import('../../lib/firebase-firestore'),
        import('firebase/firestore'),
      ]);
      if (!active) return;
      const db = getFirebaseFirestore();
      if (!db) return;
      unsubscribe = onSnapshot(collection(db, 'productCatalog'), (snapshot) => setEntries(snapshot.docs.map((item) => {
        const data = item.data();
        return { key: item.id, productSlug: String(data.productSlug || ''), productName: String(data.productName || ''), packId: String(data.packId || ''), packLabel: String(data.packLabel || ''), priceMinor: Number.isSafeInteger(Number(data.priceMinor)) ? Number(data.priceMinor) : null, stockCount: Math.max(0, Math.trunc(Number(data.stockCount) || 0)), active: data.active === true };
      })), () => setEntries([]));
    // Katalog ilk ekrana gelirken Firebase/Auth paketlerini ana iş parçacığına
    // bindirme. Stok yayını sayfa yerleştikten sonra bağlanır; ürün kartına
    // dokunmak/geçiş yapmak bu ağır entegrasyonu gereksiz yere başlatmaz.
    }, { delay: 12_000, intentEvents: false });
    return () => { active = false; cancel(); unsubscribe(); };
  }, []);
  const stock = useMemo(() => entries.reduce<Record<string, number>>((result, entry) => {
    if (entry.active) result[entry.productSlug] = (result[entry.productSlug] || 0) + entry.stockCount;
    return result;
  }, {}), [entries]);

  return <div className="products-grid">{products.map((product, index) => {
    const stockCount = stock[product.slug] || 0;
    return <Link key={product.slug} href={`/urunler/${product.slug}`} prefetch={false} draggable={false} data-product={product.slug} onDragStart={(event) => event.preventDefault()} onContextMenu={(event) => { if (window.matchMedia('(pointer: coarse)').matches) event.preventDefault(); }} className={`product-directory-card product-directory-card--${product.tone}`}>
      <div className="product-directory-card__cover"><ProductCover product={product} priority={index < 2} sizes="(max-width: 560px) calc(50vw - 22px), (max-width: 820px) calc(50vw - 28px), (max-width: 1180px) calc(33vw - 20px), 20vw" /></div>
      <div className="product-directory-card__body"><p className="product-kicker">{product.eyebrow}</p><h3>{product.name}</h3><p>{product.description}</p><span className={`product-directory-card__stock ${stockCount ? 'is-available' : ''}`}>{stockCount ? `${stockCount} kod stokta` : 'Stok yok'}</span><div className="product-directory-card__cta"><span>İncele</span><span aria-hidden="true">↗</span></div></div>
    </Link>;
  })}</div>;
}
