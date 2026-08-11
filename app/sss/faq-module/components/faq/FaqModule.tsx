"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { skyFaqItems } from "../../data/faqs";
import { createFaqPageSchema, serializeJsonLd } from "../../lib/schema";
import { createFaqSearchIndex, rankFaqsWithIndex } from "../../lib/search";
import { prepareFaqItems } from "../../lib/faq-data";
import { MAX_FAQ_SEARCH_QUERY_LENGTH, normalizeFaqSearchQuery, sanitizeFaqSearchQuery } from "../../lib/search-query";
import { createFrameLifecycle, type FrameLifecycle } from "../../lib/frame-lifecycle";
import { scrollIntoViewAccessible } from "../../lib/motion";
import type { FaqCategory, FaqItem, SkyFaqModuleProps } from "../../types/faq";
import { FaqAccordion, FaqCategoryDrawer, FaqCategoryRail, FaqEmptyState, FaqHeader, FaqTrustStrip, SearchResults } from "./faq-ui";

const CATEGORY_DESCRIPTIONS: Record<FaqCategory, string> = {
  "En Çok Sorulanlar": "İşleme başlamadan önce müşterilerimizin en çok merak ettiği temel konular.",
  "İşleme Başlamadan Önce": "Kod veya bakiye paylaşmadan önce hazırlamanız ve doğrulamanız gereken bilgiler.",
  "Mobil Ödeme Bozum": "Mobil ödeme bakiyesinin değerlendirilmesi, onay ve ödeme adımları.",
  "Bozum Oranları": "Güncel oranların nasıl belirlendiği ve işlem öncesi net tutar teyidi.",
  "Komisyon ve Net Ödeme": "Kesintiler, oran hesabı ve hesabınıza geçecek net tutar hakkında bilgiler.",
  "Ödeme Süreleri": "Kontrol tamamlandıktan sonra ödeme süresini etkileyen durumlar.",
  "Güvenlik": "Kod, hesap ve kişisel bilgilerinizi korumak için dikkat etmeniz gerekenler.",
  "Dolandırıcılıktan Korunma": "Sahte hesapları, yanıltıcı oranları ve şüpheli talepleri fark etme yolları.",
  "Resmî İletişim Kanalları": "İşlem öncesi doğru hesapla görüştüğünüzü doğrulamanın güvenli yolları.",
  "İşlem İptali": "Onay öncesi ve sonrası iptal taleplerinde izlenen işlem akışı.",
  "Vodafone Mobil Ödeme": "Vodafone hattındaki mobil ödeme bakiyesi ve işlem uygunluğu hakkında bilgiler.",
  "Vodafone Pay": "Vodafone Pay bakiyesi ve kart işlemlerinde uygunluk ve ödeme süreci.",
  "Turkcell Mobil Ödeme": "Turkcell hattındaki mobil ödeme bakiyesinin değerlendirme adımları.",
  "Paycell": "Paycell bakiyesi, kart kullanımı ve işlem öncesi kontrol koşulları.",
  "Türk Telekom Mobil Ödeme": "Türk Telekom hattındaki mobil ödeme bakiyesi ve işlem koşulları.",
  "Pokus": "Pokus bakiyesi ve kart işlemlerinin değerlendirilme süreci.",
  "Razer Gold TL": "TL bazlı Razer Gold kodlarının bölge, tutar ve kullanım durumu kontrolleri.",
  "Razer Gold USD": "USD bazlı Razer Gold kodlarında bölge ve para birimi doğrulaması.",
  "Apple Gift Card": "Apple Gift Card kodlarının ülke, bakiye ve kullanılabilirlik kontrolleri.",
  "Steam": "Steam Wallet kodlarının bölge, para birimi ve kullanım durumu hakkında bilgiler.",
  "SMS Bozum": "SMS ile yapılan mobil ödeme işlemlerinde onay, limit ve güvenlik adımları.",
  "Hat ve Fatura Limitleri": "Operatör limitleri, fatura durumu ve işlem uygunluğunu etkileyen koşullar.",
  "Kod Kontrolü": "Kodun bölgesi, bakiyesi ve kullanım durumunun nasıl doğrulandığı.",
  "IBAN ve Hesap Sahibi": "Ödeme bilgilerinin doğrulanması ve farklı kişiye ait hesap kullanım koşulları.",
  "Gece ve Hafta Sonu İşlemleri": "Mesai dışı saatlerde işlem yoğunluğu ve banka kaynaklı gecikmeler.",
};

const SEARCH_RESULT_RENDER_LIMIT = 30;

