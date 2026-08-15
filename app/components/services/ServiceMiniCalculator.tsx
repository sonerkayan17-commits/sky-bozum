'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { parseTurkishAmount } from '../../lib/rates';
import usePublishedRates from '../personalization/usePublishedRates';

export default function ServiceMiniCalculator({ serviceSlug, serviceName }: { serviceSlug: string; serviceName: string }) {
  const [value, setValue] = useState('1000');
  const publishedRates = usePublishedRates();
  const rate = publishedRates.find((item) => item.serviceSlug === serviceSlug);
  const amount = parseTurkishAmount(value);

  const result = useMemo(() => {
    if (!rate || !Number.isFinite(amount) || amount <= 0) return null;
    return {
      min: Math.round((amount * rate.rate) / 100),
      max: Math.round((amount * rate.maxRate) / 100),
    };
  }, [amount, rate]);

  if (!rate) {
    return (
      <div className="premium-card p-6 sm:p-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-400">Hızlı hesaplama</p>
        <h2 className="mt-3 text-2xl font-black">Yaklaşık ödemenizi görün</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">Bu hizmet için oran işlem öncesinde teyit edilir.</p>
        <Link href="/araclar#oran-hesapla" className="btn-secondary focus-ring mt-5">Oran hesaplama aracını aç</Link>
      </div>
    );
  }

  return (
    <div className="premium-card overflow-hidden p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-400">Hızlı hesaplama</p>
          <h2 className="mt-3 text-2xl font-black">Yaklaşık ödemenizi görün</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">{serviceName} için güncel taban oran aralığı üzerinden hesaplanır.</p>
        </div>
        <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs font-black text-rose-300">{rate.range}</span>
      </div>

      <label className="mt-6 block text-xs font-bold text-slate-400" htmlFor={`amount-${serviceSlug}`}>İşlem tutarı</label>
      <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-black/25 px-4 focus-within:border-rose-400/45">
        <input
          id={`amount-${serviceSlug}`}
          inputMode="decimal"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="min-h-14 w-full bg-transparent text-xl font-black text-white outline-none placeholder:text-slate-600"
          placeholder="1.000"
          aria-describedby={`amount-note-${serviceSlug}`}
        />
        <span className="font-black text-slate-500">TL</span>
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <p className="text-xs font-bold text-slate-500">Tahmini ödeme aralığı</p>
        <p className="mt-2 text-3xl font-black tracking-tight text-white">
          {result ? `${result.min.toLocaleString('tr-TR')} – ${result.max.toLocaleString('tr-TR')} TL` : 'Tutar girin'}
        </p>
        <p id={`amount-note-${serviceSlug}`} className="mt-2 text-xs leading-6 text-slate-500">Kesin tutar; stok, ürün türü ve işlem anındaki uygunluk kontrolünden sonra yazılı olarak bildirilir.</p>
      </div>

      <Link href={`/oran-hesapla?service=${encodeURIComponent(serviceSlug)}`} className="focus-ring mt-5 inline-flex min-h-11 items-center text-sm font-black text-rose-300 hover:text-rose-200">Detaylı hesaplama aracına geç →</Link>
    </div>
  );
}
