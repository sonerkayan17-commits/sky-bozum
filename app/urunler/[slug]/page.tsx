import type { Metadata } from 'next';
import Link from '../../components/DeferredLink';
import { notFound } from 'next/navigation';
import ProductCover from '../../components/products/ProductCover';
import ProductCatalog from '../../components/products/ProductCatalog';
import { getProduct, getProductFacts, products } from '../../lib/products';
import { absoluteUrl, breadcrumbSchema, createMetadata, jsonLd } from '../../lib/seo';
import '../../styles/products-performance.css';
import '../../styles/products-quality-pass.css';
import '../../styles/products-video-covers.css';
import '../../styles/product-detail-hierarchy.css';
import '../../styles/razer-commerce.css';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return createMetadata({
    title: product.name,
    description: `${product.description} Paket, bölge, kullanım ve stok koşullarını adım adım inceleyin.`,
    path: `/urunler/${product.slug}`,
    image: product.heroImage ?? product.coverImage,
    imageAlt: `${product.name} ürün kapağı`,
    keywords: [product.name, `${product.shortName} satın al`, `${product.shortName} paketleri`, `${product.shortName} fiyat`, `${product.shortName} rehberi`, 'dijital ürün stok durumu'],
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
        image: absoluteUrl(product.heroImage ?? product.coverImage),
        category: product.category,
        brand: { '@type': 'Brand', name: product.shortName },
        url: canonical,
      },
      {
        '@type': 'HowTo',
        '@id': `${canonical}#howto`,
        name: `${product.shortName} nasıl kullanılır?`,
        description: product.guide.text,
        inLanguage: 'tr-TR',
        step: product.howTo.map((item, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: item.title,
          text: item.text,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: product.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
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
    { href: '/iletisim#guvenlik', label: 'Güvenlik kontrolü', note: 'İşlem öncesi paylaşılmaması gerekenleri kontrol edin.' },
    { href: '/iletisim', label: 'Stok ve uygunluk sorun', note: 'Güncel katalog durumunu yazılı olarak teyit edin.' },
  ];
  const facts = getProductFacts(product);

  return (
    <main className={`products-page products-page--${product.tone}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productSchema) }} />
      <section className="product-detail-hero">
        <div className="products-shell product-detail-hero__grid">
          <div className="product-detail-hero__copy">
            <nav className="product-detail-hero__crumb" aria-label="Sayfa yolu"><Link href="/">Ana Sayfa</Link><span>/</span><Link href="/urunler">Ürünler</Link><span>/</span><span aria-current="page">{product.shortName}</span></nav>
            <p className="products-kicker" style={{ marginTop: 28 }}>{product.category} · {product.eyebrow}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-hero__summary">{product.description} Ürün bilgilerini, paket seçeneklerini ve kullanım öncesi kontrolleri tek sayfada inceleyin.</p>
            <nav className="product-detail-hero__nav" aria-label="Ürün sayfası bölümleri">
              <a href="#paketler">Paketler</a><a href="#urun-bilgisi">Ürün bilgisi</a><a href="#kullanim-rehberi">Kullanım rehberi</a><a href="#sss">S.S.S.</a>
            </nav>
          </div>
          <div className="product-detail-hero__cover"><ProductCover product={product} priority disableVideo /></div>
          <dl className="product-detail-hero__facts" aria-label={`${product.shortName} hızlı ürün bilgileri`}>
            {facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
          </dl>
        </div>
      </section>

      <div className="products-shell">
        <ProductCatalog product={product} />

        <section id="urun-bilgisi" className="product-explainer" aria-labelledby="product-explainer-title">
          <div className="product-explainer__heading">
            <div>
              <p className="product-kicker">02 / Ürünü tanıyın</p>
              <h2 id="product-explainer-title">{product.shortName} hakkında temel bilgiler</h2>
            </div>
            <p>Satın alma veya bozum kararından önce ürünün kullanım biçimini, teslim koşulunu ve güvenlik sınırlarını birlikte değerlendirin.</p>
          </div>
          <div className="product-explainer__grid">
            {product.details.map((item, index) => (
              <article key={item.title}>
                <span>0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {product.slug === 'razer-gold' ? <section className="razer-sell-panel" aria-labelledby="razer-sell-title">
          <div className="razer-sell-panel__intro"><p className="product-kicker">Razer Gold kod bozum merkezi</p><h2 id="razer-sell-title">Kodu canlı gönderin, her kontrol ve ödeme adımını hesabınızdan izleyin.</h2><p>Kullanılmamış TL veya USD PIN’i üye alanındaki şifreli kasaya gönderin. Yönetici kodları tek tek kontrol eder; kabul edilen kodlar için net tutarı onaylar ve seçtiğiniz ödeme hedefinde kayıtlı bir hareket oluşturur.</p><div><Link href="/hesabim/talepler?service=razer-gold-tl">TL kod satışı başlat →</Link><Link href="/hesabim/talepler?service=razer-gold-usd">USD kod satışı başlat</Link></div></div>
          <div className="razer-sell-panel__steps"><article><span>01</span><strong>PIN’i şifreli gönderin</strong><p>Aynı kod ikinci kez kabul edilmez; açık PIN public veya profil ekranında gösterilmez.</p></article><article><span>02</span><strong>Tek tek kod kontrolü</strong><p>Her kod geçerli veya geçersiz olarak işaretlenir. Kısmi kabul varsa yalnız kabul edilen adet hesaplanır.</p></article><article><span>03</span><strong>Net tutarı görün</strong><p>Ödeme onayı ve işlem durumu üye hesabına anlık yansır; tahmini tutar kesin ödeme sayılmaz.</p></article><article><span>04</span><strong>Ödemenizi alın</strong><p>Cüzdan ödemesi bakiyeye atomik işlenir. IBAN ödemesi banka referansıyla işlem kaydına eklenir.</p></article></div>
          <aside className="razer-sell-panel__payout"><div><span>ÖDEME SEÇENEKLERİ</span><strong>Sky Bozum cüzdanı</strong><p>Onaylanan tutar hesabınıza eklenir ve stoktaki ürün alışverişlerinde kullanılabilir.</p><Link href="/hesabim/cuzdan">Cüzdanı görüntüle →</Link></div><div><span>ÖDEME SEÇENEKLERİ</span><strong>Kayıtlı IBAN</strong><p>IBAN ve hesap sahibi yalnız size ve yetkili yöneticilere görünür. Transfer, referans kaydı olmadan tamamlanmış sayılmaz.</p><Link href="/hesabim/banka-bilgileri">IBAN bilgilerim →</Link></div></aside>
          <p className="razer-sell-panel__notice">Hesap şifresi, SMS doğrulama kodu veya banka parolası istenmez. Kodun kullanılmamış ve size ait olması gerekir; ödeme yalnız doğrulanan kodlar için oluşturulur.</p>
        </section> : null}

        <section id="kullanim-rehberi" className="product-info" aria-labelledby="product-info-title">
          <div className="product-info__grid">
            <div className="product-info__about">
              <p className="product-kicker">03 / Adım adım rehber</p>
              <h2 id="product-info-title">{product.guide.title}</h2>
              <p>{product.guide.text}</p>
              <p>{product.intro}</p>
              <a className="product-info__source" href={product.guide.sourceUrl} target="_blank" rel="noreferrer">{product.guide.sourceLabel} ↗</a>
            </div>
            <div className="product-info__steps" aria-label={`${product.shortName} kullanım kontrolleri`}>
              {product.howTo.map((item, index) => <article key={item.title} className="product-step"><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
            </div>
          </div>

          <section id="sss" className="product-faq" aria-labelledby="product-faq-title">
            <p className="product-kicker">04 / Sık sorulanlar</p>
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
