'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../lib/site';
import SiteSearch from './SiteSearch';

const items = [
  ['Ana Sayfa', '/'],
  ['Hizmetlerimiz', '/hizmetler'],
  ['İş Ortaklığı', '/is-ortakligi'],
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
  const firstMobileLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const focusFrame = requestAnimationFrame(() => firstMobileLink.current?.focus());
    window.addEventListener('keydown', close);
    return () => { cancelAnimationFrame(focusFrame); document.body.style.overflow = previous; window.removeEventListener('keydown', close); };
  }, [open]);

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
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[.045] text-slate-200 transition hover:bg-white/[.09] xl:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d={open ? 'M6 18 18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-navigation" aria-hidden={!open} className={`overflow-hidden border-t border-white/10 bg-[#0b0d12]/98 transition-all duration-300 xl:hidden ${open ? 'max-h-[calc(100dvh-74px)] overflow-y-auto opacity-100' : 'pointer-events-none max-h-0 opacity-0'}`}>
        <nav className="content-shell space-y-1 py-4" aria-label="Mobil menü">
          <div className="mb-4"><SiteSearch mode="mobile" onNavigate={() => setOpen(false)} /></div>
          {items.map(([label, href], index) => (
            <Link ref={index === 0 ? firstMobileLink : undefined} key={href} href={href} aria-current={active(href) ? 'page' : undefined} onClick={() => setOpen(false)} className={`block min-h-11 rounded-xl px-4 py-3 text-sm font-bold ${active(href) ? 'bg-pink-500/15 text-pink-300' : 'text-slate-300 hover:bg-white/[.05] hover:text-white'}`}>
              {label}
            </Link>
          ))}
          <a href={siteConfig.liveSupportHref} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 to-orange-400 px-4 py-3 text-center text-sm font-black text-white">
            {siteConfig.liveSupportLabel}
          </a>
        </nav>
      </div>
    </header>
  );
}
