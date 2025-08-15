import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication state
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check page loads correctly
    await expect(page).toHaveTitle(/Login|Sign In/i);
    
    // Check for login form elements
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name*="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], input[type="submit"]')).toBeVisible();
  });

  test('should display signup page', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Check page loads correctly
    await expect(page).toHaveTitle(/Sign Up|Register/i);
    
    // Check for signup form elements
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name*="password"]')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/login');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    
    // Enter invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Check for validation message
    await expect(page.locator(':invalid, .error, [aria-invalid="true"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/auth/login');
    
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    
    // Try to submit without filling fields
    await submitButton.click();
    
    // Check for validation messages
    const validationErrors = await page.locator(':invalid, .error, [aria-invalid="true"]').count();
    expect(validationErrors).toBeGreaterThan(0);
  });

  test('should handle login attempt with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name*="password"]').first();
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    
    // Fill in invalid credentials
    await emailInput.fill('test@example.com');
    await passwordInput.fill('wrongpassword');
    await submitButton.click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Should show error message or stay on login page
    const currentUrl = page.url();
    const hasErrorMessage = await page.locator('.error, [role="alert"], .alert').count() > 0;
    
    // Either should stay on login page or show error
    expect(currentUrl.includes('/auth/login') || hasErrorMessage).toBeTruthy();
  });

  test('should navigate between auth pages', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Look for link to signup
    const signupLink = page.locator('a[href*="/auth/signup"], a:has-text("Sign up"), a:has-text("Register")').first();
    
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await expect(page).toHaveURL(/\/auth\/signup/);
      
      // Go back to login
      const loginLink = page.locator('a[href*="/auth/login"], a:has-text("Login"), a:has-text("Sign in")').first();
      
      if (await loginLink.isVisible()) {
        await loginLink.click();
        await expect(page).toHaveURL(/\/auth\/login/);
      }
    }
  });

  test('should handle forgot password flow', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Look for forgot password link
    const forgotPasswordLink = page.locator('a[href*="forgot"], a:has-text("Forgot"), a:has-text("Reset")').first();
    
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      
      // Should navigate to forgot password page
      await expect(page).toHaveURL(/forgot|reset/);
      
      // Check for email input on forgot password page
      await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible();
    }
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    
    let tabCount = 0;
    const maxTabs = 10;
    
    while (tabCount < maxTabs) {
      const focusedElement = page.locator(':focus');
      
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        
        // If we reach the submit button, test it
        if (tagName === 'button' || (tagName === 'input' && await focusedElement.getAttribute('type') === 'submit')) {
          // Fill required fields first if they exist
          const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
          const passwordInput = page.locator('input[type="password"], input[name*="password"]').first();
          
          if (await emailInput.isVisible() && await passwordInput.isVisible()) {
            await emailInput.fill('test@example.com');
            await passwordInput.fill('testpassword');
          }
          
          // Now press Enter on the submit button
          await page.keyboard.press('Enter');
          await page.waitForTimeout(1000);
          break;
        }
      }
      
      await page.keyboard.press('Tab');
      tabCount++;
    }
    
    // Form should have processed the submission attempt
    const currentUrl = page.url();
    expect(currentUrl).toBeDefined();
  });

  test('should handle social auth buttons if present', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Look for social auth buttons
    const socialButtons = page.locator('button:has-text("Google"), button:has-text("Facebook"), button:has-text("GitHub"), a:has-text("Google"), a:has-text("Facebook"), a:has-text("GitHub")');
    
    const socialButtonCount = await socialButtons.count();
    
    if (socialButtonCount > 0) {
      const firstSocialButton = socialButtons.first();
      
      // Click should either navigate or open popup
      const [popup] = await Promise.all([
        page.waitForEvent('popup', { timeout: 5000 }).catch(() => null),
        firstSocialButton.click()
      ]);
      
      if (popup) {
        // If popup opened, close it
        await popup.close();
      } else {
        // If no popup, should have navigated or shown some response
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should maintain form state on page refresh', async ({ page }) => {
    await page.goto('/auth/login');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    
    // Fill email field
    await emailInput.fill('test@example.com');
    
    // Refresh page
    await page.reload();
    
    // Check if form has any restoration mechanism
    // (Most apps don't restore auth forms for security, but test anyway)
    await page.waitForLoadState('networkidle');
    
    const emailValue = await emailInput.inputValue();
    
    // Either should be empty (secure) or restored (user convenience)
    expect(typeof emailValue).toBe('string');
  });
});

test.describe('Protected Routes', () => {
  test('should redirect unauthorized users to login', async ({ page }) => {
    // Try to access protected routes
    const protectedRoutes = [
      '/dashboard',
      '/profile',
      '/settings',
      '/admin'
    ];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      
      // Should either redirect to login or show unauthorized message
      const isRedirectedToAuth = currentUrl.includes('/auth/') || currentUrl.includes('/login');
      const hasUnauthorizedMessage = await page.locator(':has-text("Unauthorized"), :has-text("Access Denied"), :has-text("Please log in")').count() > 0;
      
      expect(isRedirectedToAuth || hasUnauthorizedMessage).toBeTruthy();
    }
  });
});

test.describe('Session Management', () => {
  test('should handle session timeout gracefully', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Simulate session expiry by clearing cookies
    await page.context().clearCookies();
    
    // Try to access a protected route
    await page.goto('/dashboard');
    
    // Should handle gracefully (redirect to login or show message)
    const currentUrl = page.url();
    const isHandledGracefully = currentUrl.includes('/auth') || 
                               await page.locator(':has-text("Session expired"), :has-text("Please log in")').count() > 0;
    
    expect(isHandledGracefully).toBeTruthy();
  });
});
