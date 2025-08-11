/**
 * CSR Safety Utilities
 * Provides safe access patterns and error handling for client-side rendering
 */

// Safe browser API access
export function safeWindow<T>(callback: (window: Window) => T, fallback?: T): T | undefined {
  if (typeof window === 'undefined') {
    return fallback;
  }
  
  try {
    return callback(window);
  } catch (error) {
    console.warn('Safe window access failed:', error);
    return fallback;
  }
}

// Safe localStorage access
export function safeLocalStorage(key: string, fallback?: string): string | null {
  return safeWindow(
    (window) => window.localStorage.getItem(key),
    fallback
  ) ?? null;
}

export function safeSetLocalStorage(key: string, value: string): boolean {
  return safeWindow((window) => {
    window.localStorage.setItem(key, value);
    return true;
  }, false) ?? false;
}

// Safe sessionStorage access
export function safeSessionStorage(key: string, fallback?: string): string | null {
  return safeWindow(
    (window) => window.sessionStorage.getItem(key),
    fallback
  ) ?? null;
}

// Safe document access
export function safeDocument<T>(callback: (document: Document) => T, fallback?: T): T | undefined {
  if (typeof document === 'undefined') {
    return fallback;
  }
  
  try {
    return callback(document);
  } catch (error) {
    console.warn('Safe document access failed:', error);
    return fallback;
  }
}

// Safe navigation API access
export function safeNavigator<T>(callback: (navigator: Navigator) => T, fallback?: T): T | undefined {
  return safeWindow(
    (window) => callback(window.navigator),
    fallback
  );
}

// Safe property access with null checks
export function safeAccess<T, R>(
  obj: T | null | undefined,
  accessor: (obj: T) => R,
  fallback?: R
): R | undefined {
  if (!obj) return fallback;
  
  try {
    return accessor(obj);
  } catch (error) {
    console.warn('Safe access failed:', error);
    return fallback;
  }
}

// Hydration-safe state initialization
export function createHydrationSafeState<T>(initialValue: T) {
  return {
    client: initialValue,
    server: undefined as T | undefined,
  };
}

// Enhanced error boundary data
export interface ErrorInfo {
  error: Error;
  errorInfo?: {
    componentStack: string;
  };
  timestamp: Date;
  userAgent?: string;
  url?: string;
}

// Safe async operation wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  options: {
    retries?: number;
    retryDelay?: number;
    onError?: (error: Error, attempt: number) => void;
    fallback?: T;
  } = {}
): Promise<T | undefined> {
  const { retries = 3, retryDelay = 1000, onError, fallback } = options;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      if (onError) {
        onError(err, attempt);
      }
      
      if (attempt === retries) {
        console.error(`Safe async operation failed after ${retries + 1} attempts:`, err);
        return fallback;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    }
  }
  
  return fallback;
}

// Safe API fetch wrapper
export async function safeFetch(
  url: string,
  options?: RequestInit,
  retryOptions?: {
    retries?: number;
    retryDelay?: number;
  }
): Promise<Response | null> {
  return safeAsync(
    () => fetch(url, options),
    {
      ...retryOptions,
      onError: (error, attempt) => {
        console.warn(`Fetch attempt ${attempt + 1} failed for ${url}:`, error);
      },
      fallback: null
    }
  ) as Promise<Response | null>;
}

// Type-safe event handling
export function safeEventHandler<T extends Event>(
  handler: (event: T) => void
): (event: T) => void {
  return (event: T) => {
    try {
      handler(event);
    } catch (error) {
      console.error('Event handler error:', error);
    }
  };
}

// Safe JSON parsing
export function safeJsonParse<T>(
  jsonString: string,
  fallback?: T
): T | undefined {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parse failed:', error);
    return fallback;
  }
}

// Client-only hook wrapper
export function useClientOnly<T>(
  hook: () => T,
  fallback?: T
): T | undefined {
  if (typeof window === 'undefined') {
    return fallback;
  }
  
  try {
    return hook();
  } catch (error) {
    console.warn('Client-only hook failed:', error);
    return fallback;
  }
}
