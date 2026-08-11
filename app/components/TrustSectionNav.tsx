'use client';

import { useEffect, useRef, useState } from 'react';

const sections = [
  ['islem-standardi', 'Güvenlik görevi'],
  ['guven-kontrolu', 'Güven kontrolü'],
  ['risk-kontrol', 'Risk kontrolü'],
  ['guvenli-islem', 'İşlem akışı'],
  ['sorun-cozucu', 'Sorun çözücü'],
] as const;

export default function TrustSectionNav() {
  const [activeId, setActiveId] = useState<string>(sections[0][0]);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const targets = sections
      .map(([id]) => document.getElementById(id))
      .filter((target): target is HTMLElement => Boolean(target));

    if (!targets.length) return;

    const headerHeight = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'),
    ) || 68;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: `-${headerHeight + 82}px 0px -62% 0px`, threshold: [0.05, 0.2, 0.5] },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    linkRefs.current[activeId]?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
  }, [activeId]);

  return (
    <nav aria-label="Güven Merkezi bölüm bağlantıları" className="content-shell sticky top-[var(--site-header-height)] z-30 py-3 sm:py-4">
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/8 bg-[#090b10]/92 p-2 text-sm font-bold shadow-xl backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map(([id, label]) => {
          const active = activeId === id;
          return (
            <a
              key={id}
              ref={(node) => { linkRefs.current[id] = node; }}
              href={`#${id}`}
              aria-current={active ? 'location' : undefined}
              className={`focus-ring whitespace-nowrap rounded-xl px-4 py-2 transition ${
                active
                  ? 'bg-emerald-400/[.12] text-emerald-200 shadow-[inset_0_0_0_1px_rgba(52,211,153,.18)]'
                  : 'text-slate-300 hover:bg-white/[.05] hover:text-emerald-200'
              }`}
            >
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
