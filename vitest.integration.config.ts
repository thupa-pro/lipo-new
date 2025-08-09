import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'integration',
    environment: 'happy-dom',
    setupFiles: ['./lib/testing/setup.ts'],
    include: ['**/*.integration.test.{ts,tsx}', '__tests__/integration/**/*.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/*.spec.ts', // Exclude E2E tests
    ],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types.ts',
      ],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
