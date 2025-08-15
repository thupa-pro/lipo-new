"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign,
  TrendingUp,
  Zap,
  Target,
  Brain,
  Star,
  Gift,
  Rocket,
  ChartBar,
  Users,
  Clock,
  Trophy,
  Sparkles,
  ArrowUp,
  Heart,
  Gauge,
  Lightbulb,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BoostOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  impact_score: number;
  duration_hours: number;
  category: 'visibility' | 'urgency' | 'premium' | 'social';
  roi_prediction: number;
  success_rate: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface TipSuggestion {
  amount: number;
  reasoning: string;
  context: string;
  impact: 'low' | 'medium' | 'high';
  timing: 'immediate' | 'completion' | 'milestone';
  acceptance_probability: number;
}

interface ProviderAnalytics {
  current_rating: number;
  total_jobs: number;
  response_time_avg: number;
  customer_satisfaction: number;
  repeat_customer_rate: number;
  peak_hours: string[];
  demand_level: 'low' | 'medium' | 'high' | 'urgent';
  competitor_pricing: {
    avg: number;
    min: number;
    max: number;
  };
}

interface TipBoostingEngineProps {
  providerId?: string;
  serviceAmount: number;
  serviceCategory: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  onBoostApplied?: (boost: BoostOption, tip: number) => void;
  className?: string;
}

const BOOST_OPTIONS: BoostOption[] = [
  {
    id: 'featured_listing',
    name: 'Featured Listing',
    description: 'Appear at the top of search results and category pages',
    cost: 15,
    impact_score: 8.5,
    duration_hours: 24,
    category: 'visibility',
    roi_prediction: 3.2,
    success_rate: 0.82,
    icon: Star
  },
  {
    id: 'urgent_badge',
    name: 'Urgent Priority',
    description: 'Display urgent badge and get priority matching',
    cost: 8,
    impact_score: 7.2,
    duration_hours: 6,
    category: 'urgency',
    roi_prediction: 2.8,
    success_rate: 0.76,
    icon: Zap
  },
  {
    id: 'premium_highlight',
    name: 'Premium Highlight',
    description: 'Enhanced visual presentation with premium styling',
    cost: 12,
    impact_score: 6.8,
    duration_hours: 48,
    category: 'premium',
    roi_prediction: 2.1,
    success_rate: 0.69,
    icon: Trophy
  },
  {
    id: 'social_boost',
    name: 'Social Boost',
    description: 'Share across platform social features and networks',
    cost: 6,
    impact_score: 5.5,
    duration_hours: 72,
    category: 'social',
    roi_prediction: 1.8,
    success_rate: 0.63,
    icon: Heart
  }
];

const MOCK_ANALYTICS: ProviderAnalytics = {
  current_rating: 4.7,
  total_jobs: 156,
  response_time_avg: 18,
  customer_satisfaction: 0.91,
  repeat_customer_rate: 0.34,
  peak_hours: ['9-11 AM', '2-4 PM', '6-8 PM'],
  demand_level: 'high',
  competitor_pricing: {
    avg: 85,
    min: 65,
    max: 120
  }
};

