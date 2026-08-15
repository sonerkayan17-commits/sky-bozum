import type { Metadata } from 'next';
import Link from 'next/link';
import TrustIncidentResolver from '../components/TrustIncidentResolver';
import TrustQuickDock from '../components/TrustQuickDock';
import SkyTrustCheck from '../components/SkyTrustCheck';
import { buildWhatsAppUrl } from '../lib/conversion';
import { siteConfig } from '../lib/site-config';
import './trust-redesign-v1.css';

export const metadata: Metadata = {
  title: 'Güven Merkezi | Sky Bozum',
  description: 'Resmî kanalı doğrulayın, işlem öncesi güvenlik kontrollerini tamamlayın ve şüpheli durumlarda ne yapacağınızı öğrenin.',
  alternates: { canonical: '/guven-merkezi' },
};

const incidents = [
  { question: 'Farklı bir numaraya yönlendirildim', now: 'Yeni numaraya bilgi göndermeyin. Görüşmeyi kapatıp sky-bozum.vercel.app üzerindeki resmî bağlantıdan yeniden başlayın.', avoid: 'Mevcut görüşmedeki kişinin yeni numarayı doğruladığını varsaymayın.', records: 'Numarayı, mesajı ve profil bilgilerini saklayın.' },
  { question: 'SMS kodu, şifre veya ekran paylaşımı istendi', now: 'Görüşmeyi sonlandırın. Kod, şifre ve uzaktan erişim vermeyin.', avoid: 'Sadece doğrulama için istendiği söylenmesine rağmen paylaşım yapmayın.', records: 'Talebin bulunduğu mesajları ve numarayı koruyun.' },
  { question: 'Dekont geldi fakat ödeme görünmüyor', now: 'Ödemeyi kendi hesabınızdan kontrol edin; hesabınıza geçmeyen tutarı kesin kabul etmeyin.', avoid: 'Yalnızca ekran görüntüsü veya PDF dekonta güvenmeyin.', records: 'Dekontu, net tutarı ve görüşme kaydını saklayın.' },
] as const;

const faqs = [
  ['Sky Bozum benden hangi bilgileri istemez?', 'Kart şifresi, internet bankacılığı şifresi, e-Devlet şifresi, tek kullanımlık SMS kodu, ekran paylaşımı veya uzaktan erişim bilgisi istenmez.'],
  ['Sitedeki oran kesin midir?', 'Hayır. Oranlar bilgilendirme aralığıdır. Kesin net tutar işlem öncesinde yazılı olarak paylaşılır.'],
  ['Resmî hesabı nasıl doğrularım?', 'Görüşmeyi doğrudan bu sitedeki iletişim bağlantısından başlatın. Logo veya profil fotoğrafı tek başına doğrulama değildir.'],
] as const;

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) };

