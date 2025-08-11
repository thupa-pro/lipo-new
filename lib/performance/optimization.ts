"use client"

import { unstable_cache } from 'next/cache'
import { cache } from 'react'

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Start performance monitoring
  startMonitoring() {
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    this.observeWebVitals()
    
    // Monitor navigation timing
    this.observeNavigation()
    
    // Monitor resource loading
    this.observeResources()
    
    // Monitor long tasks
    this.observeLongTasks()
    
    // Monitor layout shifts
    this.observeLayoutShifts()
  }

  private observeWebVitals() {
    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime)
        }
      })
    })
    fcpObserver.observe({ type: 'paint', buffered: true })
    this.observers.set('fcp', fcpObserver)

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric('LCP', lastEntry.startTime)
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    this.observers.set('lcp', lcpObserver)

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime)
      })
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
    this.observers.set('fid', fidObserver)
  }

  private observeNavigation() {
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        // DNS lookup time
        this.recordMetric('DNS', entry.domainLookupEnd - entry.domainLookupStart)
        
        // TCP connection time
        this.recordMetric('TCP', entry.connectEnd - entry.connectStart)
        
        // TLS handshake time
        if (entry.secureConnectionStart > 0) {
          this.recordMetric('TLS', entry.connectEnd - entry.secureConnectionStart)
        }
        
        // Time to First Byte (TTFB)
        this.recordMetric('TTFB', entry.responseStart - entry.requestStart)
        
        // Download time
        this.recordMetric('Download', entry.responseEnd - entry.responseStart)
        
        // DOM processing time
        this.recordMetric('DOMProcessing', entry.domComplete - entry.domLoading)
      })
    })
    navigationObserver.observe({ type: 'navigation', buffered: true })
    this.observers.set('navigation', navigationObserver)
  }

  private observeResources() {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        // Categorize resources
        const resourceType = entry.initiatorType || 'other'
        const loadTime = entry.responseEnd - entry.startTime
        
        this.recordMetric(`Resource-${resourceType}`, loadTime)
        
        // Track large resources
        if (entry.transferSize > 100000) { // > 100KB
          this.recordMetric('LargeResource', loadTime)
        }
      })
    })
    resourceObserver.observe({ type: 'resource', buffered: true })
    this.observers.set('resource', resourceObserver)
  }

  private observeLongTasks() {
    if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          this.recordMetric('LongTask', entry.duration)
        })
      })
      longTaskObserver.observe({ type: 'longtask', buffered: true })
      this.observers.set('longtask', longTaskObserver)
    }
  }

  private observeLayoutShifts() {
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          this.recordMetric('CLS', entry.value)
        }
      })
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
    this.observers.set('cls', clsObserver)
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, value)
    }
  }

  private sendToAnalytics(name: string, value: number) {
    // Send to your analytics service
    if (typeof window !== 'undefined' && 'navigator' in window && 'sendBeacon' in navigator) {
      const data = JSON.stringify({
        metric: name,
        value: value,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
      
      navigator.sendBeacon('/api/performance/web-vitals', data)
    }
  }

  getMetrics(): Record<string, number[]> {
    return Object.fromEntries(this.metrics)
  }

  getAverageMetric(name: string): number | null {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return null
    
    return values.reduce((sum, value) => sum + value, 0) / values.length
  }

  stopMonitoring() {
    this.observers.forEach((observer) => {
      observer.disconnect()
    })
    this.observers.clear()
  }
}

// Hybrid caching strategies
export const createHybridCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    revalidate?: number
    tags?: string[]
    clientTTL?: number
  } = {}
) => {
  // Server-side caching with unstable_cache
  const serverCache = unstable_cache(
    async () => {
      return await fetcher()
    },
    [key],
    {
      revalidate: options.revalidate,
      tags: options.tags
    }
  )

  // Client-side caching with React cache
  const clientCache = cache(async () => {
    if (typeof window !== 'undefined') {
      // Check if data exists in client cache
      const cached = sessionStorage.getItem(`cache:${key}`)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        const age = Date.now() - timestamp
        const ttl = options.clientTTL || 60000 // 1 minute default
        
        if (age < ttl) {
          return data
        }
      }
    }

    // Fetch fresh data
    const data = await fetcher()
    
    // Store in client cache
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`cache:${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    }
    
    return data
  })

  return {
    server: serverCache,
    client: clientCache,
    invalidate: () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`cache:${key}`)
      }
    }
  }
}

// Preloading utilities for ultra-fast navigation
export class PreloadManager {
  private static preloadedRoutes = new Set<string>()
  private static preloadedData = new Map<string, any>()

  static preloadRoute(href: string) {
    if (this.preloadedRoutes.has(href)) return
    
    // Preload the route
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
    
    this.preloadedRoutes.add(href)
  }

  static preloadData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.preloadedData.has(key)) {
      return Promise.resolve(this.preloadedData.get(key))
    }
    
    const promise = fetcher()
    promise.then(data => {
      this.preloadedData.set(key, data)
    })
    
    return promise
  }

  static getPreloadedData<T>(key: string): T | null {
    return this.preloadedData.get(key) || null
  }

  static clearPreloadedData(key?: string) {
    if (key) {
      this.preloadedData.delete(key)
    } else {
      this.preloadedData.clear()
    }
  }
}

// Resource hints for better performance
export const addResourceHints = () => {
  if (typeof document === 'undefined') return

  const head = document.head

  // DNS prefetch for external domains
  const dnsPrefetch = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.stripe.com'
  ]

  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    head.appendChild(link)
  })

  // Preconnect to critical resources
  const preconnect = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]

  preconnect.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = url
    link.crossOrigin = 'anonymous'
    head.appendChild(link)
  })
}

// Critical CSS inlining utility
export const inlineCriticalCSS = (css: string) => {
  if (typeof document === 'undefined') return

  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

// Image optimization utilities
export const optimizeImage = (
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'auto'
  } = {}
) => {
  const { width, height, quality = 75, format = 'auto' } = options
  
  // Use Next.js Image Optimization API
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())
  
  // Auto-detect best format based on browser support
  if (format === 'auto') {
    if (typeof window !== 'undefined') {
      // Check for AVIF support
      const canvas = document.createElement('canvas')
      const avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
      
      if (avifSupported) {
        params.set('f', 'avif')
      } else {
        // Check for WebP support
        const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
        if (webpSupported) {
          params.set('f', 'webp')
        }
      }
    }
  } else {
    params.set('f', format)
  }
  
  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`
}

// Bundle splitting utilities
export const dynamicImport = <T>(
  importFn: () => Promise<T>,
  options: {
    loading?: React.ComponentType
    error?: React.ComponentType<{ error: Error; retry: () => void }>
    delay?: number
  } = {}
) => {
  return import('next/dynamic').then(({ default: dynamic }) => 
    dynamic(importFn as any, {
      loading: options.loading,
      ssr: false,
      ...options
    })
  )
}

// Service Worker utilities for advanced caching
export const registerServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw-enhanced.js')
      console.log('Service Worker registered:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

// Network-aware loading
export const getNetworkInfo = () => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    }
  }
  return null
}

// Adaptive loading based on network conditions
export const shouldLoadResource = (sizeMB: number) => {
  const network = getNetworkInfo()
  if (!network) return true
  
  // Don't load large resources on slow connections
  if (network.effectiveType === 'slow-2g' || network.effectiveType === '2g') {
    return sizeMB < 0.5 // Only load resources smaller than 500KB
  }
  
  if (network.effectiveType === '3g') {
    return sizeMB < 2 // Only load resources smaller than 2MB
  }
  
  // Load data saver mode
  if (network.saveData) {
    return sizeMB < 1 // Only load resources smaller than 1MB
  }
  
  return true
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  const monitor = PerformanceMonitor.getInstance()
  monitor.startMonitoring()
  
  // Add resource hints
  addResourceHints()
  
  // Register service worker
  registerServiceWorker()
}
