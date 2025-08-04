"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ModernFooter } from '@/components/modern-footer';
import { CommandPaletteHint } from '@/components/ui/command-palette-hint';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  Bell,
  User,
  Settings,
  Home,
  Briefcase,
  CreditCard,
  HelpCircle,
  LogOut,
  Activity,
  X,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Welcome!", message: "Explore our premium services", time: "5 min ago", read: false },
    { id: "2", title: "New Services", message: "Check out our latest provider additions", time: "1 hour ago", read: false },
    { id: "3", title: "Special Offer", message: "Get 20% off your first booking", time: "2 hours ago", read: true },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const user = {
    name: "Guest User",
    email: "guest@loconomy.com",
    avatar: "",
    plan: "Free",
    isLoggedIn: false,
  };

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    toast({
      title: "Notification opened",
      description: "Viewing notification details",
    });
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notifications have been updated",
    });
  };

  const handleUserProfileClick = () => {
    if (user.isLoggedIn) {
      router.push('/profile');
    } else {
      router.push('/auth/signin');
    }
    toast({
      title: user.isLoggedIn ? "Opening Profile" : "Sign In Required",
      description: user.isLoggedIn ? "Navigating to your profile" : "Please sign in to access your profile",
    });
  };

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const handleLogout = () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    router.push("/auth/signin");
  };

  const handleSearch = () => {
    if (searchQuery.trim() || locationQuery.trim()) {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (locationQuery.trim()) params.set('location', locationQuery.trim());
      router.push(`/browse?${params.toString()}`);
    } else {
      toast({
        title: "Search Query Required",
        description: "Please enter a service or location to search",
        variant: "destructive",
      });
    }
  };

  const handleQuickSearch = (tag: string) => {
    setSearchQuery(tag);
    const params = new URLSearchParams();
    params.set('q', tag);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
      
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[200px] animate-pulse"></div>
      <div className="absolute bottom-[-30%] right-[-20%] w-[900px] h-[900px] bg-cyan-700/30 rounded-full blur-[200px] animate-pulse animation-delay-4000"></div>
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-[150px] animate-pulse animation-delay-2000"></div>

      {/* Header */}
      <header className="relative z-10 py-4 px-4 sm:px-6 lg:px-8 bg-glass/80 border-b border-white/10 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-purple-400 text-2xl md:text-4xl">hub</span>
            <span className="text-xl md:text-3xl font-bold text-white tracking-wider">Loconomy</span>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <Link href="/browse" className="hover:text-white transition-colors duration-300">Find Services</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors duration-300">How It Works</Link>
            <Link href="/become-provider" className="hover:text-white transition-colors duration-300">Become a Provider</Link>
            <Link href="/blog" className="hover:text-white transition-colors duration-300">Blog</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                  <span className="material-icons text-gray-300">notifications_none</span>
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white border-2 border-[var(--dark-navy)] animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 glass border-white/20" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="text-white">Notifications</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="text-xs text-purple-400 hover:text-white"
                  >
                    Mark all read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex-col items-start p-4 cursor-pointer hover:bg-white/10 transition-colors ${
                      !notification.read ? 'bg-purple-500/10' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <h4 className="font-medium text-white">{notification.title}</h4>
                      <span className="text-xs text-gray-400">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Avatar className="h-8 w-8 border-2 border-purple-500/50">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white text-sm font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {user.isLoggedIn && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[var(--dark-navy)]" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 glass border-white/20" align="end">
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-purple-500/50">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white font-bold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <Badge className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs">
                          {user.plan}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {user.isLoggedIn ? [
                  { href: "/dashboard", label: "Dashboard", icon: Activity },
                  { href: "/profile", label: "Profile", icon: User },
                  { href: "/my-bookings", label: "My Bookings", icon: Briefcase },
                  { href: "/payments", label: "Payments", icon: CreditCard },
                  { href: "/settings", label: "Settings", icon: Settings },
                  { href: "/help", label: "Help Center", icon: HelpCircle },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors m-1 rounded-2xl p-3"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )) : [
                  <DropdownMenuItem
                    key="signin"
                    asChild
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors m-1 rounded-2xl p-3"
                  >
                    <Link href="/auth/signin">
                      <User className="w-4 h-4" />
                      Sign In
                    </Link>
                  </DropdownMenuItem>,
                  <DropdownMenuItem
                    key="signup"
                    asChild
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors m-1 rounded-2xl p-3"
                  >
                    <Link href="/auth/signup">
                      <User className="w-4 h-4" />
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                ]}
                {user.isLoggedIn && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="text-white cursor-pointer hover:bg-white/10 transition-colors m-1 rounded-2xl p-3"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-full hover:bg-white/10 transition-colors lg:hidden"
                  onClick={handleMenuClick}
                >
                  <span className="material-icons text-gray-300">menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass border-white/10">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
                    <Avatar className="h-12 w-12 border-2 border-purple-500/50">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white font-bold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <Badge className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs">
                        {user.plan}
                      </Badge>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-2">
                    {[
                      { href: "/", label: "Home", icon: Home },
                      { href: "/browse", label: "Find Services", icon: Activity },
                      { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
                      { href: "/become-provider", label: "Become Provider", icon: Briefcase },
                      { href: "/blog", label: "Blog", icon: User },
                    ].map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        className="justify-start h-12 w-full glass hover:bg-white/10 transition-all duration-300 rounded-2xl mb-2"
                        asChild
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      </Button>
                    ))}

                    <div className="border-t border-white/10 pt-4">
                      {user.isLoggedIn ? (
                        <Button
                          variant="ghost"
                          className="justify-start text-white w-full hover:bg-white/10 transition-colors rounded-2xl h-12"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Sign Out
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            className="justify-start text-white w-full hover:bg-white/10 transition-colors rounded-2xl h-12"
                            asChild
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href="/auth/signin">
                              <User className="w-5 h-5 mr-3" />
                              Sign In
                            </Link>
                          </Button>
                          <Button
                            className="justify-start w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-2xl h-12"
                            asChild
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href="/auth/signup">
                              <User className="w-5 h-5 mr-3" />
                              Sign Up
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="hero-section text-center py-16 md:py-40">
          <div className="hero-badge floating-element glow-pulse mb-6 flex justify-center items-center gap-2 text-xs md:text-sm font-medium px-4 md:px-6 py-2 md:py-3 rounded-full inline-flex">
            <span className="material-icons text-sm md:text-lg animate-pulse">verified</span>
            <span>Trusted by 2.4M+ Users Worldwide</span>
          </div>

          <h1 className="text-3xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight px-4">
            <span className="hero-title-gradient text-reveal">Connect with Local</span>
            <br />
            <span className="hero-title-dark text-reveal delay-200">Service Professionals You Trust</span>
          </h1>

          <p className="hero-description max-w-3xl mx-auto text-base md:text-xl mb-8 md:mb-12 font-medium px-4">
            Loconomy is the premium marketplace connecting you with verified local service providers. From home repairs to personal training - find trusted professionals in your area with our AI-powered matching system.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 px-4">
            <Link
              href="/browse"
              className="w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-bold rounded-full text-base md:text-lg btn-glow transition-transform transform hover:scale-105"
            >
              <span className="material-icons text-lg md:text-xl">search</span>
              Find Services Now
            </Link>
            <Link
              href="/become-provider"
              className="w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-white/10 text-white font-bold rounded-full text-base md:text-lg hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/30"
            >
              <span className="material-icons text-lg md:text-xl">group_add</span>
              Become a Provider
            </Link>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 md:py-20" id="find-service">
          <div className="search-card ultra-glass rounded-3xl p-6 md:p-12 hover-scale mx-4 md:mx-0">
            <h2 className="section-title text-2xl md:text-4xl font-bold text-center mb-2">Start Your Search</h2>
            <p className="section-subtitle text-center mb-6 md:mb-10">Get matched with the perfect professional in seconds.</p>

            <div className="max-w-4xl mx-auto">
              <div className="search-input-container flex flex-col md:flex-row items-center p-2 md:p-3 rounded-full">
                <div className="flex-grow w-full flex items-center pl-3 md:pl-4 pr-2">
                  <span className="material-icons text-[var(--mid-gray)] mr-2 md:mr-3 text-lg md:text-xl">work_outline</span>
                  <input
                    className="search-input w-full focus:outline-none py-2 md:py-3 text-base md:text-lg"
                    placeholder="What service do you need?"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-auto flex items-center pl-3 md:pl-4 pr-2 border-t md:border-t-0 md:border-l border-gray-200 dark:border-white/10 mt-2 md:mt-0 pt-2 md:pt-0">
                  <span className="material-icons text-gray-500 dark:text-[var(--mid-gray)] mr-2 md:mr-3 text-lg md:text-xl">location_on</span>
                  <input
                    className="search-input w-full focus:outline-none py-2 md:py-3 text-base md:text-lg"
                    placeholder="Your Location"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full mt-3 md:mt-0 md:w-auto px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold rounded-full btn-glow transition-transform transform hover:scale-105 flex-shrink-0"
                >
                  Search
                </button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 md:mt-8 text-xs md:text-sm">
                {['House Cleaning', 'Plumber', 'Electrician', 'Personal Trainer', 'Math Tutor'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickSearch(tag)}
                    className="search-tag interactive-element px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all duration-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 px-4" id="how-it-works">
          <h2 className="section-title text-2xl md:text-4xl font-bold text-center mb-4">How Loconomy Works</h2>
          <p className="section-subtitle text-base md:text-lg text-center mb-12 md:mb-16 max-w-2xl mx-auto">Finding your ideal service professional is as easy as 1-2-3.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>
            <div className="works-connecting-line absolute top-1/2 left-0 w-full hidden md:flex justify-between">
              <div className="w-1/3 h-px"></div>
              <div className="w-1/3 h-px"></div>
            </div>

            <div className="relative text-center z-10">
              <div className="works-number-circle w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-2xl md:text-4xl font-black gradient-text">1</span>
              </div>
              <h3 className="works-step-title text-xl md:text-2xl font-bold mb-2 md:mb-3">Post a Job</h3>
              <p className="works-step-description text-sm md:text-base">Tell us what you need. Be specific to get the most accurate quotes from our network of professionals.</p>
            </div>

            <div className="relative text-center z-10">
              <div className="works-number-circle w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-2xl md:text-4xl font-black gradient-text">2</span>
              </div>
              <h3 className="works-step-title text-xl md:text-2xl font-bold mb-2 md:mb-3">Get Matches</h3>
              <p className="works-step-description text-sm md:text-base">Our smart AI algorithm matches you with qualified, vetted pros in your area who are ready to help.</p>
            </div>

            <div className="relative text-center z-10">
              <div className="works-number-circle w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-2xl md:text-4xl font-black gradient-text">3</span>
              </div>
              <h3 className="works-step-title text-xl md:text-2xl font-bold mb-2 md:mb-3">Hire & Relax</h3>
              <p className="works-step-description text-sm md:text-base">Compare profiles, quotes, and reviews. Hire the best fit and get the job done right, guaranteed.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <h2 className="section-title text-4xl font-bold text-center mb-12">Trusted Platform Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="stats-card ultra-glass p-8 rounded-3xl text-center interactive-element floating-element">
              <div className="flex justify-center items-center mb-4">
                <div className="stats-icon-bg p-4 rounded-full">
                  <span className="material-icons text-3xl text-purple-500">group</span>
                </div>
              </div>
              <p className="stats-number text-5xl font-bold mb-2">2.4M+</p>
              <p className="stats-label mb-4">Active Users</p>
              <span className="stats-growth font-semibold text-sm">+23.5% vs last month</span>
            </div>
            
            <div className="stats-card ultra-glass p-8 rounded-3xl text-center interactive-element floating-element delay-100">
              <div className="flex justify-center items-center mb-4">
                <div className="stats-icon-bg p-4 rounded-full">
                  <span className="material-icons text-3xl text-cyan-500">timer</span>
                </div>
              </div>
              <p className="stats-number text-5xl font-bold mb-2">&lt; 2hrs</p>
              <p className="stats-label mb-4">Average Response</p>
              <span className="stats-growth font-semibold text-sm">+15.2% vs last month</span>
            </div>

            <div className="stats-card ultra-glass p-8 rounded-3xl text-center interactive-element floating-element delay-200">
              <div className="flex justify-center items-center mb-4">
                <div className="stats-icon-bg p-4 rounded-full">
                  <span className="material-icons text-3xl text-green-500">check_circle</span>
                </div>
              </div>
              <p className="stats-number text-5xl font-bold mb-2">98.7%</p>
              <p className="stats-label mb-4">Job Success Rate</p>
              <span className="stats-growth font-semibold text-sm">+2.1% vs last month</span>
            </div>

            <div className="stats-card ultra-glass p-8 rounded-3xl text-center interactive-element floating-element delay-300">
              <div className="flex justify-center items-center mb-4">
                <div className="stats-icon-bg p-4 rounded-full">
                  <span className="material-icons text-3xl text-pink-500">star</span>
                </div>
              </div>
              <p className="stats-number text-5xl font-bold mb-2">4.9/5</p>
              <p className="stats-label mb-4">Average Rating</p>
              <span className="stats-growth font-semibold text-sm">+1.8% vs last month</span>
            </div>
          </div>
        </section>

        {/* Service Categories Section */}
        <section className="py-20">
          <h2 className="section-title text-4xl font-bold text-center mb-4">Popular Service Categories</h2>
          <p className="section-subtitle text-lg text-center mb-12 max-w-2xl mx-auto">Explore thousands of verified service providers across all major categories.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="category-card rounded-3xl p-8 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-purple-500 mb-4">home_repair_service</span>
                <h3 className="category-title text-2xl font-bold mb-2">Home Services</h3>
                <p className="category-description mb-6 flex-grow">Plumbing, electrical, cleaning, and more. All your home needs covered.</p>
                <Link href="/category/home-services" className="category-link font-semibold flex items-center group-hover:text-purple-600 dark:group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-cyan-400 mb-4">fitness_center</span>
                <h3 className="text-2xl font-bold text-white mb-2">Wellness & Fitness</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Personal trainers, yoga instructors, and nutritionists to achieve your goals.</p>
                <Link href="/category/wellness-fitness" className="font-semibold text-cyan-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-fuchsia-400 mb-4">school</span>
                <h3 className="text-2xl font-bold text-white mb-2">Education & Tutoring</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Find expert tutors for any subject, from math and science to music lessons.</p>
                <Link href="/category/education-tutoring" className="font-semibold text-fuchsia-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-green-400 mb-4">build</span>
                <h3 className="text-2xl font-bold text-white mb-2">Tech & Repair</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Computer, phone, appliance repair and technical support services.</p>
                <Link href="/category/tech-repair" className="font-semibold text-green-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-orange-400 mb-4">directions_car</span>
                <h3 className="text-2xl font-bold text-white mb-2">Automotive</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Car repair, maintenance, detailing and automotive services.</p>
                <Link href="/category/automotive" className="font-semibold text-orange-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="material-icons text-5xl text-pink-400 mb-4">celebration</span>
                <h3 className="text-2xl font-bold text-white mb-2">Entertainment</h3>
                <p className="text-[var(--mid-gray)] mb-6 flex-grow">Events, photography, music and entertainment services.</p>
                <Link href="/category/entertainment" className="font-semibold text-pink-300 flex items-center group-hover:text-white transition-colors">
                  Explore
                  <span className="material-icons text-lg ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24">
          <h2 className="text-4xl font-bold text-center text-white mb-4">What Our Users Say</h2>
          <p className="text-lg text-[var(--mid-gray)] text-center mb-16 max-w-2xl mx-auto">
            Join millions of satisfied customers who trust Loconomy for their service needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-glass rounded-3xl p-8 card-glow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">SJ</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Sarah Johnson</h4>
                  <p className="text-sm text-[var(--mid-gray)]">Homeowner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-icons text-yellow-400">star</span>
                ))}
              </div>
              <p className="text-[var(--mid-gray)] italic">
                "Found an amazing house cleaner through Loconomy in minutes. The booking process was seamless and the service quality exceeded my expectations!"
              </p>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Mike Rodriguez</h4>
                  <p className="text-sm text-[var(--mid-gray)]">Business Owner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-icons text-yellow-400">star</span>
                ))}
              </div>
              <p className="text-[var(--mid-gray)] italic">
                "As a provider, Loconomy has transformed my business. The AI matching brings me perfect clients and the platform handles everything seamlessly."
              </p>
            </div>

            <div className="bg-glass rounded-3xl p-8 card-glow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">ET</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Emma Thompson</h4>
                  <p className="text-sm text-[var(--mid-gray)]">Tech Professional</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-icons text-yellow-400">star</span>
                ))}
              </div>
              <p className="text-[var(--mid-gray)] italic">
                "The AI recommendations are spot-on! Got my laptop fixed by a certified technician who arrived within 2 hours. Incredible service!"
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-l from-purple-900/20 to-cyan-900/20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose Loconomy</h2>
            <p className="text-lg text-[var(--mid-gray)] max-w-2xl mx-auto">
              Advanced technology meets personalized service for the ultimate experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl text-white">psychology</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">AI-Powered Matching</h3>
              <p className="text-[var(--mid-gray)] text-sm">Our neural network learns your preferences and matches you with the perfect providers every time.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl text-white">verified</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Verified & Insured</h3>
              <p className="text-[var(--mid-gray)] text-sm">Every provider is background-checked, verified, and fully insured for your peace of mind.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl text-white">flash_on</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Instant Booking</h3>
              <p className="text-[var(--mid-gray)] text-sm">Book services instantly with real-time availability and immediate confirmation.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-3xl text-white">support_agent</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">24/7 Support</h3>
              <p className="text-[var(--mid-gray)] text-sm">Round-the-clock customer support and live tracking for all your service needs.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-glass rounded-3xl p-12 text-center card-glow">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Get Started with Loconomy?
              </h2>
              <p className="text-lg text-[var(--mid-gray)] mb-8 max-w-2xl mx-auto">
                Join millions of satisfied customers who have found their perfect service providers through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/browse" className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-8 py-4 rounded-full font-semibold text-lg btn-glow transition-transform transform hover:scale-105 flex items-center justify-center">
                  Find Services Now
                </Link>
                <Link href="/become-provider" className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-transparent hover:border-white/30 flex items-center justify-center">
                  Start Earning as Provider
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ModernFooter />
      <CommandPaletteHint />
    </div>
  );
}
