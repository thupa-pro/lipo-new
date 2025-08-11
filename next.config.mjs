/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for performance optimization
  experimental: {
    // Enable React 18 features
    appDir: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    
    // Ultra-low latency optimizations
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
      'framer-motion',
      'lucide-react',
    ],
    
    // Advanced bundling optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    
    // Memory optimization
    largePageDataBytes: 128 * 1000, // 128KB
    
    // Incremental Static Regeneration optimizations
    isrFlushToDisk: true,
    isrMemoryCacheSize: 0, // Disable ISR memory cache in production
    
    // Performance monitoring
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
    
    // Advanced caching
    swcFileReading: true,
    
    // Runtime optimizations
    esmExternals: true,
    
    // Build optimizations
    optimisticClientCache: true,
    
    // Edge runtime optimizations
    runtime: 'nodejs',
    
    // Parallel processing
    workerThreads: true,
    
    // Advanced image optimization
    images: {
      allowFutureImage: true,
    },
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization for ultra-low latency
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: 'default',
    path: '/_next/image/',
  },

  // Headers for ultra-fast loading
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
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/admin/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=1, stale-while-revalidate=59'
          }
        ]
      }
    ]
  },

  // Redirects for performance
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ]
  },

  // Webpack optimizations for ultra-low latency
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Production optimizations
    if (!dev) {
      // Bundle analyzer
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: isServer
              ? '../analyze/server.html'
              : './analyze/client.html'
          })
        )
      }

      // Advanced optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
              chunks: 'all',
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
            },
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix',
              chunks: 'all',
              priority: 15,
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer',
              chunks: 'all',
              priority: 10,
            },
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide',
              chunks: 'all',
              priority: 5,
            },
          },
        },
      }

      // Compression
      config.plugins.push(
        new webpack.optimize.AggressiveMergingPlugin()
      )
    }

    // Module resolution optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './'),
    }

    // Performance optimizations
    config.performance = {
      maxAssetSize: 250000,
      maxEntrypointSize: 250000,
      hints: dev ? false : 'warning',
    }

    return config
  },

  // Standalone output for ultra-fast cold starts
  output: 'standalone',
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Strict mode for better performance
  reactStrictMode: true,
  
  // SWC minification for speed
  swcMinify: true,
  
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
  
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
    BUILD_TIMESTAMP: Date.now().toString(),
  },

  // Logging for performance monitoring
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    styledComponents: false,
  },

  // Runtime configuration
  serverRuntimeConfig: {
    // Only available on the server side
    mySecret: 'secret',
  },
  
  publicRuntimeConfig: {
    // Available on both server and client
    staticFolder: '/static',
  },
}

export default nextConfig
