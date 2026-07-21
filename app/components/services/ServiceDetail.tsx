import Image from 'next/image';
import Link from 'next/link';
import type { ServiceItem } from '../../lib/site';
import { articles, services, siteConfig } from '../../lib/site';
import { troubleshootingGuides } from '../../lib/troubleshooting';
import TrustChecklist from '../TrustChecklist';
import ServiceMiniCalculator from './ServiceMiniCalculator';
import VodafonePremiumSections from './VodafonePremiumSections';
import TurkcellPaycellPremiumSections from './TurkcellPaycellPremiumSections';
import TelekomPokusPremiumSections from './TelekomPokusPremiumSections';
import DigitalCodePremiumSections from './DigitalCodePremiumSections';
import CardSmsPremiumSections from './CardSmsPremiumSections';

const safetyChecks = [
  'Ürün veya kodu satın almadan önce hizmetin uygunluğunu yazılı olarak doğrulayın.',
  'Kodun tamamını yalnızca resmî Sky Bozum görüşmesindeki yönlendirmeden sonra paylaşın.',
  'Tutar, para birimi, ülke/bölge ve bilgilendirme oranını işlemden önce teyit edin.',
  'Başkasına ait ödeme aracı, hesap, kod veya kimlik bilgisiyle işlem yapmayın.',
];

const journeyLinks = [
  { label: 'Güncel oranları hesapla', href: '/araclar#oran-hesapla', description: 'Tutarınızı girip yaklaşık ödeme aralığını görün.' },
  { label: 'Sorun çözme merkezine git', href: '/bilgi-merkezi/sorun-cozme', description: 'Limit, kart, SMS veya kod sorunlarını adım adım kontrol edin.' },
  { label: 'Tüm rehberleri keşfet', href: '/bilgi-merkezi', description: 'Mobil ödeme, dijital kod ve kart rehberlerine ulaşın.' },
];

