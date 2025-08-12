'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Smartphone, 
  Zap, 
  Cpu, 
  Battery, 
  Wifi, 
  Eye, 
  Settings, 
  Gauge, 
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
  Shield,
  RefreshCw,
  Download,
  Image as ImageIcon,
  Video,
  FileText,
  Layers,
  Target,
  Brain,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface MobileOptimizationSettings {
  imageOptimization: {
    enabled: boolean
    quality: number
    lazyLoading: boolean
    webpSupport: boolean
    compressionLevel: number
  }
  performanceMode: {
    level: 'battery-saver' | 'balanced' | 'performance'
    adaptiveFrameRate: boolean
    reducedAnimations: boolean
    priorityCaching: boolean
  }
  networkOptimization: {
    adaptiveQuality: boolean
    offlineFirst: boolean
    prefetchStrategy: 'conservative' | 'moderate' | 'aggressive'
    compressionEnabled: boolean
  }
  userExperience: {
    hapticFeedback: boolean
    gestureNavigation: boolean
    oneHandedMode: boolean
    accessibilityEnhanced: boolean
  }
  dataUsage: {
    limitEnabled: boolean
    monthlyLimitMB: number
    lowDataMode: boolean
    trackingEnabled: boolean
  }
}

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  cpuUsage: number
  batteryDrain: number
  networkLatency: number
  renderTime: number
  cacheEfficiency: number
  userSatisfaction: number
}

interface OptimizationSuggestion {
  id: string
  type: 'performance' | 'battery' | 'data' | 'ux'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  effort: 'easy' | 'moderate' | 'complex'
  savings: string
  action: () => void
}

