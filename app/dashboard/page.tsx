"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { EnhancedButton, IconButton } from "@/components/ui/enhanced-button";
import { DashboardSkeleton, SkeletonLoader } from "@/components/ui/skeleton-loader";
import { Badge } from "@/components/ui/badge";
import { ModernNavigation } from "@/components/modern-navigation";
import { ModernFooter } from "@/components/modern-footer";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Star,
  MessageCircle,
  Settings,
  Bell,
  BookOpen,
  Zap,
  Shield,
  Award,
  Eye,
  ChevronRight,
  Activity,
  Target,
  BarChart3
} from "lucide-react";

function DashboardContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const displayName = userProfile?.display_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const userRole = userProfile?.role || 'customer';

  const stats = [
    {
      title: "Total Earnings",
      value: "$2,847",
      change: "+12.5%",
      icon: DollarSign,
      color: "neural"
    },
    {
      title: "Active Bookings",
      value: "8",
      change: "+3",
      icon: Calendar,
      color: "quantum"
    },
    {
      title: "Customer Rating",
      value: "4.9",
      change: "+0.2",
      icon: Star,
      color: "trust"
    },
    {
      title: "Response Rate",
      value: "98%",
      change: "+5%",
      icon: Activity,
      color: "plasma"
    }
  ];

  const recentBookings = [
    {
      id: 1,
      client: "Sarah Chen",
      service: "House Cleaning",
      date: "Today, 2:00 PM",
      status: "confirmed",
      price: "$120"
    },
    {
      id: 2,
      client: "Mike Johnson",
      service: "Plumbing Repair",
      date: "Tomorrow, 10:00 AM",
      status: "pending",
      price: "$85"
    },
    {
      id: 3,
      client: "Emma Rodriguez",
      service: "Personal Training",
      date: "Dec 15, 6:00 PM",
      status: "completed",
      price: "$75"
    }
  ];

  const messages = [
    {
      id: 1,
      from: "Sarah Chen",
      message: "Hi! Can we reschedule today's appointment?",
      time: "5 min ago",
      unread: true
    },
    {
      id: 2,
      from: "Mike Johnson",
      message: "Thank you for the excellent service!",
      time: "2 hours ago",
      unread: false
    },
    {
      id: 3,
      from: "Emma Rodriguez",
      message: "Looking forward to our session tomorrow.",
      time: "1 day ago",
      unread: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgb(79 70 229) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, rgb(14 165 233) 1px, transparent 0)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <ModernNavigation currentPath="/dashboard" user={user} />

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`mb-12 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gradient-neural mb-2">
                  Welcome back, {displayName}!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Here's your {userRole === 'provider' ? 'service provider' : 'customer'} dashboard overview
                </p>
                <p className="text-sm text-muted-foreground/70">
                  {userEmail} • {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="glass">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button className="bg-gradient-neural text-white hover:shadow-glow-neural">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            {stats.map((stat, index) => (
              <Card key={index} variant="glass" className="hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 bg-gradient-${stat.color} rounded-2xl`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium text-muted-foreground">{stat.title}</h3>
                    <p className={`text-3xl font-bold text-gradient-${stat.color} mt-1`}>{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <Card variant="glass" className={`transition-all duration-1000 delay-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <CardHeader>
                  <CardTitle variant="gradient-neural">Recent Bookings</CardTitle>
                  <CardDescription>
                    Your latest service appointments and requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="glass rounded-2xl p-4 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-quantum rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {booking.client.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold">{booking.client}</h4>
                              <p className="text-sm text-muted-foreground">{booking.service}</p>
                              <p className="text-xs text-muted-foreground">{booking.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gradient-plasma">{booking.price}</p>
                            <Badge 
                              variant={booking.status === 'confirmed' ? 'default' : 
                                     booking.status === 'pending' ? 'secondary' : 'outline'}
                              className={
                                booking.status === 'confirmed' ? 'bg-trust-500 text-white' :
                                booking.status === 'pending' ? 'bg-yellow-500 text-white' :
                                'bg-green-500 text-white'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6 glass">
                    View All Bookings
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card variant="glass" className="mt-8">
                <CardHeader>
                  <CardTitle variant="gradient-quantum">Performance Analytics</CardTitle>
                  <CardDescription>
                    Your earnings and rating trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 glass rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-quantum-500 mx-auto mb-4" />
                      <p className="text-muted-foreground">Performance chart will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Messages */}
              <Card variant="glass" className={`transition-all duration-1000 delay-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <CardHeader>
                  <CardTitle variant="gradient-trust">Recent Messages</CardTitle>
                  <CardDescription>
                    Latest client communications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="glass rounded-2xl p-4 hover:bg-white/10 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-trust rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {message.from.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium truncate">{message.from}</h5>
                              {message.unread && (
                                <div className="w-2 h-2 bg-neural-500 rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 glass">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    View All Messages
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card variant="plasma">
                <CardHeader>
                  <CardTitle variant="gradient-plasma">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-neural text-white hover:shadow-glow-neural">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Availability
                  </Button>
                  <Button className="w-full bg-gradient-quantum text-white hover:shadow-glow-quantum">
                    <Users className="w-4 h-4 mr-2" />
                    Find New Clients
                  </Button>
                  <Button className="w-full bg-gradient-trust text-white hover:shadow-glow-trust">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Update Services
                  </Button>
                  <Button className="w-full bg-gradient-plasma text-white hover:shadow-glow-plasma">
                    <Award className="w-4 h-4 mr-2" />
                    View Certifications
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card variant="neural">
                <CardHeader>
                  <CardTitle variant="gradient-neural">💡 Pro Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="glass rounded-xl p-3">
                      <p className="font-medium mb-1">Boost your visibility</p>
                      <p className="text-muted-foreground">Complete your profile to appear in more searches</p>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <p className="font-medium mb-1">Quick responses</p>
                      <p className="text-muted-foreground">Reply within 2 hours to improve your ranking</p>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <p className="font-medium mb-1">Quality service</p>
                      <p className="text-muted-foreground">Maintain 4.8+ rating for Elite status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ModernFooter />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireEmailVerification={false}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
