import Link from 'next/link';

const serviceLinks = [
  { href: '/', label: 'Mobil Ödeme Bozdurma Rehberi', detail: 'Süreç, oran ve güvenlik kontrolleri' },
  { href: '/hizmetler/turkcell-mobil-odeme', label: 'Turkcell Mobil Ödeme Bozdurma', detail: 'Limit ve dijital ürün alımı' },
  { href: '/hizmetler/vodafone-mobil-odeme', label: 'Vodafone Mobil Ödeme Bozdurma', detail: 'Onay ve kullanım adımları' },
  { href: '/hizmetler/turk-telekom-mobil-odeme', label: 'Türk Telekom Mobil Ödeme Bozdurma', detail: 'Limit ve mağaza kontrolleri' },
  { href: '/bilgi-merkezi/dijital-kod-hediye-karti-rehberi', label: 'Dijital Bakiye Bozdurma Rehberi', detail: 'Kod türleri ve değerlendirme koşulları' },
  { href: '/hizmetler/paycell', label: 'Paycell Nakite Çevirme Rehberi', detail: 'Bakiye ve dijital ürün alımı' },
  { href: '/hizmetler/pokus', label: 'Pokus Nakite Çevirme Rehberi', detail: 'Kart, bakiye ve kullanım' },
  { href: '/hizmetler/razer-gold-tl', label: 'Razer Gold Bozdurma', detail: 'TL kod kontrolü ve değerlendirme' },
  { href: '/hizmetler/itunes-apple', label: 'Apple / iTunes Bozdurma', detail: 'Bölge ve kod uygunluğu' },
  { href: '/hizmetler/steam', label: 'Steam Cüzdan Kodu', detail: 'Para birimi ve bölge kontrolü' },
] as const;

export default function ArticleServicesDirectory() {
  return (
    <section className="article-services-directory" aria-labelledby="article-services-title">
      <div className="article-services-directory__intro">
        <p>İLGİLİ SAYFALAR</p>
        <h2 id="article-services-title">Diğer Hizmetlerimiz</h2>
        <div>
          <p>Mobil ödeme yöntemleri operatöre göre değiştiği için Turkcell, Vodafone ve Türk Telekom için ayrı kullanım rehberleri hazırladık. Dijital cüzdan ve kod sayfalarında ise ürünün bölgesi, teslim koşulu ve güvenlik kontrolleri açıklanır.</p>
          <p>Sky Bozum operatör veya cüzdan bakiyesini doğrudan satın almaz. Rehberler, bu yöntemlerle güvenli dijital ürün alımını açıklar; desteklenen kullanılmamış kodlar stok ve uygunluk kontrolünden sonra ayrıca değerlendirilebilir.</p>
        </div>
      </div>
      <nav className="article-services-directory__links" aria-label="Diğer hizmet ve rehber bağlantıları">
        {serviceLinks.map((item) => (
          <Link key={item.href} href={item.href} className="focus-ring">
            <span><strong>{item.label}</strong><small>{item.detail}</small></span>
            <b aria-hidden="true">→</b>
          </Link>
        ))}
      </nav>
    </section>
  );
}
