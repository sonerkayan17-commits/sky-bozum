"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FaqCategory, FaqItem } from "../../types/faq";
import { normalizeText } from "../../lib/search";
import { acquireBodyScrollLock } from "../../lib/body-scroll-lock";
import { createFrameLifecycle, type FrameLifecycle } from "../../lib/frame-lifecycle";
import { createSupersedingTaskController, type SupersedingTaskController } from "../../lib/superseding-task";
import { trapDialogTab } from "../../lib/dialog-focus";

export type FaqCategoryGroup = { label: string; categories: readonly FaqCategory[] };

export const CATEGORY_GROUPS: FaqCategoryGroup[] = [
  { label: "Başlangıç", categories: ["En Çok Sorulanlar", "İşleme Başlamadan Önce"] },
  { label: "İşlem ve Ödeme", categories: ["Mobil Ödeme Bozum", "Bozum Oranları", "Komisyon ve Net Ödeme", "Ödeme Süreleri", "İşlem İptali", "IBAN ve Hesap Sahibi", "Gece ve Hafta Sonu İşlemleri"] },
  { label: "Operatörler", categories: ["Vodafone Mobil Ödeme", "Vodafone Pay", "Turkcell Mobil Ödeme", "Paycell", "Türk Telekom Mobil Ödeme", "Pokus", "Hat ve Fatura Limitleri"] },
  { label: "Kod ve Kartlar", categories: ["Razer Gold TL", "Razer Gold USD", "Apple Gift Card", "Steam", "SMS Bozum", "Kod Kontrolü"] },
  { label: "Güvenlik ve Destek", categories: ["Güvenlik", "Dolandırıcılıktan Korunma", "Resmî İletişim Kanalları"] },
];
export function getAvailableCategoryGroups(categories: readonly FaqCategory[]): FaqCategoryGroup[] {
  const available = new Set(categories);
  return CATEGORY_GROUPS
    .map((group) => ({ ...group, categories: group.categories.filter((category) => available.has(category)) }))
    .filter((group) => group.categories.length > 0);
}

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current`} strokeWidth="1.8"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>;
}
function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg>;
}
function MenuIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><path d="M5 7h14M5 12h14M5 17h14"/></svg>;
}
function Chevron({ open }: { open: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-[18px] w-[18px] shrink-0 fill-none stroke-current transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "rotate-180" : ""}`} strokeWidth="1.9"><path d="m7 10 5 5 5-5"/></svg>;
}
function CategoryGlyph({ active }: { active: boolean }) {
  return <span aria-hidden="true" className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] border transition ${active ? "border-sky-200 bg-white text-sky-700 shadow-[0_2px_8px_rgba(14,165,233,.12)] dark:border-sky-400/20 dark:bg-slate-900 dark:text-sky-300" : "border-slate-200/90 bg-white text-slate-400 dark:border-white/10 dark:bg-white/[.025] dark:text-slate-500"}`}>
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.7"><path d="M5.5 6.5h9M5.5 10h6.5M5.5 13.5h8"/></svg>
  </span>;
}
function TrustIcon({ index }: { index: number }) {
  const paths = [
    <><path d="M12 3.5 18 6v5c0 4-2.4 7-6 9-3.6-2-6-5-6-9V6l6-2.5Z"/><path d="m9.2 11.8 1.8 1.8 3.8-4"/></>,
    <><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3.2 2"/></>,
    <><path d="M4 12h12"/><path d="m12 7 5 5-5 5"/><path d="M5 7.5v9"/></>,
    <><path d="M7 17.5H5.5A2.5 2.5 0 0 1 3 15V9a2.5 2.5 0 0 1 2.5-2.5H7"/><path d="M17 17.5h1.5A2.5 2.5 0 0 0 21 15V9a2.5 2.5 0 0 0-2.5-2.5H17"/><path d="M7 6.5a5 5 0 0 1 10 0V17a2 2 0 0 1-2 2h-2"/></>,
  ];
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="1.7">{paths[index]}</svg>;
}

export function FaqHeader({ title, description, query, onQueryChange, resultCount, isSearching, searchPlaceholder }: { title: string; description: string; query: string; onQueryChange: (value: string) => void; resultCount: number; isSearching: boolean; searchPlaceholder: string }) {
  const searchId = useId();
  return <header className="mx-auto max-w-[860px] text-center">
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-700 sm:text-[10.5px] dark:text-sky-300">Sky Bozum Destek Merkezi</p>
    <h1 className="text-[32px] font-bold leading-[1.08] tracking-[-0.044em] text-slate-950 sm:text-[40px] sm:leading-[1.06] lg:text-[46px] xl:text-[48px] dark:text-white">{title}</h1>
    <p className="mx-auto mt-3.5 max-w-[680px] text-[15px] leading-[1.7] text-slate-600 sm:text-[16px] sm:leading-[1.72] dark:text-slate-300">{description}</p>
    <div className="relative mx-auto mt-6 max-w-[720px] text-left sm:mt-7">
      <label htmlFor={searchId} className="sr-only">SSS içinde ara</label>
      <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon className="h-[21px] w-[21px]"/></span>
      <input id={searchId} type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={searchPlaceholder} className="h-[60px] w-full rounded-[18px] border border-slate-200/90 bg-white pl-14 pr-14 text-[15px] leading-none text-slate-950 shadow-[0_14px_36px_rgba(15,23,42,0.065)] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100/75 dark:border-white/10 dark:bg-white/[.045] dark:text-white dark:hover:border-white/15 dark:focus:ring-sky-500/10"/>
      {query && <button type="button" aria-label="Aramayı temizle" onClick={() => onQueryChange("")} className="absolute right-3.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/[.06] dark:hover:text-white"><CloseIcon/></button>}
    </div>
    <p aria-live="polite" className="sr-only">{isSearching ? `${resultCount} arama sonucu bulundu.` : "Kategori görünümü aktif."}</p>
  </header>;
}

function CategoryList({ active, categories, onSelect, query = "", onQueryChange }: { active: FaqCategory; categories: readonly FaqCategory[]; onSelect: (category: FaqCategory) => void; query?: string; onQueryChange?: (value: string) => void }) {
  const normalized = normalizeText(query);
  const groups = getAvailableCategoryGroups(categories);
  const visibleGroupCount = groups.filter((group) => group.categories.some((category) => !normalized || normalizeText(category).includes(normalized))).length;
  return <div>
    {onQueryChange && <div className="relative mb-5"><span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon className="h-[17px] w-[17px]"/></span><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Kategori ara…" className="h-11 w-full rounded-xl border border-slate-200/90 bg-slate-50/80 pl-10 pr-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/[.04] dark:text-white dark:focus:ring-sky-500/10"/></div>}
    {!visibleGroupCount && <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs leading-5 text-slate-500 dark:border-white/10 dark:bg-white/[.025] dark:text-slate-400">Bu adla eşleşen kategori bulunamadı.</div>}
    <nav aria-label="SSS kategorileri" className="space-y-6">
      {groups.map((group) => {
        const visible = group.categories.filter((category) => !normalized || normalizeText(category).includes(normalized));
        if (!visible.length) return null;
        return <section key={group.label}><p className="mb-2.5 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{group.label}</p><div className="space-y-1">{visible.map((category) => {
          const isActive = active === category;
          return <button key={category} type="button" onClick={() => onSelect(category)} aria-current={isActive ? "true" : undefined} className={`group relative flex min-h-[46px] w-full items-center gap-3 rounded-xl px-2.5 py-1.5 text-left text-[13.5px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${isActive ? "bg-sky-50/75 text-sky-800 dark:bg-sky-400/[.09] dark:text-sky-200" : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/[.035] dark:hover:text-white"}`}><span aria-hidden="true" className={`absolute inset-y-2.5 left-0 w-[2px] rounded-full transition ${isActive ? "bg-sky-600" : "bg-transparent"}`}/><CategoryGlyph active={isActive}/><span className="min-w-0 leading-[1.35]">{category}</span></button>;
        })}</div></section>;
      })}
    </nav>
  </div>;
}

