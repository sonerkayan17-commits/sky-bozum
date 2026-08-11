'use client';
import { useRef, useState } from 'react';

export default function ShareButtons({ title }: { title: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<number | null>(null);

  function resetStatus(delay = 2200) {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setStatus('idle'), delay);
  }

  function legacyCopy(value: string) {
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(input);
    return copied;
  }

  async function share() {
    const url = window.location.href;
    try {
      setStatus('idle');
      if (navigator.share) {
        await navigator.share({ title, text: `${title} — Sky Bozum Bilgi Merkezi`, url });
        return;
      }
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else if (!legacyCopy(url)) throw new Error('copy_failed');
      setStatus('copied');
      resetStatus();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setStatus('failed');
      resetStatus(2800);
    }
  }

  const label = status === 'failed' ? 'Kopyalanamadı' : status === 'copied' ? 'Kopyalandı' : 'Paylaş';
  return <button type="button" onClick={share} aria-label={`${title} yazısını paylaş`} className="article-share-button focus-ring rounded-md"><span aria-hidden="true">↗</span><span aria-live="polite">{label}</span></button>;
}
