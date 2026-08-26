'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { reportClientError } from './lib/client-error-reporting';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    reportClientError({ kind: 'global-boundary', digest: error.digest });
  }, [error]);

  return (
    <html lang="tr">
      <body className="min-h-screen bg-[#090b10] text-white antialiased">
        <main className="grid min-h-screen place-items-center px-5 py-16 text-center">
          <section
            className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.045] p-8 shadow-2xl shadow-black/30 sm:p-10"
            aria-labelledby="global-error-title"
          >
            <span
              className="mx-auto grid size-14 place-items-center rounded-2xl border border-rose-400/20 bg-rose-500/10 text-2xl font-black text-rose-300"
              aria-hidden="true"
            >
              !
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-rose-300">
              Sistem hatası
            </p>
            <h1 id="global-error-title" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Sayfa güvenli biçimde yenilenemedi
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Geçici bir bağlantı veya uygulama hatası oluştu. İşleminiz otomatik olarak gönderilmedi.
              Sayfayı yeniden deneyebilir ya da ana sayfaya dönebilirsiniz.
            </p>
            {error.digest ? (
              <p className="mt-4 text-xs text-slate-500">Hata referansı: {error.digest}</p>
            ) : null}
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Yeniden dene
              </button>
              <Link
                href="/"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-extrabold text-white transition hover:border-white/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Ana sayfaya dön
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
