'use client'

export interface UserProfile {
  id: string
  preferences: {
    serviceTypes: string[]
    priceRange: { min: number; max: number }
    location: { lat: number; lng: number; radius: number }
    schedule: {
      preferredTimes: string[]
      preferredDays: string[]
      urgency: 'low' | 'medium' | 'high'
    }
    communicationStyle: 'formal' | 'casual' | 'professional'
    previousServices: string[]
    ratings: Record<string, number>
  }
  behavior: {
    searchHistory: string[]
    bookingHistory: BookingRecord[]
    viewHistory: ViewRecord[]
    messagePatterns: MessagePattern[]
    sessionData: SessionData[]
  }
  demographics: {
    age?: number
    location: string
    occupation?: string
    income?: 'low' | 'medium' | 'high'
    familySize?: number
  }
}

export interface ServiceProvider {
  id: string
  name: string
  category: string
  subcategories: string[]
  rating: number
  reviewCount: number
  priceRange: { min: number; max: number }
  location: { lat: number; lng: number }
  availability: AvailabilitySlot[]
  skills: string[]
  certifications: string[]
  responseTime: number
  completionRate: number
  languages: string[]
  workingStyle: 'formal' | 'casual' | 'professional'
  specializations: string[]
  portfolio: PortfolioItem[]
}

export interface RecommendationResult {
  provider: ServiceProvider
  score: number
  confidence: number
  reasons: RecommendationReason[]
  matchingFactors: MatchingFactor[]
  aiInsights: AIInsight[]
  estimatedFit: number
  potentialConcerns: string[]
  alternatives: string[]
}

export interface RecommendationReason {
  type: 'preference_match' | 'location_proximity' | 'rating_quality' | 'price_fit' | 'availability_match' | 'past_success' | 'ai_insight'
  description: string
  weight: number
  confidence: number
}

export interface MatchingFactor {
  factor: string
  userValue: any
  providerValue: any
  matchPercentage: number
  importance: 'low' | 'medium' | 'high'
}

export interface AIInsight {
  type: 'prediction' | 'recommendation' | 'warning' | 'opportunity'
  message: string
  confidence: number
  source: 'ml_model' | 'behavioral_analysis' | 'market_trends' | 'peer_comparison'
}

interface BookingRecord {
  providerId: string
  serviceType: string
  date: Date
  rating?: number
  completed: boolean
  cost: number
}

interface ViewRecord {
  providerId: string
  duration: number
  timestamp: Date
  actions: string[]
}

interface MessagePattern {
  providerId: string
  responseTime: number
  satisfaction: number
  communicationStyle: string
}

interface SessionData {
  timestamp: Date
  searchQueries: string[]
  filtersUsed: string[]
  timeSpent: number
  pagesVisited: string[]
}

interface AvailabilitySlot {
  date: Date
  startTime: string
  endTime: string
  booked: boolean
}

interface PortfolioItem {
  title: string
  description: string
  category: string
  rating: number
  completedDate: Date
}

export class AIRecommendationEngine {
  private static instance: AIRecommendationEngine
  private mlModels: Map<string, any> = new Map()
  private userProfiles: Map<string, UserProfile> = new Map()
  private marketTrends: Map<string, any> = new Map()
  private behavioralPatterns: Map<string, any> = new Map()

  static getInstance(): AIRecommendationEngine {
    if (!AIRecommendationEngine.instance) {
      AIRecommendationEngine.instance = new AIRecommendationEngine()
      AIRecommendationEngine.instance.initialize()
    }
    return AIRecommendationEngine.instance
  }

  private async initialize() {
    console.log('🤖 Initializing AI Recommendation Engine...')
    
    await Promise.all([
      this.loadMLModels(),
      this.loadMarketTrends(),
      this.initializeBehavioralAnalysis()
    ])
    
    console.log('✅ AI Recommendation Engine ready')
  }

