"use client";

import { geolocationService, LocationData } from '../location/geolocation-service';
import { localizationService } from '../i18n/intelligent-localization';

export interface PricingContext {
  location: LocationData;
  timeOfDay: string;
  dayOfWeek: string;
  season: string;
  weather?: string;
  localEvents?: string[];
  demandLevel: 'low' | 'medium' | 'high' | 'surge';
  supplyLevel: 'low' | 'medium' | 'high' | 'oversupply';
  competitionLevel: number; // 0-1 scale
}

export interface PricingFactors {
  baseDemand: number;
  seasonalMultiplier: number;
  timeMultiplier: number;
  weatherMultiplier: number;
  eventMultiplier: number;
  competitionMultiplier: number;
  urgencyMultiplier: number;
  qualityMultiplier: number;
  locationMultiplier: number;
}

export interface DynamicPrice {
  basePrice: number;
  finalPrice: number;
  currency: string;
  factors: PricingFactors;
  surgeMultiplier: number;
  confidence: number;
  validUntil: Date;
  explanation: {
    primaryFactors: string[];
    reason: string;
    suggestedAlternatives?: Array<{
      time: Date;
      estimatedPrice: number;
      savings: number;
    }>;
  };
}

export interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  convertedAmount: number;
  fees: number;
  totalCost: number;
  lastUpdated: Date;
  provider: string;
}

export interface PriceComparison {
  serviceId: string;
  providers: Array<{
    providerId: string;
    price: DynamicPrice;
    marketPosition: 'budget' | 'standard' | 'premium';
    valueScore: number;
  }>;
  marketAnalysis: {
    averagePrice: number;
    medianPrice: number;
    priceRange: [number, number];
    recommendedPrice: number;
    competitivenessScore: number;
  };
  insights: string[];
}

class DynamicPricingEngine {
  private static instance: DynamicPricingEngine;
  private priceCache: Map<string, DynamicPrice> = new Map();
  private exchangeRates: Map<string, { rate: number; timestamp: Date }> = new Map();
  private demandForecasts: Map<string, any> = new Map();
  private competitorPrices: Map<string, any[]> = new Map();

  // Pricing model weights (ML-based in production)
  private pricingWeights = {
    demand: 0.25,
    supply: 0.20,
    time: 0.15,
    location: 0.15,
    competition: 0.10,
    quality: 0.10,
    urgency: 0.05
  };

  static getInstance(): DynamicPricingEngine {
    if (!DynamicPricingEngine.instance) {
      DynamicPricingEngine.instance = new DynamicPricingEngine();
    }
    return DynamicPricingEngine.instance;
  }

  // Main dynamic pricing calculation
  async calculateDynamicPrice(
    serviceId: string,
    providerId: string,
    basePrice: number,
    context: PricingContext,
    options: {
      urgency?: 'low' | 'medium' | 'high' | 'emergency';
      quality?: 'budget' | 'standard' | 'premium';
      duration?: number; // in hours
      customerTier?: 'basic' | 'premium' | 'enterprise';
    } = {}
  ): Promise<DynamicPrice> {
    try {
      // Check cache first (prices valid for 15 minutes)
      const cacheKey = this.generateCacheKey(serviceId, providerId, context);
      const cached = this.priceCache.get(cacheKey);
      if (cached && cached.validUntil > new Date()) {
        return cached;
      }

      // Calculate pricing factors
      const factors = await this.calculatePricingFactors(serviceId, context, options);
      
      // Apply dynamic pricing algorithm
      const surgeMultiplier = this.calculateSurgeMultiplier(factors);
      const finalPrice = this.applyPricingModel(basePrice, factors, surgeMultiplier);
      
      // Get local currency and convert if needed
      const localCurrency = context.location.currency || 'USD';
      const convertedPrice = await this.convertCurrency(finalPrice, 'USD', localCurrency);
      
      // Calculate confidence score
      const confidence = this.calculatePricingConfidence(factors, context);
      
      // Generate pricing explanation
      const explanation = this.generatePricingExplanation(factors, surgeMultiplier, context);
      
      const dynamicPrice: DynamicPrice = {
        basePrice,
        finalPrice: convertedPrice.convertedAmount,
        currency: localCurrency,
        factors,
        surgeMultiplier,
        confidence,
        validUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        explanation
      };

      // Cache the result
      this.priceCache.set(cacheKey, dynamicPrice);
      
      return dynamicPrice;
    } catch (error) {
      console.error('Dynamic pricing calculation failed:', error);
      
      // Return fallback pricing
      return this.getFallbackPricing(basePrice, context.location.currency || 'USD');
    }
  }

