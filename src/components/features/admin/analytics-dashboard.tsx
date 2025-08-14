'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Users, 
  Activity, 
  Zap,
  Globe,
  Smartphone,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

interface ErrorStats {
  total: number
  byCategory: Record<string, number>
  bySeverity: Record<string, number>
  topErrors: Array<{
    fingerprint: string
    message: string
    count: number
    users: number
    trend: 'up' | 'down' | 'stable'
  }>
  recentErrors: Array<{
    timestamp: Date
    message: string
    severity: string
    user?: string
    url: string
  }>
}

interface AnalyticsStats {
  totalEvents: number
  uniqueUsers: number
  sessions: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{
    page: string
    views: number
    uniqueUsers: number
    avgTime: number
  }>
  userActions: Array<{
    action: string
    count: number
    trend: 'up' | 'down' | 'stable'
  }>
  deviceBreakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
}

interface PerformanceMetrics {
  averageLoadTime: number
  errorRate: number
  uptime: number
  throughput: number
  memoryUsage: number
  cpuUsage: number
  activeConnections: number
  trends: {
    loadTime: Array<{ time: string; value: number }>
    errorRate: Array<{ time: string; value: number }>
    throughput: Array<{ time: string; value: number }>
  }
}

export default function AnalyticsDashboard() {
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null)
  const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')

  useEffect(() => {
    loadDashboardData()
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 60000) // 1 minute
      return () => clearInterval(interval)
    }
  }, [autoRefresh, timeRange])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API calls - in production, fetch from your analytics API
      await Promise.all([
        loadErrorStats(),
        loadAnalyticsStats(),
        loadPerformanceMetrics()
      ])
      
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadErrorStats = async () => {
    // Mock data - replace with actual API call
    const mockData: ErrorStats = {
      total: 1247,
      byCategory: {
        'Network': 523,
        'Component': 312,
        'Type Error': 198,
        'Chunk Loading': 156,
        'Reference Error': 58
      },
      bySeverity: {
        'critical': 23,
        'high': 156,
        'medium': 734,
        'low': 334
      },
      topErrors: [
        {
          fingerprint: 'abc123',
          message: 'Cannot read property of undefined',
          count: 89,
          users: 45,
          trend: 'up'
        },
        {
          fingerprint: 'def456',
          message: 'Network request failed',
          count: 67,
          users: 34,
          trend: 'down'
        },
        {
          fingerprint: 'ghi789',
          message: 'ChunkLoadError: Loading chunk failed',
          count: 45,
          users: 28,
          trend: 'stable'
        }
      ],
      recentErrors: [
        {
          timestamp: new Date(Date.now() - 300000),
          message: 'TypeError: Cannot read property of undefined',
          severity: 'high',
          user: 'user123@example.com',
          url: '/dashboard'
        },
        {
          timestamp: new Date(Date.now() - 600000),
          message: 'Network Error: Failed to fetch',
          severity: 'medium',
          url: '/api/data'
        }
      ]
    }
    
    setErrorStats(mockData)
  }

  const loadAnalyticsStats = async () => {
    // Mock data - replace with actual API call
    const mockData: AnalyticsStats = {
      totalEvents: 45672,
      uniqueUsers: 3456,
      sessions: 8934,
      bounceRate: 23.4,
      avgSessionDuration: 285, // seconds
      topPages: [
        { page: '/', views: 8934, uniqueUsers: 2345, avgTime: 145 },
        { page: '/browse', views: 5672, uniqueUsers: 1876, avgTime: 234 },
        { page: '/dashboard', views: 3456, uniqueUsers: 987, avgTime: 456 },
        { page: '/profile', views: 2345, uniqueUsers: 756, avgTime: 123 }
      ],
      userActions: [
        { action: 'search', count: 5673, trend: 'up' },
        { action: 'click_provider', count: 3456, trend: 'up' },
        { action: 'book_service', count: 1234, trend: 'stable' },
        { action: 'filter_results', count: 987, trend: 'down' }
      ],
      deviceBreakdown: {
        mobile: 65.2,
        desktop: 28.4,
        tablet: 6.4
      }
    }
    
    setAnalyticsStats(mockData)
  }

  const loadPerformanceMetrics = async () => {
    // Mock data - replace with actual API call
    const mockData: PerformanceMetrics = {
      averageLoadTime: 1.23,
      errorRate: 0.45,
      uptime: 99.97,
      throughput: 1250,
      memoryUsage: 67.8,
      cpuUsage: 23.4,
      activeConnections: 456,
      trends: {
        loadTime: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          value: Math.random() * 2 + 0.5
        })),
        errorRate: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          value: Math.random() * 1 + 0.1
        })),
        throughput: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          value: Math.random() * 500 + 1000
        }))
      }
    }
    
    setPerformanceMetrics(mockData)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'down': return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
      case 'stable': return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (isLoading && !errorStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading analytics dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time monitoring, error tracking, and user analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Badge variant={autoRefresh ? "default" : "secondary"}>
            <Activity className="w-3 h-3 mr-1" />
            {autoRefresh ? 'Live' : 'Paused'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Pause' : 'Resume'}
          </Button>
          <Button onClick={loadDashboardData} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="analytics">User Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {errorStats?.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsStats?.uniqueUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +5% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Load Time</CardTitle>
                <Clock className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {performanceMetrics?.averageLoadTime.toFixed(2)}s
                </div>
                <p className="text-xs text-muted-foreground">
                  -8% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {performanceMetrics?.uptime}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Error Rate</span>
                  <span className={`text-sm ${performanceMetrics?.errorRate && performanceMetrics.errorRate < 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {performanceMetrics?.errorRate}%
                  </span>
                </div>
                <Progress value={performanceMetrics?.errorRate} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm">{performanceMetrics?.memoryUsage}%</span>
                </div>
                <Progress value={performanceMetrics?.memoryUsage} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm">{performanceMetrics?.cpuUsage}%</span>
                </div>
                <Progress value={performanceMetrics?.cpuUsage} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest system alerts and warnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    High error rate detected in /api/users endpoint
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Memory usage above 80% threshold
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          {/* Error Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Categories</CardTitle>
                <CardDescription>Breakdown by error type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorStats && Object.entries(errorStats.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(count / errorStats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Severity</CardTitle>
                <CardDescription>Distribution by severity level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorStats && Object.entries(errorStats.bySeverity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(severity)}>
                        {severity}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Top Errors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Errors</CardTitle>
              <CardDescription>Most frequent errors affecting users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorStats?.topErrors.map((error, index) => (
                  <div key={error.fingerprint} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{index + 1}</span>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {error.message}
                        </code>
                        {getTrendIcon(error.trend)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {error.count} occurrences • {error.users} users affected
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* User Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsStats?.sessions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsStats?.bounceRate}%</div>
                <p className="text-xs text-muted-foreground">-3% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Avg Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsStats ? formatDuration(analyticsStats.avgSessionDuration) : '--'}
                </div>
                <p className="text-xs text-muted-foreground">+12s from last week</p>
              </CardContent>
            </Card>
          </div>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
              <CardDescription>User sessions by device type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsStats && Object.entries(analyticsStats.deviceBreakdown).map(([device, percentage]) => (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {device === 'mobile' && <Smartphone className="w-4 h-4" />}
                    {device === 'desktop' && <Globe className="w-4 h-4" />}
                    {device === 'tablet' && <Smartphone className="w-4 h-4" />}
                    <span className="capitalize">{device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{percentage}%</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsStats?.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{page.page}</div>
                      <div className="text-sm text-muted-foreground">
                        {page.views} views • {page.uniqueUsers} unique users
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatDuration(page.avgTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">avg time</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics?.throughput}/min</div>
                <p className="text-xs text-muted-foreground">Requests per minute</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Active Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics?.activeConnections}</div>
                <p className="text-xs text-muted-foreground">Current connections</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics?.memoryUsage}%</div>
                <Progress value={performanceMetrics?.memoryUsage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics?.cpuUsage}%</div>
                <Progress value={performanceMetrics?.cpuUsage} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <Clock className="w-4 h-4 inline mr-1" />
        Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
      </div>
    </div>
  )
}
