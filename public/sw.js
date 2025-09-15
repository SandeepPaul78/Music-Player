const CACHE_NAME = 'music-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/index.css',
  // Apne sabhi assets (images, fonts, songs, etc.) yahan add kijiye
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
