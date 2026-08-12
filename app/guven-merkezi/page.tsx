import type { Metadata } from 'next';
import Link from 'next/link';
import TrustDecisionFlow from '../components/TrustDecisionFlow';
import TrustIncidentResolver from '../components/TrustIncidentResolver';
import TrustQuickDock from '../components/TrustQuickDock';
import TrustSectionNav from '../components/TrustSectionNav';
import SkyTrustCheck from '../components/SkyTrustCheck';
import TrustCommandCenter from '../components/TrustCommandCenter';
import { buildWhatsAppUrl } from '../lib/conversion';
import { siteConfig } from '../lib/site-config';
import './trust-premium.css';
import './trust-editorial.css';
import './trust-editorial-reset.css';
import './trust-editorial-priority.css';
import './trust-editorial-type.css';
import './trust-editorial-type-balance.css';
import './trust-hero-type-final.css';

export const metadata: Metadata = {
  title: 'Güven Merkezi',
  description: 'Gerçek dışı oranları, sahte iletişim kanallarını ve güvenli işlem adımlarını tanıyın. Sky Bozum resmî kanal ve işlem güvenliği rehberi.',
  alternates: { canonical: '/guven-merkezi' },
};

const trustEvidence = [
  ['AÇIK', 'Resmî kanal', 'Alan adı, WhatsApp ve e-posta işlemden önce bu sayfadan kontrol edilebilir.', '/iletisim'],
  ['YAZILI', 'Net ödeme', 'Oran, kesinti ve hesabınıza geçecek tutar işlem başlamadan önce konuşmada görünür.', '/bilgi-merkezi/sky-bozum-iletisim-rehberi'],
  ['TEK KANAL', 'İşlem kaydı', 'Teklif ve işlem sonucu farklı numaralara taşınmadan aynı resmî görüşmede kalır.', '/bilgi-merkezi/islem-destegi-nasil-alinir'],
  ['KAYNAKLI', 'Referanslar', 'Açık kaynak kullanıcı kayıtlarında ulaşılabilen kaynak bağlantıları gösterilir.', '/referanslar'],
] as const;

const safeOffer = [
  'Oran ve net ödeme birlikte açıklanır',
  'Kesinti varsa işlemden önce belirtilir',
  'Aynı resmî iletişim kanalında devam edilir',
  'Karar vermeniz için baskı kurulmaz',
  'Ödeme ve işlem sırası yazılıdır',
] as const;

const suspiciousOffer = [
  'Yalnızca dikkat çekici yüksek yüzde söylenir',
  'İşlem sırasında yeni masraf veya kesinti çıkarılır',
  'Farklı numara ya da kişisel hesaba yönlendirilirsiniz',
  '“Hemen gönderin” benzeri acele baskısı kurulur',
  'Ödeme görülmeden kod veya bakiye istenir',
] as const;

const incidents = [
  {
    question: 'Farklı bir numaraya yönlendirildim',
    now: 'Yeni numaraya bilgi göndermeyin; görüşmeyi kapatıp bozumcu.net üzerindeki resmî bağlantıdan yeniden başlayın.',
    avoid: 'Mevcut konuşmadaki kişinin “bu da bizim numaramız” açıklamasını tek başına doğrulama kabul etmeyin.',
    records: 'Numarayı, kullanıcı adını, yönlendirme mesajını ve bağlantı ekran görüntülerini saklayın.',
  },
  {
    question: 'SMS kodu, şifre veya ekran paylaşımı istendi',
    now: 'Hiçbir bilgi paylaşmadan görüşmeyi sonlandırın. Uzaktan erişim uygulaması kurduysanız kaldırın ve açık oturumlarınızı kontrol edin.',
    avoid: '“Sadece doğrulama için” denilse bile tek kullanımlık kod, şifre veya ekran erişimi vermeyin.',
    records: 'Talebin yer aldığı mesajları, numarayı ve profil bilgilerini saklayın.',
  },
  {
    question: 'Dekont geldi fakat ödeme görünmüyor',
    now: 'Ödemeyi kendi banka hesabınızdan doğrulayın; hesabınıza geçmeyen tutarı ödenmiş kabul etmeyin.',
    avoid: 'Yalnız ekran görüntüsü veya PDF dekonta güvenerek işlemi tamamlamayın.',
    records: 'Dekontu, onaylanan net tutarı ve konuşma kayıtlarını saklayın.',
  },
  {
    question: 'Kodu veya bakiyeyi yanlış kişiye gönderdim',
    now: 'Yeni bilgi paylaşmayın ve ilgili platformun resmî destek kanalına hemen başvurun.',
    avoid: 'Kodu geri alma vaadiyle sizden yeni ödeme ya da doğrulama bilgisi isteyen kişilere cevap vermeyin.',
    records: 'Kodun gönderildiği hesap, saat, numara ve mesaj kayıtlarını koruyun.',
  },
] as const;

