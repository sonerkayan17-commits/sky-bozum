import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicHub, getTopicHubs, getTopicHubStages } from '../../../lib/topicHubs';
import { absoluteUrl, jsonLd } from '../../../lib/seo';
import ArticleCover from '../../../components/articles/ArticleCover';
import ContentEngagement from '../../../components/community/ContentEngagement';

export function generateStaticParams() {
  return getTopicHubs().map((hub) => ({ slug: hub.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hub = getTopicHub(slug);
  if (!hub) return {};
  const title = `${hub.name} Bilgi Merkezi`;
  return {
    title,
    description: hub.description,
    alternates: { canonical: `/bilgi-merkezi/konu/${hub.slug}` },
    openGraph: { title, description: hub.description, url: `/bilgi-merkezi/konu/${hub.slug}`, type: 'website' },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = getTopicHub(slug);
  if (!hub) return notFound();
  const primaryArticle = hub.articles[0];
  const stages = getTopicHubStages({ ...hub, articles: hub.articles.slice(1) });
  const canonical = absoluteUrl(`/bilgi-merkezi/konu/${hub.slug}`);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': canonical, name: `${hub.name} Bilgi Merkezi`, description: hub.description, url: canonical, inLanguage: 'tr-TR' },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Bilgi Merkezi', item: absoluteUrl('/bilgi-merkezi') },
        { '@type': 'ListItem', position: 3, name: hub.name, item: canonical },
      ] },
      { '@type': 'ItemList', itemListElement: hub.articles.map((article, index) => ({ '@type': 'ListItem', position: index + 1, name: article.title, url: absoluteUrl(`/bilgi-merkezi/${article.slug}`) })) },
    ],
  };

  return <main className="knowledge-hub-page knowledge-hub-page--topic min-h-screen bg-[#090b10] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <header className="knowledge-hub-hero border-b border-white/8 py-14 sm:py-20"><div className="content-shell">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/" className="focus-ring rounded-sm">Ana Sayfa</Link><span aria-hidden="true">/</span><Link href="/bilgi-merkezi" className="focus-ring rounded-sm">Bilgi Merkezi</Link><span aria-hidden="true">/</span><span aria-current="page" className="text-slate-300">{hub.name}</span></nav>
      <p className="mt-8 text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">Konu merkezi</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{hub.name} bilgi merkezi</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">{hub.description}</p>
      <div className="knowledge-hub-summary"><span><b>{hub.articles.length}</b> bağlantılı rehber</span><span><b>{String(stages.length + 1).padStart(2, '0')}</b> okuma aşaması</span><Link href="/guven-merkezi">Güvenlik standardı →</Link></div>
      <div className="mt-7 flex flex-wrap gap-3">{hub.serviceSlug ? <Link href={`/hizmetler/${hub.serviceSlug}`} className="btn-primary focus-ring">Hizmet ve güncel koşullar</Link> : null}<Link href="/bilgi-merkezi/sorun-cozme" className="btn-secondary focus-ring">Sorun çözme rehberleri</Link></div>
    </div></header>
    <section className="knowledge-hub-archive content-shell py-12 sm:py-16" aria-labelledby="topic-archive-title">
      <div className="knowledge-hub-archive__head"><div><p>ÖNERİLEN OKUMA SIRASI</p><h2 id="topic-archive-title">Temelden işleme doğru ilerleyin.</h2></div><Link href="/bilgi-merkezi">Tüm rehberler →</Link></div>
      <Link href={`/bilgi-merkezi/${primaryArticle.slug}`} className="focus-ring group mt-8 grid overflow-hidden rounded-[1.75rem] border border-rose-400/20 bg-[linear-gradient(135deg,rgba(127,29,29,.22),rgba(15,23,42,.86)_48%,rgba(3,7,18,.96))] shadow-[0_24px_80px_rgba(0,0,0,.26)] md:grid-cols-[minmax(0,.88fr)_minmax(0,1.12fr)]">
        <ArticleCover article={primaryArticle} priority className="h-full min-h-60 rounded-none border-0" />
        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-rose-400">Başlangıç rehberi · Önce bunu okuyun</p>
          <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight transition group-hover:text-rose-200 sm:text-4xl">{primaryArticle.title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">{primaryArticle.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm"><span className="font-black text-white">Temel rehbere başla →</span><span className="font-bold text-slate-500">{primaryArticle.readTime}</span></div>
        </div>
      </Link>
      <div className="mt-10 space-y-14">
        {stages.map((stage, stageIndex) => <section key={stage.id} aria-labelledby={`stage-${stage.id}`} className="border-t border-white/8 pt-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-end">
            <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">{stage.eyebrow}</p><h2 id={`stage-${stage.id}`} className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{stage.title}</h2></div>
            <p className="max-w-2xl text-sm leading-7 text-slate-400 lg:justify-self-end">{stage.description}</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stage.articles.map((article, articleIndex) => <Link key={article.slug} href={`/bilgi-merkezi/${article.slug}`} className="premium-card focus-ring group overflow-hidden p-0"><ArticleCover article={article} priority={stageIndex === 0 && articleIndex < 2} className="rounded-none border-0" /><div className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-extrabold uppercase tracking-[.14em] text-rose-400">{article.category}</span><span className="text-xs font-bold text-slate-500">{article.readTime}</span></div><h3 className="mt-3 text-lg font-black leading-7 transition group-hover:text-rose-300 sm:text-xl">{article.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">{article.excerpt}</p><span className="mt-5 inline-flex text-sm font-black text-slate-200">Rehberi oku →</span></div></Link>)}
          </div>
        </section>)}
      </div>
      <ContentEngagement targetId={hub.slug} title={`${hub.name} konusu`} kind="topic" />
    </section>
  </main>;
}
