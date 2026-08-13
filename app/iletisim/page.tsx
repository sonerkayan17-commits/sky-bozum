import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '../lib/site-config';
import { absoluteUrl, createMetadata, jsonLd, SITE_LANGUAGE, SITE_URL } from '../lib/seo';
import './contact-redesign-v1.css';
import './contact-polish-v1.css';

export const metadata: Metadata = createMetadata({
  title: 'İletişim ve Destek Merkezi | Sky Bozum',
  description: 'Sky Bozum ile doğru iletişim kanalını seçin, talebinizi güvenli biçimde iletin ve işlem öncesi gerekli bilgileri öğrenin.',
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
          <div className="contact-v1-hero-copy"><p className="contact-v1-eyebrow">SKY BOZUM / DESTEK MERKEZİ</p><h1>Doğru kanal.<br /><span>Net başlangıç.</span></h1><p>Talebinizi seçin, uygun iletişim yoluna geçin ve işlem öncesi gerekli bilgileri güvenli biçimde paylaşın.</p><div className="contact-v1-hero-actions"><a href="#kanallar" className="contact-v1-primary">İletişim kanalını seç <b>↓</b></a><Link href="/guven-merkezi" className="contact-v1-secondary">Güven standardı <b>→</b></Link></div></div>
          <figure className="contact-v1-hero-image"><Image src="/hero-customer.webp" alt="Sky Bozum destek ekibiyle telefondan iletişim" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><figcaption>Resmî kanal · Yazılı teyit · Sınırlı veri</figcaption></figure>
        </div>
      </div>
    </section>

    <section id="kanallar" className="contact-v1-section contact-v1-channel-section"><div className="contact-v1-shell"><div className="contact-v1-section-head"><div><p className="contact-v1-eyebrow">01 / RESMÎ KANALLAR</p><h2>İhtiyacına göre<br />iletişim kur.</h2></div><span>Üç kanalın tamamı bu sayfadan doğrulanabilir.</span></div><div className="contact-v1-channel-grid">{channels.map((channel,index) => <article key={channel.id} className={`contact-v1-channel-card ${channel.accent==='primary'?'is-primary':''}`}><div className="contact-v1-channel-top"><span>0{index+1} / {channel.label}</span><b>{channel.id==='whatsapp'?'ÖNERİLEN':'DOĞRUDAN'}</b></div><h3>{channel.title}</h3><p>{channel.text}</p><strong>{channel.value}</strong><div className="contact-v1-card-actions"><a href={channel.href} target={channel.id==='whatsapp'?'_blank':undefined} rel={channel.id==='whatsapp'?'noopener noreferrer':undefined}>{channel.cta} <span>↗</span></a></div></article>)}</div></div></section>

    <section className="contact-v1-section contact-v1-purpose-section"><div className="contact-v1-shell"><div className="contact-v1-section-head"><div><p className="contact-v1-eyebrow">02 / HIZLI YÖNLENDİRME</p><h2>İlk mesajı doğru<br />hazırla.</h2></div><span>Gereksiz bilgi paylaşmadan doğrudan ilgili adıma geç.</span></div><div className="contact-v1-purpose-list">{purposes.map(([title,text,href],index) => <Link href={href} key={title}><span>0{index+1}</span><div><h3>{title}</h3><p>{text}</p></div><b>→</b></Link>)}</div></div></section>

    <section className="contact-v1-section contact-v1-security-section"><div className="contact-v1-shell contact-v1-security-grid"><div><p className="contact-v1-eyebrow">03 / VERİ SINIRI</p><h2>Güvenli iletişim<br /><span>az veriyle başlar.</span></h2><p>İlk değerlendirme için işlem türü ve yaklaşık tutar çoğu durumda yeterlidir. Hesaba veya karta erişim sağlayan bilgiler iletişim kapsamı dışındadır.</p><Link href="/guven-merkezi" className="contact-v1-inline-link">Güven Merkezi’ni incele →</Link></div><div className="contact-v1-never-share"><header><span>ASLA PAYLAŞMA</span><b>HASSAS VERİ / KAPSAM DIŞI</b></header><ul><li>Hesap veya uygulama şifresi</li><li>SMS doğrulama kodu</li><li>Kart PIN’i, CVV veya ekran erişimi</li></ul><p>Bu bilgiler istenirse görüşmeyi durdurun ve resmî kanaldan yeniden doğrulayın.</p></div></div></section>

    <section className="contact-v1-section contact-v1-faq-section"><div className="contact-v1-shell contact-v1-faq-grid"><div><p className="contact-v1-eyebrow">04 / KISA CEVAPLAR</p><h2>İletişimden önce<br />bilmen gerekenler.</h2><Link href="/sss" className="contact-v1-inline-link">Tüm SSS bölümüne git →</Link></div><div className="contact-v1-faqs">{faqs.map(([question,answer]) => <details key={question}><summary>{question}<b>+</b></summary><p>{answer}</p></details>)}</div></div></section>

    <section className="contact-v1-final"><div className="contact-v1-shell"><p className="contact-v1-eyebrow">SON KONTROL</p><h2>Talebin hazırsa,<br /><span>resmî kanaldan başla.</span></h2><a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-v1-primary">WhatsApp müşteri masasına geç <b>↗</b></a><small>Şifre, PIN, CVV ve SMS doğrulama kodu hiçbir aşamada talep edilmez.</small></div></section>
  </main>;
}
