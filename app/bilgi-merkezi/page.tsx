import type { Metadata } from 'next';
import Link from '../components/DeferredLink';
import Image from 'next/image';
import DeferredArticleExplorer from '../components/articles/DeferredArticleExplorer';
import LearningPathShowcase from '../components/articles/LearningPathShowcase';
import { articles } from '../lib/site';
import { absoluteUrl, jsonLd } from '../lib/seo';
import { getManagedContentArticles, mergeManagedArticles } from '../lib/managedContent';

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
  const visibleArticles = mergeManagedArticles(articles, await getManagedContentArticles());
  const explorerArticles = visibleArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    readTime: article.readTime,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    cover: article.cover,
    coverAlt: article.coverAlt,
    keywords: article.keywords,
    searchText: '',
  }));
  const entryRoutes = [
    { eyebrow: 'Hizmete göre', title: 'Hangi bakiyeyi kullanacağınızı biliyorsanız', description: 'Vodafone, Turkcell, Türk Telekom, Paycell, Pokus ve dijital kod hizmetlerinden doğru başlangıç noktasını seçin.', href: '/hizmetler', action: 'Hizmetleri incele', number: '01' },
    { eyebrow: 'Soruna göre', title: 'İşlem tamamlanmıyor veya hata veriyorsa', description: 'Limit, SMS, kart ve kod sorunlarında tekrar denemeden önce güvenli kontrol sırasını uygulayın.', href: '/bilgi-merkezi/sorun-cozme', action: 'Sorunu çöz', number: '02' },
    { eyebrow: 'Güvenliğe göre', title: 'İşlem öncesi kanalı doğrulamak istiyorsanız', description: 'Paylaşılmaması gereken bilgileri, resmî kanalları ve güvenli işlem standardını kontrol edin.', href: '/guven-merkezi', action: 'Güvenlik kontrolü', number: '03' },
    { eyebrow: 'Sonuca göre', title: 'Yaklaşık ödeme karşılığını görmek istiyorsanız', description: 'Hizmet ve tutar seçerek güncel taban oran üzerinden yaklaşık sonucu hesaplayın.', href: '/araclar#oran-hesapla', action: 'Hesaplamaya geç', number: '04' },
  ];
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Blog', '@id': `${absoluteUrl('/bilgi-merkezi')}#blog`, name: 'Sky Bozum Bilgi Merkezi', url: absoluteUrl('/bilgi-merkezi'), description: 'Mobil ödeme, dijital cüzdanlar, hediye kartları ve güvenli işlem rehberleri.', inLanguage: 'tr-TR', publisher: { '@id': `${absoluteUrl('/')}#organization` } },
    { '@type': 'CollectionPage', '@id': absoluteUrl('/bilgi-merkezi'), name: 'Sky Bozum Bilgi Merkezi', isPartOf: { '@id': `${absoluteUrl('/')}#website` }, mainEntity: { '@id': `${absoluteUrl('/bilgi-merkezi')}#blog` } },
    { '@type': 'ItemList', itemListElement: visibleArticles.slice(0, 50).map((article, index) => ({ '@type': 'ListItem', position: index + 1, url: absoluteUrl(`/bilgi-merkezi/${article.slug}`), name: article.title })) },
  ] };
  return (
    <main className="knowledge-center-page min-h-screen bg-[#090b10] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <section className="relative overflow-hidden border-b border-white/8 py-12 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(244,63,94,.17),transparent_44%)]" />
        <div className="content-shell relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1.1fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/15 bg-rose-300/[.07] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-rose-300"><span className="size-1.5 rounded-full bg-rose-300 shadow-[0_0_16px_rgba(251,113,133,.9)]" /> Sky Bozum Editoryal</div>
            <h1 className="mt-6 max-w-4xl text-[2.45rem] font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Aradığınız işlem rehberine <span className="bg-gradient-to-r from-rose-300 via-orange-200 to-amber-200 bg-clip-text text-transparent">saniyeler içinde</span> ulaşın.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">Mobil ödeme, operatörler, dijital kodlar ve güvenli işlem adımları için düzenli, güncel ve görsel destekli içerikler.</p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-slate-400"><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5">Hizmete göre düzenlenmiş rehberler</span><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5">İşlem öncesi kontrol adımları</span><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5">Güvenlik uyarıları</span></div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.02] shadow-2xl shadow-black/40">
            <Image src="/images/bilgi-merkezi/v40-guide-system/guide-hub-hero.webp" alt="Mobil ödeme, operatör bakiyesi, Paycell, Pokus, Razer Gold ve dijital kod rehberlerini gösteren Sky Bozum Bilgi Merkezi görseli" fill priority fetchPriority="high" loading="eager" decoding="sync" quality={68} sizes="(max-width: 1023px) calc(100vw - 54px), 650px" className="object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[.04]" />
          </div>
        </div>
      </section>
      <section className="content-shell pt-8 sm:pt-10">
        <LearningPathShowcase />
      </section>
      <section className="content-shell pt-8 sm:pt-10" aria-labelledby="knowledge-entry-title">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">Tek soruyla başlayın</p><h2 id="knowledge-entry-title" className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Bugün neyi çözmek istiyorsunuz?</h2></div><p className="max-w-xl text-sm leading-7 text-slate-400">Makale listesinde kaybolmadan ihtiyacınıza en yakın yolu seçin; ilgili hizmete, kontrole veya araca doğrudan geçin.</p></div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">{entryRoutes.map((route) => <Link key={route.href} href={route.href} className="focus-ring knowledge-entry-card group flex min-h-48 flex-col rounded-2xl border border-white/8 bg-[linear-gradient(155deg,rgba(255,255,255,.045),rgba(9,12,17,.96))] p-3 transition hover:-translate-y-1 hover:border-rose-400/30 sm:min-h-64 sm:rounded-3xl sm:p-6"><div className="flex items-center justify-between gap-2"><span className="text-[8px] font-extrabold uppercase tracking-[.12em] text-rose-400 sm:text-xs sm:tracking-[.16em]">{route.eyebrow}</span><span className="text-[10px] font-black text-slate-700 sm:text-sm">{route.number}</span></div><h3 className="mt-4 text-sm font-black leading-5 text-white sm:mt-8 sm:text-xl sm:leading-7">{route.title}</h3><p className="mt-2 line-clamp-3 text-[10px] leading-4 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">{route.description}</p><span className="mt-auto pt-3 text-[10px] font-black text-slate-200 transition group-hover:text-rose-300 sm:pt-6 sm:text-sm">{route.action} →</span></Link>)}</div>
      </section>
      <section className="content-shell py-10 sm:py-16"><DeferredArticleExplorer articles={explorerArticles} initialQuery={q} initialCategory={kategori} initialSort={sirala} initialTopic={konu} /></section>
    </main>
  );
}
