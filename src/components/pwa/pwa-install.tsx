'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Download,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Bell,
  RefreshCw,
  RefreshCw as Sync,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Shield,
  Star
} from 'lucide-react'

interface PWACapabilities {
  installable: boolean
  standalone: boolean
  fullscreen: boolean
  notifications: boolean
  backgroundSync: boolean
  fileHandling: boolean
  sharing: boolean
  offline: boolean
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstall() {
  const [mounted, setMounted] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    installable: false,
    standalone: false,
    fullscreen: false,
    notifications: false,
    backgroundSync: false,
    fileHandling: false,
    sharing: false,
    offline: false
  })
  const [installProgress, setInstallProgress] = useState(0)
  const [showInstallCard, setShowInstallCard] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    checkPWACapabilities()
    setupEventListeners()
    checkInstallationStatus()
  }, [mounted])

  const checkPWACapabilities = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return

    const caps: PWACapabilities = {
      installable: 'serviceWorker' in navigator,
      standalone: window.matchMedia('(display-mode: standalone)').matches,
      fullscreen: 'requestFullscreen' in document.documentElement,
      notifications: 'Notification' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      fileHandling: 'launchQueue' in window,
      sharing: 'share' in navigator,
      offline: 'serviceWorker' in navigator
    }
    
    setCapabilities(caps)
    setIsInstalled(caps.standalone)
    
    // Show install card if app is installable but not installed
    if (caps.installable && !caps.standalone) {
      setTimeout(() => setShowInstallCard(true), 3000) // Show after 3 seconds
    }
  }

  const setupEventListeners = () => {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setInstallPrompt(e as InstallPromptEvent)
      setShowInstallCard(true)
    })

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowInstallCard(false)
      setInstallPrompt(null)
    })

    // Listen for online/offline
    window.addEventListener('online', () => setIsOnline(true))
    window.addEventListener('offline', () => setIsOnline(false))

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'NETWORK_STATUS') {
          setIsOnline(event.data.isOnline)
        }
      })
    }
  }

  const checkInstallationStatus = () => {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (navigator as any).standalone ||
                         document.referrer.includes('android-app://')
    
    setIsInstalled(isStandalone)
  }

  const handleInstall = async () => {
    if (!installPrompt) return

    setInstallProgress(10)
    
    try {
      // Show install prompt
      await installPrompt.prompt()
      setInstallProgress(50)
      
      // Wait for user choice
      const { outcome } = await installPrompt.userChoice
      setInstallProgress(80)
      
      if (outcome === 'accepted') {
        setInstallProgress(100)
        setTimeout(() => {
          setIsInstalled(true)
          setShowInstallCard(false)
          setInstallPrompt(null)
          setInstallProgress(0)
        }, 1000)
      } else {
        setInstallProgress(0)
        setShowInstallCard(false)
      }
    } catch (error) {
      console.error('Install failed:', error)
      setInstallProgress(0)
    }
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return

    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setCapabilities(prev => ({ ...prev, notifications: true }))
        
        // Show welcome notification
        new Notification('Welcome to Loconomy!', {
          body: 'You\'ll now receive notifications about bookings and messages.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        })
      }
    } catch (error) {
      console.error('Notification permission failed:', error)
    }
  }

  const shareApp = async () => {
    if (!navigator.share) return

    try {
      await navigator.share({
        title: 'Loconomy - AI-Powered Local Services',
        text: 'Find trusted local service providers with AI-powered matching!',
        url: window.location.origin
      })
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  const getCapabilityScore = () => {
    const enabledCount = Object.values(capabilities).filter(Boolean).length
    return Math.round((enabledCount / Object.keys(capabilities).length) * 100)
  }

  if (isInstalled) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            App Installed Successfully!
          </CardTitle>
          <CardDescription>
            You're using the full PWA experience with offline capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">PWA Features Active</span>
            <Badge variant="default" className="bg-green-600">
              {getCapabilityScore()}% Complete
            </Badge>
          </div>
          <Progress value={getCapabilityScore()} className="h-2" />
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              {isOnline ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
              <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
            </div>
            <div className="flex items-center gap-2">
              {capabilities.notifications ? <Bell className="w-4 h-4 text-green-600" /> : <Bell className="w-4 h-4 text-gray-400" />}
              <span>Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              {capabilities.backgroundSync ? <Sync className="w-4 h-4 text-green-600" /> : <Sync className="w-4 h-4 text-gray-400" />}
              <span>Background Sync</span>
            </div>
            <div className="flex items-center gap-2">
              {capabilities.sharing ? <Star className="w-4 h-4 text-green-600" /> : <Star className="w-4 h-4 text-gray-400" />}
              <span>Native Sharing</span>
            </div>
          </div>

          {!capabilities.notifications && (
            <Button 
              onClick={requestNotificationPermission}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Bell className="w-4 h-4 mr-2" />
              Enable Notifications
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!showInstallCard) return null

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-sky-50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-700">
          <Download className="w-5 h-5" />
          Install Loconomy App
        </CardTitle>
        <CardDescription>
          Get the full app experience with offline access, push notifications, and more!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {installProgress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Installing...</span>
              <span>{installProgress}%</span>
            </div>
            <Progress value={installProgress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">✨ Premium Features</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-indigo-600" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Push notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Faster loading</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Enhanced security</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">📱 Works Like Native</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-600" />
                <span>Desktop shortcut</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span>Mobile home screen</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Background sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-600" />
                <span>Native app feel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleInstall}
            disabled={!installPrompt || installProgress > 0}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600"
          >
            <Download className="w-4 h-4 mr-2" />
            {installProgress > 0 ? 'Installing...' : 'Install App'}
          </Button>
          
          {capabilities.sharing && (
            <Button 
              onClick={shareApp}
              variant="outline"
              size="icon"
            >
              <Star className="w-4 h-4" />
            </Button>
          )}
          
          <Button 
            onClick={() => setShowInstallCard(false)}
            variant="ghost"
            size="icon"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          PWA Compatibility Score: <strong>{getCapabilityScore()}%</strong>
        </div>
      </CardContent>
    </Card>
  )
}

// PWA Status Hook for other components
export function usePWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    installable: false,
    standalone: false,
    fullscreen: false,
    notifications: false,
    backgroundSync: false,
    fileHandling: false,
    sharing: false,
    offline: false
  })

  useEffect(() => {
    const checkStatus = () => {
      const caps: PWACapabilities = {
        installable: 'serviceWorker' in navigator,
        standalone: window.matchMedia('(display-mode: standalone)').matches,
        fullscreen: 'requestFullscreen' in document.documentElement,
        notifications: 'Notification' in window && Notification.permission === 'granted',
        backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        fileHandling: 'launchQueue' in window,
        sharing: 'share' in navigator,
        offline: 'serviceWorker' in navigator
      }
      
      setCapabilities(caps)
      setIsInstalled(caps.standalone)
      setIsOnline(navigator.onLine)
    }

    checkStatus()

    window.addEventListener('online', () => setIsOnline(true))
    window.addEventListener('offline', () => setIsOnline(false))

    return () => {
      window.removeEventListener('online', () => setIsOnline(true))
      window.removeEventListener('offline', () => setIsOnline(false))
    }
  }, [])

  return { isInstalled, isOnline, capabilities }
}
