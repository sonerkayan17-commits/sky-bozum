'use client';
import { useState } from 'react';

export default function ShareButtons({ title }: { title: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function share() {
    const url = window.location.href;
    try {
      setStatus('idle');
      if (navigator.share) await navigator.share({ title, text: `${title} — Sky Bozum Bilgi Merkezi`, url });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setStatus('copied');
        window.setTimeout(() => setStatus('idle'), 2200);
      } else setStatus('failed');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setStatus('failed');
    }
  }

  const label = status === 'failed' ? 'Bağlantı kopyalanamadı' : status === 'copied' ? 'Bağlantı kopyalandı' : 'Yazıyı paylaş';
  return <button type="button" onClick={share} aria-label={`${title} yazısını paylaş`} className="focus-ring min-h-11 rounded-xl border border-white/15 bg-white/[.05] px-4 py-2 text-xs font-black text-white transition hover:bg-white/10"><span aria-live="polite">{label}</span></button>;
}
