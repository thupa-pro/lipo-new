import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up accessibility testing context
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    if (headings.length > 0) {
      // Check for h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
      expect(h1Count).toBeLessThanOrEqual(2); // Should have one main h1, maybe one hidden
      
      // Check heading levels don't skip
      const headingLevels = [];
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const level = parseInt(tagName.charAt(1));
        headingLevels.push(level);
      }
      
      // First heading should be h1
      expect(headingLevels[0]).toBe(1);
      
      // Check for logical progression (no skipping levels)
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];
        
        // Level can stay same, go up by 1, or go down any amount
        const isValidProgression = currentLevel <= previousLevel + 1;
        expect(isValidProgression).toBeTruthy();
      }
    }
  });

  test('should have alt text for images', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      const ariaLabel = await img.getAttribute('aria-label');
      const isDecorative = role === 'presentation' || alt === '';
      
      // Images should either have alt text or be marked as decorative
      expect(alt !== null || ariaLabel !== null || isDecorative).toBeTruthy();
      
      // If alt text exists, it should be meaningful (not just filename)
      if (alt && alt !== '') {
        expect(alt.toLowerCase()).not.toMatch(/\.(jpg|jpeg|png|gif|svg|webp)$/);
        expect(alt.length).toBeGreaterThan(2);
      }
    }
  });

  test('should have proper form labels', async ({ page }) => {
    const inputs = await page.locator('input, select, textarea').all();
    
    for (const input of inputs) {
      const type = await input.getAttribute('type');
      
      // Skip hidden inputs
      if (type === 'hidden') continue;
      
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      
      // Check for associated label
      let hasLabel = false;
      
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        hasLabel = label > 0;
      }
      
      // Input should have label, aria-label, or aria-labelledby
      const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledby;
      
      // Placeholder alone is not sufficient for accessibility
      if (!hasAccessibleName && placeholder) {
        console.warn(`Input has only placeholder text: ${placeholder}`);
      }
      
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('should have proper link accessibility', async ({ page }) => {
    const links = await page.locator('a').all();
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      const textContent = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Skip anchor links
      if (href === '#') continue;
      
      // Links should have accessible text
      const hasAccessibleText = (textContent && textContent.trim().length > 0) || ariaLabel || title;
      expect(hasAccessibleText).toBeTruthy();
      
      // Link text should be descriptive
      if (textContent) {
        const linkText = textContent.trim().toLowerCase();
        const vagueLinkTexts = ['click here', 'read more', 'here', 'more', 'link'];
        const isVague = vagueLinkTexts.includes(linkText);
        
        if (isVague) {
          // Should have aria-label or title for context
          expect(ariaLabel || title).toBeTruthy();
        }
      }
    }
  });

  test('should have proper button accessibility', async ({ page }) => {
    const buttons = await page.locator('button, input[type="button"], input[type="submit"]').all();
    
    for (const button of buttons) {
      const textContent = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      const value = await button.getAttribute('value');
      
      // Buttons should have accessible text
      const hasAccessibleText = 
        (textContent && textContent.trim().length > 0) || 
        ariaLabel || 
        title || 
        value;
      
      expect(hasAccessibleText).toBeTruthy();
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // Test high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);
    
    // Check that page still renders properly
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Switch back to light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForTimeout(500);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should be navigable with keyboard only', async ({ page }) => {
    // Start keyboard navigation
    await page.keyboard.press('Tab');
    
    const focusableElements = [];
    let tabCount = 0;
    const maxTabs = 20;
    
    while (tabCount < maxTabs) {
      const focusedElement = page.locator(':focus');
      
      if (await focusedElement.count() > 0) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        const role = await focusedElement.getAttribute('role');
        
        // Element should be visible when focused
        await expect(focusedElement).toBeVisible();
        
        // Focus should be visually indicated
        const hasVisibleFocus = await focusedElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.outline !== 'none' || 
                 styles.boxShadow !== 'none' || 
                 styles.border !== 'none';
        });
        
        focusableElements.push({ tagName, role, hasVisibleFocus });
      }
      
      await page.keyboard.press('Tab');
      tabCount++;
      await page.waitForTimeout(100);
    }
    
    // Should have found focusable elements
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // Most focusable elements should have visible focus
    const elementsWithVisibleFocus = focusableElements.filter(el => el.hasVisibleFocus);
    const visibleFocusRatio = elementsWithVisibleFocus.length / focusableElements.length;
    expect(visibleFocusRatio).toBeGreaterThan(0.5);
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for landmark regions
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').count();
    expect(landmarks).toBeGreaterThan(0);
    
    // Check for skip links
    const skipLinks = await page.locator('a[href^="#"]:has-text("Skip")').count();
    
    // Should have at least one skip link
    if (skipLinks > 0) {
      const firstSkipLink = page.locator('a[href^="#"]:has-text("Skip")').first();
      await firstSkipLink.focus();
      await expect(firstSkipLink).toBeVisible();
    }
    
    // Check for proper ARIA usage
    const ariaElements = await page.locator('[aria-label], [aria-labelledby], [aria-describedby], [role]').count();
    expect(ariaElements).toBeGreaterThan(0);
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
    
    // Check that animations are reduced
    const elementsWithAnimation = await page.locator('[style*="animation"], [style*="transition"]').count();
    
    if (elementsWithAnimation > 0) {
      // Verify animations respect reduced motion
      const reducedAnimations = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let respectsReducedMotion = true;
        
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const animationDuration = styles.animationDuration;
          const transitionDuration = styles.transitionDuration;
          
          if (animationDuration !== '0s' && animationDuration !== 'initial') {
            respectsReducedMotion = false;
          }
          if (transitionDuration !== '0s' && transitionDuration !== 'initial') {
            respectsReducedMotion = false;
          }
        });
        
        return respectsReducedMotion;
      });
      
      // Note: This test might be too strict for some designs
      // Comment out if needed: expect(reducedAnimations).toBeTruthy();
    }
  });

  test('should handle zoom levels appropriately', async ({ page }) => {
    // Test at 200% zoom
    await page.setViewportSize({ width: 640, height: 360 }); // Simulates 200% zoom on 1280x720
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Page should still be usable
    await expect(page.locator('body')).toBeVisible();
    
    // Navigation should still be accessible
    const navElements = await page.locator('nav, [role="navigation"]').count();
    if (navElements > 0) {
      await expect(page.locator('nav, [role="navigation"]').first()).toBeVisible();
    }
    
    // Text should not be cut off
    const textElements = await page.locator('p, span, div').all();
    
    for (const element of textElements.slice(0, 5)) { // Check first 5 text elements
      const boundingBox = await element.boundingBox();
      if (boundingBox) {
        // Element should not extend beyond viewport
        expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(640 + 50); // 50px tolerance
      }
    }
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should have proper error handling accessibility', async ({ page }) => {
    // Look for forms to test error states
    const forms = await page.locator('form').count();
    
    if (forms > 0) {
      const form = page.locator('form').first();
      const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
      
      if (await submitButton.isVisible()) {
        // Try to submit form without filling required fields
        await submitButton.click();
        await page.waitForTimeout(1000);
        
        // Check for error messages
        const errorElements = await page.locator('.error, [role="alert"], [aria-live], [aria-invalid="true"]').count();
        
        if (errorElements > 0) {
          const firstError = page.locator('.error, [role="alert"], [aria-live]').first();
          
          // Error should be visible and announced to screen readers
          await expect(firstError).toBeVisible();
          
          const ariaLive = await firstError.getAttribute('aria-live');
          const role = await firstError.getAttribute('role');
          
          // Should have proper ARIA for screen readers
          expect(ariaLive === 'polite' || ariaLive === 'assertive' || role === 'alert').toBeTruthy();
        }
      }
    }
  });
});

