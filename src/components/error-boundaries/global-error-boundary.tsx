'use client';

import React from 'react';

interface GlobalErrorBoundaryState {
  hasError: boolean;
}

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

export class GlobalErrorBoundary extends React.Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): GlobalErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    
    // Check if it's a webpack module loading error
    const isWebpackError = error.message.includes('reading \'call\'') ||
                          error.stack?.includes('webpack') ||
                          error.stack?.includes('__webpack_require__');
    
    if (isWebpackError) {
      console.error('Webpack module loading error detected. Attempting recovery...');
      // Attempt to recover by reloading after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      // Minimal fallback UI for critical errors
      return (
        <html lang="en">
          <body style={{ 
            margin: 0, 
            padding: '2rem', 
            fontFamily: 'system-ui, sans-serif',
            backgroundColor: '#f8fafc',
            color: '#1e293b',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              textAlign: 'center',
              maxWidth: '500px',
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                Something went wrong
              </h1>
              <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
                A technical error occurred. The page will reload automatically.
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Reload Page
              </button>
            </div>
          </body>
        </html>
      );
    }

    return this.props.children;
  }
}
