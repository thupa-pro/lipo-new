/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for performance optimization
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization - simplified
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },

  // Very permissive headers for development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Strict mode for better performance
  reactStrictMode: true,
  
  // SWC minification for speed
  swcMinify: true,
  
  // ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },

  // Environment variables optimization
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
}

export default nextConfig
