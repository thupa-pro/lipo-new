import { chromium } from '@playwright/test';

async function globalSetup() {
  console.log('🚀 Global test setup started...');
  
  try {
    // Launch browser for setup tasks
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the app to ensure it's running
    await page.goto(process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000');
    
    // Wait for the app to be fully loaded
    await page.waitForSelector('body', { timeout: 30000 });
    
    // Perform any global setup tasks
    await setupTestData(page);
    await setupAuthenticationState(context);
    
    await browser.close();
    
    console.log('✅ Global test setup completed successfully');
  } catch (error) {
    console.error('❌ Global test setup failed:', error);
    throw error;
  }
}

async function setupTestData(page) {
  // Setup test data if needed
  console.log('📊 Setting up test data...');
  
  try {
    // Clear any existing test data
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Set up test environment flags
    await page.evaluate(() => {
      localStorage.setItem('test-mode', 'true');
      localStorage.setItem('test-timestamp', Date.now().toString());
    });
    
    console.log('✅ Test data setup completed');
  } catch (error) {
    console.warn('⚠️ Test data setup had issues:', error.message);
  }
}

async function setupAuthenticationState(context) {
  // Setup authentication states for different user types
  console.log('🔐 Setting up authentication states...');
  
  try {
    // Create authenticated user state
    await context.storageState({ path: 'tests/auth/user-state.json' });
    
    // You could also setup admin state, provider state, etc.
    console.log('✅ Authentication states setup completed');
  } catch (error) {
    console.warn('⚠️ Authentication setup had issues:', error.message);
  }
}

export default globalSetup;
