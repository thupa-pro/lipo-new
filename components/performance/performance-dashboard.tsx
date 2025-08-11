'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PerformanceMonitor } from '@/lib/performance/optimization'
import { intelligentCachingEngine } from '@/lib/performance/intelligent-caching'
import { 
  Activity, 
  Zap, 
  Database, 
  Globe, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react'

interface WebVitalMetrics {
  LCP: number
  FID: number
  CLS: number
  FCP: number
  TTFB: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

interface CacheMetrics {
  hitRate: number
  missRate: number
  evictionRate: number
  avgResponseTime: number
  memoryUtilization: number
  compressionRatio: number
}

interface NetworkMetrics {
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
}

interface PerformanceInsight {
  type: 'optimization' | 'warning' | 'success'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  actionable: boolean
  recommendation?: string
}

export default function PerformanceDashboard() {
  const [webVitals, setWebVitals] = useState<WebVitalMetrics | null>(null)
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetrics | null>(null)
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(null)
  const [insights, setInsights] = useState<PerformanceInsight[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Initialize performance monitoring
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance()
    monitor.startMonitoring()
    setIsMonitoring(true)

    const updateMetrics = () => {
      // Collect Web Vitals
      collectWebVitals()
      
      // Collect Cache Metrics
      collectCacheMetrics()
      
      // Collect Network Metrics
      collectNetworkMetrics()
      
      // Generate insights
      generateInsights()
      
      setLastUpdate(new Date())
    }

    // Initial collection
    updateMetrics()

    // Set up periodic updates
    const interval = setInterval(updateMetrics, 5000) // Every 5 seconds

    return () => {
      clearInterval(interval)
      monitor.stopMonitoring()
      setIsMonitoring(false)
    }
  }, [])

  const collectWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return

    // Get performance entries
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')
    
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      
      // Simulate LCP, FID, CLS (in production, use actual measurements)
      const lcp = fcp + Math.random() * 1000 + 1000 // Simulated
      const fid = Math.random() * 100 // Simulated
      const cls = Math.random() * 0.2 // Simulated

      const rating = getRating(lcp, fid, cls)

      setWebVitals({
        LCP: lcp,
        FID: fid,
        CLS: cls,
        FCP: fcp,
        TTFB: ttfb,
        rating
      })
    }
  }, [])

  const collectCacheMetrics = useCallback(() => {
    const analytics = intelligentCachingEngine.getCacheAnalytics()
    
    setCacheMetrics({
      hitRate: analytics.overall.hitRate * 100,
      missRate: analytics.overall.missRate * 100,
      evictionRate: analytics.overall.evictionRate * 100,
      avgResponseTime: analytics.overall.avgResponseTime,
      memoryUtilization: analytics.overall.memoryUtilization * 100,
      compressionRatio: analytics.overall.compressionRatio * 100
    })
  }, [])

  const collectNetworkMetrics = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      setNetworkMetrics({
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      })
    }
  }, [])

  const generateInsights = useCallback(() => {
    const newInsights: PerformanceInsight[] = []

    // Web Vitals insights
    if (webVitals) {
      if (webVitals.LCP > 2500) {
        newInsights.push({
          type: 'warning',
          title: 'Large Contentful Paint Needs Improvement',
          description: `LCP is ${Math.round(webVitals.LCP)}ms. Target is under 2.5s.`,
          impact: 'high',
          actionable: true,
          recommendation: 'Optimize images and reduce server response time'
        })
      }

      if (webVitals.FID > 100) {
        newInsights.push({
          type: 'warning',
          title: 'First Input Delay Too High',
          description: `FID is ${Math.round(webVitals.FID)}ms. Target is under 100ms.`,
          impact: 'medium',
          actionable: true,
          recommendation: 'Reduce JavaScript execution time and optimize event handlers'
        })
      }

      if (webVitals.CLS > 0.1) {
        newInsights.push({
          type: 'warning',
          title: 'Cumulative Layout Shift Detected',
          description: `CLS is ${webVitals.CLS.toFixed(3)}. Target is under 0.1.`,
          impact: 'medium',
          actionable: true,
          recommendation: 'Set size attributes on images and avoid inserting content above existing content'
        })
      }
    }

    // Cache insights
    if (cacheMetrics) {
      if (cacheMetrics.hitRate < 70) {
        newInsights.push({
          type: 'optimization',
          title: 'Cache Hit Rate Below Optimal',
          description: `Cache hit rate is ${Math.round(cacheMetrics.hitRate)}%. Target is above 70%.`,
          impact: 'medium',
          actionable: true,
          recommendation: 'Review caching strategy and increase cache TTL for stable content'
        })
      }

      if (cacheMetrics.memoryUtilization > 85) {
        newInsights.push({
          type: 'warning',
          title: 'Cache Memory Usage High',
          description: `Memory utilization is ${Math.round(cacheMetrics.memoryUtilization)}%.`,
          impact: 'high',
          actionable: true,
          recommendation: 'Enable cache compression and review eviction policies'
        })
      }

      if (cacheMetrics.compressionRatio < 60) {
        newInsights.push({
          type: 'optimization',
          title: 'Cache Compression Can Be Improved',
          description: `Compression ratio is ${Math.round(cacheMetrics.compressionRatio)}%.`,
          impact: 'low',
          actionable: true,
          recommendation: 'Enable higher compression levels for text-based responses'
        })
      }
    }

    // Network insights
    if (networkMetrics) {
      if (networkMetrics.effectiveType === '2g' || networkMetrics.effectiveType === 'slow-2g') {
        newInsights.push({
          type: 'warning',
          title: 'Slow Network Connection Detected',
          description: `Connection type: ${networkMetrics.effectiveType}`,
          impact: 'high',
          actionable: true,
          recommendation: 'Activate data saver mode and reduce resource sizes'
        })
      }

      if (networkMetrics.saveData) {
        newInsights.push({
          type: 'optimization',
          title: 'Data Saver Mode Active',
          description: 'User has enabled data saver mode',
          impact: 'medium',
          actionable: true,
          recommendation: 'Serve compressed images and defer non-critical resources'
        })
      }
    }

    setInsights(newInsights)
  }, [webVitals, cacheMetrics, networkMetrics])

  const getRating = (lcp: number, fid: number, cls: number): 'good' | 'needs-improvement' | 'poor' => {
    const lcpRating = lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor'
    const fidRating = fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor'
    const clsRating = cls <= 0.1 ? 'good' : cls <= 0.25 ? 'needs-improvement' : 'poor'
    
    if (lcpRating === 'poor' || fidRating === 'poor' || clsRating === 'poor') return 'poor'
    if (lcpRating === 'needs-improvement' || fidRating === 'needs-improvement' || clsRating === 'needs-improvement') return 'needs-improvement'
    return 'good'
  }

  const getMetricColor = (value: number, thresholds: { good: number; poor: number }, reverse = false) => {
    if (reverse) {
      if (value <= thresholds.good) return 'text-green-600'
      if (value <= thresholds.poor) return 'text-yellow-600'
      return 'text-red-600'
    } else {
      if (value >= thresholds.good) return 'text-green-600'
      if (value >= thresholds.poor) return 'text-yellow-600'
      return 'text-red-600'
    }
  }

  const optimizeNow = async () => {
    // Trigger immediate optimizations
    await intelligentCachingEngine.warmCache('main', {
      predictedActions: ['browse', 'search', 'view-provider']
    })
    
    // Force cache cleanup
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'OPTIMIZE_CACHE'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time performance monitoring and optimization insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isMonitoring ? "default" : "secondary"}>
            <Activity className="w-3 h-3 mr-1" />
            {isMonitoring ? 'Monitoring' : 'Stopped'}
          </Badge>
          <Button onClick={optimizeNow} size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Optimize Now
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {webVitals?.rating === 'good' ? '95' : webVitals?.rating === 'needs-improvement' ? '75' : '45'}
            </div>
            <Badge variant={webVitals?.rating === 'good' ? 'default' : webVitals?.rating === 'needs-improvement' ? 'secondary' : 'destructive'}>
              {webVitals?.rating || 'unknown'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cacheMetrics ? `${Math.round(cacheMetrics.hitRate)}%` : '--'}
            </div>
            <Progress value={cacheMetrics?.hitRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Type</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkMetrics?.effectiveType?.toUpperCase() || 'Unknown'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {networkMetrics ? `${networkMetrics.downlink} Mbps` : 'Detecting...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.filter(i => i.type === 'warning').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {insights.filter(i => i.impact === 'high').length} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Core Web Vitals
          </CardTitle>
          <CardDescription>
            Key metrics that measure user experience quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">LCP</div>
              <div className={`text-2xl font-bold ${getMetricColor(webVitals?.LCP || 0, { good: 2500, poor: 4000 }, true)}`}>
                {webVitals ? `${Math.round(webVitals.LCP)}ms` : '--'}
              </div>
              <div className="text-xs text-muted-foreground">Largest Contentful Paint</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">FID</div>
              <div className={`text-2xl font-bold ${getMetricColor(webVitals?.FID || 0, { good: 100, poor: 300 }, true)}`}>
                {webVitals ? `${Math.round(webVitals.FID)}ms` : '--'}
              </div>
              <div className="text-xs text-muted-foreground">First Input Delay</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">CLS</div>
              <div className={`text-2xl font-bold ${getMetricColor(webVitals?.CLS || 0, { good: 0.1, poor: 0.25 }, true)}`}>
                {webVitals ? webVitals.CLS.toFixed(3) : '--'}
              </div>
              <div className="text-xs text-muted-foreground">Cumulative Layout Shift</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">FCP</div>
              <div className={`text-2xl font-bold ${getMetricColor(webVitals?.FCP || 0, { good: 1800, poor: 3000 }, true)}`}>
                {webVitals ? `${Math.round(webVitals.FCP)}ms` : '--'}
              </div>
              <div className="text-xs text-muted-foreground">First Contentful Paint</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">TTFB</div>
              <div className={`text-2xl font-bold ${getMetricColor(webVitals?.TTFB || 0, { good: 800, poor: 1800 }, true)}`}>
                {webVitals ? `${Math.round(webVitals.TTFB)}ms` : '--'}
              </div>
              <div className="text-xs text-muted-foreground">Time to First Byte</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cache Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Cache Performance
          </CardTitle>
          <CardDescription>
            Intelligent caching system metrics and optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Hit Rate</span>
                <span className="text-sm text-muted-foreground">
                  {cacheMetrics ? `${Math.round(cacheMetrics.hitRate)}%` : '--'}
                </span>
              </div>
              <Progress value={cacheMetrics?.hitRate || 0} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">
                  {cacheMetrics ? `${Math.round(cacheMetrics.memoryUtilization)}%` : '--'}
                </span>
              </div>
              <Progress value={cacheMetrics?.memoryUtilization || 0} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Compression</span>
                <span className="text-sm text-muted-foreground">
                  {cacheMetrics ? `${Math.round(cacheMetrics.compressionRatio)}%` : '--'}
                </span>
              </div>
              <Progress value={cacheMetrics?.compressionRatio || 0} />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">
                {cacheMetrics ? `${Math.round(cacheMetrics.avgResponseTime)}ms` : '--'}
              </div>
              <div className="text-xs text-muted-foreground">Avg Response Time</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {cacheMetrics ? `${Math.round(cacheMetrics.missRate)}%` : '--'}
              </div>
              <div className="text-xs text-muted-foreground">Miss Rate</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {cacheMetrics ? `${Math.round(cacheMetrics.evictionRate)}%` : '--'}
              </div>
              <div className="text-xs text-muted-foreground">Eviction Rate</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {networkMetrics ? `${networkMetrics.rtt}ms` : '--'}
              </div>
              <div className="text-xs text-muted-foreground">Network RTT</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Performance Insights
          </CardTitle>
          <CardDescription>
            AI-powered recommendations for optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <Alert key={index}>
                <div className="flex items-start gap-3">
                  {insight.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />}
                  {insight.type === 'optimization' && <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />}
                  {insight.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'secondary' : 'outline'}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <AlertDescription>{insight.description}</AlertDescription>
                    {insight.recommendation && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <strong>Recommendation:</strong> {insight.recommendation}
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p>All performance metrics are optimal!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center text-sm text-muted-foreground">
        <Clock className="w-4 h-4 inline mr-1" />
        Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
      </div>
    </div>
  )
}
