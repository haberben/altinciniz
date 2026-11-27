// Minimal pass-through Service Worker for PWA installability (no stale price caching)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Always let network handle requests so live gold/currency prices stay real-time
  if (event.request.method !== 'GET') return;
});
