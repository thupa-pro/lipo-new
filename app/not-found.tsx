"use client"

import Link from "next/link"
import { EnhancedButton, IconButton } from "@/components/ui/enhanced-button"
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card"
import { Home, Search, ArrowLeft, MapPin, HelpCircle, Compass, Zap, Star, Users, TrendingUp } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Enhanced 404 Display */}
        <div className="mb-12">
          <div className="relative inline-block mb-6">
            <div className="text-9xl font-black bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent select-none">
              404
            </div>
            <div className="absolute inset-0 text-9xl font-black text-purple-600/20 animate-pulse -z-10">
              404
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Oops! Lost in Space
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
            Don't worry! Even the best explorers sometimes take a wrong turn. Let's get you back on track.
          </p>

          {/* Fun stats to lighten mood */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2.4M+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">45K+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Providers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.9%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Uptime</div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <MapPin className="w-6 h-6 mr-2 text-blue-600" />
              Let's Get You Back on Track
            </CardTitle>
            <CardDescription>
              Here are some helpful ways to find what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/">
                  <Home className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Go Home</span>
                  <span className="text-sm text-gray-500">Back to the main page</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/browse">
                  <Search className="w-6 h-6 text-green-600" />
                  <span className="font-medium">Browse Services</span>
                  <span className="text-sm text-gray-500">Find what you need</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/help">
                  <HelpCircle className="w-6 h-6 text-purple-600" />
                  <span className="font-medium">Get Help</span>
                  <span className="text-sm text-gray-500">Visit our help center</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/contact">
                  <MapPin className="w-6 h-6 text-orange-600" />
                  <span className="font-medium">Contact Us</span>
                  <span className="text-sm text-gray-500">We're here to help</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-gray-600">
            Looking for something specific? Try using our search or browse our popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/about">About</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/careers">Careers</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/become-provider">Become a Provider</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/safety">Safety</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <Button asChild size="lg" className="shadow-md">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Take Me Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
