'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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
  Search,
  UserPlus,
  Sparkles,
  Shield,
  BarChart3,
  Users,
  Zap,
  Crown,
  Bot,
  MessageSquare,
  Calendar,
  Wallet,
  Star,
  TrendingUp,
  Database,
  Eye,
  FileText,
  Gavel,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  role?: string[];
}

interface IntelligentHeaderProps {
  onCommandPaletteOpen?: () => void;
}

export function IntelligentHeader({ onCommandPaletteOpen }: IntelligentHeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { user, userProfile, loading } = useAuth();

  // Simple role checks without additional hooks
  const userRole = userProfile?.role || null;
  const isProvider = userRole === 'provider';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  // Intelligent notification system based on user role
  const generateRoleBasedNotifications = () => {
    const baseNotifications = [
      { 
        id: "welcome", 
        title: "Welcome to Loconomy!", 
        message: "Explore our premium services", 
        time: "5 min ago", 
        read: false, 
        type: "info" as const,
        role: ['customer', 'provider']
      },
    ];

    const customerNotifications = [
      {
        id: "new-services",
        title: "New Services Available",
        message: "Check out our latest provider additions in your area",
        time: "1 hour ago",
        read: false,
        type: "success" as const,
        role: ['customer']
      },
      {
        id: "special-offer",
        title: "Special Offer",
        message: "Get 20% off your first booking",
        time: "2 hours ago",
        read: true,
        type: "info" as const,
        role: ['customer']
      },
    ];

    const providerNotifications = [
      {
        id: "new-job",
        title: "New Job Request",
        message: "3 new job requests in your area",
        time: "30 min ago",
        read: false,
        type: "success" as const,
        role: ['provider']
      },
      {
        id: "rating-update",
        title: "Rating Received",
        message: "You received a 5-star rating!",
        time: "1 hour ago",
        read: false,
        type: "success" as const,
        role: ['provider']
      },
      {
        id: "earnings",
        title: "Weekly Earnings",
        message: "Your earnings this week: $850",
        time: "3 hours ago",
        read: true,
        type: "info" as const,
        role: ['provider']
      },
    ];

    const adminNotifications = [
      {
        id: "system-alert",
        title: "System Performance",
        message: "Server load at 85% - monitor required",
        time: "15 min ago",
        read: false,
        type: "warning" as const,
        role: ['admin', 'super_admin']
      },
      {
        id: "new-users",
        title: "User Growth",
        message: "247 new users registered today",
        time: "2 hours ago",
        read: false,
        type: "success" as const,
        role: ['admin', 'super_admin']
      },
      {
        id: "content-review",
        title: "Content Review",
        message: "12 items pending moderation",
        time: "4 hours ago",
        read: true,
        type: "warning" as const,
        role: ['admin', 'super_admin']
      },
    ];

    let roleNotifications = [...baseNotifications];
    
    if (isCustomer()) {
      roleNotifications = [...roleNotifications, ...customerNotifications];
    }
    
    if (isProvider()) {
      roleNotifications = [...roleNotifications, ...providerNotifications];
    }
    
    if (isAdmin() || isSuperAdmin()) {
      roleNotifications = [...roleNotifications, ...adminNotifications];
    }

    return roleNotifications.filter(notification => 
      !notification.role || notification.role.includes(userRole || 'customer')
    );
  };

  useEffect(() => {
    if (user && userRole) {
      const roleNotifications = generateRoleBasedNotifications();
      setNotifications(roleNotifications);
      const count = roleNotifications.filter(n => !n.read).length;
      setUnreadCount(count);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, userRole, isProvider, isAdmin]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

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

  const handleLogout = async () => {
    try {
      // Use the auth context signOut method if available
      // For now, we'll simulate logout
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      router.push("/auth/signin");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Intelligent navigation based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { href: "/browse", label: "Find Services", icon: Search },
      { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
    ];

    if (!user) {
      return [
        ...baseItems,
        { href: "/become-provider", label: "Become a Provider", icon: UserPlus },
        { href: "/blog", label: "Blog", icon: FileText },
      ];
    }

    const customerItems = [
      ...baseItems,
      { href: "/my-bookings", label: "My Bookings", icon: Calendar },
      { href: "/requests", label: "My Requests", icon: Briefcase },
    ];

    const providerItems = [
      { href: "/provider-app", label: "Provider Hub", icon: Briefcase },
      { href: "/provider-resources", label: "Resources", icon: FileText },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ];

    const adminItems = [
      { href: "/admin", label: "Admin Dashboard", icon: Shield },
      { href: "/admin/analytics", label: "System Analytics", icon: TrendingUp },
      { href: "/admin/users", label: "User Management", icon: Users },
    ];

    if (isAdmin() || isSuperAdmin()) {
      return [...adminItems, ...baseItems];
    } else if (isProvider()) {
      return [...providerItems, ...baseItems];
    } else {
      return customerItems;
    }
  };

  // Intelligent user menu based on role
  const getUserMenuItems = () => {
    if (!user) return [];

    const baseItems = [
      { href: "/dashboard", label: "Dashboard", icon: Activity },
      { href: "/profile", label: "Profile", icon: User },
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/help", label: "Help Center", icon: HelpCircle },
    ];

    const customerItems = [
      { href: "/my-bookings", label: "My Bookings", icon: Calendar },
      { href: "/payments", label: "Payments", icon: CreditCard },
      { href: "/feedback", label: "Feedback", icon: MessageSquare },
    ];

    const providerItems = [
      { href: "/provider-app", label: "Provider Hub", icon: Briefcase },
      { href: "/visibility-booster", label: "Visibility Boost", icon: Eye },
      { href: "/earnings", label: "Earnings", icon: Wallet },
      { href: "/provider-support", label: "Provider Support", icon: HelpCircle },
    ];

    const adminItems = [
      { href: "/admin", label: "Admin Panel", icon: Shield },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/users", label: "User Management", icon: Users },
      { href: "/admin/content-moderation", label: "Moderation", icon: Gavel },
      { href: "/admin/system-health-logs", label: "System Health", icon: Database },
    ];

    let items = [...baseItems];

    if (isAdmin() || isSuperAdmin()) {
      items = [...adminItems, ...items];
    } else if (isProvider()) {
      items = [...providerItems, ...items];
    } else if (isCustomer()) {
      items = [...customerItems, ...items];
    }

    return items;
  };

  const getRoleBadgeColor = () => {
    if (isSuperAdmin()) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    if (isAdmin()) return "bg-gradient-to-r from-red-500 to-pink-500";
    if (isProvider()) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    return "bg-gradient-to-r from-purple-500 to-fuchsia-500";
  };

  const getRoleIcon = () => {
    if (userRole === 'super_admin') return Crown;
    if (isAdmin) return Shield;
    if (isProvider) return Briefcase;
    return Star;
  };

  const navigationItems = getNavigationItems();
  const userMenuItems = getUserMenuItems();
  const RoleIcon = getRoleIcon();

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 py-6 px-4 sm:px-6 lg:px-8 bg-transparent border-b border-transparent">
        <div className="responsive-container flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-400 animate-pulse" />
            <span className="text-xl md:text-3xl font-display text-gray-900 dark:text-white tracking-tight">Loconomy</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isClient && isScrolled
          ? 'py-3 px-4 sm:px-6 lg:px-8 bg-glass/95 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-purple-500/10'
          : 'py-6 px-4 sm:px-6 lg:px-8 bg-transparent border-b border-transparent'
      }`}
      role="banner"
      aria-label="Main navigation"
    >
      <div className="responsive-container flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative" aria-hidden="true">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-400 animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-400 opacity-20" />
            </div>
          </div>
          <Link href="/" className="text-xl md:text-3xl font-display text-gray-900 dark:text-white tracking-tight hover:text-purple-500 transition-colors">
            Loconomy
          </Link>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300" role="navigation" aria-label="Primary navigation">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-purple-500 dark:hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Guest User Actions */}
          {!user && (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:flex text-gray-600 dark:text-gray-300 hover:text-purple-500 transition-colors"
              >
                <Link href="/auth/signin">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white hover:from-purple-700 hover:to-fuchsia-600"
              >
                <Link href="/auth/signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Get Started
                </Link>
              </Button>
            </div>
          )}

          {/* Authenticated User Actions */}
          {user && (
            <>
              {/* Notifications - Only for authenticated users */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105" aria-label="View notifications">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 hover:rotate-12" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white border-2 border-[var(--bg-primary)] animate-pulse">
                        {unreadCount}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 glass border-white/20" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="text-foreground">Notifications</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllRead}
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      Mark all read
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {notifications.length > 0 ? notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex-col items-start p-4 cursor-pointer hover:bg-white/10 transition-colors ${
                        !notification.read ? 'bg-purple-500/10' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <h4 className="font-medium text-foreground">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </DropdownMenuItem>
                  )) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Avatar className="h-8 w-8 border-2 border-purple-500/50">
                      <AvatarImage src={userProfile?.avatar || user?.user_metadata?.avatar_url} alt={userProfile?.name || user?.email} />
                      <AvatarFallback className={`${getRoleBadgeColor()} text-white text-sm font-bold`}>
                        {(userProfile?.name || user?.email || user?.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[var(--bg-primary)]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 glass border-white/20" align="end">
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-purple-500/50">
                          <AvatarImage src={userProfile?.avatar || user?.user_metadata?.avatar_url} alt={userProfile?.name || user?.email} />
                          <AvatarFallback className={`${getRoleBadgeColor()} text-white font-bold`}>
                            {(userProfile?.name || user?.email || user?.email || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{userProfile?.name || user?.email || user?.email?.split('@')[0]}</p>
                          <Badge className={`${getRoleBadgeColor()} text-white text-xs flex items-center gap-1`}>
                            <RoleIcon className="w-3 h-3" />
                            {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'User'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {userMenuItems.map((item) => (
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
                  ))}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-foreground cursor-pointer hover:bg-white/10 transition-colors m-1 rounded-2xl p-3"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 lg:hidden"
                aria-label="Open mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 glass border-white/10">
              <div className="flex flex-col space-y-6 mt-8">
                {user && (
                  <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
                    <Avatar className="h-12 w-12 border-2 border-purple-500/50">
                      <AvatarImage src={userProfile?.avatar || user?.user_metadata?.avatar_url} alt={userProfile?.name || user?.email} />
                      <AvatarFallback className={`${getRoleBadgeColor()} text-white font-bold`}>
                        {(userProfile?.name || user?.email || user?.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{userProfile?.name || user?.email || user?.email?.split('@')[0]}</p>
                      <Badge className={`${getRoleBadgeColor()} text-white text-xs flex items-center gap-1 w-fit`}>
                        <RoleIcon className="w-3 h-3" />
                        {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'User'}
                      </Badge>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
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
                    {!user ? (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="justify-start text-foreground w-full hover:bg-white/10 transition-colors rounded-2xl h-12"
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
                            <UserPlus className="w-5 h-5 mr-3" />
                            Get Started
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="justify-start text-foreground w-full hover:bg-white/10 transition-colors rounded-2xl h-12"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                      </Button>
                    )}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
