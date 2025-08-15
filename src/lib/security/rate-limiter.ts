'use client'

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (identifier: string) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  onLimitReached?: (identifier: string) => void
  message?: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

class InMemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>()
  
  get(key: string): { count: number; resetTime: number } | undefined {
    return this.store.get(key)
  }
  
  set(key: string, value: { count: number; resetTime: number }): void {
    this.store.set(key, value)
  }
  
  delete(key: string): void {
    this.store.delete(key)
  }
  
  cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    this.store.forEach((value, key) => {
      if (now >= value.resetTime) {
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => this.store.delete(key))
  }
  
  size(): number {
    return this.store.size
  }
}

export class RateLimiter {
  private store: InMemoryStore
  private config: RateLimitConfig
  private cleanupInterval: NodeJS.Timeout | null = null
  
  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (id: string) => id,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      message: 'Too many requests',
      ...config
    }
    
    this.store = new InMemoryStore()
    
    // Start cleanup interval
    this.startCleanup()
  }
  
  private startCleanup(): void {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.store.cleanup()
    }, 60000)
  }
  
  public stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
  
  public async consume(identifier: string): Promise<RateLimitResult> {
    const key = this.config.keyGenerator!(identifier)
    const now = Date.now()
    const resetTime = now + this.config.windowMs
    
    let record = this.store.get(key)
    
    if (!record || now >= record.resetTime) {
      // Create new record or reset expired one
      record = { count: 1, resetTime }
      this.store.set(key, record)
      
      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        resetTime
      }
    }
    
    // Increment count
    record.count++
    this.store.set(key, record)
    
    const remaining = Math.max(0, this.config.maxRequests - record.count)
    const success = record.count <= this.config.maxRequests
    
    if (!success && this.config.onLimitReached) {
      this.config.onLimitReached(identifier)
    }
    
    const result: RateLimitResult = {
      success,
      limit: this.config.maxRequests,
      remaining,
      resetTime: record.resetTime
    }
    
    if (!success) {
      result.retryAfter = Math.ceil((record.resetTime - now) / 1000)
    }
    
    return result
  }
  
  public async reset(identifier: string): Promise<void> {
    const key = this.config.keyGenerator!(identifier)
    this.store.delete(key)
  }
  
  public getStats(): { totalKeys: number; windowMs: number; maxRequests: number } {
    return {
      totalKeys: this.store.size(),
      windowMs: this.config.windowMs,
      maxRequests: this.config.maxRequests
    }
  }
}

// Predefined rate limiters for different use cases
export const rateLimiters = {
  // General API rate limiter
  api: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    keyGenerator: (ip: string) => `api:${ip}`,
    message: 'Too many API requests'
  }),
  
  // Authentication rate limiter
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    keyGenerator: (ip: string) => `auth:${ip}`,
    message: 'Too many authentication attempts'
  }),
  
  // Search rate limiter
  search: new RateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 20,
    keyGenerator: (ip: string) => `search:${ip}`,
    message: 'Too many search requests'
  }),
  
  // File upload rate limiter
  upload: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    keyGenerator: (ip: string) => `upload:${ip}`,
    message: 'Too many upload attempts'
  }),
  
  // Email sending rate limiter
  email: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    keyGenerator: (email: string) => `email:${email}`,
    message: 'Too many emails sent'
  }),
  
  // Password reset rate limiter
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    keyGenerator: (email: string) => `reset:${email}`,
    message: 'Too many password reset attempts'
  })
}

// Middleware helper for Next.js API routes
export function withRateLimit(limiter: RateLimiter) {
  return async function rateLimitMiddleware(
    req: any,
    res: any,
    next: () => void
  ) {
    const identifier = getClientIdentifier(req)
    const result = await limiter.consume(identifier)
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', result.limit)
    res.setHeader('X-RateLimit-Remaining', result.remaining)
    res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000))
    
    if (!result.success) {
      res.setHeader('Retry-After', result.retryAfter || 60)
      return res.status(429).json({
        error: 'Too Many Requests',
        message: limiter['config'].message,
        retryAfter: result.retryAfter
      })
    }
    
    next()
  }
}

// Sliding window rate limiter for more precise control
export class SlidingWindowRateLimiter {
  private requests = new Map<string, number[]>()
  private windowSize: number
  private maxRequests: number
  
