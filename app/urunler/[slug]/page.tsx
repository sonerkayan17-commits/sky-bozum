import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCover from '../../components/products/ProductCover';
import ProductCatalog from '../../components/products/ProductCatalog';
import { getProduct, products } from '../../lib/products';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Sky Bozum`,
    description: product.description,
    alternates: { canonical: `/urunler/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <main className="products-page">
      <section className="product-detail-hero">
        <div className="products-shell product-detail-hero__grid">
          <div>
            <nav className="product-detail-hero__crumb" aria-label="Sayfa yolu"><Link href="/">Ana Sayfa</Link><span>/</span><Link href="/urunler">Ürünler</Link><span>/</span><span aria-current="page">{product.shortName}</span></nav>
            <p className="products-kicker" style={{ marginTop: 28 }}>{product.category} · {product.eyebrow}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-hero__summary">{product.description} Ürün bilgilerini, paket seçeneklerini ve kullanım öncesi kontrolleri tek sayfada inceleyin.</p>
          </div>
          <div className="product-detail-hero__cover"><ProductCover product={product} /></div>
        </div>
      </section>

      <div className="products-shell">
        <ProductCatalog product={product} />

        <section className="product-info" aria-labelledby="product-info-title">
          <div className="product-info__grid">
            <div className="product-info__about">
              <p className="product-kicker">Adım adım rehber</p>
              <h2 id="product-info-title">{product.guide.title}</h2>
              <p>{product.guide.text}</p>
              <p>{product.intro}</p>
              <a className="product-info__source" href={product.guide.sourceUrl} target="_blank" rel="noreferrer">{product.guide.sourceLabel} ↗</a>
            </div>
            <div className="product-info__steps" aria-label={`${product.shortName} kullanım kontrolleri`}>
              {product.howTo.map((item, index) => <article key={item.title} className="product-step"><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
            </div>
          </div>

          <section className="product-faq" aria-labelledby="product-faq-title">
            <p className="product-kicker">Sık sorulanlar</p>
            <h2 id="product-faq-title">{product.shortName} hakkında merak edilenler</h2>
            <div className="product-faq__list">{product.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
          </section>
        </section>

        <section className="product-related" aria-labelledby="product-related-title">
          <p className="product-kicker">Sonraki adım</p>
          <h2 id="product-related-title">Benzer ürünleri inceleyin</h2>
          <div className="product-related__grid">{product.related.map((relatedSlug) => { const related = getProduct(relatedSlug); return related ? <Link key={related.slug} href={`/urunler/${related.slug}`}><span>{related.shortName}</span><span aria-hidden="true">→</span></Link> : null; })}</div>
        </section>
      </div>
    </main>
  );
}