  // Real-time surge pricing like Uber
  async calculateSurgeMultiplier(
    location: LocationData,
    serviceCategory: string,
    timeWindow: number = 3600000 // 1 hour
  ): Promise<{
    multiplier: number;
    level: 'none' | 'low' | 'medium' | 'high' | 'extreme';
    reason: string;
    duration: number;
    affectedRadius: number;
  }> {
    const currentDemand = await this.getCurrentDemandLevel(location, serviceCategory);
    const availableSupply = await this.getAvailableSupply(location, serviceCategory);
    const demandToSupplyRatio = currentDemand / Math.max(availableSupply, 1);
    
    // Calculate surge multiplier based on demand/supply ratio
    let multiplier = 1.0;
    let level: any = 'none';
    
    if (demandToSupplyRatio > 3) {
      multiplier = 2.5;
      level = 'extreme';
    } else if (demandToSupplyRatio > 2) {
      multiplier = 2.0;
      level = 'high';
    } else if (demandToSupplyRatio > 1.5) {
      multiplier = 1.5;
      level = 'medium';
    } else if (demandToSupplyRatio > 1.2) {
      multiplier = 1.25;
      level = 'low';
    }

    // Apply smoothing to prevent rapid price changes
    multiplier = await this.applySurgeSmoothing(multiplier, location, serviceCategory);
    
    return {
      multiplier,
      level,
      reason: this.generateSurgeReason(demandToSupplyRatio, level),
      duration: await this.estimateSurgeDuration(location, serviceCategory),
      affectedRadius: this.calculateAffectedRadius(demandToSupplyRatio)
    };
  }

