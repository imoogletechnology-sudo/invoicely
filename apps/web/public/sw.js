// Invoicely Service Worker
const CACHE_NAME = "invoicely-v1";
const STATIC_ASSETS = [
  "/",
  "/create/invoice",
  "/official/invoicely-logo.png",
  "/official/logo-icon.png",
];

// Install: pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail for assets that can't be cached
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first strategy for pages, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip API routes and auth
  if (request.url.includes("/api/")) return;

  // For navigation requests, use network-first
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match("/");
        });
      })
    );
    return;
  }

  // For static assets, use cache-first
  if (
    request.url.includes("/fonts/") ||
    request.url.includes("/official/") ||
    request.url.includes("/social/")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        });
      })
    );
  }
});
