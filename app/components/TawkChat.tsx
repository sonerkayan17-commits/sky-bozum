'use client';

import { useEffect } from 'react';

const TAWK_PROPERTY_ID = '69fa97b6b2c8791c30a70ea8';
const TAWK_WIDGET_ID = '1jvqhf0gc';
const SCRIPT_ID = 'sky-bozum-tawk-chat';
const MOBILE_WIDGET_QUERY = '(max-width: 767px)';

type TawkApi = {
  maximize?: () => void;
  minimize?: () => void;
  onLoad?: () => void;
};

/** Loads the official Sky Bozum support widget once for the whole site. */
export default function TawkChat() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    const tawkWindow = window as typeof window & { Tawk_API?: TawkApi };
    const mobileViewport = window.matchMedia(MOBILE_WIDGET_QUERY);
    tawkWindow.Tawk_API = tawkWindow.Tawk_API || {};

    const syncWidgetSize = () => {
      if (mobileViewport.matches) {
        tawkWindow.Tawk_API?.minimize?.();
        return;
      }

      tawkWindow.Tawk_API?.maximize?.();
    };

    tawkWindow.Tawk_API.onLoad = () => {
      window.setTimeout(syncWidgetSize, 350);
    };
    mobileViewport.addEventListener('change', syncWidgetSize);

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);

    return () => {
      mobileViewport.removeEventListener('change', syncWidgetSize);
    };
  }, []);

  return null;
}
