'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Star,
  Activity,
  Sparkles,
  Eye,
  Heart,
  Clock,
  Zap,
  Settings,
  UserCheck,
  BarChart3,
  Lightbulb,
  Filter,
  Shuffle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

interface UserProfile {
  id: string;
  preferences: {
    serviceTypes: string[];
    priceRange: [number, number];
    timePreferences: string[];
    locationRadius: number;
    communicationStyle: 'formal' | 'casual' | 'technical';
    urgencyLevel: 'low' | 'medium' | 'high';
    qualityVsPrice: number; // 0-100, 0=price focused, 100=quality focused
  };
  behaviorPatterns: {
    searchFrequency: number;
    bookingPatterns: string[];
    reviewStyle: string;
    responseTime: number;
    loyaltyScore: number;
    explorationVsExploitation: number; // 0-100, 0=stick to known, 100=try new
  };
  learningData: {
    interactions: number;
    adaptationScore: number;
    predictionAccuracy: number;
    lastUpdated: Date;
  };
}

interface AIInsight {
  id: string;
  type: 'preference' | 'behavior' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  impact: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface PersonalizationRule {
  id: string;
  trigger: string;
  condition: string;
  action: string;
  effectiveness: number;
  usage: number;
  status: 'active' | 'testing' | 'paused';
}

interface HyperPersonalizedAIProps {
  className?: string;
  userId?: string;
}

const MOCK_USER_PROFILE: UserProfile = {
  id: 'user_123',
  preferences: {
    serviceTypes: ['home_cleaning', 'landscaping', 'handyman'],
    priceRange: [50, 200],
    timePreferences: ['weekends', 'evenings'],
    locationRadius: 15,
    communicationStyle: 'casual',
    urgencyLevel: 'medium',
    qualityVsPrice: 75
  },
  behaviorPatterns: {
    searchFrequency: 8.5,
    bookingPatterns: ['recurring_monthly', 'emergency_booking'],
    reviewStyle: 'detailed_positive',
    responseTime: 12,
    loyaltyScore: 85,
    explorationVsExploitation: 30
  },
  learningData: {
    interactions: 847,
    adaptationScore: 92,
    predictionAccuracy: 88,
    lastUpdated: new Date()
  }
};

const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    type: 'prediction',
    title: 'Likely to Book This Weekend',
    description: 'Based on behavior patterns, user has 89% probability of booking a cleaning service in the next 48 hours',
    confidence: 89,
    actionable: true,
    impact: 'high',
    timestamp: new Date()
  },
  {
    id: '2',
    type: 'preference',
    title: 'Prefers Eco-Friendly Services',
    description: 'AI detected strong preference for environmentally conscious providers through click patterns and reviews',
    confidence: 94,
    actionable: true,
    impact: 'medium',
    timestamp: new Date()
  },
  {
    id: '3',
    type: 'behavior',
    title: 'Peak Activity: Thursday Evenings',
    description: 'User is most active on platform Thursday 6-8 PM, optimal time for notifications and recommendations',
    confidence: 96,
    actionable: true,
    impact: 'medium',
    timestamp: new Date()
  },
  {
    id: '4',
    type: 'recommendation',
    title: 'Suggest Premium Package',
    description: 'Quality-focused behavior suggests user would appreciate premium service offerings despite higher cost',
    confidence: 78,
    actionable: true,
    impact: 'high',
    timestamp: new Date()
  }
];

const MOCK_PERSONALIZATION_RULES: PersonalizationRule[] = [
  {
    id: '1',
    trigger: 'search_initiated',
    condition: 'time_preference = weekends AND urgency = medium',
    action: 'prioritize_weekend_availability',
    effectiveness: 85,
    usage: 156,
    status: 'active'
  },
  {
    id: '2',
    trigger: 'provider_viewed',
    condition: 'quality_vs_price > 70',
    action: 'highlight_premium_features',
    effectiveness: 78,
    usage: 89,
    status: 'active'
  },
  {
    id: '3',
    trigger: 'booking_hesitation',
    condition: 'loyalty_score > 80 AND exploration_score < 40',
    action: 'show_trusted_provider_badge',
    effectiveness: 92,
    usage: 234,
    status: 'active'
  }
];

