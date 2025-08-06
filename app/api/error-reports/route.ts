import { NextRequest, NextResponse } from 'next/server';
import type { ErrorReport } from '@/lib/error-monitoring';

interface ErrorReportPayload {
  reports: ErrorReport[];
  sessionId: string;
  userId?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: ErrorReportPayload = await request.json();
    
    // Validate the payload
    if (!payload.reports || !Array.isArray(payload.reports)) {
      return NextResponse.json(
        { error: 'Invalid payload: reports array required' },
        { status: 400 }
      );
    }

    // Process error reports
    const processedReports = payload.reports.map(report => ({
      ...report,
      receivedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || report.userAgent,
      ip: getClientIp(request),
    }));

    // Log errors for monitoring (in production, you'd store these in a database)
    console.log('[ErrorReports] Received error reports:', {
      sessionId: payload.sessionId,
      userId: payload.userId,
      count: processedReports.length,
      timestamp: payload.timestamp,
    });

    // Log individual errors with appropriate log levels
    processedReports.forEach(report => {
      const logLevel = getLogLevel(report);
      const logMessage = `[${logLevel.toUpperCase()}] ${report.type} error: ${report.message}`;
      
      if (logLevel === 'error' || logLevel === 'critical') {
        console.error(logMessage, {
          url: report.url,
          status: report.status,
          userId: report.userId,
          sessionId: report.sessionId,
          stack: report.stack,
          context: report.context,
        });
      } else {
        console.warn(logMessage, {
          url: report.url,
          status: report.status,
          userId: report.userId,
          sessionId: report.sessionId,
        });
      }
    });

    // In a production environment, you would:
    // 1. Store errors in a database (e.g., PostgreSQL, MongoDB)
    // 2. Send alerts for critical errors
    // 3. Update error metrics/dashboards
    // 4. Trigger automatic incident responses if needed

    // Example database storage (pseudo-code):
    // await storeErrorReports(processedReports);
    
    // Example alerting (pseudo-code):
    // const criticalErrors = processedReports.filter(isCriticalError);
    // if (criticalErrors.length > 0) {
    //   await sendAlerts(criticalErrors);
    // }

    return NextResponse.json({
      success: true,
      processed: processedReports.length,
      sessionId: payload.sessionId,
    });

  } catch (error) {
    console.error('[ErrorReports] Failed to process error reports:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process error reports',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // This endpoint could be used to retrieve error statistics
  // For now, return a simple health check
  return NextResponse.json({
    status: 'ok',
    endpoint: 'error-reports',
    timestamp: new Date().toISOString(),
  });
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cf = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  if (cf) {
    return cf;
  }
  
  return 'unknown';
}

function getLogLevel(report: ErrorReport): string {
  // Determine log level based on error characteristics
  if (report.type === 'javascript' && report.stack) {
    return 'error';
  }
  
  if (report.type === 'fetch' && report.status) {
    if (report.status >= 500) {
      return 'error';
    } else if (report.status >= 400) {
      return 'warn';
    }
  }
  
  if (report.type === 'timeout' || report.type === 'abort') {
    return 'warn';
  }
  
  if (report.type === 'network' && !navigator.onLine) {
    return 'info';
  }
  
  // Critical endpoints
  if (report.url && (
    report.url.includes('/api/stripe/') ||
    report.url.includes('/api/auth/') ||
    report.url.includes('/api/payments/')
  )) {
    return 'critical';
  }
  
  return 'info';
}

// Helper function to check if an error is critical (for alerting)
function isCriticalError(report: ErrorReport): boolean {
  return (
    report.type === 'javascript' ||
    (report.type === 'fetch' && report.status && report.status >= 500) ||
    (report.url && (
      report.url.includes('/api/stripe/') ||
      report.url.includes('/api/auth/') ||
      report.url.includes('/api/payments/')
    ))
  );
}

// Example function to store errors in a database (pseudo-code)
// async function storeErrorReports(reports: ErrorReport[]): Promise<void> {
//   // Implementation would depend on your database choice
//   // For example, with Prisma:
//   // 
//   // await prisma.errorReport.createMany({
//   //   data: reports.map(report => ({
//   //     id: report.id,
//   //     type: report.type,
//   //     message: report.message,
//   //     url: report.url,
//   //     status: report.status,
//   //     method: report.method,
//   //     timestamp: report.timestamp,
//   //     userAgent: report.userAgent,
//   //     userId: report.userId,
//   //     sessionId: report.sessionId,
//   //     stack: report.stack,
//   //     context: JSON.stringify(report.context),
//   //     retryAttempts: report.retryAttempts,
//   //     duration: report.duration,
//   //     networkStatus: JSON.stringify(report.networkStatus),
//   //   }))
//   // });
// }

// Example function to send alerts (pseudo-code)
// async function sendAlerts(criticalErrors: ErrorReport[]): Promise<void> {
//   // Implementation would depend on your alerting system
//   // For example, with email or Slack:
//   //
//   // const alertMessage = `Critical errors detected:
//   // ${criticalErrors.map(e => `- ${e.type}: ${e.message} (${e.url})`).join('\n')}`;
//   //
//   // await sendSlackAlert(alertMessage);
//   // await sendEmailAlert(alertMessage);
// }
