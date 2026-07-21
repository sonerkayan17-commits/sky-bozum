import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicHub, getTopicHubs } from '../../../lib/topicHubs';
import { absoluteUrl, jsonLd } from '../../../lib/seo';

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
  if (!hub) notFound();
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

  return <main className="min-h-screen bg-[#090b10] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <header className="border-b border-white/8 py-14 sm:py-20"><div className="content-shell">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/">Ana Sayfa</Link><span>/</span><Link href="/bilgi-merkezi">Bilgi Merkezi</Link><span>/</span><span className="text-slate-300">{hub.name}</span></nav>
      <p className="mt-8 text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">Konu merkezi</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{hub.name} bilgi merkezi</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">{hub.description}</p>
      <div className="mt-7 flex flex-wrap gap-3"><Link href={`/hizmetler/${hub.serviceSlug}`} className="btn-primary focus-ring">Hizmet sayfasına git</Link><Link href="/bilgi-merkezi/sorun-cozme" className="btn-secondary focus-ring">Sorun çözme rehberleri</Link></div>
    </div></header>
    <section className="content-shell py-12 sm:py-16"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {hub.articles.map((article) => <Link key={article.slug} href={`/bilgi-merkezi/${article.slug}`} className="premium-card focus-ring group p-6"><span className="text-xs font-extrabold uppercase tracking-[.14em] text-rose-400">{article.category}</span><h2 className="mt-3 text-xl font-black leading-7 transition group-hover:text-rose-300">{article.title}</h2><p className="mt-3 text-sm leading-7 text-slate-500">{article.excerpt}</p><span className="mt-5 inline-flex text-sm font-black text-slate-200">Rehberi oku →</span></Link>)}
    </div></section>
  </main>;
}