export function HyperPersonalizedAI({ className = '', userId = 'user_123' }: HyperPersonalizedAIProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [insights, setInsights] = useState<AIInsight[]>(MOCK_AI_INSIGHTS);
  const [rules, setRules] = useState<PersonalizationRule[]>(MOCK_PERSONALIZATION_RULES);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLearning, setIsLearning] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    currentAction: 'browsing_providers',
    engagement: 78,
    satisfaction: 85,
    adaptationRate: 12
  });

  const learningInterval = useRef<NodeJS.Timeout>();

  // Simulate real-time learning and adaptation
  useEffect(() => {
    learningInterval.current = setInterval(() => {
      // Simulate user interaction and learning
      setUserProfile(prev => ({
        ...prev,
        learningData: {
          ...prev.learningData,
          interactions: prev.learningData.interactions + Math.floor(Math.random() * 3),
          adaptationScore: Math.min(100, prev.learningData.adaptationScore + (Math.random() - 0.3) * 2),
          predictionAccuracy: Math.min(100, prev.learningData.predictionAccuracy + (Math.random() - 0.4) * 1.5),
          lastUpdated: new Date()
        }
      }));

      // Update real-time metrics
      setRealTimeData(prev => ({
        currentAction: ['browsing_providers', 'reading_reviews', 'comparing_prices', 'viewing_profiles'][Math.floor(Math.random() * 4)],
        engagement: Math.max(0, Math.min(100, prev.engagement + (Math.random() - 0.5) * 10)),
        satisfaction: Math.max(0, Math.min(100, prev.satisfaction + (Math.random() - 0.4) * 5)),
        adaptationRate: Math.max(0, Math.min(50, prev.adaptationRate + (Math.random() - 0.5) * 5))
      }));

      // Occasionally generate new insights
      if (Math.random() < 0.1) {
        const newInsight: AIInsight = {
          id: Date.now().toString(),
          type: ['preference', 'behavior', 'prediction', 'recommendation'][Math.floor(Math.random() * 4)] as any,
          title: 'New Pattern Detected',
          description: 'AI has identified a new behavioral pattern that can improve personalization',
          confidence: 70 + Math.random() * 30,
          actionable: true,
          impact: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          timestamp: new Date()
        };
        setInsights(prev => [newInsight, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => {
      if (learningInterval.current) {
        clearInterval(learningInterval.current);
      }
    };
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'preference': return <Heart className="h-4 w-4" />;
      case 'behavior': return <Activity className="h-4 w-4" />;
      case 'prediction': return <Eye className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePreferenceUpdate = (key: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Status</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {userProfile.learningData.adaptationScore}%
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${isLearning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-xs text-muted-foreground">
                {isLearning ? 'Actively Learning' : 'Stable'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {userProfile.learningData.predictionAccuracy}%
            </div>
            <Progress value={userProfile.learningData.predictionAccuracy} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interactions</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userProfile.learningData.interactions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +{realTimeData.adaptationRate}/hour
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Insights</CardTitle>
            <Sparkles className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{insights.length}</div>
            <div className="flex gap-1 mt-2">
              {insights.slice(0, 4).map((insight, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${getImpactColor(insight.impact)}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Real-time AI Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">Current Action</span>
              <Badge variant="outline" className="capitalize">
                {realTimeData.currentAction.replace('_', ' ')}
              </Badge>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Engagement Score</span>
              <div className="flex items-center gap-2">
                <Progress value={realTimeData.engagement} className="flex-1" />
                <span className="text-sm">{Math.round(realTimeData.engagement)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Satisfaction</span>
              <div className="flex items-center gap-2">
                <Progress value={realTimeData.satisfaction} className="flex-1" />
                <span className="text-sm">{Math.round(realTimeData.satisfaction)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="rules">Personalization Rules</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="mt-2">
                    <Slider
                      value={userProfile.preferences.priceRange}
                      onValueChange={(value) => handlePreferenceUpdate('priceRange', value)}
                      max={500}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>${userProfile.preferences.priceRange[0]}</span>
                      <span>${userProfile.preferences.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Quality vs Price Focus</label>
                  <div className="mt-2">
                    <Slider
                      value={[userProfile.preferences.qualityVsPrice]}
                      onValueChange={(value) => handlePreferenceUpdate('qualityVsPrice', value[0])}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Price Focused</span>
                      <span>Quality Focused</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Service Types</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userProfile.preferences.serviceTypes.map((type, index) => (
                      <Badge key={index} variant="secondary">
                        {type.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Communication Style</label>
                  <div className="mt-2">
                    <Badge variant="outline" className="capitalize">
                      {userProfile.preferences.communicationStyle}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Behavior Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Search Frequency</span>
                  <Badge variant="outline">{userProfile.behaviorPatterns.searchFrequency}/week</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Time</span>
                  <Badge variant="outline">{userProfile.behaviorPatterns.responseTime} hours</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Loyalty Score</span>
                  <div className="flex items-center gap-2">
                    <Progress value={userProfile.behaviorPatterns.loyaltyScore} className="w-16" />
                    <span className="text-sm">{userProfile.behaviorPatterns.loyaltyScore}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Exploration vs Exploitation</span>
                  <div className="flex items-center gap-2">
                    <Progress value={userProfile.behaviorPatterns.explorationVsExploitation} className="w-16" />
                    <span className="text-sm">{userProfile.behaviorPatterns.explorationVsExploitation}%</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Booking Patterns</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userProfile.behaviorPatterns.bookingPatterns.map((pattern, index) => (
                      <Badge key={index} variant="secondary">
                        {pattern.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${getImpactColor(insight.impact)}`} />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      {insight.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{insight.confidence}% Confidence</Badge>
                      <Badge className={getImpactColor(insight.impact)}>{insight.impact}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {insight.timestamp.toLocaleString()}
                    </span>
                    {insight.actionable && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Apply
                        </Button>
                        <Button size="sm" variant="outline">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid gap-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">{rule.trigger.replace('_', ' ')}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                        {rule.status}
                      </Badge>
                      <Badge variant="outline">{rule.effectiveness}% Effective</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Condition:</span>
                    <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded mt-1">
                      {rule.condition}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Action:</span>
                    <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded mt-1">
                      {rule.action}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usage: {rule.usage} times</span>
                    <Progress value={rule.effectiveness} className="w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Learning Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Real-time Learning</h3>
                  <p className="text-sm text-muted-foreground">Allow AI to learn from user interactions in real-time</p>
                </div>
                <Button
                  variant={isLearning ? 'default' : 'outline'}
                  onClick={() => setIsLearning(!isLearning)}
                >
                  {isLearning ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Privacy Level</h3>
                <Slider
                  defaultValue={[75]}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Basic</span>
                  <span>Moderate</span>
                  <span>Full Personalization</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Learning Speed</h3>
                <Slider
                  defaultValue={[60]}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Aggressive</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Reset AI Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
