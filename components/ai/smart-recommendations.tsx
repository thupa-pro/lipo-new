'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Zap,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Calendar,
  Award,
  Shield,
  Users
} from 'lucide-react'
import { aiRecommendationEngine, RecommendationResult, AIInsight } from '@/lib/ai/recommendation-engine'

interface SmartRecommendationsProps {
  userId: string
  query: string
  context?: {
    location?: { lat: number; lng: number }
    urgency?: 'low' | 'medium' | 'high'
    budget?: { min: number; max: number }
    timeframe?: string
  }
  onProviderSelect?: (providerId: string) => void
  className?: string
}

export function SmartRecommendations({ 
  userId, 
  query, 
  context = {}, 
  onProviderSelect,
  className = ""
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadRecommendations()
  }, [userId, query, context])

  const loadRecommendations = async () => {
    setIsLoading(true)
    try {
      const results = await aiRecommendationEngine.getRecommendations(userId, query, context)
      setRecommendations(results)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
      // Set fallback data
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    onProviderSelect?.(providerId)
  }

  const toggleDetails = (providerId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }))
  }

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'prediction': return <Brain className="w-4 h-4" />
      case 'recommendation': return <Lightbulb className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'opportunity': return <TrendingUp className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'prediction': return 'text-blue-600 bg-blue-50'
      case 'recommendation': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-orange-600 bg-orange-50'
      case 'opportunity': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatPrice = (range: { min: number; max: number }) => {
    return `$${range.min} - $${range.max}`
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            No recommendations found for your search. Try adjusting your criteria.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Target className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">
            Our AI is learning your preferences. Try searching for specific services!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Brain className="w-5 h-5" />
            AI-Powered Smart Recommendations
          </CardTitle>
          <CardDescription>
            Our advanced AI analyzed {recommendations.length} providers based on your preferences, 
            location, and similar users' experiences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline" className="bg-white">
              <Zap className="w-3 h-3 mr-1" />
              Powered by Machine Learning
            </Badge>
            <Badge variant="outline" className="bg-white">
              <Target className="w-3 h-3 mr-1" />
              Personalized for You
            </Badge>
            <Badge variant="outline" className="bg-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Real-time Analysis
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <Card 
            key={recommendation.provider.id}
            className={`transition-all duration-200 hover:shadow-lg ${
              selectedProvider === recommendation.provider.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                      #{index + 1} AI Pick
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{recommendation.provider.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({recommendation.provider.reviewCount} reviews)
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                      {Math.round(recommendation.confidence * 100)}% match
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl mb-1">
                    {recommendation.provider.name}
                  </CardTitle>
                  
                  <CardDescription className="flex items-center gap-4">
                    <span>{recommendation.provider.category}</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>2.3 miles away</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{recommendation.provider.responseTime}min response</span>
                    </div>
                  </CardDescription>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {formatPrice(recommendation.provider.priceRange)}
                  </div>
                  <div className="text-sm text-gray-500">per hour</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* AI Score Visualization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">AI Compatibility Score</span>
                  <span className="text-blue-600 font-bold">
                    {Math.round(recommendation.estimatedFit)}%
                  </span>
                </div>
                <Progress 
                  value={recommendation.estimatedFit} 
                  className="h-2"
                />
              </div>

              {/* Quick Reasons */}
              <div className="flex flex-wrap gap-2">
                {recommendation.reasons.slice(0, 3).map((reason, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="text-xs"
                  >
                    {reason.description}
                  </Badge>
                ))}
              </div>

              {/* AI Insights */}
              {recommendation.aiInsights.length > 0 && (
                <div className="space-y-2">
                  {recommendation.aiInsights.map((insight, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-start gap-2 p-3 rounded-lg ${getInsightColor(insight.type)}`}
                    >
                      {getInsightIcon(insight.type)}
                      <div>
                        <p className="text-sm font-medium">{insight.message}</p>
                        <p className="text-xs opacity-75">
                          {Math.round(insight.confidence * 100)}% confidence • {insight.source}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Provider Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {recommendation.provider.certifications.includes('licensed') && (
                  <div className="flex items-center gap-1 text-sm">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Licensed</span>
                  </div>
                )}
                {recommendation.provider.completionRate >= 0.95 && (
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Reliable</span>
                  </div>
                )}
                {recommendation.provider.responseTime <= 30 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span>Fast Response</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>{recommendation.provider.reviewCount}+ jobs</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => handleProviderSelect(recommendation.provider.id)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Provider
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toggleDetails(recommendation.provider.id)}
                >
                  {showDetails[recommendation.provider.id] ? 'Hide' : 'Show'} Details
                </Button>
                <Button variant="outline" size="icon">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>

              {/* Detailed Analysis */}
              {showDetails[recommendation.provider.id] && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI Analysis Details
                    </h4>
                    
                    {/* Matching Factors */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-700">Matching Factors</h5>
                      {recommendation.matchingFactors.map((factor, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{factor.factor}</span>
                            <Badge 
                              variant={factor.importance === 'high' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {factor.matchPercentage}% • {factor.importance}
                            </Badge>
                          </div>
                          <Progress value={factor.matchPercentage} className="h-1" />
                        </div>
                      ))}
                    </div>

                    {/* Detailed Reasons */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Why This Match</h5>
                      {recommendation.reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p>{reason.description}</p>
                            <p className="text-xs text-gray-500">
                              Weight: {Math.round(reason.weight * 100)}% • 
                              Confidence: {Math.round(reason.confidence * 100)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600">
            <p className="flex items-center justify-center gap-2">
              <Brain className="w-4 h-4" />
              Recommendations improve as you use the platform. 
              <button className="text-blue-600 hover:underline">
                Learn more about our AI
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Export sub-components for reuse
export function RecommendationInsight({ insight }: { insight: AIInsight }) {
  const icon = insight.type === 'prediction' ? <Brain className="w-4 h-4" /> :
               insight.type === 'recommendation' ? <Lightbulb className="w-4 h-4" /> :
               insight.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
               <TrendingUp className="w-4 h-4" />

  const colorClass = insight.type === 'prediction' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                     insight.type === 'recommendation' ? 'border-green-200 bg-green-50 text-green-700' :
                     insight.type === 'warning' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                     'border-purple-200 bg-purple-50 text-purple-700'

  return (
    <div className={`p-3 rounded-lg border ${colorClass}`}>
      <div className="flex items-start gap-2">
        {icon}
        <div className="flex-1">
          <p className="text-sm font-medium">{insight.message}</p>
          <p className="text-xs opacity-75 mt-1">
            {Math.round(insight.confidence * 100)}% confidence • Source: {insight.source}
          </p>
        </div>
      </div>
    </div>
  )
}

export function MatchingFactorBar({ factor }: { factor: any }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{factor.factor}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{factor.matchPercentage}%</span>
          <Badge 
            variant={factor.importance === 'high' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {factor.importance}
          </Badge>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${factor.matchPercentage}%` }}
        />
      </div>
    </div>
  )
}
