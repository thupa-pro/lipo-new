// Mobile-Optimized Service Worker for Loconomy
// Advanced features: intelligent caching, background sync, push notifications, performance monitoring

const CACHE_VERSION = 'mobile-v2.1.0'
const CACHE_NAMES = {
  STATIC: `${CACHE_VERSION}-static`,
  DYNAMIC: `${CACHE_VERSION}-dynamic`,
  IMAGES: `${CACHE_VERSION}-images`,
  API: `${CACHE_VERSION}-api`,
  FONTS: `${CACHE_VERSION}-fonts`,
  CRITICAL: `${CACHE_VERSION}-critical`
}

const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
}

// Critical resources that should always be cached
const CRITICAL_RESOURCES = [
  '/',
  '/offline',
  '/manifest.json',
  '/_next/static/css/',
  '/_next/static/chunks/framework',
  '/_next/static/chunks/main',
  '/_next/static/chunks/webpack'
]

// Mobile-specific optimizations
const MOBILE_CONFIG = {
  imageQuality: 85,
  enableWebP: true,
  lazyLoadThreshold: 50, // pixels
  prefetchPriority: 3, // number of resources to prefetch
  batteryOptimization: true,
  adaptiveLoading: true,
  compressionLevel: 6
}

// Performance monitoring
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  backgroundSyncs: 0,
  pushNotifications: 0,
  averageResponseTime: 0,
  totalRequests: 0
}

// Device capabilities detection
let deviceCapabilities = {
  online: true,
  batteryLevel: 1,
  networkSpeed: 'fast',
  memoryInfo: null,
  connectionType: 'unknown'
}

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('[SW Mobile] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAMES.CRITICAL).then(cache => {
        return cache.addAll(CRITICAL_RESOURCES.map(url => {
          return new Request(url, { cache: 'reload' })
        }))
      }),
      caches.open(CACHE_NAMES.STATIC).then(cache => {
        return cache.addAll([
          '/favicon.ico',
          '/icon-192.png',
          '/icon-512.png'
        ])
      })
    ]).then(() => {
      console.log('[SW Mobile] Critical resources cached')
      self.skipWaiting()
    }).catch(err => {
      console.error('[SW Mobile] Failed to cache critical resources:', err)
    })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('[SW Mobile] Activating service worker...')
  
  event.waitUntil(
    Promise.all([
      // Cleanup old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!Object.values(CACHE_NAMES).includes(cacheName)) {
              console.log('[SW Mobile] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Initialize device capabilities
      initializeDeviceCapabilities(),
      // Setup background sync
      setupBackgroundSync(),
      // Setup push notifications
      setupPushNotifications(),
      // Claim clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW Mobile] Service worker activated successfully')
    })
  )
})

// Fetch event - intelligent request handling
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests for caching
  if (request.method !== 'GET') {
    return
  }
  
  // Skip cross-origin requests (unless specifically configured)
  if (url.origin !== self.location.origin && !shouldHandleCrossOrigin(url)) {
    return
  }
  
  performanceMetrics.totalRequests++
  const startTime = performance.now()
  
  event.respondWith(
    handleRequest(request, url)
      .then(response => {
        const responseTime = performance.now() - startTime
        updatePerformanceMetrics(responseTime, response)
        return response
      })
      .catch(error => {
        console.error('[SW Mobile] Request failed:', error)
        return handleRequestError(request, error)
      })
  )
})

