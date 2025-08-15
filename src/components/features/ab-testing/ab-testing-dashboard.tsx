'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Target,
  BarChart3,
  Play,
  Pause,
  StopCircle,
  Settings,
  Eye,
  Zap
} from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variant_a: {
    name: string;
    traffic: number;
    conversions: number;
    visitors: number;
  };
  variant_b: {
    name: string;
    traffic: number;
    conversions: number;
    visitors: number;
  };
  confidence: number;
  winner?: 'a' | 'b' | null;
  startDate: string;
  endDate?: string;
  goal: string;
  description: string;
}

interface ABTestingDashboardProps {
  className?: string;
}

export function ABTestingDashboard({ className = '' }: ABTestingDashboardProps) {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Load existing A/B tests
    const mockTests: ABTest[] = [
      {
        id: 'test_1',
        name: 'Homepage Hero CTA',
        status: 'running',
        variant_a: {
          name: 'Find Services Now',
          traffic: 50,
          conversions: 245,
          visitors: 5420
        },
        variant_b: {
          name: 'Book Professional Today',
          traffic: 50,
          conversions: 312,
          visitors: 5381
        },
        confidence: 87.3,
        winner: 'b',
        startDate: '2024-01-15',
        goal: 'Increase signup conversions',
        description: 'Testing different CTA text on homepage hero section'
      },
      {
        id: 'test_2',
        name: 'Pricing Page Layout',
        status: 'running',
        variant_a: {
          name: 'Traditional Layout',
          traffic: 40,
          conversions: 89,
          visitors: 2145
        },
        variant_b: {
          name: 'Feature-First Layout',
          traffic: 60,
          conversions: 156,
          visitors: 3218
        },
        confidence: 62.8,
        startDate: '2024-01-20',
        goal: 'Improve premium subscription rate',
        description: 'Testing feature-focused vs price-focused layouts'
      }
    ];
    setTests(mockTests);
  }, []);

  const getConversionRate = (conversions: number, visitors: number) => {
    return visitors > 0 ? ((conversions / visitors) * 100).toFixed(2) : '0.00';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getWinnerIndicator = (test: ABTest) => {
    if (!test.winner || test.confidence < 80) return null;
    
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Winner: Variant {test.winner.toUpperCase()}
      </Badge>
    );
  };

  const toggleTestStatus = (testId: string) => {
    setTests(prev => prev.map(test => {
      if (test.id === testId) {
        const newStatus = test.status === 'running' ? 'paused' : 'running';
        return { ...test, status: newStatus };
      }
      return test;
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            A/B Testing Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Optimize conversions with data-driven experiments
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Create Test
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Tests</p>
                <p className="text-lg font-bold">{tests.filter(t => t.status === 'running').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Uplift</p>
                <p className="text-lg font-bold">+12.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                <p className="text-lg font-bold">
                  {tests.length > 0 
                    ? (tests.reduce((sum, t) => sum + t.confidence, 0) / tests.length).toFixed(1)
                    : '0'}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
                <p className="text-lg font-bold">
                  {tests.reduce((sum, t) => sum + t.variant_a.visitors + t.variant_b.visitors, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Running Tests</h3>
        
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{test.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getWinnerIndicator(test)}
                  <Badge 
                    className={`text-white ${getStatusColor(test.status)}`}
                  >
                    {test.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleTestStatus(test.id)}
                  >
                    {test.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Variant A */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Variant A: {test.variant_a.name}</h4>
                    <Badge variant="outline">{test.variant_a.traffic}% traffic</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {test.variant_a.visitors.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Visitors</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {test.variant_a.conversions}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Conversions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {getConversionRate(test.variant_a.conversions, test.variant_a.visitors)}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">CVR</p>
                    </div>
                  </div>
                </div>

                {/* Variant B */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Variant B: {test.variant_b.name}</h4>
                    <Badge variant="outline">{test.variant_b.traffic}% traffic</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {test.variant_b.visitors.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Visitors</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {test.variant_b.conversions}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Conversions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {getConversionRate(test.variant_b.conversions, test.variant_b.visitors)}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">CVR</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence Level */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Statistical Confidence</span>
                  <span className="text-sm font-bold">{test.confidence}%</span>
                </div>
                <Progress value={test.confidence} className="h-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {test.confidence >= 95 ? 'Statistically significant' : 
                   test.confidence >= 80 ? 'Approaching significance' : 'Needs more data'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {tests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No A/B tests running</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start optimizing your conversion rates with data-driven experiments
              </p>
              <Button onClick={() => setIsCreating(true)}>
                Create Your First Test
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ABTestingDashboard;
