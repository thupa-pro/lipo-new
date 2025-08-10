"use client";

import { useState } from 'react';
import { 
  Sparkles, Menu, X, Search, User, Settings, LogOut, Bell,
  Home, Users, Calendar, MessageCircle, BarChart3, Briefcase
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';

interface ModernNavigationProps {
  currentPath?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function ModernNavigation({ currentPath, user }: ModernNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Browse Services', href: '/browse', icon: Search },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'My Bookings', href: '/my-bookings', icon: Calendar },
    { name: 'Become Provider', href: '/become-provider', icon: Briefcase },
  ];

  const userMenuItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ];

  return (
    <nav className="relative z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="card-glow rounded-3xl px-6 md:px-8 py-4 flex items-center justify-between backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 ai-gradient rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Loconomy</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'ai-gradient text-white shadow-lg border border-white/20'
                      : 'text-foreground/80 hover:text-foreground hover:bg-background/50 border border-transparent hover:border-border/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl card-glow hover:scale-105 transition-all duration-300"
                >
                  <div className="w-8 h-8 ai-gradient rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 card-glow rounded-2xl p-2 shadow-2xl animate-scale-in border border-border/20">
                    <div className="px-4 py-3 border-b border-border/30">
                      <p className="text-sm font-medium gradient-text">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="py-2">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-background/50 rounded-xl transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      <button className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground/80 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors w-full">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors px-4 py-2 rounded-xl hover:bg-background/50">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-glow text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl glass hover:bg-neural-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-neural-600" /> : <Menu className="w-6 h-6 text-neural-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 glass rounded-3xl p-6 animate-fade-in">
            <div className="space-y-4">
              {navigationItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-neural text-white shadow-glow-neural' 
                        : 'text-muted-foreground hover:text-neural-600 hover:bg-neural-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center space-x-3 p-3">
                    <div className="w-10 h-10 bg-gradient-neural rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gradient-neural">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 p-3 text-muted-foreground hover:text-neural-600 hover:bg-neural-50 rounded-xl transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <button className="flex items-center space-x-3 p-3 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border space-y-3">
                  <Link href="/auth/login" className="block w-full glass text-center px-6 py-3 rounded-2xl font-medium text-neural-600 hover:bg-neural-50 transition-all duration-300">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="block w-full bg-gradient-neural text-white px-6 py-3 rounded-2xl font-medium hover:shadow-glow-neural transition-all duration-300 text-center">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
