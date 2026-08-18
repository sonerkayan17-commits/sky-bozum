import type { ProductItem } from '../../lib/products';

export default function ProductCover({ product, compact = false }: { product: ProductItem; compact?: boolean }) {
  return (
    <div className={`product-cover product-cover--${product.tone} ${compact ? 'product-cover--compact' : ''}`} aria-hidden="true">
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
