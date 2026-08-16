const localPreviewHosts = new Set(['127.0.0.1', 'localhost']);

export function isLocalMotionPreview(hostname: string) {
  return localPreviewHosts.has(hostname);
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  if (isLocalMotionPreview(window.location.hostname)) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
