'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  RefreshCw,
  DollarSign,
  Star,
  Eye,
  Target
} from 'lucide-react';
import { analyticsService, getOverviewMetrics, getRealTimeData, getSystemHealth, getErrorLogs } from '@/lib/analytics/real-analytics-service';

interface DashboardMetrics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    revenueGrowth: number;
    conversionRate: number;
    averageSessionDuration: number;
  };
  realTime: {
    currentActiveUsers: number;
    currentBookings: number;
    systemLoad: number;
    latestActivities: any[];
  };
  errors: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    resolved: number;
    pending: number;
    recentErrors: any[];
  };
  performance: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    regions: any[];
  };
  services: {
    totalBookings: number;
    completedServices: number;
    averageRating: number;
    disputeRate: number;
  };
}

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    overview: {
      totalUsers: 0,
      activeUsers: 0,
      totalRevenue: 0,
      revenueGrowth: 0,
      conversionRate: 0,
      averageSessionDuration: 0
    },
    realTime: {
      currentActiveUsers: 0,
      currentBookings: 0,
      systemLoad: 0,
      latestActivities: []
    },
    errors: {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      resolved: 0,
      pending: 0,
      recentErrors: []
    },
    performance: {
      uptime: 0,
      responseTime: 0,
      errorRate: 0,
      regions: []
    },
    services: {
      totalBookings: 0,
      completedServices: 0,
      averageRating: 0,
      disputeRate: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadAnalyticsData = async () => {
    try {
      const overview = getOverviewMetrics();
      const realTime = getRealTimeData();
      const systemHealth = getSystemHealth();
      const serviceMetrics = analyticsService.getServiceMetrics();
      const errorLogs = getErrorLogs();

      // Process error statistics
      const criticalErrors = errorLogs.filter(e => e.severity === 'critical');
      const highErrors = errorLogs.filter(e => e.severity === 'high');
      const mediumErrors = errorLogs.filter(e => e.severity === 'medium');
      const lowErrors = errorLogs.filter(e => e.severity === 'low');
      const resolvedErrors = errorLogs.filter(e => e.resolved);

      setMetrics({
        overview,
        realTime,
        errors: {
          total: errorLogs.length,
          critical: criticalErrors.length,
          high: highErrors.length,
          medium: mediumErrors.length,
          low: lowErrors.length,
          resolved: resolvedErrors.length,
          pending: errorLogs.length - resolvedErrors.length,
          recentErrors: errorLogs.slice(0, 5).map(error => ({
            id: error.id,
            type: error.type.charAt(0).toUpperCase() + error.type.slice(1),
            message: error.message,
            severity: error.severity,
            time: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
              Math.floor((error.timestamp.getTime() - Date.now()) / (1000 * 60)), 'minute'
            )
          }))
        },
        performance: {
          uptime: systemHealth.uptime,
          responseTime: systemHealth.responseTime,
          errorRate: systemHealth.errorRate,
          regions: [
            { name: 'US East', status: 'healthy', latency: 23, load: 45 },
            { name: 'US West', status: 'healthy', latency: 45, load: 62 },
            { name: 'Europe', status: 'healthy', latency: 67, load: 38 },
            { name: 'Asia', status: systemHealth.criticalErrors > 0 ? 'degraded' : 'healthy', latency: 189, load: 71 }
          ]
        },
        services: serviceMetrics
      });

      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data
    loadAnalyticsData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadAnalyticsData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Badge>
          <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.overview.activeUsers.toLocaleString()} active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.overview.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.overview.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.services.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.services.completedServices.toLocaleString()} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.services.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.services.disputeRate}% dispute rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Real-time Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Users</span>
                <Badge variant="outline">{metrics.realTime.currentActiveUsers}</Badge>
              </div>
              <Progress value={(metrics.realTime.currentActiveUsers / 500) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Bookings</span>
                <Badge variant="outline">{metrics.realTime.currentBookings}</Badge>
              </div>
              <Progress value={(metrics.realTime.currentBookings / 50) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Load</span>
                <Badge variant="outline">{metrics.realTime.systemLoad}%</Badge>
              </div>
              <Progress value={metrics.realTime.systemLoad} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="errors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="errors">Error Monitoring</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Overview</CardTitle>
                <CardDescription>
                  Error distribution by severity level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Errors</span>
                  <Badge variant="outline">{metrics.errors.total}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm">Critical</span>
                    </div>
                    <span className="text-sm font-medium">{metrics.errors.critical}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-sm">High</span>
                    </div>
                    <span className="text-sm font-medium">{metrics.errors.high}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm">Medium</span>
                    </div>
                    <span className="text-sm font-medium">{metrics.errors.medium}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Low</span>
                    </div>
                    <span className="text-sm font-medium">{metrics.errors.low}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolved</span>
                    <Badge variant="outline" className="text-green-600">{metrics.errors.resolved}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <Badge variant="outline" className="text-red-600">{metrics.errors.pending}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
                <CardDescription>
                  Latest error reports and issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.errors.recentErrors.map((error: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(error.severity)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{error.type}</Badge>
                          <span className="text-xs text-muted-foreground">{error.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {error.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>
                  Key performance metrics and system health
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uptime</span>
                  <Badge variant="outline" className="text-green-600">{metrics.performance.uptime}%</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Time</span>
                  <Badge variant="outline">{metrics.performance.responseTime}ms</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Error Rate</span>
                  <Badge variant="outline" className={metrics.performance.errorRate > 1 ? 'text-red-600' : 'text-green-600'}>
                    {metrics.performance.errorRate}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Conversion Rate</span>
                  <Badge variant="outline">{metrics.overview.conversionRate}%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>
                  Performance metrics by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.performance.regions.map((region: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{region.name}</div>
                          <div className={`text-xs ${getStatusColor(region.status)}`}>
                            {region.status}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{region.latency}ms</div>
                        <div className="text-xs text-muted-foreground">{region.load}% load</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>
                Latest user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.realTime.latestActivities.slice(0, 10).map((activity: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()} • {activity.type}
                        {activity.amount && ` • $${activity.amount}`}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
