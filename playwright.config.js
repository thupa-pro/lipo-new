import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Enhanced reporting
  reporter: [
    ["html", { outputFolder: "test-results/html-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["github"],
    ["list"]
  ],
  
  // Global test configuration
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    
    // Performance and accessibility
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Additional context options
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    // Custom options for our app
    contextOptions: {
      permissions: ['geolocation', 'notifications'],
    }
  },
  
  // Test projects for different scenarios
  projects: [
    // Desktop browsers
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        // Performance testing
        launchOptions: {
          args: ['--enable-features=NetworkService,NetworkServiceLogging']
        }
      },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    
    // Mobile devices
    {
      name: "Mobile Chrome",
      use: { 
        ...devices["Pixel 5"],
        // Mobile-specific options
        contextOptions: {
          isMobile: true,
          hasTouch: true,
        }
      },
    },
    {
      name: "Mobile Safari",
      use: { 
        ...devices["iPhone 12"],
        contextOptions: {
          isMobile: true,
          hasTouch: true,
        }
      },
    },
    
    // Accessibility testing
    {
      name: "accessibility",
      use: {
        ...devices["Desktop Chrome"],
        // Force reduced motion for accessibility testing
        reducedMotion: 'reduce',
        colorScheme: 'dark',
      },
      testMatch: '**/*.accessibility.spec.js'
    },
    
    // Performance testing
    {
      name: "performance",
      use: {
        ...devices["Desktop Chrome"],
        // Performance monitoring
        trace: 'on',
        video: 'on',
      },
      testMatch: '**/*.performance.spec.js'
    },
    
    // API testing
    {
      name: "api",
      use: {
        baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
      },
      testMatch: '**/*.api.spec.js'
    }
  ],
  
  // Development server
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    
    // Enhanced server options
    env: {
      NODE_ENV: 'test',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000'
    }
  },
  
  // Global setup and teardown
  globalSetup: require.resolve('./tests/global-setup.js'),
  globalTeardown: require.resolve('./tests/global-teardown.js'),
  
  // Test output
  outputDir: 'test-results',
  
  // Metadata
  metadata: {
    testType: 'e2e',
    environment: process.env.NODE_ENV || 'test',
    version: process.env.npm_package_version || '1.0.0'
  }
})
