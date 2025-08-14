/**
 * Environment validation utility for development and production
 */

export interface EnvironmentStatus {
  isValid: boolean;
  missing: string[];
  warnings: string[];
  isProduction: boolean;
}

const REQUIRED_ENV_VARS = {
  supabase: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ],
  stripe: [
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY'
  ],
  optional: [
    'GOOGLE_AI_API_KEY',
    'RESEND_API_KEY',
    'SENTRY_DSN'
  ]
} as const;

const PLACEHOLDER_VALUES = [
  'your-project-ref',
  'your_supabase_anon_key_here',
  'dummy',
  'placeholder',
  'example'
] as const;

export function checkEnvironment(): EnvironmentStatus {
  const missing: string[] = [];
  const warnings: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';

  // Check Supabase configuration
  for (const envVar of REQUIRED_ENV_VARS.supabase) {
    const value = process.env[envVar];
    
    if (!value) {
      missing.push(envVar);
    } else if (PLACEHOLDER_VALUES.some(placeholder => value.includes(placeholder))) {
      warnings.push(`${envVar} appears to be using placeholder values`);
    }
  }

  // Check Stripe configuration (optional for development)
  if (isProduction) {
    for (const envVar of REQUIRED_ENV_VARS.stripe) {
      const value = process.env[envVar];
      
      if (!value) {
        missing.push(envVar);
      } else if (PLACEHOLDER_VALUES.some(placeholder => value.includes(placeholder))) {
        warnings.push(`${envVar} appears to be using placeholder values`);
      }
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
    isProduction
  };
}

export function logEnvironmentStatus(): void {
  const status = checkEnvironment();

  if (status.isValid && status.warnings.length === 0) {
    console.log('✅ All environment variables are properly configured');
    return;
  }

  if (status.missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    status.missing.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
  }

  if (status.warnings.length > 0) {
    console.warn('⚠️  Environment variable warnings:');
    status.warnings.forEach(warning => {
      console.warn(`   - ${warning}`);
    });
  }

  if (!status.isProduction && status.missing.length > 0) {
    console.log('ℹ️  Running in development mode with fallback data');
  }
}

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return !!(
    url && 
    key && 
    !PLACEHOLDER_VALUES.some(placeholder => url.includes(placeholder)) &&
    !PLACEHOLDER_VALUES.some(placeholder => key.includes(placeholder))
  );
}

// Check if Stripe is properly configured
export function isStripeConfigured(): boolean {
  const publishable = process.env.STRIPE_PUBLISHABLE_KEY;
  const secret = process.env.STRIPE_SECRET_KEY;
  
  return !!(
    publishable && 
    secret && 
    !PLACEHOLDER_VALUES.some(placeholder => publishable.includes(placeholder)) &&
    !PLACEHOLDER_VALUES.some(placeholder => secret.includes(placeholder))
  );
}
