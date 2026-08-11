'use client';

import { useEffect, useState } from 'react';

type Vote = 'yes' | 'no';

export default function ArticleFeedback({ slug }: { slug: string }) {
  const [vote, setVote] = useState<Vote | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sky-article-feedback:${slug}`);
      if (saved === 'yes' || saved === 'no') setVote(saved);
    } catch {}
  }, [slug]);

  function choose(nextVote: Vote) {
    setVote(nextVote);
    try { localStorage.setItem(`sky-article-feedback:${slug}`, nextVote); } catch {}
  }

  return (
    <section className="article-feedback-compact" aria-labelledby="article-feedback-title">
      <div>
        <h2 id="article-feedback-title">Bu rehber faydalı oldu mu?</h2>
        <p aria-live="polite">{vote ? 'Teşekkürler, geri bildiriminiz kaydedildi.' : 'Tek tıkla görüşünüzü paylaşın.'}</p>
      </div>
      <div className="article-feedback-compact__actions">
        <button type="button" onClick={() => choose('yes')} aria-pressed={vote === 'yes'} className="focus-ring rounded-md">Evet</button>
        <button type="button" onClick={() => choose('no')} aria-pressed={vote === 'no'} className="focus-ring rounded-md">Geliştirilebilir</button>
      </div>
    </section>
  );
}