  constructor(windowSizeMs: number, maxRequests: number) {
    this.windowSize = windowSizeMs
    this.maxRequests = maxRequests
    
    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60000)
  }
  
  public isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowSize
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [])
    }
    
    const userRequests = this.requests.get(identifier)!
    
    // Remove old requests
    const validRequests = userRequests.filter(time => time > windowStart)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    
    return true
  }
  
  public getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.windowSize
    const userRequests = this.requests.get(identifier) || []
    const validRequests = userRequests.filter(time => time > windowStart)
    
    return Math.max(0, this.maxRequests - validRequests.length)
  }
  
  private cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.windowSize
    
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > windowStart)
      
      if (validRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, validRequests)
      }
    }
  }
}

// Token bucket rate limiter for burst handling
export class TokenBucketRateLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>()
  private capacity: number
  private refillRate: number // tokens per second
  
  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity
    this.refillRate = refillRate
  }
  
  public consume(identifier: string, tokens = 1): boolean {
    const now = Date.now()
    
    if (!this.buckets.has(identifier)) {
      this.buckets.set(identifier, { tokens: this.capacity, lastRefill: now })
    }
    
    const bucket = this.buckets.get(identifier)!
    
    // Refill tokens based on time passed
    const timePassed = (now - bucket.lastRefill) / 1000
    const tokensToAdd = timePassed * this.refillRate
    bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now
    
    // Check if enough tokens available
    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens
      return true
    }
    
    return false
  }
  
  public getTokens(identifier: string): number {
    const bucket = this.buckets.get(identifier)
    return bucket ? bucket.tokens : this.capacity
  }
}

// Adaptive rate limiter that adjusts based on system load
export class AdaptiveRateLimiter {
  private baseLimiter: RateLimiter
  private loadThreshold: number
  private reductionFactor: number
  
  constructor(config: RateLimitConfig, loadThreshold = 0.8, reductionFactor = 0.5) {
    this.baseLimiter = new RateLimiter(config)
    this.loadThreshold = loadThreshold
    this.reductionFactor = reductionFactor
  }
  
  public async consume(identifier: string): Promise<RateLimitResult> {
    const systemLoad = await this.getSystemLoad()
    let effectiveLimit = this.baseLimiter['config'].maxRequests
    
    if (systemLoad > this.loadThreshold) {
      effectiveLimit = Math.floor(effectiveLimit * this.reductionFactor)
    }
    
    // Temporarily adjust the limit
    const originalLimit = this.baseLimiter['config'].maxRequests
    this.baseLimiter['config'].maxRequests = effectiveLimit
    
    const result = await this.baseLimiter.consume(identifier)
    
    // Restore original limit
    this.baseLimiter['config'].maxRequests = originalLimit
    
    return result
  }
  
  private async getSystemLoad(): Promise<number> {
    // Simple system load estimation
    // In production, you'd use proper system metrics
    const stats = this.baseLimiter.getStats()
    const loadEstimate = Math.min(1, stats.totalKeys / 1000)
    
    return loadEstimate
  }
}

// Utility functions
function getClientIdentifier(req: any): string {
  // Try to get the real IP address
  const forwarded = req.headers['x-forwarded-for']
  const realIP = req.headers['x-real-ip']
  const cfConnectingIP = req.headers['cf-connecting-ip']
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown'
}

// Distributed rate limiter interface (for Redis, etc.)
export interface DistributedStore {
  get(key: string): Promise<{ count: number; resetTime: number } | null>
  set(key: string, value: { count: number; resetTime: number }, ttl?: number): Promise<void>
  increment(key: string, ttl?: number): Promise<number>
  delete(key: string): Promise<void>
}

export class DistributedRateLimiter {
  private store: DistributedStore
  private config: RateLimitConfig
  
  constructor(store: DistributedStore, config: RateLimitConfig) {
    this.store = store
    this.config = config
  }
  
  public async consume(identifier: string): Promise<RateLimitResult> {
    const key = this.config.keyGenerator!(identifier)
    const now = Date.now()
    const resetTime = now + this.config.windowMs
    
    try {
      const count = await this.store.increment(key, this.config.windowMs)
      const remaining = Math.max(0, this.config.maxRequests - count)
      const success = count <= this.config.maxRequests
      
      const result: RateLimitResult = {
        success,
        limit: this.config.maxRequests,
        remaining,
        resetTime
      }
      
      if (!success) {
        result.retryAfter = Math.ceil(this.config.windowMs / 1000)
        
        if (this.config.onLimitReached) {
          this.config.onLimitReached(identifier)
        }
      }
      
      return result
    } catch (error) {
      console.error('Rate limiter error:', error)
      
      // Fail open - allow the request if there's an error
      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        resetTime
      }
    }
  }
}

// Export cleanup function for graceful shutdown
export function cleanupRateLimiters(): void {
  Object.values(rateLimiters).forEach(limiter => {
    limiter.stopCleanup()
  })
}
