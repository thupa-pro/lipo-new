import { logEnvironmentStatus } from './env-check';

// Only log environment status in development
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  // Run only on server-side in development
  console.log('\n🔧 Development Environment Check:');
  logEnvironmentStatus();
  console.log('');
}
