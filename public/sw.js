const CACHE_NAME = 'loconomy-pwa-v3.0';
const RUNTIME = 'runtime-v3.0';
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/browse',
  '/dashboard',
  '/messages',
  '/static/js/app.js',
  '/static/css/app.css',
  '/manifest.json'
];

// Advanced caching strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Route patterns and their caching strategies
const ROUTE_CACHE_CONFIG = {
  // Static assets - Cache First
  '/_next/static/': CACHE_STRATEGIES.CACHE_FIRST,
  '/icons/': CACHE_STRATEGIES.CACHE_FIRST,
  '/images/': CACHE_STRATEGIES.CACHE_FIRST,
  
  // API routes - Network First with fallback
  '/api/': CACHE_STRATEGIES.NETWORK_FIRST,
  
  // Pages - Stale While Revalidate
  '/': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  '/browse': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  '/dashboard': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  
  // Dynamic content - Network First
  '/provider/': CACHE_STRATEGIES.NETWORK_FIRST,
  '/booking/': CACHE_STRATEGIES.NETWORK_FIRST
};

// Advanced features
let isOnline = navigator.onLine;
let backgroundSyncRegistration = null;
let notificationPermission = null;

// Install event - Precache resources
self.addEventListener('install', event => {
  console.log('🚀 PWA Service Worker v3.0 installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('📦 Precaching resources...');
        return cache.addAll(PRECACHE_URLS);
      }),
      // Skip waiting to update immediately
      self.skipWaiting(),
      // Initialize advanced features
      initializeAdvancedFeatures()
    ])
  );
});

// Activate event - Clean up and take control
self.addEventListener('activate', event => {
  console.log('✅ PWA Service Worker v3.0 activated');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim(),
      // Setup background sync
      setupBackgroundSync(),
      // Request notification permission
      requestNotificationPermission()
    ])
  );
});

