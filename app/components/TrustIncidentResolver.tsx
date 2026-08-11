'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

type Incident = {
  question: string;
  now: string;
  avoid: string;
  records: string;
};

export default function TrustIncidentResolver({ incidents }: { incidents: readonly Incident[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = incidents[activeIndex];

  function selectAndFocus(index: number) {
    const normalized = (index + incidents.length) % incidents.length;
    setActiveIndex(normalized);
    tabRefs.current[normalized]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      selectAndFocus(index + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      selectAndFocus(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectAndFocus(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectAndFocus(incidents.length - 1);
    }
  }

  return (
    <div className="grid min-w-0 gap-2.5 xl:grid-cols-[.68fr_1.32fr]">
      <div className="flex gap-2 overflow-x-auto border-y border-[#aeb8c4]/10 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:block xl:overflow-visible xl:py-0" role="tablist" aria-label="Yaşanan sorunu seçin">
        {incidents.map((incident, index) => {
          const selected = activeIndex === index;
          return (
            <button
              key={incident.question}
              ref={(node) => { tabRefs.current[index] = node; }}
              type="button"
              role="tab"
              tabIndex={selected ? 0 : -1}
              aria-selected={selected}
              aria-controls="trust-incident-panel"
              id={`trust-incident-tab-${index}`}
              onClick={() => {
                setActiveIndex(index);
                const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
                tabRefs.current[index]?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`focus-ring flex min-w-[164px] items-center gap-2.5 border-b border-[#9faab7]/10 px-2.5 py-1.5 text-left transition duration-200 motion-reduce:transition-none xl:min-w-0 xl:w-full ${
                selected
                  ? 'bg-[linear-gradient(90deg,rgba(184,58,80,.09),rgba(174,184,196,.018)_68%,transparent)] text-white shadow-[inset_2px_0_0_rgba(184,58,80,.78),inset_0_1px_0_rgba(255,255,255,.018)]'
                  : 'text-slate-400 hover:bg-[linear-gradient(90deg,rgba(174,184,196,.035),transparent)] hover:text-slate-200'
              }`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center text-[11px] font-black ${selected ? 'text-[#b83a50]' : 'text-slate-600'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-black leading-5">{incident.question}</span>
            </button>
          );
        })}
      </div>

      <div
        id="trust-incident-panel"
        role="tabpanel"
        tabIndex={0}
        aria-live="polite"
        aria-labelledby={`trust-incident-tab-${activeIndex}`}
        className="focus-ring min-w-0 border-y border-[#aeb8c4]/12 bg-[linear-gradient(180deg,rgba(174,184,196,.018),rgba(9,12,16,.06))] py-2.5 sm:py-3"
      >
        <p className="text-xs font-black uppercase tracking-[.16em] text-[#b83a50]">Seçili durum</p>
        <h3 className="mt-2 text-lg font-black sm:text-xl">{active.question}</h3>

        <dl className="mt-2 divide-y divide-white/8 border-y border-[#aeb8c4]/10">
          <div className="grid gap-2 py-2 sm:grid-cols-[124px_1fr] sm:gap-4">
            <dt className="text-xs font-black uppercase tracking-wider text-[#c1c9d2]">Şimdi yap</dt>
            <dd className="min-w-0 break-words text-sm leading-7 text-slate-200">{active.now}</dd>
          </div>
          <div className="grid gap-2 py-2 sm:grid-cols-[124px_1fr] sm:gap-4">
            <dt className="text-xs font-black uppercase tracking-wider text-[#c4475d]">Kesinlikle yapma</dt>
            <dd className="min-w-0 break-words text-sm leading-7 text-slate-300">{active.avoid}</dd>
          </div>
          <div className="grid gap-2 py-2 sm:grid-cols-[124px_1fr] sm:gap-4">
            <dt className="text-xs font-black uppercase tracking-wider text-slate-300">Kayıtları sakla</dt>
            <dd className="min-w-0 break-words text-sm leading-7 text-slate-400">{active.records}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
