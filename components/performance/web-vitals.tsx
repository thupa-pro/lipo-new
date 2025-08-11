'use client'

import { useEffect } from 'react'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  id: string
  delta: number
}

function sendToAnalytics(metric: WebVitalsMetric) {
  // Send to PostHog
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture('web_vitals', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_id: metric.id,
      metric_delta: metric.delta,
    })
  }

  // Also send to our performance API
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const data = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now(),
    })

    navigator.sendBeacon('/api/performance/web-vitals', data)
  }
}

export default function WebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    getLCP((metric) => {
      sendToAnalytics(metric)
    })

    // First Input Delay
    getFID((metric) => {
      sendToAnalytics(metric)
    })

    // Cumulative Layout Shift
    getCLS((metric) => {
      sendToAnalytics(metric)
    })

    // First Contentful Paint
    getFCP((metric) => {
      sendToAnalytics(metric)
    })

    // Time to First Byte
    getTTFB((metric) => {
      sendToAnalytics(metric)
    })
  }, [])

  return null // This component doesn't render anything
}

// Performance optimization hooks
export function useImageOptimization() {
  const getOptimizedImageProps = (
    src: string,
    options: {
      width?: number
      height?: number
      quality?: number
    } = {}
  ) => {
    const { width, height, quality = 85 } = options

    return {
      src,
      width,
      height,
      quality,
      placeholder: 'blur' as const,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    }
  }

  return { getOptimizedImageProps }
}

export function useLazyLoading() {
  useEffect(() => {
    // Intersection Observer for lazy loading
    const images = document.querySelectorAll('img[data-src]')
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ''
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))

      return () => {
        images.forEach((img) => imageObserver.unobserve(img))
      }
    }
  }, [])
}

// Critical CSS injection
export function injectCriticalCSS() {
  if (typeof window !== 'undefined' && !document.getElementById('critical-css')) {
    const style = document.createElement('style')
    style.id = 'critical-css'
    style.innerHTML = `
      /* Critical CSS for LCP optimization */
      body { 
        font-family: system-ui, -apple-system, sans-serif;
        margin: 0;
        background: #ffffff;
      }
      .hero-section {
        min-height: 60vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
  }
}

// Performance monitoring component
export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry.duration, 'ms')
            sendToAnalytics({
              name: 'long-task',
              value: entry.duration,
              rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
              id: Math.random().toString(36).substr(2, 9),
              delta: entry.duration,
            })
          }
        }
      })

      observer.observe({ entryTypes: ['longtask'] })

      return () => observer.disconnect()
    }
  }, [])

  return null
}

// Font optimization
export function optimizeFonts() {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontUrls = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-var-latin.woff2',
    ]

    fontUrls.forEach((url) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // Font display optimization
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded')
      })
    }
  }
}

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties: any) => void
    }
  }
}
