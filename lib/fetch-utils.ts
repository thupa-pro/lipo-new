/**
 * Enhanced fetch utility with comprehensive timeout, abort control, and error handling
 * Prevents "user aborted request" errors and provides robust network handling
 */

export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onTimeout?: () => void;
  onAbort?: () => void;
}

export interface FetchResult<T = any> {
  data: T | null;
  error: Error | null;
  status: number | null;
  ok: boolean;
  aborted: boolean;
  timedOut: boolean;
}

export class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class AbortError extends Error {
  constructor(message: string = 'Request was aborted') {
    super(message);
    this.name = 'AbortError';
  }
}

/**
 * Enhanced fetch with timeout, retry, and comprehensive error handling
 */
export async function enhancedFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  const {
    timeout = 30000, // 30 seconds default
    retries = 0,
    retryDelay = 1000,
    onRetry,
    onTimeout,
    onAbort,
    ...fetchOptions
  } = options;

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    const abortController = new AbortController();
    let timeoutId: NodeJS.Timeout | null = null;
    let timedOut = false;
    let aborted = false;

    try {
      // Set up timeout
      timeoutId = setTimeout(() => {
        timedOut = true;
        abortController.abort();
        onTimeout?.();
      }, timeout);

      // Merge abort signals if provided
      const signal = fetchOptions.signal 
        ? mergeAbortSignals([fetchOptions.signal, abortController.signal])
        : abortController.signal;

      // Make the request
      const response = await fetch(url, {
        ...fetchOptions,
        signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new FetchError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response
        );
      }

      // Parse JSON response
      let data: T | null = null;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseError) {
          console.warn('Failed to parse JSON response:', parseError);
          data = null;
        }
      }

      return {
        data,
        error: null,
        status: response.status,
        ok: true,
        aborted: false,
        timedOut: false,
      };

    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          aborted = true;
          onAbort?.();
          
          if (timedOut) {
            lastError = new TimeoutError(`Request to ${url} timed out after ${timeout}ms`);
          } else {
            lastError = new AbortError(`Request to ${url} was aborted`);
          }
        } else {
          lastError = error;
        }
      } else {
        lastError = new Error(`Unknown error occurred: ${error}`);
      }

      // Don't retry on abort or timeout
      if (aborted || timedOut) {
        break;
      }

      // Retry logic
      if (attempt < retries) {
        attempt++;
        onRetry?.(attempt, lastError);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        continue;
      }

      break;
    }
  }

  return {
    data: null,
    error: lastError,
    status: null,
    ok: false,
    aborted: lastError?.name === 'AbortError',
    timedOut: lastError?.name === 'TimeoutError',
  };
}

/**
 * Merge multiple AbortSignals into one
 */
function mergeAbortSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    
    signal.addEventListener('abort', () => {
      controller.abort();
    }, { once: true });
  }
  
  return controller.signal;
}

/**
 * Convenience function for GET requests
 */
export async function get<T = any>(
  url: string, 
  options: Omit<FetchOptions, 'method'> = {}
): Promise<FetchResult<T>> {
  return enhancedFetch<T>(url, { ...options, method: 'GET' });
}

/**
 * Convenience function for POST requests
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<FetchResult<T>> {
  return enhancedFetch<T>(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Convenience function for PUT requests
 */
export async function put<T = any>(
  url: string,
  data?: any,
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<FetchResult<T>> {
  return enhancedFetch<T>(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Convenience function for DELETE requests
 */
export async function del<T = any>(
  url: string,
  options: Omit<FetchOptions, 'method'> = {}
): Promise<FetchResult<T>> {
  return enhancedFetch<T>(url, { ...options, method: 'DELETE' });
}

/**
 * Create a cancellable fetch hook for React components
 */
export function useCancellableFetch() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancellableFetch = useCallback(async <T = any>(
    url: string,
    options: FetchOptions = {}
  ): Promise<FetchResult<T>> => {
    // Only work on client side
    if (typeof window === 'undefined') {
      return {
        data: null,
        error: new Error('SSR: fetch not available'),
        status: null,
        ok: false,
        aborted: false,
        timedOut: false,
      };
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new controller
    abortControllerRef.current = new AbortController();

    return enhancedFetch<T>(url, {
      ...options,
      signal: abortControllerRef.current.signal,
    });
  }, []);

  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cancelPendingRequests();
    };
  }, [cancelPendingRequests]);

  return { cancellableFetch, cancelPendingRequests };
}

// Re-export for convenience
export { useRef, useCallback, useEffect } from 'react';
