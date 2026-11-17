// Keeps the app's own files available offline. Requests to the server are never cached.
const CACHE = 'ap-202611170557';
const FILES = ['./', 'index.html', 'app.css', 'app.js', 'config.js', 'guard.js', 'icon-192.png', 'manifest.webmanifest', 'img/logo-intl.webp', 'img/mark-intl.webp', 'img/logo-priv.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