// Intelligent request handling based on resource type and device capabilities
async function handleRequest(request, url) {
  const pathname = url.pathname
  const searchParams = url.searchParams
  
  // Determine caching strategy based on resource type
  let strategy = CACHE_STRATEGIES.STALE_WHILE_REVALIDATE
  let cacheName = CACHE_NAMES.DYNAMIC
  
  if (pathname.startsWith('/_next/static/')) {
    strategy = CACHE_STRATEGIES.CACHE_FIRST
    cacheName = CACHE_NAMES.STATIC
  } else if (pathname.startsWith('/api/')) {
    strategy = deviceCapabilities.online ? CACHE_STRATEGIES.NETWORK_FIRST : CACHE_STRATEGIES.CACHE_ONLY
    cacheName = CACHE_NAMES.API
  } else if (isImageRequest(pathname)) {
    strategy = CACHE_STRATEGIES.CACHE_FIRST
    cacheName = CACHE_NAMES.IMAGES
    
    // Mobile image optimization
    if (MOBILE_CONFIG.enableWebP && supportsWebP()) {
      request = optimizeImageRequest(request)
    }
  } else if (isFontRequest(pathname)) {
    strategy = CACHE_STRATEGIES.CACHE_FIRST
    cacheName = CACHE_NAMES.FONTS
  } else if (CRITICAL_RESOURCES.some(resource => pathname.startsWith(resource))) {
    strategy = CACHE_STRATEGIES.CACHE_FIRST
    cacheName = CACHE_NAMES.CRITICAL
  }
  
  // Apply adaptive loading based on device capabilities
  if (MOBILE_CONFIG.adaptiveLoading) {
    strategy = adaptStrategyForDevice(strategy)
  }
  
  return executeStrategy(strategy, request, cacheName)
}

// Execute caching strategy
async function executeStrategy(strategy, request, cacheName) {
  const cache = await caches.open(cacheName)
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(cache, request)
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(cache, request)
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(cache, request)
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request)
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cache.match(request) || createOfflineResponse(request)
    
    default:
      return networkFirst(cache, request)
  }
}

// Cache First strategy
async function cacheFirst(cache, request) {
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    performanceMetrics.cacheHits++
    
    // Background update for long-lived resources
    if (shouldBackgroundUpdate(request)) {
      event.waitUntil(
        fetch(request)
          .then(response => {
            if (response.ok) {
              cache.put(request, response.clone())
            }
          })
          .catch(() => {}) // Silently fail background updates
      )
    }
    
    return cachedResponse
  }
  
  performanceMetrics.cacheMisses++
  const networkResponse = await fetch(request)
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone())
  }
  
  return networkResponse
}

// Network First strategy
async function networkFirst(cache, request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone())
      performanceMetrics.cacheMisses++
    }
    
    return networkResponse
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      performanceMetrics.cacheHits++
      return cachedResponse
    }
    
    throw error
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(cache, request) {
  const cachedResponse = await cache.match(request)
  
  // Always attempt to update in background
  const networkPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => {}) // Silently fail background updates
  
  if (cachedResponse) {
    performanceMetrics.cacheHits++
    
    // Update in background
    event.waitUntil(networkPromise)
    
    return cachedResponse
  }
  
  // No cache, wait for network
  performanceMetrics.cacheMisses++
  return networkPromise
}

// Mobile-specific optimizations
function optimizeImageRequest(request) {
  const url = new URL(request.url)
  
  // Add mobile optimization parameters
  if (MOBILE_CONFIG.enableWebP && supportsWebP()) {
    url.searchParams.set('format', 'webp')
  }
  
  url.searchParams.set('quality', MOBILE_CONFIG.imageQuality)
  
  // Adaptive sizing based on device
  if (deviceCapabilities.networkSpeed === 'slow') {
    url.searchParams.set('width', '800') // Smaller images on slow connections
  }
  
  return new Request(url.toString(), {
    headers: request.headers,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer
  })
}

// Adapt strategy based on device capabilities
function adaptStrategyForDevice(strategy) {
  // Battery optimization
  if (MOBILE_CONFIG.batteryOptimization && deviceCapabilities.batteryLevel < 0.2) {
    if (strategy === CACHE_STRATEGIES.NETWORK_FIRST) {
      return CACHE_STRATEGIES.CACHE_FIRST
    }
  }
  
  // Network optimization
  if (deviceCapabilities.networkSpeed === 'slow') {
    if (strategy === CACHE_STRATEGIES.STALE_WHILE_REVALIDATE) {
      return CACHE_STRATEGIES.CACHE_FIRST
    }
  }
  
  // Memory optimization
  if (deviceCapabilities.memoryInfo && deviceCapabilities.memoryInfo.jsHeapSizeLimit < 1000000000) { // < 1GB
    // Prioritize cache for low-memory devices
    if (strategy === CACHE_STRATEGIES.NETWORK_FIRST) {
      return CACHE_STRATEGIES.CACHE_FIRST
    }
  }
  
  return strategy
}

