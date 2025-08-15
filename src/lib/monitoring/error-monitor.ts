'use client'

export interface ErrorMetadata {
  timestamp: Date
  userAgent: string
  url: string
  userId?: string
  sessionId?: string
  buildVersion?: string
  environment: 'development' | 'staging' | 'production'
  severity: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  fingerprint: string
  breadcrumbs: Breadcrumb[]
}

export interface Breadcrumb {
  timestamp: Date
  message: string
  category: 'navigation' | 'http' | 'user' | 'ui' | 'error' | 'debug'
  level: 'info' | 'warning' | 'error' | 'debug'
  data?: Record<string, any>
}

export interface ErrorReport {
  id: string
  error: {
    name: string
    message: string
    stack?: string
    cause?: string
  }
  metadata: ErrorMetadata
  context: {
    component?: string
    props?: Record<string, any>
    state?: Record<string, any>
    route?: string
  }
  performance: {
    memory?: MemoryInfo
    timing?: PerformanceTiming
    resources?: PerformanceResourceTiming[]
  }
  user: {
    id?: string
    email?: string
    role?: string
    permissions?: string[]
  }
}

export interface AnalyticsEvent {
  id: string
  name: string
  timestamp: Date
  properties: Record<string, any>
  userId?: string
  sessionId?: string
  page?: string
  category: 'user' | 'system' | 'business' | 'performance'
}

