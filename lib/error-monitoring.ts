/**
 * Comprehensive Error Monitoring and Reporting System
 * Tracks fetch errors, timeouts, aborts, and provides detailed insights
 */

export interface ErrorReport {
  id: string;
  type: 'fetch' | 'timeout' | 'abort' | 'network' | 'javascript' | 'resource';
  message: string;
  url?: string;
  status?: number;
  method?: string;
  timestamp: Date;
  userAgent: string;
  userId?: string;
  sessionId: string;
  stack?: string;
  context?: Record<string, any>;
  retryAttempts?: number;
  duration?: number;
  networkStatus?: {
    online: boolean;
    type?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
}

export interface ErrorStats {
  total: number;
  byType: Record<string, number>;
  byUrl: Record<string, number>;
  byStatus: Record<string, number>;
  recentErrors: ErrorReport[];
  patterns: ErrorPattern[];
}

export interface ErrorPattern {
  pattern: string;
  count: number;
  frequency: number;
  lastOccurrence: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorMonitor {
  private errors: ErrorReport[] = [];
  private sessionId: string;
  private userId?: string;
  private maxErrors = 100; // Keep last 100 errors
  private reportingEndpoint = '/api/error-reports';
  private batchSize = 10;
  private batchInterval = 30000; // 30 seconds
  private pendingReports: ErrorReport[] = [];
  private isReporting = false;
  private isClient = false;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.sessionId = this.generateSessionId();

    if (this.isClient) {
      this.setupGlobalErrorHandlers();
      this.startBatchReporting();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript',
        message: event.message,
        url: event.filename,
        stack: event.error?.stack,
        context: {
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'javascript',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: {
          promise: true,
        },
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        this.reportError({
          type: 'resource',
          message: `Failed to load resource: ${target.tagName}`,
          url: (target as any).src || (target as any).href,
          context: {
            tagName: target.tagName,
            id: target.id,
            className: target.className,
          },
        });
      }
    }, true);
  }

  private getNetworkStatus() {
    if (!this.isClient || typeof navigator === 'undefined') return undefined;

    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    return {
      online: navigator.onLine,
      type: connection?.type,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
    };
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public reportError(errorData: Partial<ErrorReport>) {
    if (!this.isClient) return;

    const error: ErrorReport = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: errorData.type || 'javascript',
      message: errorData.message || 'Unknown error',
      url: errorData.url,
      status: errorData.status,
      method: errorData.method,
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
      userId: this.userId,
      sessionId: this.sessionId,
      stack: errorData.stack,
      context: errorData.context,
      retryAttempts: errorData.retryAttempts,
      duration: errorData.duration,
      networkStatus: this.getNetworkStatus(),
    };

    this.errors.push(error);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Add to pending reports for batch sending
    this.pendingReports.push(error);

    // Immediate reporting for critical errors
    if (this.isCriticalError(error)) {
      this.reportImmediately(error);
    }

    console.warn('[ErrorMonitor] Error reported:', error);
  }

  public reportFetchError(
    url: string,
    error: Error,
    options: {
      method?: string;
      status?: number;
      duration?: number;
      retryAttempts?: number;
    } = {}
  ) {
    let type: ErrorReport['type'] = 'fetch';
    
    if (error.name === 'AbortError') {
      type = 'abort';
    } else if (error.message.includes('timeout')) {
      type = 'timeout';
    } else if (!navigator.onLine) {
      type = 'network';
    }

    this.reportError({
      type,
      message: error.message,
      url,
      status: options.status,
      method: options.method,
      duration: options.duration,
      retryAttempts: options.retryAttempts,
      stack: error.stack,
      context: {
        errorName: error.name,
        fetchOptions: options,
      },
    });
  }

  private isCriticalError(error: ErrorReport): boolean {
    // Define criteria for critical errors
    return (
      error.type === 'javascript' ||
      (error.type === 'fetch' && error.status && error.status >= 500) ||
      (error.url && error.url.includes('/api/stripe/')) ||
      (error.url && error.url.includes('/api/auth/'))
    );
  }

  private async reportImmediately(error: ErrorReport) {
    if (this.isReporting) return;

    try {
      this.isReporting = true;
      await this.sendErrorReports([error]);
    } catch (err) {
      console.error('[ErrorMonitor] Failed to send immediate error report:', err);
    } finally {
      this.isReporting = false;
    }
  }