// Fetch event - Advanced caching with intelligent routing
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests for caching
  if (request.method !== 'GET') {
    return handleNonGetRequest(event);
  }
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  const strategy = getCacheStrategy(url.pathname);
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      event.respondWith(cacheFirst(request));
      break;
    case CACHE_STRATEGIES.NETWORK_FIRST:
      event.respondWith(networkFirst(request));
      break;
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      event.respondWith(staleWhileRevalidate(request));
      break;
    case CACHE_STRATEGIES.NETWORK_ONLY:
      // Let browser handle
      break;
    case CACHE_STRATEGIES.CACHE_ONLY:
      event.respondWith(cacheOnly(request));
      break;
    default:
      event.respondWith(staleWhileRevalidate(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-bookings') {
    event.waitUntil(syncBookings());
  } else if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages());
  } else if (event.tag === 'background-sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Push notifications
self.addEventListener('push', event => {
  console.log('📱 Push notification received');
  
  const options = {
    body: 'You have a new message from a service provider',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Message',
        icon: '/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icons/action-close.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.message || options.body;
      options.data = { ...options.data, ...data };
    } catch (error) {
      console.warn('Failed to parse push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Loconomy', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'explore') {
    event.waitUntil(
      clients.openWindow('/messages')
    );
  } else if (action === 'close') {
    // Just close notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Message handling for client communication
self.addEventListener('message', event => {
  console.log('💬 Message received from client:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'CACHE_URLS':
        event.waitUntil(cacheUrls(event.data.payload));
        break;
      case 'CLEAR_CACHE':
        event.waitUntil(clearCache());
        break;
      case 'GET_CACHE_STATUS':
        event.waitUntil(sendCacheStatus(event));
        break;
      case 'SYNC_DATA':
        event.waitUntil(triggerBackgroundSync(event.data.tag));
        break;
    }
  }
});

// Online/offline handling
self.addEventListener('online', () => {
  console.log('🌐 App is online');
  isOnline = true;
  broadcastNetworkStatus(true);
  triggerBackgroundSync('background-sync-all');
});

self.addEventListener('offline', () => {
  console.log('📴 App is offline');
  isOnline = false;
  broadcastNetworkStatus(false);
});

// Caching strategies implementation
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return getOfflineFallback(request);
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(RUNTIME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(RUNTIME);
    const cached = await cache.match(request);
    return cached || getOfflineFallback(request);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  
  // Get from cache immediately
  const cached = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  // Return cached version or wait for network
  return cached || fetchPromise;
}

async function cacheOnly(request) {
  const cache = await caches.open(CACHE_NAME);
  return await cache.match(request) || getOfflineFallback(request);
}

// Helper functions
function getCacheStrategy(pathname) {
  for (const [pattern, strategy] of Object.entries(ROUTE_CACHE_CONFIG)) {
    if (pathname.startsWith(pattern)) {
      return strategy;
    }
  }
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
}

async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // For HTML pages, return offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match('/offline') || new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>You're Offline - Loconomy</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 2rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            }
            .offline-container {
              background: rgba(255,255,255,0.1);
              backdrop-filter: blur(10px);
              padding: 3rem;
              border-radius: 20px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            }
            h1 { font-size: 2.5rem; margin-bottom: 1rem; }
            p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
            button {
              background: #7C3AED;
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: 10px;
              font-size: 1.1rem;
              cursor: pointer;
              transition: all 0.3s;
            }
            button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <h1>🌐 You're Offline</h1>
            <p>Don't worry! You can still browse cached content and your data will sync when you're back online.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // For API requests, return offline data
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({
      offline: true,
      message: 'This data will be synced when you\'re back online',
      cached: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // For images, return placeholder
  if (request.headers.get('accept')?.includes('image/')) {
    return new Response(
      `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666">
          📴 Offline
        </text>
      </svg>`,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  return new Response('Offline', { status: 503 });
}

async function handleNonGetRequest(event) {
  const { request } = event;
  
  // For POST requests when offline, queue for background sync
  if (!isOnline && request.method === 'POST') {
    event.respondWith(
      queueForBackgroundSync(request).then(() => {
        return new Response(JSON.stringify({
          queued: true,
          message: 'Request queued for when you\'re back online'
        }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
  }
}

// Advanced PWA features
async function initializeAdvancedFeatures() {
  console.log('🔧 Initializing advanced PWA features...');
  
  // Setup periodic background sync
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    console.log('✅ Background Sync supported');
  }
  
  // Setup push notifications
  if ('PushManager' in window) {
    console.log('✅ Push Notifications supported');
  }
  
  // Setup file handling
  if ('launchQueue' in window) {
    console.log('✅ File Handling supported');
  }
}

async function setupBackgroundSync() {
  try {
    await self.registration.sync.register('background-sync-all');
    console.log('✅ Background sync registered');
  } catch (error) {
    console.warn('❌ Background sync registration failed:', error);
  }
}

async function requestNotificationPermission() {
  if ('Notification' in self) {
    notificationPermission = await self.registration.pushManager.permissionState();
    console.log('🔔 Notification permission:', notificationPermission);
  }
}

async function syncBookings() {
  console.log('🔄 Syncing bookings...');
  // Implement booking sync logic
  try {
    const queuedBookings = await getQueuedData('bookings');
    for (const booking of queuedBookings) {
      await fetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(booking),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    await clearQueuedData('bookings');
    console.log('✅ Bookings synced successfully');
  } catch (error) {
    console.error('❌ Booking sync failed:', error);
  }
}

async function syncMessages() {
  console.log('🔄 Syncing messages...');
  // Implement message sync logic
  try {
    const queuedMessages = await getQueuedData('messages');
    for (const message of queuedMessages) {
      await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(message),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    await clearQueuedData('messages');
    console.log('✅ Messages synced successfully');
  } catch (error) {
    console.error('❌ Message sync failed:', error);
  }
}

async function syncAnalytics() {
  console.log('🔄 Syncing analytics...');
  // Implement analytics sync logic
  try {
    const queuedAnalytics = await getQueuedData('analytics');
    if (queuedAnalytics.length > 0) {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        body: JSON.stringify({ analytics: queuedAnalytics, errors: [] }),
        headers: { 'Content-Type': 'application/json' }
      });
      await clearQueuedData('analytics');
      console.log('✅ Analytics synced successfully');
    }
  } catch (error) {
    console.error('❌ Analytics sync failed:', error);
  }
}

async function queueForBackgroundSync(request) {
  const data = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: await request.text()
  };
  
  const queue = await getQueuedData('requests') || [];
  queue.push(data);
  await saveQueuedData('requests', queue);
  
  // Register background sync
  await self.registration.sync.register('background-sync-requests');
}

async function getQueuedData(key) {
  try {
    const cache = await caches.open('offline-queue');
    const response = await cache.match(`/queue/${key}`);
    return response ? await response.json() : [];
  } catch (error) {
    console.warn('Failed to get queued data:', error);
    return [];
  }
}

async function saveQueuedData(key, data) {
  try {
    const cache = await caches.open('offline-queue');
    const response = new Response(JSON.stringify(data));
    await cache.put(`/queue/${key}`, response);
  } catch (error) {
    console.warn('Failed to save queued data:', error);
  }
}

async function clearQueuedData(key) {
  try {
    const cache = await caches.open('offline-queue');
    await cache.delete(`/queue/${key}`);
  } catch (error) {
    console.warn('Failed to clear queued data:', error);
  }
}

async function triggerBackgroundSync(tag) {
  try {
    await self.registration.sync.register(tag);
  } catch (error) {
    console.warn('Failed to trigger background sync:', error);
  }
}

function broadcastNetworkStatus(isOnline) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NETWORK_STATUS',
        isOnline: isOnline
      });
    });
  });
}

async function cacheUrls(urls) {
  const cache = await caches.open(RUNTIME);
  await cache.addAll(urls);
}

async function clearCache() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

async function sendCacheStatus(event) {
  const cacheSize = await getCacheSize();
  event.ports[0].postMessage({
    type: 'CACHE_STATUS',
    size: cacheSize,
    isOnline: isOnline
  });
}

async function getCacheSize() {
  let size = 0;
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        size += blob.size;
      }
    }
  }
  
  return size;
}

console.log('🚀 Loconomy PWA Service Worker v3.0 loaded with elite-grade features!');
