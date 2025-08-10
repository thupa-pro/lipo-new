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

        {/* Enhanced Navigation Card */}
        <EnhancedCard variant="glass" className="mb-12 shadow-2xl">
          <EnhancedCardHeader>
            <EnhancedCardTitle className="flex items-center justify-center text-2xl">
              <Compass className="w-7 h-7 mr-3 text-purple-600 dark:text-purple-400" />
              Let's Get You Back on Track
            </EnhancedCardTitle>
            <EnhancedCardDescription className="text-lg">
              Here are some helpful ways to find what you're looking for
            </EnhancedCardDescription>
          </EnhancedCardHeader>

          <EnhancedCardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  href: "/",
                  icon: Home,
                  title: "Go Home",
                  description: "Back to the main page",
                  color: "text-blue-600 dark:text-blue-400",
                  bgColor: "bg-blue-50 dark:bg-blue-900/20"
                },
                {
                  href: "/browse",
                  icon: Search,
                  title: "Browse Services",
                  description: "Find what you need",
                  color: "text-green-600 dark:text-green-400",
                  bgColor: "bg-green-50 dark:bg-green-900/20"
                },
                {
                  href: "/help",
                  icon: HelpCircle,
                  title: "Get Help",
                  description: "Visit our help center",
                  color: "text-purple-600 dark:text-purple-400",
                  bgColor: "bg-purple-50 dark:bg-purple-900/20"
                },
                {
                  href: "/contact",
                  icon: MapPin,
                  title: "Contact Us",
                  description: "We're here to help",
                  color: "text-orange-600 dark:text-orange-400",
                  bgColor: "bg-orange-50 dark:bg-orange-900/20"
                }
              ].map((item, index) => (
                <Link href={item.href} key={index}>
                  <EnhancedCard
                    variant="interactive"
                    className="h-full p-6 group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    hover={true}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-4 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </EnhancedCard>
                </Link>
              ))}
            </div>
          </EnhancedCardContent>
        </EnhancedCard>

        {/* Popular Destinations */}
        <div className="space-y-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Popular Destinations
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "About", "Pricing", "Careers", "Become a Provider", "Safety", "Help", "AI Demo", "Features"
            ].map((page, index) => (
              <Link href={`/${page.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                >
                  {page}
                </EnhancedButton>
              </Link>
            ))}
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="space-y-4">
          <Link href="/">
            <EnhancedButton
              variant="premium"
              size="lg"
              className="shadow-2xl"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
            >
              Take Me Home
            </EnhancedButton>
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Still can't find what you're looking for?
            <Link href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline ml-1">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
