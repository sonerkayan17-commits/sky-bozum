'use client';

import { useMemo, useState } from 'react';
import { buildWhatsAppUrl } from '../lib/conversion';

const checks = [
  {
    id: 'official-channel',
    title: 'Resmî kanaldan başladım',
    text: 'Görüşmeyi bozumcu.net üzerindeki WhatsApp bağlantısından açtım.',
  },
  {
    id: 'ownership-match',
    title: 'Hat ve ödeme hesabı eşleşiyor',
    text: 'İşlem yapılan hat bana ait; ödeme hesabı da hat sahibinin adına.',
  },
  {
    id: 'written-amount',
    title: 'Net tutarı yazılı gördüm',
    text: 'Kod veya bakiye paylaşmadan önce hesabıma geçecek net tutar bildirildi.',
  },
  {
    id: 'no-sensitive-request',
    title: 'Hassas erişim istenmedi',
    text: 'SMS kodu, şifre, ekran paylaşımı veya uzaktan erişim talep edilmedi.',
  },
] as const;

export default function SkyTrustCheck() {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(checks.map((check) => [check.id, false])),
  );

  const confirmedCount = Object.values(confirmed).filter(Boolean).length;
  const complete = confirmedCount === checks.length;

  const whatsappMessage = useMemo(
    () => complete
      ? 'Merhaba, işlem öncesi dört temel güvenlik kontrolünü tamamladım. Resmî kanaldan işleme başlamak istiyorum.'
      : 'Merhaba, bozumcu.net üzerinden resmî kanaldan işleme başlamak ve güncel uygunluğu öğrenmek istiyorum.',
    [complete],
  );

  return (
    <section className="sky-trust-check overflow-hidden rounded-xl border border-[#b83a50]/22 bg-[linear-gradient(145deg,rgba(25,29,36,.96),rgba(8,10,14,.99))] shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_16px_45px_rgba(0,0,0,.2)]" aria-labelledby="sky-trust-check-title">
      <div className="grid gap-0 lg:grid-cols-[1.18fr_.82fr]">
        <div className="sky-trust-check__main p-4 sm:p-5 lg:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#d06a7c]">İsteğe bağlı · 10 saniye</p>
              <h3 id="sky-trust-check-title" className="mt-1.5 text-xl font-black sm:text-2xl">İşleme başlamadan önce dört kısa kontrol</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">Kontrol isteğe bağlıdır; resmî WhatsApp bağlantısı her zaman açıktır.</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[.035] px-3 py-1.5 text-xs font-black text-slate-300">
              {confirmedCount}/{checks.length}
            </span>
          </div>

          <div className="sky-trust-check__items mt-4 grid gap-2 sm:grid-cols-2">
            {checks.map((check) => {
              const checked = confirmed[check.id];
              return (
                <label
                  key={check.id}
                  className={`sky-trust-check__item focus-within:ring-2 focus-within:ring-[#d06a7c]/60 flex cursor-pointer gap-2.5 rounded-lg border p-3 transition ${
                    checked
                      ? 'border-[#b83a50]/45 bg-[#b83a50]/[.10]'
                      : 'border-white/8 bg-black/10 hover:border-white/16 hover:bg-white/[.025]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => setConfirmed((current) => ({ ...current, [check.id]: event.target.checked }))}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#b83a50]"
                  />
                  <span>
                    <strong className="block text-sm font-black text-white">{check.title}</strong>
                    <span className="sky-trust-check__item-text mt-1 block text-[11px] leading-4 text-slate-400">{check.text}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <aside className={`sky-trust-check__aside border-t p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-5 ${complete ? 'border-[#b83a50]/30 bg-[#b83a50]/[.07]' : 'border-white/8 bg-[#0d1118]'}`} aria-live="polite">
          <p className={`text-xs font-black uppercase tracking-[.16em] ${complete ? 'text-[#dc7b8a]' : 'text-slate-400'}`}>
            {complete ? 'Temel kontroller tamamlandı' : 'Hızlı ve doğrudan işlem'}
          </p>
          <h4 className="mt-2 text-xl font-black">
            {complete ? 'Güvenli başlangıç için hazırsınız' : 'Kontrol yapmadan da iletişime geçebilirsiniz'}
          </h4>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            {complete
              ? 'Yazışmaları ve ödeme hareketini işlem tamamlanana kadar saklayın.'
              : 'Tereddüdünüz yoksa doğrudan resmî WhatsApp hattına geçin. Şüpheli bir durum varsa yardım aracını açın.'}
          </p>

          <div className="mt-4 grid gap-2">
            <a
              href={buildWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex min-h-10 items-center justify-center rounded-lg border border-[#d06a7c]/55 bg-[linear-gradient(135deg,#51131f,#92243a_52%,#391018)] px-4 text-center text-xs font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.13),0_10px_24px_rgba(75,10,21,.2)] transition hover:border-[#e18b99]/75"
            >
              WhatsApp’tan işleme başla
            </a>
            <a
              href="#sorun-cozucu"
              className="focus-ring flex min-h-10 items-center justify-center rounded-lg border border-white/12 bg-white/[.025] px-4 text-center text-xs font-black text-slate-200 transition hover:border-amber-300/30 hover:text-amber-100"
            >
              Şüpheli bir durumu kontrol et
            </a>
          </div>

          <p className="mt-3 text-[10px] leading-4 text-slate-500">Bu özet kesin güvenlik garantisi vermez. SMS kodu, şifre veya ekran erişimi istenirse devam etmeyin.</p>
        </aside>
      </div>
    </section>
  );
}
