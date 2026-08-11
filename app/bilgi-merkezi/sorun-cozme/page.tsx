import type { Metadata } from 'next';
import Link from 'next/link';
import { troubleshootingGuides } from '../../lib/troubleshooting';
import { absoluteUrl, jsonLd } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Sorun Çözme Merkezi',
  description: 'Mobil ödeme, Paycell, Pokus, Razer Gold, Steam ve hediye kartı sorunları için güvenli kontrol rehberleri.',
  alternates: { canonical: '/bilgi-merkezi/sorun-cozme' },
};

export default function TroubleshootingPage() {
  const categories = [...new Set(troubleshootingGuides.map((guide) => guide.category))];
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Sky Bozum Sorun Çözme Merkezi', url: absoluteUrl('/bilgi-merkezi/sorun-cozme'), mainEntity: { '@type': 'ItemList', itemListElement: troubleshootingGuides.map((guide, index) => ({ '@type': 'ListItem', position: index + 1, name: guide.title, url: absoluteUrl(`/bilgi-merkezi/sorun-cozme/${guide.slug}`) })) } };
  return <main className="min-h-screen bg-[#090b10] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <header className="border-b border-white/8 py-16 sm:py-20"><div className="content-shell">
      <p className="text-xs font-extrabold uppercase tracking-[.2em] text-rose-400">Sorun Çözme Merkezi</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Hata mesajından doğru kontrol adımına ulaşın.</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">Mobil ödeme, dijital cüzdan ve kod işlemlerinde sık görülen sorunları güvenli ve anlaşılır kontrol listeleriyle inceleyin. Bu rehberler resmî destek yerine geçmez; doğru kanala hazırlanmanıza yardımcı olur.</p>
      <div className="mt-8 flex flex-wrap gap-3">{categories.map(category=><a key={category} href={`#${category.toLocaleLowerCase('tr-TR').replace(/\s+/g,'-')}`} className="focus-ring rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-sm font-bold text-slate-300 hover:border-rose-400/40 hover:text-white">{category}</a>)}</div>
    </div></header>
    <section className="content-shell space-y-12 py-12 sm:py-16">{categories.map(category=><section key={category} id={category.toLocaleLowerCase('tr-TR').replace(/\s+/g,'-')}>
      <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-400">Kategori</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">{category}</h2></div><span className="text-sm text-slate-500">{troubleshootingGuides.filter(g=>g.category===category).length} rehber</span></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{troubleshootingGuides.filter(g=>g.category===category).map(guide=><Link key={guide.slug} href={`/bilgi-merkezi/sorun-cozme/${guide.slug}`} className="focus-ring group rounded-3xl border border-white/10 bg-white/[.025] p-6 transition hover:-translate-y-1 hover:border-rose-400/35 hover:bg-white/[.04]"><div className="text-xs font-bold uppercase tracking-wider text-rose-400">{guide.product}</div><h3 className="mt-3 text-xl font-black leading-snug group-hover:text-rose-100">{guide.title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{guide.summary}</p><div className="mt-5 text-sm font-bold text-white">Kontrol rehberini aç →</div></Link>)}</div>
    </section>)}</section>
  </main>;
}
