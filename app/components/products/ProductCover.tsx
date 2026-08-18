import type { ProductItem } from '../../lib/products';
import Image from 'next/image';

export default function ProductCover({ product, compact = false, priority = false }: { product: ProductItem; compact?: boolean; priority?: boolean }) {
  return (
    <div
      className={`product-cover product-cover--${product.tone} ${compact ? 'product-cover--compact' : ''}`}
      aria-hidden="true"
    >
      <Image
        src={product.coverImage}
        alt=""
        fill
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes={compact ? '(max-width: 560px) 45vw, (max-width: 1120px) 30vw, 230px' : '(max-width: 560px) 100vw, (max-width: 820px) 50vw, 560px'}
        className="product-cover__image"
      />
      <span className="product-cover__glow" />
      <span className="product-cover__orb product-cover__orb--one" />
      <span className="product-cover__orb product-cover__orb--two" />
      <div className="product-cover__content">
        <span className="product-cover__eyebrow">{product.eyebrow}</span>
        <strong>{product.coverLabel}</strong>
        <span>{product.coverNote}</span>
      </div>
      <span className="product-cover__scan" />
    </div>
  );
}