  // Intelligent currency conversion with fees
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    includeConversionFees: boolean = true
  ): Promise<CurrencyConversion> {
    if (fromCurrency === toCurrency) {
      return {
        fromCurrency,
        toCurrency,
        rate: 1,
        convertedAmount: amount,
        fees: 0,
        totalCost: amount,
        lastUpdated: new Date(),
        provider: 'no_conversion'
      };
    }

    try {
      // Get exchange rate (with caching)
      const exchangeRate = await this.getExchangeRate(fromCurrency, toCurrency);
      
      // Calculate converted amount
      const convertedAmount = amount * exchangeRate.rate;
      
      // Calculate conversion fees (typically 1-3% for international conversions)
      const feePercentage = this.getConversionFeePercentage(fromCurrency, toCurrency);
      const fees = includeConversionFees ? convertedAmount * feePercentage : 0;
      
      return {
        fromCurrency,
        toCurrency,
        rate: exchangeRate.rate,
        convertedAmount,
        fees,
        totalCost: convertedAmount + fees,
        lastUpdated: exchangeRate.timestamp,
        provider: 'exchange_api'
      };
    } catch (error) {
      console.error('Currency conversion failed:', error);
      
      // Return fallback conversion
      return {
        fromCurrency,
        toCurrency,
        rate: 1,
        convertedAmount: amount,
        fees: 0,
        totalCost: amount,
        lastUpdated: new Date(),
        provider: 'fallback'
      };
    }
  }

  // Market-based competitive pricing
  async getCompetitivePricing(
    serviceCategory: string,
    location: LocationData,
    qualityTier: 'budget' | 'standard' | 'premium' = 'standard'
  ): Promise<PriceComparison> {
    const competitorPrices = await this.getCompetitorPrices(serviceCategory, location);
    
    const providers = competitorPrices.map(competitor => ({
      providerId: competitor.id,
      price: competitor.price,
      marketPosition: competitor.tier,
      valueScore: this.calculateValueScore(competitor)
    }));

    const prices = providers.map(p => p.price.finalPrice);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const sortedPrices = prices.sort((a, b) => a - b);
    const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];
    
    const recommendedPrice = this.calculateRecommendedPrice(
      averagePrice,
      medianPrice,
      qualityTier,
      location
    );

    return {
      serviceId: serviceCategory,
      providers,
      marketAnalysis: {
        averagePrice,
        medianPrice,
        priceRange: [Math.min(...prices), Math.max(...prices)],
        recommendedPrice,
        competitivenessScore: this.calculateCompetitivenessScore(recommendedPrice, prices)
      },
      insights: this.generatePricingInsights(providers, recommendedPrice)
    };
  }

  // Location-based price optimization
  async optimizePriceForLocation(
    basePrice: number,
    targetLocation: LocationData,
    serviceCategory: string
  ): Promise<{
    optimizedPrice: number;
    adjustmentFactor: number;
    localFactors: {
      costOfLiving: number;
      marketMaturity: number;
      competition: number;
      demand: number;
    };
    recommendations: string[];
  }> {
    const localFactors = await this.getLocationFactors(targetLocation, serviceCategory);
    
    // Calculate location-based adjustment
    const adjustmentFactor = this.calculateLocationAdjustment(localFactors);
    const optimizedPrice = basePrice * adjustmentFactor;
    
    const recommendations = this.generateLocationRecommendations(
      localFactors,
      adjustmentFactor
    );

    return {
      optimizedPrice,
      adjustmentFactor,
      localFactors,
      recommendations
    };
  }

  // Demand forecasting for pricing
  async forecastDemandAndPricing(
    serviceCategory: string,
    location: LocationData,
    forecastPeriod: {
      start: Date;
      end: Date;
      granularity: 'hour' | 'day' | 'week';
    }
  ): Promise<Array<{
    timestamp: Date;
    demandLevel: number;
    recommendedMultiplier: number;
    confidence: number;
    factors: string[];
  }>> {
    const historicalData = await this.getHistoricalDemandData(
      serviceCategory,
      location,
      forecastPeriod
    );

    const forecast = [];
    const currentTime = forecastPeriod.start;
    const intervalMs = this.getIntervalMs(forecastPeriod.granularity);

    while (currentTime <= forecastPeriod.end) {
      const demandPrediction = await this.predictDemandForTime(
        currentTime,
        serviceCategory,
        location,
        historicalData
      );

      forecast.push({
        timestamp: new Date(currentTime),
        demandLevel: demandPrediction.level,
        recommendedMultiplier: demandPrediction.multiplier,
        confidence: demandPrediction.confidence,
        factors: demandPrediction.factors
      });

      currentTime.setTime(currentTime.getTime() + intervalMs);
    }

    return forecast;
  }

  // Price A/B testing and optimization
  async optimizePricingWithABTest(
    serviceId: string,
    basePrice: number,
    testVariants: Array<{
      name: string;
      priceMultiplier: number;
      targetSegment?: string;
    }>,
    testDuration: number = 7 * 24 * 60 * 60 * 1000 // 7 days
  ): Promise<{
    testId: string;
    variants: typeof testVariants;
    expectedMetrics: Array<{
      variant: string;
      expectedConversionRate: number;
      expectedRevenue: number;
      confidence: number;
    }>;
  }> {
    const testId = this.generateTestId();
    
    // Calculate expected metrics for each variant
    const expectedMetrics = testVariants.map(variant => ({
      variant: variant.name,
      expectedConversionRate: this.predictConversionRate(
        basePrice * variant.priceMultiplier,
        serviceId
      ),
      expectedRevenue: this.predictRevenue(
        basePrice * variant.priceMultiplier,
        serviceId
      ),
      confidence: this.calculatePredictionConfidence(variant, serviceId)
    }));

    // Store test configuration
    await this.storeABTestConfig({
      testId,
      serviceId,
      basePrice,
      variants: testVariants,
      startDate: new Date(),
      endDate: new Date(Date.now() + testDuration),
      status: 'active'
    });

    return {
      testId,
      variants: testVariants,
      expectedMetrics
    };
  }

  // Private helper methods
  private async calculatePricingFactors(
    serviceId: string,
    context: PricingContext,
    options: any
  ): Promise<PricingFactors> {
    const [
      demandLevel,
      seasonalData,
      timeData,
      weatherData,
      eventData,
      competitionData,
      urgencyData,
      qualityData,
      locationData
    ] = await Promise.all([
      this.getCurrentDemandLevel(context.location, serviceId),
      this.getSeasonalMultiplier(context.season, serviceId),
      this.getTimeMultiplier(context.timeOfDay, context.dayOfWeek),
      this.getWeatherMultiplier(context.weather, serviceId),
      this.getEventMultiplier(context.localEvents || [], serviceId),
      this.getCompetitionMultiplier(context.location, serviceId),
      this.getUrgencyMultiplier(options.urgency || 'medium'),
      this.getQualityMultiplier(options.quality || 'standard'),
      this.getLocationMultiplier(context.location, serviceId)
    ]);

    return {
      baseDemand: demandLevel,
      seasonalMultiplier: seasonalData,
      timeMultiplier: timeData,
      weatherMultiplier: weatherData,
      eventMultiplier: eventData,
      competitionMultiplier: competitionData,
      urgencyMultiplier: urgencyData,
      qualityMultiplier: qualityData,
      locationMultiplier: locationData
    };
  }

  private calculateSurgeMultiplier(factors: PricingFactors): number {
    // Weighted combination of factors
    const weights = this.pricingWeights;
    
    return Math.max(
      1.0,
      factors.baseDemand * weights.demand +
      factors.timeMultiplier * weights.time +
      factors.urgencyMultiplier * weights.urgency +
      factors.locationMultiplier * weights.location +
      factors.competitionMultiplier * weights.competition +
      factors.qualityMultiplier * weights.quality
    );
  }

  private applyPricingModel(
    basePrice: number,
    factors: PricingFactors,
    surgeMultiplier: number
  ): number {
    return basePrice * 
           factors.seasonalMultiplier *
           factors.timeMultiplier *
           factors.weatherMultiplier *
           factors.eventMultiplier *
           factors.competitionMultiplier *
           factors.urgencyMultiplier *
           factors.qualityMultiplier *
           factors.locationMultiplier *
           surgeMultiplier;
  }

  private async getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<{ rate: number; timestamp: Date }> {
    const cacheKey = `${fromCurrency}_${toCurrency}`;
    const cached = this.exchangeRates.get(cacheKey);
    
    // Use cached rate if less than 1 hour old
    if (cached && Date.now() - cached.timestamp.getTime() < 3600000) {
      return cached;
    }

    try {
      // Fetch latest exchange rate
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      
      const rate = data.rates[toCurrency];
      if (!rate) {
        throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
      }

      const exchangeRate = {
        rate,
        timestamp: new Date()
      };

      // Cache the rate
      this.exchangeRates.set(cacheKey, exchangeRate);
      
      return exchangeRate;
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      
      // Return cached rate even if old, or default rate
      return cached || { rate: 1, timestamp: new Date() };
    }
  }

  private generateCacheKey(serviceId: string, providerId: string, context: PricingContext): string {
    const contextHash = JSON.stringify({
      location: `${Math.round(context.location.latitude * 100)},${Math.round(context.location.longitude * 100)}`,
      time: Math.floor(Date.now() / (15 * 60 * 1000)), // 15-minute buckets
      demand: context.demandLevel,
      supply: context.supplyLevel
    });
    
    return `${serviceId}_${providerId}_${btoa(contextHash)}`;
  }

  private calculatePricingConfidence(factors: PricingFactors, context: PricingContext): number {
    // Calculate confidence based on data quality and factor stability
    const factorScores = [
      this.assessFactorConfidence(factors.baseDemand, 'demand'),
      this.assessFactorConfidence(factors.competitionMultiplier, 'competition'),
      this.assessFactorConfidence(factors.locationMultiplier, 'location')
    ];

    return factorScores.reduce((sum, score) => sum + score, 0) / factorScores.length;
  }

  private generatePricingExplanation(
    factors: PricingFactors,
    surgeMultiplier: number,
    context: PricingContext
  ): DynamicPrice['explanation'] {
    const primaryFactors = [];
    
    if (surgeMultiplier > 1.5) primaryFactors.push('High demand in your area');
    if (factors.timeMultiplier > 1.2) primaryFactors.push('Peak time pricing');
    if (factors.eventMultiplier > 1.1) primaryFactors.push('Local event impact');
    if (factors.weatherMultiplier > 1.1) primaryFactors.push('Weather-related demand');
    
    let reason = 'Standard pricing';
    if (surgeMultiplier > 1.3) {
      reason = 'Higher prices due to increased demand';
    } else if (surgeMultiplier < 0.9) {
      reason = 'Lower prices due to reduced demand';
    }

    return {
      primaryFactors,
      reason,
      suggestedAlternatives: this.generateAlternativeSuggestions(factors, context)
    };
  }

  private getFallbackPricing(basePrice: number, currency: string): DynamicPrice {
    return {
      basePrice,
      finalPrice: basePrice,
      currency,
      factors: {
        baseDemand: 1,
        seasonalMultiplier: 1,
        timeMultiplier: 1,
        weatherMultiplier: 1,
        eventMultiplier: 1,
        competitionMultiplier: 1,
        urgencyMultiplier: 1,
        qualityMultiplier: 1,
        locationMultiplier: 1
      },
      surgeMultiplier: 1,
      confidence: 0.5,
      validUntil: new Date(Date.now() + 15 * 60 * 1000),
      explanation: {
        primaryFactors: ['Standard pricing'],
        reason: 'Using fallback pricing due to system limitations'
      }
    };
  }

  // Placeholder implementations for various helper methods
  private async getCurrentDemandLevel(location: LocationData, serviceId: string): Promise<number> { return 1.0; }
  private async getAvailableSupply(location: LocationData, serviceId: string): Promise<number> { return 10; }
  private async applySurgeSmoothing(multiplier: number, location: LocationData, serviceId: string): Promise<number> { return multiplier; }
  private generateSurgeReason(ratio: number, level: string): string { return `Demand ${level} in your area`; }
  private async estimateSurgeDuration(location: LocationData, serviceId: string): Promise<number> { return 3600000; }
  private calculateAffectedRadius(ratio: number): number { return Math.min(10, ratio * 2); }
  private getConversionFeePercentage(from: string, to: string): number { return 0.02; }
  private async getCompetitorPrices(category: string, location: LocationData): Promise<any[]> { return []; }
  private calculateValueScore(competitor: any): number { return 0.8; }
  private calculateRecommendedPrice(avg: number, median: number, tier: string, location: LocationData): number { return median; }
  private calculateCompetitivenessScore(price: number, prices: number[]): number { return 0.7; }
  private generatePricingInsights(providers: any[], recommended: number): string[] { return ['Competitive pricing detected']; }
  private async getLocationFactors(location: LocationData, category: string): Promise<any> { return { costOfLiving: 1, marketMaturity: 1, competition: 1, demand: 1 }; }
  private calculateLocationAdjustment(factors: any): number { return 1.0; }
  private generateLocationRecommendations(factors: any, adjustment: number): string[] { return ['Standard pricing recommended']; }
  private async getHistoricalDemandData(category: string, location: LocationData, period: any): Promise<any> { return {}; }
  private getIntervalMs(granularity: string): number { return granularity === 'hour' ? 3600000 : granularity === 'day' ? 86400000 : 604800000; }
  private async predictDemandForTime(time: Date, category: string, location: LocationData, historical: any): Promise<any> { return { level: 1, multiplier: 1, confidence: 0.8, factors: [] }; }
  private generateTestId(): string { return 'test_' + Math.random().toString(36).substr(2, 9); }
  private predictConversionRate(price: number, serviceId: string): number { return 0.15; }
  private predictRevenue(price: number, serviceId: string): number { return price * 100; }
  private calculatePredictionConfidence(variant: any, serviceId: string): number { return 0.8; }
  private async storeABTestConfig(config: any): Promise<void> {}
  private async getSeasonalMultiplier(season: string, serviceId: string): Promise<number> { return 1.0; }
  private getTimeMultiplier(timeOfDay: string, dayOfWeek: string): number { return 1.0; }
  private getWeatherMultiplier(weather: string | undefined, serviceId: string): number { return 1.0; }
  private getEventMultiplier(events: string[], serviceId: string): number { return 1.0; }
  private getCompetitionMultiplier(location: LocationData, serviceId: string): number { return 1.0; }
  private getUrgencyMultiplier(urgency: string): number { return urgency === 'emergency' ? 1.5 : urgency === 'high' ? 1.3 : 1.0; }
  private getQualityMultiplier(quality: string): number { return quality === 'premium' ? 1.2 : quality === 'budget' ? 0.8 : 1.0; }
  private getLocationMultiplier(location: LocationData, serviceId: string): number { return 1.0; }
  private assessFactorConfidence(factor: number, type: string): number { return 0.8; }
  private generateAlternativeSuggestions(factors: PricingFactors, context: PricingContext): DynamicPrice['explanation']['suggestedAlternatives'] { return []; }
}

export const dynamicPricingEngine = DynamicPricingEngine.getInstance();
