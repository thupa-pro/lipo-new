import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authLimiter, apiLimiter, aiLimiter, searchLimiter } from '@/lib/security/rate-limiter'

// Enhanced security headers
const securityHeaders = {
  // Prevent the browser from trying to guess the content type
  'X-Content-Type-Options': 'nosniff',
  // Deny all attempts to embed our site in an iframe
  'X-Frame-Options': 'DENY',
  // Enable XSS filtering
  'X-XSS-Protection': '1; mode=block',
  // Only send the origin when making same-origin requests
  'Referrer-Policy': 'origin-when-cross-origin',
  // Enforce HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // CSP to prevent XSS attacks
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https: wss:",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
}

// API routes that require authentication
const protectedApiRoutes = [
  '/api/users',
  '/api/bookings',
  '/api/providers',
  '/api/ai/',
  '/api/gdpr/',
  '/api/analytics',
]

// Admin-only routes
const adminRoutes = [
  '/admin',
  '/api/admin',
]

// Apply rate limiting based on route
async function applyRateLimit(request: NextRequest): Promise<Response | null> {
  const { pathname } = request.nextUrl

  // Authentication endpoints - strict limiting
  if (pathname.startsWith('/api/auth/')) {
    const rateLimitResult = await authLimiter.checkLimit(request)
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Too many authentication attempts. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.info.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.info.remaining.toString(),
            'Retry-After': rateLimitResult.info.retryAfter?.toString() || '900',
          },
        }
      )
    }
  }

  // AI endpoints - specialized limiting
  if (pathname.startsWith('/api/ai/')) {
    const rateLimitResult = await aiLimiter.checkLimit(request)
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'AI Rate Limit Exceeded',
          message: 'AI service rate limit exceeded. Please upgrade your plan or try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.info.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.info.remaining.toString(),
            'Retry-After': rateLimitResult.info.retryAfter?.toString() || '3600',
          },
        }
      )
    }
  }

  // Search endpoints - moderate limiting
  if (pathname.startsWith('/api/search/') || pathname.startsWith('/api/listings')) {
    const rateLimitResult = await searchLimiter.checkLimit(request)
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Search Rate Limit Exceeded',
          message: 'Too many search requests. Please slow down.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.info.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.info.remaining.toString(),
            'Retry-After': rateLimitResult.info.retryAfter?.toString() || '60',
          },
        }
      )
    }
  }

  // General API rate limiting
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = await apiLimiter.checkLimit(request)
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'API Rate Limit Exceeded',
          message: 'API rate limit exceeded. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.info.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.info.remaining.toString(),
            'Retry-After': rateLimitResult.info.retryAfter?.toString() || '900',
          },
        }
      )
    }
  }

  return null
}

// Check authentication for protected routes
async function checkAuthentication(request: NextRequest): Promise<Response | null> {
  const { pathname } = request.nextUrl

  // Skip auth check for public routes
  if (!pathname.startsWith('/api/') || pathname.startsWith('/api/auth/') || pathname === '/api/health') {
    return null
  }

  // Check if route requires authentication
  const isProtected = protectedApiRoutes.some(route => pathname.startsWith(route))
  if (!isProtected) {
    return null
  }

  // Check for authentication header
  const authHeader = request.headers.get('authorization')
  const sessionCookie = request.cookies.get('__session')?.value

  if (!authHeader && !sessionCookie) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized',
        message: 'Authentication required. Please sign in.',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  // Check admin routes
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  if (isAdminRoute) {
    // In production, validate admin privileges from token/session
    // For now, just check for specific admin header
    const adminHeader = request.headers.get('x-admin-token')
    if (!adminHeader || adminHeader !== process.env.ADMIN_SECRET) {
      return new Response(
        JSON.stringify({
          error: 'Forbidden',
          message: 'Admin access required.',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
        )
    }
  }

  return null
}

// Input validation for common attack patterns
function validateInput(request: NextRequest): Response | null {
  const { pathname, searchParams } = request.nextUrl

  // Check for SQL injection patterns in query parameters
  const sqlInjectionPattern = /(union|select|insert|update|delete|drop|exec|script)/i
  for (const [key, value] of searchParams.entries()) {
    if (sqlInjectionPattern.test(value)) {
      console.warn(`Potential SQL injection attempt: ${key}=${value} from ${request.ip}`)
      return new Response(
        JSON.stringify({
          error: 'Invalid Input',
          message: 'Request contains invalid characters.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }

  // Check for XSS patterns
  const xssPattern = /<script|javascript:|on\w+\s*=/i
  for (const [key, value] of searchParams.entries()) {
    if (xssPattern.test(value)) {
      console.warn(`Potential XSS attempt: ${key}=${value} from ${request.ip}`)
      return new Response(
        JSON.stringify({
          error: 'Invalid Input',
          message: 'Request contains potentially harmful content.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }

  return null
}

export async function middleware(request: NextRequest) {
  // Apply security headers to all responses
  const response = NextResponse.next()
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Apply input validation
  const inputValidationResult = validateInput(request)
  if (inputValidationResult) {
    return inputValidationResult
  }

  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(request)
  if (rateLimitResult) {
    return rateLimitResult
  }

  // Apply authentication checks
  const authResult = await checkAuthentication(request)
  if (authResult) {
    return authResult
  }

  // Log suspicious activities
  const { pathname } = request.nextUrl
  if (pathname.includes('..') || pathname.includes('<script>') || pathname.includes('union') || pathname.includes('select')) {
    console.warn(`Suspicious request detected: ${pathname} from ${request.ip}`)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
