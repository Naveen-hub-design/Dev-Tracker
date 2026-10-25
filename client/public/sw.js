/**
 * DevTrack PWA Service Worker
 * Provides offline caching for static app shell and offline fallbacks for recently viewed API data.
 */

const CACHE_STATIC_NAME = 'devtrack-static-v1';
const CACHE_API_NAME = 'devtrack-api-v1';

const STATIC_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

// Install: Cache core shell and immediately activate
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      return cache.addAll(STATIC_SHELL_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Prune stale caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_API_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 1. API Requests: Network-First with Offline Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_API_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline JSON message
          return new Response(
            JSON.stringify({
              offline: true,
              message: 'You are currently offline. Showing cached DevTrack data.',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        })
    );
    return;
  }

  // 2. Static Assets & App Shell: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_STATIC_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed, if navigating to HTML return root /
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html') || caches.match('/');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
