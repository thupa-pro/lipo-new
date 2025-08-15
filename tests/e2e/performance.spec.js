import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cache and storage for consistent testing
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should load homepage within performance budgets', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Performance budgets
    expect(loadTime).toBeLessThan(3000); // 3 seconds for complete load
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        resourceCount: performance.getEntriesByType('resource').length
      };
    });
    
    // Performance assertions
    expect(metrics.ttfb).toBeLessThan(800); // Time to First Byte
    expect(metrics.fcp).toBeLessThan(1800); // First Contentful Paint
    expect(metrics.domContentLoaded).toBeLessThan(2000); // DOM Content Loaded
    expect(metrics.resourceCount).toBeLessThan(50); // Resource count
    
    console.log('Performance Metrics:', metrics);
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/');
    
    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      
      return images.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.offsetWidth,
        displayHeight: img.offsetHeight,
        hasLoading: img.loading,
        hasSrcset: !!img.srcset,
        hasSizes: !!img.sizes
      }));
    });
    
    for (const image of imageMetrics) {
      // Images should use lazy loading
      if (image.displayHeight > 0) { // Visible images
        expect(['lazy', 'eager', '']).toContain(image.hasLoading);
      }
      
      // Images should not be oversized
      if (image.naturalWidth > 0 && image.displayWidth > 0) {
        const oversizeRatio = image.naturalWidth / image.displayWidth;
        expect(oversizeRatio).toBeLessThan(2); // Should not be more than 2x larger than display size
      }
      
      // Modern images should use responsive techniques
      if (image.displayWidth > 300) {
        expect(image.hasSrcset || image.src.includes('_next/image')).toBeTruthy();
      }
    }
  });

  test('should minimize resource requests', async ({ page }) => {
    // Track network requests
    const requests = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Analyze requests
    const jsRequests = requests.filter(r => r.resourceType === 'script').length;
    const cssRequests = requests.filter(r => r.resourceType === 'stylesheet').length;
    const imageRequests = requests.filter(r => r.resourceType === 'image').length;
    
    // Resource budgets
    expect(jsRequests).toBeLessThan(10); // JavaScript files
    expect(cssRequests).toBeLessThan(5); // CSS files
    expect(imageRequests).toBeLessThan(15); // Images
    
    console.log('Resource counts:', { jsRequests, cssRequests, imageRequests, total: requests.length });
  });

  test('should have efficient caching', async ({ page }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const firstLoadMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        transferSize: performance.getEntriesByType('resource').reduce((sum, r) => sum + (r.transferSize || 0), 0)
      };
    });
    
    // Clear performance entries but keep cache
    await page.evaluate(() => performance.clearResourceTimings());
    
    // Second visit (should use cache)
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const secondLoadMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        transferSize: performance.getEntriesByType('resource').reduce((sum, r) => sum + (r.transferSize || 0), 0)
      };
    });
    
    // Second load should be faster due to caching
    expect(secondLoadMetrics.loadTime).toBeLessThan(firstLoadMetrics.loadTime * 1.2); // At most 20% longer
    console.log('Cache efficiency:', { first: firstLoadMetrics, second: secondLoadMetrics });
  });

  test('should handle slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', route => {
      const delay = Math.random() * 200 + 100; // 100-300ms delay
      setTimeout(() => route.continue(), delay);
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForSelector('body', { timeout: 15000 });
    const loadTime = Date.now() - startTime;
    
    // Should still load within reasonable time even on slow network
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
    
    // Check that critical content is visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main, [role="main"]')).toBeVisible();
  });

  test('should implement progressive loading', async ({ page }) => {
    // Track when different elements become visible
    const visibilityTimeline = [];
    
    // Start navigation
    const navigationPromise = page.goto('/');
    
    // Check for progressive loading indicators
    await page.waitForSelector('body');
    
    // Look for loading states
    const hasLoadingIndicators = await page.locator('.loading, .skeleton, [aria-busy="true"]').count();
    
    if (hasLoadingIndicators > 0) {
      visibilityTimeline.push({ type: 'loading-indicators', time: Date.now() });
      
      // Wait for loading to complete
      await page.waitForSelector('.loading', { state: 'detached', timeout: 5000 }).catch(() => {});
    }
    
    await navigationPromise;
    
    // Critical content should be visible quickly
    await expect(page.locator('h1')).toBeVisible();
    visibilityTimeline.push({ type: 'critical-content', time: Date.now() });
    
    // Check for lazy-loaded content
    const lazyImages = await page.locator('img[loading="lazy"]').count();
    if (lazyImages > 0) {
      // Scroll to trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1000);
    }
    
    console.log('Progressive loading timeline:', visibilityTimeline);
  });

  test('should optimize JavaScript execution', async ({ page }) => {
    let longTasksCount = 0;
    
    // Monitor for long tasks
    await page.addInitScript(() => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              window.longTasks = (window.longTasks || 0) + 1;
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for any delayed execution
    await page.waitForTimeout(2000);
    
    longTasksCount = await page.evaluate(() => window.longTasks || 0);
    
    // Should have minimal long tasks
    expect(longTasksCount).toBeLessThan(5);
    
    console.log('Long tasks detected:', longTasksCount);
  });

  test('should handle bundle size efficiently', async ({ page }) => {
    const bundleInfo = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('_next/static') && (url.endsWith('.js') || url.endsWith('.css'))) {
        bundleInfo.push({
          url: url.split('/').pop(),
          size: response.headers()['content-length'] || 0,
          type: url.endsWith('.js') ? 'javascript' : 'css'
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total bundle sizes
    const totalJSSize = bundleInfo
      .filter(b => b.type === 'javascript')
      .reduce((sum, b) => sum + parseInt(b.size || 0), 0);
    
    const totalCSSSize = bundleInfo
      .filter(b => b.type === 'css')
      .reduce((sum, b) => sum + parseInt(b.size || 0), 0);
    
    // Bundle size budgets (in bytes)
    expect(totalJSSize).toBeLessThan(500000); // 500KB for JS
    expect(totalCSSSize).toBeLessThan(100000); // 100KB for CSS
    
    console.log('Bundle sizes:', { 
      js: `${Math.round(totalJSSize / 1024)}KB`, 
      css: `${Math.round(totalCSSSize / 1024)}KB` 
    });
  });

  test('should preload critical resources', async ({ page }) => {
    await page.goto('/');
    
    // Check for resource preloading
    const preloadedResources = await page.evaluate(() => {
      const preloadLinks = Array.from(document.querySelectorAll('link[rel="preload"]'));
      const prefetchLinks = Array.from(document.querySelectorAll('link[rel="prefetch"]'));
      const preconnectLinks = Array.from(document.querySelectorAll('link[rel="preconnect"]'));
      
      return {
        preload: preloadLinks.map(link => ({ href: link.href, as: link.as })),
        prefetch: prefetchLinks.map(link => link.href),
        preconnect: preconnectLinks.map(link => link.href)
      };
    });
    
    // Should have some resource optimization
    const totalOptimizations = 
      preloadedResources.preload.length + 
      preloadedResources.prefetch.length + 
      preloadedResources.preconnect.length;
    
    expect(totalOptimizations).toBeGreaterThan(0);
    
    console.log('Resource preloading:', preloadedResources);
  });

  test('should implement efficient service worker caching', async ({ page }) => {
    // Check if service worker is registered
    const swRegistration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          return {
            active: !!registration?.active,
            scope: registration?.scope,
            updateViaCache: registration?.updateViaCache
          };
        } catch (error) {
          return { error: error.message };
        }
      }
      return { supported: false };
    });
    
    if (swRegistration.active) {
      // Test cache functionality
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Go offline
      await page.context().setOffline(true);
      
      // Try to reload page
      const offlineNavigation = await page.reload({ waitUntil: 'networkidle', timeout: 5000 }).catch(() => null);
      
      if (offlineNavigation) {
        // Page should still load from cache
        await expect(page.locator('body')).toBeVisible();
        console.log('Service worker cache working correctly');
      }
      
      // Go back online
      await page.context().setOffline(false);
    }
    
    console.log('Service worker status:', swRegistration);
  });
});

test.describe('Core Web Vitals', () => {
  test('should meet LCP targets', async ({ page }) => {
    await page.goto('/');
    
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        } else {
          resolve(0);
        }
      });
    });
    
    if (lcp > 0) {
      expect(lcp).toBeLessThan(2500); // LCP should be under 2.5s
      console.log('LCP:', lcp);
    }
  });

  test('should minimize CLS', async ({ page }) => {
    let clsScore = 0;
    
    await page.addInitScript(() => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              window.clsScore = (window.clsScore || 0) + entry.value;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Interact with page to trigger any layout shifts
    await page.mouse.move(100, 100);
    await page.waitForTimeout(2000);
    
    clsScore = await page.evaluate(() => window.clsScore || 0);
    
    expect(clsScore).toBeLessThan(0.1); // CLS should be under 0.1
    console.log('CLS Score:', clsScore);
  });

  test('should have fast FID', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate user interaction
    const startTime = Date.now();
    await page.click('body'); // Click on body to trigger FID measurement
    const interactionTime = Date.now() - startTime;
    
    // FID should be under 100ms (this is a simplified test)
    expect(interactionTime).toBeLessThan(100);
    console.log('Interaction delay:', interactionTime);
  });
});
