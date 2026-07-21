'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { searchContent, searchItems, type SearchItem } from '../lib/search';

const featured = searchItems.filter((item) => ['/araclar','/bilgi-merkezi','/sss','/iletisim'].includes(item.href));

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo<SearchItem[]>(() => query.trim() ? searchContent(query, 10) : featured, [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => { window.clearTimeout(timer); document.body.style.overflow = previous; };
  }, [open]);

  function close() { setOpen(false); setQuery(''); setActive(0); }

  if (!open) return (
    <button type="button" onClick={() => setOpen(true)} className="command-trigger" aria-label="Hızlı aramayı aç">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
      <span>Hızlı ara</span><kbd>Ctrl K</kbd>
    </button>
  );

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className="command-panel" role="dialog" aria-modal="true" aria-label="Sky Bozum hızlı arama">
        <div className="command-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
          <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={(event) => {
            if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
            if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
            if (event.key === 'Enter' && results[active]) { window.location.assign(results[active].href); }
          }} placeholder="Hizmet, araç, makale veya soru ara..." aria-label="Site genelinde ara" />
          <button type="button" onClick={close}>Esc</button>
        </div>
        <div className="command-results">
          <p className="command-label">{query.trim() ? 'En alakalı sonuçlar' : 'Hızlı erişim'}</p>
          {results.length ? results.map((item, index) => (
            <Link key={`${item.type}-${item.href}`} href={item.href} onClick={close} onMouseEnter={() => setActive(index)} className={`command-result ${active === index ? 'is-active' : ''}`}>
              <span className="command-result-icon">{item.type === 'Makale' ? 'R' : item.type === 'Hizmet' ? 'H' : 'S'}</span>
              <span className="min-w-0"><strong>{item.title}</strong><small>{item.description}</small></span>
              <em>{item.type}</em>
            </Link>
          )) : <div className="command-empty">Sonuç bulunamadı. Daha kısa veya farklı bir kelime deneyin.</div>}
        </div>
        <footer className="command-footer"><span>↑ ↓ seçim</span><span>Enter aç</span><span>Esc kapat</span></footer>
      </section>
    </div>
  );
}
