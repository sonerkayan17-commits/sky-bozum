'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { deferClientTask } from '../lib/defer-client-task';

const TAWK_PROPERTY_ID = '69fa97b6b2c8791c30a70ea8';
const TAWK_WIDGET_ID = '1jvqhf0gc';
const SCRIPT_ID = 'sky-bozum-tawk-chat';
type TawkApi = {
  hideWidget?: () => void; showWidget?: () => void; maximize?: () => void; minimize?: () => void;
  onLoad?: () => void; onChatMaximized?: () => void; onChatMinimized?: () => void;
};

/** Keeps live support available without placing the third-party bundle on the critical path. */
export default function TawkChat() {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const openRequested = useRef(false);

  const configureApi = useCallback(() => {
    const tawkWindow = window as typeof window & { Tawk_API?: TawkApi };
    tawkWindow.Tawk_API = tawkWindow.Tawk_API || {};
    tawkWindow.Tawk_API.onLoad = () => {
      setIsReady(true);
      if (openRequested.current) {
        tawkWindow.Tawk_API?.showWidget?.();
        tawkWindow.Tawk_API?.maximize?.();
        setIsOpen(true);
      } else {
        tawkWindow.Tawk_API?.hideWidget?.();
      }
    };
    tawkWindow.Tawk_API.onChatMaximized = () => setIsOpen(true);
    tawkWindow.Tawk_API.onChatMinimized = () => {
      setIsOpen(false);
      openRequested.current = false;
      tawkWindow.Tawk_API?.hideWidget?.();
    };
    return tawkWindow;
  }, []);

  const loadChat = useCallback(() => {
    const tawkWindow = configureApi();
    if (document.getElementById(SCRIPT_ID)) {
      if (tawkWindow.Tawk_API?.maximize) setIsReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
  }, [configureApi]);

  useEffect(() => deferClientTask(loadChat, { delay: 90_000, intentEvents: false }), [loadChat]);

  useEffect(() => {
    setIsOpen(false);
    openRequested.current = false;
    const tawkWindow = window as typeof window & { Tawk_API?: TawkApi };
    tawkWindow.Tawk_API?.minimize?.();
    tawkWindow.Tawk_API?.hideWidget?.();
  }, [pathname]);

  function openChat() {
    openRequested.current = true;
    const tawkWindow = configureApi();
    if (!isReady) {
      loadChat();
      return;
    }
    tawkWindow.Tawk_API?.showWidget?.();
    tawkWindow.Tawk_API?.maximize?.();
    setIsOpen(true);
  }

  if (isOpen) return null;
  return (
    <button type="button" className="tawk-compact-launcher" onClick={openChat} aria-label="Canlı destek sohbetini aç">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 18.5 4 20l1-3.9A8 8 0 1 1 7.5 18.5Z" /><path strokeLinecap="round" d="M8 11.5h8M8 8.5h5" /></svg>
      <span>Destek</span><i aria-hidden="true" />
    </button>
  );
}
