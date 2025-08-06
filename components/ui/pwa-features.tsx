'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Download,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Bell,
  X,
  Check,
  Zap,
  Shield,
  Rocket,
  Sparkles,
  Home,
  Settings,
  ChevronRight,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      toast({
        title: "App Installed! 🎉",
        description: "Loconomy has been added to your home screen",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast({
        title: "Installing...",
        description: "Loconomy is being added to your device",
      });
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  if (isInstalled || !showInstallPrompt) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-2xl border-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white animate-in slide-in-from-bottom-full duration-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-white text-lg font-bold">Install Loconomy</CardTitle>
              <CardDescription className="text-white/80 text-sm">
                Get the full app experience
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInstallPrompt(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <Zap className="w-6 h-6 mx-auto text-yellow-300" />
            <p className="text-xs text-white/90">Faster</p>
          </div>
          <div className="space-y-1">
            <Shield className="w-6 h-6 mx-auto text-green-300" />
            <p className="text-xs text-white/90">Secure</p>
          </div>
          <div className="space-y-1">
            <WifiOff className="w-6 h-6 mx-auto text-blue-300" />
            <p className="text-xs text-white/90">Offline</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleInstallClick}
            className="flex-1 bg-white text-purple-600 hover:bg-white/90 font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowInstallPrompt(false)}
            className="text-white hover:bg-white/20"
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineBanner) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
      <Card className="bg-orange-500 text-white border-0 shadow-lg">
        <CardContent className="flex items-center gap-3 py-3 px-4">
          <WifiOff className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">You're offline</p>
            <p className="text-xs text-white/90">Some features may be limited</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOfflineBanner(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0 ml-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function AppShortcuts() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show app shortcuts with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowShortcuts(true);
      }

      // Hide shortcuts with Escape
      if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!showShortcuts) return null;

  const shortcuts = [
    { key: '⌘ + K', action: 'Open command palette', icon: Sparkles },
    { key: '⌘ + H', action: 'Go to homepage', icon: Home },
    { key: '⌘ + D', action: 'Open dashboard', icon: Monitor },
    { key: '⌘ + S', action: 'Open settings', icon: Settings },
    { key: '/', action: 'Focus search', icon: Zap },
    { key: 'Esc', action: 'Close dialogs', icon: X },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-600" />
            Keyboard Shortcuts
          </CardTitle>
          <CardDescription>
            Speed up your workflow with these shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <shortcut.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium">{shortcut.action}</span>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {shortcut.key}
              </Badge>
            </div>
          ))}
          <div className="pt-4 border-t">
            <Button
              onClick={() => setShowShortcuts(false)}
              className="w-full"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);

      // Show prompt after 30 seconds if not already granted/denied
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 30000);

        return () => clearTimeout(timer);
      }
    }
  }, [isClient]);

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      setShowPrompt(false);

      if (permission === 'granted') {
        toast({
          title: "Notifications enabled! 🔔",
          description: "You'll receive updates about your bookings and messages",
        });

        // Show a welcome notification
        new Notification('Welcome to Loconomy!', {
          body: 'You\'ll now receive important updates and notifications',
          icon: '/icon-192x192.png',
          tag: 'welcome'
        });
      }
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  };

  if (!isClient || typeof window === 'undefined' || !('Notification' in window) || permission === 'granted' || !showPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 w-80 z-50 shadow-2xl border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-white text-lg font-bold">Stay Updated</CardTitle>
              <CardDescription className="text-white/80 text-sm">
                Get notified about bookings & messages
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPrompt(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button 
            onClick={requestPermission}
            className="flex-1 bg-white text-purple-600 hover:bg-white/90 font-semibold"
          >
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowPrompt(false)}
            className="text-white hover:bg-white/20"
          >
            Not Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AppGestures({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches[0]) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Minimum swipe distance
      const minSwipeDistance = 100;

      // Horizontal swipes
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0) {
            // Swipe left - go forward
            if (window.history.length > 1) {
              window.history.forward();
            }
          } else {
            // Swipe right - go back
            window.history.back();
          }
        }
      }

      // Pull to refresh (swipe down from top)
      if (diffY < -minSwipeDistance && startY < 100 && window.scrollY === 0) {
        window.location.reload();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return <>{children}</>;
}

export function AppHaptics() {
  useEffect(() => {
    // Add haptic feedback to buttons
    const addHapticFeedback = (element: Element) => {
      element.addEventListener('click', () => {
        if ('vibrate' in navigator) {
          navigator.vibrate(10); // Light haptic feedback
        }
      });
    };

    // Add to all buttons
    document.querySelectorAll('button').forEach(addHapticFeedback);

    // Add to interactive elements
    document.querySelectorAll('[role="button"], [role="tab"], [role="menuitem"]').forEach(addHapticFeedback);

    // Success haptic for forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', () => {
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 30, 50]); // Success pattern
        }
      });
    });
  }, []);

  return null;
}

// Combined PWA Provider Component
export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }

    // Enable performance navigation timing
    if ('performance' in window && 'mark' in performance) {
      performance.mark('app-start');
    }
  }, []);

  return (
    <AppGestures>
      <AppHaptics />
      {children}
      <PWAInstallPrompt />
      <OfflineIndicator />
      <PushNotificationManager />
      <AppShortcuts />
    </AppGestures>
  );
}
