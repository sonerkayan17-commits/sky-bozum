import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleCategories, getCategoryBySlug } from '../../../lib/articleCategories';
import { articles } from '../../../lib/site';
import { absoluteUrl, jsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return getArticleCategories(articles).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(articles, slug);
  if (!category) return {};
  const title = `${category.name} Rehberleri`;
  return {
    title,
    description: category.excerpt,
    alternates: { canonical: `/bilgi-merkezi/kategori/${category.slug}` },
    openGraph: { title, description: category.excerpt, url: `/bilgi-merkezi/kategori/${category.slug}`, type: 'website' },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(articles, slug);
  if (!category) notFound();
  const items = articles.filter((article) => article.category === category.name);
  const canonical = absoluteUrl(`/bilgi-merkezi/kategori/${category.slug}`);
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

  return <main className="min-h-screen bg-[#090b10] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <header className="border-b border-white/8 py-14 sm:py-20"><div className="content-shell">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/">Ana Sayfa</Link><span>/</span><Link href="/bilgi-merkezi">Bilgi Merkezi</Link><span>/</span><span className="text-slate-300">{category.name}</span></nav>
      <p className="mt-8 text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">Kategori merkezi</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{category.name} rehberleri</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">{category.excerpt}</p>
      <p className="mt-5 text-sm font-bold text-slate-500">{items.length} içerik</p>
    </div></header>
    <section className="content-shell py-12 sm:py-16"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((article) => <Link key={article.slug} href={`/bilgi-merkezi/${article.slug}`} className="premium-card focus-ring group p-6"><span className="text-xs font-extrabold uppercase tracking-[.14em] text-rose-400">{article.category}</span><h2 className="mt-3 text-xl font-black leading-7 transition group-hover:text-rose-300">{article.title}</h2><p className="mt-3 text-sm leading-7 text-slate-500">{article.excerpt}</p><span className="mt-5 inline-flex text-sm font-black text-slate-200">Rehberi oku →</span></Link>)}
    </div></section>
  </main>;
}
