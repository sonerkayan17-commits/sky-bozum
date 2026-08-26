'use client';

import { useEffect } from 'react';
import { reportClientError } from '../lib/client-error-reporting';

export default function ClientErrorMonitor() {
  useEffect(() => {
    const onError = () => reportClientError({ kind: 'window-error' });
    const onUnhandledRejection = () => reportClientError({ kind: 'unhandled-rejection' });
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);
  return null;
}
