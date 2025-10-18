// Service Worker de base pour PWA DaloaMarket
const CACHE_NAME = 'daloadmarket-cache-v2'; // Changez le nom à chaque build majeur
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.svg',
  '/apple-touch-icon.png',
  '/manifest.json',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  // Ajoutez ici d'autres ressources statiques si besoin
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Ne jamais intercepter les requêtes JS/CSS du build Vite (assets/)
  if (event.request.url.includes('/assets/')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // Optionnel : retourner une page offline personnalisée
        return caches.match('/index.html');
      });
    })
  );
});
