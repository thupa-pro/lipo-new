'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  Smartphone, 
  Clock, 
  MessageCircle,
  Calendar,
  Star,
  Download
} from 'lucide-react'

interface OfflineData {
  cachedPages: string[]
  queuedActions: number
  lastSync: Date | null
  cacheSize: string
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const [offlineData, setOfflineData] = useState<OfflineData>({
    cachedPages: [],
    queuedActions: 0,
    lastSync: null,
    cacheSize: '0 MB'
  })
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    checkNetworkStatus()
    loadOfflineData()
    setupEventListeners()
  }, [])

  const checkNetworkStatus = () => {
    setIsOnline(navigator.onLine)
  }

  const setupEventListeners = () => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }

  const handleOnline = () => {
    setIsOnline(true)
    triggerSync()
  }

  const handleOffline = () => {
    setIsOnline(false)
  }

  const loadOfflineData = async () => {
    try {
      // Get cached pages
      const cachedPages = [
        'Home',
        'Browse Services',
        'My Dashboard',
        'Messages',
        'Profile Settings'
      ]

      // Get cache size
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const messageChannel = new MessageChannel()
        
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'CACHE_STATUS') {
            const sizeInMB = (event.data.size / (1024 * 1024)).toFixed(2)
            setOfflineData(prev => ({
              ...prev,
              cacheSize: `${sizeInMB} MB`
            }))
          }
        }

        navigator.serviceWorker.controller.postMessage(
          { type: 'GET_CACHE_STATUS' },
          [messageChannel.port2]
        )
      }

      setOfflineData(prev => ({
        ...prev,
        cachedPages,
        queuedActions: Math.floor(Math.random() * 5), // Simulated
        lastSync: new Date(Date.now() - Math.random() * 3600000) // Random time in last hour
      }))
    } catch (error) {
      console.error('Failed to load offline data:', error)
    }
  }

  const triggerSync = async () => {
    if (!isOnline) return

    setSyncing(true)
    
    try {
      // Trigger background sync
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_DATA',
          tag: 'background-sync-all'
        })
      }

      // Simulate sync delay
      setTimeout(() => {
        setSyncing(false)
        setOfflineData(prev => ({
          ...prev,
          queuedActions: 0,
          lastSync: new Date()
        }))
      }, 2000)
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncing(false)
    }
  }

  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="relative inline-block">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isOnline 
                ? 'bg-green-100 border-4 border-green-200' 
                : 'bg-orange-100 border-4 border-orange-200'
            } transition-all duration-500`}>
              {isOnline ? (
                <Wifi className="w-10 h-10 text-green-600" />
              ) : (
                <WifiOff className="w-10 h-10 text-orange-600" />
              )}
            </div>
            <Badge 
              className={`absolute -top-2 -right-2 ${
                isOnline ? 'bg-green-600' : 'bg-orange-600'
              }`}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800">
            {isOnline ? '🌐 Back Online!' : '📴 You\'re Offline'}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isOnline 
              ? 'Great! Your connection has been restored. All your queued actions will sync automatically.'
              : 'Don\'t worry! You can still access cached content and your actions will sync when you\'re back online.'
            }
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                Cached Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {offlineData.cachedPages.length}
              </div>
              <p className="text-sm text-gray-600">Pages available offline</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Queued Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {offlineData.queuedActions}
              </div>
              <p className="text-sm text-gray-600">Waiting to sync</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sync className="w-4 h-4 text-green-600" />
                Cache Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {offlineData.cacheSize}
              </div>
              <p className="text-sm text-gray-600">Stored locally</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-orange-600" />
                Last Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-orange-600">
                {offlineData.lastSync ? offlineData.lastSync.toLocaleTimeString() : 'Never'}
              </div>
              <p className="text-sm text-gray-600">Data updated</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Available Offline Content
            </CardTitle>
            <CardDescription>
              These pages and features are cached and available even without internet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {offlineData.cachedPages.map((page, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">{page}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Cached and ready</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offline Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              What You Can Do Offline
            </CardTitle>
            <CardDescription>
              Loconomy works seamlessly even without an internet connection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">✅ Available Now</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Browse Cached Services</p>
                      <p className="text-sm text-gray-600">View previously loaded providers and services</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">View Your Bookings</p>
                      <p className="text-sm text-gray-600">Check your scheduled appointments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Read Messages</p>
                      <p className="text-sm text-gray-600">View cached conversations</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">⏳ Will Sync Later</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Send Messages</p>
                      <p className="text-sm text-gray-600">Messages will be delivered when online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Book Services</p>
                      <p className="text-sm text-gray-600">Bookings will be processed when connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Leave Reviews</p>
                      <p className="text-sm text-gray-600">Reviews will be submitted automatically</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={refreshPage}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          {isOnline && (
            <Button 
              onClick={triggerSync}
              disabled={syncing}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {syncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Sync className="w-4 h-4" />
                  Sync Now
                </>
              )}
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>
            Loconomy PWA • Offline-First Design • 
            <span className="font-medium text-blue-600"> Always Available</span>
          </p>
        </div>
      </div>
    </div>
  )
}
