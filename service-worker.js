const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Dodaj inne pliki, które chcesz zbuforować
];

// Zdarzenie instalacji Service Workera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

// Zdarzenie aktywacji Service Workera
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName); // Usuwanie starych cache
          }
        })
      );
    })
  );
});

// Zdarzenie obsługi żądań (fetch)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jeśli plik znajduje się w cache, zwróć go
      if (response) {
        return response;
      }
      // Jeśli nie, pobierz go z sieci
      return fetch(event.request).then((response) => {
        // Sprawdź, czy odpowiedź jest prawidłowa (200)
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Skopiuj odpowiedź, aby móc ją dodać do cache
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache); // Zapisz odpowiedź w cache
        });

        return response;
      });
    })
  );
});
