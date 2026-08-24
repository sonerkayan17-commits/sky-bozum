import Image from 'next/image';
import Link from './DeferredLink';

const brands = [
  { name: 'Vodafone', sub: 'Mobil ödeme bozdur rehberi', action: 'Kod alım yöntemleri', logo: '/brands/vodafone/vodafone.svg', href: '/hizmetler/vodafone-mobil-odeme', tone: 'brand-vodafone' },
  { name: 'Turkcell', sub: 'Mobil ödeme bozdur rehberi', action: 'Kod alım yöntemleri', logo: '/brands/turkcell/turkcell.svg', href: '/hizmetler/turkcell-mobil-odeme', tone: 'brand-turkcell' },
  { name: 'Türk Telekom', sub: 'Mobil ödeme bozdur rehberi', action: 'Kod alım yöntemleri', logo: '/brands/turktelekom/turktelekom.svg', href: '/hizmetler/turk-telekom-mobil-odeme', tone: 'brand-telekom' },
  { name: 'Paycell', sub: 'Paycell bozdur rehberi', action: 'Razer Gold yöntemi', logo: '/brands/paycell/paycell.svg', href: '/hizmetler/paycell', tone: 'brand-paycell' },
  { name: 'Pokus', sub: 'Pokus bozdur rehberi', action: 'Razer Gold yöntemi', logo: '/brands/pokus/pokus.svg', href: '/hizmetler/pokus', tone: 'brand-pokus' },
  { name: 'Razer Gold', sub: 'TL ve USD kod bozum', action: 'Bozum detayları', logo: '/brands/razer/razer.svg', href: '/hizmetler/razer-gold-tl', tone: 'brand-razer' },
  { name: 'Apple', sub: 'Hediye kartı bozum', action: 'Bozum detayları', logo: '/brands/apple/apple.svg', href: '/hizmetler/itunes-apple', tone: 'brand-apple' },
  { name: 'Steam', sub: 'Cüzdan kodu bozum', action: 'Bozum detayları', logo: '/brands/steam/steam.svg', href: '/hizmetler/steam', tone: 'brand-steam' },
] as const;

export default function BrandStrip() {
  return (
    <section className="brand-strip" aria-labelledby="brand-strip-title">
      <div className="content-wide">
        <header className="brand-strip-header">
          <div>
            <p className="brand-strip-kicker">Desteklenen hizmetler</p>
            <h2 id="brand-strip-title">Rehberler ve desteklenen kod hizmetleri</h2>
            <p className="brand-strip-summary">Operatör ve cüzdanlarla dijital ürün satın alma rehberlerini; desteklenen kodlar için bozum hizmetlerini tek ekranda görün.</p>
          </div>
          <Link href="/hizmetler" className="brand-strip-all focus-ring">Tüm rehber ve hizmetler <span>→</span></Link>
        </header>

        <div className="brand-strip-grid">
          {brands.map((brand) => (
            <Link key={brand.name} href={brand.href} className={`brand-strip-card ${brand.tone} focus-ring`} aria-label={`${brand.name}: ${brand.sub}. Detayları incele`}>
              <span className={`brand-strip-logo ${brand.tone} ${brand.name === 'Apple' ? 'brand-strip-logo--light' : ''}`} aria-hidden="true"><Image src={brand.logo} alt="" width={104} height={36} className="brand-strip-logo-image" /></span>
              <span className="brand-strip-copy"><strong>{brand.name}</strong><small>{brand.sub}</small><em>{brand.action}</em></span>
              <svg className="brand-strip-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.5 4.5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          ))}
        </div>
        <div className="brand-strip-benefit"><span>5 bağımsız alım rehberi</span><i /> <span>3 kod bozum hizmeti</span><i /> <span>İşlem öncesi açık bilgilendirme</span></div>
      </div>
    </section>
  );
}
