'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { ArticleItem } from '../../lib/site';
import ArticleCover from './ArticleCover';
import { getArticleCategories } from '../../lib/articleCategories';

type SortMode = 'popular' | 'newest' | 'az';
type Topic = 'Tümü' | 'Mobil Ödeme' | 'Operatörler' | 'Dijital Kodlar' | 'Güvenlik' | 'Kart İşlemleri';

const topicOptions: Topic[] = ['Tümü', 'Mobil Ödeme', 'Operatörler', 'Dijital Kodlar', 'Güvenlik', 'Kart İşlemleri'];
const sortOptions: { value: SortMode; label: string }[] = [
  { value: 'popular', label: 'En Çok Sorulanlar' },
  { value: 'newest', label: 'Yeni Eklenenler' },
  { value: 'az', label: 'A’dan Z’ye' },
];

const topicDetails: Record<Exclude<Topic, 'Tümü'>, { icon: string; description: string }> = {
  'Mobil Ödeme': { icon: '📱', description: 'Açma, kullanma, limit ve işlem adımları' },
  Operatörler: { icon: '📶', description: 'Vodafone, Turkcell ve Türk Telekom rehberleri' },
  'Dijital Kodlar': { icon: '🎮', description: 'Razer Gold, Steam ve hediye kartları' },
  Güvenlik: { icon: '🛡️', description: 'Riskler, doğrulama ve güvenli işlem kontrolleri' },
  'Kart İşlemleri': { icon: '💳', description: 'Dijital cüzdan, limit ve kart kullanımı' },
};

function normalize(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}

function articleTopic(article: ArticleItem): Topic {
  const value = normalize(`${article.category} ${article.title} ${(article.keywords ?? []).join(' ')}`);
  if (/guven|dolandir|sahte|risk|korun|gizlilik/.test(value)) return 'Güvenlik';
  if (/kart|hepsipay|hadi|financell|kredim|moneypay|multinet|pluxee|tokenflex|ticket/.test(value)) return 'Kart İşlemleri';
  if (/razer|steam|apple|itunes|gift|dijital kod|hediye kod/.test(value)) return 'Dijital Kodlar';
  if (/vodafone|turkcell|turk telekom|paycell|pokus|operator/.test(value)) return 'Operatörler';
  return 'Mobil Ödeme';
}

function popularityScore(article: ArticleItem, originalIndex: number) {
  const value = normalize(`${article.title} ${article.category} ${(article.keywords ?? []).join(' ')}`);
  let score = Math.max(0, 120 - originalIndex);
  if (/nasil|nedir|bozum|bozdur|limit|calismiyor|kullanilir/.test(value)) score += 45;
  if (/mobil odeme|vodafone|paycell|razer gold|steam|apple/.test(value)) score += 35;
  return score;
}

function articleBadge(article: ArticleItem) {
  const value = normalize(`${article.title} ${article.category}`);
  if (/yeni|2026|guncel/.test(value)) return { label: 'Güncel', tone: 'emerald' };
  if (/guven|dolandir|risk|korun/.test(value)) return { label: 'Güvenlik', tone: 'violet' };
  if (/limit|bakiye|kart/.test(value)) return { label: 'Limit & Kart', tone: 'cyan' };
  if (/razer|steam|apple|itunes|kod/.test(value)) return { label: 'Dijital Kod', tone: 'orange' };
  return { label: 'Rehber', tone: 'rose' };
}

