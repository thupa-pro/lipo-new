#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Bundle analysis configuration
const ANALYSIS_CONFIG = {
  outputDir: '.next/analyze',
  thresholds: {
    maxBundleSize: 250000, // 250KB
    maxChunkSize: 100000,  // 100KB
    maxAssetSize: 50000,   // 50KB
    duplicateThreshold: 2
  },
  excludePatterns: [
    /node_modules/,
    /\.map$/,
    /test\./,
    /spec\./
  ]
};

class BundleAnalyzer {
  constructor() {
    this.metrics = {
      totalSize: 0,
      chunks: [],
      assets: [],
      duplicates: [],
      unusedCode: [],
      recommendations: []
    };
  }

  async analyze() {
    console.log('🔍 Starting bundle analysis...\n');

    try {
      // Ensure output directory exists
      await this.ensureOutputDir();

      // Build the application
      await this.buildApplication();

      // Analyze bundle structure
      await this.analyzeBundleStructure();

      // Analyze dependencies
      await this.analyzeDependencies();

      // Detect duplicates
      await this.detectDuplicates();

      // Analyze tree-shaking opportunities
      await this.analyzeTreeShaking();

      // Generate recommendations
      await this.generateRecommendations();

      // Generate report
      await this.generateReport();

      console.log('✅ Bundle analysis completed!\n');
      console.log(`📊 Report saved to: ${ANALYSIS_CONFIG.outputDir}/bundle-analysis.json`);
      console.log(`📈 Visual report: ${ANALYSIS_CONFIG.outputDir}/bundle-analysis.html`);

    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      process.exit(1);
    }
  }

