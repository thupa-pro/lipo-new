"use client"

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// AI-Native Design System Components
import {
  AICard,
  GlassmorphicContainer,
  FuturisticMetrics,
  NeuralLoading,
  HolographicText
} from "@/components/admin/design-system";

import {
  Settings, Brain, Zap, Shield, Globe, Database, Server,
  Cpu, Monitor, Smartphone, Palette, Lock, Key, Eye,
  EyeOff, Bell, Mail, MessageCircle, Webhook, GitBranch,
  Cloud, HardDrive, Network, Wifi, Bluetooth, USB,
  Gauge, BarChart3, PieChart, Activity, TrendingUp,
  Target, Sparkles, Bot, Lightbulb, Radar, Layers,
  Workflow, Atom, Orbit, Triangle, Hexagon, Circle,
  CheckCircle, AlertTriangle, Info, RefreshCw, Download,
  Upload, Save, RotateCcw, Play, Pause, Square,
  Settings2, Sliders, MoreHorizontal, Plus, Minus,
  X, ChevronDown, ChevronRight, Search, Filter,
  Copy, ExternalLink, Share2, Bookmark, Flag,
  Clock, Calendar, Timer, Stopwatch, AlarmClock,
  Volume2, VolumeX, Mic, MicOff, Camera, Video,
  FileText, File, Folder, Archive, Trash2, Edit3,
  Move, Resize, RotateCw, FlipHorizontal, FlipVertical,
  Maximize2, Minimize2, CornerDownRight, CornerUpLeft
} from "lucide-react";

import { useToast } from "@/components/ui/use-toast";

interface SettingCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  settings: Setting[];
}

