"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Icons
import {
  Menu,
  Bell,
  User,
  Heart,
  Share2,
  Star,
  Shield,
  Award,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  Upload,
  Camera,
  Play,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Crown,
  Brain,
  Zap,
  Target,
  Eye,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Home,
  Briefcase,
  CreditCard,
  HelpCircle,
  Activity,
  X,
  Plus,
  Minus,
} from "lucide-react";

// Types
interface ProviderApplication {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
  };
  serviceInfo: {
    category: string;
    services: string[];
    experience: string;
    description: string;
    hourlyRate: number;
  };
  businessInfo: {
    businessName: string;
    licenseNumber: string;
    insurance: boolean;
    pricing: string;
    availability: string[];
  };
  verification: {
    documents: File[];
    agreement: boolean;
    backgroundCheck: boolean;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Data
const serviceCategories = [
  { name: "House Cleaning", icon: "🏠", commission: "12%", demand: "High", earnings: "$2,500" },
  { name: "Handyman Services", icon: "🔧", commission: "10%", demand: "Very High", earnings: "$3,200" },
  { name: "Pet Care", icon: "🐕", commission: "15%", demand: "Medium", earnings: "$1,800" },
  { name: "Tutoring", icon: "📚", commission: "8%", demand: "High", earnings: "$2,800" },
  { name: "Gardening", icon: "🌱", commission: "12%", demand: "Medium", earnings: "$2,100" },
  { name: "Beauty & Wellness", icon: "💅", commission: "10%", demand: "High", earnings: "$2,900" },
  { name: "Personal Training", icon: "💪", commission: "15%", demand: "High", earnings: "$3,500" },
  { name: "Photography", icon: "📸", commission: "8%", demand: "Medium", earnings: "$2,400" },
];

const availabilityOptions = [
  "Monday Morning", "Monday Afternoon", "Monday Evening",
  "Tuesday Morning", "Tuesday Afternoon", "Tuesday Evening",
  "Wednesday Morning", "Wednesday Afternoon", "Wednesday Evening",
  "Thursday Morning", "Thursday Afternoon", "Thursday Evening",
  "Friday Morning", "Friday Afternoon", "Friday Evening",
  "Saturday Morning", "Saturday Afternoon", "Saturday Evening",
  "Sunday Morning", "Sunday Afternoon", "Sunday Evening",
];

export default function BecomeProviderPage() {
  // Core State
  const [currentStep, setCurrentStep] = useState(0);
  const [showApplication, setShowApplication] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Header State
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Welcome!", message: "Complete your application to start earning", time: "5 min ago", read: false },
    { id: "2", title: "High Demand", message: "Your category has 15+ pending requests", time: "1 hour ago", read: false },
    { id: "3", title: "Tip", message: "Add photos to increase booking rates by 60%", time: "2 hours ago", read: true },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [likedServices, setLikedServices] = useState<Set<string>>(new Set());
  
  // Form Data
  const [formData, setFormData] = useState<ProviderApplication>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      profileImage: undefined,
    },
    serviceInfo: {
      category: "",
      services: [],
      experience: "",
      description: "",
      hourlyRate: 25,
    },
    businessInfo: {
      businessName: "",
      licenseNumber: "",
      insurance: false,
      pricing: "",
      availability: [],
    },
    verification: {
      documents: [],
      agreement: false,
      backgroundCheck: false,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const totalSteps = 4;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // Mock user data
  const user = {
    name: "Alex Chen",
    email: "alex@loconomy.com",
    avatar: "",
    plan: "Provider Pro",
    isVerified: true,
  };

  // Effects
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Handlers
  const handleLikeService = (serviceName: string) => {
    setLikedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceName)) {
        newSet.delete(serviceName);
        toast({
          title: "Removed from favorites",
          description: `${serviceName} removed from your favorites`,
        });
      } else {
        newSet.add(serviceName);
        toast({
          title: "Added to favorites",
          description: `${serviceName} added to your favorites`,
        });
      }
      return newSet;
    });
  };

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

  const handleStartApplication = () => {
    setShowApplication(true);
    toast({
      title: "Application Started",
      description: "Let's build your provider profile!",
    });
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      toast({
        title: "Progress Saved",
        description: `Step ${currentStep + 2} of ${totalSteps}`,
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAvailabilityToggle = (slot: string) => {
    setFormData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        availability: prev.businessInfo.availability.includes(slot)
          ? prev.businessInfo.availability.filter(s => s !== slot)
          : [...prev.businessInfo.availability, slot]
      }
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      serviceInfo: {
        ...prev.serviceInfo,
        services: prev.serviceInfo.services.includes(service)
          ? prev.serviceInfo.services.filter(s => s !== service)
          : [...prev.serviceInfo.services, service]
      }
    }));
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    toast({
      title: "🎉 Application Submitted Successfully!",
      description: "We'll review your application and get back to you within 24 hours.",
      variant: "default",
    });

    setTimeout(() => {
      router.push("/provider-resources");
    }, 2000);
  };

  const handleLogout = () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    router.push("/auth/signin");
  };

  const HeaderComponent = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--dark-navy)]/95 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--purple-glow)] via-[var(--magenta-glow)] to-[var(--cyan-glow)] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-[var(--purple-glow)]/50 transition-all duration-500 group-hover:scale-110">
                <span className="text-white font-black text-lg">L</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--cyan-glow)] rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="font-black text-xl gradient-text">Loconomy</span>
              <div className="flex items-center gap-1 -mt-1">
                <span className="material-icons text-sm text-[var(--purple-glow)] animate-pulse">verified</span>
                <span className="text-xs text-[var(--purple-glow)] font-medium">AI-Powered</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {[
              { href: "/", label: "Home", icon: Home },
              { href: "/browse", label: "Services", icon: Target },
              { href: "/request-service", label: "Request", icon: Briefcase },
            ].map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                asChild
                className="h-10 px-6 rounded-2xl glass hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 w-10 rounded-2xl glass hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Bell className="w-4 h-4 text-[var(--mid-gray)]" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-[var(--magenta-glow)] to-[var(--purple-glow)] text-white border-2 border-[var(--dark-navy)] animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 glass border-white/20" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="text-white">Notifications</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="text-xs text-[var(--purple-glow)] hover:text-white"
                  >
                    Mark all read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex-col items-start p-4 cursor-pointer hover:bg-white/10 transition-colors ${
                      !notification.read ? 'bg-[var(--purple-glow)]/10' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <h4 className="font-medium text-white">{notification.title}</h4>
                      <span className="text-xs text-[var(--mid-gray)]">{notification.time}</span>
                    </div>
                    <p className="text-sm text-[var(--mid-gray)] mt-1">{notification.message}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-2xl p-0 glass hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Avatar className="h-8 w-8 border-2 border-[var(--purple-glow)]/50">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[var(--purple-glow)] to-[var(--magenta-glow)] text-white text-sm font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {user.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--cyan-glow)] rounded-full border-2 border-[var(--dark-navy)]" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 glass border-white/20" align="end">
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-[var(--purple-glow)]/50">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[var(--purple-glow)] to-[var(--magenta-glow)] text-white font-bold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <Badge className="bg-gradient-to-r from-[var(--purple-glow)] to-[var(--magenta-glow)] text-white text-xs">
                          {user.plan}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--mid-gray)]">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {[
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
                ))}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="text-white cursor-pointer hover:bg-white/10 transition-colors m-1 rounded-2xl p-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden h-10 w-10 rounded-2xl glass hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Menu className="w-5 h-5 text-[var(--mid-gray)]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass border-white/10">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
                    <Avatar className="h-12 w-12 border-2 border-[var(--purple-glow)]/50">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[var(--purple-glow)] to-[var(--magenta-glow)] text-white font-bold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <Badge className="bg-gradient-to-r from-[var(--purple-glow)] to-[var(--magenta-glow)] text-white text-xs">
                        {user.plan}
                      </Badge>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-2">
                    {[
                      { href: "/", label: "Home", icon: Home },
                      { href: "/browse", label: "Services", icon: Target },
                      { href: "/request-service", label: "Request", icon: Briefcase },
                      { href: "/dashboard", label: "Dashboard", icon: Activity },
                      { href: "/profile", label: "Profile", icon: User },
                      { href: "/my-bookings", label: "My Bookings", icon: Briefcase },
                      { href: "/payments", label: "Payments", icon: CreditCard },
                      { href: "/settings", label: "Settings", icon: Settings },
                      { href: "/help", label: "Help Center", icon: HelpCircle },
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
                      <Button
                        variant="ghost"
                        className="justify-start text-white w-full hover:bg-white/10 transition-colors rounded-2xl h-12"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );

  if (showApplication) {
    return (
      <div className="min-h-screen bg-[var(--dark-navy)]">
        <HeaderComponent />
        
        {/* Application Form */}
        <div className="pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Header */}
            <div className="glass rounded-3xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Provider Application</h1>
                <Badge className="bg-gradient-to-r from-[var(--purple-glow)] to-[var(--cyan-glow)] text-white">
                  Step {currentStep + 1} of {totalSteps}
                </Badge>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-[var(--mid-gray)] mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="flex justify-between text-xs text-[var(--mid-gray)]">
                {["Personal Info", "Services", "Business", "Verification"].map((step, index) => (
                  <span
                    key={step}
                    className={`${
                      index <= currentStep ? "text-[var(--cyan-glow)]" : "text-[var(--mid-gray)]"
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <Card className="glass border-white/20">
              <CardContent className="p-8">
                {/* Step 0: Personal Information */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                      <p className="text-[var(--mid-gray)]">Tell us about yourself to get started.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName" className="text-white">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.personalInfo.firstName}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                            }))
                          }
                          className="mt-2"
                          placeholder="Enter your first name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.personalInfo.lastName}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                            }))
                          }
                          className="mt-2"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.personalInfo.email}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, email: e.target.value }
                            }))
                          }
                          className="mt-2"
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.personalInfo.phone}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, phone: e.target.value }
                            }))
                          }
                          className="mt-2"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-white">Location *</Label>
                      <Input
                        id="location"
                        value={formData.personalInfo.location}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, location: e.target.value }
                          }))
                        }
                        className="mt-2"
                        placeholder="City, State"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Profile Photo</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-2 border-[var(--purple-glow)]/50">
                          <AvatarImage src={formData.personalInfo.profileImage} alt="Profile" />
                          <AvatarFallback className="bg-gradient-to-br from-[var(--purple-glow)] to-[var(--magenta-glow)] text-white text-xl font-bold">
                            {formData.personalInfo.firstName.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Upload Photo
                          </Button>
                          <p className="text-xs text-[var(--mid-gray)] mt-1">
                            JPG, PNG up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Service Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Service Information</h2>
                      <p className="text-[var(--mid-gray)]">What services do you provide?</p>
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-white">Primary Category *</Label>
                      <Select
                        value={formData.serviceInfo.category}
                        onValueChange={(value) =>
                          setFormData(prev => ({
                            ...prev,
                            serviceInfo: { ...prev.serviceInfo, category: value }
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Choose your primary service category" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/20">
                          {serviceCategories.map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              <div className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Specific Services *</Label>
                      <p className="text-sm text-[var(--mid-gray)] mb-3">
                        Select all the services you offer in your category
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          "Basic Cleaning", "Deep Cleaning", "Move-in/out Cleaning",
                          "Office Cleaning", "Carpet Cleaning", "Window Cleaning",
                          "Post-construction", "Eco-friendly Options"
                        ].map((service) => (
                          <Button
                            key={service}
                            variant={formData.serviceInfo.services.includes(service) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleServiceToggle(service)}
                            className={`justify-start h-auto p-3 text-left ${
                              formData.serviceInfo.services.includes(service)
                                ? "bg-gradient-to-r from-[var(--purple-glow)] to-[var(--cyan-glow)] text-white"
                                : ""
                            }`}
                          >
                            {service}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="experience" className="text-white">Years of Experience *</Label>
                      <Select
                        value={formData.serviceInfo.experience}
                        onValueChange={(value) =>
                          setFormData(prev => ({
                            ...prev,
                            serviceInfo: { ...prev.serviceInfo, experience: value }
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/20">
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="hourlyRate" className="text-white">Hourly Rate ($) *</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <Input
                          id="hourlyRate"
                          type="number"
                          min="15"
                          max="200"
                          value={formData.serviceInfo.hourlyRate}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              serviceInfo: { ...prev.serviceInfo, hourlyRate: Number(e.target.value) }
                            }))
                          }
                          className="w-32"
                        />
                        <span className="text-[var(--mid-gray)]">per hour</span>
                      </div>
                      <p className="text-sm text-[var(--mid-gray)] mt-1">
                        Suggested range: $20-$75/hour for this category
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-white">Service Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.serviceInfo.description}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            serviceInfo: { ...prev.serviceInfo, description: e.target.value }
                          }))
                        }
                        className="mt-2"
                        rows={4}
                        placeholder="Describe your services, experience, and what makes you unique..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Business Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Business Information</h2>
                      <p className="text-[var(--mid-gray)]">Professional details and availability.</p>
                    </div>

                    <div>
                      <Label htmlFor="businessName" className="text-white">Business Name</Label>
                      <Input
                        id="businessName"
                        value={formData.businessInfo.businessName}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, businessName: e.target.value }
                          }))
                        }
                        className="mt-2"
                        placeholder="Your business name (optional)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="licenseNumber" className="text-white">License Number</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.businessInfo.licenseNumber}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, licenseNumber: e.target.value }
                          }))
                        }
                        className="mt-2"
                        placeholder="Professional license number (if applicable)"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="insurance"
                        checked={formData.businessInfo.insurance}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, insurance: checked as boolean }
                          }))
                        }
                      />
                      <Label htmlFor="insurance" className="text-white">
                        I have liability insurance coverage
                      </Label>
                    </div>

                    <div>
                      <Label className="text-white">Availability *</Label>
                      <p className="text-sm text-[var(--mid-gray)] mb-3">
                        Select when you're typically available to work
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                        {availabilityOptions.map((slot) => (
                          <Button
                            key={slot}
                            variant={formData.businessInfo.availability.includes(slot) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAvailabilityToggle(slot)}
                            className={`justify-start h-auto p-3 text-left text-sm ${
                              formData.businessInfo.availability.includes(slot)
                                ? "bg-gradient-to-r from-[var(--purple-glow)] to-[var(--cyan-glow)] text-white"
                                : ""
                            }`}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Verification */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Verification & Documents</h2>
                      <p className="text-[var(--mid-gray)]">Final step to complete your application.</p>
                    </div>

                    <div>
                      <Label className="text-white">Upload Documents</Label>
                      <p className="text-sm text-[var(--mid-gray)] mb-3">
                        Upload any relevant certifications, licenses, or portfolio images
                      </p>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-[var(--mid-gray)] mx-auto mb-4" />
                        <p className="text-white mb-2">Drop files here or click to upload</p>
                        <p className="text-sm text-[var(--mid-gray)]">
                          PDF, JPG, PNG up to 10MB each
                        </p>
                        <Button variant="outline" className="mt-4">
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreement"
                          checked={formData.verification.agreement}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              verification: { ...prev.verification, agreement: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="agreement" className="text-white">
                          I agree to the{" "}
                          <Link href="/provider-terms" className="text-[var(--cyan-glow)] hover:underline">
                            Provider Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-[var(--cyan-glow)] hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="backgroundCheck"
                          checked={formData.verification.backgroundCheck}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              verification: { ...prev.verification, backgroundCheck: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="backgroundCheck" className="text-white">
                          I consent to a background check verification
                        </Label>
                      </div>
                    </div>

                    <div className="bg-[var(--purple-glow)]/10 border border-[var(--purple-glow)]/20 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="w-6 h-6 text-[var(--cyan-glow)]" />
                        <h3 className="text-lg font-semibold text-white">Verification Process</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-[var(--mid-gray)]">
                        <li>• Identity verification (24-48 hours)</li>
                        <li>• Background check (2-3 business days)</li>
                        <li>• Document review (1-2 business days)</li>
                        <li>• Profile review and approval</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentStep === totalSteps - 1 ? (
                    <Button
                      onClick={handleSubmitApplication}
                      disabled={isSubmitting || !formData.verification.agreement || !formData.verification.backgroundCheck}
                      className="bg-gradient-to-r from-[var(--purple-glow)] to-[var(--cyan-glow)] text-white flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-[var(--purple-glow)] to-[var(--cyan-glow)] text-white flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] transition-all duration-500">
      <HeaderComponent />

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8 group hover:bg-white/10 transition-all duration-500">
              <div className="w-2 h-2 bg-[var(--cyan-glow)] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[var(--cyan-glow)]">
                Join 50K+ Successful Providers
              </span>
              <span className="material-icons text-[var(--cyan-glow)] text-sm animate-pulse">verified</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
              <span className="gradient-text">Grow Your Business</span>
              <br />
              <span className="gradient-text">Beyond Limits</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-[var(--mid-gray)] mb-12 max-w-4xl mx-auto leading-relaxed">
              Join the elite network of service providers who earn
              <span className="gradient-text font-semibold"> 40% more </span>
              with AI-powered client matching and premium tools.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {[
                { icon: DollarSign, stat: "$3,200", title: "Avg Monthly", gradient: "from-[var(--purple-glow)] to-[var(--magenta-glow)]" },
                { icon: Star, stat: "4.9★", title: "Provider Rating", gradient: "from-[var(--magenta-glow)] to-[var(--cyan-glow)]" },
                { icon: Shield, stat: "100%", title: "Protected", gradient: "from-[var(--cyan-glow)] to-[var(--purple-glow)]" },
                { icon: Brain, stat: "50%", title: "AI Growth", gradient: "from-[var(--purple-glow)] to-[var(--cyan-glow)]" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mx-auto mb-3 hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{item.stat}</div>
                  <div className="text-sm text-[var(--mid-gray)]">{item.title}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                onClick={handleStartApplication}
                className="relative bg-gradient-to-r from-[var(--purple-glow)] via-[var(--magenta-glow)] to-[var(--cyan-glow)] text-white rounded-2xl px-12 py-6 font-bold text-lg shadow-2xl hover:shadow-[var(--purple-glow)]/50 transition-all duration-500 btn-glow hover:scale-105"
              >
                <span className="material-icons mr-3">rocket_launch</span>
                Start Application
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl px-12 py-6 font-bold text-lg border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-500 hover:scale-105"
                onClick={() =>
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Play className="w-5 h-5 mr-3" />
                See How It Works
              </Button>
            </div>
          </div>
        </section>

        {/* Service Categories Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Choose Your Category</span>
              </h2>
              <p className="text-xl text-[var(--mid-gray)] max-w-3xl mx-auto">
                Find your perfect category and see potential earnings with real market data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCategories.map((category, index) => (
                <Card
                  key={index}
                  className="group glass border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl cursor-pointer card-glow"
                >
                  <CardContent className="p-8 relative z-10">
                    <div className="text-center">
                      <div className="text-4xl mb-4">{category.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-4">{category.name}</h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--mid-gray)]">Commission:</span>
                          <Badge className="bg-[var(--cyan-glow)]/20 text-[var(--cyan-glow)] border border-[var(--cyan-glow)]/20">
                            {category.commission}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--mid-gray)]">Demand:</span>
                          <span className="text-sm font-medium text-white">{category.demand}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--mid-gray)]">Avg. Earnings:</span>
                          <span className="text-lg font-bold gradient-text">{category.earnings}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeService(category.name);
                          }}
                          className={`flex-1 rounded-2xl transition-all ${
                            likedServices.has(category.name)
                              ? "bg-gradient-to-r from-[var(--magenta-glow)] to-[var(--purple-glow)] text-white border-transparent"
                              : "border-white/20 text-white hover:bg-white/10"
                          }`}
                        >
                          <Heart className={`w-4 h-4 mr-2 ${likedServices.has(category.name) ? "fill-current" : ""}`} />
                          {likedServices.has(category.name) ? "Liked" : "Like"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Shared!",
                              description: `${category.name} details shared`,
                            });
                          }}
                          className="rounded-2xl border-white/20 text-white hover:bg-white/10"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full rounded-2xl border-white/20 text-white hover:bg-white/10 transition-all"
                        onClick={handleStartApplication}
                      >
                        Apply Now
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">How to Get Started</span>
              </h2>
              <p className="text-xl text-[var(--mid-gray)] max-w-3xl mx-auto">
                Join thousands of successful providers in just a few simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "01", title: "Quick Application", description: "Complete our streamlined application in under 10 minutes", icon: FileText, timeframe: "5-10 minutes" },
                { number: "02", title: "Verification Process", description: "We verify your credentials and run background checks", icon: Shield, timeframe: "24-48 hours" },
                { number: "03", title: "Profile Optimization", description: "AI helps optimize your profile for maximum visibility", icon: Brain, timeframe: "15 minutes" },
                { number: "04", title: "Start Earning", description: "Get matched with quality clients and start growing", icon: TrendingUp, timeframe: "Immediately" },
              ].map((step, index) => (
                <Card
                  key={index}
                  className="group glass border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl card-glow"
                >
                  <CardContent className="p-8 relative z-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[var(--purple-glow)] to-[var(--cyan-glow)] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="text-3xl font-black gradient-text mb-3">{step.number}</div>

                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>

                    <p className="text-[var(--mid-gray)] mb-4 leading-relaxed">{step.description}</p>

                    <Badge className="bg-[var(--cyan-glow)]/20 text-[var(--cyan-glow)] border border-[var(--cyan-glow)]/20">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.timeframe}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--purple-glow)] via-[var(--magenta-glow)] to-[var(--cyan-glow)] rounded-3xl blur-2xl opacity-20" />
              <div className="relative glass rounded-3xl p-12 border border-white/10 shadow-2xl">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="gradient-text">Ready to Transform</span>
                  <br />
                  <span className="gradient-text">Your Business?</span>
                </h2>
                <p className="text-xl text-[var(--mid-gray)] mb-12 max-w-2xl mx-auto">
                  Join the elite network of providers who earn more, work smarter, and grow faster with Loconomy.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    size="lg"
                    onClick={handleStartApplication}
                    className="relative bg-gradient-to-r from-[var(--purple-glow)] via-[var(--magenta-glow)] to-[var(--cyan-glow)] text-white rounded-2xl px-12 py-6 font-bold text-lg shadow-2xl hover:shadow-[var(--purple-glow)]/50 transition-all duration-500 btn-glow hover:scale-105"
                  >
                    <Crown className="w-5 h-5 mr-3" />
                    Apply Now - It's Free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-2xl px-12 py-6 font-bold text-lg border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-500 hover:scale-105"
                    onClick={() => router.push("/provider-resources")}
                  >
                    <Eye className="w-5 h-5 mr-3" />
                    Learn More
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
