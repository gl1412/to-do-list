const CACHE_NAME = 'to-do-pwa-cache-v1';
const FILES_TO_CACHE = [
    '/to-do-list/',
    '/to-do-list /index.html',
    '/to-do-list /style.css',
    '/to-do-list /app.js',
    '/to-do-list /manifest.json',
    '/to-do-list /icons/icon-128.png',
    '/to-do-list /icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});