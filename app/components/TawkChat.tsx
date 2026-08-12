'use client';

import { useEffect } from 'react';

const TAWK_PROPERTY_ID = '69fa97b6b2c8791c30a70ea8';
const TAWK_WIDGET_ID = '1jvqhf0gc';
const SCRIPT_ID = 'sky-bozum-tawk-chat';

/** Loads the official Sky Bozum support widget once for the whole site. */
export default function TawkChat() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    const tawkWindow = window as typeof window & {
      Tawk_API?: { maximize?: () => void; onLoad?: () => void };
    };
    tawkWindow.Tawk_API = tawkWindow.Tawk_API || {};
    tawkWindow.Tawk_API.onLoad = () => {
      window.setTimeout(() => tawkWindow.Tawk_API?.maximize?.(), 350);
    };

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
  }, []);

  return null;
}
