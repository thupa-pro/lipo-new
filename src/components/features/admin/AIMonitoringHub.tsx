'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aiClient } from '@/lib/ai/gemini-client';
import { GlassmorphicContainer } from './design-system/glassmorphic-container';
import { AICard } from './design-system/ai-native-card';
import { HolographicText } from './design-system/holographic-text';
import { NeuralLoading } from './design-system/neural-loading';
import { FuturisticMetrics } from './design-system/futuristic-metrics';
import {
  Monitor,
  Cpu,
  Database,
  Network,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Shield,
  TrendingUp,
  Bell,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Brain,
  Gauge,
  Server,
  Cloud,
  Eye,
  Target,
  HardDrive,
  Wifi,
  Smartphone
} from 'lucide-react';

interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  aiRecommendation?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  aiOptimization?: string;
}

export default function AIMonitoringHub({ platformData }: { platformData: any }) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isGeneratingOptimizations, setIsGeneratingOptimizations] = useState(false);

  useEffect(() => {
    generateInitialData();
    if (isMonitoring) {
      const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const generateInitialData = () => {
    const initialMetrics: PerformanceMetric[] = [
      {
        name: 'CPU Usage',
        value: 67,
        unit: '%',
        status: 'optimal',
        trend: 'stable',
        aiOptimization: 'Current usage is within optimal range. Neural networks suggest load balancing for peak hours.'
      },
      {
        name: 'Memory Usage',
        value: 78,
        unit: '%',
        status: 'warning',
        trend: 'up',
        aiOptimization: 'Memory usage trending upward. AGI recommends implementing quantum caching strategies.'
      },
      {
        name: 'API Response Time',
        value: 145,
        unit: 'ms',
        status: 'optimal',
        trend: 'down',
        aiOptimization: 'Response times improving. Neural optimization strategies are highly effective.'
      },
      {
        name: 'Database Connections',
        value: 234,
        unit: 'active',
        status: 'optimal',
        trend: 'stable',
        aiOptimization: 'Connection pool size is perfectly calibrated for current neural load patterns.'
      },
      {
        name: 'Error Rate',
        value: 0.12,
        unit: '%',
        status: 'optimal',
        trend: 'down',
        aiOptimization: 'Error rates decreasing. Quantum error detection and correction systems online.'
      },
      {
        name: 'Throughput',
        value: 1247,
        unit: 'req/min',
        status: 'optimal',
        trend: 'up',
        aiOptimization: 'Throughput increasing steadily. Neural infrastructure scaling algorithms working optimally.'
      }
    ];

    const initialAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'info',
        title: 'AGI System Optimization Complete',
        description: 'Neural-driven performance optimization has been successfully applied across all systems.',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        resolved: true,
        aiRecommendation: 'Continue monitoring for enhanced performance metrics with quantum insights.'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Memory Usage Trending High',
        description: 'Memory usage has increased by 15% in the last hour. Neural networks detected unusual pattern.',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        resolved: false,
        aiRecommendation: 'Implement quantum memory optimization strategies and consider horizontal scaling with AGI assistance.'
      }
    ];

    setMetrics(initialMetrics);
    setAlerts(initialAlerts);
  };

  const updateMetrics = () => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1), // Small random fluctuation
      trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : metric.trend
    })));
    setLastUpdate(new Date());
  };

  const generateAIOptimizations = async () => {
    setIsGeneratingOptimizations(true);
    try {
      // Generate optimization recommendations from Sophia (Operations AI)
      const optimization = await aiClient.generateInsight(
        'sophia',
        'system_optimization',
        { metrics, alerts, platformData }
      );

      const newAlert: SystemAlert = {
        id: Date.now().toString(),
        type: 'info',
        title: 'AGI Optimization Recommendation',
        description: optimization,
        timestamp: new Date(),
        resolved: false,
        aiRecommendation: 'Review and implement the suggested quantum optimizations for enhanced performance.'
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Error generating AI optimizations:', error);
    } finally {
      setIsGeneratingOptimizations(false);
    }
  };

  const getMetricIcon = (name: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'CPU Usage': <Cpu className="h-5 w-5" />,
      'Memory Usage': <HardDrive className="h-5 w-5" />,
      'API Response Time': <Wifi className="h-5 w-5" />,
      'Database Connections': <Database className="h-5 w-5" />,
      'Error Rate': <AlertTriangle className="h-5 w-5" />,
      'Throughput': <Activity className="h-5 w-5" />
    };
    return icons[name] || <Gauge className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      optimal: 'from-green-500 to-emerald-500',
      warning: 'from-amber-500 to-orange-500',
      critical: 'from-red-500 to-pink-500'
    };
    return colors[status as keyof typeof colors] || colors.optimal;
  };

  const getAlertColor = (type: string) => {
    const colors = {
      critical: 'from-red-500 to-pink-500',
      warning: 'from-amber-500 to-orange-500',
      info: 'from-blue-500 to-cyan-500',
      success: 'from-green-500 to-emerald-500'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getTrendIcon = (trend: string) => {
    const icons = {
      up: <TrendingUp className="h-4 w-4 text-green-600" />,
      down: <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />,
      stable: <Activity className="h-4 w-4 text-gray-600" />
    };
    return icons[trend as keyof typeof icons] || icons.stable;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <GlassmorphicContainer variant="intense" glow animated className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 via-gray-500/10 to-blue-500/10" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <HolographicText className="text-2xl font-bold flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-slate-600 to-blue-600 rounded-xl shadow-lg">
                  <Monitor className="h-8 w-8 text-white" />
                </div>
                AGI System Monitoring Hub
              </HolographicText>
              <p className="text-gray-600/80 mt-2 font-medium">Neural-powered performance monitoring with quantum-enhanced optimization</p>
              <div className="flex items-center gap-2 mt-3">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs font-medium text-gray-600">
                  Last neural scan: {lastUpdate.toLocaleTimeString()} • {isMonitoring ? 'AGI Active' : 'Standby Mode'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={generateAIOptimizations}
                disabled={isGeneratingOptimizations}
                className="bg-gradient-to-r from-slate-600 via-blue-600 to-purple-600 hover:from-slate-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                {isGeneratingOptimizations ? (
                  <>
                    <NeuralLoading size="sm" className="mr-2" />
                    Neural Optimizing...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    AGI Optimize
                  </>
                )}
              </Button>
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "destructive" : "default"}
                className="px-6 py-3 rounded-xl font-bold"
              >
                {isMonitoring ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </GlassmorphicContainer>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <FuturisticMetrics
            key={index}
            title={metric.name}
            data={{
              value: typeof metric.value === 'number' ? metric.value : 0,
              previousValue: typeof metric.value === 'number' ? metric.value * 0.9 : 0,
              unit: metric.unit || '',
              prefix: '',
              suffix: ''
            }}
            icon={getMetricIcon(metric.name)}
            variant="holographic"
            className={`bg-gradient-to-br hover:shadow-2xl transition-all duration-500`}
          />
        ))}
      </div>

      {/* System Alerts */}
      <GlassmorphicContainer variant="neon" glow animated className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5" />
        <CardHeader className="relative">
          <HolographicText className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-orange-600" />
            System Alerts & AGI Recommendations
          </HolographicText>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-orange-600">Neural Alert Processing Active</span>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <HolographicText className="text-lg font-bold text-green-600 mb-2">
                  All Systems Operating Optimally
                </HolographicText>
                <p className="text-gray-600">Neural networks report zero anomalies detected</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <AICard
                  key={alert.id}
                  aiInsight={{
                    title: alert.title,
                    description: alert.description,
                    confidence: alert.type === 'critical' ? 95 : 85,
                    status: alert.type === 'critical' ? 'alert' : 'active'
                  }}
                  className={`${alert.resolved ? 'opacity-60' : ''} transition-all duration-300`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 bg-gradient-to-r ${getAlertColor(alert.type)} rounded-lg shadow-lg`}>
                            {alert.type === 'critical' && <AlertTriangle className="h-5 w-5 text-white" />}
                            {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-white" />}
                            {alert.type === 'info' && <Bell className="h-5 w-5 text-white" />}
                            {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-white" />}
                          </div>
                          <div>
                            <HolographicText className="font-bold text-lg">{alert.title}</HolographicText>
                            {alert.resolved && (
                              <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                                Resolved by AGI
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm mb-4 text-gray-700 leading-relaxed">{alert.description}</p>
                        
                        {alert.aiRecommendation && (
                          <div className="bg-gradient-to-r from-purple-50/80 to-blue-50/80 backdrop-blur-sm p-4 rounded-lg border border-white/40">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-4 w-4 text-purple-600" />
                              <span className="font-bold text-purple-600 text-sm">AGI Recommendation</span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">{alert.aiRecommendation}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-xs text-gray-500 mb-2">
                          {alert.timestamp.toLocaleTimeString()}
                        </div>
                        {!alert.resolved && (
                          <Button size="sm" variant="outline" className="bg-white/50 backdrop-blur-sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </AICard>
              ))
            )}
          </div>
        </CardContent>
      </GlassmorphicContainer>

      {/* Infrastructure Overview */}
      <GlassmorphicContainer variant="subtle" glow animated className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-green-500/5 to-purple-500/5" />
        <CardHeader className="relative">
          <HolographicText className="text-xl font-bold flex items-center gap-2">
            <Cloud className="h-6 w-6 text-blue-600" />
            Neural Infrastructure Overview
          </HolographicText>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-blue-600">Quantum Infrastructure Monitoring</span>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm rounded-xl border border-white/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Server className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-bold text-blue-900">Load Balancers</span>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-1">3/3</div>
              <div className="text-xs text-blue-700 mb-2">All healthy • Neural optimization active</div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-xs text-blue-600">AGI-managed</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl border border-white/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-bold text-green-900">Databases</span>
              </div>
              <div className="text-2xl font-bold text-green-900 mb-1">5/5</div>
              <div className="text-xs text-green-700 mb-2">Optimal performance • Quantum sync</div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-600">Neural-optimized</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50/80 to-violet-50/80 backdrop-blur-sm rounded-xl border border-white/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-900">Security</span>
              </div>
              <div className="text-2xl font-bold text-purple-900 mb-1">100%</div>
              <div className="text-xs text-purple-700 mb-2">All checks passed • Quantum encryption</div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-xs text-purple-600">AGI-protected</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl border border-white/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-bold text-amber-900">Auto-scaling</span>
              </div>
              <div className="text-2xl font-bold text-amber-900 mb-1">Active</div>
              <div className="text-xs text-amber-700 mb-2">2 instances added • Neural prediction</div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-xs text-amber-600">Quantum-enhanced</span>
              </div>
            </div>
          </div>
        </CardContent>
      </GlassmorphicContainer>
    </div>
  );
}
