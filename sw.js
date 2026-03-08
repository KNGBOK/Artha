const CACHE_NAME = 'artha-v2';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Always go to network for API calls
  if (event.request.url.includes('generativelanguage.googleapis.com') ||
      event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('cdnjs.cloudflare.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  // Cache-first for app shell
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
