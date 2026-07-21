'use client';

import { useMemo, useState } from 'react';
import { buildWhatsAppUrl, trackConversion } from '../lib/conversion';

const checks = [
  'Hizmet türünü ve tutarı kontrol ettim.',
  'Kodun, bakiyenin veya ödeme aracının bana ait olduğunu doğruladım.',
  'Gösterilen tutarın tahmini olduğunu ve kesin oranın işlem öncesinde paylaşılacağını biliyorum.',
  'Kod veya hassas bilgileri yalnızca resmi WhatsApp görüşmesinde paylaşacağım.',
];

export default function TrustChecklist({ context = 'genel işlem' }: { context?: string }) {
  const [selected, setSelected] = useState<boolean[]>(checks.map(() => false));
  const complete = selected.every(Boolean);
  const message = useMemo(() => `Merhaba, ${context} için işlem öncesi kontrol listesini tamamladım. Güncel uygunluk ve oran bilgisi almak istiyorum.`, [context]);

  function toggle(index: number) {
    setSelected((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value));
  }

  return (
    <section className="premium-card p-6 sm:p-8" aria-labelledby="trust-checklist-title">
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-400">İşlem öncesi kontrol</p>
      <h2 id="trust-checklist-title" className="mt-3 text-2xl font-black">Hazır olduğunuzdan emin olun</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">Bu liste ödeme veya uygunluk garantisi vermez; yanlış ve eksik başvuruları azaltır.</p>
      <div className="mt-6 space-y-3">
        {checks.map((label, index) => (
          <label key={label} className="flex cursor-pointer gap-3 rounded-2xl border border-white/8 bg-white/[.025] p-4 transition hover:border-emerald-400/25">
            <input type="checkbox" checked={selected[index]} onChange={() => toggle(index)} className="mt-1 h-4 w-4 accent-emerald-400" />
            <span className="text-sm leading-6 text-slate-300">{label}</span>
          </label>
        ))}
      </div>
      <a
        href={complete ? buildWhatsAppUrl(message) : undefined}
        aria-disabled={!complete}
        onClick={(event) => {
          if (!complete) event.preventDefault();
          else { trackConversion('checklist_completed', { context }); trackConversion('whatsapp_clicked', { source: 'trust_checklist', context }); }
        }}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-black transition ${complete ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-[#06110e] hover:-translate-y-0.5' : 'cursor-not-allowed border border-white/10 bg-white/[.04] text-slate-600'}`}
      >
        {complete ? 'WhatsApp ile güncel bilgi alın' : 'Devam etmek için tüm maddeleri onaylayın'}
      </a>
    </section>
  );
}
