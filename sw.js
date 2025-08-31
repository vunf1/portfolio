// Minimal Service Worker for Portfolio
const CACHE_NAME = 'portfolio-v2';

// Install event - only cache essential files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened');
                // Only cache the main HTML file
                return cache.add('/index.html');
            })
            .catch(error => {
                console.log('Cache installation failed:', error);
            })
    );
});

// Fetch event - simple network-first strategy
self.addEventListener('fetch', event => {
    // Only handle HTML requests
    if (event.request.destination === 'document') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match('/index.html');
                })
        );
    }
    // For all other requests, just pass through
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
