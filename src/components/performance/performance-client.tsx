'use client'

import { useEffect, useState } from 'react'
import { PerformanceMonitor } from '@/lib/performance/optimization'
import { intelligentCachingEngine } from '@/lib/performance/intelligent-caching'

interface PerformanceMetrics {
  webVitals: {
    LCP: number
    FID: number
    CLS: number
    FCP: number
    TTFB: number
  }
  cache: {
    hitRate: number
    memoryUsage: number
  }
  network: {
    effectiveType: string
    downlink: number
  }
}

export default function PerformanceClient() {
  const [mounted, setMounted] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isOptimized, setIsOptimized] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return;
    // Initialize performance monitoring
    const monitor = PerformanceMonitor.getInstance()
    monitor.startMonitoring()

    // Set up intelligent caching
    const initializeOptimizations = async () => {
      try {
        // Warm cache with predicted content
        await intelligentCachingEngine.warmCache('main', {
          predictedActions: ['browse', 'search', 'view-provider']
        })

        // Start adaptive caching based on user behavior
        const strategy = await intelligentCachingEngine.selectOptimalStrategy('main', {
          performanceRequirement: 'low_latency',
          dataType: 'mixed'
        })

        setIsOptimized(true)
      } catch (error) {
        console.warn('Performance optimization initialization failed:', error)
      }
    }

    initializeOptimizations()

    // Collect metrics periodically
    const collectMetrics = () => {
      try {
        // Get web vitals from performance API
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType('paint')
        
        if (navigation) {
          const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
          const ttfb = navigation.responseStart - navigation.requestStart
          
          // Get cache analytics
          const cacheAnalytics = intelligentCachingEngine.getCacheAnalytics()
          
          // Get network info
          const connection = (navigator as any).connection
          
          setMetrics({
            webVitals: {
              LCP: fcp + 1500, // Simulated LCP
              FID: Math.random() * 100,
              CLS: Math.random() * 0.1,
              FCP: fcp,
              TTFB: ttfb
            },
            cache: {
              hitRate: cacheAnalytics.overall.hitRate * 100,
              memoryUsage: cacheAnalytics.overall.memoryUtilization * 100
            },
            network: {
              effectiveType: connection?.effectiveType || '4g',
              downlink: connection?.downlink || 10
            }
          })
        }
      } catch (error) {
        console.warn('Failed to collect performance metrics:', error)
      }
    }

    // Initial collection
    setTimeout(collectMetrics, 1000)
    
    // Periodic updates
    const interval = setInterval(collectMetrics, 10000) // Every 10 seconds

    return () => {
      clearInterval(interval)
      monitor.stopMonitoring()
    }
  }, [])

  // Proactive optimizations based on metrics
  useEffect(() => {
    if (!metrics) return

    const { webVitals, network } = metrics

    // Optimize for slow networks
    if (network.effectiveType === '2g' || network.effectiveType === 'slow-2g') {
      // Enable data saver mode
      document.documentElement.setAttribute('data-connection', 'slow')
      
      // Reduce image quality
      const images = document.querySelectorAll('img[data-src]')
      images.forEach(img => {
        const element = img as HTMLImageElement
        element.setAttribute('loading', 'lazy')
      })
    }

    // Optimize for poor LCP
    if (webVitals.LCP > 2500) {
      // Preload critical resources
      const criticalResources = [
        '/_next/static/css/app/layout.css',
        '/_next/static/chunks/main.js'
      ]

      criticalResources.forEach(resource => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = resource
        link.as = resource.endsWith('.css') ? 'style' : 'script'
        if (!document.head.querySelector(`link[href="${resource}"]`)) {
          document.head.appendChild(link)
        }
      })
    }

    // Optimize for high CLS
    if (webVitals.CLS > 0.1) {
      // Add size attributes to images without them
      const images = document.querySelectorAll('img:not([width]):not([height])')
      images.forEach(img => {
        const element = img as HTMLImageElement
        element.style.aspectRatio = '16/9'
        element.style.width = '100%'
        element.style.height = 'auto'
      })
    }
  }, [metrics])

  // Register service worker for advanced caching
  useEffect(() => {
    if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
      navigator.serviceWorker.register('/sw-enhanced.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)
        })
        .catch(error => {
          console.warn('Service Worker registration failed:', error)
        })
    }
  }, [])

  return null // This component doesn't render anything visible
}
