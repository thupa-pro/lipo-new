"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  RefreshCw, 
  Globe,
  Zap,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface NetworkError {
  id: string;
  message: string;
  type: 'timeout' | 'abort' | 'network' | 'server';
  timestamp: Date;
  url?: string;
  status?: number;
  retryable: boolean;
}

interface NetworkContextType {
  status: NetworkStatus;
  errors: NetworkError[];
  addError: (error: Omit<NetworkError, 'id' | 'timestamp'>) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  retryRequest: (errorId: string, retryFn: () => Promise<void>) => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export function useNetworkStatus() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within NetworkProvider');
  }
  return context;
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false,
  });
  
  const [errors, setErrors] = useState<NetworkError[]>([]);

  const addError = useCallback((error: Omit<NetworkError, 'id' | 'timestamp'>) => {
    const newError: NetworkError = {
      ...error,
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setErrors(prev => {
      // Limit to 5 most recent errors
      const filtered = prev.slice(-4);
      return [...filtered, newError];
    });

    // Auto-remove error after 10 seconds for non-critical errors
    if (error.type !== 'network') {
      setTimeout(() => {
        setErrors(prev => prev.filter(err => err.id !== newError.id));
      }, 10000);
    }
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;

      setStatus({
        isOnline: navigator.onLine,
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false,
      });
    };

    updateNetworkStatus();

    const handleOnline = () => {
      updateNetworkStatus();
      // Clear network-related errors when coming back online
      setErrors(prev => prev.filter(error => error.type !== 'network'));
    };

    const handleOffline = () => {
      updateNetworkStatus();
      addError({
        message: 'Internet connection lost. Some features may not work.',
        type: 'network',
        retryable: true,
      });
    };

    const handleConnectionChange = () => {
      updateNetworkStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [addError]);


  const clearErrors = () => {
    setErrors([]);
  };

  const retryRequest = async (errorId: string, retryFn: () => Promise<void>) => {
    try {
      await retryFn();
      removeError(errorId);
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const value: NetworkContextType = {
    status,
    errors,
    addError,
    removeError,
    clearErrors,
    retryRequest,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
      <NetworkStatusIndicator />
      <NetworkErrorDisplay />
    </NetworkContext.Provider>
  );
}

function NetworkStatusIndicator() {
  const { status } = useNetworkStatus();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show indicator briefly when connection changes
    setShow(true);
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, [status.isOnline]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <Card className={cn(
        "border-2 shadow-lg",
        status.isOnline 
          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
      )}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            {status.isOnline ? (
              <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
            <span className={cn(
              "text-sm font-medium",
              status.isOnline 
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            )}>
              {status.isOnline ? 'Connected' : 'Offline'}
            </span>
            {status.isOnline && status.effectiveType && (
              <Badge variant="outline" className="text-xs">
                {status.effectiveType}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NetworkErrorDisplay() {
  const { errors, removeError, retryRequest } = useNetworkStatus();

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {errors.map((error) => (
        <Alert
          key={error.id}
          variant={error.type === 'network' ? 'destructive' : 'default'}
          className="animate-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {error.type === 'timeout' && <Clock className="w-4 h-4" />}
              {error.type === 'abort' && <XCircle className="w-4 h-4" />}
              {error.type === 'network' && <WifiOff className="w-4 h-4" />}
              {error.type === 'server' && <AlertTriangle className="w-4 h-4" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <AlertDescription className="text-sm">
                {error.message}
                {error.url && (
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    {error.url}
                  </div>
                )}
                {error.status && (
                  <div className="text-xs text-muted-foreground">
                    Status: {error.status}
                  </div>
                )}
              </AlertDescription>
              
              <div className="flex items-center gap-2 mt-2">
                {error.retryable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => retryRequest(error.id, async () => {
                      // This would be implemented by the component that created the error
                      window.location.reload();
                    })}
                    className="h-6 text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeError(error.id)}
                  className="h-6 text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
}

export function ConnectionQualityIndicator() {
  const { status } = useNetworkStatus();

  if (!status.isOnline) {
    return (
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm">Offline</span>
      </div>
    );
  }

  const getQualityColor = () => {
    if (status.effectiveType === '4g' || status.downlink > 2) {
      return "text-green-600 dark:text-green-400";
    } else if (status.effectiveType === '3g' || status.downlink > 0.5) {
      return "text-yellow-600 dark:text-yellow-400";
    } else {
      return "text-red-600 dark:text-red-400";
    }
  };

  const getQualityIcon = () => {
    if (status.effectiveType === '4g' || status.downlink > 2) {
      return <Zap className="w-4 h-4" />;
    } else if (status.effectiveType === '3g' || status.downlink > 0.5) {
      return <Globe className="w-4 h-4" />;
    } else {
      return <Wifi className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn("flex items-center gap-2", getQualityColor())}>
      {getQualityIcon()}
      <span className="text-sm capitalize">
        {status.effectiveType !== 'unknown' ? status.effectiveType : 'Connected'}
      </span>
      {status.saveData && (
        <Badge variant="outline" className="text-xs">
          Data Saver
        </Badge>
      )}
    </div>
  );
}

// Hook for handling network-aware fetch requests
export function useNetworkAwareFetch() {
  const { addError, status } = useNetworkStatus();

  const handleFetchError = (error: Error, url: string, status?: number) => {
    if (error.name === 'AbortError') {
      addError({
        message: 'Request was cancelled or timed out',
        type: 'abort',
        url,
        retryable: true,
      });
    } else if (!navigator.onLine) {
      addError({
        message: 'No internet connection available',
        type: 'network',
        url,
        retryable: true,
      });
    } else if (error.message.includes('timeout')) {
      addError({
        message: 'Request timed out. Please try again.',
        type: 'timeout',
        url,
        retryable: true,
      });
    } else if (status && status >= 500) {
      addError({
        message: 'Server error. Please try again later.',
        type: 'server',
        url,
        status,
        retryable: true,
      });
    } else {
      addError({
        message: error.message || 'Network request failed',
        type: 'network',
        url,
        status,
        retryable: true,
      });
    }
  };

  return { handleFetchError, isOnline: status.isOnline };
}
