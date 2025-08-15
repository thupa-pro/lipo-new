"use client";

import { geolocationService, LocationData } from '../location/geolocation-service';

export interface UserProfile {
  id: string;
  preferences: {
    categories: string[];
    priceRange: [number, number];
    radius: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
    urgency: 'low' | 'medium' | 'high';
    quality: 'budget' | 'standard' | 'premium';
  };
  history: ServiceInteraction[];
  demographics: {
    age?: number;
    income?: string;
    lifestyle?: string[];
  };
  location: LocationData;
  behavior: UserBehavior;
}

export interface ServiceInteraction {
  serviceId: string;
  providerId: string;
  category: string;
  rating: number;
  completedAt: Date;
  spent: number;
  duration: number;
  location: LocationData;
  satisfaction: number;
  rebookLikelihood: number;
}

export interface UserBehavior {
  averageSessionTime: number;
  searchPatterns: string[];
  bookingFrequency: number;
  cancelationRate: number;
  responseTime: number;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  timePattern: number[]; // 24-hour activity pattern
  seasonality: Record<string, number>;
}

export interface RecommendationResult {
  id: string;
  type: 'service' | 'provider' | 'category' | 'promotion';
  score: number;
  reason: string;
  data: any;
  urgency: 'low' | 'medium' | 'high';
  context: string;
  expiresAt?: Date;
}

class IntelligentRecommendationEngine {
  private static instance: IntelligentRecommendationEngine;
  private userProfiles: Map<string, UserProfile> = new Map();
  private modelWeights: Record<string, number> = {
    location: 0.25,
    history: 0.3,
    preferences: 0.2,
    behavior: 0.15,
    realTime: 0.1
  };

  static getInstance(): IntelligentRecommendationEngine {
    if (!IntelligentRecommendationEngine.instance) {
      IntelligentRecommendationEngine.instance = new IntelligentRecommendationEngine();
    }
    return IntelligentRecommendationEngine.instance;
  }

  // Generate personalized recommendations like Facebook's News Feed
  async generatePersonalizedRecommendations(
    userId: string,
    context: 'homepage' | 'search' | 'booking' | 'browse' = 'homepage',
    limit: number = 10
  ): Promise<RecommendationResult[]> {
    const userProfile = await this.getUserProfile(userId);
    const currentLocation = await geolocationService.getCurrentLocation();
    const currentTime = new Date();

    // Multi-factor recommendation scoring
    const candidates = await this.getCandidateServices(userProfile, currentLocation);
    const scoredRecommendations = await Promise.all(
      candidates.map(candidate => this.scoreRecommendation(candidate, userProfile, currentTime, context))
    );

    // Sort and filter recommendations
    return scoredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(rec => rec.score > 0.3); // Minimum relevance threshold
  }

  // Context-aware recommendations like Uber's smart suggestions
  async getContextualRecommendations(
    userId: string,
    context: {
      weather?: string;
      timeOfDay: string;
      dayOfWeek: string;
      season: string;
      event?: string;
      emergency?: boolean;
    }
  ): Promise<RecommendationResult[]> {
    const userProfile = await this.getUserProfile(userId);
    const recommendations: RecommendationResult[] = [];

    // Weather-based recommendations
    if (context.weather) {
      recommendations.push(...await this.getWeatherBasedRecommendations(context.weather, userProfile));
    }

    // Time-based recommendations
    recommendations.push(...await this.getTimeBasedRecommendations(context.timeOfDay, userProfile));

    // Event-based recommendations
    if (context.event) {
      recommendations.push(...await this.getEventBasedRecommendations(context.event, userProfile));
    }

    // Emergency recommendations
    if (context.emergency) {
      recommendations.push(...await this.getEmergencyRecommendations(userProfile));
    }

    return this.deduplicateAndRank(recommendations);
  }

