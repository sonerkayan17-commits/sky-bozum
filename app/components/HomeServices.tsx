import Image from 'next/image';
import Link from './DeferredLink';

const services = [
  {
    name: 'Mobil Ödeme Bozum',
    desc: 'Vodafone, Turkcell ve Türk Telekom hatları için işlem yöntemi, limit ve oran bilgisini önceden öğrenin.',
    benefit: 'Operatöre özel yönlendirme',
    href: '/operatorler',
    logos: [
      { src: '/brands/vodafone/vodafone.svg', alt: 'Vodafone' },
      { src: '/brands/turkcell/turkcell.svg', alt: 'Turkcell' },
      { src: '/brands/turktelekom/turktelekom.svg', alt: 'Türk Telekom' },
    ],
    tone: 'coral',
  },
  {
    name: 'Dijital Cüzdan Bozum',
    desc: 'Vodafone Pay, Paycell ve Pokus bakiyeleri için uygun işlem adımlarını ve tahmini ödeme tutarını net biçimde görün.',
    benefit: 'Anında bakiye kontrolü ve yazılı oran teyidi',
    href: '/hizmetler/paycell',
    logos: [
      { src: '/brands/vodafone/vodafone.svg', alt: 'Vodafone Pay' },
      { src: '/brands/paycell/paycell.svg', alt: 'Paycell' },
      { src: '/brands/pokus/pokus.svg', alt: 'Pokus' },
    ],
    badge: 'Anında Bakiye',
    tone: 'violet',
  },
  {
    name: 'Dijital Kod Bozum',
    desc: 'Razer Gold, Apple ve Steam kodları için hizmete özel kontrol, oran ve ödeme akışını inceleyin.',
    benefit: 'Kod türüne göre hızlı kontrol',
    href: '/hizmetler/razer-gold-tl',
    logos: [
      { src: '/brands/razer/razer.svg', alt: 'Razer Gold' },
      { src: '/brands/apple/apple.svg', alt: 'Apple', lightSurface: true },
      { src: '/brands/steam/steam.svg', alt: 'Steam' },
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
