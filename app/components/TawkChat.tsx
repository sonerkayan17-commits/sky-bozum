'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const TAWK_PROPERTY_ID = '69fa97b6b2c8791c30a70ea8';
const TAWK_WIDGET_ID = '1jvqhf0gc';
const SCRIPT_ID = 'sky-bozum-tawk-chat';
type TawkApi = {
  hideWidget?: () => void;
  showWidget?: () => void;
  maximize?: () => void;
  minimize?: () => void;
  onLoad?: () => void;
  onChatMaximized?: () => void;
  onChatMinimized?: () => void;
};

/** Loads the official Sky Bozum support widget once for the whole site. */
export default function TawkChat() {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const tawkWindow = window as typeof window & { Tawk_API?: TawkApi };
    tawkWindow.Tawk_API = tawkWindow.Tawk_API || {};
    tawkWindow.Tawk_API.onLoad = () => {
      setIsReady(true);
      setIsOpen(false);
      window.setTimeout(() => tawkWindow.Tawk_API?.hideWidget?.(), 100);
    };
    tawkWindow.Tawk_API.onChatMaximized = () => setIsOpen(true);
    tawkWindow.Tawk_API.onChatMinimized = () => {
      setIsOpen(false);
      tawkWindow.Tawk_API?.hideWidget?.();
    };

    if (document.getElementById(SCRIPT_ID)) {
      setIsReady(true);
      tawkWindow.Tawk_API.hideWidget?.();
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    const tawkWindow = window as typeof window & { Tawk_API?: TawkApi };
    const hide = () => {
      tawkWindow.Tawk_API?.minimize?.();
      tawkWindow.Tawk_API?.hideWidget?.();
    };
    hide();
    const timers = [120, 600, 1400].map((delay) => window.setTimeout(hide, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [pathname]);

  function openChat() {
    const tawkWindow = window as typeof window & { Tawk_API?: TawkApi };
    tawkWindow.Tawk_API?.showWidget?.();
    tawkWindow.Tawk_API?.maximize?.();
    setIsOpen(true);
  }

  if (!isReady || isOpen) return null;

  return (
    <button type="button" className="tawk-compact-launcher" onClick={openChat} aria-label="Canlı destek sohbetini aç">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 18.5 4 20l1-3.9A8 8 0 1 1 7.5 18.5Z" /><path strokeLinecap="round" d="M8 11.5h8M8 8.5h5" /></svg>
      <span>Destek</span>
      <i aria-hidden="true" />
    </button>
  );
}