export function TipBoostingEngine({
  providerId,
  serviceAmount,
  serviceCategory,
  urgency,
  onBoostApplied,
  className
}: TipBoostingEngineProps) {
  const [analytics, setAnalytics] = useState<ProviderAnalytics>(MOCK_ANALYTICS);
  const [selectedBoosts, setSelectedBoosts] = useState<BoostOption[]>([]);
  const [tipAmount, setTipAmount] = useState(0);
  const [autoTipping, setAutoTipping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // AI-generated tip suggestions
  const tipSuggestions = useMemo((): TipSuggestion[] => {
    const baseAmount = serviceAmount * 0.15; // 15% base tip
    
    return [
      {
        amount: Math.round(baseAmount * 0.8),
        reasoning: "Standard appreciation for good service",
        context: "Most customers tip around this amount for similar services",
        impact: 'medium',
        timing: 'completion',
        acceptance_probability: 0.85
      },
      {
        amount: Math.round(baseAmount * 1.2),
        reasoning: "Above-average tip for exceptional service",
        context: `Provider has ${analytics.current_rating}★ rating with high satisfaction`,
        impact: 'high',
        timing: 'completion',
        acceptance_probability: 0.92
      },
      {
        amount: Math.round(baseAmount * 0.5),
        reasoning: "Motivational tip to secure quick response",
        context: "Immediate tip often reduces wait time by 40%",
        impact: 'medium',
        timing: 'immediate',
        acceptance_probability: 0.78
      }
    ];
  }, [serviceAmount, analytics]);

  // Calculate total boost cost and impact
  const totalBoostCost = selectedBoosts.reduce((sum, boost) => sum + boost.cost, 0);
  const totalImpactScore = selectedBoosts.reduce((sum, boost) => sum + boost.impact_score, 0);
  const avgSuccessRate = selectedBoosts.length > 0 
    ? selectedBoosts.reduce((sum, boost) => sum + boost.success_rate, 0) / selectedBoosts.length
    : 0;

  // AI recommendations based on context
  const getAIRecommendations = () => {
    const recommendations = [];
    
    if (urgency === 'urgent' || urgency === 'high') {
      recommendations.push({
        type: 'boost',
        option: BOOST_OPTIONS.find(b => b.id === 'urgent_badge')!,
        reason: 'High urgency detected - urgent badge will prioritize your request'
      });
    }
    
    if (analytics.demand_level === 'high') {
      recommendations.push({
        type: 'boost',
        option: BOOST_OPTIONS.find(b => b.id === 'featured_listing')!,
        reason: 'High demand in your area - featured listing ensures visibility'
      });
    }
    
    if (serviceAmount > analytics.competitor_pricing.avg) {
      recommendations.push({
        type: 'tip',
        amount: Math.round(serviceAmount * 0.18),
        reason: 'Above-average pricing detected - generous tip increases acceptance rate'
      });
    }
    
    return recommendations;
  };

  const aiRecommendations = getAIRecommendations();

  const handleBoostToggle = (boost: BoostOption) => {
    setSelectedBoosts(prev => {
      const isSelected = prev.some(b => b.id === boost.id);
      if (isSelected) {
        return prev.filter(b => b.id !== boost.id);
      } else {
        return [...prev, boost];
      }
    });
  };

  const handleApplyBoosts = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    selectedBoosts.forEach(boost => {
      onBoostApplied?.(boost, tipAmount);
    });
    
    setIsLoading(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-yellow-600';
      case 'medium': return 'text-blue-600';
      case 'high': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-600" />
            Tip & Boost Engine
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
              AI-Powered
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Optimize your service with AI-suggested tips and boosts for maximum visibility and success
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="boosts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="boosts">Visibility Boosts</TabsTrigger>
              <TabsTrigger value="tips">Smart Tipping</TabsTrigger>
              <TabsTrigger value="analytics">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="boosts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Boost Options</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Increase your visibility and get matched faster with providers
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {BOOST_OPTIONS.map((boost) => {
                    const Icon = boost.icon;
                    const isSelected = selectedBoosts.some(b => b.id === boost.id);
                    
                    return (
                      <div
                        key={boost.id}
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-all",
                          isSelected && "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        )}
                        onClick={() => handleBoostToggle(boost)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              boost.category === 'visibility' && "bg-blue-100 dark:bg-blue-900/20",
                              boost.category === 'urgency' && "bg-red-100 dark:bg-red-900/20",
                              boost.category === 'premium' && "bg-purple-100 dark:bg-purple-900/20",
                              boost.category === 'social' && "bg-pink-100 dark:bg-pink-900/20"
                            )}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{boost.name}</h3>
                              <p className="text-sm text-muted-foreground">{boost.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">${boost.cost}</p>
                            <p className="text-xs text-muted-foreground">{boost.duration_hours}h</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Impact Score</p>
                            <div className="flex items-center gap-1">
                              <Progress value={boost.impact_score * 10} className="h-2 flex-1" />
                              <span className="text-xs">{boost.impact_score}/10</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ROI Prediction</p>
                            <p className="font-medium text-green-600">{boost.roi_prediction.toFixed(1)}x</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Success Rate</p>
                            <p className="font-medium">{Math.round(boost.success_rate * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Tip Suggestions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Smart tipping based on service value, provider performance, and market data
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tipSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all",
                        tipAmount === suggestion.amount && "border-green-500 bg-green-50 dark:bg-green-950/20"
                      )}
                      onClick={() => setTipAmount(suggestion.amount)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">${suggestion.amount}</h3>
                            <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                              {suggestion.impact} impact
                            </Badge>
                            <Badge variant="secondary" className="capitalize">
                              {suggestion.timing}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {suggestion.reasoning}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {Math.round(suggestion.acceptance_probability * 100)}%
                          </p>
                          <p className="text-xs text-muted-foreground">acceptance</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        💡 {suggestion.context}
                      </p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium">Custom Tip Amount</label>
                      <Switch
                        checked={autoTipping}
                        onCheckedChange={setAutoTipping}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <Slider
                          value={[tipAmount]}
                          onValueChange={([value]) => setTipAmount(value)}
                          max={Math.round(serviceAmount * 0.3)}
                          min={0}
                          step={5}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-12">${tipAmount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tipAmount > 0 && `${((tipAmount / serviceAmount) * 100).toFixed(1)}% of service amount`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Provider Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <Star className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-lg font-bold">{analytics.current_rating}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-lg font-bold">{analytics.total_jobs}</p>
                      <p className="text-xs text-muted-foreground">Jobs</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                      <p className="text-lg font-bold">{analytics.response_time_avg}m</p>
                      <p className="text-xs text-muted-foreground">Response</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                      <Heart className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-lg font-bold">{Math.round(analytics.customer_satisfaction * 100)}%</p>
                      <p className="text-xs text-muted-foreground">Satisfaction</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Market Position</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Your Service: ${serviceAmount}</span>
                        <span>Market Avg: ${analytics.competitor_pricing.avg}</span>
                      </div>
                      <div className="relative">
                        <div className="w-full h-3 bg-gray-200 rounded-full">
                          <div 
                            className="h-3 bg-blue-600 rounded-full" 
                            style={{ 
                              width: `${Math.min((serviceAmount / analytics.competitor_pricing.max) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>${analytics.competitor_pricing.min}</span>
                          <span>${analytics.competitor_pricing.max}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiRecommendations.map((rec, index) => (
                <Alert key={index}>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{rec.type === 'boost' ? rec.option.name : `$${rec.amount} tip`}</strong>
                    <br />
                    <span className="text-sm">{rec.reason}</span>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Optimization Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Selected Boosts</span>
                  <span className="text-sm font-medium">{selectedBoosts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Boost Cost</span>
                  <span className="text-sm font-medium">${totalBoostCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tip Amount</span>
                  <span className="text-sm font-medium">${tipAmount}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total Investment</span>
                  <span className="font-bold">${totalBoostCost + tipAmount}</span>
                </div>
              </div>

              {selectedBoosts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Expected Impact</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span>{Math.round(avgSuccessRate * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Impact Score</span>
                      <span>{totalImpactScore.toFixed(1)}/10</span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleApplyBoosts}
                disabled={selectedBoosts.length === 0 && tipAmount === 0 || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Rocket className="w-4 h-4 mr-2" />
                )}
                Apply Optimization
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
