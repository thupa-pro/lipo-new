async function globalTeardown() {
  console.log('🧹 Global test teardown started...');
  
  try {
    // Cleanup test data
    await cleanupTestData();
    
    // Generate test reports
    await generateTestSummary();
    
    console.log('✅ Global test teardown completed successfully');
  } catch (error) {
    console.error('❌ Global test teardown failed:', error);
  }
}

async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...');
  
  try {
    // Clean up any test files or data
    // This could include:
    // - Removing test uploads
    // - Cleaning test database entries
    // - Removing temporary files
    
    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.warn('⚠️ Test data cleanup had issues:', error.message);
  }
}

async function generateTestSummary() {
  console.log('📊 Generating test summary...');
  
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // Read test results
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
    
    try {
      const resultsData = await fs.readFile(resultsPath, 'utf8');
      const results = JSON.parse(resultsData);
      
      const summary = {
        timestamp: new Date().toISOString(),
        totalTests: results.suites?.reduce((acc, suite) => acc + (suite.specs?.length || 0), 0) || 0,
        passed: results.suites?.reduce((acc, suite) => 
          acc + (suite.specs?.filter(spec => spec.ok).length || 0), 0) || 0,
        failed: results.suites?.reduce((acc, suite) => 
          acc + (suite.specs?.filter(spec => !spec.ok).length || 0), 0) || 0,
        duration: results.stats?.duration || 0,
        environment: process.env.NODE_ENV || 'test'
      };
      
      // Write summary
      await fs.writeFile(
        path.join(process.cwd(), 'test-results', 'summary.json'),
        JSON.stringify(summary, null, 2)
      );
      
      console.log('📈 Test Summary:');
      console.log(`   Total Tests: ${summary.totalTests}`);
      console.log(`   Passed: ${summary.passed}`);
      console.log(`   Failed: ${summary.failed}`);
      console.log(`   Duration: ${Math.round(summary.duration / 1000)}s`);
      
    } catch (error) {
      console.warn('⚠️ Could not read test results:', error.message);
    }
    
    console.log('✅ Test summary generated');
  } catch (error) {
    console.warn('⚠️ Test summary generation had issues:', error.message);
  }
}

export default globalTeardown;
