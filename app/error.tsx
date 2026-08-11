'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error(error);
  }, [error]);
  return (
    <main className="grid min-h-[65vh] place-items-center bg-[#090b10] px-5 py-16 text-center text-white">
      <div className="premium-card max-w-xl p-8 sm:p-10"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-500/10 text-2xl text-rose-400">!</span><h1 className="mt-5 text-3xl font-black">Bu sayfa şu anda açılamadı.</h1><p className="mt-4 text-sm leading-7 text-slate-400">Geçici bir sorun oluştu. Tekrar deneyebilir veya ana sayfaya dönebilirsiniz.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={reset} className="focus-ring rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 px-6 py-3 text-sm font-extrabold">Tekrar dene</button><Link href="/" className="focus-ring rounded-xl border border-white/10 px-6 py-3 text-sm font-extrabold">Ana sayfa</Link></div></div>
    </main>
  );
}