export function FaqCategoryRail({ active, categories, onSelect, stickyTop }: { active: FaqCategory; categories: readonly FaqCategory[]; onSelect: (category: FaqCategory) => void; stickyTop: string | number }) {
  const [query, setQuery] = useState("");
  return <aside className="hidden lg:block"><div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[18px] border border-slate-200/80 bg-white/95 p-3 shadow-[0_12px_34px_rgba(15,23,42,0.05)] backdrop-blur dark:border-white/10 dark:bg-white/[.025]" style={{ position: "sticky", top: stickyTop }}><div className="px-2 pb-3 pt-1"><p className="text-[15px] font-bold tracking-[-0.01em] text-slate-950 dark:text-white">Kategoriler</p><p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">İhtiyacınız olan başlığı seçin.</p></div><CategoryList active={active} categories={categories} onSelect={onSelect} query={query} onQueryChange={setQuery}/></div></aside>;
}

export function FaqCategoryDrawer({ active, categories, onSelect }: { active: FaqCategory; categories: readonly FaqCategory[]; onSelect: (category: FaqCategory) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeReasonRef = useRef<"dismiss" | "selection">("dismiss");
  const frameLifecycleRef = useRef<FrameLifecycle | undefined>(undefined);
  const focusTaskRef = useRef<SupersedingTaskController | undefined>(undefined);
  if (!frameLifecycleRef.current) frameLifecycleRef.current = createFrameLifecycle();
  if (!focusTaskRef.current) focusTaskRef.current = createSupersedingTaskController((callback) => frameLifecycleRef.current?.schedule(callback) ?? (() => undefined));
  useEffect(() => () => { focusTaskRef.current?.dispose(); frameLifecycleRef.current?.dispose(); }, []);
  useEffect(() => {
    if (!open) return;
    closeReasonRef.current = "dismiss";
    const lock = acquireBodyScrollLock(document);
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeReasonRef.current = "dismiss";
        setOpen(false);
        return;
      }
      if (panelRef.current) trapDialogTab(event, panelRef.current);
    };
    document.addEventListener("keydown", onKey);
    focusTaskRef.current?.schedule(() => panelRef.current?.querySelector<HTMLInputElement>("input")?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      lock.release();
      if (closeReasonRef.current === "dismiss") {
        focusTaskRef.current?.schedule(() => (triggerRef.current ?? previous)?.focus());
      }
    };
  }, [open]);
  const dismiss = () => {
    closeReasonRef.current = "dismiss";
    setOpen(false);
  };
  const select = (category: FaqCategory) => {
    closeReasonRef.current = "selection";
    onSelect(category);
    setOpen(false);
    setQuery("");
  };
  return <div className="lg:hidden">
    <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => { focusTaskRef.current?.cancel(); closeReasonRef.current = "dismiss"; setOpen(true); }} className="flex min-h-[54px] w-full items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white px-4 text-left shadow-[0_8px_24px_rgba(15,23,42,.05)] transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/10 dark:bg-white/[.03]"><span className="flex min-w-0 items-center gap-3 text-sm font-semibold text-slate-950 dark:text-white"><span className="text-sky-700 dark:text-sky-300"><MenuIcon/></span><span className="truncate">{active}</span></span><span className="text-xs font-semibold text-sky-700 dark:text-sky-300">Değiştir</span></button>
    {open && <div className="fixed inset-0 z-50"><button type="button" aria-label="Kategori panelini kapat" onClick={dismiss} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"/><div ref={panelRef} role="dialog" aria-modal="true" aria-label="Kategori seçici" tabIndex={-1} className="absolute inset-y-0 right-0 flex w-[min(88vw,360px)] flex-col border-l border-slate-200 bg-white shadow-[-24px_0_70px_rgba(15,23,42,0.2)] outline-none dark:border-white/10 dark:bg-slate-950"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 dark:border-white/10"><div><h2 className="text-lg font-bold tracking-[-0.02em] text-slate-950 dark:text-white">Kategoriler</h2><p className="mt-1 text-xs text-slate-500">Başlıklar arasında hızlı geçiş yapın.</p></div><button type="button" onClick={dismiss} aria-label="Kapat" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/10 dark:hover:bg-white/[.05]"><CloseIcon/></button></div><div className="flex-1 overflow-y-auto p-4"><CategoryList active={active} categories={categories} onSelect={select} query={query} onQueryChange={setQuery}/></div></div></div>}
  </div>;
}