export default function TrustCenterPage() {
  return <main className="trust-v1-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section className="trust-v1-hero">
      <div className="trust-v1-shell">
        <nav className="trust-v1-breadcrumb"><Link href="/">Ana Sayfa</Link><span>/</span>Güven Merkezi</nav>
        <div className="trust-v1-hero-grid">
          <div>
            <p className="trust-v1-eyebrow">SKY BOZUM / GÜVEN MERKEZİ</p>
            <h1>İşlemden önce<br /><span>kontrol sizde.</span></h1>
            <p className="trust-v1-lead">Resmî kanalı doğrulayın, net ödemeyi yazılı görün ve hassas bilgilerinizi koruyun.</p>
            <div className="trust-v1-actions"><a href="#kontrol" className="trust-v1-primary">Kontrolü başlat <b>→</b></a><a href={buildWhatsAppUrl('Merhaba, Güven Merkezi üzerinden resmî kanalı doğrulamak istiyorum.')} target="_blank" rel="noopener noreferrer" className="trust-v1-secondary">Resmî WhatsApp <b>↗</b></a></div>
          </div>
          <aside className="trust-v1-channel-card"><div className="trust-v1-card-head"><span>RESMÎ KANAL</span><b><i /> KONTROL EDİLEBİLİR</b></div><div className="trust-v1-channel-row"><small>Alan adı</small><strong>{siteConfig.domain}</strong></div><div className="trust-v1-channel-row"><small>WhatsApp</small><strong>{siteConfig.phone}</strong></div><div className="trust-v1-channel-row"><small>E-posta</small><strong>{siteConfig.email}</strong></div><p>Şifre, SMS kodu ve ekran erişimi istenmez.</p></aside>
        </div>
      </div>
    </section>

    <section id="kontrol" className="trust-v1-section trust-v1-check-section"><div className="trust-v1-shell"><div className="trust-v1-section-head"><div><p className="trust-v1-eyebrow">01 / İŞLEM ÖNCESİ</p><h2>Üç kontrolü tamamlayın.</h2></div><span>Sonraki adıma geçmeden önce bu maddeleri doğrulayın.</span></div><SkyTrustCheck /></div></section>

    <section className="trust-v1-section"><div className="trust-v1-shell"><div className="trust-v1-section-head"><div><p className="trust-v1-eyebrow">02 / TEKLİFİ DEĞERLENDİR</p><h2>Yüzdeye değil, sürece bakın.</h2></div><span>Güvenilir bir teklif net, yazılı ve doğrulanabilir olur.</span></div><div className="trust-v1-compare"><article><header><span>GÜVENİLİR TEKLİF</span><b>DEVAM ET</b></header><ul><li>Oran ve net ödeme birlikte açıklanır</li><li>Kesinti işlemden önce belirtilir</li><li>Aynı resmî kanalda devam edilir</li><li>Karar vermeniz için baskı kurulmaz</li></ul></article><article><header><span>ŞÜPHELİ TEKLİF</span><b>DURDUR</b></header><ul><li>Sadece yüksek yüzde söylenir</li><li>Sonradan masraf veya kesinti çıkar</li><li>Farklı numara ya da hesaba yönlendirir</li><li>Acele etmeniz için baskı kurar</li></ul></article></div></div></section>

    <section id="sorun-cozucu" className="trust-v1-section trust-v1-incident-section"><div className="trust-v1-shell"><div className="trust-v1-section-head"><div><p className="trust-v1-eyebrow">03 / ŞÜPHELİ DURUM</p><h2>Ne yaşadığınızı seçin.</h2></div><span>İşlemi durdurun, kayıtları koruyun ve doğru ilk adımı görün.</span></div><TrustIncidentResolver incidents={incidents} /></div></section>

    <section className="trust-v1-section"><div className="trust-v1-shell"><div className="trust-v1-section-head"><div><p className="trust-v1-eyebrow">04 / DOĞRU YÖNLENDİRME</p><h2>Kontrolden sonra ilerleyin.</h2></div><Link href="/iletisim" className="trust-v1-inline-link">İletişim merkezini aç →</Link></div><div className="trust-v1-links"><Link href="/bilgi-merkezi/sky-bozum-iletisim-rehberi"><b>Resmî iletişimi doğrula</b><span>Doğru kanal ve paylaşım sınırlarını kontrol et →</span></Link><Link href="/bilgi-merkezi/sorun-cozme"><b>Sorun çözme merkezine git</b><span>Yaşadığınız duruma uygun adımları bulun →</span></Link><Link href="/referanslar"><b>Referansları incele</b><span>Kaynaklı kullanıcı kayıtlarını görüntüle →</span></Link></div></div></section>

    <section className="trust-v1-section trust-v1-faq-section"><div className="trust-v1-shell trust-v1-faq-shell"><div><p className="trust-v1-eyebrow">05 / SIK SORULANLAR</p><h2>Kısa cevaplar.</h2><p>Kararsız kaldığınızda önce bu üç kontrolü okuyun.</p></div><div className="trust-v1-faqs">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<b>+</b></summary><p>{answer}</p></details>)}</div></div></section>
    <TrustQuickDock />
  </main>;
}
