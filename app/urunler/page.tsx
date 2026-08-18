import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCover from '../components/products/ProductCover';
import { products } from '../lib/products';

export const metadata: Metadata = {
  title: 'Oyun ve dijital ürünler',
  description: 'PUBG Mobile UC, Valorant VP, League of Legends RP, Metin2 Ejder Parası ve Razer Gold ürünlerini inceleyin.',
  keywords: ['PUBG Mobile UC', 'Valorant VP', 'League of Legends RP', 'Metin2 Ejder Parası', 'Razer Gold'],
  alternates: { canonical: '/urunler' },
};

export default function ProductsPage() {
  return (
    <main className="products-page">
      <section className="products-hero">
        <div className="products-shell products-hero__inner">
          <p className="products-kicker">Sky Bozum ürün kataloğu</p>
          <h1>Oyun bakiyenizi <em>tek ekranda</em> seçin.</h1>
          <p>Oyun ve dijital kod ürünlerini paket, bölge ve teslim bilgileriyle karşılaştırın. Her ürünün stok durumu ve kullanım koşulu ürün sayfasında açıkça gösterilir.</p>
          <div className="products-hero__chips" aria-label="Ürün kategorileri">
            <span>5 ürün grubu</span><span>Güncel katalog</span><span>Stok durumu açık</span>
          </div>
        </div>
      </section>

      <section className="products-directory products-shell" aria-labelledby="products-directory-title">
        <div className="products-directory__heading">
          <div><p className="products-kicker">Ürün grupları</p><h2 id="products-directory-title">İhtiyacınız olan ürünü bulun.</h2></div>
          <p>GTA VI ön siparişi bu katalogda yer almıyor. Diğer ürün grupları için paket detaylarını ve sık sorulan soruları inceleyebilirsiniz.</p>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <Link key={product.slug} href={`/urunler/${product.slug}`} className="product-directory-card" aria-label={`${product.name} ürün sayfasını aç`}>
              <div className="product-directory-card__cover"><ProductCover product={product} /></div>
              <div className="product-directory-card__body">
                <p className="product-kicker">{product.eyebrow}</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="product-directory-card__stock">Stok yok</span>
                <div className="product-directory-card__cta"><span>İncele</span><span aria-hidden="true">↗</span></div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
