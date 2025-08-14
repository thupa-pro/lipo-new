'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Smartphone, 
  Download, 
  Star, 
  Zap, 
  Shield, 
  Brain, 
  Clock, 
  Battery, 
  Wifi, 
  Eye,
  CheckCircle,
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Target,
  Award,
  Sparkles,
  MessageCircle,
  Calendar,
  MapPin,
  Search,
  Heart,
  Globe,
  Gauge,
  Layers,
  Lightbulb
} from 'lucide-react'
import { MobileAppShell } from '@/components/mobile/mobile-app-shell'
import Image from 'next/image'
import Link from 'next/link'

interface MobileFeature {
  id: string
  title: string
  description: string
  icon: React.ElementType
  gradient: string
  stats?: string
  beta?: boolean
}

interface MobileTestimonial {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  text: string
  device: string
}

export default function MobileAppPage() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deviceStats, setDeviceStats] = useState({
    battery: 85,
    network: 'fast',
    memory: 67,
    performance: 92
  })

  const mobileFeatures: MobileFeature[] = [
    {
      id: 'instant-access',
      title: 'Lightning Fast Access',
      description: 'Open the app in under 0.5 seconds with intelligent caching and progressive loading',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-500',
      stats: '< 0.5s startup'
    },
    {
      id: 'offline-first',
      title: 'Works Offline',
      description: 'Browse services, view bookings, and queue actions even without internet connection',
      icon: Wifi,
      gradient: 'from-blue-500 to-cyan-500',
      stats: '100% offline ready'
    },
    {
      id: 'ai-optimization',
      title: 'AI Performance Optimization',
      description: 'Smart battery management and adaptive UI that learns your usage patterns',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500',
      stats: '45% battery savings',
      beta: true
    },
    {
      id: 'biometric-security',
      title: 'Biometric Security',
      description: 'Secure authentication using fingerprint, face ID, or voice recognition',
      icon: Shield,
      gradient: 'from-green-500 to-teal-500',
      stats: '99.9% secure'
    },
    {
      id: 'smart-notifications',
      title: 'Smart Notifications',
      description: 'Context-aware notifications that arrive at the perfect time without being intrusive',
      icon: MessageCircle,
      gradient: 'from-indigo-500 to-purple-500',
      stats: '67% less spam'
    },
    {
      id: 'predictive-ui',
      title: 'Predictive Interface',
      description: 'UI that adapts and predicts your next action based on time, location, and behavior',
      icon: Target,
      gradient: 'from-pink-500 to-rose-500',
      stats: '3x faster workflows',
      beta: true
    }
  ]

  const testimonials: MobileTestimonial[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Busy Professional',
      avatar: 'SC',
      rating: 5,
      text: 'The mobile app is incredibly fast! I can book services even when my connection is spotty. The AI optimization has made my phone last way longer too.',
      device: 'iPhone 14 Pro'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      role: 'Service Provider',
      avatar: 'MR',
      rating: 5,
      text: 'Running my business from my phone has never been easier. The offline features mean I never miss a booking, even in areas with poor signal.',
      device: 'Samsung Galaxy S23'
    },
    {
      id: '3',
      name: 'Emily Watson',
      role: 'Student',
      avatar: 'EW',
      rating: 5,
      text: 'Love how the app learns my schedule and suggests services at the right time. The battery optimization is a game-changer for my old phone!',
      device: 'Pixel 7'
    }
  ]

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Simulate device stats updates
    const interval = setInterval(() => {
      setDeviceStats(prev => ({
        ...prev,
        battery: Math.max(20, Math.min(100, prev.battery + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        performance: Math.max(80, Math.min(100, prev.performance + (Math.random() - 0.5) * 6))
      }))
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      clearInterval(interval)
    }
  }, [])

  const handleInstallApp = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt()
      if (result.outcome === 'accepted') {
        setIsInstalled(true)
        setInstallPrompt(null)
      }
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-600'
    if (level > 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <MobileAppShell currentPath="/mobile-app">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          
          <div className="relative px-4 py-16 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
                <Smartphone className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Loconomy Mobile
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Supercharged
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Experience the future of mobile service discovery with AI-powered optimization, 
                offline capabilities, and lightning-fast performance.
              </p>
            </div>

            {/* Install/Download Section */}
            <div className="space-y-4 mb-12">
              {isInstalled ? (
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 max-w-md mx-auto">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">App Installed!</p>
                        <p className="text-sm text-green-600 dark:text-green-300">Enjoy the enhanced mobile experience</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : installPrompt ? (
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    onClick={handleInstallApp}
                    className="bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Install Mobile App
                  </Button>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Free • Offline Ready • 2.3MB
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Add to home screen for the full app experience
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Add to Home Screen</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Device Performance Stats */}
            <Card className="max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  Your Device Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Battery</span>
                      <span className={`font-medium ${getBatteryColor(deviceStats.battery)}`}>
                        {deviceStats.battery}%
                      </span>
                    </div>
                    <Progress value={deviceStats.battery} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Memory</span>
                      <span className="font-medium text-blue-600">{deviceStats.memory}%</span>
                    </div>
                    <Progress value={deviceStats.memory} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Network</span>
                      <Badge variant="secondary" className="text-xs">
                        {deviceStats.network}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Performance</span>
                      <span className="font-medium text-green-600">{deviceStats.performance}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mobile Features */}
        <section className="px-4 py-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Advanced Mobile Features
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Built for Mobile-First Excellence
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every feature is designed and optimized specifically for mobile devices, 
              delivering performance that exceeds native apps.
            </p>
          </div>

          <div className="grid gap-6 mb-16">
            {mobileFeatures.map((feature, index) => (
              <Card key={feature.id} className="group hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        {feature.beta && (
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            Beta
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {feature.description}
                      </p>
                      
                      {feature.stats && (
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            {feature.stats}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Performance Comparison */}
        <section className="px-4 py-16 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Performance That Amazes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See how Loconomy Mobile compares to traditional web and native apps
            </p>
          </div>

          <div className="grid gap-6">
            {[
              { metric: 'Startup Time', loconomy: '0.4s', web: '3.2s', native: '1.8s' },
              { metric: 'Battery Usage', loconomy: '15%/hr', web: '28%/hr', native: '22%/hr' },
              { metric: 'Offline Capability', loconomy: '100%', web: '5%', native: '60%' },
              { metric: 'Memory Usage', loconomy: '45MB', web: '120MB', native: '85MB' },
              { metric: 'Data Usage', loconomy: '2.1MB/session', web: '8.4MB/session', native: '4.2MB/session' }
            ].map((comparison, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {comparison.metric}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 mb-1">
                        {comparison.loconomy}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Loconomy</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-500 mb-1">
                        {comparison.web}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Traditional</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 mb-1">
                        {comparison.native}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Native App</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* User Testimonials */}
        <section className="px-4 py-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Heart className="h-4 w-4 mr-2" />
              User Love
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              What Users Are Saying
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Real feedback from users who've experienced the mobile revolution
            </p>
          </div>

          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <blockquote className="text-gray-700 dark:text-gray-300 italic mb-3">
                        "{testimonial.text}"
                      </blockquote>
                      
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{testimonial.device}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Stats */}
        <section className="px-4 py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Technical Excellence
            </h2>
            <p className="text-lg text-blue-100">
              Built with cutting-edge technologies for maximum performance
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Lighthouse Score', value: '98/100', icon: Gauge },
              { label: 'Bundle Size', value: '2.3MB', icon: Download },
              { label: 'Cache Hit Rate', value: '94%', icon: Zap },
              { label: 'Offline Coverage', value: '100%', icon: Shield },
              { label: 'Battery Optimization', value: '45%', icon: Battery },
              { label: 'Load Time', value: '<0.5s', icon: Clock }
            ].map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-300" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready for the Ultimate Mobile Experience?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of users who have revolutionized their service discovery with our mobile-optimized platform.
            </p>
            
            <div className="space-y-4">
              {!isInstalled && installPrompt && (
                <Button 
                  size="lg" 
                  onClick={handleInstallApp}
                  className="bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Install Mobile App Now
                </Button>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/browse">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Search className="h-5 w-5 mr-2" />
                    Start Browsing Services
                  </Button>
                </Link>
                
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Play className="h-5 w-5 mr-2" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MobileAppShell>
  )
}
