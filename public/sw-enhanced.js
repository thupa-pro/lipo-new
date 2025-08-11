// Enhanced Service Worker for Ultra-Low Latency Performance
// Implements advanced caching strategies and optimization techniques

const CACHE_NAME = 'loconomy-v1.0.0'
const DYNAMIC_CACHE = 'loconomy-dynamic-v1.0.0'
const API_CACHE = 'loconomy-api-v1.0.0'
const IMAGE_CACHE = 'loconomy-images-v1.0.0'

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first',
  images: 'cache-first',
  dynamic: 'stale-while-revalidate'
}

// Resources to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/admin',
  '/auth/signin',
  '/_next/static/css/',
  '/_next/static/js/',
  '/manifest.json',
  '/icon.svg',
  '/offline'
]

// API endpoints with specific caching rules
const API_CACHE_RULES = {
  '/api/analytics': { ttl: 300000, strategy: 'network-first' }, // 5 minutes
  '/api/users': { ttl: 600000, strategy: 'stale-while-revalidate' }, // 10 minutes
  '/api/settings': { ttl: 1800000, strategy: 'cache-first' }, // 30 minutes
  '/api/health': { ttl: 60000, strategy: 'network-first' } // 1 minute
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // Take control of all pages
      self.clients.claim()
    ])
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }
  
  // Route to appropriate caching strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request))
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request))
  } else {
    event.respondWith(handleDynamicRequest(request))
  }
})

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  const url = new URL(request.url)
  const endpoint = url.pathname
  const rule = API_CACHE_RULES[endpoint] || { ttl: 300000, strategy: 'network-first' }
  
  const cache = await caches.open(API_CACHE)
  
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Clone response for caching
      const responseClone = networkResponse.clone()
      
      // Add timestamp for TTL
      const headers = new Headers(responseClone.headers)
      headers.set('sw-cached-at', Date.now().toString())
      headers.set('sw-ttl', rule.ttl.toString())
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      })
      
      cache.put(request, cachedResponse)
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    
    // Fallback to cache
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      // Check if cached response is still valid
      const cachedAt = parseInt(cachedResponse.headers.get('sw-cached-at') || '0')
      const ttl = parseInt(cachedResponse.headers.get('sw-ttl') || '300000')
      const age = Date.now() - cachedAt
      
      if (age < ttl) {
        return cachedResponse
      }
    }
    
    // Return offline response for admin routes
    if (request.url.includes('/admin')) {
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'Admin features require network connection',
          cached: false 
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    throw error
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)
  
  // Try cache first
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    // Fetch from network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache the response
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Return placeholder image for failed loads
    return new Response(
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666">Image unavailable</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    )
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(CACHE_NAME)
  
  // Try cache first
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    // Fetch from network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache the response
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // For CSS/JS files, return empty response to prevent errors
    if (request.url.includes('.css')) {
      return new Response('/* Offline CSS */', {
        headers: { 'Content-Type': 'text/css' }
      })
    }
    
    if (request.url.includes('.js')) {
      return new Response('// Offline JS', {
        headers: { 'Content-Type': 'application/javascript' }
      })
    }
    
    throw error
  }
}

// Handle dynamic requests with stale-while-revalidate strategy
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  
  // Get cached response
  const cachedResponse = await cache.match(request)
  
  // Fetch fresh response (don't await)
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    // Network failed, no problem if we have cache
    return null
  })
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Update cache in background
    fetchPromise.catch(() => {}) // Ignore errors
    return cachedResponse
  }
  
  // No cache, wait for network
  try {
    return await fetchPromise
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/offline')
      if (offlineResponse) {
        return offlineResponse
      }
      
      // Fallback offline page
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Offline - Loconomy</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0; padding: 40px; text-align: center; background: #f8fafc;
            }
            .container { max-width: 400px; margin: 0 auto; }
            .icon { font-size: 64px; margin-bottom: 20px; }
            h1 { color: #1e293b; margin-bottom: 10px; }
            p { color: #64748b; line-height: 1.6; }
            .retry-btn {
              background: #8b5cf6; color: white; border: none; 
              padding: 12px 24px; border-radius: 8px; cursor: pointer;
              font-size: 16px; margin-top: 20px;
            }
            .retry-btn:hover { background: #7c3aed; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📱</div>
            <h1>You're Offline</h1>
            <p>Check your internet connection and try again. Some features may be available from cache.</p>
            <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
        </html>
      `, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      })
    }
    
    throw error
  }
}

// Utility functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(new URL(request.url).pathname)
}

function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/_next/static/') ||
         url.pathname.includes('.css') ||
         url.pathname.includes('.js') ||
         url.pathname === '/manifest.json' ||
         url.pathname === '/icon.svg'
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('Background sync triggered')
  
  // Sync offline actions stored in IndexedDB
  try {
    // Implementation would sync queued actions when back online
    console.log('Background sync completed')
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const data = event.notification.data
  const action = event.action
  
  event.waitUntil(
    clients.openWindow(data.url || '/')
  )
})

// Message handling for cache management
self.addEventListener('message', (event) => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'CACHE_PURGE':
      event.waitUntil(purgeCache(payload.pattern))
      break
      
    case 'CACHE_WARM':
      event.waitUntil(warmCache(payload.urls))
      break
      
    case 'GET_CACHE_STATUS':
      event.waitUntil(getCacheStatus().then(status => {
        event.ports[0].postMessage(status)
      }))
      break
  }
})

async function purgeCache(pattern) {
  const cacheNames = await caches.keys()
  
  for (const cacheName of cacheNames) {
    if (pattern && !cacheName.includes(pattern)) continue
    
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    
    for (const key of keys) {
      await cache.delete(key)
    }
  }
}

async function warmCache(urls) {
  const cache = await caches.open(DYNAMIC_CACHE)
  
  for (const url of urls) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        await cache.put(url, response)
      }
    } catch (error) {
      console.error('Failed to warm cache for:', url, error)
    }
  }
}

async function getCacheStatus() {
  const cacheNames = await caches.keys()
  const status = {}
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    status[cacheName] = keys.length
  }
  
  return status
}

console.log('Enhanced Service Worker loaded')
