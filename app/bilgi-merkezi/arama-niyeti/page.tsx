import type { Metadata } from 'next';
import Link from 'next/link';
import { getIntentCoverage, getMissingIntents, searchIntents } from '../../lib/searchIntent';

export const metadata: Metadata = {
  title: 'Arama Niyeti ve Rehber Haritası',
  description: 'Sky Bozum hizmetleri için tanım, kullanım, limit, bakiye, sorun, güvenlik ve hesaplama içeriklerini tek merkezde keşfedin.',
  alternates: { canonical: '/bilgi-merkezi/arama-niyeti' },
};

export default function SearchIntentPage() {
  const stats = getIntentCoverage();
  const groups = searchIntents.reduce((map, item) => { const current = map.get(item.serviceName) ?? []; current.push(item); map.set(item.serviceName, current); return map; }, new Map<string, typeof searchIntents>());
  const missing = getMissingIntents(12);
  return <main className="min-h-screen bg-[#090b10] text-white">
    <header className="border-b border-white/8 py-16"><div className="content-shell">
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-rose-400">SEO Rehber Haritası</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Aradığınız cevaba doğru içerik türünden ulaşın</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">Tanım, kullanım, limit, bakiye, sorun çözme, güvenlik ve hesaplama niyetleri hizmetlerle eşleştirilmiştir. Bu sayfa içerik tekrarını azaltır ve doğru rehbere geçişi hızlandırır.</p>
      <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">{[['Toplam niyet',stats.total],['Bağlı içerik',stats.covered],['Planlanan',stats.missing],['Kapsama',`%${stats.coverage}`]].map(([label,value])=><div key={label} className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><div className="text-2xl font-black">{value}</div><div className="mt-1 text-xs text-slate-500">{label}</div></div>)}</div>
    </div></header>
    <section className="content-shell py-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">{[...groups.entries()].map(([service, intents])=><section key={service} className="rounded-3xl border border-white/10 bg-white/[.025] p-5 sm:p-7"><h2 className="text-xl font-black">{service}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{intents.map(intent=>intent.href?<Link key={intent.id} href={intent.href} className="focus-ring rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-rose-400/40"><div className="text-xs font-bold uppercase tracking-wider text-rose-400">{intent.kind}</div><div className="mt-2 font-bold">{intent.query}</div><div className="mt-2 text-xs text-slate-500">{intent.destinationType} →</div></Link>:<div key={intent.id} className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-4 opacity-70"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Planlanan</div><div className="mt-2 font-bold text-slate-300">{intent.query}</div><div className="mt-2 text-xs text-slate-600">{intent.reason}</div></div>)}</div></section>)}</div>
        <aside className="h-fit rounded-3xl border border-amber-400/20 bg-amber-400/[.04] p-6 lg:sticky lg:top-24"><h2 className="text-lg font-black">Öncelikli içerik boşlukları</h2><p className="mt-2 text-sm leading-6 text-slate-400">V32–V35 adımlarında önce yüksek niyetli eksikler tamamlanacak.</p><ol className="mt-5 space-y-3">{missing.map((item,index)=><li key={item.id} className="text-sm"><span className="mr-2 text-amber-400">{index+1}.</span>{item.query}</li>)}</ol></aside>
      </div>
    </section>
    <nav className="content-shell border-t border-white/10 py-10" aria-label="İçerik merkezleri arasında gezin">
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-slate-600">İçerikten işleme geçin</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-slate-300">
        <Link href="/hizmetler" className="transition hover:text-rose-300">Hizmet ve oran sayfaları →</Link>
        <Link href="/araclar" className="transition hover:text-rose-300">Hesaplama araçları →</Link>
        <Link href="/sss" className="transition hover:text-rose-300">SSS yanıtları →</Link>
        <Link href="/topluluk" className="transition hover:text-rose-300">Topluluk deneyimleri →</Link>
      </div>
    </nav>
  </main>;
}
