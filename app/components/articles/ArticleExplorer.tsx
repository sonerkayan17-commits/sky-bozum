'use client';

import Image from 'next/image';
import Link from '../DeferredLink';
import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ArticleItem } from '../../lib/site';
import ArticleCover from './ArticleCover';
import { getArticleCategories } from '../../lib/articleCategories';
import { getCategoryVisual } from '../../lib/categoryVisuals';

type SortMode = 'popular' | 'newest' | 'az';
type Topic = 'Tümü' | 'Mobil Ödeme' | 'Operatörler' | 'Dijital Kodlar' | 'Güvenlik' | 'Kart İşlemleri';

export type ArticleExplorerItem = Pick<ArticleItem,
  'slug' | 'title' | 'excerpt' | 'category' | 'readTime' | 'publishedAt' | 'updatedAt' | 'cover' | 'coverAlt' | 'keywords'
> & { searchText: string };

const topicOptions: Topic[] = ['Tümü', 'Mobil Ödeme', 'Operatörler', 'Dijital Kodlar', 'Güvenlik', 'Kart İşlemleri'];
const archivePageSize = 18;

const featuredArticleSlugs = [
  'guvenilir-mobil-bozum-sitesi-nasil-secilir',
  'mobil-odeme-bozum-nedir',
  'mobil-odeme-guvenli-mi',
  'razer-gold-nedir',
  'apple-gift-card-nedir',
] as const;
const sortOptions: { value: SortMode; label: string }[] = [
  { value: 'popular', label: 'En Çok Sorulanlar' },
  { value: 'newest', label: 'Yeni Eklenenler' },
  { value: 'az', label: 'A’dan Z’ye' },
];


const topicPresentation: Record<Topic, { label: string; strip: string; dot: string; card: string; meta: string }> = {
  'Tümü': {
    label: 'Sky Bozum',
    strip: 'bg-rose-300',
    dot: 'bg-rose-300',
    card: 'border-rose-300/15 bg-[linear-gradient(145deg,rgba(244,63,94,.105),rgba(13,18,26,.97)_58%)] hover:border-rose-300/30 hover:shadow-[0_22px_58px_-38px_rgba(244,63,94,.42)]',
    meta: 'text-rose-200/80',
  },
  'Mobil Ödeme': {
    label: 'Mobil Ödeme',
    strip: 'bg-cyan-300',
    dot: 'bg-cyan-300',
    card: 'border-cyan-300/15 bg-[linear-gradient(145deg,rgba(34,211,238,.10),rgba(13,18,26,.97)_58%)] hover:border-cyan-300/30 hover:shadow-[0_22px_58px_-38px_rgba(34,211,238,.42)]',
    meta: 'text-cyan-200/80',
  },
  Operatörler: {
    label: 'Operatörler',
    strip: 'bg-yellow-300',
    dot: 'bg-yellow-300',
    card: 'border-yellow-300/15 bg-[linear-gradient(145deg,rgba(250,204,21,.09),rgba(13,18,26,.97)_58%)] hover:border-yellow-300/30 hover:shadow-[0_22px_58px_-38px_rgba(250,204,21,.36)]',
    meta: 'text-yellow-100/80',
  },
  'Dijital Kodlar': {
    label: 'Dijital Kodlar',
    strip: 'bg-emerald-300',
    dot: 'bg-emerald-300',
    card: 'border-emerald-300/15 bg-[linear-gradient(145deg,rgba(52,211,153,.10),rgba(13,18,26,.97)_58%)] hover:border-emerald-300/30 hover:shadow-[0_22px_58px_-38px_rgba(52,211,153,.40)]',
    meta: 'text-emerald-200/80',
  },
  Güvenlik: {
    label: 'Güvenlik',
    strip: 'bg-violet-300',
    dot: 'bg-violet-300',
    card: 'border-violet-300/15 bg-[linear-gradient(145deg,rgba(167,139,250,.11),rgba(13,18,26,.97)_58%)] hover:border-violet-300/30 hover:shadow-[0_22px_58px_-38px_rgba(167,139,250,.42)]',
    meta: 'text-violet-200/80',
  },
  'Kart İşlemleri': {
    label: 'Kart İşlemleri',
    strip: 'bg-orange-300',
    dot: 'bg-orange-300',
    card: 'border-orange-300/15 bg-[linear-gradient(145deg,rgba(251,146,60,.10),rgba(13,18,26,.97)_58%)] hover:border-orange-300/30 hover:shadow-[0_22px_58px_-38px_rgba(251,146,60,.40)]',
    meta: 'text-orange-200/80',
  },
};

