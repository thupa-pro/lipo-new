import { GoogleGenerativeAI } from '@google/generative-ai';
import { createSupabaseAdminClient } from '@/lib/supabase/client';

export interface OnboardingContext {
  userId: string;
  userRole: 'customer' | 'provider';
  currentStep: number;
  collectedData: Record<string, any>;
  preferences: {
    communicationStyle: 'concise' | 'detailed' | 'friendly';
    industryFocus?: string;
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
  };
}

export interface OnboardingResponse {
  message: string;
  nextQuestions: string[];
  suggestedActions: Array<{
    type: 'form_field' | 'category_selection' | 'pricing_setup' | 'verification';
    title: string;
    description: string;
    data?: any;
  }>;
  completionPercentage: number;
  insights: string[];
}

export class OnboardingAgent {
  private genAI: GoogleGenerativeAI;
  private supabase = createSupabaseAdminClient();

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async processOnboardingStep(
    context: OnboardingContext,
    userInput: string
  ): Promise<OnboardingResponse> {
    try {
      // Log the interaction
      await this.logInteraction(context.userId, 'onboarding', userInput);

      // Get market data for context
      const marketData = await this.getMarketInsights(context);

      // Generate AI response
      const aiResponse = await this.generateOnboardingResponse(
        context,
        userInput,
        marketData
      );

      // Update user profile with collected data
      await this.updateUserProfile(context);

      return aiResponse;
    } catch (error) {
      console.error('Onboarding agent error:', error);
      return this.getFallbackResponse(context);
    }
  }

