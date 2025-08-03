"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, Users, Calendar, MessageCircle, Settings, BarChart3,
  Bell, Heart, Star, Clock, Shield, Zap, DollarSign, Award
} from 'lucide-react';

export function QuickActions() {
  const quickLinks = [
    { href: "/browse", label: "Browse Services", icon: Search, description: "Find local providers" },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3, description: "Your activity overview" },
    { href: "/my-bookings", label: "My Bookings", icon: Calendar, description: "View your appointments" },
    { href: "/messages", label: "Messages", icon: MessageCircle, description: "Chat with providers" },
    { href: "/request-service", label: "Request Service", icon: Users, description: "Post a service request" },
    { href: "/payments", label: "Payments", icon: DollarSign, description: "Manage billing" },
    { href: "/settings", label: "Settings", icon: Settings, description: "Account preferences" },
    { href: "/help", label: "Help Center", icon: Award, description: "Get support" },
  ];

  const userStats = [
    { label: "Active Bookings", value: "3", icon: Clock, color: "text-blue-600" },
    { label: "Favorite Providers", value: "12", icon: Heart, color: "text-red-500" },
    { label: "Reviews Given", value: "28", icon: Star, color: "text-yellow-500" },
    { label: "Trust Score", value: "98%", icon: Shield, color: "text-green-600" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {userStats.map((stat, index) => (
          <Card key={index} className="glass">
            <CardContent className="p-4 text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gradient-neural">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Link key={index} href={link.href}>
            <Card className="glass hover:shadow-glass-lg transition-all duration-300 h-full cursor-pointer group">
              <CardContent className="p-6 text-center">
                <link.icon className="w-8 h-8 mx-auto mb-3 text-neural-600 group-hover:text-neural-700 transition-colors" />
                <h3 className="font-semibold text-gradient-neural mb-2">{link.label}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="glass mt-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gradient-neural mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Cleaning service completed</p>
                  <p className="text-sm text-muted-foreground">Sarah's Home Cleaning - 2 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium">New review received</p>
                  <p className="text-sm text-muted-foreground">Mike's Tech Repair - 5 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Upcoming appointment</p>
                  <p className="text-sm text-muted-foreground">Garden maintenance - Tomorrow at 2:00 PM</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link href="/dashboard">
              <Button variant="outline">View All Activity</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Import CheckCircle at the top
import { CheckCircle } from 'lucide-react';