interface Setting {
  id: string;
  name: string;
  description: string;
  type: 'toggle' | 'slider' | 'select' | 'input' | 'textarea' | 'color' | 'file';
  value: any;
  defaultValue: any;
  options?: string[] | { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  validation?: (value: any) => boolean;
  aiRecommendation?: {
    suggested: any;
    reason: string;
    confidence: number;
    impact: 'low' | 'medium' | 'high' | 'critical';
  };
  dependsOn?: string[];
  category: string;
  tags: string[];
  isAdvanced?: boolean;
  requiresRestart?: boolean;
  securityLevel?: 'low' | 'medium' | 'high' | 'critical';
}

interface AIConfigRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  recommendations: {
    settingId: string;
    currentValue: any;
    suggestedValue: any;
    reason: string;
    impact: string;
    confidence: number;
  }[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedBenefit: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function IntelligentSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiAssistanceEnabled, setAIAssistanceEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Settings data
  const [settingCategories, setSettingCategories] = useState<SettingCategory[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<AIConfigRecommendation[]>([]);
  const [settingsHistory, setSettingsHistory] = useState<any[]>([]);
  
  useEffect(() => {
    initializeSettings();
    generateAIRecommendations();
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const initializeSettings = useCallback(() => {
    const categories: SettingCategory[] = [
      {
        id: "general",
        name: "General",
        description: "Core platform settings and preferences",
        icon: Settings,
        settings: [
          {
            id: "platform_name",
            name: "Platform Name",
            description: "The display name for your platform",
            type: "input",
            value: "Loconomy",
            defaultValue: "Loconomy",
            category: "general",
            tags: ["branding", "identity"],
            aiRecommendation: {
              suggested: "Loconomy AI",
              reason: "Adding 'AI' to the name emphasizes your intelligent features and modern approach",
              confidence: 78,
              impact: "medium"
            }
          },
          {
            id: "maintenance_mode",
            name: "Maintenance Mode",
            description: "Enable maintenance mode to prevent user access during updates",
            type: "toggle",
            value: false,
            defaultValue: false,
            category: "general",
            tags: ["maintenance", "availability"],
            requiresRestart: true,
            securityLevel: "high"
          },
          {
            id: "debug_mode",
            name: "Debug Mode",
            description: "Enable detailed logging and debugging information",
            type: "toggle",
            value: false,
            defaultValue: false,
            category: "general",
            tags: ["development", "debugging"],
            isAdvanced: true,
            securityLevel: "medium"
          },
          {
            id: "default_language",
            name: "Default Language",
            description: "Default language for new users and public content",
            type: "select",
            value: "en",
            defaultValue: "en",
            options: [
              { label: "English", value: "en" },
              { label: "Spanish", value: "es" },
              { label: "French", value: "fr" },
              { label: "German", value: "de" },
              { label: "Portuguese", value: "pt" },
              { label: "Chinese", value: "zh" },
              { label: "Japanese", value: "ja" }
            ],
            category: "general",
            tags: ["localization", "language"]
          },
          {
            id: "timezone",
            name: "Default Timezone",
            description: "Default timezone for scheduling and timestamps",
            type: "select",
            value: "UTC",
            defaultValue: "UTC",
            options: [
              { label: "UTC", value: "UTC" },
              { label: "US/Eastern", value: "US/Eastern" },
              { label: "US/Pacific", value: "US/Pacific" },
              { label: "Europe/London", value: "Europe/London" },
              { label: "Europe/Paris", value: "Europe/Paris" },
              { label: "Asia/Tokyo", value: "Asia/Tokyo" },
              { label: "Australia/Sydney", value: "Australia/Sydney" }
            ],
            category: "general",
            tags: ["timezone", "scheduling"]
          }
        ]
      },
      {
        id: "ai",
        name: "AI & Machine Learning",
        description: "Artificial intelligence and automation settings",
        icon: Brain,
        settings: [
          {
            id: "ai_matching_enabled",
            name: "AI-Powered Matching",
            description: "Use machine learning to match users with service providers",
            type: "toggle",
            value: true,
            defaultValue: true,
            category: "ai",
            tags: ["matching", "ml", "automation"],
            aiRecommendation: {
              suggested: true,
              reason: "AI matching improves user satisfaction by 34% and reduces search time by 67%",
              confidence: 96,
              impact: "high"
            }
          },
          {
            id: "ai_confidence_threshold",
            name: "AI Confidence Threshold",
            description: "Minimum confidence level required for AI recommendations",
            type: "slider",
            value: 85,
            defaultValue: 80,
            min: 50,
            max: 99,
            step: 1,
            category: "ai",
            tags: ["confidence", "threshold", "quality"],
            isAdvanced: true
          },
          {
            id: "predictive_analytics",
            name: "Predictive Analytics",
            description: "Enable advanced forecasting and trend prediction",
            type: "toggle",
            value: true,
            defaultValue: false,
            category: "ai",
            tags: ["analytics", "prediction", "forecasting"],
            aiRecommendation: {
              suggested: true,
              reason: "Predictive analytics can help prevent 23% of user churn and identify growth opportunities",
              confidence: 89,
              impact: "high"
            }
          },
          {
            id: "auto_moderation",
            name: "AI Content Moderation",
            description: "Automatically moderate user-generated content using AI",
            type: "toggle",
            value: true,
            defaultValue: true,
            category: "ai",
            tags: ["moderation", "content", "safety"]
          },
          {
            id: "ai_model_update_frequency",
            name: "Model Update Frequency",
            description: "How often AI models are retrained with new data",
            type: "select",
            value: "weekly",
            defaultValue: "weekly",
            options: [
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
              { label: "Manual", value: "manual" }
            ],
            category: "ai",
            tags: ["training", "frequency", "optimization"],
            isAdvanced: true
          }
        ]
      },
      {
        id: "security",
        name: "Security & Privacy",
        description: "Security protocols and privacy controls",
        icon: Shield,
        settings: [
          {
            id: "two_factor_required",
            name: "Require 2FA for Admins",
            description: "Force two-factor authentication for all admin accounts",
            type: "toggle",
            value: true,
            defaultValue: false,
            category: "security",
            tags: ["2fa", "authentication", "admin"],
            securityLevel: "critical",
            aiRecommendation: {
              suggested: true,
              reason: "2FA reduces account compromise risk by 99.9% and is essential for admin security",
              confidence: 99,
              impact: "critical"
            }
          },
          {
            id: "session_timeout",
            name: "Session Timeout (minutes)",
            description: "Automatically log out inactive users after this time",
            type: "slider",
            value: 60,
            defaultValue: 120,
            min: 15,
            max: 480,
            step: 15,
            category: "security",
            tags: ["session", "timeout", "security"]
          },
          {
            id: "password_policy",
            name: "Password Strength Requirements",
            description: "Minimum password complexity requirements",
            type: "select",
            value: "strong",
            defaultValue: "medium",
            options: [
              { label: "Basic (8+ characters)", value: "basic" },
              { label: "Medium (8+ chars, mixed case)", value: "medium" },
              { label: "Strong (12+ chars, mixed case, numbers, symbols)", value: "strong" },
              { label: "Maximum (16+ chars, all requirements)", value: "maximum" }
            ],
            category: "security",
            tags: ["password", "policy", "strength"],
            securityLevel: "high"
          },
          {
            id: "api_rate_limit",
            name: "API Rate Limit (requests/minute)",
            description: "Maximum API requests per minute per IP address",
            type: "slider",
            value: 1000,
            defaultValue: 500,
            min: 100,
            max: 5000,
            step: 100,
            category: "security",
            tags: ["api", "rate-limit", "ddos"],
            isAdvanced: true
          },
          {
            id: "data_encryption",
            name: "Enhanced Data Encryption",
            description: "Use AES-256 encryption for sensitive data at rest",
            type: "toggle",
            value: true,
            defaultValue: true,
            category: "security",
            tags: ["encryption", "data", "aes"],
            securityLevel: "critical",
            requiresRestart: true
          },
          {
            id: "audit_logging",
            name: "Comprehensive Audit Logging",
            description: "Log all admin actions and security events",
            type: "toggle",
            value: true,
            defaultValue: true,
            category: "security",
            tags: ["audit", "logging", "compliance"],
            securityLevel: "high"
          }
        ]
      },
      {
        id: "performance",
        name: "Performance & Optimization",
        description: "System performance and optimization settings",
        icon: Zap,
        settings: [
          {
            id: "cache_enabled",
            name: "Enable Caching",
            description: "Cache frequently accessed data to improve performance",
            type: "toggle",
            value: true,
            defaultValue: true,
            category: "performance",
            tags: ["cache", "performance", "speed"]
          },
          {
            id: "cache_ttl",
            name: "Cache TTL (seconds)",
            description: "How long to keep cached data before refreshing",
            type: "slider",
            value: 3600,
            defaultValue: 1800,
            min: 300,
            max: 86400,
            step: 300,
            category: "performance",
            tags: ["cache", "ttl", "expiration"],
            dependsOn: ["cache_enabled"],
            isAdvanced: true
          },
          {
            id: "image_optimization",
            name: "Automatic Image Optimization",
            description: "Automatically optimize and compress uploaded images",
            type: "toggle",
            value: true,
            defaultValue: false,
            category: "performance",
            tags: ["images", "optimization", "compression"],
            aiRecommendation: {
              suggested: true,
              reason: "Image optimization can reduce load times by 40% and save 60% bandwidth",
              confidence: 92,
              impact: "high"
            }
          },
          {
            id: "cdn_enabled",
            name: "Enable CDN",
            description: "Use Content Delivery Network for faster global access",
            type: "toggle",
            value: true,
            defaultValue: false,
            category: "performance",
            tags: ["cdn", "global", "speed"]
          },
          {
            id: "lazy_loading",
            name: "Lazy Loading",
            description: "Load images and content only when needed",
            type: "toggle",
            value: true,
            defaultValue: true,
            category: "performance",
            tags: ["lazy", "loading", "optimization"]
          },
          {
            id: "compression_level",
            name: "Response Compression Level",
            description: "Level of gzip compression for API responses",
            type: "select",
            value: "6",
            defaultValue: "6",
            options: [
              { label: "None (0)", value: "0" },
              { label: "Fast (1)", value: "1" },
              { label: "Balanced (6)", value: "6" },
              { label: "Best (9)", value: "9" }
            ],
            category: "performance",
            tags: ["compression", "gzip", "bandwidth"],
            isAdvanced: true
          }
        ]
      },
      {
        id: "notifications",
        name: "Notifications & Communication",
        description: "Email, SMS, and push notification settings",
        icon: Bell,
        settings: [
          {
            id: "email_notifications",
            name: "Email Notifications",
            description: "Send email notifications for important events",
            type: "toggle",
            value: true,
            defaultValue: true,
            category: "notifications",
            tags: ["email", "notifications", "communication"]
          },
          {
            id: "sms_notifications",
            name: "SMS Notifications",
            description: "Send SMS notifications for urgent events",
            type: "toggle",
            value: false,
            defaultValue: false,
            category: "notifications",
            tags: ["sms", "notifications", "urgent"]
          },
          {
            id: "push_notifications",
            name: "Push Notifications",
            description: "Send push notifications to mobile apps",
            type: "toggle",
            value: true,
            defaultValue: true,
            category: "notifications",
            tags: ["push", "mobile", "notifications"]
          },
          {
            id: "notification_frequency",
            name: "Notification Frequency",
            description: "How often to send digest notifications",
            type: "select",
            value: "daily",
            defaultValue: "daily",
            options: [
              { label: "Real-time", value: "realtime" },
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" }
            ],
            category: "notifications",
            tags: ["frequency", "digest", "timing"]
          },
          {
            id: "email_templates",
            name: "Custom Email Templates",
            description: "Use custom branded email templates",
            type: "toggle",
            value: true,
            defaultValue: false,
            category: "notifications",
            tags: ["email", "templates", "branding"]
          },
          {
            id: "webhook_endpoints",
            name: "Webhook Endpoints",
            description: "URLs to send event notifications to external systems",
            type: "textarea",
            value: "",
            defaultValue: "",
            category: "notifications",
            tags: ["webhook", "integration", "api"],
            isAdvanced: true
          }
        ]
      },
      {
        id: "integrations",
        name: "Integrations & APIs",
        description: "Third-party integrations and API configuration",
        icon: GitBranch,
        settings: [
          {
            id: "stripe_enabled",
            name: "Stripe Integration",
            description: "Enable Stripe for payment processing",
            type: "toggle",
            value: true,
            defaultValue: false,
            category: "integrations",
            tags: ["stripe", "payment", "billing"]
          },
          {
            id: "google_maps_enabled",
            name: "Google Maps Integration",
            description: "Enable Google Maps for location services",
            type: "toggle",
            value: true,
            defaultValue: false,
            category: "integrations",
            tags: ["google", "maps", "location"]
          },
          {
            id: "analytics_provider",
            name: "Analytics Provider",
            description: "Choose your analytics platform",
            type: "select",
            value: "google",
            defaultValue: "none",
            options: [
              { label: "None", value: "none" },
              { label: "Google Analytics", value: "google" },
              { label: "Mixpanel", value: "mixpanel" },
              { label: "Amplitude", value: "amplitude" },
              { label: "PostHog", value: "posthog" }
            ],
            category: "integrations",
            tags: ["analytics", "tracking", "metrics"]
          },
          {
            id: "sentry_enabled",
            name: "Sentry Error Tracking",
            description: "Enable Sentry for error monitoring and performance tracking",
            type: "toggle",
            value: true,
            defaultValue: false,
            category: "integrations",
            tags: ["sentry", "errors", "monitoring"],
            aiRecommendation: {
              suggested: true,
              reason: "Error tracking helps identify and fix issues 5x faster, improving user experience",
              confidence: 94,
              impact: "high"
            }
          },
          {
            id: "api_versioning",
            name: "API Versioning Strategy",
            description: "How to handle API version compatibility",
            type: "select",
            value: "header",
            defaultValue: "header",
            options: [
              { label: "URL Path (/v1/)", value: "path" },
              { label: "Header (Accept-Version)", value: "header" },
              { label: "Query Parameter (?version=1)", value: "query" }
            ],
            category: "integrations",
            tags: ["api", "versioning", "compatibility"],
            isAdvanced: true
          }
        ]
      }
    ];

    setSettingCategories(categories);
  }, []);

  const generateAIRecommendations = useCallback(() => {
    const recommendations: AIConfigRecommendation[] = [
      {
        id: "security-enhancement",
        category: "Security",
        title: "Enhanced Security Configuration",
        description: "AI analysis suggests improving security settings to protect against emerging threats.",
        recommendations: [
          {
            settingId: "two_factor_required",
            currentValue: false,
            suggestedValue: true,
            reason: "Admin accounts without 2FA are 300x more vulnerable to compromise",
            impact: "Reduces security risk by 99.9%",
            confidence: 99
          },
          {
            settingId: "session_timeout",
            currentValue: 120,
            suggestedValue: 60,
            reason: "Shorter session timeouts reduce risk of unauthorized access",
            impact: "Improves security with minimal user impact",
            confidence: 85
          }
        ],
        priority: "urgent",
        estimatedBenefit: "Critical security improvement",
        riskLevel: "low"
      },
      {
        id: "performance-optimization",
        category: "Performance",
        title: "Performance Optimization Suite",
        description: "Optimize system performance based on usage patterns and resource analysis.",
        recommendations: [
          {
            settingId: "image_optimization",
            currentValue: false,
            suggestedValue: true,
            reason: "Images account for 65% of page load time",
            impact: "40% faster load times, 60% bandwidth savings",
            confidence: 92
          },
          {
            settingId: "cache_ttl",
            currentValue: 1800,
            suggestedValue: 3600,
            reason: "Longer cache TTL for static resources improves performance",
            impact: "25% reduction in server load",
            confidence: 88
          }
        ],
        priority: "high",
        estimatedBenefit: "Improved user experience and reduced costs",
        riskLevel: "low"
      },
      {
        id: "ai-enablement",
        category: "AI & ML",
        title: "AI Feature Activation",
        description: "Enable advanced AI features to improve platform intelligence and automation.",
        recommendations: [
          {
            settingId: "predictive_analytics",
            currentValue: false,
            suggestedValue: true,
            reason: "Predictive analytics prevents 23% of churn and identifies growth opportunities",
            impact: "15-20% improvement in user retention",
            confidence: 89
          },
          {
            settingId: "ai_confidence_threshold",
            currentValue: 80,
            suggestedValue: 85,
            reason: "Higher threshold improves recommendation quality",
            impact: "Better user satisfaction with AI suggestions",
            confidence: 82
          }
        ],
        priority: "medium",
        estimatedBenefit: "Enhanced platform intelligence",
        riskLevel: "low"
      }
    ];

    setAIRecommendations(recommendations);
  }, []);

  const updateSetting = useCallback((categoryId: string, settingId: string, newValue: any) => {
    setSettingCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          settings: category.settings.map(setting => {
            if (setting.id === settingId) {
              return { ...setting, value: newValue };
            }
            return setting;
          })
        };
      }
      return category;
    }));
    
    setHasUnsavedChanges(true);
  }, []);

  const applyAIRecommendation = useCallback((recommendationId: string) => {
    const recommendation = aiRecommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    recommendation.recommendations.forEach(rec => {
      // Find the setting and update it
      settingCategories.forEach(category => {
        const setting = category.settings.find(s => s.id === rec.settingId);
        if (setting) {
          updateSetting(category.id, rec.settingId, rec.suggestedValue);
        }
      });
    });

    toast({
      title: "AI Recommendations Applied",
      description: `Applied ${recommendation.recommendations.length} configuration changes.`,
    });
  }, [aiRecommendations, settingCategories, updateSetting, toast]);

  const saveSettings = useCallback(() => {
    // Simulate saving settings
    setHasUnsavedChanges(false);
    toast({
      title: "Settings Saved",
      description: "All configuration changes have been saved successfully.",
    });
  }, [toast]);

  const resetToDefaults = useCallback(() => {
    setSettingCategories(prev => prev.map(category => ({
      ...category,
      settings: category.settings.map(setting => ({
        ...setting,
        value: setting.defaultValue
      }))
    })));
    
    setHasUnsavedChanges(true);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values.",
    });
  }, [toast]);

  const exportSettings = useCallback(() => {
    const settingsData = {};
    settingCategories.forEach(category => {
      category.settings.forEach(setting => {
        settingsData[setting.id] = setting.value;
      });
    });
    
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `loconomy-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Settings Exported",
      description: "Configuration has been exported successfully.",
    });
  }, [settingCategories, toast]);

  const filteredCategories = settingCategories.map(category => ({
    ...category,
    settings: category.settings.filter(setting => {
      if (!showAdvanced && setting.isAdvanced) return false;
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        setting.name.toLowerCase().includes(query) ||
        setting.description.toLowerCase().includes(query) ||
        setting.tags.some(tag => tag.toLowerCase().includes(query))
      );
    })
  })).filter(category => category.settings.length > 0);

  const renderSettingControl = (category: SettingCategory, setting: Setting) => {
    const isDisabled = setting.dependsOn?.some(dep => {
      const depSetting = category.settings.find(s => s.id === dep);
      return depSetting && !depSetting.value;
    });

    switch (setting.type) {
      case 'toggle':
        return (
          <Switch
            checked={setting.value}
            onCheckedChange={(checked) => updateSetting(category.id, setting.id, checked)}
            disabled={isDisabled}
          />
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">{setting.min}</span>
              <span className="text-sm text-white/90 font-medium">{setting.value}</span>
              <span className="text-sm text-white/60">{setting.max}</span>
            </div>
            <Slider
              value={[setting.value]}
              onValueChange={([value]) => updateSetting(category.id, setting.id, value)}
              min={setting.min}
              max={setting.max}
              step={setting.step}
              disabled={isDisabled}
              className="w-full"
            />
          </div>
        );

      case 'select':
        return (
          <Select
            value={setting.value}
            onValueChange={(value) => updateSetting(category.id, setting.id, value)}
            disabled={isDisabled}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
              {setting.options?.map((option) => (
                <SelectItem 
                  key={typeof option === 'string' ? option : option.value} 
                  value={typeof option === 'string' ? option : option.value}
                  className="text-white"
                >
                  {typeof option === 'string' ? option : option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'input':
        return (
          <Input
            value={setting.value}
            onChange={(e) => updateSetting(category.id, setting.id, e.target.value)}
            disabled={isDisabled}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={setting.value}
            onChange={(e) => updateSetting(category.id, setting.id, e.target.value)}
            disabled={isDisabled}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
            placeholder="Enter configuration values..."
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <NeuralLoading
          variant="neural"
          size="lg"
          message="Loading Intelligent Configuration..."
          showProgress={true}
          progress={95}
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
                radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.2) 2px, transparent 0),
                radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.2) 1px, transparent 0),
                radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 1.5px, transparent 0)
              `,
              backgroundSize: '50px 50px, 75px 75px, 100px 100px'
            }}
            className="w-full h-full"
          />
        </div>

        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 12,
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
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
                
                <div>
                  <HolographicText variant="primary" size="3xl" className="mb-2">
                    Intelligent Configuration
                  </HolographicText>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Settings className="w-3 h-3 mr-1" />
                      {settingCategories.reduce((acc, cat) => acc + cat.settings.length, 0)} Settings
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Brain className="w-3 h-3 mr-1" />
                      {aiRecommendations.length} AI Recommendations
                    </Badge>
                    {hasUnsavedChanges && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Unsaved Changes
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="ai-assistance" className="text-white/80 text-sm">AI Assistance</Label>
                  <Switch
                    id="ai-assistance"
                    checked={aiAssistanceEnabled}
                    onCheckedChange={setAIAssistanceEnabled}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-advanced" className="text-white/80 text-sm">Advanced</Label>
                  <Switch
                    id="show-advanced"
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                  />
                </div>
                
                {hasUnsavedChanges && (
                  <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
                
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/20">
                  <MoreHorizontal className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </GlassmorphicContainer>
        </motion.div>

        {/* Search and Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassmorphicContainer variant="subtle" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={exportSettings}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={resetToDefaults}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </GlassmorphicContainer>
        </motion.div>

        {/* AI Recommendations Panel */}
        {aiAssistanceEnabled && aiRecommendations.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AICard
              title="AI Configuration Recommendations"
              subtitle="Intelligent optimization suggestions"
              aiInsight="Analyzing system performance and security patterns"
              confidence={93}
              status="predicting"
              variant="holographic"
            >
              <div className="p-6">
                <div className="space-y-4">
                  {aiRecommendations.map((recommendation, index) => (
                    <motion.div
                      key={recommendation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassmorphicContainer variant="subtle" className="p-4 group hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-xl ${
                            recommendation.priority === 'urgent' ? 'bg-red-500/20' :
                            recommendation.priority === 'high' ? 'bg-orange-500/20' :
                            recommendation.priority === 'medium' ? 'bg-yellow-500/20' :
                            'bg-green-500/20'
                          }`}>
                            <Lightbulb className={`w-4 h-4 ${
                              recommendation.priority === 'urgent' ? 'text-red-400' :
                              recommendation.priority === 'high' ? 'text-orange-400' :
                              recommendation.priority === 'medium' ? 'text-yellow-400' :
                              'text-green-400'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white/90 group-hover:text-white transition-colors">
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
                                <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                  {recommendation.category}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-white/70 mb-3">
                              {recommendation.description}
                            </p>
                            
                            <div className="space-y-2 mb-4">
                              {recommendation.recommendations.map((rec, recIndex) => (
                                <div key={recIndex} className="text-xs text-white/60 bg-white/5 rounded-lg p-2">
                                  <div className="font-medium text-white/80 mb-1">{rec.reason}</div>
                                  <div className="text-white/60">{rec.impact} (Confidence: {rec.confidence}%)</div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-white/50">
                                <span className="font-medium">Benefit:</span> {recommendation.estimatedBenefit}
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700 text-white h-6 px-3 text-xs"
                                onClick={() => applyAIRecommendation(recommendation.id)}
                              >
                                Apply All
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

        {/* Settings Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <GlassmorphicContainer variant="subtle" className="p-1 mb-6">
              <TabsList className="grid w-full grid-cols-6 bg-transparent h-12">
                {filteredCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </GlassmorphicContainer>

            {filteredCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <GlassmorphicContainer variant="default" className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white/90 mb-2">{category.name}</h2>
                    <p className="text-white/60">{category.description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    {category.settings.map((setting, index) => (
                      <motion.div
                        key={setting.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                      >
                        <GlassmorphicContainer variant="subtle" className="p-4 hover:bg-white/10 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-white/90 group-hover:text-white transition-colors">
                                  {setting.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {setting.isAdvanced && (
                                    <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                                      Advanced
                                    </Badge>
                                  )}
                                  {setting.requiresRestart && (
                                    <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                                      Restart Required
                                    </Badge>
                                  )}
                                  {setting.securityLevel && (
                                    <Badge className={`text-xs ${
                                      setting.securityLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                                      setting.securityLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                      setting.securityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-green-500/20 text-green-400'
                                    }`}>
                                      {setting.securityLevel} Security
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-sm text-white/70 mb-3">
                                {setting.description}
                              </p>
                              
                              {/* AI Recommendation */}
                              {aiAssistanceEnabled && setting.aiRecommendation && (
                                <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <Brain className="w-4 h-4 text-purple-400 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="text-xs font-medium text-purple-400 mb-1">
                                        AI Recommendation (Confidence: {setting.aiRecommendation.confidence}%)
                                      </div>
                                      <div className="text-xs text-white/80 mb-2">
                                        {setting.aiRecommendation.reason}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          className="bg-purple-600 hover:bg-purple-700 text-white h-6 px-2 text-xs"
                                          onClick={() => updateSetting(category.id, setting.id, setting.aiRecommendation.suggested)}
                                        >
                                          Apply Suggestion
                                        </Button>
                                        <span className="text-xs text-white/60">
                                          Suggested: {String(setting.aiRecommendation.suggested)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {setting.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} className="text-xs bg-white/5 text-white/60">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="w-72">
                              {renderSettingControl(category, setting)}
                            </div>
                          </div>
                        </GlassmorphicContainer>
                      </motion.div>
                    ))}
                  </div>
                </GlassmorphicContainer>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
