'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Lock, 
  Eye, 
  Zap,
  TrendingUp,
  Ban,
  Clock,
  Globe,
  User,
  Database
} from 'lucide-react'

interface SecurityMetrics {
  totalRequests: number
  blockedRequests: number
  rateLimitHits: number
  securityEvents: SecurityEvent[]
  topThreats: ThreatSummary[]
  geoDistribution: GeoData[]
  recentBlocks: BlockedRequest[]
}

interface SecurityEvent {
  id: string
  timestamp: Date
  type: 'xss' | 'sqli' | 'path_traversal' | 'rate_limit' | 'blocked_ip' | 'suspicious_ua'
  severity: 'low' | 'medium' | 'high' | 'critical'
  ip: string
  userAgent?: string
  path: string
  details: string
  action: 'allowed' | 'blocked' | 'monitored'
}

interface ThreatSummary {
  type: string
  count: number
  trend: 'up' | 'down' | 'stable'
  percentage: number
}

interface GeoData {
  country: string
  requests: number
  threats: number
  riskLevel: 'low' | 'medium' | 'high'
}

interface BlockedRequest {
  timestamp: Date
  ip: string
  reason: string
  path: string
  country?: string
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    loadSecurityMetrics()
    
    if (autoRefresh) {
      const interval = setInterval(loadSecurityMetrics, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const loadSecurityMetrics = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API call - in production, this would fetch real data
      const mockMetrics: SecurityMetrics = {
        totalRequests: 12543,
        blockedRequests: 89,
        rateLimitHits: 23,
        securityEvents: [
          {
            id: '1',
            timestamp: new Date(Date.now() - 300000),
            type: 'xss',
            severity: 'high',
            ip: '192.168.1.100',
            path: '/search',
            details: 'Potential XSS attempt detected in search query',
            action: 'blocked'
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 600000),
            type: 'rate_limit',
            severity: 'medium',
            ip: '10.0.0.5',
            path: '/api/auth/login',
            details: 'Rate limit exceeded for login attempts',
            action: 'blocked'
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 900000),
            type: 'sqli',
            severity: 'critical',
            ip: '203.0.113.45',
            path: '/api/users',
            details: 'SQL injection pattern detected',
            action: 'blocked'
          }
        ],
        topThreats: [
          { type: 'XSS Attempts', count: 34, trend: 'up', percentage: 38.2 },
          { type: 'Rate Limiting', count: 23, trend: 'stable', percentage: 25.8 },
          { type: 'SQL Injection', count: 18, trend: 'down', percentage: 20.2 },
          { type: 'Path Traversal', count: 14, trend: 'up', percentage: 15.8 }
        ],
        geoDistribution: [
          { country: 'US', requests: 8543, threats: 12, riskLevel: 'low' },
          { country: 'CN', requests: 2341, threats: 45, riskLevel: 'high' },
          { country: 'RU', requests: 1234, threats: 23, riskLevel: 'medium' },
          { country: 'DE', requests: 432, threats: 3, riskLevel: 'low' }
        ],
        recentBlocks: [
          {
            timestamp: new Date(Date.now() - 120000),
            ip: '192.168.1.100',
            reason: 'XSS Attempt',
            path: '/search',
            country: 'US'
          },
          {
            timestamp: new Date(Date.now() - 240000),
            ip: '203.0.113.45',
            reason: 'SQL Injection',
            path: '/api/users',
            country: 'CN'
          }
        ]
      }
      
      setMetrics(mockMetrics)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to load security metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getThreatIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'xss': return <Zap className="w-4 h-4" />
      case 'sqli': return <Database className="w-4 h-4" />
      case 'rate_limit': return <Clock className="w-4 h-4" />
      case 'path_traversal': return <Lock className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const blockIP = async (ip: string) => {
    // In production, this would call an API to block the IP
    console.log('Blocking IP:', ip)
    alert(`IP ${ip} has been blocked`)
  }

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading security metrics...</p>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load security metrics</p>
        <Button onClick={loadSecurityMetrics} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  const threatPercentage = (metrics.blockedRequests / metrics.totalRequests) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time security monitoring and threat detection
          </p>
        </div>
        <div className="flex items-center gap-4">
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
          <Button onClick={loadSecurityMetrics} size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Requests</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.blockedRequests}</div>
            <p className="text-xs text-muted-foreground">
              {threatPercentage.toFixed(2)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit Hits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.rateLimitHits}</div>
            <p className="text-xs text-muted-foreground">Active rate limiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(100 - threatPercentage)}%
            </div>
            <Progress value={100 - threatPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Latest security incidents and blocked attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.securityEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                    {getThreatIcon(event.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{event.type.toUpperCase().replace('_', ' ')}</span>
                      <Badge variant={event.action === 'blocked' ? 'destructive' : 'secondary'}>
                        {event.action}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.ip} • {event.path} • {event.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => blockIP(event.ip)}
                  >
                    Block IP
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Threat Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Threats
            </CardTitle>
            <CardDescription>
              Most common security threats detected
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.topThreats.map((threat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-medium">{threat.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {threat.count} ({threat.percentage}%)
                  </span>
                  <Badge variant={threat.trend === 'up' ? 'destructive' : threat.trend === 'down' ? 'default' : 'secondary'}>
                    {threat.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              Request and threat distribution by country
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.geoDistribution.map((geo, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    geo.riskLevel === 'high' ? 'bg-red-500' :
                    geo.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="font-medium">{geo.country}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{geo.requests.toLocaleString()} requests</div>
                  <div className="text-xs text-red-600">{geo.threats} threats</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Blocks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="w-5 h-5" />
            Recently Blocked
          </CardTitle>
          <CardDescription>
            Latest blocked requests and IPs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentBlocks.map((block, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Ban className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="font-medium">{block.ip}</div>
                    <div className="text-sm text-muted-foreground">
                      {block.reason} • {block.path}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{block.country}</div>
                  <div className="text-xs text-muted-foreground">
                    {block.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Security systems operational. Last update: {lastUpdate?.toLocaleTimeString()}.
          {autoRefresh && ' Auto-refresh enabled.'}
        </AlertDescription>
      </Alert>
    </div>
  )
}
