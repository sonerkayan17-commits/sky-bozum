'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../lib/site-config';
import SiteSearch from './SiteSearch';

const items = [
  ['Ana Sayfa', '/'],
  ['Hizmetlerimiz', '/hizmetler'],
  ['Araçlar', '/araclar'],
  ['Operatörler', '/operatorler'],
  ['Rehber', '/bilgi-merkezi'],
  ['Referanslar', '/referanslar'],
  ['Güven', '/guven-merkezi'],
  ['S.S.S.', '/sss'],
  ['İletişim', '/iletisim'],
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open && !searchOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const menu = open ? mobileMenuRef.current : mobileSearchRef.current;
    const menuButton = menuButtonRef.current;
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusFrame = requestAnimationFrame(() => {
      const firstFocusable = menu?.querySelector<HTMLElement>(focusableSelector);
      firstFocusable?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        setSearchOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !menu) return;
      const focusable = Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (open) requestAnimationFrame(() => menuButton?.focus());
    };
  }, [open, searchOpen]);

  const active = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08090e]/88 text-white backdrop-blur-2xl">
      <div className="content-shell flex h-[68px] items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3" aria-label="Sky Bozum ana sayfa">
          <span className="relative h-11 w-11 overflow-hidden rounded-xl border border-pink-500/20 shadow-[0_10px_28px_rgba(236,72,153,.18)]"><Image src="/brand-logo.webp" alt="Sky Bozum Mobil Ödeme logosu" fill sizes="44px" className="object-cover" priority /></span>
          <span className="leading-none">
            <span className="block text-[11px] font-black uppercase tracking-[.24em] text-[#f2c98a]">Sky</span>
            <span className="mt-1 block text-lg font-black tracking-[-.04em] text-white">BOZUM</span>
          </span>
        </Link>

        <SiteSearch mode="desktop" />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Ana menü">
          {items.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? 'page' : undefined}
              className={`relative inline-flex min-h-11 items-center rounded-lg px-3 py-2.5 text-[13px] font-bold tracking-[-.01em] transition ${
                active(href)
                  ? 'text-pink-400'
                  : 'text-slate-300 hover:bg-white/[.055] hover:text-white'
              }`}
            >
              {label}
              {active(href) && <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-gradient-to-r from-pink-500 to-[#e8c27a] shadow-[0_0_12px_rgba(236,72,153,.65)]" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={siteConfig.liveSupportHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-orange-400 px-5 text-sm font-black text-white shadow-[0_12px_30px_rgba(236,72,153,.22)] transition hover:-translate-y-0.5 hover:brightness-110 sm:inline-flex"
          >
            Destek Hattı
          </a>
          <button
            type="button"
            aria-expanded={searchOpen}
            aria-controls="mobile-site-search"
            aria-label={searchOpen ? 'Aramayı kapat' : 'Sitede ara'}
            onClick={() => { setSearchOpen((value) => !value); setOpen(false); }}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[.045] text-slate-200 transition hover:bg-white/[.09] lg:hidden"
          >
            {searchOpen ? <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" /></svg> : <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m16 16 4 4"/></svg>}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            onClick={() => { setOpen((value) => !value); setSearchOpen(false); }}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[.045] text-slate-200 transition hover:bg-white/[.09] xl:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d={open ? 'M6 18 18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </div>

      {searchOpen && (
        <>
          <button type="button" className="fixed inset-x-0 bottom-0 top-[68px] z-40 bg-black/55 backdrop-blur-[2px] lg:hidden" aria-label="Aramayı kapat" onClick={() => setSearchOpen(false)} />
          <div ref={mobileSearchRef} id="mobile-site-search" role="dialog" aria-modal="true" aria-label="Site araması" className="absolute inset-x-0 top-full z-50 border-t border-white/10 bg-[#0b0d12]/98 shadow-[0_24px_70px_rgba(0,0,0,.55)] lg:hidden">
            <div className="content-shell py-4"><SiteSearch mode="mobile" autoFocus onNavigate={() => setSearchOpen(false)} /></div>
          </div>
        </>
      )}

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-[68px] z-40 bg-black/55 backdrop-blur-[2px] xl:hidden"
            aria-label="Mobil menüyü kapat"
            onClick={() => setOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil navigasyon"
            className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-white/10 bg-[#0b0d12]/98 shadow-[0_24px_70px_rgba(0,0,0,.55)] xl:hidden"
          >
            <nav className="content-shell space-y-1 py-4" aria-label="Mobil menü">
              {items.map(([label, href]) => (
                <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined} onClick={() => setOpen(false)} className={`block min-h-11 rounded-xl px-4 py-3 text-sm font-bold ${active(href) ? 'bg-pink-500/15 text-pink-300' : 'text-slate-300 hover:bg-white/[.05] hover:text-white'}`}>
                  {label}
                </Link>
              ))}
              <a href={siteConfig.liveSupportHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 to-orange-400 px-4 py-3 text-center text-sm font-black text-white">
                {siteConfig.liveSupportLabel}
              </a>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