function relatedArticleHref(category: string) {
  const links: Record<string, string> = {
    "Mobil Ödeme Bozum": "/bilgi-merkezi/mobil-odeme-nasil-acilir",
    "Vodafone Mobil Ödeme": "/bilgi-merkezi/vodafone-mobil-odeme-nedir",
    "Turkcell Mobil Ödeme": "/bilgi-merkezi/turkcell-mobil-odeme-nasil-kullanilir",
    "Türk Telekom Mobil Ödeme": "/bilgi-merkezi/turk-telekom-mobil-odeme-rehberi",
    "Paycell": "/bilgi-merkezi/paycell-nedir-nasil-kullanilir",
    "Pokus": "/bilgi-merkezi/pokus-nedir-razer-gold-nasil-alinir",
    "Razer Gold TL": "/bilgi-merkezi/razer-gold-nedir",
    "Razer Gold USD": "/bilgi-merkezi/razer-gold-tl-ve-usd-farki",
    "Kod Kontrolü": "/bilgi-merkezi/dijital-kod-guvenligi",
    "Güvenlik": "/bilgi-merkezi/mobil-odeme-guvenli-mi",
    "Dolandırıcılıktan Korunma": "/bilgi-merkezi/mobil-bozum-yaparken-dolandirilabilir-miyim",
    "Hat ve Fatura Limitleri": "/bilgi-merkezi/mobil-odeme-limiti-nasil-ogrenilir",
    "Bozum Oranları": "/bilgi-merkezi/guncel-bozum-orani-nasil-ogrenilir",
    "Komisyon ve Net Ödeme": "/bilgi-merkezi/guncel-bozum-orani-nasil-ogrenilir",
  };
  return links[category];
}

