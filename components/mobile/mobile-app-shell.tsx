'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  Bell, 
  Settings, 
  User, 
  Search,
  Home,
  Calendar,
  MessageCircle,
  MapPin,
  Star,
  Zap,
  Shield,
  Eye,
  Brain,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Clock,
  TrendingUp
} from 'lucide-react'
import { MobileLayout } from './mobile-layout'
import { AdvancedMobileOptimizer } from './advanced-mobile-optimizer'
import { EnhancedMobileExperience } from './enhanced-mobile-experience'
import { BiometricAuth } from './biometric-auth'
import { NotificationSystem } from './notification-system'

interface MobileAppShellProps {
  children: React.ReactNode
  currentPath?: string
}

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  href: string
  color: string
  badge?: string
}

interface AppFeature {
  id: string
  title: string
  description: string
  icon: React.ElementType
  status: 'active' | 'beta' | 'coming-soon'
  component?: React.ComponentType<any>
}

export function MobileAppShell({ children, currentPath = '/' }: MobileAppShellProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showOptimizer, setShowOptimizer] = useState(false)
  const [showMobileExperience, setShowMobileExperience] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [performanceScore, setPerformanceScore] = useState(87)

  const quickActions: QuickAction[] = [
    {
      id: 'search',
      label: 'Find Services',
      icon: Search,
      href: '/browse',
      color: 'bg-blue-500',
      badge: 'Hot'
    },
    {
      id: 'book',
      label: 'Quick Book',
      icon: Calendar,
      href: '/post-job',
      color: 'bg-green-500'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      href: '/messages',
      color: 'bg-purple-500',
      badge: notifications > 0 ? notifications.toString() : undefined
    },
    {
      id: 'nearby',
      label: 'Nearby',
      icon: MapPin,
      href: '/gig-map',
      color: 'bg-orange-500'
    }
  ]

  const appFeatures: AppFeature[] = [
    {
      id: 'optimizer',
      title: 'Performance Optimizer',
      description: 'AI-powered mobile optimization for faster performance',
      icon: Zap,
      status: 'active',
      component: AdvancedMobileOptimizer
    },
    {
      id: 'smart-experience',
      title: 'Smart Mobile Experience',
      description: 'Predictive caching and intelligent recommendations',
      icon: Brain,
      status: 'active',
      component: EnhancedMobileExperience
    },
    {
      id: 'biometric',
      title: 'Biometric Security',
      description: 'Secure authentication using fingerprint or face ID',
      icon: Shield,
      status: 'beta',
      component: BiometricAuth
    },
    {
      id: 'notifications',
      title: 'Smart Notifications',
      description: 'Context-aware notifications with intelligent timing',
      icon: Bell,
      status: 'active',
      component: NotificationSystem
    }
  ]

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Register mobile service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-mobile.js')
        .then(registration => {
          console.log('Mobile SW registered:', registration)
        })
        .catch(error => {
          console.error('Mobile SW registration failed:', error)
        })
    }

    // Initialize performance monitoring
    initializePerformanceMonitoring()

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const initializePerformanceMonitoring = useCallback(() => {
    if ('performance' in window) {
      // Monitor Core Web Vitals
      import('web-vitals').then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
        onLCP(metric => updatePerformanceScore('lcp', metric.value))
        onINP(metric => updatePerformanceScore('inp', metric.value))
        onCLS(metric => updatePerformanceScore('cls', metric.value))
        onFCP(metric => updatePerformanceScore('fcp', metric.value))
        onTTFB(metric => updatePerformanceScore('ttfb', metric.value))
      }).catch(() => {
        console.log('Web Vitals not available')
      })
    }
  }, [])

  const updatePerformanceScore = useCallback((metric: string, value: number) => {
    // Simplified performance scoring
    let score = performanceScore
    
    switch (metric) {
      case 'lcp':
        score = value < 2500 ? score + 2 : score - 1
        break
      case 'inp':
        score = value < 200 ? score + 2 : score - 1
        break
      case 'cls':
        score = value < 0.1 ? score + 1 : score - 2
        break
      case 'fcp':
        score = value < 1800 ? score + 1 : score - 1
        break
      case 'ttfb':
        score = value < 800 ? score + 1 : score - 1
        break
    }
    
    setPerformanceScore(Math.max(0, Math.min(100, score)))
  }, [performanceScore])

  const handleInstallApp = useCallback(async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt()
      if (result.outcome === 'accepted') {
        setIsInstalled(true)
        setInstallPrompt(null)
      }
    }
  }, [installPrompt])

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <MobileLayout 
      showHeader={true} 
      showBottomNav={true}
      headerTitle="Loconomy"
      className="mobile-app-shell"
    >
      {/* Mobile Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 safe-area-pt">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(true)}
              className="p-1"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Loconomy</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Network Status */}
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
            </div>
            
            {/* Performance Score */}
            <div className={`text-xs font-medium ${getPerformanceColor(performanceScore)}`}>
              {performanceScore}
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-1">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 px-4 py-3 overflow-x-auto scrollbar-hide">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              className={`${action.color} text-white border-none whitespace-nowrap flex items-center space-x-2 hover:scale-105 transition-transform relative`}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-xs">{action.label}</span>
              {action.badge && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {action.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Install Banner */}
      {installPrompt && !isInstalled && (
        <div className="fixed top-32 left-4 right-4 z-40">
          <Card className="bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950 dark:to-sky-950 border-indigo-200 dark:border-indigo-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Install Loconomy App</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Get faster access and offline features
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={handleInstallApp}>
                  Install
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-32 left-4 right-4 z-40">
          <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <WifiOff className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  You're offline. Some features may be limited.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content with Proper Spacing */}
      <div className="pt-32 pb-20">
        {children}
      </div>

      {/* Mobile Menu Sidebar */}
      <Dialog open={showMenu} onOpenChange={setShowMenu}>
        <DialogContent className="p-0 max-w-sm h-full fixed left-0 top-0 translate-x-0 translate-y-0 rounded-none border-r">
          <div className="flex flex-col h-full">
            <DialogHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  Mobile Features
                </DialogTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowMenu(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Performance Overview */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">Performance</h3>
                    <div className={`text-2xl font-bold ${getPerformanceColor(performanceScore)}`}>
                      {performanceScore}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Network Status</span>
                      <Badge variant={isOnline ? 'default' : 'destructive'} className="text-xs">
                        {isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>App Status</span>
                      <Badge variant={isInstalled ? 'default' : 'secondary'} className="text-xs">
                        {isInstalled ? 'Installed' : 'Web App'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Mobile Features</h3>
                {appFeatures.map((feature) => (
                  <Card key={feature.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <feature.icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{feature.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            feature.status === 'active' ? 'default' :
                            feature.status === 'beta' ? 'secondary' : 'outline'
                          } className="text-xs">
                            {feature.status}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Access Buttons */}
              <div className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => {
                    setShowOptimizer(true)
                    setShowMenu(false)
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Performance Optimizer
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => {
                    setShowMobileExperience(true)
                    setShowMenu(false)
                  }}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Smart Experience
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Optimizer Dialog */}
      <Dialog open={showOptimizer} onOpenChange={setShowOptimizer}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Mobile Performance Optimizer
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <AdvancedMobileOptimizer />
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Experience Dialog */}
      <Dialog open={showMobileExperience} onOpenChange={setShowMobileExperience}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Smart Mobile Experience
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <EnhancedMobileExperience userId="demo-user" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Mobile Styles */}
      <style jsx global>{`
        .mobile-app-shell {
          /* Enhanced touch interactions */
          touch-action: manipulation;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        /* Smooth scrolling for mobile */
        .mobile-app-shell * {
          scroll-behavior: smooth;
        }

        /* Enhanced button touch targets */
        .mobile-app-shell button {
          min-height: 44px;
          min-width: 44px;
        }

        /* Optimize for high DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2) {
          .mobile-app-shell {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        /* Hide scrollbars but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Floating animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </MobileLayout>
  )
}
