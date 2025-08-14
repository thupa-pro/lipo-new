"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { enhancedRecommendationEngine } from '@/lib/ai/enhanced-recommendations';
import { geolocationService } from '@/lib/location/geolocation-service';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download, 
  Zap, 
  MapPin, 
  Clock, 
  TrendingUp,
  Battery,
  Signal,
  Eye,
  Brain,
  Lightbulb
} from 'lucide-react';

interface MobileContext {
  online: boolean;
  batteryLevel: number;
  networkSpeed: 'slow' | 'medium' | 'fast';
  deviceMemory: number;
  viewport: { width: number; height: number };
  orientation: 'portrait' | 'landscape';
  touchCapabilities: boolean;
  installPrompt?: any;
}

interface PredictiveContent {
  id: string;
  type: 'service' | 'provider' | 'booking' | 'navigation';
  title: string;
  description: string;
  confidence: number;
  priority: number;
  preloadData?: any;
  estimatedUsage: Date;
  reasons: string[];
}

interface SmartCacheItem {
  key: string;
  data: any;
  timestamp: Date;
  expiresAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  usage: number;
  compressed: boolean;
  predictedNextAccess?: Date;
}

interface OfflineAction {
  id: string;
  type: 'booking' | 'message' | 'rating' | 'search' | 'profile_update';
  action: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  critical: boolean;
}

interface GestureShortcut {
  id: string;
  gesture: 'swipe_left' | 'swipe_right' | 'swipe_up' | 'swipe_down' | 'long_press' | 'double_tap';
  action: string;
  context?: string;
  enabled: boolean;
  customizable: boolean;
}

interface SmartNotification {
  id: string;
  title: string;
  body: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  contextual: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  schedule?: {
    optimal: boolean;
    delay?: number;
    conditions?: string[];
  };
}

