"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, TrendingUp, Target, AlertTriangle, CheckCircle, 
  Lightbulb, BarChart3, PieChart, Users, DollarSign,
  Calendar, Clock, Globe, Zap, Award, Eye, ArrowRight,
  Filter, Download, RefreshCw, Settings, ChevronDown,
  ChevronUp, Star, ThumbsUp, ThumbsDown, BookmarkPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'anomaly' | 'opportunity' | 'risk';
  category: 'revenue' | 'users' | 'performance' | 'market' | 'operations';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  actionItems: string[];
  potentialValue: number;
  timeframe: string;
  dataPoints: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  createdAt: Date;
  isBookmarked?: boolean;
  feedback?: 'helpful' | 'not_helpful';
}

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  status: 'on_track' | 'at_risk' | 'behind' | 'exceeding';
  category: string;
  lastUpdated: Date;
}

interface MarketTrend {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  relevance: number;
  timeframe: string;
  source: string;
}

interface BusinessIntelligenceProps {
  insights: AIInsight[];
  metrics: BusinessMetric[];
  marketTrends: MarketTrend[];
  onInsightAction?: (insightId: string, action: string) => void;
  onInsightFeedback?: (insightId: string, feedback: 'helpful' | 'not_helpful') => void;
  onBookmarkInsight?: (insightId: string) => void;
  onRefreshInsights?: () => void;
  className?: string;
}

export function BusinessIntelligence({
  insights,
  metrics,
  marketTrends,
  onInsightAction,
  onInsightFeedback,
  onBookmarkInsight,
  onRefreshInsights,
  className = ""
}: BusinessIntelligenceProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [expandedInsights, setExpandedInsights] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'confidence' | 'impact' | 'urgency' | 'date'>('confidence');

  const filteredInsights = insights
    .filter(insight => selectedCategory === 'all' || insight.category === selectedCategory)
    .filter(insight => selectedImpact === 'all' || insight.impact === selectedImpact)
    .sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'impact':
          const impactOrder = { high: 3, medium: 2, low: 1 };
          return impactOrder[b.impact] - impactOrder[a.impact];
        case 'urgency':
          const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

  const toggleExpanded = (insightId: string) => {
    setExpandedInsights(prev =>
      prev.includes(insightId)
        ? prev.filter(id => id !== insightId)
        : [...prev, insightId]
    );
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'prediction': return <TrendingUp className="w-5 h-5" />;
      case 'anomaly': return <AlertTriangle className="w-5 h-5" />;
      case 'opportunity': return <Target className="w-5 h-5" />;
      case 'risk': return <AlertTriangle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string, urgency: string) => {
    if (urgency === 'critical') return 'border-red-200 bg-red-50 dark:bg-red-950';
    switch (type) {
      case 'recommendation': return 'border-blue-200 bg-blue-50 dark:bg-blue-950';
      case 'prediction': return 'border-purple-200 bg-purple-50 dark:bg-purple-950';
      case 'anomaly': return 'border-orange-200 bg-orange-50 dark:bg-orange-950';
      case 'opportunity': return 'border-green-200 bg-green-50 dark:bg-green-950';
      case 'risk': return 'border-red-200 bg-red-50 dark:bg-red-950';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-950';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      critical: 'destructive',
      high: 'default',
      medium: 'secondary',
      low: 'outline'
    } as const;
    return variants[urgency as keyof typeof variants] || 'outline';
  };

  const getMetricStatus = (metric: BusinessMetric) => {
    const progress = (metric.value / metric.target) * 100;
    if (progress >= 100) return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900', status: 'Exceeding' };
    if (progress >= 80) return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900', status: 'On Track' };
    if (progress >= 60) return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900', status: 'At Risk' };
    return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900', status: 'Behind' };
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === '$') return `$${value.toLocaleString()}`;
    if (unit === 'ms') return `${value}ms`;
    return value.toLocaleString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span>Business Intelligence</span>
          </h2>
          <p className="text-muted-foreground">
            AI-powered insights and recommendations for your business
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onRefreshInsights}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Insight Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{insights.length}</div>
                <div className="text-sm text-muted-foreground">Total Insights</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {insights.filter(i => i.urgency === 'critical').length}
                </div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {insights.filter(i => i.type === 'opportunity').length}
                </div>
                <div className="text-sm text-muted-foreground">Opportunities</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${insights.reduce((sum, i) => sum + i.potentialValue, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Potential Value</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Category:</span>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Impact:</span>
              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy as any}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confidence">Confidence</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                  <SelectItem value="urgency">Urgency</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Insights List */}
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card className={`${getInsightColor(insight.type, insight.urgency)} border-2`}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{insight.title}</h3>
                              <Badge variant={getUrgencyBadge(insight.urgency)}>
                                {insight.urgency}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {insight.type}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{insight.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onBookmarkInsight?.(insight.id)}
                            className={insight.isBookmarked ? 'text-yellow-600' : ''}
                          >
                            <BookmarkPlus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(insight.id)}
                          >
                            {expandedInsights.includes(insight.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{insight.confidence}%</div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold capitalize">{insight.impact}</div>
                          <div className="text-xs text-muted-foreground">Impact</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            ${insight.potentialValue.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Potential Value</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{insight.timeframe}</div>
                          <div className="text-xs text-muted-foreground">Timeframe</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{insight.dataPoints}</div>
                          <div className="text-xs text-muted-foreground">Data Points</div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedInsights.includes(insight.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            {/* Action Items */}
                            <div>
                              <h4 className="font-semibold mb-2">Recommended Actions:</h4>
                              <ul className="space-y-2">
                                {insight.actionItems.map((action, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                                    <span className="text-sm">{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Was this helpful?</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onInsightFeedback?.(insight.id, 'helpful')}
                                  className={insight.feedback === 'helpful' ? 'text-green-600' : ''}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onInsightFeedback?.(insight.id, 'not_helpful')}
                                  className={insight.feedback === 'not_helpful' ? 'text-red-600' : ''}
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                </Button>
                              </div>
                              <Button
                                onClick={() => onInsightAction?.(insight.id, 'implement')}
                              >
                                Take Action
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric) => {
              const status = getMetricStatus(metric);
              const progress = (metric.value / metric.target) * 100;
              
              return (
                <Card key={metric.id} className="glass-card">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{metric.name}</h3>
                        <Badge className={status.bg}>
                          {status.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="flex items-baseline space-x-2 mb-2">
                          <span className="text-3xl font-bold">
                            {formatValue(metric.value, metric.unit)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {formatValue(metric.target, metric.unit)}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{progress.toFixed(1)}% of target</span>
                          <span className={metric.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                            {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Last updated: {metric.lastUpdated.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketTrends.map((trend) => (
              <Card key={trend.id} className="glass-card">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{trend.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={trend.impact === 'positive' ? 'default' : 
                                 trend.impact === 'negative' ? 'destructive' : 'secondary'}
                        >
                          {trend.impact}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {trend.relevance}% relevant
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm">{trend.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Timeframe: {trend.timeframe}</span>
                      <span>Source: {trend.source}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Custom Reports</h3>
            <p className="text-muted-foreground mb-6">
              Generate custom business intelligence reports tailored to your needs.
            </p>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
