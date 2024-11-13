const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
    '/index.html',
    '/odia-calendar.html',
    '/holiday-calendar.html',
    '/css/holiday-style.css',
    '/css/odia-style.css',
    '/css/style.css',
    '/js/holiday-script.js',
    '/js/odia-script.js',
    '/image/calendar-banner.jpg',
    '/image/calendar.png',
    '/image/calendar2.png',
    '/image/facebook.png',
    '/image/github.png',
    '/image/home.png',
    '/image/insta.png',
    '/image/jagannath.png',
    '/image/sandeep3.png',
    '/image/telegram.png',
    '/image/translate.png',
    '/image/whatsapp.png'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Return from cache
                }
                return fetch(event.request); // Fetch from network if not in cache
            })
    );
});

// Activate event (optional cleanup)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Delete old caches
                    }
                })
            );
        })
    );
});
