import { NextRequest, NextResponse } from 'next/server';
import { userAIClient } from '@/lib/ai/user-ai-agents';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, query, location, preferences = {} } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Generate AI recommendations
    const recommendations = await userAIClient.generateRecommendations({
      userId,
      query,
      location,
      preferences,
      includeAIInsights: true
    });

    // Mock enhanced recommendations with confidence scores
    const enhancedRecommendations = [
      {
        id: 'provider_1',
        name: 'Elite Home Services',
        category: 'Home Maintenance',
        rating: 4.9,
        completedJobs: 247,
        responseTime: '< 30 min',
        distance: '1.2 miles',
        price: '$85/hr',
        availability: 'Available now',
        specialties: ['Plumbing', 'Electrical', 'HVAC'],
        aiConfidence: 94.7,
        matchReasons: [
          'Perfect rating match for quality preference',
          'Specialized in requested service type',
          'Fastest response time in area',
          'Verified and insured professional'
        ],
        estimatedCompletion: '2-3 hours',
        bookingBoost: '+15% faster booking'
      },
      {
        id: 'provider_2', 
        name: 'TechFix Pro Solutions',
        category: 'Technology Repair',
        rating: 4.8,
        completedJobs: 189,
        responseTime: '< 45 min',
        distance: '2.1 miles', 
        price: '$120/hr',
        availability: 'Available in 2 hours',
        specialties: ['Computer Repair', 'Network Setup', 'Data Recovery'],
        aiConfidence: 87.3,
        matchReasons: [
          'Excellent customer reviews',
          'Certified technology specialist',
          'Previous satisfied customers nearby'
        ],
        estimatedCompletion: '1-2 hours',
        bookingBoost: '+8% success rate'
      },
      {
        id: 'provider_3',
        name: 'GreenThumb Landscaping',
        category: 'Outdoor Services',
        rating: 4.7,
        completedJobs: 156,
        responseTime: '< 1 hour',
        distance: '3.5 miles',
        price: '$65/hr',
        availability: 'Available tomorrow',
        specialties: ['Garden Design', 'Tree Care', 'Lawn Maintenance'],
        aiConfidence: 81.9,
        matchReasons: [
          'Eco-friendly practices match preferences',
          'Seasonal expertise for current needs',
          'Competitive pricing in area'
        ],
        estimatedCompletion: '4-6 hours',
        bookingBoost: '+12% customer satisfaction'
      }
    ];

    return NextResponse.json({
      recommendations: enhancedRecommendations,
      metadata: {
        query,
        location,
        totalProviders: enhancedRecommendations.length,
        averageConfidence: enhancedRecommendations.reduce((sum, r) => sum + r.aiConfidence, 0) / enhancedRecommendations.length,
        searchRadius: '5 miles',
        generatedAt: new Date().toISOString()
      },
      aiInsights: {
        bestMatch: enhancedRecommendations[0],
        priceRange: { min: 65, max: 120, average: 90 },
        recommendedBookingTime: 'Within next 2 hours for 15% faster response',
        marketTrends: 'High demand in your area - book soon for better availability'
      }
    });

  } catch (error) {
    console.error('AI Recommendations API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const category = searchParams.get('category');
  
  try {
    // Return cached or popular recommendations
    const popularRecommendations = [
      {
        id: 'popular_1',
        name: 'Top-Rated Cleaning Service',
        category: 'Cleaning',
        rating: 4.9,
        bookings: 1247,
        aiScore: 96.2
      },
      {
        id: 'popular_2', 
        name: 'Trusted Handyman Network',
        category: 'Home Repair',
        rating: 4.8,
        bookings: 892,
        aiScore: 93.7
      }
    ];

    return NextResponse.json({
      recommendations: popularRecommendations,
      type: 'popular',
      category: category || 'all'
    });

  } catch (error) {
    console.error('Popular Recommendations Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
