import type { Metadata } from 'next';
import Link from '../components/DeferredLink';
import ProductDirectory from '../components/products/ProductDirectory';
import { products } from '../lib/products';
import { absoluteUrl, createMetadata, jsonLd } from '../lib/seo';
import '../styles/products-performance.css';
import '../styles/products-quality-pass.css';
import '../styles/products-video-covers.css';

export const metadata: Metadata = createMetadata({
  title: 'Oyun ve dijital ürünler',
  description: 'PUBG Mobile UC, Valorant VP, League of Legends RP, Metin2 Ejder Parası ve Razer Gold ürünlerini paket, bölge ve stok bilgileriyle inceleyin.',
  path: '/urunler',
  keywords: ['PUBG Mobile UC', 'Valorant VP', 'League of Legends RP', 'Metin2 Ejder Parası', 'Razer Gold'],
});

export default function ProductsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${absoluteUrl('/urunler')}#catalog`,
        name: 'Sky Bozum oyun ve dijital ürün kataloğu',
        description: 'Oyun bakiyesi ve dijital kod ürünleri için paket, bölge ve kullanım koşulları kataloğu.',
        url: absoluteUrl('/urunler'),
        inLanguage: 'tr-TR',
        isPartOf: { '@id': `${absoluteUrl('/')}#website` },
        mainEntity: { '@id': `${absoluteUrl('/urunler')}#product-list` },
      },
      {
        '@type': 'ItemList',
        '@id': `${absoluteUrl('/urunler')}#product-list`,
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.name,
          url: absoluteUrl(`/urunler/${product.slug}`),
        })),
      },
    ],
  };

  return (
    <main className="products-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <section className="products-hero">
        <div className="products-shell products-hero__layout">
          <div className="products-hero__inner">
            <p className="products-kicker">Sky Bozum ürün kataloğu</p>
            <h1>Oyun bakiyenizi <em>tek ekranda</em> seçin.</h1>
            <p>Oyun ve dijital kod ürünlerini paket, bölge ve teslim bilgileriyle karşılaştırın. Her ürünün stok durumu ve kullanım koşulu ürün sayfasında açıkça gösterilir.</p>
            <div className="products-hero__chips" aria-label="Ürün kategorileri">
              <span>5 ürün grubu</span><span>Güncel katalog</span><span>Stok durumu açık</span>
            </div>
          </div>
          <aside className="products-hero__aside" aria-label="Ürün kataloğunu kullanma adımları">
            <p className="products-kicker">Kataloğu kullanın</p>
            <h2>Karar vermeden önce üç kısa kontrol.</h2>
            <ol>
              <li><span>01</span><div><strong>Ürünü seçin</strong><small>Oyun veya dijital bakiye grubunu açın.</small></div></li>
              <li><span>02</span><div><strong>Paket ve bölgeyi okuyun</strong><small>Tutar, para birimi ve kullanım şartını karşılaştırın.</small></div></li>
              <li><span>03</span><div><strong>Stok durumunu teyit edin</strong><small>Stok açılmadan satın alma yapmayın.</small></div></li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="products-directory products-shell" aria-labelledby="products-directory-title">
        <div className="products-directory__heading">
          <div><p className="products-kicker">Ürün grupları</p><h2 id="products-directory-title">İhtiyacınız olan ürünü bulun.</h2></div>
          <p>GTA VI ön siparişi bu katalogda yer almıyor. Diğer ürün grupları için paket detaylarını ve sık sorulan soruları inceleyebilirsiniz.</p>
        </div>
        <ProductDirectory />
      </section>

      <nav className="products-crosslinks products-shell" aria-label="Ürün kataloğu bağlantıları">
        <span>İşlem öncesi</span>
        <Link href="/hizmetler">Hizmetleri ve oranları inceleyin <b aria-hidden="true">→</b></Link>
        <Link href="/araclar#oran-hesapla">Yaklaşık ödeme hesaplayın <b aria-hidden="true">→</b></Link>
        <Link href="/bilgi-merkezi">Kullanım ve güvenlik rehberlerini okuyun <b aria-hidden="true">→</b></Link>
      </nav>
    </main>
  );
}
