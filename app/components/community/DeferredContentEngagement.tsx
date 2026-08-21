'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const ContentEngagement = dynamic(() => import('./ContentEngagement'), {
  ssr: false,
  loading: () => <EngagementPlaceholder loading />,
});

type Props = { targetId: string; title: string; kind?: 'article' | 'topic' };

function EngagementPlaceholder({ loading = false, onOpen }: { loading?: boolean; onOpen?: () => void }) {
  return (
    <section className="my-10 overflow-hidden rounded-2xl border border-white/10 bg-[#10131b]" aria-label="Topluluk etkileşimleri">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[.18em] text-rose-400">Topluluk</p>
          <h2 className="mt-2 text-xl font-black">Beğeni, yorum ve paylaşım</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Yorumları görüntüleyin, içeriği kaydedin veya deneyiminizi paylaşın.</p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          disabled={loading}
          className="focus-ring min-h-11 shrink-0 rounded-xl border border-rose-400/25 bg-rose-500/10 px-5 text-xs font-black text-rose-300 transition hover:bg-rose-500/15 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? 'Etkileşimler hazırlanıyor…' : 'Yorumları ve işlemleri aç'}
        </button>
      </div>
    </section>
  );
}

export default function DeferredContentEngagement(props: Props) {
  const [enabled, setEnabled] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || enabled) return;
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      setEnabled(true);
      observer.disconnect();
    }, { rootMargin: '500px 0px' });

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <div ref={anchorRef}>
      {enabled ? <ContentEngagement {...props} /> : <EngagementPlaceholder onOpen={() => setEnabled(true)} />}
    </div>
  );
}