function SupportActions({ links }: { links?: { whatsapp?: string; liveSupport?: string; contact?: string } }) {
  if (!links || !Object.values(links).some(Boolean)) return null;
  const actions = [
    links.whatsapp ? { label: "WhatsApp’tan Sor", href: links.whatsapp } : undefined,
    links.liveSupport ? { label: "Canlı Desteği Aç", href: links.liveSupport } : undefined,
    links.contact ? { label: "İletişim Sayfası", href: links.contact } : undefined,
  ].filter(Boolean) as { label: string; href: string }[];
  return <div className="mt-6 flex flex-wrap justify-center gap-3">{actions.map((action, index) => <a key={action.label} href={action.href} className={`${index === 0 ? "border-sky-600 bg-sky-600 text-white hover:bg-sky-700" : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:bg-white/[.03] dark:text-slate-200"} inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500`}>{action.label}</a>)}</div>;
}

export function FaqEmptyState({ message, supportLinks }: { message: string; supportLinks?: { whatsapp?: string; liveSupport?: string; contact?: string } }) {
  return <div role="status" aria-live="polite" className="mx-auto max-w-[760px] rounded-[20px] border border-dashed border-slate-300 bg-slate-50/75 px-6 py-14 text-center sm:px-10 sm:py-16 dark:border-white/15 dark:bg-white/[.025]">
    <span aria-hidden="true" className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-700 ring-1 ring-inset ring-slate-200 shadow-[0_8px_24px_rgba(15,23,42,.06)] dark:bg-white/[.04] dark:text-sky-300 dark:ring-white/10"><svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.7"><path d="M5.5 6.5h13v11h-13z"/><path d="M8.5 10h7M8.5 13.5h4.5"/></svg></span>
    <h2 className="mt-5 text-[22px] font-bold tracking-[-0.03em] text-slate-950 sm:text-[24px] dark:text-white">{message}</h2>
    <p className="mx-auto mt-3 max-w-xl text-[14px] leading-6 text-slate-500 sm:text-[15px] dark:text-slate-400">Aradığınız konu şu anda bu bölümde bulunmuyor. Güncel bilgi için destek ekibimize ulaşabilirsiniz.</p>
    <SupportActions links={supportLinks}/>
  </div>;
}

