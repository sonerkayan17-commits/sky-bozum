import Image from 'next/image';
import Link from './DeferredLink';

const brands = [
  { name: 'Vodafone', sub: 'Mobil ödeme bozum', logo: '/brands/vodafone/vodafone.svg', href: '/hizmetler/vodafone-mobil-odeme', tone: 'brand-vodafone' },
  { name: 'Turkcell', sub: 'Mobil ödeme bozum', logo: '/brands/turkcell/turkcell.svg', href: '/hizmetler/turkcell-mobil-odeme', tone: 'brand-turkcell' },
  { name: 'Türk Telekom', sub: 'Mobil ödeme bozum', logo: '/brands/turktelekom/turktelekom.svg', href: '/hizmetler/turk-telekom-mobil-odeme', tone: 'brand-telekom' },
  { name: 'Paycell', sub: 'Cüzdan bakiyesi bozum', logo: '/brands/paycell/paycell.svg', href: '/hizmetler/paycell', tone: 'brand-paycell' },
  { name: 'Pokus', sub: 'Cüzdan bakiyesi bozum', logo: '/brands/pokus/pokus.svg', href: '/hizmetler/pokus', tone: 'brand-pokus' },
  { name: 'Razer Gold', sub: 'TL ve USD kod bozum', logo: '/brands/razer/razer.svg', href: '/hizmetler/razer-gold-tl', tone: 'brand-razer' },
  { name: 'Apple', sub: 'Hediye kartı bozum', logo: '/brands/apple/apple.svg', href: '/hizmetler/itunes-apple', tone: 'brand-apple' },
  { name: 'Steam', sub: 'Cüzdan kodu bozum', logo: '/brands/steam/steam.svg', href: '/hizmetler/steam', tone: 'brand-steam' },
] as const;

export default function BrandStrip() {
  return (
    <section className="brand-strip" aria-labelledby="brand-strip-title">
      <div className="content-wide">
        <header className="brand-strip-header">
          <div>
            <p className="brand-strip-kicker">Desteklenen hizmetler</p>
            <h2 id="brand-strip-title">Bozum yaptığımız hizmetler</h2>
            <p className="brand-strip-summary">Mobil ödeme, dijital cüzdan ve kod bakiyelerinizi hangi yöntemlerle bozabileceğinizi tek ekranda görün.</p>
          </div>
          <Link href="/hizmetler" className="brand-strip-all focus-ring">Tüm bozum hizmetleri <span>→</span></Link>
        </header>

        <div className="brand-strip-grid">
          {brands.map((brand) => (
            <Link key={brand.name} href={brand.href} className={`brand-strip-card ${brand.tone} focus-ring`} aria-label={`${brand.name}: ${brand.sub}. Yöntem ve oran detaylarını incele`}>
              <span className={`brand-strip-logo ${brand.tone} ${brand.name === 'Apple' ? 'brand-strip-logo--light' : ''}`} aria-hidden="true"><Image src={brand.logo} alt="" width={104} height={36} className="brand-strip-logo-image" /></span>
              <span className="brand-strip-copy"><strong>{brand.name}</strong><small>{brand.sub}</small><em>Bozum detayları</em></span>
              <svg className="brand-strip-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.5 4.5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          ))}
        </div>
        <div className="brand-strip-benefit"><span>8 bozum hizmeti</span><i /> <span>Güncel taban oranlar</span><i /> <span>İşlem öncesi yazılı teklif</span></div>
      </div>
    </section>
  );
}
