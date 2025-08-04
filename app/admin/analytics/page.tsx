"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Activity,
  Clock,
  Star,
  Target,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  Globe,
  UserCheck,
  CreditCard,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface AnalyticsData {
  overview: Array<{
    metric: string;
    value: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    period: string;
  }>;
  locationMetrics: Array<{
    location: { city: string; state: string };
    metrics: {
      totalUsers: number;
      activeProviders: number;
      bookingsCount: number;
      revenue: number;
      averageRating: number;
    };
    trends: {
      userGrowth: number;
      bookingGrowth: number;
      revenueGrowth: number;
    };
  }>;
  roleMetrics: Array<{
    role: 'customer' | 'provider' | 'admin';
    metrics: {
      totalUsers: number;
      activeUsers: number;
      retentionRate: number;
      engagementScore: number;
      conversionRate: number;
    };
    behaviors: {
      topActions: Array<{ action: string; count: number }>;
      peakHours: number[];
    };
  }>;
  revenue: {
    totalRevenue: number;
    platformFees: number;
    providerPayouts: number;
    averageBookingValue: number;
    revenueByCategory: Array<{
      category: string;
      revenue: number;
      bookings: number;
      growth: number;
    }>;
    monetizationMetrics: {
      arpu: number;
      ltv: number;
      cac: number;
      paybackPeriod: number;
    };
  };
  performance: {
    systemHealth: {
      uptime: number;
      responseTime: number;
      errorRate: number;
      throughput: number;
    };
    businessKPIs: {
      gmv: number;
      bookingSuccess: number;
      providerUtilization: number;
      customerSatisfaction: number;
    };
  };
}

interface RealtimeMetrics {
  activeUsers: number;
  ongoingBookings: number;
  recentSignups: number;
  systemLoad: number;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [realtimeData, setRealtimeData] = useState<RealtimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
    loadRealtimeData();

