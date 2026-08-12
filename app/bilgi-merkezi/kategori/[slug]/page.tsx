import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articleJourneyRank, getArticleCategories, getCategoryBySlug } from '../../../lib/articleCategories';
import { articles } from '../../../lib/site';
import { absoluteUrl, jsonLd } from '../../../lib/seo';
import { getCategoryVisual } from '../../../lib/categoryVisuals';
import ArticleCover from '../../../components/articles/ArticleCover';
import { getArticleJourneyStages, getTopicHubs } from '../../../lib/topicHubs';
import { getManagedContentArticles, mergeManagedArticles } from '../../../lib/managedContent';

export function generateStaticParams() {
  return getArticleCategories(articles).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(mergeManagedArticles(articles, await getManagedContentArticles()), slug);
  if (!category) return {};
  const title = `${category.name} Rehberleri ve Güncel Bilgiler`;
  return {
    title,
    description: category.excerpt,
    alternates: { canonical: `/bilgi-merkezi/kategori/${category.slug}` },
    openGraph: { title, description: category.excerpt, url: `/bilgi-merkezi/kategori/${category.slug}`, type: 'website' },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const visibleArticles = mergeManagedArticles(articles, await getManagedContentArticles());
  const category = getCategoryBySlug(visibleArticles, slug);
  if (!category) return notFound();
  const items = visibleArticles.filter((article) => article.category === category.name).sort((a, b) => articleJourneyRank(a) - articleJourneyRank(b) || a.title.localeCompare(b.title, 'tr'));
  const primaryArticle = items[0];
  const stages = getArticleJourneyStages(items.slice(1));
  const relatedHubs = getTopicHubs().filter((hub) => hub.articles.some((article) => article.category === category.name));
  const canonical = absoluteUrl(`/bilgi-merkezi/kategori/${category.slug}`);
  const categoryVisual = getCategoryVisual(category.slug);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': canonical, name: `${category.name} Rehberleri`, description: category.excerpt, url: canonical, inLanguage: 'tr-TR' },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Bilgi Merkezi', item: absoluteUrl('/bilgi-merkezi') },
        { '@type': 'ListItem', position: 3, name: category.name, item: canonical },
      ] },
      { '@type': 'ItemList', itemListElement: items.map((article, index) => ({ '@type': 'ListItem', position: index + 1, name: article.title, url: absoluteUrl(`/bilgi-merkezi/${article.slug}`) })) },
    ],
  };

  return <main className="knowledge-hub-page knowledge-hub-page--category min-h-screen bg-[#090b10] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <header className="knowledge-hub-hero border-b border-white/8 py-14 sm:py-20"><div className="content-shell">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/" className="focus-ring rounded-sm">Ana Sayfa</Link><span aria-hidden="true">/</span><Link href="/bilgi-merkezi" className="focus-ring rounded-sm">Bilgi Merkezi</Link><span aria-hidden="true">/</span><span aria-current="page" className="text-slate-300">{category.name}</span></nav>
      <p className="mt-8 text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">Kategori merkezi</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{category.name} rehberleri</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">{category.excerpt}</p>
      <div className="knowledge-hub-summary"><span><b>{items.length}</b> doğrulanmış rehber</span><span><b>{String(relatedHubs.length).padStart(2, '0')}</b> konu merkezi</span><Link href="/guven-merkezi">Güvenlik standardı →</Link></div>
      {categoryVisual ? <div className="relative mt-8 aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0e17]"><Image src={categoryVisual.hero} alt={categoryVisual.heroAlt} fill priority sizes="(max-width: 1023px) 100vw, 1024px" className={categoryVisual.hero.toLowerCase().endsWith('.svg') ? 'object-contain p-3 sm:p-5' : 'object-cover'} /></div> : null}
    </div></header>
    <section className="knowledge-hub-archive content-shell py-12 sm:py-16" aria-labelledby="category-archive-title">
      <div className="knowledge-hub-archive__head"><div><p>İÇERİK HARİTASI</p><h2 id="category-archive-title">{category.name} için doğru rehberi seçin.</h2></div><Link href="/bilgi-merkezi">Tüm kategoriler →</Link></div>
      <Link href={`/bilgi-merkezi/${primaryArticle.slug}`} className="focus-ring group mt-8 grid overflow-hidden rounded-[1.75rem] border border-rose-400/20 bg-[linear-gradient(135deg,rgba(127,29,29,.22),rgba(15,23,42,.86)_48%,rgba(3,7,18,.96))] shadow-[0_24px_80px_rgba(0,0,0,.26)] md:grid-cols-[minmax(0,.88fr)_minmax(0,1.12fr)]">
        <ArticleCover article={primaryArticle} priority className="h-full min-h-60 rounded-none border-0" />
        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-rose-400">Kategori başlangıcı · Editörün seçimi</p><h2 className="mt-4 text-2xl font-black leading-tight tracking-tight transition group-hover:text-rose-200 sm:text-4xl">{primaryArticle.title}</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">{primaryArticle.excerpt}</p><div className="mt-6 flex flex-wrap items-center gap-4 text-sm"><span className="font-black text-white">Temel rehbere başla →</span><span className="font-bold text-slate-500">{primaryArticle.readTime}</span></div></div>
      </Link>
      {relatedHubs.length ? <section className="mt-12 border-t border-white/8 pt-8" aria-labelledby="related-topics-title"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">HİZMETE GÖRE DERİNLEŞİN</p><h2 id="related-topics-title" className="mt-3 text-2xl font-black sm:text-3xl">İlgili konu merkezleri</h2></div><p className="max-w-xl text-sm leading-7 text-slate-400">Genel bilgiden sonra kullandığınız hizmetin limit, güvenlik ve sorun çözme rehberlerine geçin.</p></div><div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{relatedHubs.map((hub) => <Link key={hub.slug} href={`/bilgi-merkezi/konu/${hub.slug}`} className="focus-ring rounded-2xl border border-white/8 bg-white/[.025] p-5 transition hover:border-rose-400/30 hover:bg-rose-400/[.04]"><span className="text-xs font-extrabold uppercase tracking-[.15em] text-rose-400">{hub.articles.length} rehber</span><h3 className="mt-2 text-lg font-black text-white">{hub.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{hub.description}</p></Link>)}</div></section> : null}
      <div className="mt-12 space-y-14">{stages.map((stage) => <section key={stage.id} className="border-t border-white/8 pt-8" aria-labelledby={`category-stage-${stage.id}`}><div className="grid gap-3 lg:grid-cols-2 lg:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">{stage.eyebrow}</p><h2 id={`category-stage-${stage.id}`} className="mt-3 text-2xl font-black sm:text-3xl">{stage.title}</h2></div><p className="max-w-xl text-sm leading-7 text-slate-400 lg:justify-self-end">{stage.description}</p></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{stage.articles.map((article) => <Link key={article.slug} href={`/bilgi-merkezi/${article.slug}`} className="premium-card focus-ring group overflow-hidden p-0"><ArticleCover article={article} className="rounded-none border-0" /><div className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-extrabold uppercase tracking-[.14em] text-rose-400">{article.category}</span><span className="text-xs font-bold text-slate-500">{article.readTime}</span></div><h3 className="mt-3 text-lg font-black leading-7 transition group-hover:text-rose-300 sm:text-xl">{article.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">{article.excerpt}</p><span className="mt-5 inline-flex text-sm font-black text-slate-200">Rehberi oku →</span></div></Link>)}</div></section>)}</div>
    </section>
  </main>;
}
