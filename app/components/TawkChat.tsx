'use client';

import { useEffect } from 'react';

const TAWK_PROPERTY_ID = '69fa97b6b2c8791c30a70ea8';
// This is the established Bozumcu live-support flow. It includes the
// welcome message and the two ready-to-select support prompts configured
// in Tawk, so the site keeps the same chat experience as the live service.
const TAWK_WIDGET_ID = '1jnte1897';
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

  return null;
}
