'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useVisitorExperience } from './VisitorExperienceProvider';

export default function ConsentPanel() {
  const {
    consent,
    preferencesOpen,
    acceptPersonalization,
    rejectPersonalization,
    closePreferences,
  } = useVisitorExperience();
  if (preferencesOpen) {
    return <PreferencesDialog consent={consent} acceptPersonalization={acceptPersonalization} rejectPersonalization={rejectPersonalization} closePreferences={closePreferences} />;
  }

  if (consent !== 'unknown') return null;

  return (
    <aside aria-label="Çerez ve kişiselleştirme tercihi" className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-5xl rounded-2xl border border-white/12 bg-[#11151d]/98 p-4 shadow-[0_24px_80px_rgba(0,0,0,.55)] backdrop-blur-xl sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div><h2 className="text-base font-black">Size uygun içerikleri gösterebiliriz.</h2><p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-400">Onay verirseniz bu tarayıcıda anonim bir ziyaretçi ID’si ve ilgi puanları saklanır. Veri dışarı gönderilmez. <Link href="/gizlilik-politikasi" className="font-bold text-rose-300">Ayrıntılar</Link></p></div>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={acceptPersonalization} className="min-h-11 rounded-xl border border-white/15 bg-white/[.06] px-3 text-xs font-black text-white hover:bg-white/[.1]">Kabul et</button>
          <button type="button" onClick={rejectPersonalization} className="min-h-11 rounded-xl border border-white/15 bg-white/[.06] px-3 text-xs font-black text-white hover:bg-white/[.1]">Reddet</button>
          <PreferencesButton />
        </div>
      </div>
    </aside>
  );
}

function PreferencesDialog({ consent, acceptPersonalization, rejectPersonalization, closePreferences }: {
  consent: 'unknown' | 'accepted' | 'rejected';
  acceptPersonalization: () => void;
  rejectPersonalization: () => void;
  closePreferences: () => void;
}) {
  const [personalizationEnabled, setPersonalizationEnabled] = useState(consent === 'accepted');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') closePreferences(); };
    const frame = requestAnimationFrame(() => dialogRef.current?.focus());
    window.addEventListener('keydown', close);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', close); };
  }, [closePreferences]);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePreferences(); }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="privacy-title" className="w-full max-w-xl rounded-3xl border border-white/12 bg-[#11151d] p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[.18em] text-rose-400">Gizlilik tercihleri</p>
        <h2 id="privacy-title" className="mt-3 text-2xl font-black">Kontrol tamamen sizde.</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">Zorunlu depolama yalnızca seçiminizi hatırlar. Kişiselleştirme açılırsa rastgele anonim ID ve ilgi puanları bu tarayıcıda en fazla 90 gün tutulur; Sky Bozum sunucularına gönderilmez.</p>
        <div className="mt-6 space-y-3">
          <div className="flex items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div><h3 className="text-sm font-black">Zorunlu tercih kaydı</h3><p className="mt-1 text-xs leading-5 text-slate-400">Kabul veya ret seçiminizi hatırlar.</p></div><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">Her zaman açık</span>
          </div>
          <label className="flex cursor-pointer items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <span><span className="block text-sm font-black">Kişiselleştirilmiş içerik</span><span className="mt-1 block text-xs leading-5 text-slate-400">İncelediğiniz hizmetlere göre ilgili rehberleri öne çıkarır.</span></span>
            <input type="checkbox" checked={personalizationEnabled} onChange={(event) => setPersonalizationEnabled(event.target.checked)} className="mt-1 size-5 accent-rose-500" />
          </label>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button type="button" className="btn-secondary w-full" onClick={closePreferences}>Vazgeç</button>
          <button type="button" className="btn-secondary w-full" onClick={personalizationEnabled ? acceptPersonalization : rejectPersonalization}>Tercihi kaydet</button>
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-500">Ayrıntılar için <Link href="/gizlilik-politikasi" onClick={closePreferences} className="font-bold text-rose-300 hover:text-rose-200">Gizlilik Politikası</Link>.</p>
      </div>
    </div>
  );
}

function PreferencesButton() {
  const { openPreferences } = useVisitorExperience();
  return <button type="button" onClick={openPreferences} className="min-h-11 rounded-xl border border-white/15 bg-white/[.06] px-3 text-xs font-black text-white hover:bg-white/[.1]">Tercihler</button>;
}
