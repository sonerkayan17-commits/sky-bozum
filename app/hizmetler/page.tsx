import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ServiceCard from '../components/services/ServiceCard';
import { articles, services } from '../lib/site';

export const metadata: Metadata = {
  keywords: ['mobil odeme bozum', 'mobil odeme bozdurma', 'Razer Gold bozum', 'Paycell bozum', 'Pokus bozum', 'iTunes hediye karti bozum', 'Steam cuzdan kodu bozum', 'bozum islem rehberi'],
  title: 'Hizmetler',
  description: 'Mobil ödeme, Razer Gold, Paycell, Pokus, Apple, Steam ve kart hizmetlerini inceleyin.',
  alternates: { canonical: '/hizmetler' },
};


const serviceGuideSelections = [
  {
    slug: 'vodafone-mobil-odeme-nedir',
    displayTitle: 'Vodafone Mobil Ödeme Nedir?',
    cover: '/images/hizmetler/rehber-vitrini/vodafone-mobil-odeme.webp',
  },
  {
    slug: 'mobil-odeme-guvenli-mi',
    displayTitle: 'Mobil Ödeme Güvenli mi?',
    cover: '/images/hizmetler/rehber-vitrini/mobil-odeme-guvenli.webp',
  },
  {
    slug: 'razer-gold-kodu-nasil-satilir',
    displayTitle: 'Razer Gold Nasıl Bozulur?',
    cover: '/images/hizmetler/rehber-vitrini/razer-gold-bozdurma.webp',
  },
  {
    slug: 'mobil-odeme-nasil-acilir',
    displayTitle: 'Mobil Ödeme Nasıl Açılır?',
    cover: '/images/hizmetler/rehber-vitrini/mobil-odeme-nasil-acilir.webp',
  },
  {
    slug: 'paycell-ile-razer-gold-nasil-alinir',
    displayTitle: 'Paycell ile Razer Gold Nasıl Alınır?',
    cover: '/images/hizmetler/rehber-vitrini/paycell-razer-gold.webp',
  },
  {
    slug: 'turkcell-mobil-odeme-nasil-kullanilir',
    displayTitle: 'Turkcell Mobil Ödeme Nasıl Kullanılır?',
    cover: '/images/hizmetler/rehber-vitrini/turkcell-mobil-odeme.webp',
  },
] as const;

const serviceGuideExcerpts: Partial<Record<(typeof serviceGuideSelections)[number]['slug'], string>> = {
  'mobil-odeme-nasil-acilir': 'Vodafone, Turkcell ve Türk Telekom’da mobil ödemeyi açma, limit kontrolü ve kullanım adımlarını öğrenin.',
};

const serviceGuides = serviceGuideSelections
  .map((selection) => {
    const article = articles.find((item) => item.slug === selection.slug);
    return article ? { article, ...selection } : null;
  })
  .filter((selection): selection is NonNullable<typeof selection> => Boolean(selection));

const groupCopy: Record<string, string> = {
  'Dijital Kodlar': 'Oyun, mağaza ve uygulama kodları',
  'Mobil Ödeme': 'Operatör limitleri ve dijital cüzdanlar',
  'Kart Çözümleri': 'Kredi kartı ve sanal kart yöntemleri',
};

const groupDescription: Record<string, string> = {
  'Dijital Kodlar': 'Razer Gold, Apple Gift Card ve Steam kodları için bölge, para birimi ve kullanılmamış kod şartlarını inceleyin.',
  'Mobil Ödeme': 'Vodafone, Turkcell, Türk Telekom, Paycell ve Pokus işlemlerinde izlenecek yöntemi operatörünüze göre seçin.',
  'Kart Çözümleri': 'Desteklenen kartlarla dijital ürün satın almadan önce mağaza, ürün ve uygunluk koşullarını doğrulayın.',
};

