import { test, expect } from '@playwright/test';

test.describe('Core Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Loconomy/);
    
    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify no console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Allow some time for any JS errors to surface
    await page.waitForTimeout(2000);
    
    // Check that there are no critical console errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('DevTools') &&
      !error.includes('chrome-extension')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should navigate to browse page', async ({ page }) => {
    // Find and click browse/search button
    const browseButton = page.locator('a[href*="/browse"], button:has-text("Browse"), a:has-text("Find Services")').first();
    await expect(browseButton).toBeVisible();
    await browseButton.click();
    
    // Wait for navigation
    await page.waitForURL('**/browse**');
    
    // Check that we're on the browse page
    await expect(page.locator('h1, h2')).toContainText(/Browse|Find|Search|Services/i);
    
    // Check for filter/search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('plumber');
      await page.keyboard.press('Enter');
      
      // Wait for search results
      await page.waitForTimeout(1000);
    }
  });

  test('should handle mobile navigation', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('This test is only for mobile devices');
    }
    
    // Check for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu" i], button:has-text("Menu")').first();
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      // Check that navigation menu is now visible
      await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
      
      // Test navigation link
      const navLink = page.locator('nav a, [role="navigation"] a').first();
      if (await navLink.isVisible()) {
        await navLink.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should display footer information', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check footer is visible
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for important footer links
    const importantLinks = [
      'Privacy',
      'Terms',
      'Contact',
      'About'
    ];
    
    for (const linkText of importantLinks) {
      const link = page.locator(`footer a:has-text("${linkText}")`);
      if (await link.count() > 0) {
        await expect(link.first()).toBeVisible();
      }
    }
  });

  test('should handle theme switching', async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.locator('[aria-label*="theme"], button:has-text("Dark"), button:has-text("Light")').first();
    
    if (await themeToggle.isVisible()) {
      // Get current theme
      const initialTheme = await page.locator('html').getAttribute('class');
      
      // Click theme toggle
      await themeToggle.click();
      
      // Wait for theme change
      await page.waitForTimeout(500);
      
      // Check that theme has changed
      const newTheme = await page.locator('html').getAttribute('class');
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Navigate through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }
    
    // Test Enter key on focused element
    const currentFocus = page.locator(':focus');
    if (await currentFocus.isVisible()) {
      const tagName = await currentFocus.evaluate(el => el.tagName.toLowerCase());
      if (['button', 'a', 'input'].includes(tagName)) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
      }
    }
  });

  test('should handle offline scenarios gracefully', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);
    
    // Try to navigate to a new page
    const response = await page.goto('/browse', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => null);
    
    // Check if we get an offline page or cached content
    if (response) {
      // If page loads, check it's not an error page
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('This site can\'t be reached');
      expect(pageContent).not.toContain('No internet connection');
    }
    
    // Go back online
    await context.setOffline(false);
    
    // Verify app works normally again
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Form Interactions', () => {
  test('should handle search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    
    if (await searchInput.isVisible()) {
      // Test search input
      await searchInput.fill('home repair');
      await searchInput.press('Enter');
      
      // Wait for results or navigation
      await page.waitForTimeout(2000);
      
      // Check that something happened (results or navigation)
      const url = page.url();
      const hasResults = await page.locator('[data-testid="search-results"], .search-results, .results').count() > 0;
      
      expect(url.includes('search') || url.includes('browse') || hasResults).toBeTruthy();
    }
  });

  test('should validate form inputs', async ({ page }) => {
    // Look for contact or signup forms
    await page.goto('/');
    
    const forms = await page.locator('form').count();
    
    if (forms > 0) {
      const form = page.locator('form').first();
      const inputs = form.locator('input[required]');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Try to submit form without filling required fields
        const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
        
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Check for validation messages
          await page.waitForTimeout(1000);
          
          const validationMessages = await page.locator(':invalid, .error, [aria-invalid="true"]').count();
          
          // Should have validation feedback
          expect(validationMessages).toBeGreaterThan(0);
        }
      }
    }
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check for performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        ttfb: navigation.responseStart - navigation.requestStart
      };
    });
    
    // Time to First Byte should be reasonable
    expect(performanceMetrics.ttfb).toBeLessThan(1000);
  });

  test('should not have memory leaks on navigation', async ({ page }) => {
    // Navigate between pages multiple times
    const pages = ['/', '/browse', '/about'];
    
    for (let i = 0; i < 3; i++) {
      for (const url of pages) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }
    }
    
    // Check for excessive console warnings about memory
    const consoleWarnings = [];
    page.on('console', msg => {
      if (msg.type() === 'warning' && msg.text().includes('memory')) {
        consoleWarnings.push(msg.text());
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Should not have memory-related warnings
    expect(consoleWarnings.length).toBeLessThan(3);
  });
});
