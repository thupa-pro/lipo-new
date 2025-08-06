'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  Users,
  Briefcase,
  Star,
  TrendingUp,
  TrendingDown,
  Shield,
  Settings,
  Bell,
  Eye,
  UserCheck,
  DollarSign,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Bot,
  Brain,
  Target,
  Globe,
  Cpu,
  Database,
  Server,
  Wifi,
  Monitor,
  Smartphone,
  BarChart3,
  PieChart,
  LineChart,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Video,
  FileText,
  Image,
  Bookmark,
  Heart,
  Share2,
  ExternalLink,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Sparkles,
  Crown,
  Flame,
  Rocket,
  Lightning,
} from "lucide-react";
import Link from "next/link";
import { AdminRoute } from '@/components/auth/protected-route';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  color: string;
  bgColor: string;
  description?: string;
  target?: number;
  current?: number;
}

function MetricCard({ title, value, change, trend, icon: Icon, color, bgColor, description, target, current }: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    const timer = setTimeout(() => {
      setAnimatedValue(numericValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/50">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {title}
                </p>
                <div className="flex items-center gap-2">
                  {trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : trend === "down" ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-blue-500" />
                  )}
                  <span className={`text-sm font-semibold ${
                    trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-blue-500"
                  }`}>
                    {change}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {typeof value === 'string' ? value : animatedValue.toLocaleString()}
              </p>
              {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>

            {target && current && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Progress to target</span>
                  <span className="font-medium">{Math.round((current / target) * 100)}%</span>
                </div>
                <Progress value={(current / target) * 100} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IntelligentInsightCard({ title, icon: Icon, children, trend, color = "blue" }: any) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white via-white to-gray-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30 shadow-sm hover:shadow-2xl transition-all duration-500">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
        color === 'blue' ? 'from-blue-500 to-cyan-500' :
        color === 'green' ? 'from-green-500 to-emerald-500' :
        color === 'purple' ? 'from-purple-500 to-fuchsia-500' :
        color === 'orange' ? 'from-orange-500 to-red-500' :
        'from-gray-500 to-gray-600'
      }`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-bold">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${
              color === 'blue' ? 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20' :
              color === 'green' ? 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20' :
              color === 'purple' ? 'from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20' :
              color === 'orange' ? 'from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20' :
              'from-gray-100 to-gray-200 dark:from-gray-800/20 dark:to-gray-700/20'
            }`}>
              <Icon className={`w-5 h-5 ${
                color === 'blue' ? 'text-blue-600' :
                color === 'green' ? 'text-green-600' :
                color === 'purple' ? 'text-purple-600' :
                color === 'orange' ? 'text-orange-600' :
                'text-gray-600'
              }`} />
            </div>
            {title}
          </CardTitle>
          {trend && (
            <Badge variant="secondary" className="text-xs">
              {trend}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export default function ModernAdminDashboard() {
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Real-time metrics with AI insights
  const metrics = [
    {
      title: "Total Users",
      value: "2,147,483",
      change: "+12.5%",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20",
      description: "Active platform users",
      target: 2500000,
      current: 2147483,
    },
    {
      title: "AI Matches",
      value: "98.7%",
      change: "+2.1%",
      trend: "up" as const,
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20",
      description: "ML success rate",
      target: 100,
      current: 98.7,
    },
    {
      title: "Revenue",
      value: "$12.4M",
      change: "+15.3%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20",
      description: "Monthly recurring",
      target: 15000000,
      current: 12400000,
    },
    {
      title: "Live Services",
      value: "45,678",
      change: "+8.2%",
      trend: "up" as const,
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20",
      description: "Real-time active",
      target: 50000,
      current: 45678,
    },
  ];

  const aiInsights = [
    {
      type: "prediction",
      title: "Peak Demand Forecast",
      message: "AI predicts 35% increase in home cleaning requests this weekend",
      confidence: 94,
      action: "Recommend provider incentives",
      icon: Target,
      color: "blue",
    },
    {
      type: "optimization",
      title: "Route Optimization",
      message: "ML algorithm reduced average travel time by 23% in metro areas",
      confidence: 87,
      action: "Deploy to remaining cities",
      icon: MapPin,
      color: "green",
    },
    {
      type: "anomaly",
      title: "Unusual Activity",
      message: "Detected 15% surge in plumbing requests in Seattle area",
      confidence: 78,
      action: "Investigate potential cause",
      icon: AlertTriangle,
      color: "orange",
    },
  ];

  const systemHealth = {
    api: { status: "healthy", latency: "45ms", uptime: "99.97%" },
    database: { status: "healthy", queries: "2.3k/sec", connections: "234/500" },
    ai: { status: "healthy", processing: "1.2k/min", accuracy: "94.5%" },
    payments: { status: "healthy", volume: "$450k/hour", success: "99.2%" },
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20">
        <div className="responsive-container py-8">
          {/* Modern Header with AI Insights */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                      Mission Control
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      AI-powered platform intelligence & analytics
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                    All Systems Operational
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Health: 98.7%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Calendar className="w-4 h-4" />
                      {timeRange}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTimeRange('1h')}>Last Hour</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeRange('24h')}>Last 24 Hours</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeRange('7d')}>Last 7 Days</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeRange('30d')}>Last 30 Days</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={refreshData}
                  disabled={isLoading}
                  className="relative overflow-hidden"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Advanced Analytics
                </Button>
              </div>
            </div>
          </div>

          {/* Intelligent Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Tabbed Intelligence Dashboard */}
          <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="ai-insights" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Insights
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                System
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Real-time Activity Feed */}
                <div className="lg:col-span-2">
                  <IntelligentInsightCard
                    title="Live Platform Activity"
                    icon={Activity}
                    color="blue"
                    trend="Real-time"
                  >
                    <div className="space-y-4">
                      {[
                        { user: "Sarah Chen", action: "joined as Elite Provider", type: "provider", time: "2m ago", location: "San Francisco" },
                        { user: "AI System", action: "optimized 247 service routes", type: "system", time: "3m ago", location: "Global" },
                        { user: "Mike Rodriguez", action: "completed premium service", type: "service", time: "5m ago", location: "Austin" },
                        { user: "Payment Gateway", action: "processed $12,450 in payments", type: "payment", time: "7m ago", location: "Multi-region" },
                        { user: "Emma Thompson", action: "received 5-star rating", type: "rating", time: "8m ago", location: "New York" },
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-700/50 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            activity.type === 'provider' ? 'bg-blue-100 dark:bg-blue-900/20' :
                            activity.type === 'system' ? 'bg-purple-100 dark:bg-purple-900/20' :
                            activity.type === 'service' ? 'bg-green-100 dark:bg-green-900/20' :
                            activity.type === 'payment' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                            'bg-pink-100 dark:bg-pink-900/20'
                          }`}>
                            {activity.type === 'provider' && <UserCheck className="w-5 h-5 text-blue-600" />}
                            {activity.type === 'system' && <Bot className="w-5 h-5 text-purple-600" />}
                            {activity.type === 'service' && <CheckCircle className="w-5 h-5 text-green-600" />}
                            {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-yellow-600" />}
                            {activity.type === 'rating' && <Star className="w-5 h-5 text-pink-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                {activity.user}
                              </span>
                              <span className="text-xs text-gray-500">{activity.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                              {activity.action}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {activity.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </IntelligentInsightCard>
                </div>

                {/* AI Insights Panel */}
                <div className="space-y-6">
                  <IntelligentInsightCard
                    title="AI Intelligence"
                    icon={Brain}
                    color="purple"
                    trend="ML Powered"
                  >
                    <div className="space-y-4">
                      {aiInsights.map((insight, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${
                              insight.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                              insight.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                              'bg-orange-100 dark:bg-orange-900/20'
                            }`}>
                              <insight.icon className={`w-4 h-4 ${
                                insight.color === 'blue' ? 'text-blue-600' :
                                insight.color === 'green' ? 'text-green-600' :
                                'text-orange-600'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                {insight.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                {insight.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {insight.confidence}% confidence
                                </Badge>
                                <Button size="sm" variant="ghost" className="text-xs h-6">
                                  {insight.action}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </IntelligentInsightCard>

                  {/* Quick Actions */}
                  <IntelligentInsightCard
                    title="Quick Actions"
                    icon={Zap}
                    color="orange"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "User Mgmt", href: "/admin/users", icon: Users, color: "blue" },
                        { label: "Analytics", href: "/admin/analytics", icon: BarChart3, color: "green" },
                        { label: "Providers", href: "/admin/providers", icon: UserCheck, color: "purple" },
                        { label: "Settings", href: "/admin/settings", icon: Settings, color: "gray" },
                      ].map((action, idx) => (
                        <Button
                          key={idx}
                          asChild
                          variant="outline"
                          className="h-16 flex-col gap-2 hover:shadow-md transition-all duration-300 group"
                        >
                          <Link href={action.href}>
                            <action.icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                              action.color === 'blue' ? 'text-blue-600' :
                              action.color === 'green' ? 'text-green-600' :
                              action.color === 'purple' ? 'text-purple-600' :
                              'text-gray-600'
                            }`} />
                            <span className="text-xs font-medium">{action.label}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </IntelligentInsightCard>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiInsights.map((insight, idx) => (
                  <IntelligentInsightCard
                    key={idx}
                    title={insight.title}
                    icon={insight.icon}
                    color={insight.color}
                    trend={`${insight.confidence}% confidence`}
                  >
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-300">{insight.message}</p>
                      <div className="flex items-center justify-between">
                        <Progress value={insight.confidence} className="flex-1 mr-4" />
                        <span className="text-sm font-medium">{insight.confidence}%</span>
                      </div>
                      <Button className="w-full" variant="outline">
                        {insight.action}
                      </Button>
                    </div>
                  </IntelligentInsightCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(systemHealth).map(([key, health]) => (
                  <IntelligentInsightCard
                    key={key}
                    title={key.toUpperCase()}
                    icon={key === 'api' ? Globe : key === 'database' ? Database : key === 'ai' ? Brain : DollarSign}
                    color={health.status === 'healthy' ? 'green' : 'orange'}
                    trend={health.status}
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(health).filter(([k]) => k !== 'status').map(([metricKey, metricValue]) => (
                          <div key={metricKey} className="space-y-1">
                            <span className="text-gray-500 capitalize">{metricKey}</span>
                            <div className="font-semibold text-gray-900 dark:text-white">{metricValue}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </IntelligentInsightCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <IntelligentInsightCard
                title="User Management Hub"
                icon={Users}
                color="blue"
                trend="Live Data"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Recent Signups</h3>
                    {[
                      { name: "Alice Johnson", role: "Customer", time: "5m ago", avatar: "AJ" },
                      { name: "Bob Smith", role: "Provider", time: "12m ago", avatar: "BS" },
                      { name: "Carol Lee", role: "Customer", time: "18m ago", avatar: "CL" },
                    ].map((user, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.role} • {user.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Top Performers</h3>
                    {[
                      { name: "David Kim", rating: 4.9, jobs: 247, avatar: "DK" },
                      { name: "Eva Martinez", rating: 4.8, jobs: 198, avatar: "EM" },
                      { name: "Frank Wilson", rating: 4.7, jobs: 156, avatar: "FW" },
                    ].map((provider, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                            {provider.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{provider.name}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{provider.rating}</span>
                            <span className="text-gray-500">• {provider.jobs} jobs</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Actions Needed</h3>
                    {[
                      { action: "Review provider applications", count: 12, urgency: "high" },
                      { action: "Approve pending verifications", count: 8, urgency: "medium" },
                      { action: "Process disputed payments", count: 3, urgency: "high" },
                    ].map((item, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                        item.urgency === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' :
                        'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                      }`}>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{item.action}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.count} items pending</p>
                      </div>
                    ))}
                  </div>
                </div>
              </IntelligentInsightCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRoute>
  );
}
