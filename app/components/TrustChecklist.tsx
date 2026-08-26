'use client';

import { useMemo, useState } from 'react';
import { buildWhatsAppUrl, trackConversion } from '../lib/conversion';
import { siteConfig } from '../lib/site-config';

const checks = [
  'Hizmetin güncel olarak uygun olduğunu yazılı biçimde doğruladım.',
  'Kesin oranı ve net ödeme tutarını gördüm.',
  'Kullandığım hat, hesap, kart veya kod bana ait.',
  'Şifre, SMS kodu veya uzaktan erişim paylaşmayacağım.',
  `Görüşmeyi ${siteConfig.domain} üzerindeki resmî bağlantıdan başlattım.`,
] as const;

export default function TrustChecklist({ context = 'genel işlem' }: { context?: string }) {
  const [selected, setSelected] = useState<boolean[]>(checks.map(() => false));
  const completedCount = selected.filter(Boolean).length;
  const remainingCount = checks.length - completedCount;
  const complete = remainingCount === 0;
  const message = useMemo(
    () => complete
      ? `Merhaba, ${context} için işlem öncesi güvenlik kontrol listesini tamamladım. Güncel uygunluk ve oran bilgisi almak istiyorum.`
      : `Merhaba, ${context} için güncel uygunluk ve oran bilgisi almak istiyorum. İşlem öncesi güvenlik kontrollerini görüşmede doğrulamak istiyorum.`,
    [complete, context],
  );

  function toggle(index: number) {
    setSelected((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value));
  }

  function trackChecklistWhatsApp() {
    if (complete) trackConversion('checklist_completed', { context });
    trackConversion('whatsapp_clicked', { source: 'trust_checklist', context, checklistComplete: complete });
  }

  return (
    <section className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[.035] p-6 sm:p-8" aria-labelledby="trust-checklist-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-400">İşlem öncesi kontrol</p>
          <h2 id="trust-checklist-title" className="mt-3 text-2xl font-black">Hazır olduğunuzdan emin olun</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs font-black text-slate-300" aria-label={`${completedCount} / ${checks.length} kontrol tamamlandı`}>
          {completedCount}/{checks.length}
        </span>
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-400">Listeyi tamamlamak zorunlu değildir; önemli noktaları işlemden önce gözden geçirmenize yardımcı olur.</p>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[.06]" role="progressbar" aria-label="Kontrol listesi ilerlemesi" aria-valuemin={0} aria-valuemax={checks.length} aria-valuenow={completedCount}>
        <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${(completedCount / checks.length) * 100}%` }} />
      </div>

      <p className="sr-only" aria-live="polite">{complete ? 'Tüm güvenlik kontrolleri tamamlandı.' : `${remainingCount} güvenlik kontrolü kaldı.`}</p>

      <div className="mt-5 space-y-2.5">
        {checks.map((label, index) => (
          <label key={label} className="flex cursor-pointer gap-3 rounded-2xl border border-white/8 bg-[#0b1110]/60 p-4 transition hover:border-emerald-400/25 focus-within:border-emerald-400/40">
            <input type="checkbox" checked={selected[index]} onChange={() => toggle(index)} className="mt-1 h-4 w-4 shrink-0 accent-emerald-400" />
            <span className="text-sm leading-6 text-slate-300">{label}</span>
          </label>
        ))}
      </div>

      <div className={`mt-5 rounded-2xl border p-4 text-sm ${complete ? 'border-emerald-400/20 bg-emerald-400/[.07] text-emerald-200' : 'border-amber-300/15 bg-amber-300/[.04] text-slate-400'}`}>
        {complete ? 'Kontroller tamamlandı. Görüşmeye resmî kanal üzerinden devam edebilirsiniz.' : 'Eksik kontrolleri görüşme sırasında da doğrulayabilirsiniz; şifre veya SMS kodu paylaşmayın.'}
      </div>

      <a href={buildWhatsAppUrl(message)} onClick={trackChecklistWhatsApp} target="_blank" rel="noopener noreferrer" className="focus-ring mt-5 flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 text-center text-sm font-black text-[#06110e] transition hover:-translate-y-0.5">
        {complete ? 'Kontroller tamamlandı — WhatsApp’a geçin' : 'Resmî WhatsApp üzerinden bilgi alın'}
      </a>
    </section>
  );
}
