"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
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

// AI-Native Design System Components
import {
  AICard,
  GlassmorphicContainer,
  FuturisticMetrics,
  NeuralLoading,
  HolographicText
} from "@/components/admin/design-system";

import { RevenueAcceleratorDashboard } from "@/components/admin/revenue-accelerators";
import AIAssistant from "@/components/admin/AIAssistant";
import AIInsightsDashboard from "@/components/admin/AIInsightsDashboard";
import AIMonitoringHub from "@/components/admin/AIMonitoringHub";

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
  Sparkles,
  BarChart3,
  PieChart,
  LineChart,
  MonitorSpeaker,
  Gauge,
  Layers,
  Filter,
  Search,
  Command,
  MoreHorizontal,
  Plus,
  Download,
  RefreshCw,
  Calendar,
  Maximize2,
  MessageCircle,
  Lightbulb,
  RocketIcon as Rocket,
  Fingerprint,
  Layers3,
  Waves,
  Orbit,
  Atom,
  Network,
  GitBranch,
  Workflow,
  Radar,
  Hexagon,
  Triangle,
  Circle,
  Square
} from "lucide-react";

interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  target?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  icon: any;
  variant: 'neural' | 'quantum' | 'holographic' | 'biometric';
  insight?: string;
  confidence?: number;
  status: 'learning' | 'active' | 'optimized' | 'predicting';
}

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  timeframe: string;
  category: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [realTimeData, setRealTimeData] = useState({});
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate AI processing and real-time updates
      setRealTimeData(prev => ({
        ...prev,
        lastUpdate: Date.now(),
        processing: Math.random() > 0.8
      }));
    }, 5000);

    // Initial load simulation
    setTimeout(() => {
      setIsLoading(false);
      initializeData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const initializeData = () => {
    // Initialize metrics with AI-powered insights
    const initialMetrics: DashboardMetric[] = [
      {
        id: 'active-users',
        title: 'Active Users',
        value: 24789,
        previousValue: 23456,
        target: 30000,
        icon: Users,
        variant: 'neural',
        insight: 'User engagement increased by 15% due to new AI matching algorithm',
        confidence: 94,
        status: 'optimized'
      },
      {
        id: 'revenue',
        title: 'Monthly Revenue',
        value: 156780,
        previousValue: 142350,
        target: 180000,
        prefix: '$',
        icon: DollarSign,
        variant: 'quantum',
        insight: 'Revenue trending 8% above forecast driven by premium subscriptions',
        confidence: 88,
        status: 'active'
      },
      {
        id: 'ai-accuracy',
        title: 'AI Match Accuracy',
        value: 97.3,
        previousValue: 95.8,
        target: 98.5,
        suffix: '%',
        icon: Brain,
        variant: 'holographic',
        insight: 'Machine learning model performance improving through continuous learning',
        confidence: 96,
        status: 'learning'
      },
      {
        id: 'system-health',
        title: 'System Performance',
        value: 99.7,
        previousValue: 99.2,
        target: 99.9,
        suffix: '%',
        icon: Cpu,
        variant: 'biometric',
        insight: 'Infrastructure optimization reducing latency by 23ms',
        confidence: 92,
        status: 'optimized'
      }
    ];

    // Initialize AI insights
    const initialInsights: AIInsight[] = [
      {
        id: '1',
        type: 'prediction',
        title: 'User Growth Surge Predicted',
        description: 'AI models predict a 25% increase in new user registrations within the next 7 days based on current engagement patterns.',
        confidence: 89,
        impact: 'high',
        actionable: true,
        timeframe: '7 days',
        category: 'Growth'
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Optimize Peak Hour Capacity',
        description: 'System analysis suggests scaling server capacity during 2-4 PM EST to handle predicted traffic surge.',
        confidence: 94,
        impact: 'medium',
        actionable: true,
        timeframe: '24 hours',
        category: 'Infrastructure'
      },
      {
        id: '3',
        type: 'opportunity',
        title: 'Revenue Optimization Available',
        description: 'AI identified pricing strategy adjustment could increase revenue by 12% without affecting user satisfaction.',
        confidence: 87,
        impact: 'high',
        actionable: true,
        timeframe: '30 days',
        category: 'Revenue'
      }
    ];

    setMetrics(initialMetrics);
    setAIInsights(initialInsights);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <NeuralLoading
          variant="neural"
          size="lg"
          message="Initializing AI Dashboard..."
          showProgress={true}
          progress={85}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      
      {/* Immersive Background Effects */}
      <div className="absolute inset-0">
        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.4) 2px, transparent 0),
                radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.4) 1px, transparent 0),
                radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4) 1.5px, transparent 0)
              `,
              backgroundSize: '100px 100px, 150px 150px, 80px 80px'
            }}
            className="w-full h-full"
          />
        </div>

        {/* Animated gradient spheres */}
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* AI-Enhanced Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <GlassmorphicContainer variant="intense" className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
                
                <div>
                  <HolographicText variant="primary" size="3xl" className="mb-2">
                    Loconomy AI Command Center
                  </HolographicText>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Activity className="w-3 h-3 mr-1" />
                      All Systems Operational
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Bot className="w-3 h-3 mr-1" />
                      AI Processing Active
                    </Badge>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      <Globe className="w-3 h-3 mr-1" />
                      Real-time Sync
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-white/60">Last AI Analysis</p>
                  <p className="text-white/90 font-medium">
                    {currentTime.toLocaleTimeString()}
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20">
                      <Settings className="h-5 w-5 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-black/80 backdrop-blur-xl border-white/20">
                    <DropdownMenuLabel className="text-white">AI Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-white/80 hover:text-white">
                      <Brain className="mr-2 h-4 w-4" />
                      AI Model Configuration
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white/80 hover:text-white">
                      <Gauge className="mr-2 h-4 w-4" />
                      Performance Monitoring
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white/80 hover:text-white">
                      <Shield className="mr-2 h-4 w-4" />
                      Security Protocols
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </GlassmorphicContainer>
        </motion.div>

        {/* Core Metrics Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, staggerChildren: 0.1 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <FuturisticMetrics
                title={metric.title}
                data={{
                  value: metric.value,
                  previousValue: metric.previousValue,
                  target: metric.target,
                  unit: metric.unit,
                  prefix: metric.prefix,
                  suffix: metric.suffix
                }}
                icon={metric.icon}
                variant={metric.variant}
                size="md"
                animated={true}
                showTrend={true}
                showProgress={!!metric.target}
                glowEffect={true}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* AI Insights and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* AI Insights Panel */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AICard
              title="AI Insights & Predictions"
              subtitle="Real-time intelligence powered by machine learning"
              aiInsight="Processing 847 data points across 23 categories"
              confidence={92}
              status="predicting"
              variant="neural"
              interactive={true}
              glowOnHover={true}
              className="h-full"
            >
              <div className="p-6 space-y-4">
                <AnimatePresence>
                  {aiInsights.map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <GlassmorphicContainer variant="subtle" className="p-4 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-xl ${
                            insight.type === 'prediction' ? 'bg-purple-500/20' :
                            insight.type === 'recommendation' ? 'bg-blue-500/20' :
                            insight.type === 'alert' ? 'bg-red-500/20' :
                            'bg-green-500/20'
                          }`}>
                            {insight.type === 'prediction' && <Brain className="w-4 h-4 text-purple-400" />}
                            {insight.type === 'recommendation' && <Lightbulb className="w-4 h-4 text-blue-400" />}
                            {insight.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                            {insight.type === 'opportunity' && <Target className="w-4 h-4 text-green-400" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white/90 group-hover:text-white transition-colors">
                                {insight.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${
                                  insight.impact === 'critical' ? 'bg-red-500/20 text-red-400' :
                                  insight.impact === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                  insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {insight.impact.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-white/50">{insight.confidence}%</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-white/70 mb-3">
                              {insight.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-white/50">
                                <span>{insight.category}</span>
                                <span>•</span>
                                <span>{insight.timeframe}</span>
                              </div>
                              
                              {insight.actionable && (
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white h-7 px-3 text-xs">
                                  Take Action
                                </Button>
                              )}
                            </div>
                            
                            {/* Confidence bar */}
                            <div className="mt-3">
                              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${insight.confidence}%` }}
                                  transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </GlassmorphicContainer>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </AICard>
          </motion.div>

          {/* Real-time System Monitor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <AICard
              title="System Pulse"
              subtitle="Real-time performance monitoring"
              status="active"
              variant="quantum"
              className="h-full"
            >
              <div className="p-6 space-y-6">
                
                {/* CPU Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80">AI Processing</span>
                    <span className="text-sm text-white/60">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>

                {/* Memory */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80">Memory Usage</span>
                    <span className="text-sm text-white/60">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>

                {/* Network */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80">Network I/O</span>
                    <span className="text-sm text-white/60">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>

                {/* API Response */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80">API Response</span>
                    <span className="text-sm text-white/60">89ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">Optimal</span>
                  </div>
                </div>

                {/* Active Connections */}
                <div className="pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">1,247</p>
                      <p className="text-xs text-white/60">Active Sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">98.7%</p>
                      <p className="text-xs text-white/60">Uptime</p>
                    </div>
                  </div>
                </div>
              </div>
            </AICard>
          </motion.div>
        </div>

        {/* Advanced Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <GlassmorphicContainer variant="subtle" className="p-1 mb-6">
              <TabsList className="grid w-full grid-cols-5 bg-transparent h-12">
                {[
                  { value: "overview", label: "Overview", icon: BarChart3 },
                  { value: "revenue", label: "Revenue", icon: DollarSign },
                  { value: "analytics", label: "Analytics", icon: TrendingUp },
                  { value: "users", label: "Users", icon: Users },
                  { value: "system", label: "System", icon: Cpu }
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </GlassmorphicContainer>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AICard title="Revenue Analytics" variant="holographic" className="h-96">
                  <div className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <HolographicText variant="accent" size="2xl" className="mb-4">
                        $2.4M
                      </HolographicText>
                      <p className="text-white/60">Total Revenue This Quarter</p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">+18.2% vs last quarter</span>
                      </div>
                    </div>
                  </div>
                </AICard>

                <AICard title="User Engagement" variant="biometric" className="h-96">
                  <div className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <HolographicText variant="secondary" size="2xl" className="mb-4">
                        94.3%
                      </HolographicText>
                      <p className="text-white/60">Weekly Active Users</p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm">+12.7% growth rate</span>
                      </div>
                    </div>
                  </div>
                </AICard>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <RevenueAcceleratorDashboard />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <GlassmorphicContainer variant="default" className="p-6">
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <HolographicText variant="primary" size="xl" className="mb-2">
                    Advanced Analytics Coming Soon
                  </HolographicText>
                  <p className="text-white/60">
                    AI-powered predictive analytics and machine learning insights are being processed...
                  </p>
                </div>
              </GlassmorphicContainer>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <GlassmorphicContainer variant="default" className="p-6">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <HolographicText variant="primary" size="xl" className="mb-2">
                    User Management Portal
                  </HolographicText>
                  <p className="text-white/60">
                    Advanced user analytics and management tools loading...
                  </p>
                </div>
              </GlassmorphicContainer>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <GlassmorphicContainer variant="default" className="p-6">
                <div className="text-center py-12">
                  <Cpu className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <HolographicText variant="secondary" size="xl" className="mb-2">
                    System Health Monitor
                  </HolographicText>
                  <p className="text-white/60">
                    Real-time system diagnostics and performance optimization tools...
                  </p>
                </div>
              </GlassmorphicContainer>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
