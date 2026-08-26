'use client';

type ClientErrorReport = {
  kind: 'window-error' | 'unhandled-rejection' | 'page-boundary' | 'global-boundary';
  digest?: string;
  route?: string;
};

export function reportClientError(report: ClientErrorReport) {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  const body = JSON.stringify({
    kind: report.kind,
    digest: report.digest?.slice(0, 120),
    route: (report.route || window.location.pathname).slice(0, 240),
    occurredAt: new Date().toISOString(),
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 12),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/client-errors', new Blob([body], { type: 'application/json' }));
      return;
    }
    void fetch('/api/client-errors', {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/json' },
      keepalive: true,
    });
  } catch {
    // Hata raporlama hiçbir zaman ziyaretçi deneyimini kesmemelidir.
  }
}
