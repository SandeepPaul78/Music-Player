const CACHE_NAME = 'music-app-v1';
const staticAssets = [
  '/',
  '/index.html',
  '/index.js',
  '/index.css',
  '/Assets/cover.jpg',  // Static assets yahan likhein
];

// Install: Static files ko cache karein
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(staticAssets);
      })
  );
});

// Fetch: Dynamic caching for ALL songs in `/song/` (any album)
self.addEventListener('fetch', event => {
  // Check if the request is for a song inside `/song/` folder
  if (event.request.url.includes('/song/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;  // Cache se serve karein
          }
          // Fetch and cache the song
          return fetch(event.request)
            .then(fetchResponse => {
              if (!fetchResponse || fetchResponse.status !== 200) {
                return fetchResponse;  // Agar fetch fail ho
              }
              // Cache mein store karein
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
              return fetchResponse;
            })
            .catch(() => {
              return new Response('Network error: Could not load song');
            });
        })
    );
  } else {
    // Baki sab requests ke liye normal caching
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});