// Background Sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW Mobile] Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  } else if (event.tag === 'offline-actions') {
    event.waitUntil(syncOfflineActions())
  } else if (event.tag === 'analytics') {
    event.waitUntil(syncAnalytics())
  }
})

async function doBackgroundSync() {
  try {
    performanceMetrics.backgroundSyncs++
    
    // Sync offline actions
    await syncOfflineActions()
    
    // Update critical resources
    await updateCriticalResources()
    
    // Preload predicted content
    await preloadPredictedContent()
    
    console.log('[SW Mobile] Background sync completed successfully')
  } catch (error) {
    console.error('[SW Mobile] Background sync failed:', error)
    throw error
  }
}

// Push Notifications
self.addEventListener('push', event => {
  console.log('[SW Mobile] Push notification received')
  
  if (!event.data) {
    return
  }
  
  const data = event.data.json()
  performanceMetrics.pushNotifications++
  
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    image: data.image,
    data: data.data,
    actions: data.actions,
    tag: data.tag,
    renotify: data.renotify,
    requireInteraction: data.requireInteraction,
    silent: data.silent,
    timestamp: Date.now(),
    vibrate: data.vibrate || [200, 100, 200]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('[SW Mobile] Notification clicked')
  
  event.notification.close()
  
  const data = event.notification.data || {}
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Try to focus existing window
        for (let client of clientList) {
          if (client.url === data.url && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(data.url || '/')
        }
      })
  )
})

// Message handling for communication with clients
self.addEventListener('message', event => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'UPDATE_DEVICE_CAPABILITIES':
      deviceCapabilities = { ...deviceCapabilities, ...payload }
      break
    
    case 'CACHE_RESOURCE':
      event.waitUntil(cacheResource(payload.url, payload.cacheName))
      break
    
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache(payload.cacheName))
      break
    
    case 'GET_PERFORMANCE_METRICS':
      event.ports[0].postMessage({ type: 'PERFORMANCE_METRICS', data: performanceMetrics })
      break
    
    case 'PREFETCH_RESOURCES':
      event.waitUntil(prefetchResources(payload.urls))
      break
    
    default:
      console.log('[SW Mobile] Unknown message type:', type)
  }
})

// Utility functions
function isImageRequest(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(pathname)
}

function isFontRequest(pathname) {
  return /\.(woff|woff2|ttf|otf|eot)$/i.test(pathname)
}

function shouldHandleCrossOrigin(url) {
  const allowedOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net'
  ]
  
  return allowedOrigins.some(origin => url.href.startsWith(origin))
}

function shouldBackgroundUpdate(request) {
  const url = new URL(request.url)
  
  // Update static assets in background
  if (url.pathname.startsWith('/_next/static/')) {
    return true
  }
  
  // Update API responses every 5 minutes
  if (url.pathname.startsWith('/api/')) {
    return true
  }
  
  return false
}

function supportsWebP() {
  // Check if WebP is supported (simplified check)
  return true // Modern mobile browsers support WebP
}

async function createOfflineResponse(request) {
  const url = new URL(request.url)
  
  if (url.pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This request requires an internet connection',
        cached: false
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  // Serve offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlineCache = await caches.open(CACHE_NAMES.CRITICAL)
    return offlineCache.match('/offline') || new Response('Offline', { status: 503 })
  }
  
  return new Response('Resource not available offline', { status: 503 })
}

function handleRequestError(request, error) {
  console.error('[SW Mobile] Request error:', error)
  return createOfflineResponse(request)
}

function updatePerformanceMetrics(responseTime, response) {
  const totalTime = performanceMetrics.averageResponseTime * (performanceMetrics.totalRequests - 1)
  performanceMetrics.averageResponseTime = (totalTime + responseTime) / performanceMetrics.totalRequests
  
  if (response && response.status >= 200 && response.status < 300) {
    if (response.headers.get('X-Cache') === 'HIT') {
      performanceMetrics.cacheHits++
    }
  }
}

