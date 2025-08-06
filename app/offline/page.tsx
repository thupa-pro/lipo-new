'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  WifiOff, 
  RefreshCw, 
  Home, 
  AlertCircle,
  Smartphone,
  Cloud,
  Signal
} from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/20">
              <WifiOff className="w-12 h-12 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            You're Offline
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isOnline 
              ? "Connection restored! You can now browse normally."
              : "It looks like you've lost your internet connection. Don't worry, some features are still available offline."
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Indicator */}
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            isOnline 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
              : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
          }`}>
            {isOnline ? (
              <>
                <Signal className="w-4 h-4" />
                <span className="text-sm font-medium">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Offline Mode</span>
              </>
            )}
          </div>

          {/* Offline Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Available Offline:</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Previously visited pages</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Cached service listings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>App functionality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Limited search capabilities</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={!isOnline}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {isOnline ? 'Refresh Page' : 'Checking Connection...'}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleRetry}
                variant="outline" 
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="flex-1"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-1">
                  Offline Tips
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Check your wifi or mobile data</li>
                  <li>��� Try moving to a better signal area</li>
                  <li>• Restart your router if using wifi</li>
                  <li>• Some content is cached for offline use</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
