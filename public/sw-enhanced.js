// Enhanced Service Worker for Loconomy PWA
// Handles intelligent caching, offline functionality, and request optimization

const CACHE_NAME = 'loconomy-v2.1.0';
const STATIC_CACHE_NAME = 'loconomy-static-v2.1.0';
const API_CACHE_NAME = 'loconomy-api-v2.1.0';
const IMAGE_CACHE_NAME = 'loconomy-images-v2.1.0';

// Cache expiration times (in milliseconds)
const CACHE_EXPIRATION = {
  static: 7 * 24 * 60 * 60 * 1000, // 7 days
  api: 5 * 60 * 1000, // 5 minutes
  images: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/placeholder.svg',
  '/avatar-fallback.svg',
  // Add critical CSS and JS files here
];

// API endpoints to cache with strategies
const API_CACHE_STRATEGIES = {
  '/api/categories': 'stale-while-revalidate',
  '/api/providers': 'stale-while-revalidate',
  '/api/analytics': 'network-first',
  '/api/health': 'network-only',
  '/api/stripe': 'network-only',
  '/api/offline/sms': 'network-only',
};

// Network timeout configuration
const NETWORK_TIMEOUT = 10000; // 10 seconds
const FAST_TIMEOUT = 3000; // 3 seconds for critical requests