export default function EnhancedMobileExperience({ userId }: { userId: string }) {
  const [mobileContext, setMobileContext] = useState<MobileContext>({
    online: navigator.onLine,
    batteryLevel: 100,
    networkSpeed: 'fast',
    deviceMemory: 4,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    touchCapabilities: 'ontouchstart' in window
  });

  const [predictiveContent, setPredictiveContent] = useState<PredictiveContent[]>([]);
  const [smartCache, setSmartCache] = useState<Map<string, SmartCacheItem>>(new Map());
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);
  const [gestureShortcuts, setGestureShortcuts] = useState<GestureShortcut[]>([]);
  const [adaptiveUI, setAdaptiveUI] = useState({
    layout: 'auto', // 'compact' | 'standard' | 'expanded' | 'auto'
    fontSize: 'medium', // 'small' | 'medium' | 'large'
    animations: true,
    autoOptimize: true,
    darkMode: 'auto' // 'light' | 'dark' | 'auto'
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    batteryImpact: 'low' as 'low' | 'medium' | 'high',
    networkUsage: 0
  });

  // Initialize mobile-specific features
  useEffect(() => {
    initializeMobileFeatures();
    setupPerformanceMonitoring();
    setupOfflineSupport();
    setupPredictivePreloading();
    setupGestureControls();
    setupSmartNotifications();
  }, [userId]);

  // Real-time context monitoring
  useEffect(() => {
    const handleOnlineChange = () => {
      setMobileContext(prev => ({ ...prev, online: navigator.onLine }));
      if (navigator.onLine) {
        syncOfflineActions();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshPredictiveContent();
      }
    };

    const handleOrientationChange = () => {
      setMobileContext(prev => ({
        ...prev,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        viewport: { width: window.innerWidth, height: window.innerHeight }
      }));
    };

    window.addEventListener('online', handleOnlineChange);
    window.addEventListener('offline', handleOnlineChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('online', handleOnlineChange);
      window.removeEventListener('offline', handleOnlineChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  const initializeMobileFeatures = async () => {
    try {
      // Initialize battery API
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        setMobileContext(prev => ({
          ...prev,
          batteryLevel: Math.round(battery.level * 100)
        }));

        battery.addEventListener('levelchange', () => {
          setMobileContext(prev => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100)
          }));
        });
      }

      // Initialize network information
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        updateNetworkSpeed(connection.effectiveType);
        connection.addEventListener('change', () => {
          updateNetworkSpeed(connection.effectiveType);
        });
      }

      // Initialize device memory
      if ('deviceMemory' in navigator) {
        setMobileContext(prev => ({
          ...prev,
          deviceMemory: (navigator as any).deviceMemory
        }));
      }

      // Setup PWA install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setMobileContext(prev => ({ ...prev, installPrompt: e }));
      });

    } catch (error) {
      console.error('Mobile features initialization failed:', error);
    }
  };

  const setupPerformanceMonitoring = () => {
    // Monitor Core Web Vitals
    if ('performance' in window && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            setPerformanceMetrics(prev => ({
              ...prev,
              loadTime: entry.startTime
            }));
          }
          if (entry.entryType === 'first-input') {
            setPerformanceMetrics(prev => ({
              ...prev,
              renderTime: (entry as any).processingStart - entry.startTime
            }));
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }

    // Monitor memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setPerformanceMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
      }));
    }
  };

  const setupOfflineSupport = () => {
    // Register service worker for offline capabilities
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-enhanced.js')
        .then(registration => {
          console.log('Enhanced SW registered:', registration);
        })
        .catch(error => {
          console.error('SW registration failed:', error);
        });
    }

    // Setup offline storage strategies
    if ('indexedDB' in window) {
      setupOfflineDatabase();
    }
  };

  const setupPredictivePreloading = async () => {
    try {
      const currentLocation = await geolocationService.getCurrentLocation();
      const timeOfDay = new Date().getHours();
      const dayOfWeek = new Date().getDay();

      // Generate predictive content based on user patterns
      const predictions = await generatePredictiveContent(userId, {
        location: currentLocation,
        timeOfDay,
        dayOfWeek,
        context: mobileContext
      });

      setPredictiveContent(predictions);

      // Preload high-confidence predictions
      predictions
        .filter(p => p.confidence > 0.7)
        .slice(0, 5)
        .forEach(prediction => {
          preloadContent(prediction);
        });

    } catch (error) {
      console.error('Predictive preloading setup failed:', error);
    }
  };

  const setupGestureControls = () => {
    const defaultGestures: GestureShortcut[] = [
      {
        id: 'quick-search',
        gesture: 'swipe_down',
        action: 'open_search',
        context: 'home',
        enabled: true,
        customizable: true
      },
      {
        id: 'quick-book',
        gesture: 'swipe_up',
        action: 'quick_booking',
        context: 'provider',
        enabled: true,
        customizable: true
      },
      {
        id: 'back-navigation',
        gesture: 'swipe_right',
        action: 'go_back',
        enabled: true,
        customizable: false
      },
      {
        id: 'refresh-content',
        gesture: 'double_tap',
        action: 'refresh',
        enabled: true,
        customizable: true
      }
    ];

    setGestureShortcuts(defaultGestures);
    initializeGestureListeners();
  };

  const setupSmartNotifications = () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Setup intelligent notification scheduling
    if ('serviceWorker' in navigator && 'Notification' in window) {
      setupIntelligentNotifications();
    }
  };

  const generatePredictiveContent = async (
    userId: string, 
    context: any
  ): Promise<PredictiveContent[]> => {
    try {
      // Use AI recommendation engine for predictions
      const recommendations = await enhancedRecommendationEngine.generatePersonalizedRecommendations(
        userId,
        {
          location: context.location,
          timeframe: 'immediate',
          context: {
            timeOfDay: context.timeOfDay < 12 ? 'morning' : context.timeOfDay < 18 ? 'afternoon' : 'evening',
            device: 'mobile'
          }
        },
        { limit: 10, diversityFactor: 0.4 }
      );

      const predictiveContent: PredictiveContent[] = recommendations.recommendations.map((rec, index) => ({
        id: rec.id,
        type: 'service',
        title: rec.title,
        description: rec.description,
        confidence: rec.confidence,
        priority: index + 1,
        estimatedUsage: new Date(Date.now() + (index * 3600000)), // Stagger predictions
        reasons: rec.personalizedReasons || [`Based on your ${context.timeOfDay} activity patterns`]
      }));

      // Add location-based predictions
      if (context.location) {
        const locationPredictions = await generateLocationBasedPredictions(context.location);
        predictiveContent.push(...locationPredictions);
      }

      // Add time-based predictions
      const timePredictions = generateTimeBasedPredictions(context.timeOfDay, context.dayOfWeek);
      predictiveContent.push(...timePredictions);

      return predictiveContent.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Predictive content generation failed:', error);
      return [];
    }
  };

  const preloadContent = async (prediction: PredictiveContent) => {
    try {
      // Intelligent preloading based on network conditions
      if (mobileContext.networkSpeed === 'slow' || mobileContext.batteryLevel < 20) {
        return; // Skip preloading on poor conditions
      }

      // Preload critical data only
      const cacheKey = `preload_${prediction.id}`;
      const cachedItem: SmartCacheItem = {
        key: cacheKey,
        data: await fetchPredictionData(prediction),
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
        priority: prediction.confidence > 0.8 ? 'high' : 'medium',
        usage: 0,
        compressed: true,
        predictedNextAccess: prediction.estimatedUsage
      };

      setSmartCache(prev => new Map(prev.set(cacheKey, cachedItem)));
    } catch (error) {
      console.error('Content preloading failed:', error);
    }
  };

  const handleOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) => {
    const offlineAction: OfflineAction = {
      ...action,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      retryCount: 0
    };

    setOfflineActions(prev => [...prev, offlineAction]);

    // Store in IndexedDB for persistence
    storeOfflineAction(offlineAction);

    // Show user feedback
    showOfflineActionFeedback(action.type);
  };

  const syncOfflineActions = async () => {
    if (!mobileContext.online || offlineActions.length === 0) return;

    const actionsToSync = [...offlineActions];
    
    for (const action of actionsToSync) {
      try {
        await executeOfflineAction(action);
        setOfflineActions(prev => prev.filter(a => a.id !== action.id));
        removeOfflineActionFromStorage(action.id);
      } catch (error) {
        console.error('Offline action sync failed:', error);
        
        // Increment retry count
        setOfflineActions(prev => 
          prev.map(a => 
            a.id === action.id 
              ? { ...a, retryCount: a.retryCount + 1 }
              : a
          )
        );
        
        // Remove action if max retries exceeded
        if (action.retryCount >= 3) {
          setOfflineActions(prev => prev.filter(a => a.id !== action.id));
          removeOfflineActionFromStorage(action.id);
        }
      }
    }
  };

  const adaptUIForContext = useCallback(() => {
    if (!adaptiveUI.autoOptimize) return;

    const newAdaptations: Partial<typeof adaptiveUI> = {};

    // Adapt based on battery level
    if (mobileContext.batteryLevel < 20) {
      newAdaptations.animations = false;
    } else if (mobileContext.batteryLevel > 50) {
      newAdaptations.animations = true;
    }

    // Adapt based on network speed
    if (mobileContext.networkSpeed === 'slow') {
      newAdaptations.layout = 'compact';
    } else if (mobileContext.networkSpeed === 'fast') {
      newAdaptations.layout = 'standard';
    }

    // Adapt based on device memory
    if (mobileContext.deviceMemory < 2) {
      newAdaptations.layout = 'compact';
      newAdaptations.animations = false;
    }

    // Adapt based on orientation
    if (mobileContext.orientation === 'landscape') {
      newAdaptations.layout = 'expanded';
    }

    if (Object.keys(newAdaptations).length > 0) {
      setAdaptiveUI(prev => ({ ...prev, ...newAdaptations }));
    }
  }, [mobileContext, adaptiveUI.autoOptimize]);

  // Apply UI adaptations when context changes
  useEffect(() => {
    adaptUIForContext();
  }, [mobileContext, adaptUIForContext]);

  const refreshPredictiveContent = async () => {
    const newPredictions = await generatePredictiveContent(userId, {
      location: await geolocationService.getCurrentLocation(),
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      context: mobileContext
    });

    setPredictiveContent(newPredictions);
  };

  const renderPredictiveContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Smart Predictions</h3>
        <Badge variant="outline" className="text-xs">
          AI Powered
        </Badge>
      </div>

      {predictiveContent.slice(0, 5).map((prediction) => (
        <Card key={prediction.id} className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{prediction.title}</CardTitle>
              <Badge variant={prediction.confidence > 0.8 ? 'default' : 'secondary'} className="text-xs">
                {Math.round(prediction.confidence * 100)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm mb-2">{prediction.description}</CardDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {prediction.estimatedUsage.toLocaleTimeString()}
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Preload
              </Button>
            </div>
            {prediction.reasons.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">{prediction.reasons[0]}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPerformanceMetrics = () => (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-500" />
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Load Time</span>
            <span className="text-sm font-medium">{performanceMetrics.loadTime.toFixed(0)}ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Memory Usage</span>
            <div className="flex items-center gap-2">
              <Progress value={performanceMetrics.memoryUsage * 100} className="w-16 h-2" />
              <span className="text-sm font-medium">{Math.round(performanceMetrics.memoryUsage * 100)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Battery Impact</span>
            <Badge variant={
              performanceMetrics.batteryImpact === 'low' ? 'default' :
              performanceMetrics.batteryImpact === 'medium' ? 'secondary' : 'destructive'
            } className="text-xs">
              {performanceMetrics.batteryImpact}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderOfflineStatus = () => (
    <Card className={`transition-all ${mobileContext.online ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {mobileContext.online ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-orange-600" />}
          {mobileContext.online ? 'Online' : 'Offline Mode'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {!mobileContext.online && (
            <Alert>
              <AlertDescription className="text-sm">
                {offlineActions.length > 0 
                  ? `${offlineActions.length} actions queued for sync`
                  : 'All actions will be saved and synced when online'
                }
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span>Network Speed</span>
            <Badge variant="outline" className="text-xs">
              {mobileContext.networkSpeed}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span>Battery Level</span>
            <div className="flex items-center gap-2">
              <Battery className={`w-4 h-4 ${
                mobileContext.batteryLevel > 50 ? 'text-green-600' :
                mobileContext.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <span className="font-medium">{mobileContext.batteryLevel}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSmartFeatures = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Smart Features</h3>
      </div>

      {/* Gesture Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Gesture Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {gestureShortcuts.filter(g => g.enabled).slice(0, 3).map((gesture) => (
              <div key={gesture.id} className="flex items-center justify-between text-sm">
                <span className="capitalize">{gesture.gesture.replace('_', ' ')}</span>
                <span className="text-gray-600">{gesture.action.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Cache Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Smart Cache ({smartCache.size} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            {smartCache.size > 0 
              ? `${smartCache.size} items cached for offline access`
              : 'No cached content yet'
            }
          </div>
        </CardContent>
      </Card>

      {/* PWA Install */}
      {mobileContext.installPrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Install App</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Install for faster access and offline features</p>
              <Button 
                size="sm" 
                onClick={() => mobileContext.installPrompt?.prompt()}
                className="w-full"
              >
                Install App
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className={`p-4 space-y-6 transition-all ${
      adaptiveUI.layout === 'compact' ? 'max-w-sm' : 
      adaptiveUI.layout === 'expanded' ? 'max-w-4xl' : 'max-w-2xl'
    } mx-auto`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold">Smart Mobile</h1>
        </div>
        <div className="flex items-center gap-2">
          {mobileContext.online ? (
            <Signal className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-orange-600" />
          )}
          <Eye className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Status Overview */}
      {renderOfflineStatus()}

      {/* Tabs for different features */}
      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          {renderPredictiveContent()}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {renderPerformanceMetrics()}
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          {renderSmartFeatures()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions
function updateNetworkSpeed(effectiveType: string) {
  // Implementation for network speed detection
}

function setupOfflineDatabase() {
  // Implementation for IndexedDB setup
}

function initializeGestureListeners() {
  // Implementation for gesture recognition
}

function setupIntelligentNotifications() {
  // Implementation for smart notifications
}

async function generateLocationBasedPredictions(location: any): Promise<PredictiveContent[]> {
  return [
    {
      id: 'location-pred-1',
      type: 'navigation',
      title: 'Nearby Service Hub',
      description: 'High-demand area 0.5 miles away',
      confidence: 0.75,
      priority: 3,
      estimatedUsage: new Date(Date.now() + 1800000), // 30 minutes
      reasons: ['Based on your location patterns']
    }
  ];
}

function generateTimeBasedPredictions(timeOfDay: number, dayOfWeek: number): PredictiveContent[] {
  return [
    {
      id: 'time-pred-1',
      type: 'booking',
      title: 'Peak Hour Opportunity',
      description: 'High booking probability in next 2 hours',
      confidence: 0.8,
      priority: 2,
      estimatedUsage: new Date(Date.now() + 7200000), // 2 hours
      reasons: [`Based on ${timeOfDay < 12 ? 'morning' : timeOfDay < 18 ? 'afternoon' : 'evening'} patterns`]
    }
  ];
}

async function fetchPredictionData(prediction: PredictiveContent): Promise<any> {
  // Mock implementation - would fetch actual data
  return { id: prediction.id, cached: true };
}

function storeOfflineAction(action: OfflineAction) {
  // Implementation for storing in IndexedDB
}

function removeOfflineActionFromStorage(actionId: string) {
  // Implementation for removing from IndexedDB
}

async function executeOfflineAction(action: OfflineAction): Promise<void> {
  // Implementation for executing queued actions
}

function showOfflineActionFeedback(actionType: string) {
  // Implementation for user feedback
}
