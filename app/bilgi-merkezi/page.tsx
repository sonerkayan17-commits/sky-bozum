import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ArticleExplorer from '../components/articles/ArticleExplorer';
import LearningPathShowcase from '../components/articles/LearningPathShowcase';
import { articles } from '../lib/site';
import { absoluteUrl, jsonLd } from '../lib/seo';
import { getIntentCoverage } from '../lib/searchIntent';

type SearchParamValue = string | string[] | undefined;
type KnowledgeSearchParams = Record<string, SearchParamValue>;

const allowedSorts = ['popular', 'newest', 'az'] as const;
const allowedTopics = ['Tümü', 'Mobil Ödeme', 'Operatörler', 'Dijital Kodlar', 'Güvenlik', 'Kart İşlemleri'] as const;

function firstParam(value: SearchParamValue, fallback: string, maxLength: number) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return typeof candidate === 'string' ? candidate.slice(0, maxLength) : fallback;
}

function normalizeKnowledgeParams(params: KnowledgeSearchParams) {
  const q = firstParam(params.q, '', 100);
  const kategori = firstParam(params.kategori, 'Tümü', 50);
  const requestedSort = firstParam(params.sirala, 'popular', 20);
  const requestedTopic = firstParam(params.konu, 'Tümü', 40);

  return {
    q,
    kategori,
    sirala: allowedSorts.includes(requestedSort as (typeof allowedSorts)[number])
      ? requestedSort as (typeof allowedSorts)[number]
      : 'popular',
    konu: allowedTopics.includes(requestedTopic as (typeof allowedTopics)[number])
      ? requestedTopic as (typeof allowedTopics)[number]
      : 'Tümü',
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<KnowledgeSearchParams>;
}): Promise<Metadata> {
  const params = normalizeKnowledgeParams(await searchParams);
  const hasSearchQuery = Boolean(params.q.trim());
  const hasCategoryFilter = params.kategori !== 'Tümü';
  const hasTopicFilter = params.konu !== 'Tümü';
  const hasSortFilter = params.sirala !== 'popular';
  const hasFilteredView = hasSearchQuery || hasCategoryFilter || hasTopicFilter || hasSortFilter;

  return {
    title: 'Bilgi Merkezi',
    description: 'Mobil ödeme, Paycell, Pokus, Razer Gold ve dijital bakiye rehberleri.',
    alternates: { canonical: '/bilgi-merkezi', types: { 'application/rss+xml': '/feed.xml' } },
    openGraph: {
      title: 'Sky Bozum Bilgi Merkezi',
      description: 'Mobil ödeme, dijital cüzdanlar, hediye kartları ve güvenli işlem rehberleri.',
      url: '/bilgi-merkezi',
      type: 'website',
      images: [{ url: '/images/bilgi-merkezi/v40-guide-system/guide-hub-hero.webp', width: 1600, height: 1000, alt: 'Sky Bozum mobil ödeme, operatör bakiyesi ve dijital kod rehberleri' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sky Bozum Bilgi Merkezi',
      description: 'Mobil ödeme ve dijital bakiye rehberleri.',
      images: ['/images/bilgi-merkezi/v40-guide-system/guide-hub-hero.webp'],
    },
    robots: hasFilteredView
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<KnowledgeSearchParams> }) {
  const { q, kategori, sirala, konu } = normalizeKnowledgeParams(await searchParams);
  const intentCoverage = getIntentCoverage();
  const entryRoutes = [
    { eyebrow: 'Hizmete göre', title: 'Hangi bakiyeyi kullanacağınızı biliyorsanız', description: 'Vodafone, Turkcell, Türk Telekom, Paycell, Pokus ve dijital kod hizmetlerinden doğru başlangıç noktasını seçin.', href: '/hizmetler', action: 'Hizmetleri incele', number: '01' },
    { eyebrow: 'Soruna göre', title: 'İşlem tamamlanmıyor veya hata veriyorsa', description: 'Limit, SMS, kart ve kod sorunlarında tekrar denemeden önce güvenli kontrol sırasını uygulayın.', href: '/bilgi-merkezi/sorun-cozme', action: 'Sorunu çöz', number: '02' },
    { eyebrow: 'Güvenliğe göre', title: 'İşlem öncesi kanalı doğrulamak istiyorsanız', description: 'Paylaşılmaması gereken bilgileri, resmî kanalları ve güvenli işlem standardını kontrol edin.', href: '/guven-merkezi', action: 'Güvenlik kontrolü', number: '03' },
    { eyebrow: 'Sonuca göre', title: 'Yaklaşık ödeme karşılığını görmek istiyorsanız', description: 'Hizmet ve tutar seçerek güncel taban oran üzerinden yaklaşık sonucu hesaplayın.', href: '/araclar#hesapla', action: 'Hesaplamaya geç', number: '04' },
  ];
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Blog', '@id': `${absoluteUrl('/bilgi-merkezi')}#blog`, name: 'Sky Bozum Bilgi Merkezi', url: absoluteUrl('/bilgi-merkezi'), description: 'Mobil ödeme, dijital cüzdanlar, hediye kartları ve güvenli işlem rehberleri.', inLanguage: 'tr-TR', publisher: { '@id': `${absoluteUrl('/')}#organization` } },
    { '@type': 'CollectionPage', '@id': absoluteUrl('/bilgi-merkezi'), name: 'Sky Bozum Bilgi Merkezi', isPartOf: { '@id': `${absoluteUrl('/')}#website` }, mainEntity: { '@id': `${absoluteUrl('/bilgi-merkezi')}#blog` } },
    { '@type': 'ItemList', itemListElement: articles.slice(0, 50).map((article, index) => ({ '@type': 'ListItem', position: index + 1, url: absoluteUrl(`/bilgi-merkezi/${article.slug}`), name: article.title })) },
  ] };
  return (
    <main className="knowledge-center-page min-h-screen bg-[#090b10] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <style dangerouslySetInnerHTML={{ __html: `
        a[href="/bilgi-merkezi/dijital-kod-satin-almadan-once-kontrol-listesi"] .article-generated-cover {
          background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/dijital-kod-satin-alma-kontrolu.webp') center/cover no-repeat !important;
        }
        a[href="/bilgi-merkezi/dijital-kod-satin-almadan-once-kontrol-listesi"] .article-generated-cover > * {
          opacity: 0 !important;
        }
        a[href="/bilgi-merkezi/guncel-bozum-orani-nasil-ogrenilir"] .article-premium-cover {
          background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/guncel-bozum-orani-ekosistem-v2.webp') center/cover no-repeat !important;
        }
        a[href="/bilgi-merkezi/bozum-talebi-nasil-olusturulur"] .article-premium-cover {
          background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/bozum-talebi-ekosistem-v2.webp') center/cover no-repeat !important;
        }
        a[href="/bilgi-merkezi/guncel-bozum-orani-nasil-ogrenilir"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/bozum-talebi-nasil-olusturulur"] .article-premium-cover > img {
          opacity: 0 !important;
        }
        a[href="/bilgi-merkezi/vodafone-mobil-odeme-nedir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/vodafone-mobil-odeme-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/turkcell-mobil-odeme-nasil-kullanilir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/turkcell-mobil-odeme-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/turk-telekom-mobil-odeme-rehberi"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/turk-telekom-mobil-odeme-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/kredi-karti-sanal-kart-islem-reddedildi"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/kart-islemleri-urun-dogrulama.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/paycell-nedir-nasil-kullanilir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/paycell-bakiye-limit-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/pokus-nedir-razer-gold-nasil-alinir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/pokus-bakiye-limit-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/razer-gold-nedir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/razer-gold-tl-usd-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/apple-gift-card-nedir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/apple-gift-card-bolge-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/steam-cuzdan-kodu-nedir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/steam-cuzdan-kodu-bolge-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/google-play-hediye-karti-nedir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/google-play-kod-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/playstation-store-hediye-karti-nedir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/playstation-store-kod-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/magaza-hediye-kartlari-rehberi"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/magaza-hediye-karti-bozum.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/istanbulkart-nedir"] .article-premium-cover { background: #090b10 url('/images/bilgi-merkezi/editorial-covers-v46/istanbulkart-bakiye-uygunluk.webp') center/cover no-repeat !important; }
        a[href="/bilgi-merkezi/vodafone-mobil-odeme-nedir"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/turkcell-mobil-odeme-nasil-kullanilir"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/turk-telekom-mobil-odeme-rehberi"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/kredi-karti-sanal-kart-islem-reddedildi"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/paycell-nedir-nasil-kullanilir"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/pokus-nedir-razer-gold-nasil-alinir"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/razer-gold-nedir"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/apple-gift-card-nedir"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/steam-cuzdan-kodu-nedir"] .article-premium-cover > img { opacity: 0 !important; }
        a[href="/bilgi-merkezi/google-play-hediye-karti-nedir"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/playstation-store-hediye-karti-nedir"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/magaza-hediye-kartlari-rehberi"] .article-premium-cover > img,
        a[href="/bilgi-merkezi/istanbulkart-nedir"] .article-premium-cover > img { opacity: 0 !important; }
      ` }} />
      <section className="relative overflow-hidden border-b border-white/8 py-12 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(244,63,94,.17),transparent_44%)]" />
        <div className="content-shell relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1.1fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/15 bg-rose-300/[.07] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-rose-300"><span className="size-1.5 rounded-full bg-rose-300 shadow-[0_0_16px_rgba(251,113,133,.9)]" /> Sky Bozum Editoryal</div>
            <h1 className="mt-6 max-w-4xl text-[2.45rem] font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Aradığınız işlem rehberine <span className="bg-gradient-to-r from-rose-300 via-orange-200 to-amber-200 bg-clip-text text-transparent">saniyeler içinde</span> ulaşın.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">Mobil ödeme, operatörler, dijital kodlar ve güvenli işlem adımları için düzenli, güncel ve görsel destekli içerikler.</p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-slate-400"><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5"><b className="text-rose-300">{articles.length}</b> doğrulanmış rehber</span><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5"><b className="text-rose-300">{intentCoverage.total}</b> arama niyeti</span><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5"><b className="text-rose-300">%{intentCoverage.coverage}</b> içerik kapsamı</span></div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.02] shadow-2xl shadow-black/40">
            <Image src="/images/bilgi-merkezi/v40-guide-system/guide-hub-hero.webp" alt="Mobil ödeme, operatör bakiyesi, Paycell, Pokus, Razer Gold ve dijital kod rehberlerini gösteren Sky Bozum Bilgi Merkezi görseli" fill priority sizes="(max-width: 1023px) 100vw, 650px" className="object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[.04]" />
          </div>
        </div>
      </section>
      <section className="content-shell pt-8 sm:pt-10">
        <LearningPathShowcase />
      </section>
      <section className="content-shell pt-8 sm:pt-10" aria-labelledby="knowledge-entry-title">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">Tek soruyla başlayın</p><h2 id="knowledge-entry-title" className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Bugün neyi çözmek istiyorsunuz?</h2></div><p className="max-w-xl text-sm leading-7 text-slate-400">Makale listesinde kaybolmadan ihtiyacınıza en yakın yolu seçin; ilgili hizmete, kontrole veya araca doğrudan geçin.</p></div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{entryRoutes.map((route) => <Link key={route.href} href={route.href} className="focus-ring group flex min-h-64 flex-col rounded-3xl border border-white/8 bg-[linear-gradient(155deg,rgba(255,255,255,.045),rgba(9,12,17,.96))] p-6 transition hover:-translate-y-1 hover:border-rose-400/30"><div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-[.16em] text-rose-400">{route.eyebrow}</span><span className="text-sm font-black text-slate-700">{route.number}</span></div><h3 className="mt-8 text-xl font-black leading-7 text-white">{route.title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{route.description}</p><span className="mt-auto pt-6 text-sm font-black text-slate-200 transition group-hover:text-rose-300">{route.action} →</span></Link>)}</div>
      </section>
      <section className="content-shell py-10 sm:py-16"><ArticleExplorer articles={articles} initialQuery={q} initialCategory={kategori} initialSort={sirala} initialTopic={konu} /></section>
    </main>
  );
}