    // Set up real-time updates
    const realtimeInterval = setInterval(loadRealtimeData, 30000); // Every 30 seconds
    return () => clearInterval(realtimeInterval);
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const query = {
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        filters: {},
        groupBy: 'day' as const
      };

      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dashboard', query })
      });

      if (!response.ok) {
        throw new Error('Failed to load analytics data');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
      
      // Mock data for demonstration
      setData({
        overview: [
          { metric: 'Total Users', value: 12547, change: 12.5, changeType: 'increase', period: 'vs last month' },
          { metric: 'Active Providers', value: 2341, change: 8.3, changeType: 'increase', period: 'vs last month' },
          { metric: 'Total Bookings', value: 5832, change: 15.7, changeType: 'increase', period: 'vs last month' },
          { metric: 'Total Revenue', value: 284750, change: 22.1, changeType: 'increase', period: 'vs last month' }
        ],
        locationMetrics: [
          {
            location: { city: 'San Francisco', state: 'CA' },
            metrics: { totalUsers: 3421, activeProviders: 542, bookingsCount: 1234, revenue: 85432, averageRating: 4.8 },
            trends: { userGrowth: 15.2, bookingGrowth: 18.7, revenueGrowth: 25.3 }
          },
          {
            location: { city: 'New York', state: 'NY' },
            metrics: { totalUsers: 2987, activeProviders: 487, bookingsCount: 1098, revenue: 73298, averageRating: 4.7 },
            trends: { userGrowth: 12.8, bookingGrowth: 14.2, revenueGrowth: 19.6 }
          },
          {
            location: { city: 'Los Angeles', state: 'CA' },
            metrics: { totalUsers: 2654, activeProviders: 423, bookingsCount: 987, revenue: 65847, averageRating: 4.6 },
            trends: { userGrowth: 9.4, bookingGrowth: 11.8, revenueGrowth: 16.2 }
          }
        ],
        roleMetrics: [
          {
            role: 'customer',
            metrics: { totalUsers: 10206, activeUsers: 7834, retentionRate: 76.8, engagementScore: 84.2, conversionRate: 23.4 },
            behaviors: {
              topActions: [
                { action: 'search_services', count: 45672 },
                { action: 'view_provider', count: 23451 },
                { action: 'create_booking', count: 12834 },
                { action: 'leave_review', count: 8976 },
                { action: 'message_provider', count: 6543 }
              ],
              peakHours: [14, 19, 10]
            }
          },
          {
            role: 'provider',
            metrics: { totalUsers: 2341, activeUsers: 2156, retentionRate: 92.1, engagementScore: 91.7, conversionRate: 0 },
            behaviors: {
              topActions: [
                { action: 'update_availability', count: 15432 },
                { action: 'respond_booking', count: 12765 },
                { action: 'view_earnings', count: 9876 },
                { action: 'update_profile', count: 7654 },
                { action: 'message_customer', count: 5432 }
              ],
              peakHours: [9, 13, 17]
            }
          }
        ],
        revenue: {
          totalRevenue: 284750,
          platformFees: 42712,
          providerPayouts: 242038,
          averageBookingValue: 89.45,
          revenueByCategory: [
            { category: 'House Cleaning', revenue: 95432, bookings: 1234, growth: 18.5 },
            { category: 'Handyman Services', revenue: 78965, bookings: 987, growth: 22.1 },
            { category: 'Pet Care', revenue: 52341, bookings: 765, growth: 15.7 },
            { category: 'Personal Training', revenue: 45876, bookings: 543, growth: 28.3 },
            { category: 'Tutoring', revenue: 12136, bookings: 298, growth: 11.2 }
          ],
          monetizationMetrics: {
            arpu: 22.68,
            ltv: 272.16,
            cac: 35.50,
            paybackPeriod: 1.6
          }
        },
        performance: {
          systemHealth: {
            uptime: 99.94,
            responseTime: 245,
            errorRate: 0.08,
            throughput: 194.4
          },
          businessKPIs: {
            gmv: 284750,
            bookingSuccess: 94.2,
            providerUtilization: 78.6,
            customerSatisfaction: 94.1
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const response = await fetch('/api/analytics?action=realtime');
      if (response.ok) {
        const realtime = await response.json();
        setRealtimeData(realtime);
      } else {
        // Mock real-time data
        setRealtimeData({
          activeUsers: Math.floor(Math.random() * 500) + 200,
          ongoingBookings: Math.floor(Math.random() * 50) + 10,
          recentSignups: Math.floor(Math.random() * 20) + 5,
          systemLoad: Math.random() * 100
        });
      }
    } catch (error) {
      console.error('Error loading real-time data:', error);
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'decrease': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-[var(--mid-gray)]">
              Comprehensive insights into platform performance and user behavior
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={loadAnalyticsData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Real-time Metrics */}
        {realtimeData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{realtimeData.activeUsers}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Ongoing Bookings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{realtimeData.ongoingBookings}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Recent Signups</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{realtimeData.recentSignups}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">System Load</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{realtimeData.systemLoad.toFixed(1)}%</p>
                  </div>
                  <Zap className="w-8 h-8 text-orange-500" />
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${realtimeData.systemLoad}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Overview Metrics */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {data.overview.map((metric, index) => (
              <Card key={index} className="card-premium border-gray-200 dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-[var(--mid-gray)]">
                      {metric.metric}
                    </h3>
                    {getChangeIcon(metric.changeType)}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.metric.includes('Revenue') 
                        ? formatCurrency(metric.value) 
                        : formatNumber(metric.value)
                      }
                    </p>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'increase' ? 'text-green-600 dark:text-green-400' :
                      metric.changeType === 'decrease' ? 'text-red-600 dark:text-red-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {metric.changeType === 'increase' ? '+' : metric.changeType === 'decrease' ? '-' : ''}
                      {Math.abs(metric.change)}%
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {metric.period}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed Analytics Tabs */}
        {data && (
          <Tabs defaultValue="locations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="locations">Location Analytics</TabsTrigger>
              <TabsTrigger value="roles">User Roles</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="locations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {data.locationMetrics.map((location, index) => (
                  <Card key={index} className="card-premium border-gray-200 dark:border-white/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        {location.location.city}, {location.location.state}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatNumber(location.metrics.totalUsers)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-[var(--mid-gray)]">Total Users</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatNumber(location.metrics.activeProviders)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-[var(--mid-gray)]">Providers</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Bookings</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatNumber(location.metrics.bookingsCount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Revenue</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(location.metrics.revenue)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Avg Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {location.metrics.averageRating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Growth Trends</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-[var(--mid-gray)]">Users</span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              +{location.trends.userGrowth}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-[var(--mid-gray)]">Bookings</span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              +{location.trends.bookingGrowth}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-[var(--mid-gray)]">Revenue</span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              +{location.trends.revenueGrowth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.roleMetrics.map((role, index) => (
                  <Card key={index} className="card-premium border-gray-200 dark:border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white capitalize">
                        <Users className="w-5 h-5 text-purple-500" />
                        {role.role}s
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatNumber(role.metrics.totalUsers)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-[var(--mid-gray)]">Total Users</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatNumber(role.metrics.activeUsers)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-[var(--mid-gray)]">Active Users</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Retention Rate</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {role.metrics.retentionRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Engagement Score</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {role.metrics.engagementScore.toFixed(1)}
                          </span>
                        </div>
                        {role.metrics.conversionRate > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Conversion Rate</span>
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              {role.metrics.conversionRate.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Top Actions</h4>
                        <div className="space-y-2">
                          {role.behaviors.topActions.slice(0, 3).map((action, actionIndex) => (
                            <div key={actionIndex} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)] capitalize">
                                {action.action.replace(/_/g, ' ')}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatNumber(action.count)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Peak Hours</h4>
                        <div className="flex gap-2">
                          {role.behaviors.peakHours.map((hour, hourIndex) => (
                            <Badge key={hourIndex} variant="outline" className="text-xs">
                              {hour}:00
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="card-premium border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(data.revenue.totalRevenue)}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-premium border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Platform Fees</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(data.revenue.platformFees)}
                        </p>
                      </div>
                      <CreditCard className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-premium border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Avg Booking Value</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(data.revenue.averageBookingValue)}
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-premium border-gray-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Revenue by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.revenue.revenueByCategory.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {category.category}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                                {formatCurrency(category.revenue)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                                  style={{ width: `${(category.revenue / data.revenue.revenueByCategory[0].revenue) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-green-600 dark:text-green-400 whitespace-nowrap">
                                +{category.growth}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-premium border-gray-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Monetization Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">ARPU</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(data.revenue.monetizationMetrics.arpu)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">LTV</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(data.revenue.monetizationMetrics.ltv)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">CAC</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(data.revenue.monetizationMetrics.cac)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Payback Period</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {data.revenue.monetizationMetrics.paybackPeriod} months
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-premium border-gray-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Uptime</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {data.performance.systemHealth.uptime}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Response Time</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {data.performance.systemHealth.responseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Error Rate</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {data.performance.systemHealth.errorRate}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Throughput</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {data.performance.systemHealth.throughput}/day
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-premium border-gray-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Business KPIs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">GMV</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(data.performance.businessKPIs.gmv)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Booking Success</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {data.performance.businessKPIs.bookingSuccess}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Provider Utilization</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {data.performance.businessKPIs.providerUtilization}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Customer Satisfaction</span>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                          {data.performance.businessKPIs.customerSatisfaction}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
