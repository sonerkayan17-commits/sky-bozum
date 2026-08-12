'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { featuredSearchItems, searchContent, searchItems, type SearchItem } from '../lib/search';

type Props = { mode?: 'desktop' | 'mobile'; onNavigate?: () => void; autoFocus?: boolean };

type SearchGroup = { label: string; items: Array<{ item: SearchItem; index: number }> };

const groupOrder: SearchItem['type'][] = ['Hizmet', 'Makale', 'Araç', 'Sayfa'];
const groupLabels: Record<SearchItem['type'], string> = {
  Hizmet: 'Hizmetler',
  Makale: 'Rehberler ve makaleler',
  Araç: 'Araçlar',
  Sayfa: 'Sayfalar',
};

const typeStyles: Record<SearchItem['type'], string> = {
  Hizmet: 'border-pink-400/20 bg-pink-400/10 text-pink-300',
  Makale: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
  Araç: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
  Sayfa: 'border-violet-300/20 bg-violet-300/10 text-violet-200',
};

function dynamicSearch(items: SearchItem[], query: string, limit = 14) {
  const normalized = query.trim().toLocaleLowerCase('tr-TR');
  const tokens = normalized.split(/\s+/).filter(Boolean);
  return items.map((item) => {
    const haystack = `${item.title} ${item.description} ${item.keywords.join(' ')}`.toLocaleLowerCase('tr-TR');
    const matches = tokens.filter((token) => haystack.includes(token)).length;
    const score = (item.title.toLocaleLowerCase('tr-TR').startsWith(normalized) ? 8 : 0) + (haystack.includes(normalized) ? 4 : 0) + matches;
    return { item, score };
  }).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'tr')).slice(0, limit).map((entry) => entry.item);
}

