'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';

type Item = { q: string; a: string; category: string };

function normalize(value: string) { return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

export default function FaqSearch({ items, initialQuery = '', initialCategory = 'Tümü' }: { items: Item[]; initialQuery?: string; initialCategory?: string }) {
  const categories = useMemo(() => ['Tümü', ...new Set(items.map((item) => item.category))], [items]);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : 'Tümü');
  const deferredQuery = useDeferredValue(query);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) params.set('q', query.trim()); else params.delete('q');
    if (category !== 'Tümü') params.set('kategori', category); else params.delete('kategori');
    window.history.replaceState(null, '', `${window.location.pathname}${params.size ? `?${params.toString()}` : ''}`);
  }, [category, query]);
  const filtered = useMemo(() => {
    const needle = normalize(deferredQuery.trim());
    return items.filter((item) => (category === 'Tümü' || item.category === category) && (!needle || normalize(`${item.q} ${item.a}`).includes(needle)));
  }, [category, deferredQuery, items]);

  return (
    <div>
      <div className="premium-card p-4">
        <label className="relative block"><span className="sr-only">Sorularda ara</span><svg className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Sorunuzu veya hizmet adını yazın..." className="focus-ring h-14 w-full rounded-xl border border-white/10 bg-[#11151d] pl-12 pr-4 text-sm font-semibold text-white placeholder:text-slate-600" /></label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Soru kategorileri">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`focus-ring min-h-11 shrink-0 rounded-full px-3.5 py-2 text-xs font-extrabold ${category === item ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white' : 'border border-white/10 text-slate-400'}`}>{item}</button>)}</div>
      </div>
      <div className="mt-4 flex items-center justify-between"><p aria-live="polite" className="text-xs font-bold text-slate-500">{filtered.length} sonuç gösteriliyor</p>{(query || category !== 'Tümü') && <button type="button" onClick={() => { setQuery(''); setCategory('Tümü'); }} className="text-xs font-extrabold text-rose-400">Temizle</button>}</div>
      <div className="mt-5 space-y-3">{filtered.map((item) => <details key={item.q} className="group premium-card px-5 open:border-rose-400/25"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-extrabold text-white"><span><small className="mr-3 text-[10px] font-black uppercase tracking-wider text-rose-400">{item.category}</small>{item.q}</span><span className="text-xl text-slate-500 transition group-open:rotate-45 group-open:text-rose-300" aria-hidden="true">+</span></summary><p className="border-t border-white/8 pb-5 pt-4 text-sm leading-7 text-slate-400">{item.a}</p></details>)}{filtered.length === 0 && <div className="premium-card p-9 text-center"><h2 className="text-lg font-black">Eşleşen soru bulunamadı</h2><p className="mt-2 text-sm text-slate-400">Daha kısa bir arama deneyin veya filtreleri temizleyin.</p></div>}</div>
    </div>
  );
}