const topicDetails: Record<Exclude<Topic, 'Tümü'>, { icon: string; description: string }> = {
  'Mobil Ödeme': { icon: '📱', description: 'Açma, kullanma, limit ve işlem adımları' },
  Operatörler: { icon: '📶', description: 'Vodafone, Turkcell ve Türk Telekom rehberleri' },
  'Dijital Kodlar': { icon: '🎮', description: 'Razer Gold, Steam ve hediye kartları' },
  Güvenlik: { icon: '🛡️', description: 'Riskler, doğrulama ve güvenli işlem kontrolleri' },
  'Kart İşlemleri': { icon: '💳', description: 'Dijital cüzdan, limit ve kart kullanımı' },
};

function isVectorAsset(src: string) {
  return src.toLowerCase().endsWith('.svg');
}

function normalize(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}

function canonicalizeQuery(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 100);
}

function articleTopic(article: ArticleExplorerItem): Topic {
  const value = normalize(`${article.category} ${article.title} ${(article.keywords ?? []).join(' ')}`);
  if (/guven|dolandir|sahte|risk|korun|gizlilik/.test(value)) return 'Güvenlik';
  if (/kart|hepsipay|hadi|financell|kredim|moneypay|multinet|pluxee|tokenflex|ticket/.test(value)) return 'Kart İşlemleri';
  if (/razer|steam|apple|itunes|gift|dijital kod|hediye kod/.test(value)) return 'Dijital Kodlar';
  if (/vodafone|turkcell|turk telekom|paycell|pokus|operator/.test(value)) return 'Operatörler';
  return 'Mobil Ödeme';
}

function businessPriorityScore(article: ArticleExplorerItem) {
  const value = normalize(`${article.title} ${article.category} ${(article.keywords ?? []).join(' ')}`);
  let score = 0;
  if (/mobil odeme|mobil bozum|bozum|bozdur|operator bakiyesi/.test(value)) score += 180;
  if (/vodafone|turkcell|turk telekom|paycell|pokus/.test(value)) score += 140;
  if (/razer gold|steam|apple|itunes|dijital kod|hediye kod/.test(value)) score += 110;
  if (/guven|dolandir|risk|dogrulama|korun/.test(value)) score += 70;
  if (/financell|hepsipay|hadi|kredim|cihaz finansman|yemek kart|ulasim kart/.test(value)) score -= 140;
  return score;
}

function popularityScore(article: ArticleExplorerItem, originalIndex: number) {
  const value = normalize(`${article.title} ${article.category} ${(article.keywords ?? []).join(' ')}`);
  let score = Math.max(0, 120 - originalIndex) + businessPriorityScore(article);
  if (/nasil|nedir|bozum|bozdur|limit|calismiyor|kullanilir/.test(value)) score += 45;
  return score;
}

function articleBadge(article: ArticleExplorerItem) {
  const value = normalize(`${article.title} ${article.category}`);
  if (/yeni|2026|guncel/.test(value)) return { label: 'Güncel', tone: 'emerald' };
  if (/guven|dolandir|risk|korun/.test(value)) return { label: 'Güvenlik', tone: 'violet' };
  if (/limit|bakiye|kart/.test(value)) return { label: 'Limit & Kart', tone: 'cyan' };
  if (/razer|steam|apple|itunes|kod/.test(value)) return { label: 'Dijital Kod', tone: 'orange' };
  return { label: 'Rehber', tone: 'rose' };
}

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function revealAndFocus(target: () => HTMLElement | null, block: ScrollLogicalPosition) {
  window.requestAnimationFrame(() => {
    const element = target();
    if (!element) return;
    element.scrollIntoView({ behavior: preferredScrollBehavior(), block });
    element.focus({ preventScroll: true });
  });
}

