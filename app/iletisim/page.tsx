import ContactChannels, { type ContactChannel } from './_components/ContactChannels';
import ContactHero from './_components/ContactHero';
import ContactConfidence from './_components/ContactConfidence';
import ContactFaqPreview from './_components/ContactFaqPreview';
import ContactFinalCta from './_components/ContactFinalCta';
import ContactSectionNav from './_components/ContactSectionNav';
import Link from 'next/link';
import { siteConfig } from '../lib/site-config';
import { contactFaqItems } from './contactData';
import { absoluteUrl, createMetadata, jsonLd, SITE_LANGUAGE, SITE_URL } from '../lib/seo';
import './contact-premium.css';
import './contact-hero-compact.css';
import './contact-hero-density.css';
import './contact-hero-type-balance.css';
import './contact-hero-bridge.css';
import './contact-hero-brandmark.css';
import './contact-hero-logo-correct.css';
import './contact-hero-logo-full.css';
import './contact-hero-logo-responsive.css';
import './contact-hero-logo-final.css';
import './contact-hero-logo-symbol.css';
import './contact-hero-logo-complete.css';

export const metadata = createMetadata({
  title: 'Sky Bozum İletişim ve Destek Merkezi',
  description: 'Sky Bozum resmi iletişim merkezi: güncel mobil ödeme bozum oranı, güvenli bozum talebi, işlem desteği ve doğrulanmış WhatsApp bağlantısı.',
  path: '/iletisim',
  image: '/hero-customer.webp',
  imageAlt: 'Sky Bozum resmi iletişim ve destek merkezi',
  keywords: ['Sky Bozum iletişim','mobil ödeme bozum destek','bozum WhatsApp','güncel bozum oranı','bozumcu.net iletişim'],
});

const channels = [
  { title: 'WhatsApp Destek', eyebrow: 'En hızlı resmi kanal', response: '7/24 talep bırakabilirsiniz', value: siteConfig.phone, href: siteConfig.whatsapp, note: 'Güncel oran, işlem uygunluğu ve süreç desteği için öncelikli iletişim kanalı.', kind: 'whatsapp', external: true, primary: true },
  { title: 'Telefon', eyebrow: 'Doğrudan görüşme', response: 'Uygunluk durumuna göre dönüş', value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, '')}`, note: 'Görüşme gerektiren konular için resmi Sky Bozum hattı.', kind: 'phone' },
  { title: 'E-posta', eyebrow: 'Kurumsal ve yazılı talepler', response: 'Detaylı başvurular için', value: siteConfig.email, href: `mailto:${siteConfig.email}`, note: 'Kurumsal, ayrıntılı veya yazılı kayıt gerektiren talepler için.', kind: 'email' },
] satisfies readonly ContactChannel[];

const contactPageUrl = absoluteUrl('/iletisim');
const contactPointId = `${contactPageUrl}#customer-support`;
const contactBreadcrumbJsonLd = { '@type': 'BreadcrumbList', '@id': `${contactPageUrl}#breadcrumb`, itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: absoluteUrl('/') },
  { '@type': 'ListItem', position: 2, name: 'İletişim', item: contactPageUrl },
] };
const contactPageJsonLd = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'ContactPage', '@id': `${contactPageUrl}#contact-page`, name: 'Sky Bozum İletişim ve Destek Merkezi', description: 'Sky Bozum resmi iletişim kanalları, güncel oran bilgisi ve işlem desteği.', url: contactPageUrl, inLanguage: SITE_LANGUAGE, isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': `${SITE_URL}/#organization` }, mainEntity: { '@id': contactPointId } },
  { '@type': 'ContactPoint', '@id': contactPointId, contactType: 'customer support', telephone: `+90${siteConfig.phone.replace(/\D/g, '').replace(/^0/, '')}`, email: siteConfig.email, availableLanguage: ['tr-TR'], areaServed: { '@type': 'Country', name: 'Türkiye' }, url: siteConfig.whatsapp },
  { '@type': 'FAQPage', '@id': `${contactPageUrl}#faq`, mainEntity: contactFaqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  contactBreadcrumbJsonLd,
] };

export default function Page() {
  return (
    <main id="main-content" className="contact-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(contactPageJsonLd) }} />
      <ContactHero whatsappHref={siteConfig.whatsapp} email={siteConfig.email} />
      <ContactSectionNav />

      <div className="content-shell contact-main-shell">
        <section className="contact-section contact-channel-section" aria-labelledby="contact-channels-title">
          <div className="contact-section-header">
            <div>
              <p className="contact-eyebrow">İletişim kanalları</p>
              <h2 id="contact-channels-title" className="contact-section-title">Talebinizi seçin.<br/>Doğru kanala geçin.</h2>
              <p className="contact-section-copy">İşlem türünüzü ve yaklaşık tutarı paylaşın; gerekli bilgileri güvenli biçimde netleştirelim.</p>
            </div>
            <div className="contact-section-index" aria-hidden="true"><span>01</span><b>İLETİŞİM</b></div>
          </div>
          <ContactChannels channels={channels} />
        </section>

        <section id="iletisim-hizli-gecisler" className="contact-section scroll-mt-32" aria-labelledby="contact-shortcuts-title">
          <div className="contact-section-header">
            <div>
              <p className="contact-eyebrow">Hızlı geçişler</p>
              <h2 id="contact-shortcuts-title" className="contact-section-title">Yanıt beklemeden ilerleyebileceğiniz alanlar.</h2>
              <p className="contact-section-copy">İşlem türünü inceleyin, yaklaşık sonucu hesaplayın veya güvenlik kontrolünü açın. Her kart doğrudan ilgili sayfaya gider.</p>
            </div>
            <div className="contact-section-index" aria-hidden="true"><span>02</span><b>YÖNLENDİRME</b></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { code: '01', title: 'Bozum hizmetini seç', text: 'Mobil ödeme ve dijital kod seçeneklerini karşılaştırın.', href: '/hizmetler', cta: 'Hizmetlere git' },
              { code: '02', title: 'Yaklaşık tutarı hesapla', text: 'İşlem öncesinde tahmini ödeme aralığını görün.', href: '/araclar', cta: 'Araçları aç' },
              { code: '03', title: 'İşlem desteği al', text: 'Devam eden işlem için hazırlamanız gerekenleri öğrenin.', href: '/bilgi-merkezi/islem-destegi-nasil-alinir', cta: 'Destek rehberi' },
              { code: '04', title: 'Kanalı doğrula', text: 'Resmî numara, alan adı ve güvenlik sınırlarını kontrol edin.', href: '/guven-merkezi', cta: 'Güven Merkezi' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="contact-shortcut-card focus-ring group relative min-h-[190px] overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(25,29,36,.92),rgba(8,10,14,.98))] p-5 transition hover:-translate-y-1 hover:border-[#c0445b]/45 hover:shadow-[0_20px_55px_rgba(74,7,20,.22)]">
                <span className="text-[10px] font-black tracking-[.2em] text-[#c0445b]">{item.code} / SKY BOZUM</span>
                <h3 className="mt-7 text-xl font-black tracking-tight text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                <span className="contact-shortcut-cta absolute inset-x-5 bottom-4 flex items-center justify-between border-t border-white/8 pt-3 text-xs font-black text-rose-300"><span>{item.cta}</span><b aria-hidden="true" className="transition group-hover:translate-x-1">→</b></span>
              </Link>
            ))}
          </div>
        </section>

        <ContactConfidence />
        <ContactFaqPreview />
        <ContactFinalCta whatsappHref={siteConfig.whatsapp} />
      </div>
    </main>
  );
}