  private async generateOnboardingResponse(
    context: OnboardingContext,
    userInput: string,
    marketData: any
  ): Promise<OnboardingResponse> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = this.buildOnboardingPrompt(context, userInput, marketData);
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the AI response
    return this.parseAIResponse(response, context);
  }

  private buildOnboardingPrompt(
    context: OnboardingContext,
    userInput: string,
    marketData: any
  ): string {
    const basePrompt = `
You are Loconomy's AI onboarding specialist, helping ${context.userRole}s get started on our platform.

User Context:
- Role: ${context.userRole}
- Current Step: ${context.currentStep}/10
- Experience Level: ${context.preferences.experienceLevel}
- Communication Style: ${context.preferences.communicationStyle}
- Collected Data: ${JSON.stringify(context.collectedData)}

Market Data:
${JSON.stringify(marketData)}

Latest User Input: "${userInput}"

Onboarding Goals:
${context.userRole === 'provider' ? `
- Help setup business profile
- Determine optimal pricing strategy
- Guide through verification process
- Explain platform features and best practices
- Maximize earning potential
` : `
- Understand service needs
- Setup location and preferences
- Explain booking process
- Setup payment methods
- Find perfect service matches
`}

Guidelines:
1. Be ${context.preferences.communicationStyle} and helpful
2. Ask 1-2 follow-up questions maximum
3. Provide specific, actionable suggestions
4. Use market data to give personalized insights
5. Calculate completion percentage accurately
6. Always encourage next steps

Respond in JSON format:
{
  "message": "Conversational response to user",
  "nextQuestions": ["Question 1", "Question 2"],
  "suggestedActions": [
    {
      "type": "form_field|category_selection|pricing_setup|verification",
      "title": "Action title",
      "description": "What this accomplishes",
      "data": {}
    }
  ],
  "completionPercentage": number,
  "insights": ["Insight 1", "Insight 2"]
}
`;

    return basePrompt;
  }

  private parseAIResponse(response: string, context: OnboardingContext): OnboardingResponse {
    try {
      const parsed = JSON.parse(response);
      
      // Validate and ensure all required fields
      return {
        message: parsed.message || "I'm here to help you get started!",
        nextQuestions: parsed.nextQuestions || [],
        suggestedActions: parsed.suggestedActions || [],
        completionPercentage: Math.min(100, Math.max(0, parsed.completionPercentage || 0)),
        insights: parsed.insights || []
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getFallbackResponse(context);
    }
  }

  private getFallbackResponse(context: OnboardingContext): OnboardingResponse {
    const roleSpecific = context.userRole === 'provider' 
      ? {
          message: "Let's continue setting up your provider profile. What type of services do you offer?",
          suggestedActions: [
            {
              type: 'category_selection' as const,
              title: 'Choose Service Category',
              description: 'Select your primary service category to get started',
              data: {}
            }
          ]
        }
      : {
          message: "Welcome! I'll help you find the perfect local services. What are you looking for?",
          suggestedActions: [
            {
              type: 'form_field' as const,
              title: 'Service Search',
              description: 'Tell us what service you need',
              data: {}
            }
          ]
        };

    return {
      ...roleSpecific,
      nextQuestions: ["What would you like to know about the platform?"],
      completionPercentage: (context.currentStep / 10) * 100,
      insights: ["Complete your profile to access all features"]
    };
  }

  private async getMarketInsights(context: OnboardingContext): Promise<any> {
    try {
      if (context.userRole === 'provider') {
        // Get category-specific market data
        const { data: categoryData } = await this.supabase
          .from('categories')
          .select('*, providers(rating_average, total_earnings)')
          .eq('is_active', true);

        // Get average earnings and demand for categories
        const { data: providerStats } = await this.supabase
          .from('providers')
          .select('category_id, rating_average, total_earnings')
          .eq('is_active', true);

        return {
          categories: categoryData,
          avgEarnings: this.calculateAverageEarnings(providerStats),
          demandTrends: await this.getDemandTrends(),
          competitorCount: providerStats?.length || 0
        };
      } else {
        // Get popular services and categories for customers
        const { data: popularServices } = await this.supabase
          .from('bookings')
          .select('service_id, services(name, category_id)')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        return {
          popularServices: this.aggregatePopularServices(popularServices),
          avgResponseTime: await this.getAvgResponseTime(),
          satisfaction: await this.getCustomerSatisfaction()
        };
      }
    } catch (error) {
      console.error('Error fetching market insights:', error);
      return {};
    }
  }

  private calculateAverageEarnings(providerStats: any[]): Record<string, number> {
    if (!providerStats) return {};
    
    const categoryEarnings: Record<string, number[]> = {};
    
    providerStats.forEach(provider => {
      if (provider.category_id && provider.total_earnings) {
        if (!categoryEarnings[provider.category_id]) {
          categoryEarnings[provider.category_id] = [];
        }
        categoryEarnings[provider.category_id].push(provider.total_earnings);
      }
    });

    const averages: Record<string, number> = {};
    Object.entries(categoryEarnings).forEach(([categoryId, earnings]) => {
      averages[categoryId] = earnings.reduce((sum, val) => sum + val, 0) / earnings.length;
    });

    return averages;
  }

  private async getDemandTrends(): Promise<any> {
    try {
      const { data } = await this.supabase
        .from('bookings')
        .select('created_at, service_id, services(category_id)')
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      // Aggregate demand by category and week
      const weeklyDemand: Record<string, Record<string, number>> = {};
      
      data?.forEach(booking => {
        const week = this.getWeekString(new Date(booking.created_at));
        const categoryId = booking.services?.category_id;
        
        if (categoryId) {
          if (!weeklyDemand[categoryId]) weeklyDemand[categoryId] = {};
          weeklyDemand[categoryId][week] = (weeklyDemand[categoryId][week] || 0) + 1;
        }
      });

      return weeklyDemand;
    } catch (error) {
      console.error('Error getting demand trends:', error);
      return {};
    }
  }

  private aggregatePopularServices(bookings: any[]): any[] {
    if (!bookings) return [];

    const serviceCounts: Record<string, { name: string; count: number; categoryId: string }> = {};
    
    bookings.forEach(booking => {
      const serviceId = booking.service_id;
      const serviceName = booking.services?.name;
      const categoryId = booking.services?.category_id;
      
      if (serviceId && serviceName) {
        if (!serviceCounts[serviceId]) {
          serviceCounts[serviceId] = { name: serviceName, count: 0, categoryId };
        }
        serviceCounts[serviceId].count++;
      }
    });

    return Object.values(serviceCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private async getAvgResponseTime(): Promise<number> {
    try {
      const { data } = await this.supabase
        .from('providers')
        .select('response_time_minutes')
        .not('response_time_minutes', 'is', null);

      if (!data || data.length === 0) return 120; // 2 hours default

      const avgMinutes = data.reduce((sum, p) => sum + (p.response_time_minutes || 0), 0) / data.length;
      return Math.round(avgMinutes);
    } catch (error) {
      return 120;
    }
  }

  private async getCustomerSatisfaction(): Promise<number> {
    try {
      const { data } = await this.supabase
        .from('reviews')
        .select('rating')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (!data || data.length === 0) return 4.5;

      const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      return Math.round(avgRating * 10) / 10;
    } catch (error) {
      return 4.5;
    }
  }

  private getWeekString(date: Date): string {
    const year = date.getFullYear();
    const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  private async updateUserProfile(context: OnboardingContext): Promise<void> {
    try {
      // Update user profile with collected onboarding data
      const { error } = await this.supabase
        .from('users')
        .update({
          metadata: {
            onboarding_progress: context.currentStep,
            collected_data: context.collectedData,
            preferences: context.preferences
          }
        })
        .eq('id', context.userId);

      if (error) {
        console.error('Error updating user profile:', error);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  private async logInteraction(
    userId: string,
    agentType: string,
    prompt: string,
    response?: string
  ): Promise<void> {
    try {
      await this.supabase
        .from('ai_interactions')
        .insert({
          user_id: userId,
          agent_type: agentType,
          prompt,
          response: response || '',
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging AI interaction:', error);
    }
  }

  // Public API methods
  async startOnboarding(userId: string, userRole: 'customer' | 'provider'): Promise<OnboardingResponse> {
    const context: OnboardingContext = {
      userId,
      userRole,
      currentStep: 1,
      collectedData: {},
      preferences: {
        communicationStyle: 'friendly',
        experienceLevel: 'beginner'
      }
    };

    const welcomeMessage = userRole === 'provider' 
      ? "Welcome to Loconomy! I'm here to help you set up your provider profile and start earning. Let's begin by understanding your business."
      : "Welcome to Loconomy! I'll help you find the perfect local services. Let's start by understanding what you're looking for.";

    return this.processOnboardingStep(context, welcomeMessage);
  }

  async continueOnboarding(
    userId: string,
    currentContext: OnboardingContext,
    userInput: string
  ): Promise<OnboardingResponse> {
    return this.processOnboardingStep(currentContext, userInput);
  }

  async getOnboardingStatus(userId: string): Promise<{ completed: boolean; progress: number; nextSteps: string[] }> {
    try {
      const { data: user } = await this.supabase
        .from('users')
        .select('metadata, onboarding_completed')
        .eq('id', userId)
        .single();

      const progress = user?.metadata?.onboarding_progress || 0;
      const completed = user?.onboarding_completed || progress >= 10;

      const nextSteps = completed ? [] : [
        'Complete profile setup',
        'Verify your account',
        'Add payment method',
        'Set preferences'
      ].slice(Math.floor(progress / 2.5));

      return {
        completed,
        progress: (progress / 10) * 100,
        nextSteps
      };
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return { completed: false, progress: 0, nextSteps: [] };
    }
  }
}

// Singleton instance
export const onboardingAgent = new OnboardingAgent();
