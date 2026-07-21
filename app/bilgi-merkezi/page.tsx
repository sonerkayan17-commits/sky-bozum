import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleExplorer from '../components/articles/ArticleExplorer';
import { articles } from '../lib/site';
import { absoluteUrl, jsonLd } from '../lib/seo';

type KnowledgeSearchParams = {
  q?: string;
  kategori?: string;
  sirala?: 'popular' | 'newest' | 'az';
  konu?: 'Tümü' | 'Mobil Ödeme' | 'Operatörler' | 'Dijital Kodlar' | 'Güvenlik' | 'Kart İşlemleri';
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<KnowledgeSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasFilteredView = Boolean(
    params.q?.trim() ||
      (params.kategori && params.kategori !== 'Tümü') ||
      (params.konu && params.konu !== 'Tümü') ||
      (params.sirala && params.sirala !== 'popular'),
  );

  return {
    title: 'Bilgi Merkezi',
    description: 'Mobil ödeme, Paycell, Pokus, Razer Gold ve dijital bakiye rehberleri.',
    alternates: { canonical: '/bilgi-merkezi', types: { 'application/rss+xml': '/feed.xml' } },
    openGraph: {
      title: 'Sky Bozum Bilgi Merkezi',
      description: 'Mobil ödeme, dijital cüzdanlar, hediye kartları ve güvenli işlem rehberleri.',
      url: '/bilgi-merkezi',
      type: 'website',
      images: [{ url: '/hero-customer.webp', width: 1600, height: 900, alt: 'Sky Bozum Bilgi Merkezi' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sky Bozum Bilgi Merkezi',
      description: 'Mobil ödeme ve dijital bakiye rehberleri.',
      images: ['/hero-customer.webp'],
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
  const { q = '', kategori = 'Tümü', sirala = 'popular', konu = 'Tümü' } = await searchParams;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Blog', '@id': `${absoluteUrl('/bilgi-merkezi')}#blog`, name: 'Sky Bozum Bilgi Merkezi', url: absoluteUrl('/bilgi-merkezi'), description: 'Mobil ödeme, dijital cüzdanlar, hediye kartları ve güvenli işlem rehberleri.', inLanguage: 'tr-TR', publisher: { '@id': `${absoluteUrl('/')}#organization` } },
    { '@type': 'CollectionPage', '@id': absoluteUrl('/bilgi-merkezi'), name: 'Sky Bozum Bilgi Merkezi', isPartOf: { '@id': `${absoluteUrl('/')}#website` }, mainEntity: { '@id': `${absoluteUrl('/bilgi-merkezi')}#blog` } },
    { '@type': 'ItemList', itemListElement: articles.slice(0, 50).map((article, index) => ({ '@type': 'ListItem', position: index + 1, url: absoluteUrl(`/bilgi-merkezi/${article.slug}`), name: article.title })) },
  ] };
  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <section className="relative overflow-hidden border-b border-white/8 py-16 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,.18),transparent_42%)]" />
        <div className="content-shell relative text-center"><div className="mx-auto inline-flex items-center gap-2 rounded-full border border-rose-300/15 bg-rose-300/[.07] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-rose-300"><span className="size-1.5 rounded-full bg-rose-300 shadow-[0_0_16px_rgba(251,113,133,.9)]" /> Sky Bozum Editoryal</div><h1 className="mx-auto mt-6 max-w-5xl text-[2.45rem] font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Aradığınız işlem rehberine <span className="bg-gradient-to-r from-rose-300 via-orange-200 to-amber-200 bg-clip-text text-transparent">saniyeler içinde</span> ulaşın.</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">Mobil ödeme, operatörler, dijital kodlar ve güvenli işlem adımları için düzenli, güncel ve aranabilir içerikler.</p><div className="mt-7 flex flex-wrap justify-center gap-2 text-xs font-bold text-slate-500"><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5">Editör seçimi</span><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5">Okuma süresi</span><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5">Güncellik bilgisi</span></div></div>
      </section>
      <section className="content-shell pt-8 sm:pt-10"><Link href="/bilgi-merkezi/sorun-cozme" className="block rounded-3xl border border-rose-400/20 bg-rose-400/[.045] p-6 transition hover:border-rose-400/40 sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">Yeni merkez</p><div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-black sm:text-3xl">Sorun Çözme Merkezi</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">Çalışmıyor, hata veriyor, kod geçersiz veya SMS gelmiyor gibi yüksek niyetli sorunlara güvenli kontrol adımlarıyla ulaşın.</p></div><span className="text-sm font-black text-white">Rehberleri aç →</span></div></Link></section>
      <section className="content-shell py-10 sm:py-16"><ArticleExplorer articles={articles} initialQuery={q.slice(0, 100)} initialCategory={kategori.slice(0, 50)} initialSort={sirala} initialTopic={konu} /></section>
    </main>
  );
}