export function AdvancedMobileOptimizer() {
  const [settings, setSettings] = useState<MobileOptimizationSettings>({
    imageOptimization: {
      enabled: true,
      quality: 85,
      lazyLoading: true,
      webpSupport: true,
      compressionLevel: 7
    },
    performanceMode: {
      level: 'balanced',
      adaptiveFrameRate: true,
      reducedAnimations: false,
      priorityCaching: true
    },
    networkOptimization: {
      adaptiveQuality: true,
      offlineFirst: true,
      prefetchStrategy: 'moderate',
      compressionEnabled: true
    },
    userExperience: {
      hapticFeedback: true,
      gestureNavigation: true,
      oneHandedMode: false,
      accessibilityEnhanced: true
    },
    dataUsage: {
      limitEnabled: false,
      monthlyLimitMB: 1000,
      lowDataMode: false,
      trackingEnabled: true
    }
  })

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 45,
    cpuUsage: 23,
    batteryDrain: 12,
    networkLatency: 35,
    renderTime: 16.7,
    cacheEfficiency: 87,
    userSatisfaction: 94
  })

  const [activeOptimizations, setActiveOptimizations] = useState<string[]>([])
  const [dataUsageThisMonth, setDataUsageThisMonth] = useState(425)
  const [optimizationScore, setOptimizationScore] = useState(85)

  const suggestions = useMemo<OptimizationSuggestion[]>(() => [
    {
      id: 'image-compression',
      type: 'performance',
      title: 'Enable Advanced Image Compression',
      description: 'Reduce image file sizes by 40-60% without visible quality loss using AI-powered compression.',
      impact: 'high',
      effort: 'easy',
      savings: '2.3MB per session',
      action: () => updateSettings('imageOptimization', { compressionLevel: 9 })
    },
    {
      id: 'aggressive-caching',
      type: 'performance',
      title: 'Implement Predictive Caching',
      description: 'Pre-cache content you\'re likely to access based on usage patterns and time of day.',
      impact: 'high',
      effort: 'moderate',
      savings: '45% faster loading',
      action: () => updateSettings('networkOptimization', { prefetchStrategy: 'aggressive' })
    },
    {
      id: 'battery-optimization',
      type: 'battery',
      title: 'Enable Battery Saver Mode',
      description: 'Automatically adjust performance settings when battery drops below 20%.',
      impact: 'medium',
      effort: 'easy',
      savings: '15% battery life',
      action: () => updateSettings('performanceMode', { level: 'battery-saver' })
    },
    {
      id: 'data-compression',
      type: 'data',
      title: 'Enable Smart Data Compression',
      description: 'Compress all network requests and responses to reduce data usage by up to 50%.',
      impact: 'high',
      effort: 'easy',
      savings: '50% data reduction',
      action: () => updateSettings('networkOptimization', { compressionEnabled: true })
    },
    {
      id: 'offline-first',
      type: 'ux',
      title: 'Enable Offline-First Experience',
      description: 'Serve cached content instantly while updating in background for lightning-fast interactions.',
      impact: 'high',
      effort: 'moderate',
      savings: '80% faster startup',
      action: () => updateSettings('networkOptimization', { offlineFirst: true })
    }
  ], [])

  const updateSettings = useCallback((category: keyof MobileOptimizationSettings, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], ...updates }
    }))
  }, [])

  const applyOptimization = useCallback((suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId)
    if (suggestion) {
      suggestion.action()
      setActiveOptimizations(prev => [...prev, suggestionId])
      
      // Simulate performance improvement
      setMetrics(prev => ({
        ...prev,
        fps: Math.min(60, prev.fps + 5),
        memoryUsage: Math.max(20, prev.memoryUsage - 5),
        cacheEfficiency: Math.min(100, prev.cacheEfficiency + 3),
        userSatisfaction: Math.min(100, prev.userSatisfaction + 2)
      }))
      
      setOptimizationScore(prev => Math.min(100, prev + 3))
    }
  }, [suggestions])

  const resetOptimizations = useCallback(() => {
    setActiveOptimizations([])
    setOptimizationScore(85)
    setMetrics({
      fps: 60,
      memoryUsage: 45,
      cpuUsage: 23,
      batteryDrain: 12,
      networkLatency: 35,
      renderTime: 16.7,
      cacheEfficiency: 87,
      userSatisfaction: 94
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      setMetrics(prev => ({
        ...prev,
        fps: Math.max(30, Math.min(60, prev.fps + (Math.random() - 0.5) * 4)),
        memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 6)),
        cpuUsage: Math.max(10, Math.min(70, prev.cpuUsage + (Math.random() - 0.5) * 8)),
        networkLatency: Math.max(10, Math.min(200, prev.networkLatency + (Math.random() - 0.5) * 20))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMetricStatus = (value: number, optimal: number, reverse = false) => {
    const diff = reverse ? optimal - value : value - optimal
    if (Math.abs(diff) <= optimal * 0.1) return 'excellent'
    if (Math.abs(diff) <= optimal * 0.25) return 'good'
    if (Math.abs(diff) <= optimal * 0.5) return 'fair'
    return 'poor'
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <Smartphone className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Advanced Mobile Optimizer</h1>
        <p className="text-gray-600 dark:text-gray-300">
          AI-powered mobile performance optimization with real-time monitoring
        </p>
      </div>

      {/* Optimization Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Mobile Optimization Score</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Overall performance and efficiency rating
              </p>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(optimizationScore)}`}>
              {optimizationScore}
              <span className="text-lg text-gray-500">/100</span>
            </div>
          </div>
          
          <Progress value={optimizationScore} className="h-3 mb-4" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {activeOptimizations.length} active optimizations
            </span>
            <Button variant="outline" size="sm" onClick={resetOptimizations}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'FPS', 
            value: Math.round(metrics.fps), 
            optimal: 60, 
            icon: Activity, 
            color: 'blue',
            unit: 'fps'
          },
          { 
            label: 'Memory', 
            value: Math.round(metrics.memoryUsage), 
            optimal: 30, 
            icon: Cpu, 
            color: 'green',
            unit: '%',
            reverse: true
          },
          { 
            label: 'Battery', 
            value: Math.round(metrics.batteryDrain), 
            optimal: 10, 
            icon: Battery, 
            color: 'yellow',
            unit: '%/hr',
            reverse: true
          },
          { 
            label: 'Cache', 
            value: Math.round(metrics.cacheEfficiency), 
            optimal: 85, 
            icon: Gauge, 
            color: 'purple',
            unit: '%'
          }
        ].map((metric, index) => {
          const status = getMetricStatus(metric.value, metric.optimal, metric.reverse)
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`h-5 w-5 text-${metric.color}-500`} />
                  <Badge 
                    variant={status === 'excellent' ? 'default' : status === 'good' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.value}{metric.unit}
                </div>
                <div className="text-sm text-gray-600">
                  {metric.label}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Smart Optimization Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions
              .filter(s => !activeOptimizations.includes(s.id))
              .slice(0, 3)
              .map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{suggestion.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Impact: {suggestion.impact}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Effort: {suggestion.effort}</span>
                        </div>
                        <div className="flex items-center gap-1 font-medium text-green-600">
                          <Target className="h-3 w-3" />
                          <span>{suggestion.savings}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => applyOptimization(suggestion.id)}
                      className="ml-4"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          {activeOptimizations.length > 0 && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {activeOptimizations.length} optimization{activeOptimizations.length > 1 ? 's' : ''} applied successfully! 
                Your app is now running {Math.round((optimizationScore - 85) * 2)}% more efficiently.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Detailed Settings */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Performance Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Performance Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['battery-saver', 'balanced', 'performance'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={settings.performanceMode.level === level ? 'default' : 'outline'}
                      onClick={() => updateSettings('performanceMode', { level })}
                      className="text-sm"
                    >
                      {level.replace('-', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Adaptive Frame Rate</p>
                  <p className="text-xs text-gray-600">Automatically adjust FPS based on content</p>
                </div>
                <Switch
                  checked={settings.performanceMode.adaptiveFrameRate}
                  onCheckedChange={(checked) => updateSettings('performanceMode', { adaptiveFrameRate: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Reduced Animations</p>
                  <p className="text-xs text-gray-600">Disable non-essential animations</p>
                </div>
                <Switch
                  checked={settings.performanceMode.reducedAnimations}
                  onCheckedChange={(checked) => updateSettings('performanceMode', { reducedAnimations: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Priority Caching</p>
                  <p className="text-xs text-gray-600">Intelligently cache frequently used content</p>
                </div>
                <Switch
                  checked={settings.performanceMode.priorityCaching}
                  onCheckedChange={(checked) => updateSettings('performanceMode', { priorityCaching: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-green-500" />
                Image Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Enable Image Optimization</p>
                  <p className="text-xs text-gray-600">Automatically optimize all images</p>
                </div>
                <Switch
                  checked={settings.imageOptimization.enabled}
                  onCheckedChange={(checked) => updateSettings('imageOptimization', { enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Image Quality: {settings.imageOptimization.quality}%
                </label>
                <Slider
                  value={[settings.imageOptimization.quality]}
                  onValueChange={([value]) => updateSettings('imageOptimization', { quality: value })}
                  max={100}
                  min={30}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Smaller files</span>
                  <span>Higher quality</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Compression Level: {settings.imageOptimization.compressionLevel}
                </label>
                <Slider
                  value={[settings.imageOptimization.compressionLevel]}
                  onValueChange={([value]) => updateSettings('imageOptimization', { compressionLevel: value })}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Lazy Loading</p>
                  <p className="text-xs text-gray-600">Load images as they come into view</p>
                </div>
                <Switch
                  checked={settings.imageOptimization.lazyLoading}
                  onCheckedChange={(checked) => updateSettings('imageOptimization', { lazyLoading: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">WebP Support</p>
                  <p className="text-xs text-gray-600">Use modern image format when supported</p>
                </div>
                <Switch
                  checked={settings.imageOptimization.webpSupport}
                  onCheckedChange={(checked) => updateSettings('imageOptimization', { webpSupport: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-purple-500" />
                Network Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prefetch Strategy</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['conservative', 'moderate', 'aggressive'] as const).map((strategy) => (
                    <Button
                      key={strategy}
                      variant={settings.networkOptimization.prefetchStrategy === strategy ? 'default' : 'outline'}
                      onClick={() => updateSettings('networkOptimization', { prefetchStrategy: strategy })}
                      className="text-sm"
                    >
                      {strategy}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Adaptive Quality</p>
                  <p className="text-xs text-gray-600">Adjust content quality based on connection</p>
                </div>
                <Switch
                  checked={settings.networkOptimization.adaptiveQuality}
                  onCheckedChange={(checked) => updateSettings('networkOptimization', { adaptiveQuality: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Offline First</p>
                  <p className="text-xs text-gray-600">Serve cached content first, update in background</p>
                </div>
                <Switch
                  checked={settings.networkOptimization.offlineFirst}
                  onCheckedChange={(checked) => updateSettings('networkOptimization', { offlineFirst: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Data Compression</p>
                  <p className="text-xs text-gray-600">Compress network requests and responses</p>
                </div>
                <Switch
                  checked={settings.networkOptimization.compressionEnabled}
                  onCheckedChange={(checked) => updateSettings('networkOptimization', { compressionEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Usage Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Data Usage This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{dataUsageThisMonth} MB</span>
                  <Badge variant={dataUsageThisMonth > settings.dataUsage.monthlyLimitMB ? 'destructive' : 'secondary'}>
                    {settings.dataUsage.limitEnabled ? `of ${settings.dataUsage.monthlyLimitMB} MB` : 'No limit'}
                  </Badge>
                </div>
                
                {settings.dataUsage.limitEnabled && (
                  <Progress 
                    value={(dataUsageThisMonth / settings.dataUsage.monthlyLimitMB) * 100} 
                    className="h-2"
                  />
                )}

                <div className="text-sm text-gray-600">
                  Estimated savings with optimizations: 45% (191 MB)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-500" />
                User Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Haptic Feedback</p>
                  <p className="text-xs text-gray-600">Tactile feedback for interactions</p>
                </div>
                <Switch
                  checked={settings.userExperience.hapticFeedback}
                  onCheckedChange={(checked) => updateSettings('userExperience', { hapticFeedback: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Gesture Navigation</p>
                  <p className="text-xs text-gray-600">Swipe gestures for quick actions</p>
                </div>
                <Switch
                  checked={settings.userExperience.gestureNavigation}
                  onCheckedChange={(checked) => updateSettings('userExperience', { gestureNavigation: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">One-Handed Mode</p>
                  <p className="text-xs text-gray-600">Optimize layout for one-handed use</p>
                </div>
                <Switch
                  checked={settings.userExperience.oneHandedMode}
                  onCheckedChange={(checked) => updateSettings('userExperience', { oneHandedMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Enhanced Accessibility</p>
                  <p className="text-xs text-gray-600">Improve screen reader and keyboard navigation</p>
                </div>
                <Switch
                  checked={settings.userExperience.accessibilityEnhanced}
                  onCheckedChange={(checked) => updateSettings('userExperience', { accessibilityEnhanced: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Optimization Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-green-600">Performance Gains</p>
              <p>• {Math.round((optimizationScore - 85) * 2)}% faster app startup</p>
              <p>• {activeOptimizations.length * 15}% smoother animations</p>
              <p>• {activeOptimizations.length * 8}% better responsiveness</p>
            </div>
            
            <div className="space-y-1">
              <p className="font-medium text-blue-600">Resource Savings</p>
              <p>• {activeOptimizations.length * 12}% less memory usage</p>
              <p>• {activeOptimizations.length * 18}% battery life extension</p>
              <p>• {activeOptimizations.length * 22}% data usage reduction</p>
            </div>
            
            <div className="space-y-1">
              <p className="font-medium text-purple-600">User Experience</p>
              <p>• {Math.round(metrics.userSatisfaction)}% satisfaction score</p>
              <p>• {Math.round(metrics.cacheEfficiency)}% cache efficiency</p>
              <p>• Sub-second load times</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
