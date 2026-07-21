'use client';

import { useState } from 'react';

type Vote = 'yes' | 'no';

export default function ArticleFeedback({ slug }: { slug: string }) {
  const [vote, setVote] = useState<Vote | null>(null);

  function choose(nextVote: Vote) {
    setVote(nextVote);
    try { localStorage.setItem(`sky-article-feedback:${slug}`, nextVote); } catch {}
  }

  return (
    <section className="article-feedback" aria-labelledby="article-feedback-title">
      <div>
        <p className="article-feedback__eyebrow">İçeriği geliştirmemize yardımcı olun</p>
        <h2 id="article-feedback-title">Bu rehber faydalı oldu mu?</h2>
        <p>{vote ? 'Geri bildiriminiz kaydedildi. Teşekkür ederiz.' : 'Tek tıklamayla görüşünüzü paylaşabilirsiniz.'}</p>
      </div>
      <div className="article-feedback__actions">
        <button type="button" onClick={() => choose('yes')} aria-pressed={vote === 'yes'}>Evet, faydalıydı</button>
        <button type="button" onClick={() => choose('no')} aria-pressed={vote === 'no'}>Geliştirilebilir</button>
      </div>
    </section>
  );
}
