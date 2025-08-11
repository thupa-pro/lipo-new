"use client"

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// AI-Native Design System Components
import {
  AICard,
  GlassmorphicContainer,
  FuturisticMetrics,
  NeuralLoading,
  HolographicText
} from "@/components/admin/design-system";

import { 
  Search, Filter, MoreHorizontal, Mail, Phone, MapPin, Calendar,
  UserPlus, Users, Shield, Ban, Edit, Trash2, Eye, Star,
  TrendingUp, Activity, Clock, CheckCircle, AlertTriangle,
  Brain, Zap, Target, Sparkles, Bot, Settings, Download,
  RefreshCw, SortAsc, SortDesc, Grid, List, ChevronDown,
  ChevronRight, X, Plus, Minus, BarChart3, PieChart,
  Layers, Workflow, Network, Radar, Gauge, Lightbulb,
  ArrowUpRight, ArrowDownRight, MessageCircle, UserCheck,
  UserX, CreditCard, Gift, Award, Fingerprint, Lock,
  Globe, Smartphone, Monitor, Tablet, Headphones,
  ShoppingBag, Heart, Share2, Bookmark, Flag,
  ThumbsUp, ThumbsDown, Volume2, VolumeX, Camera,
  Video, FileText, Link, ExternalLink, Copy,
  Upload, CloudUpload, Database, Server, Cpu
} from "lucide-react";

import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  lastActive: string;
  status: "active" | "inactive" | "suspended" | "verified" | "pending";
  role: "customer" | "provider" | "admin" | "moderator";
  totalBookings: number;
  totalSpent: number;
  rating: number;
  avatar: string;
  devices: string[];
  preferences: any;
  aiScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  engagementLevel: 'low' | 'medium' | 'high' | 'exceptional';
  lifetimeValue: number;
  churnRisk: number;
  tags: string[];
  lastTransaction: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  complianceScore: number;
  activityMetrics: {
    sessionsThisWeek: number;
    avgSessionDuration: number;
    pageViews: number;
    conversionRate: number;
  };
}

interface AIRecommendation {
  id: string;
  userId: string;
  type: 'engagement' | 'retention' | 'upsell' | 'support' | 'security';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  suggestedAction: string;
  potentialImpact: string;
  category: string;
  data: any;
}

interface FilterState {
  search: string;
  status: string[];
  role: string[];
  riskLevel: string[];
  engagementLevel: string[];
  joinDateRange: [Date | null, Date | null];
  spendingRange: [number, number];
  ratingRange: [number, number];
  aiScoreRange: [number, number];
  tags: string[];
  verificationStatus: string[];
  devices: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function AdvancedUserManagement() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [aiInsightsEnabled, setAIInsightsEnabled] = useState(true);
  
