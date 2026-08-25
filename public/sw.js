const CACHE_NAME = 'sky-bozum-safe-shell-v1';
const SAFE_SHELL = ['/offline', '/brand-logo.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SAFE_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.mode !== 'navigate') return;

  // Financial, account and admin pages are never cached. When offline, the
  // user receives an explicit safe screen instead of stale balances or stock.
  event.respondWith(fetch(request).catch(() => caches.match('/offline')));
});
