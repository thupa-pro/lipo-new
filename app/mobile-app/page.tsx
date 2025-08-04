"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Star,
  Shield,
  Smartphone,
  Zap,
  Users,
  TrendingUp,
  Bell,
  MapPin,
  CreditCard,
  MessageCircle,
  Clock,
  Award,
  QrCode,
  ArrowRight,
  Check,
} from "lucide-react";

export default function MobileAppPage() {
  const [showQR, setShowQR] = useState(false);

  const features = [
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book services in seconds with our streamlined mobile interface",
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated on booking status, messages, and opportunities",
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "GPS-powered service matching and navigation",
    },
    {
      icon: MessageCircle,
      title: "In-app Chat",
      description: "Secure messaging with your service providers",
    },
    {
      icon: CreditCard,
      title: "Mobile Payments",
      description: "Quick and secure payments with digital wallet integration",
    },
    {
      icon: Clock,
      title: "Scheduling Tools",
      description: "Smart calendar integration and availability management",
    },
  ];

  const stats = [
    { label: "Downloads", value: "500K+", icon: Download },
    { label: "Rating", value: "4.9★", icon: Star },
    { label: "Active Users", value: "250K+", icon: Users },
    { label: "Uptime", value: "99.9%", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] transition-all duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center py-20">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-[var(--purple-glow)] dark:to-[var(--cyan-glow)] text-white">
              <Smartphone className="w-4 h-4 mr-2" />
              Now Available
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="gradient-text">Take Loconomy</span>
              <br />
              <span className="text-gray-900 dark:text-white">Anywhere</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-[var(--mid-gray)] mb-12 max-w-3xl mx-auto">
              Experience the power of AI-driven local services in your pocket. 
              Book, manage, and grow your business on the go.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-[var(--purple-glow)] dark:to-[var(--cyan-glow)] text-white px-8 py-6 text-lg font-bold rounded-2xl btn-glow hover:scale-105 transition-all duration-300"
              >
                <Download className="w-5 h-5 mr-3" />
                Download for iOS
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-6 text-lg font-bold rounded-2xl btn-glow hover:scale-105 transition-all duration-300"
              >
                <Download className="w-5 h-5 mr-3" />
                Download for Android
              </Button>
            </div>

            {/* QR Code Option */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowQR(!showQR)}
                className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-white/20"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR Code
              </Button>
              
              {showQR && (
                <div className="mt-6 inline-block p-6 bg-white dark:bg-white/10 rounded-3xl shadow-lg">
                  <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Scan with your camera to download
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-[var(--purple-glow)] dark:to-[var(--cyan-glow)] flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Mobile-First Features</span>
              </h2>
              <p className="text-xl text-gray-700 dark:text-[var(--mid-gray)] max-w-3xl mx-auto">
                Designed for the modern mobile lifestyle with cutting-edge features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="card-premium border-gray-200 dark:border-white/10 hover:scale-105 transition-all duration-300"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-[var(--purple-glow)] dark:to-[var(--cyan-glow)] flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-[var(--mid-gray)]">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  <span className="gradient-text">Why Choose Our</span>
                  <br />
                  <span className="text-gray-900 dark:text-white">Mobile App?</span>
                </h2>
                
                <div className="space-y-6">
                  {[
                    "Offline mode for uninterrupted service",
                    "Biometric authentication for security",
                    "Smart notifications with AI insights",
                    "Integrated payment processing",
                    "Real-time GPS tracking",
                    "24/7 customer support chat"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      <span className="text-lg text-gray-700 dark:text-gray-300">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="w-80 h-96 bg-gradient-to-b from-gray-900 to-gray-700 rounded-[3rem] mx-auto p-2 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-[2.5rem] flex items-center justify-center">
                    <div className="text-center p-8">
                      <Smartphone className="w-20 h-20 text-purple-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Loconomy Mobile
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your gateway to local services
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 dark:from-[var(--purple-glow)] dark:via-[var(--magenta-glow)] dark:to-[var(--cyan-glow)] rounded-3xl blur-2xl opacity-10 dark:opacity-20" />
              <div className="relative card-premium rounded-3xl p-12 border border-gray-200 dark:border-white/10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="gradient-text">Ready to Get Started?</span>
                </h2>
                <p className="text-xl text-gray-700 dark:text-[var(--mid-gray)] mb-12 max-w-2xl mx-auto">
                  Join millions of users who trust Loconomy for their local service needs.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 dark:from-[var(--purple-glow)] dark:via-[var(--magenta-glow)] dark:to-[var(--cyan-glow)] text-white rounded-2xl px-12 py-6 font-bold text-lg shadow-2xl hover:shadow-purple-500/50 dark:hover:shadow-[var(--purple-glow)]/50 transition-all duration-500 btn-glow hover:scale-105"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    Download Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="rounded-2xl px-12 py-6 font-bold text-lg border-2 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/40 transition-all duration-500 hover:scale-105"
                  >
                    <Link href="/browse">
                      <ArrowRight className="w-5 h-5 mr-3" />
                      Browse Web Version
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
