// HribShade — Service Worker
// Cache-first for everything so the app works with zero connectivity
// once the app shell and the tiles for your area have been downloaded.

const SHELL_CACHE = 'mtloop-shell-v1';
const TILE_CACHE = 'mtloop-tiles-v1';

const SHELL_FILES = [
  './',
  './index.html',
  './maplibre-gl.js',
  './maplibre-gl.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Hosts that serve map/elevation tiles — cached in the long-lived TILE_CACHE
const TILE_HOSTS = [
  'basemap.nationalmap.gov',
  's3.amazonaws.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== TILE_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch { return; }

  const isTile = TILE_HOSTS.includes(url.host);
  const cacheName = isTile ? TILE_CACHE : SHELL_CACHE;

  event.respondWith(
    caches.open(cacheName).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const resp = await fetch(req);
        if (resp && resp.ok) cache.put(req, resp.clone());
        return resp;
      } catch (err) {
        // Offline and not cached — nothing we can do for this one tile/file.
        if (cached) return cached;
        throw err;
      }
    })
  );
});
