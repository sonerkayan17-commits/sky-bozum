'use client';

import Link from 'next/link';
import { KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { searchContent, type SearchItem } from '../lib/search';

type Props = { mode?: 'desktop' | 'mobile'; onNavigate?: () => void; autoFocus?: boolean };

export default function SiteSearch({ mode = 'desktop', onNavigate, autoFocus = false }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const results = useMemo<SearchItem[]>(() => searchContent(query), [query]);
  const root = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, []);

  function reset() {
    setOpen(false);
    setActiveIndex(-1);
    setQuery('');
    onNavigate?.();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      window.location.assign(results[activeIndex].href);
    }
  }

  return (
    <div ref={root} className={`relative min-w-0 flex-1 ${mode === 'desktop' ? 'hidden lg:block lg:max-w-[380px]' : 'block w-full'}`}>
      <label className="relative block">
        <span className="sr-only">Sitede ara</span>
        <svg className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          autoFocus={autoFocus}
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          aria-autocomplete="list"
          value={query}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setOpen(true)}
          onChange={(event) => { const value = event.target.value; setQuery(value); setOpen(Boolean(value.trim())); setActiveIndex(-1); }}
          placeholder="Hizmet, rehber veya makale ara..."
          className="field focus-ring min-h-11 bg-white/[.045] pl-12 pr-4 text-sm font-semibold placeholder:text-slate-500"
        />
      </label>

      {open && (
        <div id={listId} role="listbox" aria-label="Arama sonuçları" className={`z-[60] max-h-[min(440px,60dvh)] overflow-y-auto rounded-2xl border border-white/10 bg-[#11141b] p-2 shadow-2xl shadow-black/50 ${mode === 'desktop' ? 'absolute left-0 right-0 top-[calc(100%+10px)]' : 'relative mt-2'}`}>
          {results.length ? results.map((item, index) => (
            <Link
              id={`${listId}-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              key={`${item.type}-${item.href}`}
              href={item.href}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={reset}
              className={`block rounded-xl px-4 py-3 transition ${activeIndex === index ? 'bg-white/[.08]' : 'hover:bg-white/[.06]'}`}
            >
              <div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-black text-white">{item.title}</p><span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-pink-400">{item.type}</span></div>
              <p className="mt-1 line-clamp-1 text-xs text-slate-400">{item.description}</p>
            </Link>
          )) : <p className="px-4 py-6 text-center text-sm text-slate-400">Sonuç bulunamadı. Daha kısa bir kelime deneyin.</p>}
          <p className="border-t border-white/8 px-4 pb-1 pt-2 text-[10px] text-slate-500">↑ ↓ ile seçin · Enter ile açın · Esc ile kapatın</p>
        </div>
      )}
    </div>
  );
}
