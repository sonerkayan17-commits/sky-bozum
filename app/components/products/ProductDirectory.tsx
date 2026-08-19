'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import Link from '../DeferredLink';
import { getFirebaseClient } from '../../lib/firebase';
import { products } from '../../lib/products';
import type { StoreCatalogEntry } from '../../lib/store';
import ProductCover from './ProductCover';

export default function ProductDirectory() {
  const [entries, setEntries] = useState<StoreCatalogEntry[]>([]);
  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db) return;
    return onSnapshot(collection(db, 'productCatalog'), (snapshot) => setEntries(snapshot.docs.map((item) => {
      const data = item.data();
      return { key: item.id, productSlug: String(data.productSlug || ''), productName: String(data.productName || ''), packId: String(data.packId || ''), packLabel: String(data.packLabel || ''), priceMinor: Number.isSafeInteger(Number(data.priceMinor)) ? Number(data.priceMinor) : null, stockCount: Math.max(0, Math.trunc(Number(data.stockCount) || 0)), active: data.active === true };
    })), () => setEntries([]));
  }, []);
  const stock = useMemo(() => entries.reduce<Record<string, number>>((result, entry) => {
    if (entry.active) result[entry.productSlug] = (result[entry.productSlug] || 0) + entry.stockCount;
    return result;
  }, {}), [entries]);

  return <div className="products-grid">{products.map((product) => {
    const stockCount = stock[product.slug] || 0;
    return <Link key={product.slug} href={`/urunler/${product.slug}`} prefetch={false} className="product-directory-card" aria-label={`${product.name} ürün sayfasını aç`}>
      <div className="product-directory-card__cover"><ProductCover product={product} /></div>
      <div className="product-directory-card__body"><p className="product-kicker">{product.eyebrow}</p><h3>{product.name}</h3><p>{product.description}</p><span className={`product-directory-card__stock ${stockCount ? 'is-available' : ''}`}>{stockCount ? `${stockCount} kod stokta` : 'Stok yok'}</span><div className="product-directory-card__cta"><span>İncele</span><span aria-hidden="true">↗</span></div></div>
    </Link>;
  })}</div>;
}
