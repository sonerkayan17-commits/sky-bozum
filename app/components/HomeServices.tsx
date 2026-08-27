import Image from 'next/image';
import Link from './DeferredLink';

const services = [
  {
    name: 'Mobil Ödeme Bozum',
    desc: 'Genel mobil bozum sürecini öğrenin; operatör sayfalarında dijital ürün satın alma, limit ve güvenlik adımlarını inceleyin.',
    benefit: 'Genel bilgi ve operatöre özel alım rehberi',
    href: '/operatorler',
    logos: [
      { src: '/brands/hero/vodafone.webp', alt: 'Vodafone' },
      { src: '/brands/hero/turkcell.webp', alt: 'Turkcell' },
      { src: '/brands/hero/turk-telekom.webp', alt: 'Türk Telekom' },
    ],
    tone: 'coral',
  },
  {
    name: 'Dijital Cüzdanla Ürün Alımı',
    desc: 'Vodafone Pay, Paycell ve Pokus ile desteklenen mağazalardan dijital ürün satın alma adımlarını ve kart kontrollerini görün.',
    benefit: 'Cüzdana özel satın alma ve güvenlik rehberi',
    href: '/hizmetler/paycell',
    logos: [
      { src: '/brands/hero/vodafone.webp', alt: 'Vodafone Pay' },
      { src: '/brands/hero/paycell.webp', alt: 'Paycell' },
      { src: '/brands/hero/pokus.webp', alt: 'Pokus' },
    ],
    badge: 'Bağımsız Rehber',
    tone: 'violet',
  },
  {
    name: 'Dijital Kod Bozum',
    desc: 'Razer Gold, Apple ve Steam kodları için hizmete özel kontrol, oran ve ödeme akışını inceleyin.',
    benefit: 'Kod türüne göre hızlı kontrol',
    href: '/hizmetler/razer-gold-tl',
    logos: [
      { src: '/brands/hero/razer.webp', alt: 'Razer Gold' },
      { src: '/brands/apple/apple.svg', alt: 'Apple', lightSurface: true },
      { src: '/brands/hero/steam.webp', alt: 'Steam' },
    ],
    tone: 'gold',
  },
] as const;

export default function HomeServices() {
  return (
    <section className="home-services" aria-labelledby="home-services-title">
      <div className="content-wide">
        <header className="home-services__head">
          <div>
            <p className="eyebrow">Hizmet seçenekleri</p>
            <h2 id="home-services-title">Bakiyenize uygun bozum yöntemini kolayca bulun.</h2>
            <p>Her hizmet için farklı işlem koşulları olabilir. Önce hizmeti seçin, yöntemi ve güncel oran bilgisini inceleyin.</p>
          </div>
          <Link href="/hizmetler" className="home-services__all">Tüm hizmetleri görüntüleyin <span>→</span></Link>
        </header>

        <div className="home-services__grid">
          {services.map((service, index) => (
            <article key={service.name} className={`home-service-card home-service-card--${service.tone}`}>
              <div className="home-service-card__top"><span>0{index + 1}</span><small>Hizmet grubu</small></div>
              <div className="home-service-card__logos" aria-label={`${service.name} desteklenen markalar`}>
                {service.logos.map((logo) => (
                  <span key={logo.src} className={'lightSurface' in logo && logo.lightSurface ? 'logo-surface logo-surface--light' : 'logo-surface'}>
                    <Image src={logo.src} alt={`${logo.alt} logosu`} width={112} height={48} className="object-contain" />
                  </span>
                ))}
              </div>
              {'badge' in service && service.badge ? <span className="home-service-card__badge">{service.badge}</span> : null}
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
              <div className="home-service-card__benefit"><i>✓</i>{service.benefit}</div>
              <Link href={service.href}>Detayları inceleyin <span>→</span></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
