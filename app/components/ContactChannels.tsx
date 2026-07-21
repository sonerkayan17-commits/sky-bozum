'use client';

import { useState } from 'react';

type Channel = { title: string; value: string; href: string; note: string; external?: boolean };

export default function ContactChannels({ channels }: { channels: Channel[] }) {
  const [copied, setCopied] = useState('');

  async function copy(channel: Channel) {
    try {
      await navigator.clipboard.writeText(channel.value);
      setCopied(channel.title);
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('Kopyalanamadı');
    }
  }

  return <div className="grid gap-5 md:grid-cols-3">{channels.map((channel) => <article key={channel.title} className="premium-card interactive-card flex flex-col p-6"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-400">{channel.title}</p><p className="mt-4 break-all text-lg font-black">{channel.value}</p><p className="mt-2 text-sm text-slate-500">{channel.note}</p><div className="mt-auto flex flex-wrap gap-2 pt-6"><a href={channel.href} target={channel.external ? '_blank' : undefined} rel={channel.external ? 'noopener noreferrer' : undefined} className="btn-primary focus-ring min-h-11 flex-1 px-4 py-2 text-xs">İletişime geç</a><button type="button" onClick={() => copy(channel)} className="btn-secondary focus-ring min-h-11 px-4 py-2 text-xs" aria-label={`${channel.title} bilgisini kopyala`}>{copied === channel.title ? 'Kopyalandı' : 'Kopyala'}</button></div><span className="sr-only" aria-live="polite">{copied === channel.title ? `${channel.title} kopyalandı` : copied === 'Kopyalanamadı' ? 'Bilgi kopyalanamadı' : ''}</span></article>)}</div>;
}