export function FaqAccordion({ items, openId, onToggle, instanceId }: { items: readonly FaqItem[]; openId?: string; onToggle: (id: string) => void; instanceId: string; query?: string }) {
  return <div className="overflow-hidden rounded-[16px] border border-slate-200/90 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/[.018]">{items.map((item, index) => {
    const open = openId === item.id; const buttonId = `${instanceId}-faq-button-${item.id}`; const panelId = `${instanceId}-faq-panel-${item.id}`;
    return <article key={item.id} id={`${instanceId}-faq-${item.id}`} className={`${index ? "border-t border-slate-200/75 dark:border-white/[.075]" : ""} transition-colors duration-300 ${open ? "bg-sky-50/30 dark:bg-sky-400/[.03]" : "bg-transparent"}`}><h3><button id={buttonId} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => onToggle(item.id)} className="group flex min-h-[62px] w-full items-center justify-between gap-4 px-4 py-[15px] text-left text-[14px] font-semibold leading-[1.5] text-slate-950 outline-none transition-colors duration-200 hover:bg-slate-50/65 hover:text-sky-800 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 sm:gap-5 sm:px-6 sm:text-[15.5px] sm:leading-[1.48] dark:text-white dark:hover:bg-white/[.025] dark:hover:text-sky-300"><span className="min-w-0">{item.question}</span><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${open ? "bg-sky-100/90 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600 dark:bg-white/[.04] dark:group-hover:text-slate-300"}`}><Chevron open={open}/></span></button></h3>{open && <div id={panelId} role="region" aria-labelledby={buttonId} className="px-4 pb-5 text-[14px] leading-[1.74] text-slate-600 sm:px-6 sm:pb-6 sm:text-[15px] sm:leading-[1.72] dark:text-slate-300"><div className="max-w-[800px] border-l-2 border-sky-200/90 pl-4 sm:pl-5 dark:border-sky-400/20"><p>{item.shortAnswer}</p>{item.answer !== item.shortAnswer && <p className="mt-3.5">{item.answer}</p>}{relatedArticleHref(item.category) ? <a href={relatedArticleHref(item.category)} className="mt-4 inline-flex font-semibold text-sky-700 hover:underline dark:text-sky-300">Ayrıntılı rehberi incele →</a> : null}</div></div>}</article>;
  })}</div>;
}

export function SearchResults({ items, onSelect, supportLinks }: { items: readonly FaqItem[]; onSelect: (item: FaqItem) => void; supportLinks?: { whatsapp?: string; liveSupport?: string; contact?: string } }) {
  if (!items.length) return <div className="rounded-[18px] border border-dashed border-slate-300 bg-slate-50/70 px-6 py-16 text-center dark:border-white/15 dark:bg-white/[.02]"><h2 className="text-lg font-bold tracking-[-0.02em] text-slate-950 dark:text-white">Aradığınız soruyu bulamadık.</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">Aramanızı sadeleştirin veya destek ekibimize doğrudan sorun.</p><SupportActions links={supportLinks}/></div>;
  return <div className="overflow-hidden rounded-[18px] border border-slate-200/90 bg-white shadow-[0_14px_40px_rgba(15,23,42,.045)] dark:border-white/10 dark:bg-white/[.02]">{items.map((item, index) => <button key={item.id} type="button" onClick={() => onSelect(item)} className={`group block w-full p-5 text-left transition hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 sm:p-6 dark:hover:bg-white/[.025] ${index ? "border-t border-slate-200/80 dark:border-white/[.08]" : ""}`}><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">{item.category}</span><span className="mt-2 block text-[15px] font-semibold leading-6 text-slate-950 transition group-hover:text-sky-800 dark:text-white dark:group-hover:text-sky-300">{item.question}</span><span className="mt-2 line-clamp-2 block text-sm leading-6 text-slate-500 dark:text-slate-400">{item.shortAnswer}</span></button>)}</div>;
}

export function FaqTrustStrip({ items = ["3+ Yıl Aktif Hizmet", "İşlem Öncesi Net Tutar", "Resmî İletişim Kanalı", "Ödeme Sonrası Kontrol"] }: { items?: readonly string[] }) {
  return <section aria-label="Hizmet güvenceleri" className="mt-10 border-t border-slate-200/75 pt-6 dark:border-white/10"><div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">{items.slice(0, 4).map((item, index) => <div key={item} className="flex min-h-11 items-center gap-3"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/10"><TrustIcon index={index % 4}/></span><span className="text-[12.5px] font-semibold leading-5 text-slate-700 sm:text-[13px] dark:text-slate-200">{item}</span></div>)}</div></section>;
}
