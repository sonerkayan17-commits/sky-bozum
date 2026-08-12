'use client';

import { useCallback, useEffect } from 'react';

const TAWK_PROPERTY_ID = '69fa97b6b2c8791c30a70ea8';
const TAWK_WIDGET_ID = '1jvqhf0gc';
const SCRIPT_ID = 'sky-bozum-tawk-chat';

/** Loads the official Sky Bozum support widget once for the whole site. */
export default function TawkChat() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
  }, []);

  const openChat = useCallback(() => {
    const tawk = (window as Window & { Tawk_API?: { maximize?: () => void } }).Tawk_API;
    tawk?.maximize?.();
  }, []);

  return (
    <aside className="tawk-support-intro" aria-label="Sky Bozum canlı destek">
      <span className="tawk-support-eyebrow"><i aria-hidden="true" /> SKY BOZUM</span>
      <strong>Canlı destek burada.</strong>
      <p>Oran, işlem ve ödeme sorularınız için ekibimize doğrudan yazın.</p>
      <div className="tawk-support-actions">
        <button type="button" onClick={openChat}>Bozum yapmak istiyorum</button>
        <button type="button" onClick={openChat}>Güncel oran öğren</button>
      </div>
    </aside>
  );
}
