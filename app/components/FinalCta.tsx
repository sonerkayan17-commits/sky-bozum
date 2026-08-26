import Image from 'next/image';
import Link from './DeferredLink';
import { siteConfig } from '../lib/site-config';
import { InlineEditableText } from './admin/SiteInlineEditor';

const walletGuides = [
  {
    href: '/bilgi-merkezi/mobil-odeme-nasil-acilir',
    image: '/images/bilgi-merkezi/editorial-covers-v46/mobil-odeme-nasil-acilir-v2.webp',
    alt: 'Turkcell Vodafone ve Türk Telekom mobil ödeme rehberi kapağı',
    label: 'Operatör rehberi',
    title: 'Turkcell, Vodafone ve Türk Telekom mobil ödeme nasıl kullanılır?',
    summary: 'Üç operatörde mobil ödeme, limit ve resmî onay adımlarını aynı rehberde görün.',
  },
  {
    href: '/bilgi-merkezi/razer-gold-kodu-nasil-satilir',
    image: '/images/bilgi-merkezi/editorial-covers-v46/razer-gold-kodu-satis-v2.webp',
    alt: 'Razer Gold kodu satmadan önce kontrol rehberi kapağı',
    label: 'Razer Gold',
    title: 'Razer Gold kodu satmadan önce hangi kontroller yapılır?',
    summary: 'Kodun bölgesi, para birimi ve kullanılmamış olması neden önemlidir, öğrenin.',
  },
  {
    href: '/bilgi-merkezi/apple-gift-card-nedir',
    image: '/images/bilgi-merkezi/editorial-covers-v46/apple-gift-card-bolge-bozum.webp',
    alt: 'Apple ve iTunes hediye kartı bölge kontrol rehberi kapağı',
    label: 'Apple / iTunes',
    title: 'iTunes bozdurmadan önce Apple Gift Card bölgesi nasıl kontrol edilir?',
    summary: 'TR ve USD kod farkını, mağaza bölgesini ve kullanımdan önceki temel kontrolleri inceleyin.',
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
              <span>{guide.summary}</span>
              <b>Rehberi okuyun <i aria-hidden="true">→</i></b>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