  private startBatchReporting() {
    if (!this.isClient || typeof window === 'undefined') return;

    setInterval(() => {
      if (this.pendingReports.length > 0) {
        this.sendBatchReports();
      }
    }, this.batchInterval);

    // Send reports when page is about to unload
    window.addEventListener('beforeunload', () => {
      if (this.pendingReports.length > 0) {
        this.sendBatchReports(true);
      }
    });

    // Send reports when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.pendingReports.length > 0) {
        this.sendBatchReports(true);
      }
    });
  }

  private async sendBatchReports(useBeacon = false) {
    if (this.isReporting || this.pendingReports.length === 0) return;

    const reportsToSend = this.pendingReports.splice(0, this.batchSize);
    
    try {
      this.isReporting = true;
      
      if (useBeacon && navigator.sendBeacon) {
        // Use sendBeacon for reliability during page unload
        const blob = new Blob([JSON.stringify(reportsToSend)], {
          type: 'application/json'
        });
        navigator.sendBeacon(this.reportingEndpoint, blob);
      } else {
        await this.sendErrorReports(reportsToSend);
      }
    } catch (error) {
      console.error('[ErrorMonitor] Failed to send batch error reports:', error);
      // Put reports back at the beginning of pending queue
      this.pendingReports.unshift(...reportsToSend);
    } finally {
      this.isReporting = false;
    }
  }

  private async sendErrorReports(reports: ErrorReport[]) {
    const response = await fetch(this.reportingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reports,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Error reporting failed: ${response.status}`);
    }
  }

  public getStats(): ErrorStats {
    const byType: Record<string, number> = {};
    const byUrl: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    this.errors.forEach(error => {
      byType[error.type] = (byType[error.type] || 0) + 1;
      
      if (error.url) {
        const url = this.normalizeUrl(error.url);
        byUrl[url] = (byUrl[url] || 0) + 1;
      }
      
      if (error.status) {
        byStatus[error.status.toString()] = (byStatus[error.status.toString()] || 0) + 1;
      }
    });

    return {
      total: this.errors.length,
      byType,
      byUrl,
      byStatus,
      recentErrors: this.errors.slice(-10),
      patterns: this.detectPatterns(),
    };
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.pathname}${urlObj.search ? '?' + urlObj.search : ''}`;
    } catch {
      return url;
    }
  }

  private detectPatterns(): ErrorPattern[] {
    const patterns: Record<string, { count: number; lastOccurrence: Date }> = {};
    
    this.errors.forEach(error => {
      const pattern = `${error.type}:${error.url || 'unknown'}`;
      if (!patterns[pattern]) {
        patterns[pattern] = { count: 0, lastOccurrence: error.timestamp };
      }
      patterns[pattern].count++;
      if (error.timestamp > patterns[pattern].lastOccurrence) {
        patterns[pattern].lastOccurrence = error.timestamp;
      }
    });

    return Object.entries(patterns)
      .map(([pattern, data]) => ({
        pattern,
        count: data.count,
        frequency: data.count / this.errors.length,
        lastOccurrence: data.lastOccurrence,
        severity: this.calculateSeverity(data.count, data.count / this.errors.length),
      }))
      .sort((a, b) => b.count - a.count);
  }

  private calculateSeverity(count: number, frequency: number): ErrorPattern['severity'] {
    if (frequency > 0.5 || count > 20) return 'critical';
    if (frequency > 0.2 || count > 10) return 'high';
    if (frequency > 0.1 || count > 5) return 'medium';
    return 'low';
  }

  public clearErrors() {
    this.errors = [];
    this.pendingReports = [];
  }

  public exportErrors(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      userId: this.userId,
      errors: this.errors,
      stats: this.getStats(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  public getErrorsForDebug(): ErrorReport[] {
    return [...this.errors];
  }
}

// Global error monitor instance
export const errorMonitor = new ErrorMonitor();

// Enhanced fetch wrapper with error monitoring
export async function monitoredFetch(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const startTime = Date.now();
  const { timeout = 30000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    const duration = Date.now() - startTime;

    // Report errors for non-successful responses
    if (!response.ok) {
      errorMonitor.reportFetchError(url, new Error(`HTTP ${response.status}: ${response.statusText}`), {
        method: fetchOptions.method || 'GET',
        status: response.status,
        duration,
      });
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    const duration = Date.now() - startTime;
    
    errorMonitor.reportFetchError(url, error as Error, {
      method: fetchOptions.method || 'GET',
      duration,
    });

    throw error;
  }
}

// Hook for React components to access error monitoring
export function useErrorMonitoring() {
  const reportError = (error: Partial<ErrorReport>) => {
    errorMonitor.reportError(error);
  };

  const reportFetchError = (url: string, error: Error, options: any = {}) => {
    errorMonitor.reportFetchError(url, error, options);
  };

  const getStats = () => {
    return errorMonitor.getStats();
  };

  const clearErrors = () => {
    errorMonitor.clearErrors();
  };

  return {
    reportError,
    reportFetchError,
    getStats,
    clearErrors,
    errorMonitor,
  };
}

export default errorMonitor;
