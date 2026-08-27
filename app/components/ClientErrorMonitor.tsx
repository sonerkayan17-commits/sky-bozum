'use client';

import { useEffect } from 'react';
import { reportClientError } from '../lib/client-error-reporting';

export default function ClientErrorMonitor() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => reportClientError({ kind: 'window-error', digest: `${event.message}:${event.lineno}:${event.colno}` });
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason instanceof Error ? `${event.reason.name}:${event.reason.message}` : String(event.reason ?? 'unknown-rejection');
      reportClientError({ kind: 'unhandled-rejection', digest: reason });
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);
  return null;
}
