"use client";

import { useEffect, useState } from "react";
import { GlassmorphicContainer } from "@/components/admin/design-system/glassmorphic-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Activity,
  Brain,
  Shield,
  Zap,
  Eye,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface HealthMetrics {
  hydration: boolean;
  network: boolean;
  performance: number;
  errors: number;
  lastUpdate: Date;
}

export function HealthCheck() {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [metrics, setMetrics] = useState<HealthMetrics>({
    hydration: true,
    network: true,
    performance: 100,
    errors: 0,
    lastUpdate: new Date()
  });

  useEffect(() => {
    setMounted(true);

    // Performance monitoring
    const checkPerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const performanceScore = Math.max(0, Math.min(100, 100 - (loadTime / 50))); // Scale load time to 0-100
        
        setMetrics(prev => ({
          ...prev,
          performance: Math.round(performanceScore),
          lastUpdate: new Date()
        }));
      }
    };

    // Network monitoring
    const checkNetwork = () => {
      setMetrics(prev => ({
        ...prev,
        network: navigator.onLine,
        lastUpdate: new Date()
      }));
    };

    // Error tracking
    let errorCount = 0;
    const handleError = (event: ErrorEvent) => {
      errorCount++;
      const isHydrationError = event.message.includes("hydration") || event.message.includes("Hydration");
      
      setMetrics(prev => ({
        ...prev,
        hydration: !isHydrationError,
        errors: errorCount,
        lastUpdate: new Date()
      }));
    };

    // Event listeners
    window.addEventListener("error", handleError);
    window.addEventListener("online", checkNetwork);
    window.addEventListener("offline", checkNetwork);

    // Initial checks
    checkPerformance();
    checkNetwork();

    // Periodic updates
    const interval = setInterval(() => {
      checkPerformance();
      checkNetwork();
    }, 5000);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("online", checkNetwork);
      window.removeEventListener("offline", checkNetwork);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const overallHealth = metrics.hydration && metrics.network && metrics.performance > 50 && metrics.errors === 0;
  const healthScore = Math.round((
    (metrics.hydration ? 25 : 0) +
    (metrics.network ? 25 : 0) +
    (metrics.performance * 0.4) +
    (metrics.errors === 0 ? 10 : Math.max(0, 10 - metrics.errors))
  ));

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getHealthBg = (score: number) => {
    if (score >= 90) return "from-green-500/20 to-emerald-500/20";
    if (score >= 70) return "from-yellow-500/20 to-orange-500/20";
    return "from-red-500/20 to-pink-500/20";
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <GlassmorphicContainer 
        variant="subtle" 
        glow={!overallHealth}
        className={`transition-all duration-500 ${
          isExpanded ? 'w-80' : 'w-auto'
        }`}
      >
        {/* Compact View */}
        <div 
          className="flex items-center gap-3 p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={`relative p-2 rounded-xl bg-gradient-to-r ${getHealthBg(healthScore)}`}>
            {overallHealth ? (
              <CheckCircle className={`w-5 h-5 ${getHealthColor(healthScore)}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${getHealthColor(healthScore)}`} />
            )}
            {!overallHealth && (
              <div className="absolute inset-0 bg-red-400/30 rounded-xl animate-ping" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs font-medium ${
                overallHealth 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {overallHealth ? 'System Healthy' : 'Issues Detected'}
              </Badge>
              <span className={`text-sm font-bold ${getHealthColor(healthScore)}`}>
                {healthScore}%
              </span>
            </div>
            {!isExpanded && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Click for details
              </div>
            )}
          </div>
          
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">System Health Monitor</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0 hover:bg-white/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Health Metrics */}
            <div className="space-y-3">
              {/* Hydration Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className={`w-4 h-4 ${metrics.hydration ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-sm">Hydration</span>
                </div>
                <Badge className={`text-xs ${
                  metrics.hydration 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {metrics.hydration ? 'OK' : 'Error'}
                </Badge>
              </div>

              {/* Network Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metrics.network ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Network</span>
                </div>
                <Badge className={`text-xs ${
                  metrics.network 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {metrics.network ? 'Online' : 'Offline'}
                </Badge>
              </div>

              {/* Performance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${getHealthColor(metrics.performance)}`} />
                  <span className="text-sm">Performance</span>
                </div>
                <Badge className={`text-xs ${
                  metrics.performance >= 70
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {metrics.performance}%
                </Badge>
              </div>

              {/* Error Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${metrics.errors === 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-sm">Errors</span>
                </div>
                <Badge className={`text-xs ${
                  metrics.errors === 0
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {metrics.errors}
                </Badge>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Overall Health</span>
                <span className={`font-bold ${getHealthColor(healthScore)}`}>{healthScore}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    healthScore >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    healthScore >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>

            {/* Last Update */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Activity className="w-3 h-3" />
              <span>Last updated: {metrics.lastUpdate.toLocaleTimeString()}</span>
            </div>

            {/* Quick Actions */}
            {!overallHealth && (
              <div className="pt-2 border-t border-white/20">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => window.location.reload()}
                >
                  <Eye className="w-3 h-3 mr-2" />
                  Refresh Page
                </Button>
              </div>
            )}
          </div>
        )}
      </GlassmorphicContainer>
    </div>
  );
}