async function initializeDeviceCapabilities() {
  try {
    // Battery API
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery()
      deviceCapabilities.batteryLevel = battery.level
    }
    
    // Network Information API
    if ('connection' in navigator) {
      const connection = navigator.connection
      deviceCapabilities.networkSpeed = getNetworkSpeed(connection.effectiveType)
      deviceCapabilities.connectionType = connection.type
    }
    
    // Memory API
    if ('memory' in performance) {
      deviceCapabilities.memoryInfo = performance.memory
    }
    
    console.log('[SW Mobile] Device capabilities initialized:', deviceCapabilities)
  } catch (error) {
    console.error('[SW Mobile] Failed to initialize device capabilities:', error)
  }
}

function getNetworkSpeed(effectiveType) {
  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return 'slow'
    case '3g':
      return 'medium'
    case '4g':
    case '5g':
      return 'fast'
    default:
      return 'unknown'
  }
}

async function setupBackgroundSync() {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    console.log('[SW Mobile] Background sync supported')
  }
}

async function setupPushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('[SW Mobile] Push notifications supported')
  }
}

async function syncOfflineActions() {
  try {
    // Retrieve offline actions from IndexedDB
    const actions = await getOfflineActions()
    
    for (const action of actions) {
      try {
        await executeOfflineAction(action)
        await removeOfflineAction(action.id)
      } catch (error) {
        console.error('[SW Mobile] Failed to sync offline action:', error)
      }
    }
  } catch (error) {
    console.error('[SW Mobile] Failed to sync offline actions:', error)
  }
}

async function updateCriticalResources() {
  const cache = await caches.open(CACHE_NAMES.CRITICAL)
  
  for (const resource of CRITICAL_RESOURCES) {
    try {
      const response = await fetch(resource)
      if (response.ok) {
        await cache.put(resource, response)
      }
    } catch (error) {
      console.error('[SW Mobile] Failed to update critical resource:', resource, error)
    }
  }
}

async function preloadPredictedContent() {
  try {
    // Get predicted content from the main thread
    const clients = await self.clients.matchAll()
    
    for (const client of clients) {
      client.postMessage({ type: 'REQUEST_PREDICTED_CONTENT' })
    }
  } catch (error) {
    console.error('[SW Mobile] Failed to preload predicted content:', error)
  }
}

async function cacheResource(url, cacheName) {
  try {
    const cache = await caches.open(cacheName || CACHE_NAMES.DYNAMIC)
    const response = await fetch(url)
    
    if (response.ok) {
      await cache.put(url, response)
    }
  } catch (error) {
    console.error('[SW Mobile] Failed to cache resource:', url, error)
  }
}

async function clearCache(cacheName) {
  try {
    if (cacheName) {
      await caches.delete(cacheName)
    } else {
      // Clear all caches
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    }
  } catch (error) {
    console.error('[SW Mobile] Failed to clear cache:', error)
  }
}

async function prefetchResources(urls) {
  const cache = await caches.open(CACHE_NAMES.DYNAMIC)
  
  for (const url of urls.slice(0, MOBILE_CONFIG.prefetchPriority)) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        await cache.put(url, response)
      }
    } catch (error) {
      console.error('[SW Mobile] Failed to prefetch resource:', url, error)
    }
  }
}

// Placeholder functions for offline action handling
async function getOfflineActions() {
  // Implementation would retrieve from IndexedDB
  return []
}

async function executeOfflineAction(action) {
  // Implementation would execute the offline action
  console.log('[SW Mobile] Executing offline action:', action)
}

async function removeOfflineAction(actionId) {
  // Implementation would remove from IndexedDB
  console.log('[SW Mobile] Removing offline action:', actionId)
}

async function syncAnalytics() {
  // Implementation would sync analytics data
  console.log('[SW Mobile] Syncing analytics data')
}

console.log('[SW Mobile] Service Worker loaded successfully')