const faq = [
  ['Neden çok yüksek oran veren her siteye güvenmemeliyim?', 'Piyasanın belirgin biçimde üzerindeki oranlar kullanıcıyı hızlı karar vermeye zorlamak için kullanılabilir. Yüksek yüzde tek başına avantaj kanıtı değildir; net ödeme, kesinti, iletişim kanalı ve işlem sırası birlikte değerlendirilmelidir.'],
  ['Sky Bozum benden hangi bilgileri istemez?', 'Kart şifresi, internet bankacılığı şifresi, e-Devlet şifresi, tek kullanımlık SMS kodu, ekran paylaşımı ve uzaktan erişim bilgileri istenmez.'],
  ['Sitedeki oran kesin midir?', 'Hayır. Gösterilen oranlar bilgilendirme aralığıdır. Kesin net tutar işlem öncesinde yazılı olarak paylaşılır.'],
  ['Resmî hesabı nasıl doğrularım?', 'Görüşmeyi doğrudan bozumcu.net üzerindeki WhatsApp bağlantısından başlatın. Logo, profil fotoğrafı veya benzer kullanıcı adı tek başına doğrulama değildir.'],
  ['Şüpheli bir durumda ne yapmalıyım?', 'İşlemi durdurun, yeni bilgi paylaşmayın, görüşme kayıtlarını saklayın ve sitedeki resmî kanaldan yeniden doğrulama isteyin.'],
] as const;

