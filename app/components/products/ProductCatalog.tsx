'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ProductItem } from '../../lib/products';
import ProductCover from './ProductCover';

const stockLabel = 'Stok yok';

export default function ProductCatalog({ product }: { product: ProductItem }) {
  const [selectedId, setSelectedId] = useState(product.packs[0]?.id ?? '');
  const selected = useMemo(() => product.packs.find((pack) => pack.id === selectedId) ?? product.packs[0], [product.packs, selectedId]);

  return (
    <section className="product-catalog" aria-labelledby="product-packs-title">
      <div className="product-catalog__heading">
        <div>
          <p className="product-kicker">Seçilebilir ürünler</p>
          <h2 id="product-packs-title">{product.shortName} seçenekleri</h2>
          <p>{product.intro}</p>
        </div>
        <span className="product-catalog__note">Gösterilen ürünler güncel katalog alanıdır.</span>
      </div>

      <div className="product-catalog__layout">
        <div className="product-pack-grid">
          {product.packs.map((pack) => {
            const isSelected = pack.id === selected?.id;
            return (
              <button key={pack.id} type="button" className={`product-pack ${isSelected ? 'is-selected' : ''}`} onClick={() => setSelectedId(pack.id)} aria-pressed={isSelected}>
                <ProductCover product={product} compact />
                <span className="product-pack__title">{pack.label}</span>
                <span className="product-pack__description">{pack.description}</span>
                <span className="product-pack__stock">{stockLabel}</span>
                <span className="product-pack__action">{isSelected ? 'Seçildi' : 'Ürünü seç'}</span>
              </button>
            );
          })}
        </div>

        <aside className="product-selection" aria-live="polite">
          <p className="product-kicker">Seçimin</p>
          <h3>{selected?.label ?? product.shortName}</h3>
          <p>{selected?.description ?? product.description}</p>
          <div className="product-selection__stock"><span /> Stok yok</div>
          <p className="product-selection__help">Bu ürün için satın alma ve sepete ekleme şu an kapalıdır. Stok açıldığında aynı alandan devam edebilirsiniz.</p>
          <div className="product-selection__actions">
            <button type="button" disabled>Sepete ekle</button>
            <Link href="/iletisim" className="product-selection__support">Stok sor <span aria-hidden="true">→</span></Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
