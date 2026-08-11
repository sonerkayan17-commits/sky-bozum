'use client';

import { useState } from 'react';

type TrustCommandCenterProps = {
  domain: string;
  phone: string;
  whatsappHref: string;
};

export default function TrustCommandCenter({ domain, phone, whatsappHref }: TrustCommandCenterProps) {
  const [copied, setCopied] = useState<'domain' | 'phone' | null>(null);

  async function copy(value: string, target: 'domain' | 'phone') {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    setCopied(target);
    window.setTimeout(() => setCopied((current) => current === target ? null : current), 1800);
  }

  return (
    <section className="trust-command-center content-shell" aria-labelledby="trust-command-title">
      <div className="trust-command-frame">
        <div className="trust-command-identity">
          <span className="trust-command-pulse" aria-hidden="true" />
          <div>
            <p>SKY BOZUM · RESMÎ ERİŞİM</p>
            <h2 id="trust-command-title">Kanal kimliğini doğrula.</h2>
          </div>
        </div>

        <div className="trust-command-records">
          <button type="button" onClick={() => copy(domain, 'domain')} className="trust-command-record focus-ring" aria-label={`${domain} alan adını kopyala`}>
            <span>RESMÎ ALAN ADI</span><b>{domain}</b><em>{copied === 'domain' ? 'KOPYALANDI ✓' : 'KOPYALA'}</em>
          </button>
          <button type="button" onClick={() => copy(phone, 'phone')} className="trust-command-record focus-ring" aria-label={`${phone} telefon numarasını kopyala`}>
            <span>RESMÎ NUMARA</span><b>{phone}</b><em>{copied === 'phone' ? 'KOPYALANDI ✓' : 'KOPYALA'}</em>
          </button>
        </div>

        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="trust-command-primary focus-ring">
          <span><small>DOĞRULANMIŞ BAŞLANGIÇ</small><b>Resmî WhatsApp</b></span><strong aria-hidden="true">↗</strong>
        </a>
      </div>
      <p className="sr-only" aria-live="polite">{copied === 'domain' ? 'Resmî alan adı kopyalandı.' : copied === 'phone' ? 'Resmî telefon numarası kopyalandı.' : ''}</p>
    </section>
  );
}