export default function ServiceDetail({ service }: { service: ServiceItem }) {
  const related = articles.filter((article) => article.serviceSlug === service.slug).slice(0, 4);
  const troubleshooting = troubleshootingGuides.filter((guide) => guide.serviceSlug === service.slug).slice(0, 3);
  const alternatives = services.filter((item) => item.slug !== service.slug && item.category === service.category).slice(0, 3);
  const whatsapp = `${siteConfig.whatsapp.split('?')[0]}?text=${encodeURIComponent(`Merhaba, ${service.name} için güncel oran ve uygunluk bilgisi almak istiyorum.`)}`;

  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <section className="relative overflow-hidden border-b border-white/8 py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(244,63,94,.16),transparent_36%),radial-gradient(circle_at_90%_90%,rgba(249,115,22,.08),transparent_30%)]" />
        <div className="content-shell relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/" className="focus-ring rounded hover:text-rose-300">Ana Sayfa</Link><span aria-hidden="true">/</span><Link href="/hizmetler" className="focus-ring rounded hover:text-rose-300">Hizmetler</Link><span aria-hidden="true">/</span><span aria-current="page" className="text-slate-300">{service.shortName}</span></nav>
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-rose-400">{service.category}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.06] tracking-tight sm:text-6xl">{service.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">{service.summary}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring">Güncel oran alın</a>
              <Link href={`/oran-hesapla?service=${service.slug}`} className="btn-secondary focus-ring">Yaklaşık hesaplayın</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">{service.highlights.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-bold text-slate-300">✓ {item}</span>)}</div>
          </div>

          <div className="premium-card relative flex min-h-72 items-center justify-center overflow-hidden p-10 sm:min-h-96">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,.13),transparent_58%)]" />
            <Image src={service.logo} alt={`${service.shortName} logosu`} width={560} height={240} sizes="(max-width: 1023px) 72vw, 38vw" priority className="relative z-10 max-h-52 w-[78%] object-contain drop-shadow-2xl" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl"><span className="text-xs font-bold text-slate-400">Güncel taban oran aralığı</span><strong className="text-xl text-rose-300">{service.rate}</strong></div>
          </div>
        </div>
      </section>

      <nav aria-label="Hizmet içi hızlı erişim" className="sticky top-0 z-30 border-b border-white/8 bg-[#090b10]/90 backdrop-blur-xl">
        <div className="content-shell flex gap-2 overflow-x-auto py-3 text-xs font-extrabold [scrollbar-width:none]">
          <a href="#nasil-calisir" className="focus-ring whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-slate-300 hover:border-rose-400/30 hover:text-rose-300">Nasıl çalışır?</a>
          <a href="#hesapla" className="focus-ring whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-slate-300 hover:border-rose-400/30 hover:text-rose-300">Hızlı hesapla</a>
          <a href="#rehberler" className="focus-ring whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-slate-300 hover:border-rose-400/30 hover:text-rose-300">İlgili rehberler</a>
          <a href="#sorun-cozme" className="focus-ring whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-slate-300 hover:border-rose-400/30 hover:text-rose-300">Sorun çözme</a>
          <a href="#islem-baslat" className="focus-ring whitespace-nowrap rounded-full border border-rose-400/25 bg-rose-400/10 px-4 py-2 text-rose-300">İşlem başlat</a>
        </div>
      </nav>

      <section id="nasil-calisir" className="content-shell scroll-mt-24 py-12">
        <div className="mb-7 max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-400">Tek sayfada bütün süreç</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Nasıl çalışır?</h2><p className="mt-3 text-sm leading-7 text-slate-400">Kullanıcıyı başka sitelere dağıtmadan, uygunluk kontrolünden hesaplamaya ve destek akışına kadar bütün adımları Sky Bozum içinde tamamlayın.</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          {service.steps.map((step, index) => (
            <article key={step.title} className="premium-card relative overflow-hidden p-6"><span className="text-xs font-black text-rose-400">0{index + 1}</span><h3 className="mt-3 text-lg font-black">{step.title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{step.text}</p><span aria-hidden="true" className="absolute -bottom-5 -right-2 text-7xl font-black text-white/[0.025]">{index + 1}</span></article>
          ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-slate-500">Oranlar ve uygunluk işlem anında değişebilir. Kod satın almadan veya paylaşmadan önce yazılı onay alın.</p>
      </section>

      <section id="hesapla" className="content-shell scroll-mt-24 pb-14">
        <ServiceMiniCalculator serviceSlug={service.slug} serviceName={service.shortName} />
      </section>

      {service.slug === 'vodafone-mobil-odeme' && <VodafonePremiumSections />}
      {service.slug === 'turkcell-mobil-odeme' && <TurkcellPaycellPremiumSections mode="turkcell" />}
      {service.slug === 'paycell' && <TurkcellPaycellPremiumSections mode="paycell" />}
      {service.slug === 'turk-telekom-mobil-odeme' && <TelekomPokusPremiumSections mode="telekom" />}
      {service.slug === 'pokus' && <TelekomPokusPremiumSections mode="pokus" />}
      {service.slug === 'razer-gold-tl' && <DigitalCodePremiumSections mode="razer-tl" />}
      {service.slug === 'razer-gold-usd' && <DigitalCodePremiumSections mode="razer-usd" />}
      {service.slug === 'itunes-apple' && <DigitalCodePremiumSections mode="apple" />}
      {service.slug === 'steam' && <DigitalCodePremiumSections mode="steam" />}
      {service.slug === 'sms-mobil-odeme' && <CardSmsPremiumSections mode="sms" />}
      {service.slug === 'kredi-karti-sanal-kart' && <CardSmsPremiumSections mode="card" />}

      <section className="content-shell grid gap-10 pb-16 lg:grid-cols-[1fr_340px]">
        <article className="premium-card p-6 sm:p-8">
          {service.sections.map((section, index) => (
            <section key={section.title} className={index ? 'mt-10 border-t border-white/8 pt-10' : ''}>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              {section.bullets && <ul className="mt-5 space-y-3">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="text-rose-400">✓</span>{bullet}</li>)}</ul>}
            </section>
          ))}
        </article>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <TrustChecklist context={service.name} />
          <div className="premium-card p-6"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-400">İşlem öncesi güvenlik</p><h2 className="mt-3 text-xl font-black">Kodunuzu hemen göndermeyin.</h2><ul className="mt-4 space-y-3">{safetyChecks.map((check) => <li key={check} className="flex gap-3 text-xs leading-6 text-slate-400"><span aria-hidden="true" className="text-emerald-400">✓</span><span>{check}</span></li>)}</ul><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring mt-5 w-full">WhatsApp ile bilgi alın</a></div>
          <div className="premium-card p-6"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">Site içinde devam edin</p><div className="mt-4 space-y-3">{journeyLinks.map((item) => <Link key={item.href} href={item.href} className="focus-ring block rounded-xl border border-white/8 bg-white/[0.025] p-4 transition hover:border-rose-400/25"><span className="text-sm font-black text-slate-200">{item.label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span></Link>)}</div></div>
        </aside>
      </section>

      <section id="rehberler" className="scroll-mt-24 border-y border-white/8 bg-[#0d1016] py-14">
        <div className="content-shell">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-400">Bilgi Merkezi</p><h2 className="mt-3 text-3xl font-black">{service.shortName} rehberleri</h2></div><Link href={`/bilgi-merkezi?search=${encodeURIComponent(service.shortName)}`} className="focus-ring text-sm font-black text-rose-300">Tüm ilgili rehberleri göster →</Link></div>
          {related.length > 0 ? <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{related.map((article) => <Link key={article.slug} href={`/bilgi-merkezi/${article.slug}`} className="premium-card focus-ring group p-5"><span className="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-400">{article.category}</span><h3 className="mt-3 text-lg font-black leading-7 transition group-hover:text-rose-300">{article.title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{article.excerpt}</p><span className="mt-5 inline-flex text-xs font-black text-slate-300">Rehberi oku →</span></Link>)}</div> : <div className="premium-card mt-7 p-6 text-sm text-slate-400">Bu hizmete özel yeni rehber hazırlanıyor. Bilgi Merkezi’ndeki mevcut içeriklerden devam edebilirsiniz.</div>}
        </div>
      </section>

      <section id="sorun-cozme" className="content-shell scroll-mt-24 py-14">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Sorun çözme</p><h2 className="mt-3 text-3xl font-black">İşlem tamamlanmıyorsa buradan devam edin.</h2><p className="mt-4 text-sm leading-7 text-slate-400">Kart, limit, doğrulama SMS’i veya kod hatalarında kontrol adımlarını Sky Bozum içinde uygulayın.</p><Link href="/bilgi-merkezi/sorun-cozme" className="btn-secondary focus-ring mt-6">Sorun Çözme Merkezi</Link></div>
          <div className="grid gap-3">
            {troubleshooting.length > 0 ? troubleshooting.map((guide) => <Link key={guide.slug} href={`/bilgi-merkezi/sorun-cozme/${guide.slug}`} className="premium-card focus-ring group p-5"><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-black text-amber-300">{guide.category}</span><h3 className="mt-2 text-lg font-black group-hover:text-amber-200">{guide.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{guide.summary}</p></div><span aria-hidden="true" className="text-xl text-slate-600 transition group-hover:translate-x-1 group-hover:text-amber-300">→</span></div></Link>) : <Link href="/bilgi-merkezi/sorun-cozme" className="premium-card focus-ring p-6"><h3 className="text-lg font-black">Genel sorun çözme rehberleri</h3><p className="mt-2 text-sm leading-6 text-slate-500">Limit, SMS, kart ve dijital kod sorunları için bütün kontrol listelerini görüntüleyin.</p></Link>}
          </div>
        </div>
      </section>

      {alternatives.length > 0 && <section className="border-t border-white/8 bg-[#0d1016] py-14"><div className="content-shell"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-400">Alternatif hizmetler</p><h2 className="mt-3 text-3xl font-black">Aynı kategoride devam edin</h2><div className="mt-7 grid gap-4 md:grid-cols-3">{alternatives.map((item) => <Link key={item.slug} href={`/hizmetler/${item.slug}`} className="premium-card focus-ring flex items-center gap-4 p-5"><div className="flex h-14 w-20 items-center justify-center rounded-xl border border-white/8 bg-white"><Image src={item.logo} alt="" width={120} height={48} className="max-h-9 w-16 object-contain" /></div><div><h3 className="font-black">{item.shortName}</h3><p className="mt-1 text-xs text-slate-500">{item.rate} taban oran</p></div></Link>)}</div></div></section>}

      <section id="islem-baslat" className="scroll-mt-24 border-t border-white/8 py-16">
        <div className="content-shell">
          <div className="relative overflow-hidden rounded-[2rem] border border-rose-400/20 bg-[radial-gradient(circle_at_80%_20%,rgba(244,63,94,.22),transparent_35%),linear-gradient(135deg,#151019,#0b0d12)] p-7 sm:p-10">
            <div className="relative z-10 max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-300">Hazır olduğunuzda</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">{service.shortName} işlemini güvenli biçimde başlatın.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Önce güncel oranı ve ürün uygunluğunu yazılı olarak doğrulayın. Satın alma veya kod paylaşma adımına onaydan sonra geçin.</p><div className="mt-7 flex flex-wrap gap-3"><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring">WhatsApp ile işlem başlat</a><Link href="/iletisim" className="btn-secondary focus-ring">İletişim seçenekleri</Link></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