export default function TrustCenterPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <main className="trust-premium-page min-h-screen bg-[#06080b] pb-24 text-white md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative overflow-hidden border-b border-[#9faab7]/12 bg-[linear-gradient(180deg,#0a0d12_0%,#07090c_72%,#080a0e_100%)] py-9 sm:py-12">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_76%_14%,rgba(159,35,56,.115),transparent_29%),radial-gradient(circle_at_14%_80%,rgba(174,184,196,.055),transparent_27%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,.012)_47%,transparent_48%)]" />
        <div className="content-shell relative max-w-6xl">
          <nav className="text-xs font-bold text-slate-500">
            <Link href="/" className="transition hover:text-[#c75b6d]">Ana Sayfa</Link><span className="mx-2">/</span>Güven Merkezi
          </nav>

          <div className="trust-hero-editorial">
            <div className="trust-hero-copy">
              <div className="trust-hero-kicker"><span>01</span><b>GÜVEN MERKEZİ</b><i>SKY BOZUM / BOZUMCU.NET</i></div>
              <h1>Güven, işlemden önce <span>görünür.</span></h1>
              <p>Resmî kanal, yazılı net ödeme ve açık işlem sırası. Kontrol her adımda sizde.</p>
              <div className="trust-hero-actions">
                <a href="#islem-standardi" className="trust-hero-primary focus-ring">Kontrolü başlat <span aria-hidden="true">→</span></a>
                <a href={buildWhatsAppUrl('Merhaba, Güven Merkezi üzerinden resmî iletişim kanalını ve işlem sürecini doğrulamak istiyorum.')} target="_blank" rel="noopener noreferrer" className="trust-hero-secondary focus-ring">Resmî WhatsApp <span aria-hidden="true">↗</span></a>
              </div>
            </div>

            <aside className="trust-hero-ledger" aria-label="Sky Bozum resmî kanal özeti">
              <div className="trust-ledger-head"><span>RESMÎ İLETİŞİM KANALLARI</span><b><i /> BU SAYFADA YAYINLI</b></div>
              <dl>
                <div><dt>Alan adı</dt><dd>{siteConfig.domain}</dd><span>01</span></div>
                <div><dt>WhatsApp</dt><dd>{siteConfig.phone}</dd><span>02</span></div>
                <div><dt>E-posta</dt><dd>{siteConfig.email}</dd><span>03</span></div>
              </dl>
              <p><span>PAYLAŞIM SINIRI</span><b>Şifre, SMS kodu ve ekran erişimi istenmez.</b></p>
            </aside>
          </div>
        </div>
      </section>

      <TrustSectionNav />

      <TrustCommandCenter domain={siteConfig.domain} phone={siteConfig.phone} whatsappHref={buildWhatsAppUrl('Merhaba, bozumcu.net Güven Merkezi üzerinden resmî kanalı doğruladım. Güncel uygunluk ve işlem bilgisi almak istiyorum.')} />

      <section id="islem-standardi" className="content-shell scroll-mt-32 py-5 sm:py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#b83a50]">Etkileşimli güvenlik görevi</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">İşleme geçmeden önce kontrolünüzü tamamlayın.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-400">Dört temel maddeyi işaretleyin; tamamladığınızda resmî kanal için hazırlanmış mesajla devam edin.</p>
        </div>
        <SkyTrustCheck />
      </section>

      <section id="guven-kontrolu" className="content-shell scroll-mt-32 py-5 sm:py-6">
        <div className="border-b border-[#9faab7]/14 pb-7 sm:pb-8">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#b83a50]">Sizin durumunuz hangisi?</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Bir sonraki güvenli adımı doğrudan görün.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">İlk işlem, yüksek oran, farklı numara veya yalnızca şüphe. Size uyan durumu seçin.</p>
          </div>
          <div className="mt-5"><TrustDecisionFlow /></div>
        </div>
      </section>

      <section id="risk-kontrol" className="scroll-mt-32 border-y border-[#9faab7]/12 bg-[linear-gradient(180deg,#0d1116_0%,#0a0e13_100%)] py-8 sm:py-9">
        <div className="content-shell">
          <div className="grid gap-6 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#b83a50]">Oranı değil teklifi değerlendirin</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Çok yüksek oran, güven göstergesi değildir.</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-slate-400">Gerçek dışı oranlar kullanıcıyı acele ettirmek, sonradan kesinti çıkarmak veya işlemi farklı bir hesaba taşımak için kullanılabilir. Karar verirken yüzdeye değil; net ödemeye, resmî kanala ve yazılı işlem sırasına bakın.</p>
          </div>

          <div className="relative mt-5 overflow-hidden rounded-[8px] border border-[#aeb8c4]/13 bg-[linear-gradient(145deg,rgba(17,22,29,.90),rgba(8,11,15,.96))] shadow-[inset_0_1px_0_rgba(255,255,255,.035),inset_0_-1px_0_rgba(0,0,0,.52)] before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-[linear-gradient(90deg,rgba(195,203,212,.38),transparent_42%,rgba(184,58,80,.48))]">
            <div className="grid lg:grid-cols-2">
              <article className="relative px-5 py-[18px] lg:pr-7 before:absolute before:left-0 before:top-0 before:h-px before:w-24 before:bg-[linear-gradient(90deg,#c1c9d2,transparent)]">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[.14em] text-[#c1c9d2]">Şeffaf teklif</p>
                  <span className="text-[10px] font-black tracking-[.14em] text-[#c1c9d2]/65">DEVAM ET</span>
                </div>
                <ul className="mt-4 divide-y divide-white/8">
                  {safeOffer.map((item) => <li key={item} className="flex gap-3 py-3 text-sm leading-6 text-slate-300"><span className="font-black text-[#c1c9d2]">✓</span><span>{item}</span></li>)}
                </ul>
              </article>
              <article className="relative border-t border-[#9faab7]/14 px-5 py-[18px] lg:border-l lg:border-t-0 lg:pl-7 before:absolute before:left-0 before:top-0 before:h-px before:w-24 before:bg-[linear-gradient(90deg,#b83a50,transparent)] lg:before:left-7">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[.14em] text-[#c4475d]">Gerçek dışı teklif</p>
                  <span className="text-[10px] font-black tracking-[.14em] text-[#c4475d]/70">DURDUR</span>
                </div>
                <ul className="mt-4 divide-y divide-white/8">
                  {suspiciousOffer.map((item) => <li key={item} className="flex gap-3 py-3 text-sm leading-6 text-slate-300"><span className="font-black text-[#c4475d]">×</span><span>{item}</span></li>)}
                </ul>
              </article>
            </div>

            <div className="border-t border-[#9faab7]/14 bg-[linear-gradient(180deg,rgba(174,184,196,.028),rgba(8,11,15,.12))] px-5 py-[18px] sm:px-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#b83a50]">Neden Sky Bozum?</p>
                  <h3 className="mt-1.5 text-lg font-black tracking-tight sm:text-xl">İşlemden önce görebildiğiniz dört kanıt.</h3>
                </div>
                <Link href="/referanslar" className="trust-text-action focus-ring text-xs font-black transition">Kaynaklı referanslar <span aria-hidden="true">→</span></Link>
              </div>
              <div className="mt-4 grid gap-px overflow-hidden border border-[#9faab7]/10 bg-[#9faab7]/10 sm:grid-cols-2 lg:grid-cols-4">
                {trustEvidence.map(([status, title, text, href]) => (
                  <Link href={href} key={title} className="trust-evidence-link focus-ring group relative bg-[linear-gradient(155deg,rgba(20,25,32,.68),rgba(9,12,17,.88))] px-4 py-3.5 transition before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(194,202,211,.22),transparent)] hover:bg-[linear-gradient(155deg,rgba(25,31,39,.74),rgba(11,14,19,.92))]">
                    <span className="text-[9px] font-black tracking-[.16em] text-[#c75b6d]">{status}</span>
                    <h4 className="mt-2 flex items-center justify-between gap-3 text-sm font-black text-slate-100"><span>{title}</span><span aria-hidden="true" className="text-[#c75b6d] transition group-hover:translate-x-1">→</span></h4>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">{text}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="guvenli-islem" className="content-shell scroll-mt-32 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#9faab7]/14 pb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#b83a50]">Güvenli devam bağlantıları</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Kontrolü tamamlayın, doğru sayfadan ilerleyin.</h2>
          </div>
          <Link href="/bilgi-merkezi" className="trust-text-action focus-ring text-sm font-black transition">Tüm rehberleri aç <span aria-hidden="true">→</span></Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { no: '01', title: 'Resmî iletişimi doğrula', text: 'Doğru kanal ve paylaşım sınırlarını kontrol edin.', href: '/bilgi-merkezi/sky-bozum-iletisim-rehberi' },
            { no: '02', title: 'İşlem desteğini hazırla', text: 'Sorunu tek mesajda doğru bilgilerle aktarın.', href: '/bilgi-merkezi/islem-destegi-nasil-alinir' },
            { no: '03', title: 'Sorun çözme merkezine git', text: 'Yaşadığınız duruma uygun adımları bulun.', href: '/bilgi-merkezi/sorun-cozme' },
            { no: '04', title: 'İletişim merkezini aç', text: 'Talebinizi seçip hazır mesajla resmî kanala geçin.', href: '/iletisim' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="trust-guide-link focus-ring group relative min-h-[170px] overflow-hidden rounded-lg border border-[#aeb8c4]/13 bg-[linear-gradient(145deg,rgba(20,25,32,.85),rgba(8,11,15,.98))] p-5 transition hover:-translate-y-1 hover:border-[#b83a50]/50 hover:shadow-[0_18px_45px_rgba(71,9,20,.2)]">
              <span className="text-[10px] font-black tracking-[.18em] text-[#b83a50]">{item.no} / KONTROL</span>
              <h3 className="mt-6 text-lg font-black text-slate-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
              <span aria-hidden="true" className="absolute bottom-4 right-5 text-[#d06a7c] transition group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="sorun-cozucu" className="content-shell scroll-mt-24 py-5 sm:py-6">
        <div className="grid gap-5 lg:grid-cols-[.62fr_1.38fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#b83a50]">Şüpheli bir durum yaşandıysa</p>
            <h2 className="mt-2.5 text-2xl font-black tracking-tight sm:text-[28px]">Durumu seçin ve ilk yapmanız gerekeni görün.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Yeni bilgi paylaşmayın. Size uyan senaryoyu açın, kayıtları koruyun ve resmî kanaldan yeniden doğrulama yapın.</p>
          </div>
          <TrustIncidentResolver incidents={incidents} />
        </div>
      </section>

      <section className="content-shell max-w-5xl pb-6 pt-0">
        <p className="text-xs font-black uppercase tracking-[.16em] text-[#b83a50]">Sık sorulanlar</p>
        <div className="mt-3 space-y-0.5">
          {faq.map(([question, answer]) => (
            <details key={question} className="group border-b border-[#aeb8c4]/10">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-5 py-2.5 font-extrabold text-slate-200 transition duration-200 hover:text-white motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
                <span>{question}</span>
                <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border border-[#aeb8c4]/18 bg-[linear-gradient(145deg,rgba(174,184,196,.055),rgba(9,12,16,.18))] shadow-[inset_0_1px_0_rgba(255,255,255,.025)] text-sm font-bold text-[#c1c9d2] transition duration-200 group-hover:border-[#9faab7]/30 group-open:rotate-45 group-open:border-[#b83a50]/45 group-open:bg-[#b83a50]/8 group-open:text-[#d06a7c]">+</span>
              </summary>
              <p className="max-w-4xl pb-3 pr-10 text-sm leading-7 text-slate-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <TrustQuickDock />
    </main>
  );
}
