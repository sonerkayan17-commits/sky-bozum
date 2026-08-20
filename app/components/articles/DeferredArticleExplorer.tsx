'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import Link from '../DeferredLink';
import type { ArticleExplorerItem } from './ArticleExplorer';

type SortMode = 'popular' | 'newest' | 'az';
type Topic = 'Tümü' | 'Mobil Ödeme' | 'Operatörler' | 'Dijital Kodlar' | 'Güvenlik' | 'Kart İşlemleri';

const ArticleExplorer = dynamic(() => import('./ArticleExplorer'), {
  ssr: false,
  loading: () => <div className="min-h-[420px] animate-pulse rounded-3xl border border-white/8 bg-white/[.02] motion-reduce:animate-none" />,
});

type Props = {
  articles: ArticleExplorerItem[];
  initialQuery?: string;
  initialCategory?: string;
  initialSort?: SortMode;
  initialTopic?: Topic;
};

export default function DeferredArticleExplorer({
  articles,
  initialQuery = '',
  initialCategory = 'Tümü',
  initialSort = 'popular',
  initialTopic = 'Tümü',
}: Props) {
  const hasInitialFilter = Boolean(initialQuery.trim()) || initialCategory !== 'Tümü' || initialSort !== 'popular' || initialTopic !== 'Tümü';
  const [ready, setReady] = useState(hasInitialFilter);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready || !rootRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: '520px 0px' });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [ready]);

  if (ready) {
    return <ArticleExplorer articles={articles} initialQuery={initialQuery} initialCategory={initialCategory} initialSort={initialSort} initialTopic={initialTopic} />;
  }

  return (
    <div ref={rootRef} className="min-h-[520px] rounded-3xl border border-white/8 bg-[linear-gradient(150deg,rgba(255,255,255,.035),rgba(8,11,16,.98))] p-5 sm:p-7" aria-label="Rehber arşivi yükleniyor">
      <div className="flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-rose-400">Rehber arşivi</p>
          <h2 className="mt-2 text-2xl font-black">En çok aranan içeriklerle başlayın.</h2>
        </div>
        <button type="button" onClick={() => setReady(true)} className="focus-ring min-h-11 rounded-xl border border-rose-300/25 bg-rose-400/[.08] px-4 text-xs font-black text-rose-200">Arama ve filtreleri aç</button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {articles.slice(0, 6).map((article, index) => (
          <Link key={article.slug} href={`/bilgi-merkezi/${article.slug}`} className="focus-ring flex min-h-20 items-center gap-4 rounded-2xl border border-white/8 bg-white/[.02] p-4 transition hover:border-rose-300/25">
            <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[.045] text-xs font-black text-rose-300">{String(index + 1).padStart(2, '0')}</span>
            <span className="min-w-0"><strong className="line-clamp-2 text-sm font-black text-white">{article.title}</strong><small className="mt-1 block text-xs text-slate-500">{article.category} · {article.readTime}</small></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