class ErrorMonitor {
  private static instance: ErrorMonitor
  private breadcrumbs: Breadcrumb[] = []
  private sessionId: string
  private userId?: string
  private isInitialized = false
  private errorBuffer: ErrorReport[] = []
  private analyticsBuffer: AnalyticsEvent[] = []
  private config = {
    maxBreadcrumbs: 100,
    maxBufferSize: 50,
    flushInterval: 30000, // 30 seconds
    enablePerformanceMonitoring: true,
    enableUserTracking: true,
    enableConsoleCapture: true,
    enableNetworkCapture: true,
    enableDOMCapture: false,
    enableScreenshot: false,
    beforeSend: (report: ErrorReport) => report,
    onError: (report: ErrorReport) => {}
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeMonitoring()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  initialize(config: Partial<typeof this.config> = {}) {
    this.config = { ...this.config, ...config }
    
    if (typeof window === 'undefined') return
    
    if (this.isInitialized) return
    this.isInitialized = true

    this.setupGlobalErrorHandlers()
    this.setupUnhandledRejectionHandler()
    this.setupConsoleCapture()
    this.setupNavigationTracking()
    this.setupPerformanceMonitoring()
    this.setupNetworkMonitoring()
    this.startPeriodicFlush()
    
    this.addBreadcrumb({
      timestamp: new Date(),
      message: 'Error monitoring initialized',
      category: 'debug',
      level: 'info'
    })
  }

  private setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript'
      })
    })
  }

  private setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        type: 'unhandled_promise_rejection',
        reason: event.reason
      })
    })
  }

  private setupConsoleCapture() {
    if (!this.config.enableConsoleCapture) return

    const originalConsole = { ...console }
    
    const levels: Array<keyof Console> = ['log', 'info', 'warn', 'error', 'debug']
    
    levels.forEach(level => {
      const original = originalConsole[level] as Function
      
      console[level] = (...args: any[]) => {
        original.apply(console, args)
        
        if (level === 'error') {
          this.captureError(new Error(args.join(' ')), {
            type: 'console_error',
            args
          })
        } else {
          this.addBreadcrumb({
            timestamp: new Date(),
            message: args.join(' '),
            category: 'debug',
            level: level === 'warn' ? 'warning' : level as any,
            data: { args }
          })
        }
      }
    })
  }

  private setupNavigationTracking() {
    // Track page navigation
    let lastPath = window.location.pathname
    
    const trackNavigation = () => {
      const currentPath = window.location.pathname
      if (currentPath !== lastPath) {
        this.addBreadcrumb({
          timestamp: new Date(),
          message: `Navigation: ${lastPath} → ${currentPath}`,
          category: 'navigation',
          level: 'info',
          data: {
            from: lastPath,
            to: currentPath,
            referrer: document.referrer
          }
        })
        lastPath = currentPath
      }
    }

    // Listen for navigation events
    window.addEventListener('popstate', trackNavigation)
    
    // Override pushState and replaceState for SPA navigation
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      setTimeout(trackNavigation, 0)
    }
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      setTimeout(trackNavigation, 0)
    }
  }

  private setupPerformanceMonitoring() {
    if (!this.config.enablePerformanceMonitoring) return

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            this.addBreadcrumb({
              timestamp: new Date(),
              message: `Long task detected: ${entry.duration}ms`,
              category: 'ui',
              level: 'warning',
              data: {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              }
            })
          }
        }
      })
      
      try {
        observer.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        // Long tasks not supported
      }
    }

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          this.addBreadcrumb({
            timestamp: new Date(),
            message: 'High memory usage detected',
            category: 'ui',
            level: 'warning',
            data: {
              usedJSHeapSize: memory.usedJSHeapSize,
              totalJSHeapSize: memory.totalJSHeapSize,
              jsHeapSizeLimit: memory.jsHeapSizeLimit,
              usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
            }
          })
        }
      }, 30000)
    }
  }

  private setupNetworkMonitoring() {
    if (!this.config.enableNetworkCapture) return

    // Monitor fetch requests
    const originalFetch = window.fetch
    
    window.fetch = async (...args) => {
      const startTime = Date.now()
      const url = args[0] instanceof Request ? args[0].url : args[0].toString()
      
      try {
        const response = await originalFetch.apply(window, args)
        const duration = Date.now() - startTime
        
        this.addBreadcrumb({
          timestamp: new Date(),
          message: `HTTP ${response.status} ${url}`,
          category: 'http',
          level: response.ok ? 'info' : 'error',
          data: {
            url,
            method: args[0] instanceof Request ? args[0].method : 'GET',
            status: response.status,
            statusText: response.statusText,
            duration
          }
        })
        
        return response
      } catch (error) {
        const duration = Date.now() - startTime
        
        this.addBreadcrumb({
          timestamp: new Date(),
          message: `HTTP error ${url}`,
          category: 'http',
          level: 'error',
          data: {
            url,
            error: error instanceof Error ? error.message : 'Unknown error',
            duration
          }
        })
        
        throw error
      }
    }

    // Monitor XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open
    const originalXHRSend = XMLHttpRequest.prototype.send
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this.addEventListener('loadend', () => {
        this.addEventListener('loadend', () => {
          ErrorMonitor.instance.addBreadcrumb({
            timestamp: new Date(),
            message: `XHR ${this.status} ${method} ${url}`,
            category: 'http',
            level: this.status >= 200 && this.status < 300 ? 'info' : 'error',
            data: {
              method,
              url: url.toString(),
              status: this.status,
              statusText: this.statusText
            }
          })
        })
      })
      
      return originalXHROpen.call(this, method, url, ...args)
    }
  }

  captureError(error: Error, context: Record<string, any> = {}) {
    const errorReport: ErrorReport = {
      id: this.generateId(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause instanceof Error ? error.cause.message : undefined
      },
      metadata: this.createMetadata('high'),
      context: {
        ...context,
        route: window.location.pathname,
        component: context.component
      },
      performance: this.getPerformanceData(),
      user: this.getUserData()
    }

    // Apply beforeSend hook
    const processedReport = this.config.beforeSend(errorReport)
    if (!processedReport) return

    // Add to buffer
    this.errorBuffer.push(processedReport)
    
    // Trigger immediate flush for critical errors
    if (errorReport.metadata.severity === 'critical') {
      this.flush()
    }

    // Call error callback
    this.config.onError(processedReport)
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', extra: Record<string, any> = {}) {
    this.addBreadcrumb({
      timestamp: new Date(),
      message,
      category: 'debug',
      level,
      data: extra
    })
  }

  captureException(exception: any, context: Record<string, any> = {}) {
    const error = exception instanceof Error ? exception : new Error(String(exception))
    this.captureError(error, context)
  }

  setUser(user: { id?: string; email?: string; role?: string; permissions?: string[] }) {
    this.userId = user.id
    this.addBreadcrumb({
      timestamp: new Date(),
      message: `User set: ${user.email || user.id || 'anonymous'}`,
      category: 'user',
      level: 'info',
      data: { userId: user.id, email: user.email, role: user.role }
    })
  }

  setTag(key: string, value: string) {
    // Store tags in session storage or memory
    const tags = this.getTags()
    tags[key] = value
    sessionStorage.setItem('error-monitor-tags', JSON.stringify(tags))
  }

  setContext(key: string, value: any) {
    // Store context in session storage
    const context = this.getContext()
    context[key] = value
    sessionStorage.setItem('error-monitor-context', JSON.stringify(context))
  }

  addBreadcrumb(breadcrumb: Breadcrumb) {
    this.breadcrumbs.push(breadcrumb)
    
    // Keep only the most recent breadcrumbs
    if (this.breadcrumbs.length > this.config.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.config.maxBreadcrumbs)
    }
  }

  // Analytics methods
  trackEvent(name: string, properties: Record<string, any> = {}, userId?: string) {
    const event: AnalyticsEvent = {
      id: this.generateId(),
      name,
      timestamp: new Date(),
      properties,
      userId: userId || this.userId,
      sessionId: this.sessionId,
      page: window.location.pathname,
      category: 'user'
    }

    this.analyticsBuffer.push(event)
    
    this.addBreadcrumb({
      timestamp: new Date(),
      message: `Event: ${name}`,
      category: 'user',
      level: 'info',
      data: properties
    })
  }

  trackPageView(page?: string) {
    this.trackEvent('page_view', {
      page: page || window.location.pathname,
      referrer: document.referrer,
      title: document.title
    })
  }

  trackUserAction(action: string, target?: string, properties: Record<string, any> = {}) {
    this.trackEvent('user_action', {
      action,
      target,
      ...properties
    })
  }

  private createMetadata(severity: ErrorMetadata['severity']): ErrorMetadata {
    return {
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId,
      buildVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      environment: process.env.NODE_ENV as ErrorMetadata['environment'],
      severity,
      tags: Object.keys(this.getTags()),
      fingerprint: this.generateFingerprint(),
      breadcrumbs: [...this.breadcrumbs]
    }
  }

  private generateFingerprint(): string {
    // Generate a fingerprint based on browser characteristics
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('Fingerprint test', 2, 2)
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas.toDataURL()
    ].join('|')
    
    return btoa(fingerprint).slice(0, 16)
  }

  private getPerformanceData() {
    if (!this.config.enablePerformanceMonitoring) return {}

    const data: any = {}
    
    if ('memory' in performance) {
      data.memory = (performance as any).memory
    }
    
    if ('timing' in performance) {
      data.timing = performance.timing
    }
    
    if ('getEntriesByType' in performance) {
      data.resources = performance.getEntriesByType('resource').slice(-10) // Last 10 resources
    }
    
    return data
  }

  private getUserData() {
    return {
      id: this.userId,
      email: this.getContext().userEmail,
      role: this.getContext().userRole,
      permissions: this.getContext().userPermissions
    }
  }

  private getTags(): Record<string, string> {
    try {
      return JSON.parse(sessionStorage.getItem('error-monitor-tags') || '{}')
    } catch {
      return {}
    }
  }

  private getContext(): Record<string, any> {
    try {
      return JSON.parse(sessionStorage.getItem('error-monitor-context') || '{}')
    } catch {
      return {}
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private startPeriodicFlush() {
    setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush(true)
    })
  }

  private async flush(immediate = false) {
    if (this.errorBuffer.length === 0 && this.analyticsBuffer.length === 0) return

    const errors = [...this.errorBuffer]
    const analytics = [...this.analyticsBuffer]
    
    this.errorBuffer = []
    this.analyticsBuffer = []

    try {
      if (immediate && navigator.sendBeacon) {
        // Use sendBeacon for reliability during page unload
        navigator.sendBeacon('/api/monitoring/errors', JSON.stringify({ errors, analytics }))
      } else {
        // Use regular fetch
        await fetch('/api/monitoring/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ errors, analytics })
        })
      }
    } catch (error) {
      console.warn('Failed to send error reports:', error)
      // Re-add to buffer for retry
      this.errorBuffer.unshift(...errors)
      this.analyticsBuffer.unshift(...analytics)
      
      // Prevent buffer from growing too large
      this.errorBuffer = this.errorBuffer.slice(-this.config.maxBufferSize)
      this.analyticsBuffer = this.analyticsBuffer.slice(-this.config.maxBufferSize)
    }
  }

  // Utility methods for debugging
  getStats() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      breadcrumbCount: this.breadcrumbs.length,
      errorBufferSize: this.errorBuffer.length,
      analyticsBufferSize: this.analyticsBuffer.length,
      isInitialized: this.isInitialized
    }
  }

  getBreadcrumbs() {
    return [...this.breadcrumbs]
  }

  clearBreadcrumbs() {
    this.breadcrumbs = []
  }
}

// React Error Boundary integration
export class ErrorBoundary extends Error {
  constructor(
    public componentStack: string,
    public errorBoundary: string,
    originalError: Error
  ) {
    super(originalError.message)
    this.name = 'ErrorBoundary'
    this.stack = originalError.stack
  }
}

// Singleton instance
export const errorMonitor = ErrorMonitor.getInstance()

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  errorMonitor.initialize()
}

// Convenience functions
export function captureError(error: Error, context?: Record<string, any>) {
  errorMonitor.captureError(error, context)
}

export function captureMessage(message: string, level?: 'info' | 'warning' | 'error') {
  errorMonitor.captureMessage(message, level)
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  errorMonitor.trackEvent(name, properties)
}

export function setUser(user: { id?: string; email?: string; role?: string }) {
  errorMonitor.setUser(user)
}

export function addBreadcrumb(message: string, category?: Breadcrumb['category'], data?: Record<string, any>) {
  errorMonitor.addBreadcrumb({
    timestamp: new Date(),
    message,
    category: category || 'debug',
    level: 'info',
    data
  })
}

export default ErrorMonitor