  // Collaborative filtering like Airbnb's "Similar guests also liked"
  async getCollaborativeRecommendations(
    userId: string,
    serviceId?: string
  ): Promise<RecommendationResult[]> {
    const userProfile = await this.getUserProfile(userId);
    const similarUsers = await this.findSimilarUsers(userProfile);
    
    const collaborativeScores = new Map<string, number>();
    
    for (const similarUser of similarUsers) {
      const similarity = this.calculateUserSimilarity(userProfile, similarUser);
      
      for (const interaction of similarUser.history) {
        if (serviceId && interaction.serviceId === serviceId) continue;
        
        const currentScore = collaborativeScores.get(interaction.serviceId) || 0;
        const weightedScore = interaction.rating * similarity * interaction.satisfaction;
        collaborativeScores.set(interaction.serviceId, currentScore + weightedScore);
      }
    }

    return Array.from(collaborativeScores.entries())
      .map(([serviceId, score]) => ({
        id: serviceId,
        type: 'service' as const,
        score: score / similarUsers.length,
        reason: 'Users with similar preferences also liked this',
        data: { serviceId },
        urgency: 'low' as const,
        context: 'collaborative_filtering'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  // Real-time location-based suggestions like Uber's nearby services
  async getRealTimeLocationRecommendations(
    userId: string,
    radius: number = 5
  ): Promise<RecommendationResult[]> {
    const userProfile = await this.getUserProfile(userId);
    const currentLocation = await geolocationService.getCurrentLocation();
    
    // Get trending services in the area
    const nearbyServices = await this.getNearbyTrendingServices(currentLocation, radius);
    
    // Score based on user preferences and real-time factors
    return nearbyServices.map(service => ({
      id: service.id,
      type: 'service' as const,
      score: this.calculateRealTimeScore(service, userProfile, currentLocation),
      reason: this.generateLocationReason(service, currentLocation),
      data: service,
      urgency: this.calculateUrgency(service, userProfile),
      context: 'real_time_location'
    }));
  }

  // Smart pricing recommendations like Uber's surge pricing awareness
  async getPricingRecommendations(
    userId: string,
    serviceCategory: string
  ): Promise<{
    currentPricing: 'low' | 'normal' | 'high' | 'surge';
    suggestion: string;
    waitTime?: number;
    alternatives: RecommendationResult[];
  }> {
    const userProfile = await this.getUserProfile(userId);
    const currentLocation = await geolocationService.getCurrentLocation();
    
    const pricingData = await this.analyzePricingTrends(serviceCategory, currentLocation);
    const alternatives = await this.findPricingAlternatives(serviceCategory, userProfile);
    
    return {
      currentPricing: pricingData.level,
      suggestion: this.generatePricingSuggestion(pricingData, userProfile),
      waitTime: pricingData.suggestedWaitTime,
      alternatives
    };
  }

  // Seasonal and trend-based recommendations like Airbnb's seasonal suggestions
  async getSeasonalRecommendations(
    userId: string,
    season: 'spring' | 'summer' | 'fall' | 'winter'
  ): Promise<RecommendationResult[]> {
    const userProfile = await this.getUserProfile(userId);
    const seasonalTrends = await this.getSeasonalTrends(season, userProfile.location);
    
    return seasonalTrends.map(trend => ({
      id: trend.id,
      type: 'category' as const,
      score: trend.popularity * this.getUserSeasonalAffinity(userProfile, trend),
      reason: `Popular ${season} service in your area`,
      data: trend,
      urgency: 'low' as const,
      context: `seasonal_${season}`
    }));
  }

  // Fiverr-inspired skill and service matching
  async getSkillBasedRecommendations(
    userId: string,
    project: {
      description: string;
      budget: number;
      timeline: string;
      complexity: 'simple' | 'moderate' | 'complex';
    }
  ): Promise<RecommendationResult[]> {
    const userProfile = await this.getUserProfile(userId);
    
    // Analyze project requirements using NLP
    const extractedSkills = await this.extractRequiredSkills(project.description);
    const matchingProviders = await this.findSkillMatchingProviders(extractedSkills, project);
    
    return matchingProviders.map(provider => ({
      id: provider.id,
      type: 'provider' as const,
      score: this.calculateSkillMatchScore(provider, extractedSkills, project),
      reason: this.generateSkillMatchReason(provider, extractedSkills),
      data: provider,
      urgency: this.projectUrgencyFromTimeline(project.timeline),
      context: 'skill_matching'
    }));
  }

  // Social proof recommendations like Facebook's social activity
  async getSocialProofRecommendations(
    userId: string,
    friendIds: string[] = []
  ): Promise<RecommendationResult[]> {
    const userProfile = await this.getUserProfile(userId);
    const friendActivities = await this.getFriendsRecentActivities(friendIds);
    
    return friendActivities.map(activity => ({
      id: activity.serviceId,
      type: 'service' as const,
      score: this.calculateSocialProofScore(activity, userProfile),
      reason: `${activity.friendName} recently used this service`,
      data: activity,
      urgency: 'medium' as const,
      context: 'social_proof'
    }));
  }

  // Predictive recommendations based on behavior patterns
  async getPredictiveRecommendations(
    userId: string,
    lookAhead: number = 7 // days
  ): Promise<RecommendationResult[]> {
    const userProfile = await this.getUserProfile(userId);
    const behaviorPatterns = this.analyzeBehaviorPatterns(userProfile.behavior);
    
    const predictions = this.predictFutureNeeds(behaviorPatterns, lookAhead);
    
    return predictions.map(prediction => ({
      id: prediction.serviceId,
      type: 'service' as const,
      score: prediction.probability,
      reason: `Based on your pattern, you might need this ${prediction.when}`,
      data: prediction,
      urgency: prediction.urgency,
      context: 'predictive'
    }));
  }

  // Private helper methods
  private async getUserProfile(userId: string): Promise<UserProfile> {
    if (!this.userProfiles.has(userId)) {
      // Load or create user profile
      const profile = await this.loadUserProfile(userId);
      this.userProfiles.set(userId, profile);
    }
    return this.userProfiles.get(userId)!;
  }

  private async loadUserProfile(userId: string): Promise<UserProfile> {
    // In a real implementation, this would load from a database
    // For now, return a default profile structure
    return {
      id: userId,
      preferences: {
        categories: [],
        priceRange: [0, 1000],
        radius: 10,
        timeOfDay: 'any',
        urgency: 'medium',
        quality: 'standard'
      },
      history: [],
      demographics: {},
      location: await geolocationService.getCurrentLocation(),
      behavior: {
        averageSessionTime: 0,
        searchPatterns: [],
        bookingFrequency: 0,
        cancelationRate: 0,
        responseTime: 0,
        deviceType: 'mobile',
        timePattern: new Array(24).fill(0),
        seasonality: {}
      }
    };
  }

  private async scoreRecommendation(
    candidate: any,
    userProfile: UserProfile,
    currentTime: Date,
    context: string
  ): Promise<RecommendationResult> {
    const scores = {
      location: this.calculateLocationScore(candidate, userProfile.location),
      history: this.calculateHistoryScore(candidate, userProfile.history),
      preferences: this.calculatePreferenceScore(candidate, userProfile.preferences),
      behavior: this.calculateBehaviorScore(candidate, userProfile.behavior),
      realTime: this.calculateRealTimeScore(candidate, userProfile, userProfile.location)
    };

    const finalScore = Object.entries(scores).reduce(
      (total, [key, score]) => total + score * this.modelWeights[key],
      0
    );

    return {
      id: candidate.id,
      type: candidate.type || 'service',
      score: Math.min(1, Math.max(0, finalScore)),
      reason: this.generateRecommendationReason(scores, candidate),
      data: candidate,
      urgency: this.calculateUrgency(candidate, userProfile),
      context
    };
  }

  private calculateLocationScore(candidate: any, userLocation: LocationData): number {
    if (!candidate.location || !userLocation) return 0;
    
    const distance = geolocationService.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      candidate.location.latitude,
      candidate.location.longitude
    );
    
    // Score decreases with distance, max score within 2km
    return Math.max(0, 1 - (distance / 20));
  }

  private calculateHistoryScore(candidate: any, history: ServiceInteraction[]): number {
    const relevantHistory = history.filter(h => 
      h.category === candidate.category || h.providerId === candidate.providerId
    );
    
    if (relevantHistory.length === 0) return 0.5;
    
    const avgRating = relevantHistory.reduce((sum, h) => sum + h.rating, 0) / relevantHistory.length;
    const avgSatisfaction = relevantHistory.reduce((sum, h) => sum + h.satisfaction, 0) / relevantHistory.length;
    
    return (avgRating / 5 + avgSatisfaction / 10) / 2;
  }

  private calculatePreferenceScore(candidate: any, preferences: UserProfile['preferences']): number {
    let score = 0;
    
    // Category preference
    if (preferences.categories.includes(candidate.category)) {
      score += 0.4;
    }
    
    // Price range
    if (candidate.price >= preferences.priceRange[0] && candidate.price <= preferences.priceRange[1]) {
      score += 0.3;
    }
    
    // Quality preference
    if (candidate.quality === preferences.quality) {
      score += 0.3;
    }
    
    return Math.min(1, score);
  }

  private calculateBehaviorScore(candidate: any, behavior: UserBehavior): number {
    // Implement behavior-based scoring
    return 0.5; // Placeholder
  }

  private calculateRealTimeScore(candidate: any, userProfile: UserProfile, location: LocationData): number {
    // Implement real-time factors like availability, popularity, etc.
    return 0.5; // Placeholder
  }

  private calculateUrgency(candidate: any, userProfile: UserProfile): 'low' | 'medium' | 'high' {
    // Implement urgency calculation based on various factors
    return 'medium'; // Placeholder
  }

  private generateRecommendationReason(scores: Record<string, number>, candidate: any): string {
    const topFactor = Object.entries(scores).sort(([,a], [,b]) => b - a)[0][0];
    
    const reasons = {
      location: 'Close to your location',
      history: 'Based on your previous bookings',
      preferences: 'Matches your preferences',
      behavior: 'Popular with users like you',
      realTime: 'Currently trending in your area'
    };
    
    return reasons[topFactor as keyof typeof reasons] || 'Recommended for you';
  }

  // Additional helper methods would be implemented here...
  private async getCandidateServices(userProfile: UserProfile, location: LocationData): Promise<any[]> {
    // Implement candidate service retrieval
    return [];
  }

  private async getWeatherBasedRecommendations(weather: string, userProfile: UserProfile): Promise<RecommendationResult[]> {
    // Implement weather-based recommendations
    return [];
  }

  private async getTimeBasedRecommendations(timeOfDay: string, userProfile: UserProfile): Promise<RecommendationResult[]> {
    // Implement time-based recommendations
    return [];
  }

  private async getEventBasedRecommendations(event: string, userProfile: UserProfile): Promise<RecommendationResult[]> {
    // Implement event-based recommendations
    return [];
  }

  private async getEmergencyRecommendations(userProfile: UserProfile): Promise<RecommendationResult[]> {
    // Implement emergency recommendations
    return [];
  }

  private deduplicateAndRank(recommendations: RecommendationResult[]): RecommendationResult[] {
    // Implement deduplication and ranking
    return recommendations;
  }

  private async findSimilarUsers(userProfile: UserProfile): Promise<UserProfile[]> {
    // Implement similar user finding
    return [];
  }

  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): number {
    // Implement user similarity calculation
    return 0.5;
  }

  private async getNearbyTrendingServices(location: LocationData, radius: number): Promise<any[]> {
    // Implement nearby trending services
    return [];
  }

  private generateLocationReason(service: any, location: LocationData): string {
    return `Available near ${location.city}`;
  }

  private async analyzePricingTrends(category: string, location: LocationData): Promise<any> {
    // Implement pricing trends analysis
    return { level: 'normal' as const, suggestedWaitTime: 0 };
  }

  private async findPricingAlternatives(category: string, userProfile: UserProfile): Promise<RecommendationResult[]> {
    // Implement pricing alternatives
    return [];
  }

  private generatePricingSuggestion(pricingData: any, userProfile: UserProfile): string {
    return 'Normal pricing in your area';
  }

  private async getSeasonalTrends(season: string, location: LocationData): Promise<any[]> {
    // Implement seasonal trends
    return [];
  }

  private getUserSeasonalAffinity(userProfile: UserProfile, trend: any): number {
    // Implement seasonal affinity calculation
    return 0.5;
  }

  private async extractRequiredSkills(description: string): Promise<string[]> {
    // Implement NLP skill extraction
    return [];
  }

  private async findSkillMatchingProviders(skills: string[], project: any): Promise<any[]> {
    // Implement skill matching
    return [];
  }

  private calculateSkillMatchScore(provider: any, skills: string[], project: any): number {
    // Implement skill match scoring
    return 0.5;
  }

  private generateSkillMatchReason(provider: any, skills: string[]): string {
    return `Expert in ${skills.join(', ')}`;
  }

  private projectUrgencyFromTimeline(timeline: string): 'low' | 'medium' | 'high' {
    // Implement timeline to urgency conversion
    return 'medium';
  }

  private async getFriendsRecentActivities(friendIds: string[]): Promise<any[]> {
    // Implement friend activity retrieval
    return [];
  }

  private calculateSocialProofScore(activity: any, userProfile: UserProfile): number {
    // Implement social proof scoring
    return 0.5;
  }

  private analyzeBehaviorPatterns(behavior: UserBehavior): any {
    // Implement behavior pattern analysis
    return {};
  }

  private predictFutureNeeds(patterns: any, lookAhead: number): any[] {
    // Implement predictive modeling
    return [];
  }
}

export const recommendationEngine = IntelligentRecommendationEngine.getInstance();