export default function SiteSearch({ mode = 'desktop', onNavigate, autoFocus = false }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [managedArticles, setManagedArticles] = useState<SearchItem[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetch('/api/search').then((response) => response.ok ? response.json() : []).then((items: SearchItem[]) => {
      if (alive && Array.isArray(items)) setManagedArticles(items);
    }).catch(() => undefined);
    return () => { alive = false; };
  }, []);
  const availableItems = useMemo(() => {
    if (!managedArticles) return searchItems;
    const managedHrefs = new Set(managedArticles.map((item) => item.href));
    return [...searchItems.filter((item) => item.type !== 'Makale' || !managedHrefs.has(item.href)), ...managedArticles];
  }, [managedArticles]);
  const results = useMemo<SearchItem[]>(
    () => query.trim() ? (managedArticles ? dynamicSearch(availableItems, query, 14) : searchContent(query, 14)) : featuredSearchItems,
    [availableItems, managedArticles, query],
  );
  const groups = useMemo<SearchGroup[]>(() => groupOrder.map((type) => ({
    label: groupLabels[type],
    items: results
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.type === type),
  })).filter((group) => group.items.length), [results]);
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const listId = useId();
  const statusId = `${listId}-status`;

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, []);

  useEffect(() => {
    if (mode !== 'desktop') return;
    const openWithShortcut = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey || event.key.toLocaleLowerCase('tr-TR') !== 'k') return;
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    window.addEventListener('keydown', openWithShortcut);
    return () => window.removeEventListener('keydown', openWithShortcut);
  }, [mode]);


  useEffect(() => {
    if (activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  function reset() {
    setOpen(false);
    setActiveIndex(-1);
    setQuery('');
    onNavigate?.();
  }

  function clearQuery() {
    setQuery('');
    setActiveIndex(-1);
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
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
    } else if (event.key === 'Home') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(results.length - 1);
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      const target = results[activeIndex];
      reset();
      router.push(target.href);
    }
  }

  const hasQuery = Boolean(query.trim());

  return (
    <div ref={root} className={`site-search-root ${mode === 'desktop' ? 'site-search-root--desktop hidden lg:block' : 'site-search-root--mobile block w-full'}`}>
      <label className="relative block">
        <span className="sr-only">Site genelinde ara</span>
        <svg className="site-search-icon pointer-events-none absolute size-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          autoFocus={autoFocus}
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          aria-autocomplete="list"
          aria-describedby={statusId}
          aria-keyshortcuts={mode === 'desktop' ? 'Control+K Meta+K' : undefined}
          value={query}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value.slice(0, 100));
            setOpen(true);
            setActiveIndex(-1);
          }}
          placeholder="Hizmet, operatör, rehber veya araç ara..."
          className={`site-search-input field focus-ring bg-white/[.045] text-sm font-semibold placeholder:text-slate-500 ${mode === 'desktop' ? 'site-search-input--desktop' : 'site-search-input--mobile'}`}
        />
        {hasQuery ? (
          <button type="button" onClick={clearQuery} aria-label="Aramayı temizle" className="focus-ring absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-lg text-slate-400 transition hover:bg-white/[.07] hover:text-white">×</button>
        ) : mode === 'desktop' ? (
          <kbd className="site-search-shortcut pointer-events-none absolute rounded-md border border-white/10 bg-white/[.045] px-2 py-1 text-[10px] font-black text-slate-500">Ctrl K</kbd>
        ) : null}
      </label>

      <span id={statusId} className="sr-only" aria-live="polite">
        {open ? (results.length ? `${results.length} sonuç gösteriliyor.` : 'Sonuç bulunamadı.') : ''}
      </span>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label={hasQuery ? 'Arama sonuçları' : 'Popüler aramalar'}
          className={`z-[60] max-h-[min(560px,68dvh)] overflow-y-auto rounded-2xl border border-white/10 bg-[#10131a]/[.98] p-2 shadow-2xl shadow-black/60 backdrop-blur-2xl ${mode === 'desktop' ? 'absolute left-1/2 top-[calc(100%+10px)] w-[min(680px,calc(100vw-32px))] -translate-x-1/2' : 'relative mt-2'}`}
        >
          <div className="flex items-center justify-between gap-4 px-3 pb-2 pt-1">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-500">{hasQuery ? `“${query.trim()}” için sonuçlar` : 'Popüler ve hızlı erişim'}</p>
            {!hasQuery && <span className="text-[10px] font-bold text-slate-600">Yazmaya başlayın</span>}
          </div>

          {results.length ? groups.map((group) => (
            <section key={group.label} className="mb-1 last:mb-0" aria-label={group.label}>
              <p className="px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[.16em] text-slate-600">{group.label}</p>
              {group.items.map(({ item, index }) => (
                <Link
                  ref={(node) => { optionRefs.current[index] = node; }}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  key={`${item.type}-${item.href}`}
                  href={item.href}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={reset}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${activeIndex === index ? 'bg-white/[.09]' : 'hover:bg-white/[.06]'}`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-[11px] font-black ${typeStyles[item.type]}`} aria-hidden="true">{item.type === 'Hizmet' ? 'H' : item.type === 'Makale' ? 'R' : item.type === 'Araç' ? 'A' : 'S'}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-black text-white">{item.title}</span>
                    <span className="mt-1 block truncate text-xs text-slate-400">{item.description}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-slate-600 transition group-hover:text-pink-300">{item.type}</span>
                  <span className="shrink-0 text-sm text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-amber-200" aria-hidden="true">→</span>
                </Link>
              ))}
            </section>
          )) : (
            <div className="px-5 py-9 text-center">
              <p className="text-sm font-black text-white">Sonuç bulunamadı.</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">Daha kısa bir kelime, marka veya operatör adı deneyin.</p>
            </div>
          )}

          <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-white/8 px-3 pb-1 pt-2 text-[10px] text-slate-500">
            <span>↑ ↓ seç · Home/End başa/sona git · Enter aç · Esc kapat</span>
            {hasQuery && (
              <Link href={`/bilgi-merkezi?q=${encodeURIComponent(query.trim())}`} onClick={reset} className="focus-ring rounded-md px-2 py-1 font-black text-amber-200 transition hover:bg-amber-300/10">Tüm rehberlerde ara →</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
