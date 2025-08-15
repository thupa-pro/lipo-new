const CACHE_NAME = 'omniservicehub-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';
const API_CACHE = 'api-v2.0';
const IMAGE_CACHE = 'images-v2.0';

// Cache strategies configuration
const CACHE_STRATEGIES = {
  static: {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    maxEntries: 100,
  },
  dynamic: {
    maxAge: 24 * 60 * 60, // 24 hours
    maxEntries: 50,
  },
  api: {
    maxAge: 5 * 60, // 5 minutes
    maxEntries: 100,
  },
  images: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    maxEntries: 200,
  }
};

// Network conditions detection
let connectionType = 'unknown';
let effectiveType = '4g';

if ('connection' in navigator) {
  const connection = navigator.connection;
  connectionType = connection.type || 'unknown';
  effectiveType = connection.effectiveType || '4g';
  
  connection.addEventListener('change', () => {
    connectionType = connection.type || 'unknown';
    effectiveType = connection.effectiveType || '4g';
  });
}

// Install event - precache static assets
self.addEventListener('install', event => {
  console.log('SW: Installing service worker v2.0');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll([
          '/',
          '/manifest.json',
          '/offline',
          // Add critical CSS and JS files here
        ]);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('SW: Activating service worker v2.0');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!Object.values({
              CACHE_NAME,
              STATIC_CACHE,
              DYNAMIC_CACHE,
              API_CACHE,
              IMAGE_CACHE
            }).includes(cacheName)) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Route requests to appropriate cache strategy
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(handleStaticAssets(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequests(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequests(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequests(request));
  } else {
    event.respondWith(handleDynamicRequests(request));
  }
});

// Strategy: Cache First for static assets
async function handleStaticAssets(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('SW: Static asset fetch failed:', error);
    return new Response('Asset not found', { status: 404 });
  }
}

// Strategy: Network First with cache fallback for API
async function handleApiRequests(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    // Try network first for fresh data
    const response = await fetch(request);
    
    if (response.status === 200) {
      // Cache successful responses
      const responseClone = response.clone();
      
      // Implement cache expiry
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      cache.put(request, cachedResponse);
    }
    
    return response;
  } catch (error) {
    console.log('SW: Network failed, trying cache for API request');
    
    // Fallback to cache
    const cached = await cache.match(request);
    if (cached) {
      // Check if cache is still valid
      const cacheTime = cached.headers.get('sw-cached');
      if (cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        if (age < CACHE_STRATEGIES.api.maxAge * 1000) {
          return cached;
        }
      }
    }
    
    // Return offline response if no cache
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This request requires an internet connection'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Strategy: Cache First for images with network fallback
async function handleImageRequests(request) {
  const cache = await caches.open(IMAGE_CACHE);
  
  try {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    
    if (response.status === 200) {
      // Only cache images on fast connections to save bandwidth
      if (shouldCacheOnNetwork()) {
        cache.put(request, response.clone());
      }
    }
    
    return response;
  } catch (error) {
    console.log('SW: Image fetch failed, checking cache');
    
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Return placeholder image
    return new Response(
      '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image unavailable</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Strategy: Network First for navigation with cache fallback
async function handleNavigationRequests(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('SW: Navigation network failed, trying cache');
    
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Fallback to offline page
    const offlineResponse = await cache.match('/offline');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Ultimate fallback
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - OmniServiceHub</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: system-ui, sans-serif; text-align: center; padding: 2rem;">
          <h1>You're offline</h1>
          <p>Please check your internet connection and try again.</p>
          <button onclick="window.location.reload()">Retry</button>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Strategy: Stale While Revalidate for dynamic content
async function handleDynamicRequests(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const cached = await cache.match(request);
    
    // Serve from cache immediately if available
    if (cached) {
      // Revalidate in background
      fetch(request).then(response => {
        if (response.status === 200) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignore revalidation errors
      });
      
      return cached;
    }
    
    // No cache, fetch from network
    const response = await fetch(request);
    
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('SW: Dynamic request failed');
    
    // Try cache as last resort
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    return new Response('Request failed', { status: 503 });
  }
}

// Helper functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(new URL(request.url).pathname);
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function shouldCacheOnNetwork() {
  // Don't cache large resources on slow connections
  return effectiveType === '4g' || effectiveType === '3g';
}

// Background sync for failed requests
self.addEventListener('sync', event => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'api-retry') {
    event.waitUntil(retryFailedApiRequests());
  }
});

async function retryFailedApiRequests() {
  // Implement retry logic for failed API requests
  console.log('SW: Retrying failed API requests');
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from OmniServiceHub',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icon-check.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('OmniServiceHub', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('SW: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(cacheUrls(event.data.payload));
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearCache(event.data.payload));
  }
});

async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  await cache.addAll(urls);
}

async function clearCache(cacheKey) {
  if (cacheKey) {
    await caches.delete(cacheKey);
  } else {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }
}

// Periodic cache cleanup
setInterval(async () => {
  await cleanupExpiredCache();
}, 60 * 60 * 1000); // Every hour

async function cleanupExpiredCache() {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const cacheTime = response.headers.get('sw-cached');
      
      if (cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        const maxAge = getMaxAgeForCache(cacheName);
        
        if (age > maxAge * 1000) {
          await cache.delete(request);
        }
      }
    }
  }
}

function getMaxAgeForCache(cacheName) {
  if (cacheName.includes('static')) return CACHE_STRATEGIES.static.maxAge;
  if (cacheName.includes('api')) return CACHE_STRATEGIES.api.maxAge;
  if (cacheName.includes('images')) return CACHE_STRATEGIES.images.maxAge;
  return CACHE_STRATEGIES.dynamic.maxAge;
}

console.log('SW: Service Worker v2.0 loaded');