function formatDate(value?: string) {
  if (!value) return 'Düzenli güncellenir';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Düzenli güncellenir';
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function ArticleMeta({ article, editorial = false }: { article: ArticleItem; editorial?: boolean }) {
  const badge = articleBadge(article);
  const toneClasses: Record<string, string> = {
    emerald: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
    violet: 'border-violet-300/20 bg-violet-300/10 text-violet-200',
    cyan: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
    orange: 'border-orange-300/20 bg-orange-300/10 text-orange-200',
    rose: 'border-rose-300/20 bg-rose-300/10 text-rose-200',
  };
  return <div className="flex flex-wrap items-center gap-2">
    <span className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${toneClasses[badge.tone]}`}>{badge.label}</span>
    <span className="rounded-full border border-white/10 bg-white/[.045] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-300">{article.category}</span>
    <span className="ml-auto text-xs font-bold text-slate-500">{editorial ? `⏱ ${article.readTime}` : article.readTime}</span>
  </div>;
}

function ArticleCard({ article, priority = false }: { article: ArticleItem; priority?: boolean }) {
  return <Link href={`/bilgi-merkezi/${article.slug}`} className="focus-ring interactive-card editorial-card group flex h-full flex-col overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,#111620_0%,#0c1017_100%)] shadow-[0_24px_80px_-48px_rgba(0,0,0,.9)] transition duration-500 hover:-translate-y-1.5 hover:border-rose-400/35 hover:shadow-[0_32px_90px_-42px_rgba(244,63,94,.28)]"><ArticleCover article={article} compact priority={priority} /><div className="flex min-h-[238px] flex-1 flex-col p-5 sm:p-6"><ArticleMeta article={article} editorial/><h2 className="mt-5 line-clamp-2 text-xl font-black leading-[1.18] tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-rose-100">{article.title}</h2><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{article.excerpt}</p><span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold text-rose-300 transition-colors group-hover:text-white">Rehberi oku <span className="transition group-hover:translate-x-1" aria-hidden="true">→</span></span></div></Link>;
}

function CompactArticleLink({ article, index }: { article: ArticleItem; index: number }) {
  return <Link href={`/bilgi-merkezi/${article.slug}`} className="focus-ring group flex min-h-[84px] items-center gap-4 rounded-2xl border border-white/8 bg-white/[.025] p-4 transition hover:border-rose-400/25 hover:bg-white/[.04]"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[.05] text-sm font-black text-slate-400 group-hover:text-rose-300">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0"><strong className="line-clamp-2 text-sm font-black leading-5 text-white">{article.title}</strong><span className="mt-1 block text-xs font-bold text-slate-500">{article.category} · {article.readTime}</span></span><span className="ml-auto shrink-0 text-rose-400 transition group-hover:translate-x-1">→</span></Link>;
}

export default function ArticleExplorer({ articles, initialQuery = '', initialCategory = 'Tümü', initialSort = 'popular', initialTopic = 'Tümü', hideCategoryFilter = false }: { articles: ArticleItem[]; initialQuery?: string; initialCategory?: string; initialSort?: SortMode; initialTopic?: Topic; hideCategoryFilter?: boolean }) {
  const categories = useMemo(() => ['Tümü', ...new Set(articles.map((article) => article.category))], [articles]);
  const categoryHubs = useMemo(() => getArticleCategories(articles), [articles]);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : 'Tümü');
  const [sort, setSort] = useState<SortMode>(sortOptions.some((item) => item.value === initialSort) ? initialSort : 'popular');
  const [topic, setTopic] = useState<Topic>(topicOptions.includes(initialTopic) ? initialTopic : 'Tümü');
  const deferredQuery = useDeferredValue(query);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT' || target?.isContentEditable;
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === 'Escape' && document.activeElement === searchInputRef.current && query) {
        setQuery('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) params.set('q', query.trim()); else params.delete('q');
    if (category !== 'Tümü') params.set('kategori', category); else params.delete('kategori');
    if (sort !== 'popular') params.set('sirala', sort); else params.delete('sirala');
    if (topic !== 'Tümü') params.set('konu', topic); else params.delete('konu');
    const nextUrl = `${window.location.pathname}${params.size ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', nextUrl);
  }, [category, query, sort, topic]);

  const indexedArticles = useMemo(() => articles.map((article, originalIndex) => ({
    article,
    originalIndex,
    popularity: popularityScore(article, originalIndex),
    topic: articleTopic(article),
  })), [articles]);

  const results = useMemo(() => {
    const needle = normalize(deferredQuery.trim());
    return indexedArticles.map((item) => {
      const { article } = item;
      const title = normalize(article.title);
      const body = article.sections.flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? []), ...(section.subsections?.flatMap((subsection) => [subsection.title, ...subsection.paragraphs]) ?? [])]).join(' ');
      const haystack = normalize(`${article.title} ${article.excerpt} ${article.category} ${(article.keywords ?? []).join(' ')} ${body}`);
      const tokens = needle.split(/\s+/).filter(Boolean);
      const tokenMatches = tokens.filter((token) => haystack.includes(token)).length;
      const searchScore = !needle ? 0 : title.startsWith(needle) ? 10 : title.includes(needle) ? 8 : haystack.includes(needle) ? 5 : tokenMatches === tokens.length ? 4 : tokenMatches > 0 ? 1 : 0;
      return { ...item, searchScore };
    }).filter(({ article, searchScore, topic: itemTopic }) =>
      (category === 'Tümü' || article.category === category) &&
      (topic === 'Tümü' || itemTopic === topic) &&
      (!needle || searchScore > 0)
    ).sort((a, b) => {
      if (needle && b.searchScore !== a.searchScore) return b.searchScore - a.searchScore;
      if (sort === 'az') return a.article.title.localeCompare(b.article.title, 'tr-TR');
      if (sort === 'newest') return b.originalIndex - a.originalIndex;
      return b.popularity - a.popularity || a.article.title.localeCompare(b.article.title, 'tr-TR');
    }).map(({ article }) => article);
  }, [category, deferredQuery, indexedArticles, sort, topic]);

  const discoveryMode = !query && category === 'Tümü' && topic === 'Tümü' && sort === 'popular' && !hideCategoryFilter;
  const featured = discoveryMode ? results.slice(0, 3) : [];
  const popular = discoveryMode ? results.slice(3, 9) : [];
  const latest = useMemo(() => indexedArticles.slice().sort((a, b) => b.originalIndex - a.originalIndex).slice(0, 6).map(({ article }) => article), [indexedArticles]);
  const gridResults = discoveryMode ? results.slice(9) : results;
  const activeFilters = Boolean(query || category !== 'Tümü' || topic !== 'Tümü' || sort !== 'popular');

  const recommendations = useMemo(() => {
    if (!activeFilters || results.length === 0) return [];
    const resultSlugs = new Set(results.map((article) => article.slug));
    const preferredTopic = topic !== 'Tümü' ? topic : articleTopic(results[0]);
    return indexedArticles
      .filter(({ article }) => !resultSlugs.has(article.slug))
      .sort((a, b) => Number(b.topic === preferredTopic) - Number(a.topic === preferredTopic) || b.popularity - a.popularity)
      .slice(0, 4)
      .map(({ article }) => article);
  }, [activeFilters, indexedArticles, results, topic]);

  function clearFilters() { setQuery(''); setCategory('Tümü'); setTopic('Tümü'); setSort('popular'); }
  function openTopic(nextTopic: Exclude<Topic, 'Tümü'>) { setQuery(''); setCategory('Tümü'); setSort('popular'); setTopic(nextTopic); }

  return <div>
    <div className="premium-card editorial-toolbar sticky top-3 z-30 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-5">
      <label htmlFor="article-search" className="mb-2 block text-xs font-extrabold uppercase tracking-[.14em] text-slate-400">Merak ettiğiniz rehberi yazın</label>
      <div className="relative"><svg className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input ref={searchInputRef} id="article-search" type="search" autoComplete="off" enterKeyHint="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Örn. Vodafone, Paycell, Razer Gold veya mobil ödeme..." className="focus-ring h-14 w-full rounded-xl border border-white/10 bg-[#11151d] shadow-[inset_0_1px_rgba(255,255,255,.035)] pl-12 pr-12 text-sm font-semibold text-white placeholder:text-slate-600" />{query && <button type="button" onClick={() => setQuery('')} className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-black text-slate-500 hover:text-white" aria-label="Aramayı temizle">×</button>}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold text-slate-400">Sırala<select aria-label="Rehber sıralaması" value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="focus-ring mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#11151d] px-3 text-sm font-bold text-white">{sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        {!hideCategoryFilter && <label className="text-xs font-bold text-slate-400">Kategori<select aria-label="Rehber kategorisi" value={category} onChange={(event) => setCategory(event.target.value)} className="focus-ring mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#11151d] px-3 text-sm font-bold text-white">{categories.map((item) => <option key={item} value={item}>{item === 'Tümü' ? 'Tüm rehberler' : item}</option>)}</select></label>}
      </div>
      {!hideCategoryFilter && <div className="editorial-topic-scroll mt-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Konu filtreleri">{topicOptions.map((item) => <button key={item} type="button" onClick={() => setTopic(item)} aria-pressed={topic === item} className={`focus-ring min-h-10 shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition ${topic === item ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white' : 'border border-white/10 bg-white/[0.025] text-slate-400 hover:text-white'}`}>{item}</button>)}</div>}
      {activeFilters && <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/8 pt-4"><p className="text-xs font-bold text-slate-500" aria-live="polite"><strong className="text-white">{results.length}</strong> eşleşen rehber</p><button type="button" onClick={clearFilters} className="focus-ring rounded-lg text-xs font-extrabold text-rose-400 hover:text-rose-300">Filtreleri temizle</button></div>}
    </div>

    {discoveryMode && featured.length > 0 && <>
      <section className="mt-10 scroll-mt-28" aria-labelledby="featured-guides-title"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-rose-400">Editör seçimi</p><h2 id="featured-guides-title" className="mt-2 text-2xl font-black sm:text-3xl">Öne çıkan rehberler</h2></div></div><div className="grid gap-4 lg:grid-cols-2"><Link href={`/bilgi-merkezi/${featured[0].slug}`} className="focus-ring interactive-card editorial-feature group relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,#121824_0%,#0a0e15_72%)] shadow-[0_40px_120px_-60px_rgba(244,63,94,.45)] transition duration-500 hover:-translate-y-1 hover:border-rose-400/40 lg:row-span-2"><ArticleCover article={featured[0]} priority/><div className="p-6 sm:p-8"><ArticleMeta article={featured[0]} editorial/><h2 className="mt-5 max-w-3xl text-2xl font-black leading-[1.12] tracking-[-0.03em] sm:text-4xl">{featured[0].title}</h2><p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">{featured[0].excerpt}</p><div className="mt-7 flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-sm font-extrabold text-rose-200 transition group-hover:bg-rose-300/15 group-hover:text-white">Rehberi incele →</span><span className="text-xs font-bold text-slate-500">Son güncelleme: {formatDate(featured[0].updatedAt ?? featured[0].publishedAt)}</span></div></div></Link><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">{featured.slice(1).map((article) => <ArticleCard key={article.slug} article={article}/>)}</div></div></section>
      <section className="render-later mt-12"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-orange-300">En çok sorulanlar</p><h2 className="mt-2 text-2xl font-black">Popüler rehberler</h2></div><span className="text-xs font-bold text-slate-500">6 seçili içerik</span></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{popular.map((article) => <ArticleCard key={article.slug} article={article}/>)}</div></section>
      <section className="render-later mt-12"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-rose-400">Konu merkezleri</p><h2 className="mt-2 text-2xl font-black">Kategoriye göre keşfedin</h2></div><span className="text-xs font-bold text-slate-500">{categoryHubs.length} kategori</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{categoryHubs.slice(0, 12).map((hub) => <Link key={hub.slug} href={`/bilgi-merkezi/kategori/${hub.slug}`} className="group rounded-2xl border border-white/8 bg-white/[.025] p-5 transition hover:-translate-y-1 hover:border-rose-400/25"><div className="flex items-center justify-between gap-3"><strong className="text-sm font-black text-white">{hub.name}</strong><span className="rounded-full bg-white/[.05] px-2.5 py-1 text-[10px] font-extrabold text-slate-400">{hub.count}</span></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{hub.excerpt}</p><span className="mt-4 inline-flex text-xs font-extrabold text-rose-400">Merkezi aç →</span></Link>)}</div></section>
      <section className="render-later mt-12 rounded-3xl border border-white/8 bg-gradient-to-br from-white/[.045] to-transparent p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-cyan-300">Hızlı başlangıç</p><h2 className="mt-2 text-2xl font-black">Konuya göre yolunuzu seçin</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Ne aradığınızı tam bilmiyorsanız, işleminize en yakın konudan başlayın.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{(topicOptions.filter((item): item is Exclude<Topic, 'Tümü'> => item !== 'Tümü')).map((item) => { const count = indexedArticles.filter((entry) => entry.topic === item).length; const detail = topicDetails[item]; return <button key={item} type="button" onClick={() => openTopic(item)} className="focus-ring group rounded-2xl border border-white/8 bg-[#0d1118] p-5 text-left transition hover:-translate-y-1 hover:border-cyan-300/25"><span className="text-2xl" aria-hidden="true">{detail.icon}</span><strong className="mt-4 block text-sm font-black text-white">{item}</strong><span className="mt-2 block text-xs leading-5 text-slate-500">{detail.description}</span><span className="mt-4 inline-flex text-[11px] font-extrabold text-cyan-300">{count} rehber →</span></button>; })}</div></section>
      <section className="render-later mt-12"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-300">Yeni içerikler</p><h2 className="mt-2 text-2xl font-black">Son eklenen rehberler</h2></div><button type="button" onClick={() => setSort('newest')} className="focus-ring rounded-xl border border-white/10 px-4 py-2 text-xs font-extrabold text-slate-300 transition hover:border-emerald-300/25 hover:text-white">Tümünü göster →</button></div><div className="mt-5 grid gap-3 lg:grid-cols-2">{latest.map((article, index) => <CompactArticleLink key={article.slug} article={article} index={index}/>)}</div></section>
    </>}

    <div className="render-later mt-12 flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-slate-500">Arşiv</p><h2 className="mt-2 text-2xl font-black">{discoveryMode ? 'Tüm rehberler' : sort === 'newest' ? 'Yeni eklenen rehberler' : sort === 'az' ? 'A’dan Z’ye rehberler' : 'Arama sonuçları'}</h2></div><p className="text-sm font-bold text-slate-400"><strong className="text-white">{gridResults.length}</strong> içerik</p></div>
    {gridResults.length > 0 ? <div className="render-later mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{gridResults.map((article) => <ArticleCard key={article.slug} article={article}/>)}</div> : <div className="premium-card mt-5 p-10 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/[.04] text-xl">⌕</div><h2 className="mt-4 text-xl font-black">Sonuç bulunamadı</h2><p className="mt-2 text-sm text-slate-400">Farklı bir kelime deneyin veya aşağıdaki popüler konulardan birini seçin.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{(['Mobil Ödeme','Operatörler','Dijital Kodlar'] as Topic[]).map((item) => <button key={item} onClick={() => { setQuery(''); setTopic(item); }} className="focus-ring rounded-full border border-white/10 px-4 py-2 text-xs font-extrabold text-slate-300 hover:border-rose-400/30 hover:text-white">{item}</button>)}</div></div>}

    {recommendations.length > 0 && <section className="render-later mt-14 border-t border-white/8 pt-10"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-violet-300">Keşfetmeye devam edin</p><h2 className="mt-2 text-2xl font-black">Bunlar da ilginizi çekebilir</h2><p className="mt-2 text-sm text-slate-500">Seçtiğiniz konuya yakın, popüler rehberlerden öneriler.</p></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{recommendations.map((article) => <ArticleCard key={article.slug} article={article}/>)}</div></section>}
  </div>;
}
