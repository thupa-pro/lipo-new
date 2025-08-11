import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display sign in and sign up options on homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check for auth buttons in header
    await expect(page.locator('text=Sign In')).toBeVisible()
    await expect(page.locator('text=Get Started')).toBeVisible()
  })

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sign In')
    
    await expect(page).toHaveURL(/.*\/auth\/signin/)
    await expect(page.locator('h1')).toContainText('Welcome Back')
  })

  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Get Started')
    
    await expect(page).toHaveURL(/.*\/auth\/signup/)
    await expect(page.locator('h1')).toContainText('Join Loconomy')
  })

  test('should validate sign in form', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Form should not submit with empty fields
    await expect(page).toHaveURL(/.*\/auth\/signin/)
  })

  test('should validate sign up form', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Fill form with invalid data
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[placeholder="Enter your password"]', '123') // Too short
    
    // Try to submit
    await page.click('button[type="submit"]')
    
    // Should remain on signup page due to validation
    await expect(page).toHaveURL(/.*\/auth\/signup/)
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to signin for protected pages', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to sign in
    await expect(page).toHaveURL(/.*\/auth\/signin/)
  })

  test('should redirect to signin for admin pages', async ({ page }) => {
    await page.goto('/admin')
    
    // Should redirect to sign in
    await expect(page).toHaveURL(/.*\/auth\/signin/)
  })
})
