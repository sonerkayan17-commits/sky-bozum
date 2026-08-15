'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { calculatePayout, parseTurkishAmount, validateAmount } from '../lib/rates';
import { siteConfig } from '../lib/site-config';
import useRememberedRate from './personalization/useRememberedRate';
import usePublishedRates from './personalization/usePublishedRates';

function formatAmountInput(value: string) {
  const digits = value.replace(/[^0-9]/g, '').slice(0, 9);
  return digits ? Number(digits).toLocaleString('tr-TR') : '';
}

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 transition duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m5 10 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
      <path d="M9 8.5c.4 2.5 2 4.1 4.5 5" strokeLinecap="round" />
    </svg>
  );
}

export default function QuickCalculator({ compact = false }: { compact?: boolean }) {
  const [serviceName, setServiceName] = useRememberedRate();
  const [amount, setAmount] = useState('5000');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const publishedRates = usePublishedRates();

  const selected = publishedRates.find((item) => item.name === serviceName) ?? publishedRates[0];
  const numericAmount = parseTurkishAmount(amount);
  const error = amount.trim() ? validateAmount(numericAmount, selected) : '';
  const net = useMemo(
    () => (error || !amount.trim() ? 0 : calculatePayout(numericAmount, selected.rate)),
    [error, amount, numericAmount, selected.rate],
  );
  const message = encodeURIComponent(
    `Merhaba, ${selected.name} için ${numericAmount.toLocaleString('tr-TR')} TL tutarında güncel oran almak istiyorum. Hesaplayıcı yaklaşık ${net.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL gösterdi; kesin oranı teyit eder misiniz?`,
  );

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <section id={compact ? undefined : 'oran-teklifi'} className={compact ? 'h-full min-h-0 w-full self-stretch text-white' : 'rhythm-md bg-[#07080d] text-white'}>
      <div className={compact ? 'h-full' : 'content-wide'}>
        <div className="group relative flex h-full min-h-[540px] w-full flex-col overflow-visible rounded-[22px] border border-white/[0.12] bg-[radial-gradient(circle_at_10%_0%,rgba(245,190,54,.075),transparent_31%),linear-gradient(180deg,rgba(10,18,27,.985),rgba(6,12,19,.995))] p-5 shadow-[0_24px_64px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.045)] transition duration-500 hover:border-white/[0.17]">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f3bf31]/40 to-transparent" />

          <header className="flex shrink-0 items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#f3bf31]">Hesap Makinesi</p>
              <h2 className="mt-1 text-[27px] font-black tracking-[-.04em] text-white">Oran Hesapla</h2>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.055] px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.7)]" />
              <span className="text-[9px] font-black uppercase tracking-[.13em] text-emerald-300/85">7/24 Aktif</span>
            </div>
          </header>

          <div className="mt-4 grid min-h-0 flex-1 overflow-hidden rounded-[18px] border border-white/[0.075] bg-white/[0.018] xl:grid-cols-[minmax(0,1.16fr)_minmax(224px,.84fr)]">
            <div className="relative flex min-h-0 flex-col p-[18px] xl:border-r xl:border-white/[0.07]">
              <div className="grid gap-3 sm:grid-cols-2">
                <div ref={menuRef} className="relative z-30">
                  <label id="service-label" className="block text-[11px] font-semibold text-white/66">Hizmet</label>
                  <button
                    type="button"
                    aria-labelledby="service-label"
                    aria-haspopup="listbox"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((current) => !current)}
                    className={`mt-1.5 flex h-[48px] w-full items-center justify-between rounded-[14px] border bg-black/[0.16] px-3.5 text-left text-[13px] font-bold text-white outline-none transition ${menuOpen ? 'border-[#e8b84f]/70 ring-4 ring-[#e8b84f]/[0.08]' : 'border-white/[0.11] hover:border-white/[0.2] focus-visible:border-[#e8b84f]/70 focus-visible:ring-4 focus-visible:ring-[#e8b84f]/[0.08]'}`}
                  >
                    <span className="truncate">{selected.name}</span>
                    <span className="ml-3 shrink-0 text-white/60"><Chevron open={menuOpen} /></span>
                  </button>
                  {menuOpen && (
                    <div role="listbox" aria-labelledby="service-label" className="absolute left-0 right-0 top-[74px] z-50 max-h-[230px] overflow-y-auto rounded-[14px] border border-white/[0.13] bg-[#0b131d] p-1.5 shadow-[0_22px_55px_rgba(0,0,0,.58)]">
                      {publishedRates.map((item) => {
                        const active = item.name === selected.name;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => { setServiceName(item.name); setMenuOpen(false); }}
                            className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[12px] font-bold transition ${active ? 'bg-[#f3bf31]/12 text-[#f3bf31]' : 'text-white/72 hover:bg-white/[0.055] hover:text-white focus-visible:bg-white/[0.055] focus-visible:text-white'}`}
                          >
                            <span>{item.name}</span>{active && <CheckIcon />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <label className="block text-[11px] font-semibold text-white/66">Tutar
                  <div className="relative mt-1.5">
                    <input
                      value={amount}
                      onChange={(event) => setAmount(formatAmountInput(event.target.value))}
                      inputMode="numeric"
                      aria-invalid={Boolean(error)}
                      className="h-[48px] w-full rounded-[14px] border border-white/[0.11] bg-black/[0.16] px-3.5 pr-11 text-[16px] font-black text-white outline-none transition placeholder:text-white/25 hover:border-white/[0.2] focus:border-[#e8b84f]/65 focus:ring-4 focus:ring-[#e8b84f]/[0.08]"
                      placeholder="5.000"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-black text-white/48">TL</span>
                  </div>
                </label>
              </div>

              <p aria-live="polite" className={`mt-2 min-h-4 text-[11px] font-semibold ${error ? 'text-rose-400' : 'text-white/46'}`}>
                {error || <>Güncel oran aralığı: <span className="text-[#f3bf31]">{selected.range}</span></>}
              </p>

              <div className="relative mt-3 flex min-h-[166px] flex-1 items-center overflow-hidden rounded-[17px] border border-emerald-400/24 bg-[radial-gradient(circle_at_9%_8%,rgba(52,211,153,.14),transparent_39%),linear-gradient(135deg,rgba(16,185,129,.065),rgba(255,255,255,.012)_62%,rgba(245,190,54,.03))] px-5 py-5 shadow-[0_18px_46px_rgba(0,0,0,.18),inset_0_1px_0_rgba(255,255,255,.05)]">
                <div className="pointer-events-none absolute -right-8 -bottom-10 h-40 w-40 rounded-full border border-emerald-300/[0.075]" />
                <div className="relative w-full">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold text-white/70">Tahmini ödemeniz</p>
                    <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black text-emerald-300">{selected.range}</span>
                  </div>
                  <p className="mt-3 whitespace-nowrap text-[36px] font-black leading-none tracking-[-.055em] text-emerald-400 sm:text-[39px]">
                    {net.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] font-bold text-white/45">
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1">FAST / Havale</span>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1">Süre değişebilir</span>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1">Kesin oran onayı</span>
                  </div>
                </div>
              </div>

              <a
                href={`${siteConfig.whatsapp.split('?')[0]}?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className="relative mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[linear-gradient(100deg,#f4ae24_0%,#ffd44f_52%,#f2b62d_100%)] px-4 text-[13px] font-black text-[#17120a] shadow-[0_12px_28px_rgba(245,190,54,.16),inset_0_1px_0_rgba(255,255,255,.38)] transition duration-300 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f3bf31]/25"
              >
                <WhatsAppIcon /> WhatsApp’tan Kesin Teklif Al
              </a>
            </div>

            <aside className="relative flex min-h-0 flex-col overflow-hidden bg-[radial-gradient(circle_at_100%_0%,rgba(243,191,49,.085),transparent_36%),linear-gradient(180deg,rgba(255,255,255,.025),rgba(255,255,255,.008))] p-[18px]">
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#f3bf31]/[0.055] blur-2xl" />
              <div className="relative flex items-center justify-between gap-3">
                <p className="text-[9px] font-black uppercase tracking-[.18em] text-[#f3bf31]">İşlem Özeti</p>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.65)]" />
              </div>

              <div className="relative mt-4 overflow-hidden rounded-[15px] border border-white/[0.075] bg-black/20 p-3.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#f3bf31]/35 to-transparent" />
                <p className="text-[9px] font-semibold text-white/40">Seçilen hizmet</p>
                <p className="mt-1 truncate text-[14px] font-black tracking-[-.02em] text-white">{selected.name}</p>
                <div className="my-3 h-px bg-white/[0.065]" />
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-semibold text-white/40">Tutar</p>
                    <p className="mt-1 text-[16px] font-black text-white">{numericAmount.toLocaleString('tr-TR')} TL</p>
                  </div>
                  <span className="mb-1 text-[13px] text-[#f3bf31]">→</span>
                  <div className="text-right">
                    <p className="text-[9px] font-semibold text-white/40">Tahmini ödeme</p>
                    <p className="mt-1 text-[18px] font-black tracking-[-.035em] text-emerald-400">{net.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL</p>
                  </div>
                </div>
              </div>

              <div className="relative mt-3 grid grid-cols-2 gap-2.5">
                <div className="rounded-[13px] border border-white/[0.065] bg-white/[0.022] px-3 py-2.5">
                  <p className="text-[8px] font-semibold text-white/38">Oran aralığı</p>
                  <p className="mt-1 text-[14px] font-black text-[#f3bf31]">{selected.range}</p>
                </div>
                <div className="rounded-[13px] border border-white/[0.065] bg-white/[0.022] px-3 py-2.5">
                  <p className="text-[8px] font-semibold text-white/38">Tahmini süre</p>
                  <p className="mt-1 text-[14px] font-black text-white">Banka ve doğrulamaya göre</p>
                </div>
              </div>

              <div className="relative mt-4 border-t border-white/[0.07] pt-3.5">
                <p className="text-[9px] font-black uppercase tracking-[.16em] text-white/42">Güvenli işlem akışı</p>
                <div className="mt-3 space-y-2.5">
                  {['Kesin oran paylaşılır', 'Onayınız alınır', 'Ödeme FAST / Havale ile geçer'].map((item, index) => (
                    <div key={item} className="flex items-center gap-2.5 text-white/60">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#f3bf31]/16 bg-[#f3bf31]/[0.055] text-[9px] font-black text-[#f3bf31]">{index + 1}</span>
                      <p className="text-[10px] leading-[1.4]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-auto flex items-center gap-2.5 rounded-[13px] border border-emerald-400/12 bg-emerald-400/[0.035] px-3 py-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/18 bg-emerald-400/[0.07] text-emerald-300"><CheckIcon /></span>
                <p className="text-[9px] leading-[1.45] text-white/46">İşlem başlamadan önce güncel oranınız kesinleştirilir.</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
