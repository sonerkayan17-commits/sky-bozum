'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error(error);
  }, [error]);
  return (
    <main className="experience-state">
      <section className="experience-state__card" aria-labelledby="page-error-title"><span className="experience-state__mark" aria-hidden="true">!</span><div className="experience-state__eyebrow">GEÇİCİ BAĞLANTI SORUNU</div><h1 id="page-error-title">Bu sayfa şu anda açılamadı.</h1><p>İşleminiz gönderilmedi. Sayfayı güvenli biçimde yeniden deneyebilir veya ana sayfadan devam edebilirsiniz.</p><div className="experience-state__actions"><button type="button" onClick={reset}>Tekrar dene</button><Link href="/">Ana sayfaya dön</Link></div></section>
    </main>
  );
}
