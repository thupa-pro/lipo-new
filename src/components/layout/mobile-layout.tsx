'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Menu, Search, Bell, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MobileBottomNav } from '@/components/ui/floating-fab'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
  backUrl?: string
  showSearch?: boolean
  showNotifications?: boolean
  showProfile?: boolean
  currentPath?: string
  headerActions?: ReactNode
  className?: string
  containerClassName?: string
  hideBottomNav?: boolean
}

export function MobileLayout({
  children,
  title,
  showBackButton = false,
  backUrl = '/',
  showSearch = false,
  showNotifications = false,
  showProfile = false,
  currentPath = '/',
  headerActions,
  className,
  containerClassName,
  hideBottomNav = false,
}: MobileLayoutProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative',
        className
      )}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.2),transparent)]" />
      </div>

      {/* Mobile Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 safe-area-padding-top"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleBack}
                  className="text-white p-2 hover:bg-white/20 touch-target hover-touch"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              {title && (
                <h1 className="fluid-text-lg font-bold text-white truncate">
                  {title}
                </h1>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {showSearch && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white p-2 hover:bg-white/20 touch-target hover-touch"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}

              {showNotifications && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white p-2 hover:bg-white/20 relative touch-target hover-touch"
                >
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center p-0">
                    3
                  </Badge>
                </Button>
              )}

              {showProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white p-2 hover:bg-white/20 touch-target hover-touch"
                >
                  <User className="w-5 h-5" />
                </Button>
              )}

              {headerActions}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className={cn('relative z-10 pb-20', containerClassName)}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="min-h-[calc(100vh-140px)]"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      {!hideBottomNav && <MobileBottomNav currentPath={currentPath} />}
    </div>
  )
}

// Quick preset layouts
export function MobilePageLayout({
  children,
  title,
  currentPath,
}: {
  children: ReactNode
  title: string
  currentPath?: string
}) {
  return (
    <MobileLayout
      title={title}
      showBackButton
      showNotifications
      showProfile
      currentPath={currentPath}
    >
      {children}
    </MobileLayout>
  )
}

export function MobileBrowseLayout({
  children,
  currentPath,
}: {
  children: ReactNode
  currentPath?: string
}) {
  return (
    <MobileLayout
      title="Find Services"
      showBackButton
      showSearch
      showNotifications
      currentPath={currentPath}
    >
      {children}
    </MobileLayout>
  )
}

export function MobileProfileLayout({
  children,
  currentPath,
}: {
  children: ReactNode
  currentPath?: string
}) {
  return (
    <MobileLayout
      title="Profile"
      showBackButton
      showNotifications
      currentPath={currentPath}
    >
      {children}
    </MobileLayout>
  )
}