  // User data and AI recommendations
  const [users, setUsers] = useState<User[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Advanced filtering state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    role: [],
    riskLevel: [],
    engagementLevel: [],
    joinDateRange: [null, null],
    spendingRange: [0, 10000],
    ratingRange: [1, 5],
    aiScoreRange: [0, 100],
    tags: [],
    verificationStatus: [],
    devices: [],
    sortBy: 'joinDate',
    sortOrder: 'desc'
  });

  // Initialize data
  useEffect(() => {
    initializeUserData();
    generateAIRecommendations();
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // Filter users whenever filters change
  useEffect(() => {
    applyFilters();
  }, [filters, users]);

  const initializeUserData = useCallback(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        joinDate: "2024-01-15",
        lastActive: "2 hours ago",
        status: "active",
        role: "customer",
        totalBookings: 12,
        totalSpent: 2450.00,
        rating: 4.8,
        avatar: "/avatars/sarah.jpg",
        devices: ["desktop", "mobile"],
        preferences: {},
        aiScore: 94,
        riskLevel: 'low',
        engagementLevel: 'high',
        lifetimeValue: 3200,
        churnRisk: 12,
        tags: ["premium", "loyal", "referrer"],
        lastTransaction: "2024-01-20",
        verificationStatus: 'verified',
        complianceScore: 98,
        activityMetrics: {
          sessionsThisWeek: 8,
          avgSessionDuration: 420,
          pageViews: 156,
          conversionRate: 23.5
        }
      },
      {
        id: "2",
        name: "Michael Chen",
        email: "michael.chen@example.com",
        phone: "(555) 234-5678",
        location: "New York, NY",
        joinDate: "2024-02-01",
        lastActive: "1 day ago",
        status: "active",
        role: "provider",
        totalBookings: 45,
        totalSpent: 0,
        rating: 4.9,
        avatar: "/avatars/michael.jpg",
        devices: ["mobile", "tablet"],
        preferences: {},
        aiScore: 87,
        riskLevel: 'low',
        engagementLevel: 'exceptional',
        lifetimeValue: 8900,
        churnRisk: 8,
        tags: ["top-rated", "consistent", "professional"],
        lastTransaction: "2024-01-19",
        verificationStatus: 'verified',
        complianceScore: 96,
        activityMetrics: {
          sessionsThisWeek: 12,
          avgSessionDuration: 680,
          pageViews: 234,
          conversionRate: 45.2
        }
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@example.com",
        phone: "(555) 345-6789",
        location: "Austin, TX",
        joinDate: "2024-01-28",
        lastActive: "3 days ago",
        status: "inactive",
        role: "customer",
        totalBookings: 3,
        totalSpent: 180.00,
        rating: 4.2,
        avatar: "/avatars/emily.jpg",
        devices: ["mobile"],
        preferences: {},
        aiScore: 65,
        riskLevel: 'medium',
        engagementLevel: 'low',
        lifetimeValue: 450,
        churnRisk: 67,
        tags: ["at-risk", "mobile-only"],
        lastTransaction: "2024-01-10",
        verificationStatus: 'pending',
        complianceScore: 88,
        activityMetrics: {
          sessionsThisWeek: 1,
          avgSessionDuration: 120,
          pageViews: 12,
          conversionRate: 8.3
        }
      },
      {
        id: "4",
        name: "David Park",
        email: "david.park@example.com",
        phone: "(555) 456-7890",
        location: "Seattle, WA",
        joinDate: "2023-12-01",
        lastActive: "5 minutes ago",
        status: "verified",
        role: "admin",
        totalBookings: 0,
        totalSpent: 0,
        rating: 5.0,
        avatar: "/avatars/david.jpg",
        devices: ["desktop", "mobile", "tablet"],
        preferences: {},
        aiScore: 99,
        riskLevel: 'low',
        engagementLevel: 'exceptional',
        lifetimeValue: 0,
        churnRisk: 2,
        tags: ["admin", "power-user", "multi-device"],
        lastTransaction: "N/A",
        verificationStatus: 'verified',
        complianceScore: 100,
        activityMetrics: {
          sessionsThisWeek: 25,
          avgSessionDuration: 1200,
          pageViews: 890,
          conversionRate: 0
        }
      },
      {
        id: "5",
        name: "Lisa Thompson",
        email: "lisa.thompson@example.com",
        phone: "(555) 567-8901",
        location: "Miami, FL",
        joinDate: "2024-01-05",
        lastActive: "1 week ago",
        status: "suspended",
        role: "customer",
        totalBookings: 7,
        totalSpent: 890.00,
        rating: 3.1,
        avatar: "/avatars/lisa.jpg",
        devices: ["desktop"],
        preferences: {},
        aiScore: 42,
        riskLevel: 'high',
        engagementLevel: 'low',
        lifetimeValue: 1200,
        churnRisk: 89,
        tags: ["suspended", "complaints", "refunds"],
        lastTransaction: "2024-01-08",
        verificationStatus: 'rejected',
        complianceScore: 45,
        activityMetrics: {
          sessionsThisWeek: 0,
          avgSessionDuration: 45,
          pageViews: 3,
          conversionRate: 2.1
        }
      }
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  const generateAIRecommendations = useCallback(() => {
    const recommendations: AIRecommendation[] = [
      {
        id: "1",
        userId: "3",
        type: 'retention',
        title: 'Re-engagement Campaign Recommended',
        description: 'User Emily Rodriguez shows declining engagement. AI suggests personalized re-engagement campaign.',
        confidence: 87,
        priority: 'high',
        suggestedAction: 'Send personalized offer with 15% discount',
        potentialImpact: '+32% retention probability',
        category: 'Retention',
        data: { churnRisk: 67, lastActive: '3 days ago' }
      },
      {
        id: "2",
        userId: "1",
        type: 'upsell',
        title: 'Premium Upgrade Opportunity',
        description: 'Sarah Johnson demonstrates high engagement and spending patterns ideal for premium upgrade.',
        confidence: 94,
        priority: 'medium',
        suggestedAction: 'Offer premium membership trial',
        potentialImpact: '+$180/month potential revenue',
        category: 'Upsell',
        data: { lifetimeValue: 3200, engagementScore: 94 }
      },
      {
        id: "3",
        userId: "5",
        type: 'security',
        title: 'Account Security Review Required',
        description: 'Lisa Thompson account flagged for suspicious activity patterns requiring manual review.',
        confidence: 96,
        priority: 'urgent',
        suggestedAction: 'Initiate security audit and identity verification',
        potentialImpact: 'Risk mitigation and compliance',
        category: 'Security',
        data: { complianceScore: 45, riskLevel: 'high' }
      },
      {
        id: "4",
        userId: "2",
        type: 'engagement',
        title: 'Provider Excellence Recognition',
        description: 'Michael Chen consistently exceeds performance metrics. Consider featuring as top provider.',
        confidence: 92,
        priority: 'low',
        suggestedAction: 'Feature in provider showcase',
        potentialImpact: '+15% platform trust score',
        category: 'Recognition',
        data: { rating: 4.9, consistency: 95 }
      }
    ];

    setAIRecommendations(recommendations);
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...users];

    // Text search
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.location.toLowerCase().includes(query) ||
        user.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(user => filters.status.includes(user.status));
    }

    // Role filter
    if (filters.role.length > 0) {
      filtered = filtered.filter(user => filters.role.includes(user.role));
    }

    // Risk level filter
    if (filters.riskLevel.length > 0) {
      filtered = filtered.filter(user => filters.riskLevel.includes(user.riskLevel));
    }

    // Engagement level filter
    if (filters.engagementLevel.length > 0) {
      filtered = filtered.filter(user => filters.engagementLevel.includes(user.engagementLevel));
    }

    // Spending range filter
    filtered = filtered.filter(user => 
      user.totalSpent >= filters.spendingRange[0] && 
      user.totalSpent <= filters.spendingRange[1]
    );

    // Rating range filter
    filtered = filtered.filter(user => 
      user.rating >= filters.ratingRange[0] && 
      user.rating <= filters.ratingRange[1]
    );

    // AI Score range filter
    filtered = filtered.filter(user => 
      user.aiScore >= filters.aiScoreRange[0] && 
      user.aiScore <= filters.aiScoreRange[1]
    );

    // Verification status filter
    if (filters.verificationStatus.length > 0) {
      filtered = filtered.filter(user => filters.verificationStatus.includes(user.verificationStatus));
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        case 'totalSpent':
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'aiScore':
          aValue = a.aiScore;
          bValue = b.aiScore;
          break;
        case 'lifetimeValue':
          aValue = a.lifetimeValue;
          bValue = b.lifetimeValue;
          break;
        default:
          aValue = a.joinDate;
          bValue = b.joinDate;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: [],
      role: [],
      riskLevel: [],
      engagementLevel: [],
      joinDateRange: [null, null],
      spendingRange: [0, 10000],
      ratingRange: [1, 5],
      aiScoreRange: [0, 100],
      tags: [],
      verificationStatus: [],
      devices: [],
      sortBy: 'joinDate',
      sortOrder: 'desc'
    });
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'verified': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <NeuralLoading
          variant="neural"
          size="lg"
          message="Loading User Intelligence..."
          showProgress={true}
          progress={90}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div 
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.3) 2px, transparent 0),
                radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.3) 1px, transparent 0),
                radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3) 1.5px, transparent 0)
              `,
              backgroundSize: '60px 60px, 90px 90px, 120px 120px'
            }}
            className="w-full h-full"
          />
        </div>

        {/* Animated neural patterns */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* AI-Enhanced Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GlassmorphicContainer variant="intense" className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  className="relative"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
                
                <div>
                  <HolographicText variant="primary" size="3xl" className="mb-2">
                    AI-Powered User Management
                  </HolographicText>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Users className="w-3 h-3 mr-1" />
                      {users.length} Total Users
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Brain className="w-3 h-3 mr-1" />
                      {aiRecommendations.length} AI Insights
                    </Badge>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      <Activity className="w-3 h-3 mr-1" />
                      {filteredUsers.length} Filtered Results
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="ai-insights" className="text-white/80 text-sm">AI Insights</Label>
                  <Switch
                    id="ai-insights"
                    checked={aiInsightsEnabled}
                    onCheckedChange={setAIInsightsEnabled}
                  />
                </div>
                
                <Button
                  variant={showFilters ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
                
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/20">
                  <Settings className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </GlassmorphicContainer>
        </motion.div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <GlassmorphicContainer variant="subtle" className="p-6">
                <div className="space-y-6">
                  
                  {/* Search and Quick Filters */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                      <Label className="text-white/80 text-sm mb-2 block">Search Users</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <Input
                          placeholder="Search by name, email, location, or tags..."
                          value={filters.search}
                          onChange={(e) => handleFilterChange('search', e.target.value)}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-white/80 text-sm mb-2 block">Sort By</Label>
                      <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                          <SelectItem value="joinDate">Join Date</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="totalSpent">Total Spent</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="aiScore">AI Score</SelectItem>
                          <SelectItem value="lifetimeValue">Lifetime Value</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-white/80 text-sm mb-2 block">Sort Order</Label>
                      <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                          <SelectItem value="desc">Descending</SelectItem>
                          <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Advanced Filter Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Status & Role Filters */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white/80 text-sm mb-3 block">Status</Label>
                        <div className="space-y-2">
                          {['active', 'inactive', 'suspended', 'verified', 'pending'].map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <Checkbox
                                id={`status-${status}`}
                                checked={filters.status.includes(status)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('status', [...filters.status, status]);
                                  } else {
                                    handleFilterChange('status', filters.status.filter(s => s !== status));
                                  }
                                }}
                              />
                              <Label htmlFor={`status-${status}`} className="text-white/70 capitalize text-sm">
                                {status}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-white/80 text-sm mb-3 block">Role</Label>
                        <div className="space-y-2">
                          {['customer', 'provider', 'admin', 'moderator'].map((role) => (
                            <div key={role} className="flex items-center space-x-2">
                              <Checkbox
                                id={`role-${role}`}
                                checked={filters.role.includes(role)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('role', [...filters.role, role]);
                                  } else {
                                    handleFilterChange('role', filters.role.filter(r => r !== role));
                                  }
                                }}
                              />
                              <Label htmlFor={`role-${role}`} className="text-white/70 capitalize text-sm">
                                {role}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Risk & Engagement Filters */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white/80 text-sm mb-3 block">Risk Level</Label>
                        <div className="space-y-2">
                          {['low', 'medium', 'high'].map((risk) => (
                            <div key={risk} className="flex items-center space-x-2">
                              <Checkbox
                                id={`risk-${risk}`}
                                checked={filters.riskLevel.includes(risk)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('riskLevel', [...filters.riskLevel, risk]);
                                  } else {
                                    handleFilterChange('riskLevel', filters.riskLevel.filter(r => r !== risk));
                                  }
                                }}
                              />
                              <Label htmlFor={`risk-${risk}`} className={`capitalize text-sm ${getRiskColor(risk)}`}>
                                {risk}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-white/80 text-sm mb-3 block">Engagement</Label>
                        <div className="space-y-2">
                          {['low', 'medium', 'high', 'exceptional'].map((engagement) => (
                            <div key={engagement} className="flex items-center space-x-2">
                              <Checkbox
                                id={`engagement-${engagement}`}
                                checked={filters.engagementLevel.includes(engagement)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('engagementLevel', [...filters.engagementLevel, engagement]);
                                  } else {
                                    handleFilterChange('engagementLevel', filters.engagementLevel.filter(e => e !== engagement));
                                  }
                                }}
                              />
                              <Label htmlFor={`engagement-${engagement}`} className="text-white/70 capitalize text-sm">
                                {engagement}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Range Filters */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white/80 text-sm mb-3 block">
                          Spending Range: ${filters.spendingRange[0]} - ${filters.spendingRange[1]}
                        </Label>
                        <Slider
                          value={filters.spendingRange}
                          onValueChange={(value) => handleFilterChange('spendingRange', value)}
                          max={10000}
                          min={0}
                          step={100}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="text-white/80 text-sm mb-3 block">
                          Rating Range: {filters.ratingRange[0]} - {filters.ratingRange[1]} stars
                        </Label>
                        <Slider
                          value={filters.ratingRange}
                          onValueChange={(value) => handleFilterChange('ratingRange', value)}
                          max={5}
                          min={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="text-white/80 text-sm mb-3 block">
                          AI Score Range: {filters.aiScoreRange[0]} - {filters.aiScoreRange[1]}
                        </Label>
                        <Slider
                          value={filters.aiScoreRange}
                          onValueChange={(value) => handleFilterChange('aiScoreRange', value)}
                          max={100}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-sm text-white/60">
                      Showing {filteredUsers.length} of {users.length} users
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export Results
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassmorphicContainer>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Actions Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassmorphicContainer variant="subtle" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {selectedUsers.length} selected
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedUsers.length === 0 ? (
                  <Button size="sm" onClick={selectAllUsers}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Select All
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                  </div>
                )}
                
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </GlassmorphicContainer>
        </motion.div>

        {/* AI Recommendations Panel */}
        {aiInsightsEnabled && aiRecommendations.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AICard
              title="AI Recommendations"
              subtitle="Intelligent user management insights"
              aiInsight="Processing user behavior patterns and engagement metrics"
              confidence={91}
              status="predicting"
              variant="holographic"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {aiRecommendations.map((recommendation, index) => (
                    <motion.div
                      key={recommendation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassmorphicContainer variant="subtle" className="p-4 group hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl ${
                            recommendation.type === 'engagement' ? 'bg-blue-500/20' :
                            recommendation.type === 'retention' ? 'bg-green-500/20' :
                            recommendation.type === 'upsell' ? 'bg-purple-500/20' :
                            recommendation.type === 'support' ? 'bg-yellow-500/20' :
                            'bg-red-500/20'
                          }`}>
                            {recommendation.type === 'engagement' && <Target className="w-4 h-4 text-blue-400" />}
                            {recommendation.type === 'retention' && <Heart className="w-4 h-4 text-green-400" />}
                            {recommendation.type === 'upsell' && <TrendingUp className="w-4 h-4 text-purple-400" />}
                            {recommendation.type === 'support' && <MessageCircle className="w-4 h-4 text-yellow-400" />}
                            {recommendation.type === 'security' && <Shield className="w-4 h-4 text-red-400" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white/90 text-sm group-hover:text-white transition-colors">
                                {recommendation.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${
                                  recommendation.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                                  recommendation.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                  recommendation.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {recommendation.priority.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-white/50">{recommendation.confidence}%</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-white/70 mb-3">
                              {recommendation.description}
                            </p>
                            
                            <div className="space-y-2">
                              <div className="text-xs text-white/60">
                                <span className="font-medium">Action:</span> {recommendation.suggestedAction}
                              </div>
                              <div className="text-xs text-white/60">
                                <span className="font-medium">Impact:</span> {recommendation.potentialImpact}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-white/50">{recommendation.category}</span>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white h-6 px-2 text-xs">
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </GlassmorphicContainer>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AICard>
          </motion.div>
        )}

        {/* Users Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AICard
                    title={user.name}
                    subtitle={user.role}
                    aiInsight={`AI Score: ${user.aiScore}`}
                    confidence={user.aiScore}
                    status={user.status as any}
                    variant={
                      user.role === 'customer' ? 'neural' :
                      user.role === 'provider' ? 'quantum' :
                      user.role === 'admin' ? 'holographic' :
                      'biometric'
                    }
                    interactive={true}
                    className="h-full cursor-pointer"
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-white/20">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {selectedUsers.includes(user.id) && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <MapPin className="w-4 h-4" />
                          {user.location}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(user.joinDate).toLocaleDateString()}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                          <div className="text-center">
                            <p className="text-lg font-bold text-white">${user.totalSpent.toLocaleString()}</p>
                            <p className="text-xs text-white/60">Total Spent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-white">{user.rating.toFixed(1)}</p>
                            <p className="text-xs text-white/60">Rating</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60">AI Score</span>
                            <span className="text-white/90">{user.aiScore}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${user.aiScore}%` }}
                              transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {user.tags.slice(0, 2).map((tag, tagIndex) => (
                              <Badge key={tagIndex} className="text-xs bg-white/10 text-white/70">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4 text-white/70" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4 text-white/70" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4 text-white/70" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AICard>
                </motion.div>
              ))}
            </div>
          ) : (
            <GlassmorphicContainer variant="default" className="overflow-hidden">
              <div className="p-6">
                <div className="space-y-1">
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                        <div>
                          <p className="font-medium text-white/90">{user.name}</p>
                          <p className="text-sm text-white/60">{user.email}</p>
                        </div>
                        
                        <div>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm text-white/90 capitalize">{user.role}</p>
                          <p className="text-xs text-white/60">{user.location}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-white/90">${user.totalSpent.toLocaleString()}</p>
                          <p className="text-xs text-white/60">Total Spent</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-white/90">{user.rating.toFixed(1)} ★</p>
                          <p className="text-xs text-white/60">Rating</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
                                style={{ width: `${user.aiScore}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-white/70">{user.aiScore}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4 text-white/70" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4 text-white/70" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-white/70" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassmorphicContainer>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <GlassmorphicContainer variant="subtle" className="p-12">
              <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <HolographicText variant="primary" size="xl" className="mb-2">
                No Users Found
              </HolographicText>
              <p className="text-white/60 mb-6">
                No users match your current filter criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={clearFilters} className="bg-purple-600 hover:bg-purple-700">
                Clear All Filters
              </Button>
            </GlassmorphicContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
