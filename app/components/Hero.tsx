import Image from 'next/image';
import Link from 'next/link';
import { rateItems } from '../lib/rates';
import { siteConfig } from '../lib/site';

const featuredIds = ['vodafone', 'turkcell', 'turk-telekom', 'paycell', 'pokus', 'apple', 'razer-tl', 'steam'];
const featuredRates = featuredIds
  .map((id) => rateItems.find((item) => item.id === id))
  .filter((item): item is (typeof rateItems)[number] => Boolean(item));

const logos: Record<string, string> = {
  vodafone: '/brands/vodafone/vodafone.svg',
  turkcell: '/brands/turkcell/turkcell.svg',
  'turk-telekom': '/brands/turktelekom/turktelekom.svg',
  paycell: '/brands/paycell/paycell.svg',
  pokus: '/brands/pokus/pokus.svg',
  apple: '/brands/apple/apple.svg',
  'razer-tl': '/brands/razer/razer.svg',
  steam: '/brands/steam/steam.svg',
};

export default function Hero() {
  return (
    <section className="hero-pro" aria-labelledby="hero-title">
      <div className="hero-pro-grid" aria-hidden="true" />
      <div className="hero-pro-glow hero-pro-glow-one" aria-hidden="true" />
      <div className="hero-pro-glow hero-pro-glow-two" aria-hidden="true" />

      <div className="content-shell hero-pro-shell">
        <div className="hero-pro-copy">
          <p className="hero-pro-eyebrow"><span /> 3+ yıl aktif hizmet · 7/24 destek</p>
          <h1 id="hero-title">Mobil ödeme ve dijital bakiyenizi<br /><em>güvenle bozdurun.</em></h1>
          <p className="hero-pro-lead">Vodafone, Turkcell, Türk Telekom, Paycell, Pokus ve dijital bakiyeleriniz için işlem öncesinde net oran, güvenli süreç ve hızlı ödeme.</p>

          <div className="hero-pro-actions">
            <a href={siteConfig.liveSupportHref} target="_blank" rel="noopener noreferrer" className="hero-pro-primary">Güncel oranınızı öğrenin <span>→</span></a>
            <Link href="/araclar#hesapla" className="hero-pro-secondary">Oran hesaplayın</Link>
          </div>

          <div className="hero-pro-trust" aria-label="Hizmet avantajları">
            <div><span>01</span><b>İşlem öncesi oran</b><small>Sürpriz kesinti yok</small></div>
            <div><span>02</span><b>Kontrollü süreç</b><small>Yazılı teyit ile ilerleme</small></div>
            <div><span>03</span><b>Hızlı ödeme</b><small>Onay sonrası aktarım</small></div>
          </div>
        </div>

        <div className="hero-pro-visual" aria-label="Sky Bozum mobil işlem ekranı örneği">
          <div className="hero-pro-orbit hero-pro-orbit-a" aria-hidden="true" />
          <div className="hero-pro-orbit hero-pro-orbit-b" aria-hidden="true" />

          <div className="hero-pro-note hero-pro-note-rate"><small>ÖRNEK TABAN ORAN</small><strong>%70</strong><span>Hizmete göre değişebilir</span></div>
          <div className="hero-pro-note hero-pro-note-secure"><b>✓</b><span><strong>Kontrollü işlem</strong><small>Önce bilgi, sonra onay</small></span></div>

          <div className="hero-pro-phone">
            <div className="hero-pro-phone-rail" aria-hidden="true" />
            <div className="hero-pro-screen">
              <div className="hero-pro-island" aria-hidden="true" />
              <div className="hero-pro-status"><span>09:41</span><span>● ◒ ▰</span></div>

              <div className="hero-pro-apphead">
                <div className="hero-pro-appbrand"><Image src="/brand-logo.webp" alt="" width={38} height={38} priority fetchPriority="high" /><span><b>Sky Bozum</b><small>İşlem merkezi</small></span></div>
                <span className="hero-pro-appbadge">Yazılı teyit</span>
              </div>

              <div className="hero-pro-summary">
                <small>Tahmini ödeme</small>
                <strong>3.500,00 <span>TL</span></strong>
                <div><span>5.000 TL bakiye</span><b>%70 taban oran</b></div>
              </div>

              <div className="hero-pro-trust-card" aria-label="Sky Bozum güvenli hizmet mesajı">
                <div className="hero-pro-trust-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation">
                    <path d="M12 2.8 19 5.7v5.2c0 4.8-2.8 8.3-7 10.3-4.2-2-7-5.5-7-10.3V5.7L12 2.8Z" />
                    <path d="m8.8 12 2 2 4.5-4.7" />
                  </svg>
                </div>
                <div className="hero-pro-trust-message">
                  <small>SKY BOZUM</small>
                  <strong>Güvenli bozumun<br />tek adresi!</strong>
                  <span><i>✓</i> Kontrollü süreç <i>✓</i> Hızlı ödeme</span>
                </div>
                <svg className="hero-pro-trust-watermark" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.8 19 5.7v5.2c0 4.8-2.8 8.3-7 10.3-4.2-2-7-5.5-7-10.3V5.7L12 2.8Z" />
                  <path d="m8.8 12 2 2 4.5-4.7" />
                </svg>
              </div>

              <div className="hero-pro-flow">
                <div><i>1</i><span><b>Hizmeti seçin</b><small>Bakiyenizi belirtin</small></span></div>
                <div><i>2</i><span><b>Oranı onaylayın</b><small>Yazılı teyit alın</small></span></div>
                <div><i>3</i><span><b>Ödemenizi alın</b><small>Kontrol sonrası aktarım</small></span></div>
              </div>

              <a href={siteConfig.liveSupportHref} target="_blank" rel="noopener noreferrer" className="hero-pro-phone-cta">İşleme başlayın <span>→</span></a>
              <div className="hero-pro-homebar" aria-hidden="true" />
            </div>
          </div>
        </div>

        <aside className="hero-pro-rates" aria-label="Güncel taban oranlar">
          <div className="hero-pro-rates-head">
            <div><small>TABAN ORAN ARALIKLARI</small><h2>Hizmetlere göre oranlar</h2></div>
            <span>İşlem öncesi teyit</span>
          </div>
          <div className="hero-pro-rates-list">
            {featuredRates.map((item) => (
              <Link
                href={`/hizmetler/${item.serviceSlug}`}
                className="hero-pro-rate"
                key={item.id}
                aria-label={`${item.name} hizmet detaylarını ve güncel oran bilgisini görüntüle`}
                title={`${item.name} detaylarını görüntüle`}
              >
                <span className={`hero-pro-logo hero-pro-logo--${item.id} ${item.id === 'apple' ? 'hero-pro-logo--light' : ''}`}>
                  <Image src={logos[item.id]} alt={`${item.name} logosu`} width={78} height={26} />
                </span>
                <span className="hero-pro-rate-copy">
                  <b>{item.name}</b>
                  <small>{item.category}</small>
                  <span className="hero-pro-rate-detail" aria-hidden="true">Detayları görüntüle <i>→</i></span>
                </span>
                <strong>{item.range}</strong>
              </Link>
            ))}
          </div>
          <p className="hero-pro-disclaimer"><span>i</span> Kesin oran; hizmet, tutar ve stok kontrolünden sonra işlem öncesinde yazılı olarak paylaşılır.</p>
          <Link href="/hizmetler" className="hero-pro-rates-cta">Tüm hizmet ve oran detayları <span>→</span></Link>
        </aside>
      </div>
    </section>
  );
}
