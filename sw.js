// Tour Card service worker. Version 20261002083034
const CACHE = 'tour-card-20261002083034';
const FILES = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png', './intro.jpg'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Network first, so a new version shows up as soon as you are online; cached copy when offline.
// Videos are left to the browser (iPhone streams them in pieces); offline, the intro shows its still image instead.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (/\.(mp4|webm)$/.test(url.pathname)) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok && url.origin === location.origin) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
