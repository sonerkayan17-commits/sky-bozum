import Image from 'next/image';
import Link from './DeferredLink';
import { siteConfig } from '../lib/site-config';
import { InlineEditableText } from './admin/SiteInlineEditor';

const walletGuides = [
  {
    href: '/bilgi-merkezi/paycell-nedir-nasil-kullanilir',
    image: '/images/bilgi-merkezi/editorial-covers-v46/dijital-cuzdan-konu-merkezi.webp',
    alt: 'Paycell bakiye ve kullanım rehberi kapağı',
    label: 'Paycell',
    title: 'Bakiye ve kullanım nasıl çalışır?',
  },
  {
    href: '/bilgi-merkezi/razer-gold-kodu-nasil-satilir',
    image: '/images/bilgi-merkezi/editorial-covers-v46/razer-gold-kodu-satis-v2.webp',
    alt: 'Razer Gold kodunu doğrudan satma rehberi kapağı',
    label: 'Razer Gold',
    title: '14 haneli kodu nasıl satılır?',
  },
  {
    href: '/bilgi-merkezi/apple-gift-card-nedir',
    image: '/images/bilgi-merkezi/editorial-covers-v46/apple-gift-card-bolge-bozum.webp',
    alt: 'Apple ve iTunes 500 TL kod satışı rehberi kapağı',
    label: 'Apple / iTunes',
    title: 'Apple hediye kartında bölge kontrolü',
  },
] as const;

export default function FinalCta() {
  return (
    <section className="home-contact-band" aria-labelledby="support-card-title">
      <div className="home-contact-band__copy">
        <p><i aria-hidden="true" /> Sky Bozum resmî iletişim</p>
        <h2 id="support-card-title">Talebinizi iletin.<br /><em>Net teklifinizi görün.</em></h2>
        <InlineEditableText contentKey="home.final-cta.description" defaultValue="Hizmet ve tutarı paylaşın; oranı, tahmini ödemeyi ve işlem koşullarını karar vermeden önce yazılı alın." multiline />
      </div>

      <div className="home-contact-band__actions">
        <a href={siteConfig.liveSupportHref} target="_blank" rel="noopener noreferrer" className="focus-ring">
          WhatsApp’tan teklif alın <b aria-hidden="true">↗</b>
        </a>
        <nav aria-label="Destek bağlantıları">
          <Link href="/iletisim">Tüm iletişim kanalları <span aria-hidden="true">→</span></Link>
          <Link href="/iletisim#guvenlik">Güvenli iletişim standardımız <span aria-hidden="true">→</span></Link>
        </nav>
      </div>

      <div className="home-contact-band__facts" aria-label="İletişim güvenceleri">
        <p><span>01</span><strong>Yazılı teklif</strong><small>Oran ve net ödeme görünür</small></p>
        <p><span>02</span><strong>Kontrollü süreç</strong><small>Karar yalnızca size ait</small></p>
        <p><span>03</span><strong>Güvenli sınır</strong><small>Şifre ve SMS kodu istenmez</small></p>
      </div>

      <div className="home-contact-band__guides" aria-label="Cüzdan ve doğrudan kod satışı rehberleri">
        {walletGuides.map((guide) => (
          <Link href={guide.href} key={guide.href} className="focus-ring">
            <span className="home-contact-band__guide-cover">
              <Image src={guide.image} alt={guide.alt} fill loading="lazy" sizes="(max-width: 640px) 112px, 190px" />
            </span>
            <span className="home-contact-band__guide-copy">
              <small>{guide.label}</small>
              <strong>{guide.title}</strong>
              <b>Rehberi okuyun <i aria-hidden="true">→</i></b>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
