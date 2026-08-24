import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import IndependentServiceNotice from '../components/IndependentServiceNotice';
import { siteConfig } from '../lib/site-config';
import { absoluteUrl, createMetadata, jsonLd, SITE_LANGUAGE, SITE_URL } from '../lib/seo';
import ContactCopyButton from './_components/ContactCopyButton';
import './contact-redesign-v1.css';

export const metadata: Metadata = createMetadata({
  title: 'İletişim ve Destek Merkezi | Sky Bozum',
  description: 'Sky Bozum resmî iletişim kanallarını doğrulayın, talebinizi güvenli biçimde iletin ve şüpheli durumlarda izlemeniz gereken adımları öğrenin.',
  path: '/iletisim',
  image: '/hero-customer.webp',
  imageAlt: 'Sky Bozum iletişim ve destek merkezi',
});

const channels = [
  { id: 'whatsapp', label: 'WhatsApp', title: 'En hızlı başlangıç', text: 'Güncel oran, işlem uygunluğu ve devam eden süreçler için yazılı destek.', value: siteConfig.phone, href: siteConfig.whatsapp, cta: 'WhatsApp’ı aç', accent: 'primary' },
  { id: 'phone', label: 'Telefon', title: 'Doğrudan görüşme', text: 'Görüşme gerektiren konular için resmî Sky Bozum hattı.', value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, '')}`, cta: 'Ara', accent: 'default' },
  { id: 'email', label: 'E-posta', title: 'Yazılı ve kurumsal', text: 'Ayrıntılı, kurumsal veya kayıt gerektiren talepler için.', value: siteConfig.email, href: `mailto:${siteConfig.email}`, cta: 'E-posta gönder', accent: 'default' },
] as const;

const purposes = [
  ['Güncel oran ve uygunluk', 'İşlem türünü ve yaklaşık tutarı yazın.', '/araclar'],
  ['Devam eden işlem desteği', 'Sorunu, varsa işlem referansını paylaşın.', '/bilgi-merkezi/islem-destegi-nasil-alinir'],
  ['Kurumsal talep', 'Talebinizi ve kurum bilgilerinizi e-posta ile iletin.', `mailto:${siteConfig.email}`],
] as const;

const faqs = [
  ['İlk mesajda ne yazmalıyım?', 'İşlem türünü ve yaklaşık tutarı yazmanız yeterlidir. Güncel uygunluk ve oran işlem başlamadan önce paylaşılır.'],
  ['Hangi bilgiler kesinlikle istenmez?', 'Şifre, kart PIN’i, CVV, SMS doğrulama kodu ve hesabınıza erişim sağlayan bilgiler istenmez.'],
  ['En hızlı kanal hangisi?', 'Güncel oran ve işlem uygunluğu için resmî WhatsApp hattı; kurumsal talepler için e-posta daha uygundur.'],
] as const;

const securityChecks = [
  ['Resmî kanaldan başlayın', `Görüşmeyi yalnızca ${siteConfig.domain} üzerindeki bağlantılardan başlatın.`],
  ['Net tutarı yazılı görün', 'Oran, kesinti ve tahmini net ödeme işlem başlamadan önce aynı görüşmede açıklansın.'],
  ['Erişim bilgisi paylaşmayın', 'Şifre, SMS kodu, kart PIN’i, CVV ve ekran erişimi hiçbir aşamada istenmez.'],
  ['Ödemeyi hesabınızdan doğrulayın', 'Dekont görüntüsü yerine tutarın kendi hesabınıza geçtiğini kontrol edin.'],
] as const;

const suspiciousSituations = [
  ['Farklı numaraya yönlendirildim', 'Bilgi göndermeyin; görüşmeyi kapatıp bu sayfadaki resmî kanaldan yeniden başlayın.'],
  ['SMS kodu veya ekran erişimi istendi', 'Görüşmeyi sonlandırın. Kod, şifre veya uzaktan erişim vermeyin.'],
  ['Dekont var, ödeme görünmüyor', 'Ödemeyi kendi hesabınızdan kontrol edin; hesaba geçmeyen tutarı tamamlanmış saymayın.'],
] as const;

const pageUrl = absoluteUrl('/iletisim');
const schema = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'ContactPage', '@id': `${pageUrl}#page`, name: 'Sky Bozum İletişim ve Destek Merkezi', url: pageUrl, inLanguage: SITE_LANGUAGE, isPartOf: { '@id': `${SITE_URL}/#website` } },
  { '@type': 'ContactPoint', '@id': `${pageUrl}#support`, contactType: 'customer support', telephone: `+90${siteConfig.phone.replace(/\D/g, '').replace(/^0/, '')}`, email: siteConfig.email, availableLanguage: ['tr-TR'], url: siteConfig.whatsapp },
  { '@type': 'FAQPage', mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
] };