  async ensureOutputDir() {
    try {
      await fs.mkdir(ANALYSIS_CONFIG.outputDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async buildApplication() {
    console.log('🏗️  Building application for analysis...');
    
    try {
      // Set environment for analysis
      process.env.ANALYZE = 'true';
      process.env.NODE_ENV = 'production';

      // Build with webpack bundle analyzer
      execSync('npx next build', {
        stdio: 'inherit',
        env: {
          ...process.env,
          ANALYZE: 'true'
        }
      });

      console.log('✅ Build completed\n');
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  async analyzeBundleStructure() {
    console.log('📦 Analyzing bundle structure...');

    const buildDir = '.next';
    const staticDir = path.join(buildDir, 'static');

    try {
      // Analyze main bundles
      const chunks = await this.getChunkInfo(staticDir);
      this.metrics.chunks = chunks;

      // Calculate total size
      this.metrics.totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);

      // Check size thresholds
      const oversizedChunks = chunks.filter(chunk => 
        chunk.size > ANALYSIS_CONFIG.thresholds.maxChunkSize
      );

      if (oversizedChunks.length > 0) {
        this.metrics.recommendations.push({
          type: 'warning',
          category: 'bundle-size',
          message: `${oversizedChunks.length} chunks exceed size threshold`,
          details: oversizedChunks.map(chunk => ({
            file: chunk.file,
            size: chunk.size,
            sizeFormatted: this.formatBytes(chunk.size)
          })),
          impact: 'high',
          solution: 'Consider code splitting or lazy loading for large chunks'
        });
      }

      console.log(`   - Total bundle size: ${this.formatBytes(this.metrics.totalSize)}`);
      console.log(`   - Number of chunks: ${chunks.length}`);
      console.log(`   - Oversized chunks: ${oversizedChunks.length}\n`);

    } catch (error) {
      console.warn(`⚠️  Could not analyze bundle structure: ${error.message}`);
    }
  }

  async getChunkInfo(staticDir) {
    const chunks = [];

    try {
      const subdirs = await fs.readdir(staticDir);
      
      for (const subdir of subdirs) {
        const subdirPath = path.join(staticDir, subdir);
        const stat = await fs.stat(subdirPath);
        
        if (stat.isDirectory()) {
          const files = await fs.readdir(subdirPath);
          
          for (const file of files) {
            if (file.endsWith('.js') && !file.includes('.map')) {
              const filePath = path.join(subdirPath, file);
              const fileStat = await fs.stat(filePath);
              
              chunks.push({
                file: path.join(subdir, file),
                path: filePath,
                size: fileStat.size,
                type: this.getChunkType(file)
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Could not read static directory: ${error.message}`);
    }

    return chunks.sort((a, b) => b.size - a.size);
  }

  getChunkType(filename) {
    if (filename.includes('main')) return 'main';
    if (filename.includes('framework')) return 'framework';
    if (filename.includes('commons')) return 'commons';
    if (filename.includes('vendor')) return 'vendor';
    if (filename.match(/^\d+\./)) return 'async';
    return 'other';
  }

  async analyzeDependencies() {
    console.log('📚 Analyzing dependencies...');

    try {
      const packageJson = JSON.parse(
        await fs.readFile('package.json', 'utf8')
      );

      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };

      // Analyze package sizes
      const largeDependencies = [];
      const duplicateDependencies = [];

      for (const [name, version] of Object.entries(dependencies)) {
        // Check for potential optimizations
        if (name.includes('moment') && !name.includes('dayjs')) {
          this.metrics.recommendations.push({
            type: 'optimization',
            category: 'dependencies',
            message: 'Consider replacing Moment.js with Day.js',
            details: {
              current: name,
              suggestion: 'dayjs',
              impact: 'Bundle size reduction of ~67%'
            },
            impact: 'medium',
            solution: 'Replace moment with dayjs for smaller bundle size'
          });
        }

        if (name.includes('lodash') && !name.includes('lodash-es')) {
          this.metrics.recommendations.push({
            type: 'optimization',
            category: 'dependencies',
            message: 'Use lodash-es for better tree-shaking',
            details: {
              current: name,
              suggestion: 'lodash-es',
              impact: 'Better tree-shaking support'
            },
            impact: 'medium',
            solution: 'Switch to lodash-es and use named imports'
          });
        }
      }

      console.log(`   - Total dependencies: ${Object.keys(dependencies).length}`);
      console.log(`   - Optimization opportunities: ${this.metrics.recommendations.filter(r => r.category === 'dependencies').length}\n`);

    } catch (error) {
      console.warn(`⚠️  Could not analyze dependencies: ${error.message}`);
    }
  }

  async detectDuplicates() {
    console.log('🔍 Detecting duplicate code...');

    try {
      // This is a simplified duplicate detection
      // In a real implementation, you'd use tools like webpack-bundle-analyzer
      const chunks = this.metrics.chunks;
      const potentialDuplicates = [];

      // Check for similar chunk names that might indicate duplicates
      for (let i = 0; i < chunks.length; i++) {
        for (let j = i + 1; j < chunks.length; j++) {
          const similarity = this.calculateSimilarity(chunks[i].file, chunks[j].file);
          if (similarity > 0.7) {
            potentialDuplicates.push({
              file1: chunks[i].file,
              file2: chunks[j].file,
              similarity: similarity,
              size1: chunks[i].size,
              size2: chunks[j].size
            });
          }
        }
      }

      if (potentialDuplicates.length > 0) {
        this.metrics.recommendations.push({
          type: 'warning',
          category: 'duplicates',
          message: `Found ${potentialDuplicates.length} potential duplicate chunks`,
          details: potentialDuplicates,
          impact: 'medium',
          solution: 'Review chunk splitting configuration and shared dependencies'
        });
      }

      this.metrics.duplicates = potentialDuplicates;
      console.log(`   - Potential duplicates found: ${potentialDuplicates.length}\n`);

    } catch (error) {
      console.warn(`⚠️  Could not detect duplicates: ${error.message}`);
    }
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  async analyzeTreeShaking() {
    console.log('🌳 Analyzing tree-shaking opportunities...');

    try {
      // Check for common tree-shaking issues
      const packageJson = JSON.parse(
        await fs.readFile('package.json', 'utf8')
      );

      const dependencies = packageJson.dependencies || {};
      const treeShakingIssues = [];

      // Check for non-ES modules
      const nonESModules = Object.keys(dependencies).filter(dep => {
        return !dep.includes('-es') && 
               ['lodash', 'moment', 'ramda'].includes(dep);
      });

      if (nonESModules.length > 0) {
        treeShakingIssues.push({
          type: 'non-es-modules',
          modules: nonESModules,
          impact: 'Poor tree-shaking support'
        });
      }

      // Check Next.js configuration
      const nextConfigPath = 'next.config.mjs';
      try {
        const nextConfig = await fs.readFile(nextConfigPath, 'utf8');
        
        if (!nextConfig.includes('experimental')) {
          this.metrics.recommendations.push({
            type: 'optimization',
            category: 'tree-shaking',
            message: 'Enable experimental tree-shaking optimizations',
            details: {
              config: 'experimental.optimizePackageImports',
              benefit: 'Better tree-shaking for packages'
            },
            impact: 'medium',
            solution: 'Add optimizePackageImports to experimental config'
          });
        }
      } catch (error) {
        // next.config.mjs doesn't exist or can't be read
      }

      this.metrics.unusedCode = treeShakingIssues;
      console.log(`   - Tree-shaking issues found: ${treeShakingIssues.length}\n`);

    } catch (error) {
      console.warn(`⚠️  Could not analyze tree-shaking: ${error.message}`);
    }
  }

  async generateRecommendations() {
    console.log('💡 Generating optimization recommendations...');

    // Performance recommendations based on metrics
    const totalSizeMB = this.metrics.totalSize / (1024 * 1024);
    
    if (totalSizeMB > 1) {
      this.metrics.recommendations.push({
        type: 'warning',
        category: 'performance',
        message: 'Total bundle size is large',
        details: {
          currentSize: this.formatBytes(this.metrics.totalSize),
          recommendation: 'Under 1MB for optimal performance'
        },
        impact: 'high',
        solution: 'Implement code splitting, lazy loading, and remove unused dependencies'
      });
    }

    // Code splitting recommendations
    const mainChunks = this.metrics.chunks.filter(chunk => chunk.type === 'main');
    const largeMainChunks = mainChunks.filter(chunk => chunk.size > 150000);
    
    if (largeMainChunks.length > 0) {
      this.metrics.recommendations.push({
        type: 'optimization',
        category: 'code-splitting',
        message: 'Main chunks could benefit from splitting',
        details: {
          chunks: largeMainChunks.map(chunk => ({
            file: chunk.file,
            size: this.formatBytes(chunk.size)
          }))
        },
        impact: 'medium',
        solution: 'Use dynamic imports and route-based code splitting'
      });
    }

    // Async chunk analysis
    const asyncChunks = this.metrics.chunks.filter(chunk => chunk.type === 'async');
    if (asyncChunks.length < 3 && this.metrics.chunks.length > 5) {
      this.metrics.recommendations.push({
        type: 'optimization',
        category: 'code-splitting',
        message: 'Limited use of async chunks detected',
        details: {
          asyncChunks: asyncChunks.length,
          totalChunks: this.metrics.chunks.length
        },
        impact: 'medium',
        solution: 'Increase use of dynamic imports for better code splitting'
      });
    }

    console.log(`   - Total recommendations: ${this.metrics.recommendations.length}\n`);
  }

  async generateReport() {
    console.log('📝 Generating analysis report...');

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSize: this.metrics.totalSize,
        totalSizeFormatted: this.formatBytes(this.metrics.totalSize),
        chunkCount: this.metrics.chunks.length,
        recommendationCount: this.metrics.recommendations.length,
        criticalIssues: this.metrics.recommendations.filter(r => r.impact === 'high').length
      },
      chunks: this.metrics.chunks.map(chunk => ({
        ...chunk,
        sizeFormatted: this.formatBytes(chunk.size)
      })),
      recommendations: this.metrics.recommendations,
      duplicates: this.metrics.duplicates,
      unusedCode: this.metrics.unusedCode,
      thresholds: ANALYSIS_CONFIG.thresholds
    };

    // Save JSON report
    await fs.writeFile(
      path.join(ANALYSIS_CONFIG.outputDir, 'bundle-analysis.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate HTML report
    await this.generateHTMLReport(report);

    // Print summary
    this.printSummary(report);
  }

  async generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle Analysis Report</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 6px; text-align: center; min-width: 120px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #333; }
        .metric-label { font-size: 12px; color: #666; margin-top: 5px; }
        .recommendation { padding: 15px; margin: 10px 0; border-left: 4px solid #ddd; background: #f8f9fa; border-radius: 4px; }
        .recommendation.warning { border-color: #ffc107; background: #fff3cd; }
        .recommendation.optimization { border-color: #17a2b8; background: #d1ecf1; }
        .recommendation.error { border-color: #dc3545; background: #f8d7da; }
        .chunk-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
        .chunk-item { padding: 12px; background: #f8f9fa; border-radius: 4px; border-left: 4px solid #007bff; }
        .chunk-size { font-weight: bold; color: #007bff; }
        .chunk-type { font-size: 12px; color: #666; text-transform: uppercase; }
        h1, h2, h3 { color: #333; }
        .impact-high { color: #dc3545; font-weight: bold; }
        .impact-medium { color: #ffc107; font-weight: bold; }
        .impact-low { color: #28a745; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bundle Analysis Report</h1>
            <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
        </div>

        <div class="card">
            <h2>Summary</h2>
            <div>
                <div class="metric">
                    <div class="metric-value">${report.summary.totalSizeFormatted}</div>
                    <div class="metric-label">Total Bundle Size</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${report.summary.chunkCount}</div>
                    <div class="metric-label">Chunks</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${report.summary.recommendationCount}</div>
                    <div class="metric-label">Recommendations</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${report.summary.criticalIssues}</div>
                    <div class="metric-label">Critical Issues</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>Recommendations</h2>
            ${report.recommendations.map(rec => `
                <div class="recommendation ${rec.type}">
                    <h3>${rec.message}</h3>
                    <p><span class="impact-${rec.impact}">Impact: ${rec.impact.toUpperCase()}</span></p>
                    <p><strong>Solution:</strong> ${rec.solution}</p>
                    ${rec.details ? `<details><summary>Details</summary><pre>${JSON.stringify(rec.details, null, 2)}</pre></details>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="card">
            <h2>Bundle Chunks</h2>
            <div class="chunk-list">
                ${report.chunks.map(chunk => `
                    <div class="chunk-item">
                        <div class="chunk-size">${chunk.sizeFormatted}</div>
                        <div>${chunk.file}</div>
                        <div class="chunk-type">${chunk.type}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>
    `;

    await fs.writeFile(
      path.join(ANALYSIS_CONFIG.outputDir, 'bundle-analysis.html'),
      html
    );
  }

  printSummary(report) {
    console.log('📊 BUNDLE ANALYSIS SUMMARY');
    console.log('═'.repeat(50));
    console.log(`📦 Total Bundle Size: ${report.summary.totalSizeFormatted}`);
    console.log(`🔢 Number of Chunks: ${report.summary.chunkCount}`);
    console.log(`💡 Recommendations: ${report.summary.recommendationCount}`);
    console.log(`🚨 Critical Issues: ${report.summary.criticalIssues}`);
    console.log('');

    if (report.recommendations.length > 0) {
      console.log('🎯 TOP RECOMMENDATIONS:');
      console.log('─'.repeat(30));
      
      report.recommendations
        .filter(rec => rec.impact === 'high')
        .slice(0, 3)
        .forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.message}`);
          console.log(`   💡 ${rec.solution}`);
          console.log('');
        });
    }

    console.log('✅ Analysis complete! Check the HTML report for detailed insights.');
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the analyzer
async function main() {
  const analyzer = new BundleAnalyzer();
  await analyzer.analyze();
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
}

module.exports = BundleAnalyzer;