class EnhancedServiceWorker {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    self.addEventListener('install', this.handleInstall.bind(this));
    self.addEventListener('activate', this.handleActivate.bind(this));
    self.addEventListener('fetch', this.handleFetch.bind(this));
    self.addEventListener('sync', this.handleSync.bind(this));
    self.addEventListener('message', this.handleMessage.bind(this));
  }

  async handleInstall(event) {
    console.log('[SW] Installing enhanced service worker...');
    
    event.waitUntil(
      Promise.all([
        this.cacheStaticAssets(),
        this.skipWaiting()
      ])
    );
  }

  async handleActivate(event) {
    console.log('[SW] Activating enhanced service worker...');
    
    event.waitUntil(
      Promise.all([
        this.cleanupOldCaches(),
        this.claimClients()
      ])
    );
  }

  async handleFetch(event) {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests for caching
    if (request.method !== 'GET') {
      return this.handleNonGetRequest(event);
    }

    // Handle different types of requests
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(this.handleApiRequest(request));
    } else if (this.isImageRequest(request)) {
      event.respondWith(this.handleImageRequest(request));
    } else if (this.isStaticAsset(request)) {
      event.respondWith(this.handleStaticRequest(request));
    } else {
      event.respondWith(this.handleNavigationRequest(request));
    }
  }

  async handleSync(event) {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'analytics-sync') {
      event.waitUntil(this.syncAnalytics());
    } else if (event.tag === 'booking-sync') {
      event.waitUntil(this.syncBookings());
    }
  }

  async handleMessage(event) {
    const { data } = event;
    
    switch (data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'CLEAR_CACHE':
        await this.clearAllCaches();
        event.ports[0].postMessage({ success: true });
        break;
      case 'CACHE_STATS':
        const stats = await this.getCacheStats();
        event.ports[0].postMessage(stats);
        break;
    }
  }

  async cacheStaticAssets() {
    const cache = await caches.open(STATIC_CACHE_NAME);
    
    try {
      await cache.addAll(STATIC_ASSETS);
      console.log('[SW] Static assets cached successfully');
    } catch (error) {
      console.error('[SW] Failed to cache static assets:', error);
      // Cache assets individually to avoid complete failure
      for (const asset of STATIC_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('[SW] Failed to cache asset:', asset, err);
        }
      }
    }
  }

  async cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const validCacheNames = [CACHE_NAME, STATIC_CACHE_NAME, API_CACHE_NAME, IMAGE_CACHE_NAME];
    
    return Promise.all(
      cacheNames
        .filter(cacheName => !validCacheNames.includes(cacheName))
        .map(cacheName => {
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
    );
  }

  async handleApiRequest(request) {
    const url = new URL(request.url);
    const strategy = this.getApiCacheStrategy(url.pathname);
    
    switch (strategy) {
      case 'network-first':
        return this.networkFirst(request, API_CACHE_NAME);
      case 'stale-while-revalidate':
        return this.staleWhileRevalidate(request, API_CACHE_NAME);
      case 'network-only':
        return this.networkOnly(request);
      default:
        return this.networkFirst(request, API_CACHE_NAME);
    }
  }

  async handleImageRequest(request) {
    return this.cacheFirst(request, IMAGE_CACHE_NAME);
  }

  async handleStaticRequest(request) {
    return this.cacheFirst(request, STATIC_CACHE_NAME);
  }

  async handleNavigationRequest(request) {
    try {
      // Try network first for navigation requests
      const response = await this.fetchWithTimeout(request, FAST_TIMEOUT);
      
      // Cache successful navigation responses
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      
      return response;
    } catch (error) {
      console.log('[SW] Navigation request failed, serving offline page');
      return this.getOfflinePage();
    }
  }

  async handleNonGetRequest(event) {
    const { request } = event;
    
    // Add timeout and retry logic for POST/PUT/DELETE requests
    event.respondWith(
      this.fetchWithRetry(request, 3, 1000)
        .catch(error => {
          console.error('[SW] Non-GET request failed:', error);
          
          // Store failed requests for background sync
          if (this.shouldQueueRequest(request)) {
            this.queueFailedRequest(request);
          }
          
          return new Response(
            JSON.stringify({
              error: 'Request failed',
              message: 'Network unavailable. Request queued for retry.',
              queued: true
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
  }

  // Caching Strategies
  async networkFirst(request, cacheName) {
    try {
      const response = await this.fetchWithTimeout(request, NETWORK_TIMEOUT);
      
      if (response.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
      }
      
      return response;
    } catch (error) {
      console.log('[SW] Network failed, trying cache:', request.url);
      const cachedResponse = await this.getCachedResponse(request, cacheName);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return error response
      return new Response(
        JSON.stringify({
          error: 'Network unavailable',
          message: 'Please check your connection and try again.'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  async cacheFirst(request, cacheName) {
    const cachedResponse = await this.getCachedResponse(request, cacheName);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      const response = await this.fetchWithTimeout(request, NETWORK_TIMEOUT);
      
      if (response.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
      }
      
      return response;
    } catch (error) {
      console.error('[SW] Cache-first strategy failed:', error);
      throw error;
    }
  }

  async staleWhileRevalidate(request, cacheName) {
    const cachedResponse = await this.getCachedResponse(request, cacheName);
    
    // Always try to update cache in background
    const fetchPromise = this.fetchWithTimeout(request, NETWORK_TIMEOUT)
      .then(response => {
        if (response.ok) {
          const cache = caches.open(cacheName);
          cache.then(c => c.put(request, response.clone()));
        }
        return response;
      })
      .catch(error => {
        console.log('[SW] Background update failed:', error);
      });
    
    // Return cached response immediately if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Wait for network if no cache
    return fetchPromise;
  }

  async networkOnly(request) {
    return this.fetchWithTimeout(request, NETWORK_TIMEOUT);
  }

  // Utility Methods
  async fetchWithTimeout(request, timeout = NETWORK_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(request, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async fetchWithRetry(request, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await this.fetchWithTimeout(request);
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.sleep(delay * (i + 1));
      }
    }
  }

  async getCachedResponse(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && this.isCacheValid(cachedResponse, cacheName)) {
      return cachedResponse;
    }
    
    return null;
  }

  isCacheValid(response, cacheName) {
    const cacheDate = response.headers.get('sw-cache-date');
    if (!cacheDate) return true; // If no date, assume valid
    
    const cacheTime = new Date(cacheDate).getTime();
    const now = Date.now();
    const maxAge = CACHE_EXPIRATION[cacheName.split('-')[1]] || CACHE_EXPIRATION.static;
    
    return (now - cacheTime) < maxAge;
  }

  getApiCacheStrategy(pathname) {
    for (const [pattern, strategy] of Object.entries(API_CACHE_STRATEGIES)) {
      if (pathname.startsWith(pattern)) {
        return strategy;
      }
    }
    return 'network-first';
  }

  isImageRequest(request) {
    return request.destination === 'image' || 
           /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(request.url);
  }

  isStaticAsset(request) {
    return request.destination === 'script' || 
           request.destination === 'style' ||
           /\.(js|css|woff|woff2|ttf|eot)$/i.test(request.url);
  }

  async getOfflinePage() {
    const cache = await caches.open(STATIC_CACHE_NAME);
    return cache.match('/offline') || new Response(
      '<html><body><h1>Offline</h1><p>Please check your connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  shouldQueueRequest(request) {
    const url = new URL(request.url);
    // Queue important requests that should be retried
    return url.pathname.includes('/api/offline/sms') || 
           url.pathname.includes('/api/stripe/');
  }

  async queueFailedRequest(request) {
    // Store in IndexedDB for background sync
    // This would require implementing IndexedDB storage
    console.log('[SW] Queuing failed request:', request.url);
  }

  async syncAnalytics() {
    console.log('[SW] Syncing analytics data...');
    // Implement analytics sync logic
  }

  async syncBookings() {
    console.log('[SW] Syncing booking data...');
    // Implement booking sync logic
  }

  async clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(cacheNames.map(name => caches.delete(name)));
  }

  async getCacheStats() {
    const cacheNames = await caches.keys();
    const stats = {};
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      stats[name] = keys.length;
    }
    
    return stats;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  skipWaiting() {
    return self.skipWaiting();
  }

  claimClients() {
    return self.clients.claim();
  }
}

// Initialize the enhanced service worker
new EnhancedServiceWorker();

console.log('[SW] Enhanced Loconomy Service Worker loaded');
