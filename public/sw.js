// Service Worker for Portfolio - Offline Support & Caching
const CACHE_NAME = 'portfolio-v1.0.0'
const STATIC_CACHE = 'portfolio-static-v1.0.0'
const DYNAMIC_CACHE = 'portfolio-dynamic-v1.0.0'

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/data/portfolio-en.json',
  '/data/portfolio-pt-PT.json',
  '/img/profile.jpg',
  '/favicon.ico'
]

// Static assets to cache
const STATIC_RESOURCES = [
  '/assets/index.css',
  '/assets/premium.css',
  '/assets/vendor.js',
  '/assets/utils.js',
  '/assets/components.js'
]

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching critical resources')
        return cache.addAll(CRITICAL_RESOURCES)
      })
      .then(() => {
        console.log('Critical resources cached successfully')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Failed to cache critical resources:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip non-HTTP(S) requests
  if (!url.protocol.startsWith('http')) {
    return
  }
  
  // Skip browser extensions and dev tools
  if (url.pathname.startsWith('/chrome-extension') || 
      url.pathname.startsWith('/devtools')) {
    return
  }
  
  // Handle different resource types with appropriate strategies
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (isDataFile(url.pathname)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  } else if (isHTMLPage(url.pathname)) {
    event.respondWith(networkFirst(request, STATIC_CACHE))
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  }
})

// Cache-first strategy for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('Cache-first strategy failed:', error)
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Network-first strategy for dynamic content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html')
    }
    
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Helper functions to determine resource types
function isStaticAsset(pathname) {
  return pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)
}

function isDataFile(pathname) {
  return pathname.includes('/data/') && pathname.endsWith('.json')
}

function isHTMLPage(pathname) {
  return pathname.endsWith('.html') || pathname === '/'
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Handle any pending offline actions
    console.log('Background sync completed')
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/img/profile.jpg',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})

console.log('Portfolio Service Worker loaded successfully')
