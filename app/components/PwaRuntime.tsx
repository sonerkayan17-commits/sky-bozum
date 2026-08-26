'use client';

import { useEffect } from 'react';

function defer(task: () => void) {
  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  };
  if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(task, { timeout: 2500 });
    return;
  }
  globalThis.setTimeout(task, 900);
}

export default function PwaRuntime() {
  useEffect(() => {
    defer(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => undefined);
      }
      if (process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_KEY?.trim()) {
        void import('../lib/firebase').then(({ initializeFirebaseAppCheck }) => initializeFirebaseAppCheck());
      }
    });
  }, []);

  return null;
}