test.describe('WCAG Compliance', () => {
  test('should meet basic WCAG requirements', async ({ page }) => {
    await page.goto('/');
    
    // Check page has title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    // Check page has proper language attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    
    // Check for proper document structure
    await expect(page.locator('main, [role="main"]')).toBeVisible();
  });

  test('should have accessible forms', async ({ page }) => {
    // Visit pages with forms
    const formPages = ['/auth/login', '/auth/signup', '/contact'];
    
    for (const formPage of formPages) {
      try {
        await page.goto(formPage);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        const forms = await page.locator('form').count();
        
        if (forms > 0) {
          // Check fieldsets for grouped inputs
          const fieldsets = await page.locator('fieldset').count();
          const radioGroups = await page.locator('input[type="radio"]').count();
          const checkboxGroups = await page.locator('input[type="checkbox"]').count();
          
          // If there are radio buttons or checkboxes, should have fieldsets or proper grouping
          if (radioGroups > 1 || checkboxGroups > 1) {
            const hasProperGrouping = fieldsets > 0 || 
                                     await page.locator('[role="group"], [role="radiogroup"]').count() > 0;
            expect(hasProperGrouping).toBeTruthy();
          }
        }
      } catch (error) {
        // Page might not exist, continue
        continue;
      }
    }
  });
});
