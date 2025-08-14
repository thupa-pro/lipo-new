'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Users,
  Star,
  Activity,
  Sparkles,
  Globe,
  Eye,
  BarChart3,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface UserBehavior {
  id: string;
  userId: string;
  action: string;
  category: string;
  timestamp: Date;
  context: Record<string, any>;
  impact: number;
}

interface UniverseInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  data: any[];
}

interface AdaptationRule {
  id: string;
  trigger: string;
  condition: string;
  action: string;
  priority: number;
  effectiveness: number;
  status: 'active' | 'testing' | 'paused';
}

interface DynamicUniverseEngineProps {
  className?: string;
}

const MOCK_BEHAVIORS: UserBehavior[] = [
  {
    id: '1',
    userId: 'user1',
    action: 'service_search',
    category: 'home_cleaning',
    timestamp: new Date(),
    context: { location: 'urban', time: 'morning', budget: 'medium' },
    impact: 0.8
  },
  {
    id: '2',
    userId: 'user2',
    action: 'provider_contact',
    category: 'landscaping',
    timestamp: new Date(),
    context: { urgency: 'high', property_size: 'large' },
    impact: 0.9
  },
  {
    id: '3',
    userId: 'user3',
    action: 'booking_complete',
    category: 'pet_care',
    timestamp: new Date(),
    context: { recurring: true, rating_given: 5 },
    impact: 1.0
  }
];

const MOCK_INSIGHTS: UniverseInsight[] = [
  {
    id: '1',
    type: 'trend',
    title: 'Surge in Evening Service Requests',
    description: 'AI detected 340% increase in service requests between 6-9 PM, suggesting optimal provider scheduling opportunity',
    confidence: 92,
    impact: 'high',
    actionable: true,
    data: [75, 85, 95, 120, 145, 180, 220]
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Untapped Pet Services Market',
    description: 'Neural analysis reveals high demand-supply gap in specialized pet services with 15x growth potential',
    confidence: 87,
    impact: 'critical',
    actionable: true,
    data: [12, 18, 25, 32, 45, 68, 89]
  },
  {
    id: '3',
    type: 'optimization',
    title: 'Dynamic Pricing Sweet Spot',
    description: 'Quantum algorithms identified optimal pricing ranges that increase conversion by 67% while maintaining satisfaction',
    confidence: 94,
    impact: 'high',
    actionable: true,
    data: [0.65, 0.72, 0.83, 0.91, 0.97, 0.89, 0.76]
  }
];

const MOCK_ADAPTATIONS: AdaptationRule[] = [
  {
    id: '1',
    trigger: 'user_abandonment',
    condition: 'session_duration < 30s AND page_views < 3',
    action: 'show_ai_assistant_popup',
    priority: 9,
    effectiveness: 78,
    status: 'active'
  },
  {
    id: '2',
    trigger: 'high_demand_detected',
    condition: 'request_volume > baseline * 1.5',
    action: 'activate_surge_pricing_notification',
    priority: 8,
    effectiveness: 85,
    status: 'testing'
  },
  {
    id: '3',
    trigger: 'provider_low_rating',
    condition: 'rating < 4.0 AND complaint_count > 2',
    action: 'trigger_training_recommendation',
    priority: 7,
    effectiveness: 92,
    status: 'active'
  }
];

export function DynamicUniverseEngine({ className = '' }: DynamicUniverseEngineProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [behaviors, setBehaviors] = useState<UserBehavior[]>(MOCK_BEHAVIORS);
  const [insights, setInsights] = useState<UniverseInsight[]>(MOCK_INSIGHTS);
  const [adaptations, setAdaptations] = useState<AdaptationRule[]>(MOCK_ADAPTATIONS);
  const [universeHealth, setUniverseHealth] = useState(94);
  const [learningRate, setLearningRate] = useState(87);
  const [adaptationScore, setAdaptationScore] = useState(91);
  const [isLearning, setIsLearning] = useState(true);

  // Simulate real-time universe evolution
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new behavior
      const newBehavior: UserBehavior = {
        id: Date.now().toString(),
        userId: `user${Math.floor(Math.random() * 1000)}`,
        action: ['service_search', 'provider_contact', 'booking_complete', 'review_left'][Math.floor(Math.random() * 4)],
        category: ['home_cleaning', 'landscaping', 'pet_care', 'handyman'][Math.floor(Math.random() * 4)],
        timestamp: new Date(),
        context: { randomData: Math.random() },
        impact: Math.random()
      };

      setBehaviors(prev => [newBehavior, ...prev.slice(0, 9)]);
      
      // Update metrics based on learning
      setUniverseHealth(prev => Math.min(100, prev + (Math.random() - 0.4) * 2));
      setLearningRate(prev => Math.min(100, prev + (Math.random() - 0.3) * 1.5));
      setAdaptationScore(prev => Math.min(100, prev + (Math.random() - 0.35) * 1.8));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'anomaly': return <Eye className="h-4 w-4" />;
      case 'opportunity': return <Lightbulb className="h-4 w-4" />;
      case 'optimization': return <Rocket className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const recentBehaviors = useMemo(() => behaviors.slice(0, 5), [behaviors]);
  const activeAdaptations = useMemo(() => adaptations.filter(a => a.status === 'active'), [adaptations]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Universe Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Universe Health</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{universeHealth}%</div>
            <Progress value={universeHealth} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {isLearning ? 'Actively Learning' : 'Stable State'}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Rate</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{learningRate}%</div>
            <Progress value={learningRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Neural Processing Active
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adaptation Score</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{adaptationScore}%</div>
            <Progress value={adaptationScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {activeAdaptations.length} Rules Active
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
              {insights.map((insight, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${getImpactColor(insight.impact)}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Real-time Generation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Universe Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="adaptations">Auto-Adaptations</TabsTrigger>
          <TabsTrigger value="behaviors">Live Behaviors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Universe Evolution Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neural Network Density</span>
                    <Badge variant="outline">99.7% Connected</Badge>
                  </div>
                  <Progress value={99.7} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quantum Coherence</span>
                    <Badge variant="outline">87.3% Stable</Badge>
                  </div>
                  <Progress value={87.3} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Predictive Accuracy</span>
                    <Badge variant="outline">94.1% Confident</Badge>
                  </div>
                  <Progress value={94.1} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Real-Time Activity Pulse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBehaviors.map((behavior, index) => (
                    <div key={behavior.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className={`w-2 h-2 rounded-full ${index < 2 ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{behavior.action.replace('_', ' ')}</div>
                        <div className="text-xs text-muted-foreground">{behavior.category}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(behavior.impact * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
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
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    {insight.actionable && (
                      <Button size="sm" variant="outline">
                        <Rocket className="h-4 w-4 mr-2" />
                        Take Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="adaptations" className="space-y-6">
          <div className="grid gap-4">
            {adaptations.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rule.trigger.replace('_', ' ')}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={rule.status === 'active' ? 'default' : rule.status === 'testing' ? 'secondary' : 'outline'}
                      >
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
                    <span className="text-sm">Priority Level</span>
                    <Progress value={rule.priority * 10} className="w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="behaviors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Live User Behavior Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {behaviors.map((behavior, index) => (
                  <div 
                    key={behavior.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                      index < 3 ? 'bg-green-50 border border-green-200' : 'bg-muted/50'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      index < 3 ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{behavior.userId}</span>
                        <Badge variant="outline" className="text-xs">{behavior.action}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {behavior.category} • {behavior.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Impact: {Math.round(behavior.impact * 100)}%</div>
                      <div className="text-xs text-muted-foreground">
                        {Object.keys(behavior.context).length} data points
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