  private async loadMLModels() {
    // Simulate loading pre-trained models
    this.mlModels.set('collaborative_filtering', {
      type: 'collaborative_filtering',
      accuracy: 0.87,
      lastTrained: new Date(),
      features: ['user_similarity', 'item_similarity', 'temporal_factors']
    })
    
    this.mlModels.set('content_based', {
      type: 'content_based',
      accuracy: 0.83,
      lastTrained: new Date(),
      features: ['service_features', 'provider_attributes', 'user_preferences']
    })
    
    this.mlModels.set('deep_learning', {
      type: 'neural_network',
      accuracy: 0.91,
      lastTrained: new Date(),
      features: ['behavioral_embeddings', 'contextual_features', 'temporal_dynamics']
    })
    
    this.mlModels.set('reinforcement_learning', {
      type: 'reinforcement_learning',
      accuracy: 0.89,
      lastTrained: new Date(),
      features: ['reward_optimization', 'exploration_exploitation', 'multi_armed_bandit']
    })
  }

  private async loadMarketTrends() {
    // Simulate market trend analysis
    this.marketTrends.set('seasonal_patterns', {
      spring: { gardening: 1.8, cleaning: 1.4, maintenance: 1.2 },
      summer: { landscaping: 2.1, pools: 1.9, ac_repair: 1.7 },
      fall: { heating: 1.6, weatherproofing: 1.3, gutters: 1.5 },
      winter: { snow_removal: 2.0, heating: 1.8, indoor_projects: 1.4 }
    })
    
    this.marketTrends.set('demand_surge', {
      emergency_services: { multiplier: 3.2, confidence: 0.95 },
      weekend_premium: { multiplier: 1.4, confidence: 0.89 },
      holiday_surge: { multiplier: 2.1, confidence: 0.92 }
    })
  }

  private async initializeBehavioralAnalysis() {
    // Initialize behavioral pattern recognition
    this.behavioralPatterns.set('user_journey_analysis', {
      typical_search_to_book: 3.2, // days
      comparison_threshold: 5, // providers viewed
      decision_factors: ['price', 'rating', 'availability', 'location']
    })
  }

