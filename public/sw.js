const CACHE_NAME = 'loconomy-v1.0.0';
const STATIC_CACHE = 'loconomy-static-v1.0.0';
const DYNAMIC_CACHE = 'loconomy-dynamic-v1.0.0';
const API_CACHE = 'loconomy-api-v1.0.0';

// App Shell - Critical resources for offline functionality
const SHELL_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/health',
  '/api/categories',
  '/api/providers',
];

// Network-first resources (always fresh when online)
const NETWORK_FIRST = [
  '/api/users',
  '/api/payments',
  '/api/bookings',
  '/api/messages',
];

// Cache-first resources (performance priority)
const CACHE_FIRST = [
  '/browse',
  '/how-it-works',
  '/about',
  '/blog',
];

// Stale-while-revalidate resources
const STALE_WHILE_REVALIDATE = [
  '/dashboard',
  '/profile',
  '/settings',
];

// Install Event - Cache critical resources
self.addEventListener('install', (event) => {
  console.log('SW: Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('SW: Caching app shell');
        return cache.addAll(SHELL_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch Event - Intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension URLs
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Static assets (CSS, JS, images)
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Default: Network first with cache fallback
  event.respondWith(handleDefault(request));
});

// Handle API requests with intelligent caching
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const cache = await caches.open(API_CACHE);
  
  // Network-first for critical APIs
  if (NETWORK_FIRST.some(path => url.pathname.startsWith(path))) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.log('SW: Network failed, trying cache for:', url.pathname);
      const cached = await cache.match(request);
      return cached || createOfflineResponse();
    }
  }
  
  // Cache-first for stable APIs
  const cached = await cache.match(request);
  if (cached) {
    // Background update
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return createOfflineResponse();
  }
}

// Handle navigation requests with app shell
async function handleNavigationRequest(request) {
  const url = new URL(request.url);
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // Check if we have a cached version
  const cached = await cache.match(request);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache successful navigations
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('SW: Navigation failed, using cache or offline page');
    
    // Return cached version if available
    if (cached) {
      return cached;
    }
    
    // Return app shell for SPA routes
    const shellResponse = await caches.match('/');
    if (shellResponse) {
      return shellResponse;
    }
    
    // Last resort: offline page
    return caches.match('/offline') || createOfflineResponse();
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('SW: Failed to fetch static asset:', request.url);
    return createOfflineResponse();
  }
}

// Default handler
async function handleDefault(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || createOfflineResponse();
  }
}

// Utility functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/);
}

function createOfflineResponse() {
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'You are currently offline. Please check your connection.',
      timestamp: new Date().toISOString()
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-bookings') {
    event.waitUntil(syncBookings());
  }
  
  if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('SW: Push notification received');
  
  const options = {
    body: 'You have a new notification from Loconomy',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'loconomy-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      url: '/notifications',
      timestamp: Date.now()
    }
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      options.body = payload.body || options.body;
      options.title = payload.title || 'Loconomy';
      options.data.url = payload.url || options.data.url;
    } catch (e) {
      console.log('SW: Invalid push payload');
    }
  }

  event.waitUntil(
    self.registration.showNotification('Loconomy', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification clicked');
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'dismiss') {
    return;
  }
  
  const urlToOpen = data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Periodic Background Sync
self.addEventListener('periodicsync', (event) => {
  console.log('SW: Periodic sync triggered:', event.tag);
  
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Share Target Handler
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/share-target')) {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  const formData = await request.formData();
  const title = formData.get('title') || '';
  const text = formData.get('text') || '';
  const url = formData.get('url') || '';
  
  // Store shared data for the app to handle
  const sharedData = { title, text, url, timestamp: Date.now() };
  
  // You can store this in IndexedDB or send to your API
  console.log('SW: Shared data received:', sharedData);
  
  return Response.redirect('/dashboard?shared=true', 303);
}

// Sync functions
async function syncBookings() {
  console.log('SW: Syncing bookings...');
  // Implement offline booking sync logic
}

async function syncMessages() {
  console.log('SW: Syncing messages...');
  // Implement offline message sync logic
}

async function updateContent() {
  console.log('SW: Updating content in background...');
  // Implement background content updates
  
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = [
    '/',
    '/browse',
    '/dashboard',
    '/api/categories',
    '/api/providers'
  ];
  
  for (const url of requests) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response.clone());
      }
    } catch (error) {
      console.log('SW: Failed to update:', url);
    }
  }
}

// Cache size management
async function cleanupCaches() {
  const caches = await caches.keys();
  
  for (const cacheName of caches) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    if (requests.length > 100) { // Limit cache size
      const oldest = requests.slice(0, requests.length - 50);
      for (const request of oldest) {
        await cache.delete(request);
      }
    }
  }
}

// Periodic cleanup
setInterval(cleanupCaches, 24 * 60 * 60 * 1000); // Daily cleanup