export default function Page() {
  return <main className="contact-v1-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <section className="contact-v1-hero">
      <div className="contact-v1-shell">
        <nav className="contact-v1-breadcrumb"><Link href="/">Ana Sayfa</Link><span>/</span>İletişim</nav>
        <div className="contact-v1-hero-grid">
          <div className="contact-v1-hero-copy"><p className="contact-v1-eyebrow">SKY BOZUM / İLETİŞİM & GÜVENLİK</p><h1>Doğru kanal.<br /><span>Net başlangıç.</span></h1><p>Talebinizi seçin, resmî kanalı doğrulayın ve işlem öncesi gerekli bilgileri güvenli biçimde paylaşın.</p><div className="contact-v1-hero-actions"><a href="#kanallar" className="contact-v1-primary">İletişim kanalını seç <b>↓</b></a><a href="#guvenlik" className="contact-v1-secondary">Güvenlik kontrolü <b>↓</b></a></div></div>
          <figure className="contact-v1-hero-image"><Image src="/hero-customer.webp" alt="Sky Bozum destek ekibiyle telefondan iletişim" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><figcaption>Resmî kanal · Yazılı teyit · Sınırlı veri</figcaption></figure>
        </div>
      </div>
    </section>

    <section id="kanallar" className="contact-v1-section contact-v1-channel-section"><div className="contact-v1-shell"><div className="contact-v1-section-head"><div><p className="contact-v1-eyebrow">01 / RESMÎ KANALLAR</p><h2>İhtiyacına göre iletişim kur.</h2></div><span>Güncel işlem için WhatsApp; görüşme için telefon; ayrıntılı kayıt için e-posta.</span></div><div className="contact-v1-channel-grid">{channels.map((channel, index) => <article key={channel.id} className={`contact-v1-channel-card ${channel.accent === 'primary' ? 'is-primary' : ''}`}><div className="contact-v1-channel-top"><span>0{index + 1} / {channel.label}</span><b>{channel.id === 'whatsapp' ? 'ÖNERİLEN' : 'DOĞRUDAN'}</b></div><div className="contact-v1-channel-body"><div><h3>{channel.title}</h3><p>{channel.text}</p></div><strong>{channel.value}</strong></div><div className="contact-v1-card-actions"><a href={channel.href} target={channel.id === 'whatsapp' ? '_blank' : undefined} rel={channel.id === 'whatsapp' ? 'noopener noreferrer' : undefined}>{channel.cta} <span>↗</span></a><ContactCopyButton value={channel.value} /></div></article>)}</div><div className="contact-v1-purpose-strip"><div className="contact-v1-purpose-intro"><p className="contact-v1-eyebrow">İLK MESAJ</p><strong>Yalnızca gerekli bilgiyi yazın.</strong></div>{purposes.map(([title, text, href], index) => <Link href={href} key={title}><span>0{index + 1}</span><div><b>{title}</b><small>{text}</small></div><i>→</i></Link>)}</div></div></section>

    <IndependentServiceNotice id="hizmet-modeli" />

    <section id="hakkimizda" className="contact-v1-about"><div className="contact-v1-shell contact-v1-about-grid"><div><p className="contact-v1-eyebrow">SKY BOZUM HAKKINDA</p><h2>10 yılı aşkın tecrübeyi açık süreçle birleştiriyoruz.</h2><p>Sky Bozum; dijital kod değerlendirme sürecini, ürün uygunluğunu ve tahmini net ödemeyi işlem başlamadan önce anlaşılır biçimde açıklamayı amaçlayan bağımsız bir platformdur. Operatör ve dijital cüzdan sayfalarımız doğrudan bakiye satın alma vaadi değil; desteklenen mağazalarda dijital ürün satın alma, limit ve güvenlik kontrollerini anlatan bağımsız rehberlerdir.</p></div><div className="contact-v1-about-facts"><article><strong>10+ yıl</strong><span>Sektör tecrübesi</span></article><article><strong>Yazılı teyit</strong><span>Ürün, koşul ve tahmini net tutar</span></article><article><strong>Tek resmî alan</strong><span>{siteConfig.domain}</span></article><Link href="/bilgi-merkezi/guvenilir-mobil-bozum-sitesi-nasil-secilir">Çalışma ve güvenlik yaklaşımımızı inceleyin <b>→</b></Link></div></div></section>

    <section id="guvenlik" className="contact-v1-section contact-v1-support-section"><div className="contact-v1-shell"><div className="contact-v1-section-head"><div><p className="contact-v1-eyebrow">02 / GÜVENLİ İLETİŞİM</p><h2>İşlemden önce kontrol sizde.</h2></div><span>Resmî kanalı doğrulayın, net tutarı yazılı görün ve hassas bilgilerinizi paylaşmayın.</span></div><div className="contact-v1-security-feature"><figure className="contact-v1-security-visual"><Image src="/images/guven-merkezi/guven-merkezi-hero-v1.webp" alt="Telefon, güvenlik kalkanı ve doğrulama rozetlerinden oluşan güvenli iletişim görseli" fill sizes="(max-width: 900px) 100vw, 44vw" /><i aria-hidden="true" /><figcaption><span><b>●</b> RESMÎ KANAL</span><strong>{siteConfig.domain}</strong><small>{siteConfig.phone}</small></figcaption></figure><div className="contact-v1-security-checks">{securityChecks.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><b aria-hidden="true">✓</b></article>)}</div></div><div className="contact-v1-support-grid"><div className="contact-v1-incident-panel"><header><div><p className="contact-v1-eyebrow">ŞÜPHELİ DURUMDA</p><strong>Görüşmeyi durdurun, kaydı koruyun.</strong></div><span>3 HIZLI ADIM</span></header><div>{suspiciousSituations.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div><div className="contact-v1-faq-panel"><div className="contact-v1-faq-title"><p className="contact-v1-eyebrow">KISA CEVAPLAR</p><strong>İletişimden önce bilmeniz gerekenler</strong><Link href="/sss">Tüm SSS →</Link></div><div className="contact-v1-faqs">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<b>+</b></summary><p>{answer}</p></details>)}</div></div></div></div></section>

    <section className="contact-v1-final"><div className="contact-v1-shell contact-v1-final-inner"><div><p className="contact-v1-eyebrow">HAZIRSANIZ BAŞLAYIN</p><h2>Talebinizi resmî kanaldan iletin.</h2><small>Şifre, PIN, CVV ve SMS doğrulama kodu hiçbir aşamada talep edilmez.</small></div><a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-v1-primary">WhatsApp müşteri masası <b>↗</b></a></div></section>
  </main>;
}