export default function ServicesPage() {
  const groups = [...new Set(services.map((service) => service.category))];

  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <section className="relative overflow-hidden border-b border-white/8 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(244,63,94,.13),transparent_35%),radial-gradient(circle_at_90%_90%,rgba(249,115,22,.08),transparent_30%)]" />
        <div className="content-shell relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-400">Sky Bozum hizmetleri</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Dijital bakiyeniz için <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">doğru işlem sayfası.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">Ne bozdurmak istediğinizi seçin; güncel oran aralığını, işlem adımlarını ve dikkat edilmesi gerekenleri tek sayfada görün.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2">{services.length} hizmet sayfası</span>
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2">İşlem öncesi oran teyidi</span>
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2">Adım adım rehber</span>
          </div>
        </div>
      </section>

      <section id="tum-hizmetler" className="content-shell space-y-16 py-14 sm:py-20">
        {groups.map((group, index) => {
          const groupServices = services.filter((service) => service.category === group);
          return (
            <div key={group}>
              <div className="mb-6 flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black text-rose-400">{String(index + 1).padStart(2, '0')}</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{groupCopy[group] ?? group}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{groupDescription[group]}</p>
                </div>
                <p className="text-sm text-slate-500">{groupServices.length} hizmet</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {groupServices.map((service) => <ServiceCard key={service.slug} service={service} />)}
              </div>
            </div>
          );
        })}
      </section>

      <section className="content-shell pb-16 sm:pb-20" aria-labelledby="service-guides-title">
        <div className="mb-7 flex flex-col gap-4 border-b border-white/8 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Hizmet makaleleri</p>
            <h2 id="service-guides-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Tüm rehberler tek merkezde.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">Her makale kendi hizmet sayfasıyla bağlantılıdır; operatör, dijital cüzdan ve kod rehberlerine buradan da ulaşabilirsiniz.</p>
          </div>
          <Link href="/bilgi-merkezi" className="shrink-0 text-sm font-black text-amber-300 transition hover:text-amber-200">Bilgi Merkezi’ni açın →</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceGuides.map(({ article, displayTitle, cover }) => {
            const relatedService = services.find((service) => service.slug === article.serviceSlug);
            return (
              <article key={article.slug} className="group overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.018] shadow-[0_18px_50px_rgba(0,0,0,.22)] transition hover:-translate-y-1 hover:border-amber-300/25">
                <Link href={`/bilgi-merkezi/${article.slug}`} className="block">
                  <div className="relative aspect-[16/8.5] overflow-hidden border-b border-white/8 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,.14),transparent_35%),linear-gradient(145deg,#111722,#0a0e15)]">
                    <Image src={cover} alt={article.coverAlt ?? displayTitle} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.13em] text-amber-300">
                      <span>{article.category}</span><span className="text-slate-500">{article.readTime}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-black leading-snug tracking-tight text-white">{displayTitle}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{serviceGuideExcerpts[article.slug as keyof typeof serviceGuideExcerpts] ?? article.excerpt}</p>
                  </div>
                </Link>
                {relatedService ? (
                  <Link href={`/hizmetler/${relatedService.slug}`} className="mx-5 mb-5 flex items-center gap-3 rounded-xl border border-white/8 bg-black/20 px-3.5 py-3 text-xs font-extrabold text-slate-300 transition hover:border-amber-300/25 hover:text-white">
                    <span className="relative grid h-8 w-10 place-items-center rounded-lg bg-white/95 p-1.5"><Image src={relatedService.logo} alt="" fill sizes="40px" className="object-contain p-1.5" /></span>
                    <span>{relatedService.shortName} hizmet sayfası</span><span className="ml-auto text-amber-300">→</span>
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>

        {articles.length > serviceGuides.length ? (
          <div className="mt-8 flex justify-center">
            <Link
              href="/bilgi-merkezi"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-amber-300/25 bg-amber-300/[0.07] px-6 py-3 text-sm font-black text-amber-200 shadow-[0_14px_35px_rgba(0,0,0,.2)] transition hover:-translate-y-0.5 hover:border-amber-300/45 hover:bg-amber-300/[0.12] hover:text-amber-100"
            >
              <span>Tüm hizmet makalelerini gör</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        ) : null}
      </section>

      <section className="content-shell pb-20">
        <div className="premium-card flex flex-col gap-5 bg-gradient-to-r from-rose-950/35 to-orange-950/20 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-400">Hangi hizmeti seçeceğinizden emin değil misiniz?</p><h2 className="mt-2 text-2xl font-black">Tutarı ve bakiye türünü yazın, birlikte netleştirelim.</h2></div>
          <Link href="/iletisim" className="btn-primary focus-ring shrink-0">Destek alın</Link>
        </div>
      </section>
    </main>
  );
}