export function FaqModule({
  items = skyFaqItems,
  title = "Sıkça Sorulan Sorular",
  description = "Sky Bozum hizmetleri, işlem süreci, ödeme ve güvenlik hakkında merak ettiğiniz soruların net cevaplarını bulun.",
  searchPlaceholder = "Sorunuzu veya işlem türünü yazın…",
  emptyMessage = "Henüz yayımlanmış bir soru bulunmuyor.",
  initialCategory = "En Çok Sorulanlar",
  className = "",
  stickyOffset = 96,
  enableStructuredData = true,
  structuredDataMaxItems = 100,
  supportLinks,
  trustItems,
  onQuestionOpen,
  onSearch,
}: SkyFaqModuleProps) {
  const instanceId = useId().replace(/:/g, "");
  const contentHeadingId = `${instanceId}-faq-content-heading`;
  const frameLifecycleRef = useRef<FrameLifecycle | undefined>(undefined);
  if (!frameLifecycleRef.current) frameLifecycleRef.current = createFrameLifecycle();
  useEffect(() => () => frameLifecycleRef.current?.dispose(), []);

  const prepared = useMemo(() => prepareFaqItems(items).items, [items]);
  const itemsByCategory = useMemo(() => {
    const index = new Map<FaqCategory, FaqItem[]>();
    for (const item of prepared) {
      const group = index.get(item.category);
      if (group) group.push(item);
      else index.set(item.category, [item]);
    }
    return index;
  }, [prepared]);
  const itemById = useMemo(() => new Map(prepared.map((item) => [item.id, item] as const)), [prepared]);
  const categories = useMemo(() => Array.from(itemsByCategory.keys()), [itemsByCategory]);
  const firstCategory = categories[0] ?? "En Çok Sorulanlar";
  const requestedInitial = initialCategory === "Tümü" ? firstCategory : initialCategory;
  const initial = categories.includes(requestedInitial) ? requestedInitial : firstCategory;
  const [activeCategory, setActiveCategory] = useState<FaqCategory>(initial);
  const [openId, setOpenId] = useState<string | undefined>(() => itemsByCategory.get(initial)?.[0]?.id);
  const openIdRef = useRef<string | undefined>(openId);
  const [query, setQuery] = useState("");
  const effectiveQuery = useMemo(() => normalizeFaqSearchQuery(query), [query]);
  const isSearching = effectiveQuery.length > 0;
  const categoryItems = useMemo(() => itemsByCategory.get(activeCategory) ?? [], [activeCategory, itemsByCategory]);
  const searchIndex = useMemo(() => createFaqSearchIndex(prepared), [prepared]);
  const matchingItems = useMemo(() => isSearching ? rankFaqsWithIndex(searchIndex, effectiveQuery) : [], [effectiveQuery, isSearching, searchIndex]);
  const results = useMemo(() => matchingItems.slice(0, SEARCH_RESULT_RENDER_LIMIT), [matchingItems]);
  const totalResultCount = matchingItems.length;
  const schema = useMemo(() => enableStructuredData ? createFaqPageSchema(prepared, { maxItems: structuredDataMaxItems }) : undefined, [enableStructuredData, prepared, structuredDataMaxItems]);
  const hasItems = prepared.length > 0;

  useEffect(() => {
    if (categories.includes(activeCategory)) return;
    const fallback = categories[0];
    if (!fallback) return;
    setActiveCategory(fallback);
    setOpenId(itemsByCategory.get(fallback)?.[0]?.id);
  }, [activeCategory, categories, itemsByCategory]);

  useEffect(() => {
    if (!hasItems || !categories.includes(activeCategory)) return;
    const activeItems = itemsByCategory.get(activeCategory) ?? [];
    if (!activeItems.length) return;
    const openItemStillExists = openId ? activeItems.some((item) => item.id === openId) : false;
    if (!openItemStillExists) setOpenId(activeItems[0]?.id);
  }, [activeCategory, categories, hasItems, itemsByCategory, openId]);

  useEffect(() => {
    openIdRef.current = openId;
  }, [openId]);

  useEffect(() => {
    onSearch?.(effectiveQuery, isSearching ? totalResultCount : 0);
  }, [effectiveQuery, isSearching, onSearch, totalResultCount]);

  const selectCategory = useCallback((category: FaqCategory) => {
    setActiveCategory(category);
    setOpenId(itemsByCategory.get(category)?.[0]?.id);
    setQuery("");
    frameLifecycleRef.current?.cancelAll();
    frameLifecycleRef.current?.schedule(() => document.getElementById(contentHeadingId)?.focus({ preventScroll: true }));
  }, [contentHeadingId, itemsByCategory]);
  const selectSearchResult = useCallback((item: FaqItem) => {
    setActiveCategory(item.category);
    setOpenId(item.id);
    setQuery("");
    frameLifecycleRef.current?.cancelAll();
    frameLifecycleRef.current?.schedule(() => {
      const target = document.getElementById(`${instanceId}-faq-${item.id}`);
      if (target) scrollIntoViewAccessible(target, { block: "center" });
    }, 2);
  }, [instanceId]);
  const toggle = useCallback((id: string) => {
    const willOpen = openIdRef.current !== id;
    const nextOpenId = willOpen ? id : undefined;
    openIdRef.current = nextOpenId;
    setOpenId(nextOpenId);
    const item = itemById.get(id);
    if (item && willOpen) onQuestionOpen?.(item);
  }, [itemById, onQuestionOpen]);
  const updateQuery = useCallback((value: string) => setQuery(sanitizeFaqSearchQuery(value).slice(0, MAX_FAQ_SEARCH_QUERY_LENGTH)), []);
  const stickyTop = typeof stickyOffset === "number" ? `${stickyOffset}px` : stickyOffset;
  const categoryDescription = CATEGORY_DESCRIPTIONS[activeCategory];

  return <section className={`relative overflow-x-clip bg-white text-slate-950 dark:bg-slate-950 dark:text-white ${className}`}>
    {schema && hasItems && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}/>} 
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.07),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.08),transparent_62%)]"/>
    <div className="relative mx-auto w-full max-w-[1320px] px-4 pb-14 pt-9 sm:px-6 sm:pb-18 sm:pt-14 lg:px-8 lg:pb-22 lg:pt-[68px] xl:px-10">
      <FaqHeader title={title} description={description} query={query} onQueryChange={updateQuery} resultCount={totalResultCount} isSearching={isSearching} searchPlaceholder={searchPlaceholder}/>
      <div className="mt-9 lg:mt-[52px]">
        {!hasItems ? <><FaqEmptyState message={emptyMessage} supportLinks={supportLinks}/><div className="mx-auto max-w-[760px]"><FaqTrustStrip items={trustItems}/></div></> : <>
        {!isSearching && <div className="mb-5 lg:hidden"><FaqCategoryDrawer active={activeCategory} categories={categories} onSelect={selectCategory}/></div>}
        {isSearching ? <div className="mx-auto max-w-[900px]"><div className="mb-6 flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-white/10"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Arama sonuçları</p><h2 className="mt-2 text-[24px] font-bold tracking-[-0.035em] text-slate-950 sm:text-[28px] dark:text-white">“{effectiveQuery}” için {totalResultCount} sonuç</h2>{totalResultCount > SEARCH_RESULT_RENDER_LIMIT && <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">En alakalı ilk {SEARCH_RESULT_RENDER_LIMIT} sonuç gösteriliyor. Aramanızı daraltarak daha kesin sonuçlara ulaşabilirsiniz.</p>}</div><button type="button" onClick={() => setQuery("")} className="self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:self-auto dark:border-white/10 dark:bg-white/[.03] dark:text-slate-200">Aramayı temizle</button></div><SearchResults items={results} onSelect={selectSearchResult} supportLinks={supportLinks}/></div> : <div className="grid items-start gap-6 lg:grid-cols-[248px_minmax(0,1fr)] xl:gap-9 2xl:grid-cols-[252px_minmax(0,1fr)]">
          <FaqCategoryRail active={activeCategory} categories={categories} onSelect={selectCategory} stickyTop={stickyTop}/>
          <section aria-labelledby={contentHeadingId} className="min-w-0"><div className="mb-6 flex flex-col gap-3 border-b border-slate-200/75 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-white/10"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Seçili kategori</p><h2 id={contentHeadingId} tabIndex={-1} className="mt-2 text-[23px] font-bold leading-[1.15] tracking-[-0.035em] text-slate-950 outline-none sm:text-[27px] dark:text-white">{activeCategory}</h2><p className="mt-2 max-w-2xl text-[14px] leading-[1.65] text-slate-500 dark:text-slate-400">{categoryDescription}</p></div><span className="hidden shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 sm:inline-flex dark:border-white/10 dark:bg-white/[.03] dark:text-slate-400">{categoryItems.length} soru</span></div><FaqAccordion items={categoryItems} openId={openId} onToggle={toggle} instanceId={instanceId}/><FaqTrustStrip items={trustItems}/></section>
        </div>}
        </>}
      </div>
    </div>
  </section>;
}