export function formatDate(value?: string) {
  if (!value) return 'Düzenli güncellenir';
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return 'Düzenli güncellenir';
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function ArticleMeta({ article, editorial = false }: { article: ArticleExplorerItem; editorial?: boolean }) {
  const badge = articleBadge(article);
  const toneClasses: Record<string, string> = {
    emerald: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
    violet: 'border-violet-300/20 bg-violet-300/10 text-violet-200',
    cyan: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
    orange: 'border-orange-300/20 bg-orange-300/10 text-orange-200',
    rose: 'border-rose-300/20 bg-rose-300/10 text-rose-200',
  };
  return <div className="article-card__meta flex flex-wrap items-center gap-2">
    <span className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${toneClasses[badge.tone]}`}>{badge.label}</span>
    <span className="rounded-full border border-white/10 bg-white/[.045] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-300">{article.category}</span>
    <span className="ml-auto text-xs font-bold text-slate-500">{editorial && <span aria-hidden="true">⏱ </span>}{article.readTime}</span>
  </div>;
}

function ArticleCard({ article, featuredCompact = false, featuredDense = false, priority = false }: { article: ArticleExplorerItem; featuredCompact?: boolean; featuredDense?: boolean; priority?: boolean }) {
  const titleId = `article-card-title-${useId().replace(/:/g, '')}`;
  return <Link href={`/bilgi-merkezi/${article.slug}`} aria-labelledby={titleId} className={`focus-ring interactive-card editorial-card group flex h-full flex-col overflow-hidden border border-white/8 bg-[linear-gradient(180deg,#111620_0%,#0c1017_100%)] shadow-[0_24px_80px_-48px_rgba(0,0,0,.9)] transition duration-500 hover:-translate-y-1.5 hover:border-rose-400/35 hover:shadow-[0_32px_90px_-42px_rgba(244,63,94,.28)] ${featuredDense ? 'article-card--featured-dense rounded-[14px]' : featuredCompact ? 'rounded-[20px]' : 'rounded-[26px]'}`}><ArticleCover article={article} compact dense={featuredDense} priority={priority} /><div className={`article-card__body flex flex-1 flex-col ${featuredDense ? 'article-card__body--featured-dense min-h-0 p-2.5' : featuredCompact ? 'min-h-[170px] p-4' : 'min-h-[204px] p-5 sm:min-h-[220px] sm:p-6'}`}><ArticleMeta article={article} editorial/><h2 id={titleId} className={`article-card__title ${featuredDense ? 'mt-1.5 text-[12px] leading-[1.18]' : featuredCompact ? 'mt-3 text-[15px] leading-[1.25] sm:text-base' : 'mt-4 text-lg leading-[1.22] sm:mt-5 sm:text-xl sm:leading-[1.18]'} line-clamp-2 font-black tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-rose-100`}>{article.title}</h2><p className={`article-card__excerpt ${featuredDense ? 'mt-1 text-[10px] leading-[.9rem]' : featuredCompact ? 'mt-2 text-[12px] leading-[1.2rem]' : 'mt-3 text-sm leading-[1.55rem]'} line-clamp-2 text-slate-400`}>{article.excerpt}</p><span className={`article-card__link ${featuredDense ? 'pt-1.5 text-[10px]' : featuredCompact ? 'pt-3 text-xs' : 'pt-4 text-sm sm:pt-5'} mt-auto inline-flex items-center gap-2 font-extrabold text-rose-300 transition-colors group-hover:text-white`}>{featuredDense || featuredCompact ? 'Makaleyi incele' : 'Rehberi oku'} <span className="transition group-hover:translate-x-1" aria-hidden="true">→</span></span></div></Link>;
}


function ArchiveArticleCard({ article }: { article: ArticleExplorerItem }) {
  const titleId = `archive-article-title-${useId().replace(/:/g, '')}`;
  const topic = articleTopic(article);
  const presentation = topicPresentation[topic];
  return <Link href={`/bilgi-merkezi/${article.slug}`} className={`focus-ring article-archive-card group relative flex min-h-[164px] flex-col overflow-hidden rounded-[16px] border p-3 pl-4 shadow-[0_16px_46px_-38px_rgba(0,0,0,.9)] transition duration-300 hover:-translate-y-1 sm:min-h-[188px] sm:rounded-[20px] sm:p-5 sm:pl-6 ${presentation.card}`}>
    <span aria-hidden="true" className={`absolute bottom-5 left-0 top-5 w-[2px] rounded-full ${presentation.strip} opacity-75`} />
    <div className="flex items-start justify-between gap-3">
      <span className={`inline-flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[.1em] sm:gap-2 sm:text-[10px] sm:tracking-[.13em] ${presentation.meta}`}><span aria-hidden="true" className={`size-1.5 rounded-full ${presentation.dot}`} />{presentation.label}</span>
      <span aria-hidden="true" className="mt-0.5 text-xs text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-slate-400">→</span>
    </div>
    <div className="mt-3 flex min-w-0 flex-1 flex-col sm:mt-4">
      <h3 id={titleId} className="line-clamp-3 text-[13px] font-black leading-[1.3] tracking-[-0.018em] text-white transition group-hover:text-slate-100 sm:line-clamp-2 sm:text-[17px] sm:leading-[1.32]">{article.title}</h3>
      <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-slate-400 sm:mt-2.5 sm:text-[13px] sm:leading-[1.4rem]">{article.excerpt}</p>
      <div className="mt-auto flex items-center gap-1 pt-3 text-[8px] font-bold uppercase tracking-[.05em] text-slate-600 sm:gap-2 sm:pt-4 sm:text-[10px] sm:tracking-[.09em]"><span className="truncate">{article.category}</span><span aria-hidden="true" className="text-slate-800">•</span><span className="shrink-0 normal-case tracking-normal text-slate-500">{article.readTime}</span></div>
    </div>
  </Link>;
}

export function CompactArticleLink({ article, index }: { article: ArticleItem; index: number }) {
  const titleId = `compact-article-title-${useId().replace(/:/g, '')}`;
  return <Link href={`/bilgi-merkezi/${article.slug}`} aria-labelledby={titleId} className="focus-ring group flex min-h-[84px] items-center gap-4 rounded-2xl border border-white/8 bg-white/[.025] p-4 transition hover:border-rose-400/25 hover:bg-white/[.04]"><span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[.05] text-sm font-black text-slate-400 group-hover:text-rose-300">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0"><strong id={titleId} className="line-clamp-2 text-sm font-black leading-5 text-white">{article.title}</strong><span className="mt-1 block text-xs font-bold text-slate-500">{article.category} · {article.readTime}</span></span><span aria-hidden="true" className="ml-auto shrink-0 text-rose-400 transition group-hover:translate-x-1">→</span></Link>;
}

export default function ArticleExplorer({ articles, initialQuery = '', initialCategory = 'Tümü', initialSort = 'popular', initialTopic = 'Tümü', initialPage = 1, hideCategoryFilter = false }: { articles: ArticleExplorerItem[]; initialQuery?: string; initialCategory?: string; initialSort?: SortMode; initialTopic?: Topic; initialPage?: number; hideCategoryFilter?: boolean }) {
  const categories = useMemo(() => ['Tümü', ...new Set(articles.map((article) => article.category))], [articles]);
  const categoryHubs = useMemo(() => getArticleCategories(articles), [articles]);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : 'Tümü');
  const [sort, setSort] = useState<SortMode>(sortOptions.some((item) => item.value === initialSort) ? initialSort : 'popular');
  const [topic, setTopic] = useState<Topic>(topicOptions.includes(initialTopic) ? initialTopic : 'Tümü');
  const [hasResultInteraction, setHasResultInteraction] = useState(false);
  const [archivePage, setArchivePage] = useState(Math.max(1, Math.floor(initialPage)));
  const deferredQuery = useDeferredValue(query);
  const canonicalDeferredQuery = canonicalizeQuery(deferredQuery);
  const searchIsPending = canonicalizeQuery(query) !== canonicalDeferredQuery;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queryRef = useRef(query);
  const suppressNextUrlSyncRef = useRef(false);
  const urlSyncTimerRef = useRef<number | null>(null);
  const hasMountedUrlSyncRef = useRef(false);
  const hasMountedArchiveResetRef = useRef(false);
  const filterStateRef = useRef({ query, category, sort, topic, archivePage });
  filterStateRef.current = { query, category, sort, topic, archivePage };
  queryRef.current = query;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT' || target?.isContentEditable;
      const isPlainSearchShortcut = event.key === '/'
        && !event.defaultPrevented
        && !event.isComposing
        && !event.ctrlKey
        && !event.altKey
        && !event.metaKey
        && !event.shiftKey;
      if (isPlainSearchShortcut && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      const isSafeEscape = event.key === 'Escape'
        && !event.defaultPrevented
        && !event.isComposing
        && !event.ctrlKey
        && !event.altKey
        && !event.metaKey
        && !event.shiftKey;
      if (isSafeEscape && document.activeElement === searchInputRef.current && queryRef.current) {
        setHasResultInteraction(true);
        setQuery('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const restoreStateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const nextQuery = canonicalizeQuery(params.get('q') ?? '');
      const requestedCategory = (params.get('kategori') ?? 'Tümü').slice(0, 50);
      const requestedSort = params.get('sirala') ?? 'popular';
      const requestedTopic = params.get('konu') ?? 'Tümü';
      const requestedPage = Number.parseInt(params.get('sayfa') ?? '1', 10);

      const nextCategory = categories.includes(requestedCategory) ? requestedCategory : 'Tümü';
      const nextSort = sortOptions.some((item) => item.value === requestedSort) ? requestedSort as SortMode : 'popular';
      const nextTopic = topicOptions.includes(requestedTopic as Topic) ? requestedTopic as Topic : 'Tümü';
      const nextPage = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
      const current = filterStateRef.current;
      const stateWillChange = current.query !== nextQuery || current.category !== nextCategory || current.sort !== nextSort || current.topic !== nextTopic || current.archivePage !== nextPage;

      // Her geçmiş navigasyonu, state aynı görünse bile eski bir URL yazımını iptal etmelidir.
      if (urlSyncTimerRef.current !== null) {
        window.clearTimeout(urlSyncTimerRef.current);
        urlSyncTimerRef.current = null;
      }

      if (!stateWillChange) return;
      suppressNextUrlSyncRef.current = true;
      setHasResultInteraction(true);
      if (current.query !== nextQuery) setQuery(nextQuery);
      if (current.category !== nextCategory) setCategory(nextCategory);
      if (current.sort !== nextSort) setSort(nextSort);
      if (current.topic !== nextTopic) setTopic(nextTopic);
      if (current.archivePage !== nextPage) setArchivePage(nextPage);
    };

    window.addEventListener('popstate', restoreStateFromUrl);
    return () => window.removeEventListener('popstate', restoreStateFromUrl);
  }, [categories]);

  useEffect(() => {
    if (!hasMountedUrlSyncRef.current) {
      hasMountedUrlSyncRef.current = true;
      return;
    }

    if (suppressNextUrlSyncRef.current) {
      suppressNextUrlSyncRef.current = false;
      return;
    }

    const preflightParams = new URLSearchParams(window.location.search);
    const preflightQuery = canonicalizeQuery(query);
    if (preflightQuery) preflightParams.set('q', preflightQuery); else preflightParams.delete('q');
    if (category !== 'Tümü') preflightParams.set('kategori', category); else preflightParams.delete('kategori');
    if (sort !== 'popular') preflightParams.set('sirala', sort); else preflightParams.delete('sirala');
    if (topic !== 'Tümü') preflightParams.set('konu', topic); else preflightParams.delete('konu');
    if (archivePage > 1) preflightParams.set('sayfa', String(archivePage)); else preflightParams.delete('sayfa');
    const preflightUrl = `${window.location.pathname}${preflightParams.size ? `?${preflightParams.toString()}` : ''}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (preflightUrl === currentUrl) return;

    const timerId = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const boundedQuery = canonicalizeQuery(query);
      if (boundedQuery) params.set('q', boundedQuery); else params.delete('q');
      if (category !== 'Tümü') params.set('kategori', category); else params.delete('kategori');
      if (sort !== 'popular') params.set('sirala', sort); else params.delete('sirala');
      if (topic !== 'Tümü') params.set('konu', topic); else params.delete('konu');
      if (archivePage > 1) params.set('sayfa', String(archivePage)); else params.delete('sayfa');
      const nextUrl = `${window.location.pathname}${params.size ? `?${params.toString()}` : ''}${window.location.hash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextUrl !== currentUrl) window.history.replaceState(window.history.state, '', nextUrl);
      if (urlSyncTimerRef.current === timerId) urlSyncTimerRef.current = null;
    }, 250);
    urlSyncTimerRef.current = timerId;

    return () => {
      if (urlSyncTimerRef.current !== null) {
        window.clearTimeout(urlSyncTimerRef.current);
        urlSyncTimerRef.current = null;
      }
    };
  }, [archivePage, category, query, sort, topic]);

  const indexedArticles = useMemo(() => articles.map((article, originalIndex) => {
    return {
      article,
      originalIndex,
      popularity: popularityScore(article, originalIndex),
      topic: articleTopic(article),
      normalizedTitle: normalize(article.title),
      searchText: normalize(`${article.title} ${article.excerpt} ${article.category} ${(article.keywords ?? []).join(' ')} ${article.searchText}`),
    };
  }), [articles]);

  const topicCounts = useMemo(() => indexedArticles.reduce<Record<Exclude<Topic, 'Tümü'>, number>>((counts, item) => {
    counts[item.topic as Exclude<Topic, 'Tümü'>] += 1;
    return counts;
  }, {
    'Mobil Ödeme': 0,
    Operatörler: 0,
    'Dijital Kodlar': 0,
    Güvenlik: 0,
    'Kart İşlemleri': 0,
  }), [indexedArticles]);

  const results = useMemo(() => {
    const needle = normalize(canonicalDeferredQuery);
    const tokens = [...new Set(needle.split(/\s+/).filter(Boolean))];

    return indexedArticles.map((item) => {
      const tokenMatches = tokens.filter((token) => item.searchText.includes(token)).length;
      const searchScore = !needle ? 0 : item.normalizedTitle.startsWith(needle) ? 10 : item.normalizedTitle.includes(needle) ? 8 : item.searchText.includes(needle) ? 5 : tokenMatches === tokens.length ? 4 : tokenMatches > 0 ? 1 : 0;
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
  }, [canonicalDeferredQuery, category, indexedArticles, sort, topic]);

  const hasQuery = Boolean(query.trim());
  const hasDeferredQuery = Boolean(canonicalDeferredQuery);
  const discoveryMode = !hasDeferredQuery && category === 'Tümü' && topic === 'Tümü' && sort === 'popular' && !hideCategoryFilter;
  const featured = discoveryMode
    ? featuredArticleSlugs
        .map((slug) => results.find((article) => article.slug === slug))
        .filter((article): article is ArticleExplorerItem => Boolean(article))
    : [];
  const featuredSlugs = new Set(featured.map((article) => article.slug));
  const discoveryRemainder = discoveryMode ? results.filter((article) => !featuredSlugs.has(article.slug)) : results;
  const popular = discoveryMode ? discoveryRemainder.slice(0, 5) : [];
  const latest = useMemo(() => indexedArticles.slice().sort((a, b) => b.originalIndex - a.originalIndex).slice(0, 5).map(({ article }) => article), [indexedArticles]);
  const gridResults = discoveryMode ? discoveryRemainder.slice(6) : results;
  const archivePageCount = Math.max(1, Math.ceil(gridResults.length / archivePageSize));
  const safeArchivePage = Math.min(archivePage, archivePageCount);
  const archiveStartIndex = (safeArchivePage - 1) * archivePageSize;
  const visibleGridResults = gridResults.slice(archiveStartIndex, archiveStartIndex + archivePageSize);
  const displayedArchiveCount = visibleGridResults.length;
  const activeFilters = Boolean(hasQuery || category !== 'Tümü' || topic !== 'Tümü' || sort !== 'popular');
  const activeSortLabel = sortOptions.find((item) => item.value === sort)?.label ?? 'En Çok Sorulanlar';
  const resultStatus = !hasResultInteraction || searchIsPending
    ? ''
    : gridResults.length === 0
    ? `Seçili arama ve filtrelerle eşleşen rehber bulunamadı. Sıralama: ${activeSortLabel}.`
    : discoveryMode
      ? `${results.length} rehber keşfe hazır. Sıralama: ${activeSortLabel}.`
      : `${gridResults.length} eşleşen rehber gösteriliyor. Sıralama: ${activeSortLabel}.`;
  const archiveRef = useRef<HTMLElement>(null);

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

  function clearSearch() {
    setHasResultInteraction(true);
    setQuery('');
    window.requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }));
  }

  function clearFilters() {
    setHasResultInteraction(true);
    setQuery('');
    setCategory('Tümü');
    setTopic('Tümü');
    setSort('popular');
    revealAndFocus(() => searchInputRef.current, 'center');
  }

  function openTopic(nextTopic: Exclude<Topic, 'Tümü'>) {
    setHasResultInteraction(true);
    setQuery('');
    setCategory('Tümü');
    setSort('popular');
    setTopic(nextTopic);
    revealAndFocus(() => archiveRef.current, 'start');
  }

  function showNewestArticles() {
    setHasResultInteraction(true);
    setSort('newest');
    revealAndFocus(() => archiveRef.current, 'start');
  }

  useEffect(() => {
    if (!hasMountedArchiveResetRef.current) {
      hasMountedArchiveResetRef.current = true;
      return;
    }
    setArchivePage(1);
  }, [canonicalDeferredQuery, category, sort, topic]);

  useEffect(() => {
    if (archivePage > archivePageCount) setArchivePage(archivePageCount);
  }, [archivePage, archivePageCount]);

  function goToArchivePage(page: number) {
    setHasResultInteraction(true);
    setArchivePage(Math.max(1, Math.min(page, archivePageCount)));
    revealAndFocus(() => archiveRef.current, 'start');
  }

  return <div>
    <p id="article-result-status" className="sr-only" role="status" aria-live="polite" aria-atomic="true">{resultStatus}</p>
    <div role="search" aria-labelledby="article-filter-title" className="premium-card editorial-toolbar z-30 p-4 shadow-xl shadow-black/20 backdrop-blur-xl sm:sticky sm:top-3 sm:p-5 sm:shadow-2xl sm:shadow-black/25">
      <h2 id="article-filter-title" className="sr-only">Rehber arama ve filtreleme</h2>
      <label htmlFor="article-search" className="mb-2 block text-xs font-extrabold uppercase tracking-[.14em] text-slate-400">Merak ettiğiniz rehberi yazın</label>
      <div className="relative"><svg className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input ref={searchInputRef} id="article-search" type="search" autoComplete="off" enterKeyHint="search" value={query} maxLength={100} onChange={(event) => { setHasResultInteraction(true); setQuery(event.target.value.slice(0, 100)); }} placeholder="Örn. Vodafone, Paycell, Razer Gold veya mobil ödeme..." aria-controls="article-archive" aria-keyshortcuts="/" className="focus-ring h-14 w-full rounded-xl border border-white/10 bg-[#11151d] shadow-[inset_0_1px_rgba(255,255,255,.035)] pl-12 pr-12 text-sm font-semibold text-white placeholder:text-slate-600" />{hasQuery && <button type="button" onClick={clearSearch} aria-controls="article-archive" className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-black text-slate-500 hover:text-white" aria-label="Aramayı temizle">×</button>}</div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2">
        <div><label htmlFor="article-sort" className="block text-xs font-bold text-slate-400">Sırala</label><select id="article-sort" aria-controls="article-archive" value={sort} onChange={(event) => { setHasResultInteraction(true); setSort(event.target.value as SortMode); }} className="focus-ring mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#11151d] px-3 text-sm font-bold text-white">{sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
        {!hideCategoryFilter && <div><label htmlFor="article-category" className="block text-xs font-bold text-slate-400">Kategori</label><select id="article-category" aria-controls="article-archive" value={category} onChange={(event) => { setHasResultInteraction(true); setCategory(event.target.value); }} className="focus-ring mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#11151d] px-3 text-sm font-bold text-white">{categories.map((item) => <option key={item} value={item}>{item === 'Tümü' ? 'Tüm rehberler' : item}</option>)}</select></div>}
      </div>
      {!hideCategoryFilter && <div className="editorial-topic-scroll mt-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Konu filtreleri">{topicOptions.map((item) => <button key={item} type="button" onClick={() => { setHasResultInteraction(true); setTopic(item); }} aria-controls="article-archive" aria-pressed={topic === item} className={`focus-ring min-h-10 shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition ${topic === item ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white' : 'border border-white/10 bg-white/[0.025] text-slate-400 hover:text-white'}`}>{item}</button>)}</div>}
      {activeFilters && <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/8 pt-4"><p className="text-xs font-bold text-slate-500" aria-hidden="true">{searchIsPending ? 'Eşleşmeler güncelleniyor…' : <><strong className="text-white">{results.length}</strong> eşleşen rehber</>}</p><button type="button" onClick={clearFilters} aria-controls="article-archive" className="focus-ring rounded-lg text-xs font-extrabold text-rose-400 hover:text-rose-300">Filtreleri temizle</button></div>}
    </div>

    {discoveryMode && featured.length > 0 && <>
      <section className="mt-8 scroll-mt-28" aria-labelledby="featured-guides-title"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-rose-400">Editör seçimi</p><h2 id="featured-guides-title" className="mt-1.5 text-xl font-black sm:text-2xl">Öne çıkan rehberler</h2></div><span className="text-xs font-bold text-slate-500">5 seçili içerik</span></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{featured.slice(0, 5).map((article, index) => <ArticleCard key={article.slug} article={article} featuredCompact priority={index < 2}/>)}</div></section>
      <section className="render-later mt-12"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-orange-300">En çok sorulanlar</p><h2 className="mt-2 text-2xl font-black">Popüler rehberler</h2></div><span className="text-xs font-bold text-slate-500">5 seçili içerik</span></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{popular.map((article) => <ArticleCard key={article.slug} article={article} featuredCompact/>)}</div></section>
      <section className="render-later mt-12"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-rose-400">Konu merkezleri</p><h2 className="mt-2 text-2xl font-black">Kategoriye göre keşfedin</h2></div><span className="text-xs font-bold text-slate-500">{categoryHubs.length} kategori</span></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">{categoryHubs.slice(0, 12).map((hub) => { const visual = getCategoryVisual(hub.slug); return <Link key={hub.slug} href={`/bilgi-merkezi/kategori/${hub.slug}`} className="focus-ring group overflow-hidden rounded-2xl border border-white/8 bg-white/[.025] transition hover:-translate-y-1 hover:border-rose-400/25"><div className="category-card-visual relative aspect-[3/2] overflow-hidden bg-[#0a0e17]">{visual ? <Image src={visual.card} alt={visual.cardAlt} fill loading="lazy" sizes="(max-width: 640px) 46vw, (max-width: 1280px) 50vw, 300px" className={`${isVectorAsset(visual.card) ? 'object-contain p-3 sm:p-4' : 'object-cover'} transition duration-500 group-hover:scale-[1.03]`} /> : <div className="category-card-visual__fallback" aria-hidden="true"><span>{hub.name.slice(0, 2).toLocaleUpperCase('tr-TR')}</span><i /></div>}</div><div className="p-3 sm:p-5"><div className="flex items-center justify-between gap-2 sm:gap-3"><strong className="text-xs font-black leading-4 text-white sm:text-sm">{hub.name}</strong><span className="rounded-full bg-white/[.05] px-2 py-1 text-[9px] font-extrabold text-slate-400 sm:px-2.5 sm:text-[10px]">{hub.count}</span></div><p className="mt-2 line-clamp-2 text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">{hub.excerpt}</p><span className="mt-3 inline-flex text-[10px] font-extrabold text-rose-400 sm:mt-4 sm:text-xs">Merkezi aç <span aria-hidden="true">→</span></span></div></Link>; })}</div></section>
      <section className="render-later mt-12 rounded-3xl border border-white/8 bg-gradient-to-br from-white/[.045] to-transparent p-4 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-cyan-300">Hızlı başlangıç</p><h2 className="mt-2 text-2xl font-black">Konuya göre yolunuzu seçin</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Ne aradığınızı tam bilmiyorsanız, işleminize en yakın konudan başlayın.</p></div></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-5">{topicOptions.slice(1).map((item) => { const topicItem = item as Exclude<Topic, 'Tümü'>; const count = topicCounts[topicItem]; const detail = topicDetails[topicItem]; return <button key={topicItem} type="button" onClick={() => openTopic(topicItem)} aria-controls="article-archive" aria-pressed={false} className="focus-ring group rounded-2xl border border-white/8 bg-[#0d1118] p-3 text-left transition hover:-translate-y-1 hover:border-cyan-300/25 sm:p-5"><span className="text-xl sm:text-2xl" aria-hidden="true">{detail.icon}</span><strong className="mt-3 block text-xs font-black leading-4 text-white sm:mt-4 sm:text-sm">{topicItem}</strong><span className="mt-2 line-clamp-2 block text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">{detail.description}</span><span className="mt-3 inline-flex text-[10px] font-extrabold text-cyan-300 sm:mt-4 sm:text-[11px]">{count} rehber <span aria-hidden="true">→</span></span></button>; })}</div></section>
      <section className="render-later mt-8" aria-labelledby="latest-guides-title"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-emerald-300">Yeni içerikler</p><h2 id="latest-guides-title" className="mt-1.5 text-xl font-black sm:text-2xl">Son eklenen rehberler</h2></div><button type="button" onClick={showNewestArticles} aria-controls="article-archive" className="focus-ring rounded-lg border border-white/10 px-3 py-1.5 text-[10px] font-extrabold text-slate-300 transition hover:border-emerald-300/25 hover:text-white">Yeni içerikleri göster <span aria-hidden="true">→</span></button></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{latest.map((article) => <ArticleCard key={article.slug} article={article} featuredCompact/>)}</div></section>
    </>}

    <section ref={archiveRef} id="article-archive" tabIndex={-1} aria-labelledby="article-archive-title" aria-busy={searchIsPending} className="render-later mt-12 scroll-mt-28 rounded-2xl outline-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-slate-500">Arşiv</p><h2 id="article-archive-title" className="mt-2 text-2xl font-black">{discoveryMode ? 'Tüm rehberler' : sort === 'newest' ? 'Yeni eklenen rehberler' : sort === 'az' ? 'A’dan Z’ye rehberler' : 'Arama sonuçları'}</h2></div><p className="text-sm font-bold text-slate-400">{searchIsPending ? 'Güncelleniyor…' : <><strong className="text-white">{displayedArchiveCount}</strong> gösteriliyor <span className="text-slate-600">/</span> toplam <strong className="text-white">{gridResults.length}</strong></>}</p></div>
      {searchIsPending ? <div className="premium-card mt-5 p-10 text-center"><div className="mx-auto size-8 animate-spin rounded-full border-2 border-white/10 border-t-rose-400 motion-reduce:animate-none" aria-hidden="true"/><h2 className="mt-4 text-xl font-black">Sonuçlar güncelleniyor</h2><p className="mt-2 text-sm text-slate-400">Yeni arama sorgunuza uygun rehberler hazırlanıyor.</p></div> : gridResults.length > 0 ? <><div className="render-later mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleGridResults.map((article) => <ArchiveArticleCard key={article.slug} article={article}/>)}</div>{archivePageCount > 1 && <nav className="mt-7 flex flex-wrap items-center justify-center gap-2" aria-label="Bilgi Merkezi sayfaları"><button type="button" onClick={() => goToArchivePage(safeArchivePage - 1)} disabled={safeArchivePage === 1} className="focus-ring min-h-11 rounded-xl border border-white/10 px-4 text-xs font-extrabold text-slate-300 transition hover:border-rose-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-35">← Önceki</button>{Array.from({ length: archivePageCount }, (_, index) => index + 1).map((page) => <button key={page} type="button" onClick={() => goToArchivePage(page)} aria-current={page === safeArchivePage ? 'page' : undefined} className={`focus-ring size-11 rounded-xl border text-xs font-black transition ${page === safeArchivePage ? 'border-rose-400 bg-rose-500 text-white' : 'border-white/10 bg-white/[.025] text-slate-400 hover:border-rose-400/30 hover:text-white'}`}>{page}</button>)}<button type="button" onClick={() => goToArchivePage(safeArchivePage + 1)} disabled={safeArchivePage === archivePageCount} className="focus-ring min-h-11 rounded-xl border border-white/10 px-4 text-xs font-extrabold text-slate-300 transition hover:border-rose-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-35">Sonraki →</button></nav>}</> : <div className="premium-card mt-5 p-10 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/[.04] text-xl" aria-hidden="true">⌕</div><h2 className="mt-4 text-xl font-black">Sonuç bulunamadı</h2><p className="mt-2 text-sm text-slate-400">Farklı bir kelime deneyin veya aşağıdaki popüler konulardan birini seçin.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{(['Mobil Ödeme','Operatörler','Dijital Kodlar'] as Exclude<Topic, 'Tümü'>[]).map((item) => <button key={item} type="button" onClick={() => openTopic(item)} aria-controls="article-archive" aria-pressed={topic === item} className="focus-ring rounded-full border border-white/10 px-4 py-2 text-xs font-extrabold text-slate-300 hover:border-rose-400/30 hover:text-white">{item}</button>)}<button type="button" onClick={clearFilters} aria-controls="article-archive" className="focus-ring rounded-full border border-rose-400/25 bg-rose-400/10 px-4 py-2 text-xs font-extrabold text-rose-200 hover:bg-rose-400/15 hover:text-white">Tüm rehberleri göster</button></div></div>}
    </section>

    {!searchIsPending && recommendations.length > 0 && <section className="render-later mt-14 border-t border-white/8 pt-10"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-violet-300">Keşfetmeye devam edin</p><h2 className="mt-2 text-2xl font-black">Bunlar da ilginizi çekebilir</h2><p className="mt-2 text-sm text-slate-500">Seçtiğiniz konuya yakın, popüler rehberlerden öneriler.</p></div><div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">{recommendations.map((article) => <ArticleCard key={article.slug} article={article}/>)}</div></section>}
  </div>;
}
