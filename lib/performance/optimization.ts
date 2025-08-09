import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface PerformanceMetrics {
  responseTime: number
  memoryUsage: number
  cpuUsage: number
  cacheHitRate: number
}

interface CacheConfig {
  ttl: number // Time to live in seconds
  tags: string[]
  revalidate?: number
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private cache = new Map<string, { data: any; expires: number; tags: string[] }>()
  private metrics: PerformanceMetrics = {
    responseTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    cacheHitRate: 0,
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  // Intelligent caching with tags for invalidation
  async cache<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig
  ): Promise<T> {
    const now = Date.now()
    const cached = this.cache.get(key)

    // Return cached data if valid
    if (cached && cached.expires > now) {
      this.updateCacheHitRate(true)
      return cached.data
    }

    // Fetch fresh data
    const startTime = performance.now()
    const data = await fetcher()
    const endTime = performance.now()

    // Cache the result
    this.cache.set(key, {
      data,
      expires: now + (config.ttl * 1000),
      tags: config.tags,
    })

    this.updateCacheHitRate(false)
    this.updateResponseTime(endTime - startTime)

    return data
  }

  // Invalidate cache by tags
  invalidateCacheByTags(tags: string[]): void {
    for (const [key, value] of this.cache.entries()) {
      if (value.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key)
      }
    }
  }

  // Clear expired cache entries
  cleanupCache(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (value.expires <= now) {
        this.cache.delete(key)
      }
    }
  }

  // Database query optimization
  async optimizeQuery<T>(
    query: () => Promise<T>,
    options: {
      timeout?: number
      retry?: number
      cacheKey?: string
      cacheTtl?: number
    } = {}
  ): Promise<T> {
    const {
      timeout = 5000,
      retry = 2,
      cacheKey,
      cacheTtl = 300, // 5 minutes default
    } = options

    // Use cache if key provided
    if (cacheKey) {
      return this.cache(
        cacheKey,
        query,
        { ttl: cacheTtl, tags: ['database'] }
      )
    }

    // Implement timeout and retry logic
    let lastError: Error
    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        return await Promise.race([
          query(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Query timeout')), timeout)
          ),
        ])
      } catch (error) {
        lastError = error as Error
        if (attempt < retry) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }

    throw lastError!
  }

  // Image optimization helpers
  getOptimizedImageUrl(
    originalUrl: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'avif' | 'jpeg' | 'png'
    } = {}
  ): string {
    const { width, height, quality = 80, format = 'webp' } = options

    // If using Supabase Storage, add transformation parameters
    if (originalUrl.includes('supabase')) {
      const url = new URL(originalUrl)
      if (width) url.searchParams.set('width', width.toString())
      if (height) url.searchParams.set('height', height.toString())
      url.searchParams.set('quality', quality.toString())
      url.searchParams.set('format', format)
      return url.toString()
    }

    // For other sources, return original (could integrate with other services)
    return originalUrl
  }

  // Bundle size optimization
  async loadComponentDynamically<T>(
    componentLoader: () => Promise<{ default: T }>
  ): Promise<T> {
    try {
      const module = await componentLoader()
      return module.default
    } catch (error) {
      console.error('Dynamic component loading failed:', error)
      throw error
    }
  }

  // Performance monitoring
  private updateResponseTime(time: number): void {
    this.metrics.responseTime = (this.metrics.responseTime + time) / 2
  }

  private updateCacheHitRate(hit: boolean): void {
    const current = this.metrics.cacheHitRate
    this.metrics.cacheHitRate = hit ? current + 0.1 : Math.max(0, current - 0.1)
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Critical resource preloading
  preloadCriticalResources(): string[] {
    return [
      // Preload critical fonts
      '<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>',
      // Preload critical images
      '<link rel="preload" href="/images/hero-bg.webp" as="image" type="image/webp">',
      // Preload critical API endpoints
      '<link rel="preload" href="/api/categories" as="fetch" crossorigin>',
      // DNS prefetch for external domains
      '<link rel="dns-prefetch" href="//fonts.googleapis.com">',
      '<link rel="dns-prefetch" href="//images.unsplash.com">',
    ]
  }

  // Service Worker registration for offline support
  generateServiceWorkerScript(): string {
    return `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
              console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
              console.log('SW registration failed: ', registrationError);
            });
        });
      }
    `
  }
}

// Middleware for performance monitoring
export async function performanceMiddleware(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = performance.now()
  const optimizer = PerformanceOptimizer.getInstance()

  try {
    const response = await handler()
    const endTime = performance.now()
    const responseTime = endTime - startTime

    // Log performance metrics
    await logPerformanceMetrics({
      endpoint: request.nextUrl.pathname,
      method: request.method,
      responseTime: Math.round(responseTime),
      statusCode: response.status,
      userAgent: request.headers.get('user-agent') || '',
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || '',
    })

    // Add performance headers
    response.headers.set('X-Response-Time', `${responseTime.toFixed(2)}ms`)
    response.headers.set('X-Cache-Status', 'MISS') // Could be enhanced based on cache usage

    return response
  } catch (error) {
    const endTime = performance.now()
    const responseTime = endTime - startTime

    console.error('Performance monitoring error:', error)

    // Log error metrics
    await logPerformanceMetrics({
      endpoint: request.nextUrl.pathname,
      method: request.method,
      responseTime: Math.round(responseTime),
      statusCode: 500,
      userAgent: request.headers.get('user-agent') || '',
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || '',
    })

    throw error
  }
}

async function logPerformanceMetrics(metrics: {
  endpoint: string
  method: string
  responseTime: number
  statusCode: number
  userAgent: string
  ipAddress: string
}) {
  try {
    const supabase = createSupabaseServerClient()
    
    await supabase.from('performance_metrics').insert({
      endpoint: metrics.endpoint,
      method: metrics.method,
      response_time_ms: metrics.responseTime,
      status_code: metrics.statusCode,
      user_agent: metrics.userAgent.slice(0, 500), // Truncate long user agents
      ip_address: metrics.ipAddress,
    })
  } catch (error) {
    // Don't let performance logging break the app
    console.error('Failed to log performance metrics:', error)
  }
}

// Core Web Vitals optimization
export class CoreWebVitalsOptimizer {
  // Largest Contentful Paint optimization
  static optimizeLCP(): string[] {
    return [
      // Preload LCP image
      '<link rel="preload" href="/images/hero-image.webp" as="image">',
      // Optimize font loading
      '<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>',
      // Remove render-blocking resources
      '<style>body{font-family:system-ui,-apple-system,sans-serif}</style>',
    ]
  }

  // First Input Delay optimization  
  static optimizeFID(): string {
    return `
      // Break up long tasks
      function yieldToMain() {
        return new Promise(resolve => {
          setTimeout(resolve, 0);
        });
      }

      // Optimize event handlers
      document.addEventListener('click', async function(e) {
        // Process critical work first
        await processClick(e);
        await yieldToMain();
        // Process non-critical work after yielding
        await processNonCriticalWork(e);
      }, { passive: true });
    `
  }

  // Cumulative Layout Shift optimization
  static optimizeCLS(): string[] {
    return [
      // Reserve space for images
      'img { aspect-ratio: attr(width) / attr(height); }',
      // Reserve space for ads/embeds
      '.ad-container { min-height: 250px; }',
      // Avoid layout shifts from fonts
      'body { font-display: swap; }',
    ]
  }
}

export default PerformanceOptimizer
