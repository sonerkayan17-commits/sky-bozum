import type { Metadata } from 'next';
import Link from '../../components/DeferredLink';
import { notFound } from 'next/navigation';
import ProductCover from '../../components/products/ProductCover';
import ProductCatalog from '../../components/products/ProductCatalog';
import { getProduct, products } from '../../lib/products';
import { absoluteUrl, breadcrumbSchema, createMetadata, jsonLd } from '../../lib/seo';
import '../../styles/products-performance.css';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return createMetadata({
    title: `${product.name} | Sky Bozum`,
    description: `${product.description} Paket, bölge, kullanım ve stok koşullarını adım adım inceleyin.`,
    path: `/urunler/${product.slug}`,
    image: product.coverImage,
    imageAlt: `${product.name} ürün kapağı`,
    keywords: [product.name, `${product.shortName} paketleri`, `${product.shortName} rehberi`, 'dijital ürün stok durumu'],
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const canonical = absoluteUrl(`/urunler/${product.slug}`);
  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${canonical}#product`,
        name: product.name,
        description: `${product.description} ${product.intro}`,
        image: absoluteUrl(product.coverImage),
        category: product.category,
        brand: { '@type': 'Brand', name: product.shortName },
        url: canonical,
        offers: {
          '@type': 'Offer',
          url: canonical,
          availability: 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
      },
      breadcrumbSchema([
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Ürünler', path: '/urunler' },
        { name: product.shortName, path: `/urunler/${product.slug}` },
      ]),
    ],
  };

  const journeyLinks = [
    { href: '/araclar#oran-hesapla', label: 'Yaklaşık ödeme hesaplayın', note: 'Tutarı ve oran aralığını birlikte görün.' },
    { href: '/bilgi-merkezi', label: 'Bilgi Merkezi rehberleri', note: 'Kullanım, bölge ve güvenlik notlarını okuyun.' },
    { href: '/guven-merkezi', label: 'Güvenlik kontrolü', note: 'İşlem öncesi paylaşılmaması gerekenleri kontrol edin.' },
    { href: '/iletisim', label: 'Stok ve uygunluk sorun', note: 'Güncel katalog durumunu yazılı olarak teyit edin.' },
  ];

  return (
    <main className="products-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productSchema) }} />
      <section className="product-detail-hero">
        <div className="products-shell product-detail-hero__grid">
          <div>
            <nav className="product-detail-hero__crumb" aria-label="Sayfa yolu"><Link href="/">Ana Sayfa</Link><span>/</span><Link href="/urunler">Ürünler</Link><span>/</span><span aria-current="page">{product.shortName}</span></nav>
            <p className="products-kicker" style={{ marginTop: 28 }}>{product.category} · {product.eyebrow}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-hero__summary">{product.description} Ürün bilgilerini, paket seçeneklerini ve kullanım öncesi kontrolleri tek sayfada inceleyin.</p>
          </div>
          <div className="product-detail-hero__cover"><ProductCover product={product} priority /></div>
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

        <nav className="product-journey" aria-label="Ürün işlem yolculuğu">
          <div className="product-journey__heading"><p className="product-kicker">Devam etmek için</p><h2>Ürünü incelemekten işleme kadar ilerleyin.</h2></div>
          <div className="product-journey__links">{journeyLinks.map((item) => <Link key={item.href} href={item.href}><span><strong>{item.label}</strong><small>{item.note}</small></span><b aria-hidden="true">→</b></Link>)}</div>
        </nav>
      </div>
    </main>
  );
}