  async getRecommendations(
    userId: string, 
    query: string, 
    context: {
      location?: { lat: number; lng: number }
      urgency?: 'low' | 'medium' | 'high'
      budget?: { min: number; max: number }
      timeframe?: string
    } = {},
    limit: number = 10
  ): Promise<RecommendationResult[]> {
    
    try {
      // Get or create user profile
      let userProfile = await this.getUserProfile(userId)
      if (!userProfile) {
        userProfile = await this.createUserProfile(userId, context)
      }

      // Get candidate providers
      const candidates = await this.getCandidateProviders(query, context)
      
      // Apply AI scoring
      const scoredRecommendations = await Promise.all(
        candidates.map(provider => this.scoreProvider(provider, userProfile, query, context))
      )
      
      // Rank and filter
      const rankedResults = scoredRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
      
      // Apply diversity and fairness filters
      const diverseResults = await this.applyDiversityFilters(rankedResults, userProfile)
      
      // Generate AI insights
      const enhancedResults = await Promise.all(
        diverseResults.map(result => this.enhanceWithAIInsights(result, userProfile, context))
      )
      
      // Update user profile with this search
      await this.updateUserProfile(userId, query, context, enhancedResults)
      
      return enhancedResults

    } catch (error) {
      console.error('AI Recommendation Engine error:', error)
      return this.getFallbackRecommendations(query, context, limit)
    }
  }

  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    // In production, fetch from database
    return this.userProfiles.get(userId) || null
  }

  private async createUserProfile(userId: string, context: any): Promise<UserProfile> {
    const profile: UserProfile = {
      id: userId,
      preferences: {
        serviceTypes: [],
        priceRange: context.budget || { min: 0, max: 1000 },
        location: context.location || { lat: 0, lng: 0, radius: 25 },
        schedule: {
          preferredTimes: ['morning', 'afternoon'],
          preferredDays: ['weekday'],
          urgency: context.urgency || 'medium'
        },
        communicationStyle: 'professional',
        previousServices: [],
        ratings: {}
      },
      behavior: {
        searchHistory: [],
        bookingHistory: [],
        viewHistory: [],
        messagePatterns: [],
        sessionData: []
      },
      demographics: {
        location: 'Unknown',
        income: 'medium'
      }
    }
    
    this.userProfiles.set(userId, profile)
    return profile
  }

  private async getCandidateProviders(query: string, context: any): Promise<ServiceProvider[]> {
    // Simulate provider database query
    // In production, this would query your actual provider database
    const mockProviders: ServiceProvider[] = [
      {
        id: 'provider-1',
        name: 'Elite Home Services',
        category: 'Home Maintenance',
        subcategories: ['Plumbing', 'Electrical', 'HVAC'],
        rating: 4.9,
        reviewCount: 234,
        priceRange: { min: 75, max: 150 },
        location: { lat: 37.7749, lng: -122.4194 },
        availability: [],
        skills: ['emergency_repairs', 'installations', 'maintenance'],
        certifications: ['licensed', 'insured', 'bonded'],
        responseTime: 30, // minutes
        completionRate: 0.98,
        languages: ['english', 'spanish'],
        workingStyle: 'professional',
        specializations: ['smart_home', 'eco_friendly'],
        portfolio: []
      },
      {
        id: 'provider-2',
        name: 'Quick Fix Solutions',
        category: 'Handyman',
        subcategories: ['General Repairs', 'Assembly', 'Maintenance'],
        rating: 4.7,
        reviewCount: 156,
        priceRange: { min: 50, max: 100 },
        location: { lat: 37.7849, lng: -122.4094 },
        availability: [],
        skills: ['quick_fixes', 'assembly', 'small_repairs'],
        certifications: ['insured'],
        responseTime: 15,
        completionRate: 0.95,
        languages: ['english'],
        workingStyle: 'casual',
        specializations: ['same_day_service'],
        portfolio: []
      }
    ]
    
    return mockProviders
  }

  private async scoreProvider(
    provider: ServiceProvider, 
    userProfile: UserProfile, 
    query: string, 
    context: any
  ): Promise<RecommendationResult> {
    
    const scores = {
      collaborative: await this.collaborativeFilteringScore(provider, userProfile),
      contentBased: await this.contentBasedScore(provider, userProfile, query),
      deepLearning: await this.deepLearningScore(provider, userProfile, context),
      reinforcement: await this.reinforcementLearningScore(provider, userProfile)
    }
    
    // Weighted ensemble
    const weights = { collaborative: 0.3, contentBased: 0.25, deepLearning: 0.35, reinforcement: 0.1 }
    const finalScore = Object.entries(scores).reduce(
      (total, [key, score]) => total + score * weights[key as keyof typeof weights], 
      0
    )
    
    const confidence = this.calculateConfidence(scores, userProfile)
    const reasons = await this.generateReasons(provider, userProfile, scores)
    const matchingFactors = await this.analyzeMatchingFactors(provider, userProfile)
    
    return {
      provider,
      score: finalScore,
      confidence,
      reasons,
      matchingFactors,
      aiInsights: [],
      estimatedFit: finalScore * 100,
      potentialConcerns: [],
      alternatives: []
    }
  }

  private async collaborativeFilteringScore(provider: ServiceProvider, userProfile: UserProfile): Promise<number> {
    // Simulate collaborative filtering based on similar users
    const similarUsers = await this.findSimilarUsers(userProfile)
    const providerRatings = similarUsers
      .filter(user => user.preferences.ratings[provider.id])
      .map(user => user.preferences.ratings[provider.id])
    
    if (providerRatings.length === 0) return 0.5 // Default neutral score
    
    const avgRating = providerRatings.reduce((sum, rating) => sum + rating, 0) / providerRatings.length
    return Math.min(avgRating / 5, 1) // Normalize to 0-1
  }

  private async contentBasedScore(provider: ServiceProvider, userProfile: UserProfile, query: string): Promise<number> {
    let score = 0
    
    // Service type match
    const serviceMatch = provider.subcategories.some(sub => 
      userProfile.preferences.serviceTypes.includes(sub) ||
      query.toLowerCase().includes(sub.toLowerCase())
    )
    if (serviceMatch) score += 0.3
    
    // Price range match
    const priceOverlap = Math.min(provider.priceRange.max, userProfile.preferences.priceRange.max) - 
                        Math.max(provider.priceRange.min, userProfile.preferences.priceRange.min)
    const priceMatch = Math.max(0, priceOverlap) / 
                      (userProfile.preferences.priceRange.max - userProfile.preferences.priceRange.min)
    score += priceMatch * 0.25
    
    // Rating quality
    score += (provider.rating / 5) * 0.2
    
    // Location proximity
    const distance = this.calculateDistance(
      provider.location, 
      userProfile.preferences.location
    )
    const locationScore = Math.max(0, 1 - distance / userProfile.preferences.location.radius)
    score += locationScore * 0.25
    
    return Math.min(score, 1)
  }

  private async deepLearningScore(provider: ServiceProvider, userProfile: UserProfile, context: any): Promise<number> {
    // Simulate neural network prediction
    const features = [
      provider.rating / 5,
      provider.completionRate,
      1 / (provider.responseTime + 1), // Inverse response time
      provider.reviewCount / 1000, // Normalized review count
      userProfile.behavior.bookingHistory.length / 100, // User experience
      context.urgency === 'high' ? 1 : context.urgency === 'medium' ? 0.5 : 0,
      this.seasonalityFactor(provider.category),
      this.timeFactor()
    ]
    
    // Simplified neural network simulation
    const hiddenLayer = features.map(f => Math.tanh(f * 0.8 + 0.1))
    const output = Math.tanh(hiddenLayer.reduce((sum, h) => sum + h, 0) / hiddenLayer.length)
    
    return Math.max(0, Math.min(1, (output + 1) / 2)) // Normalize to 0-1
  }

  private async reinforcementLearningScore(provider: ServiceProvider, userProfile: UserProfile): Promise<number> {
    // Simulate reinforcement learning based on user feedback
    const pastInteractions = userProfile.behavior.bookingHistory
      .filter(booking => booking.providerId === provider.id)
    
    if (pastInteractions.length === 0) {
      // Exploration: slightly favor less-tried providers
      return 0.6 + Math.random() * 0.2
    }
    
    // Exploitation: use historical performance
    const avgSatisfaction = pastInteractions
      .filter(booking => booking.rating)
      .reduce((sum, booking) => sum + booking.rating!, 0) / pastInteractions.length
    
    return avgSatisfaction / 5
  }

  private calculateConfidence(scores: Record<string, number>, userProfile: UserProfile): number {
    // Calculate confidence based on data availability and model agreement
    const dataRichness = Math.min(1, userProfile.behavior.bookingHistory.length / 10)
    const modelAgreement = 1 - (Math.max(...Object.values(scores)) - Math.min(...Object.values(scores)))
    
    return (dataRichness * 0.6 + modelAgreement * 0.4)
  }

  private async generateReasons(
    provider: ServiceProvider, 
    userProfile: UserProfile, 
    scores: Record<string, number>
  ): Promise<RecommendationReason[]> {
    const reasons: RecommendationReason[] = []
    
    // High rating
    if (provider.rating >= 4.5) {
      reasons.push({
        type: 'rating_quality',
        description: `Excellent ${provider.rating} star rating from ${provider.reviewCount} reviews`,
        weight: 0.8,
        confidence: 0.9
      })
    }
    
    // Fast response
    if (provider.responseTime <= 30) {
      reasons.push({
        type: 'availability_match',
        description: `Quick response time of ${provider.responseTime} minutes`,
        weight: 0.6,
        confidence: 0.85
      })
    }
    
    // Price fit
    const priceInRange = provider.priceRange.min <= userProfile.preferences.priceRange.max &&
                        provider.priceRange.max >= userProfile.preferences.priceRange.min
    if (priceInRange) {
      reasons.push({
        type: 'price_fit',
        description: 'Pricing fits within your budget range',
        weight: 0.7,
        confidence: 0.95
      })
    }
    
    return reasons
  }

  private async analyzeMatchingFactors(provider: ServiceProvider, userProfile: UserProfile): Promise<MatchingFactor[]> {
    return [
      {
        factor: 'Service Category',
        userValue: userProfile.preferences.serviceTypes,
        providerValue: provider.subcategories,
        matchPercentage: 85,
        importance: 'high'
      },
      {
        factor: 'Price Range',
        userValue: userProfile.preferences.priceRange,
        providerValue: provider.priceRange,
        matchPercentage: 92,
        importance: 'high'
      },
      {
        factor: 'Communication Style',
        userValue: userProfile.preferences.communicationStyle,
        providerValue: provider.workingStyle,
        matchPercentage: 78,
        importance: 'medium'
      }
    ]
  }

  private async applyDiversityFilters(
    results: RecommendationResult[], 
    userProfile: UserProfile
  ): Promise<RecommendationResult[]> {
    // Ensure diversity in recommendations
    const diverseResults: RecommendationResult[] = []
    const seenCategories = new Set<string>()
    const seenPriceRanges = new Set<string>()
    
    for (const result of results) {
      const category = result.provider.category
      const priceRange = this.getPriceRangeCategory(result.provider.priceRange)
      
      // Promote diversity while maintaining quality
      if (diverseResults.length < 3 || 
          (!seenCategories.has(category) && diverseResults.length < 7) ||
          (!seenPriceRanges.has(priceRange) && diverseResults.length < 7)) {
        
        diverseResults.push(result)
        seenCategories.add(category)
        seenPriceRanges.add(priceRange)
      } else if (diverseResults.length < results.length) {
        diverseResults.push(result)
      }
    }
    
    return diverseResults
  }

  private async enhanceWithAIInsights(
    result: RecommendationResult, 
    userProfile: UserProfile, 
    context: any
  ): Promise<RecommendationResult> {
    const insights: AIInsight[] = []
    
    // Prediction insights
    if (result.confidence > 0.8) {
      insights.push({
        type: 'prediction',
        message: 'High probability of satisfaction based on your preferences and similar users',
        confidence: result.confidence,
        source: 'ml_model'
      })
    }
    
    // Market trend insights
    const seasonalFactor = this.seasonalityFactor(result.provider.category)
    if (seasonalFactor > 1.3) {
      insights.push({
        type: 'warning',
        message: 'High demand period - consider booking soon or expect premium pricing',
        confidence: 0.85,
        source: 'market_trends'
      })
    }
    
    // Behavioral insights
    if (userProfile.behavior.bookingHistory.length > 5) {
      const avgRating = userProfile.behavior.bookingHistory
        .filter(b => b.rating)
        .reduce((sum, b) => sum + b.rating!, 0) / userProfile.behavior.bookingHistory.length
      
      if (result.provider.rating > avgRating + 0.5) {
        insights.push({
          type: 'opportunity',
          message: 'This provider has higher ratings than your typical choices',
          confidence: 0.9,
          source: 'behavioral_analysis'
        })
      }
    }
    
    return {
      ...result,
      aiInsights: insights
    }
  }

  private async updateUserProfile(
    userId: string, 
    query: string, 
    context: any, 
    results: RecommendationResult[]
  ): Promise<void> {
    const profile = this.userProfiles.get(userId)
    if (!profile) return
    
    // Update search history
    profile.behavior.searchHistory.push(query)
    if (profile.behavior.searchHistory.length > 100) {
      profile.behavior.searchHistory = profile.behavior.searchHistory.slice(-100)
    }
    
    // Update session data
    profile.behavior.sessionData.push({
      timestamp: new Date(),
      searchQueries: [query],
      filtersUsed: Object.keys(context),
      timeSpent: 0, // Will be updated when session ends
      pagesVisited: []
    })
    
    this.userProfiles.set(userId, profile)
  }

  private async getFallbackRecommendations(
    query: string, 
    context: any, 
    limit: number
  ): Promise<RecommendationResult[]> {
    // Simple fallback when AI fails
    const fallbackProviders = await this.getCandidateProviders(query, context)
    
    return fallbackProviders.slice(0, limit).map(provider => ({
      provider,
      score: provider.rating / 5,
      confidence: 0.5,
      reasons: [{
        type: 'rating_quality',
        description: 'Recommended based on rating',
        weight: 1,
        confidence: 0.5
      }],
      matchingFactors: [],
      aiInsights: [{
        type: 'warning',
        message: 'AI recommendations temporarily unavailable - showing basic results',
        confidence: 1,
        source: 'ml_model'
      }],
      estimatedFit: provider.rating * 20,
      potentialConcerns: [],
      alternatives: []
    }))
  }

  // Helper methods
  private async findSimilarUsers(userProfile: UserProfile): Promise<UserProfile[]> {
    // In production, use collaborative filtering algorithms
    return Array.from(this.userProfiles.values()).slice(0, 10)
  }

  private calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    // Simplified distance calculation (in practice, use proper geolocation)
    const R = 6371 // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private seasonalityFactor(category: string): number {
    const season = this.getCurrentSeason()
    const patterns = this.marketTrends.get('seasonal_patterns')
    return patterns?.[season]?.[category.toLowerCase()] || 1.0
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'fall'
    return 'winter'
  }

  private timeFactor(): number {
    const hour = new Date().getHours()
    // Business hours get higher score
    return (hour >= 8 && hour <= 18) ? 1.0 : 0.7
  }

  private getPriceRangeCategory(priceRange: { min: number; max: number }): string {
    const avg = (priceRange.min + priceRange.max) / 2
    if (avg < 75) return 'budget'
    if (avg < 150) return 'mid_range'
    return 'premium'
  }

  // Public API methods
  async getUserInsights(userId: string): Promise<any> {
    const profile = await this.getUserProfile(userId)
    if (!profile) return null
    
    return {
      preferredCategories: this.analyzePreferredCategories(profile),
      spendingPattern: this.analyzeSpendingPattern(profile),
      bookingTrends: this.analyzeBookingTrends(profile),
      satisfactionTrends: this.analyzeSatisfactionTrends(profile)
    }
  }

  private analyzePreferredCategories(profile: UserProfile): any {
    const categoryCount: Record<string, number> = {}
    profile.behavior.bookingHistory.forEach(booking => {
      categoryCount[booking.serviceType] = (categoryCount[booking.serviceType] || 0) + 1
    })
    
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))
  }

  private analyzeSpendingPattern(profile: UserProfile): any {
    const costs = profile.behavior.bookingHistory.map(b => b.cost)
    if (costs.length === 0) return { avgSpend: 0, trend: 'stable' }
    
    const avgSpend = costs.reduce((sum, cost) => sum + cost, 0) / costs.length
    const recentAvg = costs.slice(-5).reduce((sum, cost) => sum + cost, 0) / Math.min(5, costs.length)
    
    const trend = recentAvg > avgSpend * 1.1 ? 'increasing' : 
                  recentAvg < avgSpend * 0.9 ? 'decreasing' : 'stable'
    
    return { avgSpend, trend, recentAvg }
  }

  private analyzeBookingTrends(profile: UserProfile): any {
    // Analyze booking frequency and patterns
    return {
      frequency: profile.behavior.bookingHistory.length > 10 ? 'high' : 
                profile.behavior.bookingHistory.length > 3 ? 'medium' : 'low',
      seasonality: this.detectSeasonalPattern(profile),
      urgencyPattern: this.analyzeUrgencyPattern(profile)
    }
  }

  private analyzeSatisfactionTrends(profile: UserProfile): any {
    const ratings = profile.behavior.bookingHistory
      .filter(b => b.rating)
      .map(b => b.rating!)
    
    if (ratings.length === 0) return { avgSatisfaction: 0, trend: 'unknown' }
    
    const avgSatisfaction = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    const recentSatisfaction = ratings.slice(-3).reduce((sum, rating) => sum + rating, 0) / Math.min(3, ratings.length)
    
    const trend = recentSatisfaction > avgSatisfaction + 0.3 ? 'improving' :
                  recentSatisfaction < avgSatisfaction - 0.3 ? 'declining' : 'stable'
    
    return { avgSatisfaction, trend, recentSatisfaction }
  }

  private detectSeasonalPattern(profile: UserProfile): string {
    // Analyze if user has seasonal booking patterns
    return 'year_round' // Simplified
  }

  private analyzeUrgencyPattern(profile: UserProfile): string {
    // Analyze if user typically books urgent vs planned services
    return 'mixed' // Simplified
  }
}

export const aiRecommendationEngine = AIRecommendationEngine.getInstance()

// Export convenience functions
export async function getAIRecommendations(
  userId: string,
  query: string,
  context?: any,
  limit?: number
) {
  return await aiRecommendationEngine.getRecommendations(userId, query, context, limit)
}

export async function getUserAIInsights(userId: string) {
  return await aiRecommendationEngine.getUserInsights(userId)
}

// Export the singleton instance
export const aiRecommendationEngine = new AIRecommendationEngine()
