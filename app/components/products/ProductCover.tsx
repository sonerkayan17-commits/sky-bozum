import type { ProductItem } from '../../lib/products';
import Image from 'next/image';
import ProductCoverVideo from './ProductCoverVideo';

export default function ProductCover({ product, compact = false, priority = false, disableVideo = false }: { product: ProductItem; compact?: boolean; priority?: boolean; disableVideo?: boolean }) {
  const hasVideo = Boolean(product.coverVideo && !compact && !disableVideo);

  return (
    <div
      className={`product-cover product-cover--${product.tone} ${product.brandLogo || product.brandIntegrated ? 'product-cover--brand-art' : ''} ${hasVideo ? 'product-cover--has-video' : ''} ${compact ? 'product-cover--compact' : ''}`}
      aria-hidden="true"
    >
      {hasVideo ? (
        <Image
          src={product.coverImage}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 560px) 100vw, (max-width: 820px) 50vw, 560px"
          className="product-cover__backdrop"
        />
      ) : null}
      <Image
        src={product.coverImage}
        alt=""
        fill
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes={compact ? '(max-width: 560px) 45vw, (max-width: 1120px) 30vw, 230px' : '(max-width: 560px) 100vw, (max-width: 820px) 50vw, 560px'}
        className="product-cover__image"
        style={{ objectPosition: product.coverPosition ?? '50% 50%' }}
      />
      {hasVideo && product.coverVideo ? <ProductCoverVideo src={product.coverVideo} objectPosition={product.coverPosition} priority={priority} /> : null}
      {product.brandLogo && !product.brandIntegrated ? <span className="product-cover__brand-plate"><Image src={product.brandLogo} alt="" width={280} height={100} className="product-cover__brand-mark" /></span> : null}
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
