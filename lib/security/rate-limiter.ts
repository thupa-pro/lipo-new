import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: NextRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitInfo {
  limit: number
  remaining: number
  reset: Date
  retryAfter?: number
}

export class RateLimiter {
  private config: RateLimitConfig
  private supabase = createSupabaseServerClient()

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: 15 * 60 * 1000, // 15 minutes default
      maxRequests: 100, // 100 requests per window default
      keyGenerator: (req) => this.getClientKey(req),
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config,
    }
  }

  private getClientKey(req: NextRequest): string {
    // Use multiple identifiers for more robust rate limiting
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || req.ip || 'unknown'
    
    // Include user agent hash for additional uniqueness
    const userAgent = req.headers.get('user-agent') || ''
    const userAgentHash = this.hashCode(userAgent).toString()
    
    return `${ip}:${userAgentHash}`
  }

  private hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  async checkLimit(req: NextRequest): Promise<{ allowed: boolean; info: RateLimitInfo }> {
    const key = this.config.keyGenerator!(req)
    const now = new Date()
    const windowStart = new Date(now.getTime() - this.config.windowMs)

    try {
      // Clean up old requests
      await this.supabase
        .from('rate_limit_requests')
        .delete()
        .lt('created_at', windowStart.toISOString())

      // Count current window requests
      const { data: currentRequests, error } = await this.supabase
        .from('rate_limit_requests')
        .select('id')
        .eq('client_key', key)
        .gte('created_at', windowStart.toISOString())

      if (error) {
        console.error('Rate limit check error:', error)
        // Fail open - allow request if database error
        return {
          allowed: true,
          info: {
            limit: this.config.maxRequests,
            remaining: this.config.maxRequests,
            reset: new Date(now.getTime() + this.config.windowMs),
          },
        }
      }

      const requestCount = currentRequests?.length || 0
      const remaining = Math.max(0, this.config.maxRequests - requestCount)
      const allowed = requestCount < this.config.maxRequests

      if (allowed) {
        // Record this request
        await this.supabase
          .from('rate_limit_requests')
          .insert({
            client_key: key,
            endpoint: req.nextUrl.pathname,
            method: req.method,
            created_at: now.toISOString(),
          })
      }

      return {
        allowed,
        info: {
          limit: this.config.maxRequests,
          remaining: allowed ? remaining - 1 : remaining,
          reset: new Date(now.getTime() + this.config.windowMs),
          retryAfter: allowed ? undefined : Math.ceil(this.config.windowMs / 1000),
        },
      }
    } catch (error) {
      console.error('Rate limiter error:', error)
      // Fail open - allow request if error
      return {
        allowed: true,
        info: {
          limit: this.config.maxRequests,
          remaining: this.config.maxRequests,
          reset: new Date(now.getTime() + this.config.windowMs),
        },
      }
    }
  }

  static createMiddleware(config: RateLimitConfig) {
    const limiter = new RateLimiter(config)

    return async (req: NextRequest) => {
      const result = await limiter.checkLimit(req)

      if (!result.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: result.info.retryAfter,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': result.info.limit.toString(),
              'X-RateLimit-Remaining': result.info.remaining.toString(),
              'X-RateLimit-Reset': Math.ceil(result.info.reset.getTime() / 1000).toString(),
              'Retry-After': result.info.retryAfter?.toString() || '60',
            },
          }
        )
      }

      return null // Continue to next middleware/handler
    }
  }
}

// Predefined rate limiters for common use cases
export const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
})

export const apiLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 API calls per 15 minutes
})

export const aiLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 AI requests per hour
})

export const searchLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 searches per minute
})
