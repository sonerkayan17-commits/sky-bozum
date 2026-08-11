import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, getService } from '../../../lib/site';
import { siteConfig } from '../../../lib/site-config';
import { absoluteUrl, jsonLd } from '../../../lib/seo';
import { getTroubleshootingGuide, troubleshootingGuides } from '../../../lib/troubleshooting';

export function generateStaticParams() {
  return troubleshootingGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getTroubleshootingGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.summary,
    keywords: guide.keywords,
    alternates: { canonical: `/bilgi-merkezi/sorun-cozme/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.summary, url: `/bilgi-merkezi/sorun-cozme/${guide.slug}`, type: 'article' },
  };
}

export default async function TroubleshootingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getTroubleshootingGuide(slug);
  if (!guide) return notFound();
  const service = guide.serviceSlug ? getService(guide.serviceSlug) : undefined;
  const relatedArticles = (guide.articleSlugs?.map((articleSlug) => articles.find((item) => item.slug === articleSlug)).filter(Boolean) ?? articles.filter((article) => article.serviceSlug && article.serviceSlug === guide.serviceSlug)).slice(0, 4);
  const canonical = absoluteUrl(`/bilgi-merkezi/sorun-cozme/${guide.slug}`);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': canonical, name: guide.title, description: guide.summary, url: canonical, inLanguage: 'tr-TR' },
      { '@type': 'HowTo', name: guide.title, description: guide.summary, totalTime: 'PT10M', step: guide.checks.map((check, index) => ({ '@type': 'HowToStep', position: index + 1, name: check.title, text: check.text })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Bilgi Merkezi', item: absoluteUrl('/bilgi-merkezi') },
        { '@type': 'ListItem', position: 3, name: 'Sorun Çözme Merkezi', item: absoluteUrl('/bilgi-merkezi/sorun-cozme') },
        { '@type': 'ListItem', position: 4, name: guide.title, item: canonical },
      ] },
    ],
  };

  return <main className="min-h-screen bg-[#090b10] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <header className="border-b border-white/8 py-14 sm:py-20"><div className="content-shell">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/" className="focus-ring rounded-sm">Ana Sayfa</Link><span aria-hidden="true">/</span><Link href="/bilgi-merkezi" className="focus-ring rounded-sm">Bilgi Merkezi</Link><span aria-hidden="true">/</span><Link href="/bilgi-merkezi/sorun-cozme" className="focus-ring rounded-sm">Sorun Çözme</Link><span aria-hidden="true">/</span><span aria-current="page" className="text-slate-300">{guide.title}</span></nav>
      <p className="mt-8 text-xs font-extrabold uppercase tracking-[.18em] text-amber-300">{guide.category} · {guide.product}</p>
      <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">{guide.title}</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">{guide.summary}</p>
    </div></header>
    <div className="content-shell grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_340px]">
      <article className="space-y-8">
        <section className="premium-card p-6 sm:p-8"><h2 className="text-2xl font-black">Belirtiler</h2><ul className="mt-5 space-y-3">{guide.symptoms.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-slate-300"><span className="text-amber-300">•</span>{item}</li>)}</ul></section>
        <section className="premium-card p-6 sm:p-8"><h2 className="text-2xl font-black">Olası nedenler</h2><ul className="mt-5 space-y-3">{guide.causes.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-slate-300"><span className="text-rose-300">•</span>{item}</li>)}</ul></section>
        <section className="premium-card p-6 sm:p-8" aria-labelledby="troubleshooting-checks-title"><h2 id="troubleshooting-checks-title" className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-300">Adım adım kontrol</h2><div className="mt-6 space-y-5">{guide.checks.map((check, index) => <div key={check.title} className="rounded-2xl border border-white/8 bg-white/[.025] p-5"><div className="flex gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-black text-emerald-300">{index + 1}</span><div><h3 className="text-lg font-black">{check.title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{check.text}</p></div></div></div>)}</div></section>
        <section className="rounded-3xl border border-amber-300/15 bg-amber-300/[.045] p-6 sm:p-8"><h2 className="text-xl font-black text-amber-200">Güvenlik uyarıları</h2><ul className="mt-4 space-y-3">{guide.warnings.map((warning) => <li key={warning} className="flex gap-3 text-sm leading-7 text-slate-300"><span>⚠</span>{warning}</li>)}</ul></section>
      </article>
      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        {service && <div className="premium-card p-6"><p className="text-xs font-extrabold uppercase tracking-[.15em] text-rose-400">İlgili hizmet</p><h2 className="mt-3 text-xl font-black">{service.shortName}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{service.summary}</p><Link href={`/bilgi-merkezi/konu/${service.slug}`} className="btn-secondary focus-ring mt-5 w-full">İlgili rehberleri aç</Link></div>}
        <div className="premium-card p-6"><p className="text-xs font-extrabold uppercase tracking-[.15em] text-slate-500">Devam edin</p><div className="mt-4 space-y-3"><Link href="/bilgi-merkezi/sorun-cozme" className="focus-ring block rounded-xl border border-white/8 p-4 text-sm font-black">Tüm sorun rehberleri →</Link><a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp desteği yeni sekmede açılır" className="focus-ring block rounded-xl border border-white/8 p-4 text-sm font-black">WhatsApp desteği <span aria-hidden="true">↗</span></a></div></div>
      </aside>
    </div>
    {relatedArticles.length > 0 && <section className="border-t border-white/8 bg-[#0d1016] py-14" aria-labelledby="related-troubleshooting-guides-title"><div className="content-shell"><h2 id="related-troubleshooting-guides-title" className="text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">İlgili rehberler</h2><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{relatedArticles.map((article) => article && <Link key={article.slug} href={`/bilgi-merkezi/${article.slug}`} className="premium-card focus-ring p-5"><h3 className="text-lg font-black leading-7">{article.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{article.excerpt}</p></Link>)}</div></div></section>}
  </main>;
}
