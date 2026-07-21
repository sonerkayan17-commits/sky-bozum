import Link from 'next/link';
import type { ArticleItem } from '../../lib/site';

export default function SectionRelatedLinks({ items }: { items: ArticleItem[] }) {
  if (!items.length) return null;
  return <aside className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-500/[0.035] p-5" aria-label="Bu bölümle ilgili rehberler">
    <p className="text-xs font-extrabold uppercase tracking-[.15em] text-rose-400">Bu bölümle ilgili</p>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">{items.map((item) => <Link key={item.slug} href={`/bilgi-merkezi/${item.slug}`} className="group flex min-h-12 items-center justify-between rounded-xl border border-white/8 bg-black/10 px-4 py-3 text-sm font-extrabold text-slate-200 transition hover:border-rose-400/30 hover:bg-rose-500/[0.05]"><span>{item.title}</span><span className="ml-3 text-rose-400 transition group-hover:translate-x-1">→</span></Link>)}</div>
  </aside>;
}
