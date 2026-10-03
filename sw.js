/* Guitar — service worker, same policy as the Exercise Library's sw.js:
   network-first for HTML/JS/CSS (a deploy never pairs a new page with an old module),
   cache-first for images and the manifest. Bump CACHE on every deploy. */
const CACHE = 'guitar-v1';
const PRECACHE = [
  './', './index.html', './manifest.webmanifest',
  './shared/app.css', './shared/sync.js', './app.js',
  './shared/fonts/archivo-latin.woff2', './shared/fonts/figtree-latin.woff2',
  './icon-180.png', './icon-192.png', './icon-512.png', './favicon.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  const isCode = /\.(js|css|json)$/.test(url.pathname);
  if (isHTML || isCode) {
    const fresh = isHTML ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : new Request(req, { cache: 'no-cache' });
    event.respondWith(fetch(fresh).then((resp) => { const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); return resp; })
      .catch(() => caches.match(req).then((m) => m || (isHTML ? caches.match('./index.html') : undefined))));
    return;
  }
  event.respondWith(caches.match(req).then((m) => m || fetch(req).then((resp) => { if (resp && resp.ok) { const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); } return resp; })));
});
