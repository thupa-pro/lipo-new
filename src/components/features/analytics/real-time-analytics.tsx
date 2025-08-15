"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { 
  Activity, Users, DollarSign, TrendingUp, TrendingDown, 
  Eye, Clock, Zap, Globe, Signal, Wifi, WifiOff,
  Play, Pause, RotateCcw, Settings, AlertCircle,
  CheckCircle, ArrowUp, ArrowDown, Dot, Radio
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RealTimeDataPoint {
  timestamp: number;
  value: number;
  label?: string;
  category?: string;
}

interface LiveMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  unit: string;
  icon: React.ElementType;
  color: string;
  history: RealTimeDataPoint[];
  alert?: {
    type: 'warning' | 'critical' | 'info';
    message: string;
  };
}

interface LiveEvent {
  id: string;
  type: 'user_action' | 'transaction' | 'error' | 'milestone';
  title: string;
  description: string;
  timestamp: number;
  value?: number;
  location?: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface RealTimeAnalyticsProps {
  isLive?: boolean;
  refreshInterval?: number;
  maxDataPoints?: number;
  showEventFeed?: boolean;
  onToggleLive?: (isLive: boolean) => void;
  onMetricAlert?: (metric: LiveMetric) => void;
  className?: string;
}

export function RealTimeAnalytics({
  isLive = true,
  refreshInterval = 5000,
  maxDataPoints = 50,
  showEventFeed = true,
  onToggleLive,
  onMetricAlert,
  className = ""
}: RealTimeAnalyticsProps) {
  const [liveData, setLiveData] = useState<RealTimeDataPoint[]>([]);
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [autoScroll, setAutoScroll] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const eventFeedRef = useRef<HTMLDivElement>(null);

  // Initialize mock data
  useEffect(() => {
    const initializeData = () => {
      const now = Date.now();
      const initialData = Array.from({ length: 20 }, (_, i) => ({
        timestamp: now - (19 - i) * 30000,
        value: Math.floor(Math.random() * 1000) + 500,
        label: new Date(now - (19 - i) * 30000).toLocaleTimeString()
      }));

      setLiveData(initialData);

      setMetrics([
        {
          id: 'active_users',
          title: 'Active Users',
          value: 1247,
          change: 5.2,
          changeType: 'positive',
          unit: '',
          icon: Users,
          color: 'bg-blue-500',
          history: initialData.map(d => ({ ...d, value: d.value * 0.8 }))
        },
        {
          id: 'revenue',
          title: 'Revenue',
          value: 15420,
          change: -2.1,
          changeType: 'negative',
          unit: '$',
          icon: DollarSign,
          color: 'bg-green-500',
          history: initialData.map(d => ({ ...d, value: d.value * 15 }))
        },
        {
          id: 'page_views',
          title: 'Page Views',
          value: 8934,
          change: 12.5,
          changeType: 'positive',
          unit: '',
          icon: Eye,
          color: 'bg-purple-500',
          history: initialData.map(d => ({ ...d, value: d.value * 8 }))
        },
        {
          id: 'response_time',
          title: 'Response Time',
          value: 245,
          change: 8.3,
          changeType: 'negative',
          unit: 'ms',
          icon: Clock,
          color: 'bg-orange-500',
          history: initialData.map(d => ({ ...d, value: Math.floor(d.value * 0.3) })),
          alert: {
            type: 'warning',
            message: 'Response time above normal threshold'
          }
        }
      ]);

      setEvents([
        {
          id: '1',
          type: 'user_action',
          title: 'New User Registration',
          description: 'Sarah M. just signed up from New York',
          timestamp: now - 30000,
          user: { id: '1', name: 'Sarah M.', avatar: '/placeholder.svg' },
          location: 'New York, NY'
        },
        {
          id: '2',
          type: 'transaction',
          title: 'Payment Processed',
          description: 'Service booking payment of $150',
          timestamp: now - 60000,
          value: 150,
          user: { id: '2', name: 'John D.', avatar: '/placeholder.svg' }
        },
        {
          id: '3',
          type: 'milestone',
          title: '10K Users Milestone',
          description: 'Platform reached 10,000 registered users',
          timestamp: now - 120000
        }
      ]);
    };

    initializeData();
  }, []);

  // Real-time data simulation
  useEffect(() => {
    if (!isLive) return;

    const updateData = () => {
      const now = Date.now();
      
      // Update main chart data
      setLiveData(prev => {
        const newPoint = {
          timestamp: now,
          value: Math.floor(Math.random() * 1000) + 500,
          label: new Date(now).toLocaleTimeString()
        };
        const updated = [...prev, newPoint];
        return updated.slice(-maxDataPoints);
      });

      // Update metrics
      setMetrics(prev => prev.map(metric => {
        const newValue = metric.value + (Math.random() - 0.5) * 100;
        const newPoint = {
          timestamp: now,
          value: newValue,
          label: new Date(now).toLocaleTimeString()
        };
        
        const updatedHistory = [...metric.history, newPoint].slice(-maxDataPoints);
        const change = ((newValue - metric.value) / metric.value) * 100;
        
        const updatedMetric = {
          ...metric,
          value: Math.max(0, newValue),
          change: change,
          changeType: change > 0 ? 'positive' as const : change < 0 ? 'negative' as const : 'neutral' as const,
          history: updatedHistory
        };

        // Check for alerts
        if (updatedMetric.id === 'response_time' && newValue > 300) {
          updatedMetric.alert = {
            type: 'critical',
            message: 'Response time critically high!'
          };
          onMetricAlert?.(updatedMetric);
        }

        return updatedMetric;
      }));

      // Occasionally add new events
      if (Math.random() < 0.3) {
        const eventTypes = ['user_action', 'transaction', 'error', 'milestone'] as const;
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        const newEvent: LiveEvent = {
          id: Date.now().toString(),
          type: randomType,
          title: getRandomEventTitle(randomType),
          description: getRandomEventDescription(randomType),
          timestamp: now,
          value: randomType === 'transaction' ? Math.floor(Math.random() * 500) + 50 : undefined,
          location: Math.random() > 0.5 ? getRandomLocation() : undefined,
          user: Math.random() > 0.3 ? {
            id: Math.random().toString(),
            name: getRandomUserName(),
            avatar: '/placeholder.svg'
          } : undefined
        };

        setEvents(prev => [newEvent, ...prev].slice(0, 20));
      }
    };

    intervalRef.current = setInterval(updateData, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, refreshInterval, maxDataPoints, onMetricAlert]);

  // Auto-scroll event feed
  useEffect(() => {
    if (autoScroll && eventFeedRef.current) {
      eventFeedRef.current.scrollTop = 0;
    }
  }, [events, autoScroll]);

  const getRandomEventTitle = (type: string) => {
    const titles = {
      user_action: ['New User Registration', 'Profile Updated', 'User Login', 'Account Verification'],
      transaction: ['Payment Processed', 'Refund Issued', 'Subscription Renewed', 'Service Booking'],
      error: ['API Error', 'Database Connection Failed', 'Timeout Error', 'Authentication Failed'],
      milestone: ['User Milestone', 'Revenue Target', 'Performance Goal', 'Growth Achievement']
    };
    return titles[type as keyof typeof titles][Math.floor(Math.random() * 4)];
  };

  const getRandomEventDescription = (type: string) => {
    const descriptions = {
      user_action: ['User completed registration process', 'Profile information updated', 'Successful login attempt', 'Email verification completed'],
      transaction: ['Payment successfully processed', 'Refund issued to customer', 'Monthly subscription renewed', 'Service booking confirmed'],
      error: ['API endpoint returned error', 'Database connection timeout', 'Request processing timeout', 'Invalid authentication token'],
      milestone: ['User engagement milestone reached', 'Monthly revenue target achieved', 'Performance benchmark exceeded', 'User growth target met']
    };
    return descriptions[type as keyof typeof descriptions][Math.floor(Math.random() * 4)];
  };

  const getRandomUserName = () => {
    const names = ['Alex M.', 'Sarah J.', 'Mike R.', 'Emma L.', 'John D.', 'Lisa K.', 'Tom B.', 'Anna S.'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const getRandomLocation = () => {
    const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const handleToggleLive = () => {
    const newLiveState = !isLive;
    onToggleLive?.(newLiveState);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'user_action': return <Users className="w-4 h-4" />;
      case 'transaction': return <DollarSign className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'milestone': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'user_action': return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      case 'transaction': return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'error': return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'milestone': return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isLive ? 'animate-pulse' : ''}`} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? (isLive ? 'Live' : 'Paused') : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Live Updates</span>
            <Switch checked={isLive} onCheckedChange={handleToggleLive} />
          </div>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">15m</SelectItem>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="6h">6h</SelectItem>
              <SelectItem value="24h">24h</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${metric.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {metric.alert && (
                      <Badge variant="destructive" className="text-xs">
                        {metric.alert.type}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">
                        {metric.unit === '$' ? '$' : ''}{metric.value.toLocaleString()}{metric.unit !== '$' ? metric.unit : ''}
                      </span>
                      <div className={`flex items-center text-sm ${
                        metric.changeType === 'positive' ? 'text-green-600' :
                        metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.changeType === 'positive' ? (
                          <ArrowUp className="w-3 h-3 mr-1" />
                        ) : metric.changeType === 'negative' ? (
                          <ArrowDown className="w-3 h-3 mr-1" />
                        ) : (
                          <Dot className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(metric.change).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="mt-4 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metric.history.slice(-10)}>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={metric.color.replace('bg-', '').replace('-500', '')} 
                          fill={metric.color.replace('bg-', '').replace('-500', '')}
                          strokeWidth={2}
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {metric.alert && (
                    <div className="absolute top-0 right-0 w-full h-1 bg-red-500 animate-pulse" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Chart and Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Chart */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Live Activity Stream</span>
              {isLive && <Radio className="w-4 h-4 text-green-500 animate-pulse" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={liveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => `Time: ${value}`}
                  formatter={(value: number) => [value.toLocaleString(), 'Activity']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="url(#colorGradient)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={isLive}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Live Event Feed */}
        {showEventFeed && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Live Events</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Auto-scroll</span>
                  <Switch checked={autoScroll} onCheckedChange={setAutoScroll} size="sm" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={eventFeedRef}
                className="space-y-3 max-h-80 overflow-y-auto"
              >
                <AnimatePresence>
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-semibold">{event.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.description}
                            </p>
                            {event.location && (
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Globe className="w-3 h-3 mr-1" />
                                {event.location}
                              </div>
                            )}
                            {event.value && (
                              <div className="text-xs font-semibold text-green-600 mt-1">
                                ${event.value}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(event.timestamp)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5" />
            <span>Connection lost. Attempting to reconnect...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
