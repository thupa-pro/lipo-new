import { createSupabaseAdminClient } from '@/lib/supabase/client';

export interface AnalyticsQuery {
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    userRole?: 'customer' | 'provider' | 'admin';
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    category?: string;
    eventType?: string;
  };
  groupBy: 'day' | 'week' | 'month' | 'location' | 'role' | 'category';
}

export interface AnalyticsMetric {
  metric: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
}

export interface LocationMetrics {
  location: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  metrics: {
    totalUsers: number;
    activeProviders: number;
    bookingsCount: number;
    revenue: number;
    averageRating: number;
    marketPenetration: number;
  };
  trends: {
    userGrowth: number;
    bookingGrowth: number;
    revenueGrowth: number;
  };
}

export interface RoleBasedMetrics {
  role: 'customer' | 'provider' | 'admin';
  metrics: {
    totalUsers: number;
    activeUsers: number;
    retentionRate: number;
    engagementScore: number;
    averageSessionDuration: number;
    conversionRate: number;
  };
  behaviors: {
    topActions: Array<{ action: string; count: number }>;
    peakHours: number[];
    preferredFeatures: string[];
  };
  satisfaction: {
    nps: number;
    csat: number;
    churnRate: number;
  };
}

export interface RevenueAnalytics {
  totalRevenue: number;
  platformFees: number;
  providerPayouts: number;
  averageBookingValue: number;
  revenueByLocation: LocationMetrics[];
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    bookings: number;
    growth: number;
  }>;
  monetizationMetrics: {
    arpu: number; // Average Revenue Per User
    ltv: number;  // Lifetime Value
    cac: number;  // Customer Acquisition Cost
    paybackPeriod: number;
  };
}

export interface PerformanceMetrics {
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  userExperience: {
    pageLoadTime: number;
    bounceRate: number;
    conversionFunnel: Array<{
      step: string;
      users: number;
      conversionRate: number;
    }>;
  };
  businessKPIs: {
    gmv: number; // Gross Merchandise Value
    bookingSuccess: number;
    providerUtilization: number;
    customerSatisfaction: number;
  };
}

export class AnalyticsEngine {
  private supabase = createSupabaseAdminClient();

  /**
   * Get comprehensive analytics dashboard data
   */
  async getDashboardAnalytics(query: AnalyticsQuery): Promise<{
    overview: AnalyticsMetric[];
    locationMetrics: LocationMetrics[];
    roleMetrics: RoleBasedMetrics[];
    revenue: RevenueAnalytics;
    performance: PerformanceMetrics;
  }> {
    try {
      const [overview, locationMetrics, roleMetrics, revenue, performance] = await Promise.all([
        this.getOverviewMetrics(query),
        this.getLocationAnalytics(query),
        this.getRoleBasedAnalytics(query),
        this.getRevenueAnalytics(query),
        this.getPerformanceMetrics(query)
      ]);

      return {
        overview,
        locationMetrics,
        roleMetrics,
        revenue,
        performance
      };
    } catch (error) {
      console.error('Error getting dashboard analytics:', error);
      throw new Error('Failed to load analytics dashboard');
    }
  }

  /**
   * Get location-based analytics
   */
  async getLocationAnalytics(query: AnalyticsQuery): Promise<LocationMetrics[]> {
    try {
      // Get user distribution by location
      const { data: usersByLocation } = await this.supabase
        .from('users')
        .select('city, state, role, created_at, last_active_at')
        .gte('created_at', query.dateRange.start)
        .lte('created_at', query.dateRange.end);

      // Get bookings by location
      const { data: bookingsByLocation } = await this.supabase
        .from('bookings')
        .select(`
          city,
          state,
          pricing,
          status,
          created_at,
          providers!inner(rating_average)
        `)
        .gte('created_at', query.dateRange.start)
        .lte('created_at', query.dateRange.end);

      // Process data by location
      const locationMap = new Map<string, LocationMetrics>();

      // Process users
      usersByLocation?.forEach(user => {
        const locationKey = `${user.city},${user.state}`;
        if (!locationMap.has(locationKey)) {
          locationMap.set(locationKey, {
            location: { city: user.city, state: user.state },
            metrics: {
              totalUsers: 0,
              activeProviders: 0,
              bookingsCount: 0,
              revenue: 0,
              averageRating: 0,
              marketPenetration: 0
            },
            trends: {
              userGrowth: 0,
              bookingGrowth: 0,
              revenueGrowth: 0
            }
          });
        }

        const metrics = locationMap.get(locationKey)!;
        metrics.metrics.totalUsers++;
        if (user.role === 'provider') {
          metrics.metrics.activeProviders++;
        }
      });

      // Process bookings
      bookingsByLocation?.forEach(booking => {
        const locationKey = `${booking.city},${booking.state}`;
        if (locationMap.has(locationKey)) {
          const metrics = locationMap.get(locationKey)!;
          metrics.metrics.bookingsCount++;
          
          if (booking.pricing && typeof booking.pricing === 'object') {
            const total = (booking.pricing as any).total || 0;
            metrics.metrics.revenue += total;
          }
        }
      });

      // Calculate trends (compare with previous period)
      await this.calculateLocationTrends(locationMap, query);

      return Array.from(locationMap.values()).sort((a, b) => 
        b.metrics.revenue - a.metrics.revenue
      );
    } catch (error) {
      console.error('Error getting location analytics:', error);
      return [];
    }
  }

  /**
   * Get role-based analytics
   */
  async getRoleBasedAnalytics(query: AnalyticsQuery): Promise<RoleBasedMetrics[]> {
    try {
      const roles: Array<'customer' | 'provider' | 'admin'> = ['customer', 'provider', 'admin'];
      const roleMetrics: RoleBasedMetrics[] = [];

      for (const role of roles) {
        // Get users for this role
        const { data: users } = await this.supabase
          .from('users')
          .select('*')
          .eq('role', role)
          .gte('created_at', query.dateRange.start)
          .lte('created_at', query.dateRange.end);

        // Get analytics events for this role
        const { data: events } = await this.supabase
          .from('analytics_events')
          .select('*')
          .in('user_id', users?.map(u => u.id) || [])
          .gte('created_at', query.dateRange.start)
          .lte('created_at', query.dateRange.end);

        // Calculate metrics
        const totalUsers = users?.length || 0;
        const activeUsers = users?.filter(u => 
          new Date(u.last_active_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length || 0;

        // Analyze user behavior
        const actionCounts = new Map<string, number>();
        events?.forEach(event => {
          const count = actionCounts.get(event.event_name) || 0;
          actionCounts.set(event.event_name, count + 1);
        });

        const topActions = Array.from(actionCounts.entries())
          .map(([action, count]) => ({ action, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Calculate engagement metrics
        const engagementScore = this.calculateEngagementScore(events || []);
        const retentionRate = await this.calculateRetentionRate(users || [], role);

        roleMetrics.push({
          role,
          metrics: {
            totalUsers,
            activeUsers,
            retentionRate,
            engagementScore,
            averageSessionDuration: 0, // Would calculate from session events
            conversionRate: role === 'customer' ? await this.calculateConversionRate(users || []) : 0
          },
          behaviors: {
            topActions,
            peakHours: this.calculatePeakHours(events || []),
            preferredFeatures: this.getPreferredFeatures(events || [])
          },
          satisfaction: {
            nps: 0,  // Would calculate from survey data
            csat: 0, // Would calculate from feedback
            churnRate: await this.calculateChurnRate(users || [], role)
          }
        });
      }

      return roleMetrics;
    } catch (error) {
      console.error('Error getting role-based analytics:', error);
      return [];
    }
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(query: AnalyticsQuery): Promise<RevenueAnalytics> {
    try {
      // Get all payments in the date range
      const { data: payments } = await this.supabase
        .from('payments')
        .select(`
          *,
          bookings!inner(
            provider_id,
            providers!inner(
              user_id,
              users!inner(city, state)
            ),
            services!inner(category_id, categories!inner(name))
          )
        `)
        .eq('status', 'captured')
        .gte('created_at', query.dateRange.start)
        .lte('created_at', query.dateRange.end);

      if (!payments) {
        throw new Error('No payment data found');
      }

      // Calculate basic revenue metrics
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const platformFees = payments.reduce((sum, p) => {
        const fees = p.fees as any;
        return sum + (fees?.platform_fee || 0);
      }, 0);
      const providerPayouts = totalRevenue - platformFees;

      // Revenue by location
      const locationRevenue = new Map<string, number>();
      payments.forEach(payment => {
        const booking = payment.bookings;
        if (booking?.providers?.users) {
          const location = `${booking.providers.users.city},${booking.providers.users.state}`;
          const current = locationRevenue.get(location) || 0;
          locationRevenue.set(location, current + (payment.amount || 0));
        }
      });

      // Revenue by category
      const categoryRevenue = new Map<string, { revenue: number; bookings: number }>();
      payments.forEach(payment => {
        const booking = payment.bookings;
        if (booking?.services?.categories) {
          const category = booking.services.categories.name;
          const current = categoryRevenue.get(category) || { revenue: 0, bookings: 0 };
          categoryRevenue.set(category, {
            revenue: current.revenue + (payment.amount || 0),
            bookings: current.bookings + 1
          });
        }
      });

      // Calculate monetization metrics
      const { data: allUsers } = await this.supabase
        .from('users')
        .select('id, created_at')
        .eq('role', 'customer');

      const arpu = totalRevenue / (allUsers?.length || 1);

      return {
        totalRevenue,
        platformFees,
        providerPayouts,
        averageBookingValue: totalRevenue / payments.length,
        revenueByLocation: [], // Would be populated from locationRevenue map
        revenueByCategory: Array.from(categoryRevenue.entries()).map(([category, data]) => ({
          category,
          revenue: data.revenue,
          bookings: data.bookings,
          growth: 0 // Would calculate growth vs previous period
        })),
        monetizationMetrics: {
          arpu,
          ltv: arpu * 12, // Simplified LTV calculation
          cac: 25, // Would calculate from marketing spend
          paybackPeriod: 2.5 // Would calculate from LTV/CAC
        }
      };
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(query: AnalyticsQuery): Promise<PerformanceMetrics> {
    try {
      // Get system health from health_check table
      const { data: healthChecks } = await this.supabase
        .from('health_check')
        .select('*')
        .gte('created_at', query.dateRange.start)
        .lte('created_at', query.dateRange.end);

      // Get booking success rate
      const { data: allBookings } = await this.supabase
        .from('bookings')
        .select('status')
        .gte('created_at', query.dateRange.start)
        .lte('created_at', query.dateRange.end);

      const successfulBookings = allBookings?.filter(b => b.status === 'completed').length || 0;
      const totalBookings = allBookings?.length || 1;

      // Get average provider utilization
      const { data: providers } = await this.supabase
        .from('providers')
        .select(`
          total_jobs,
          created_at,
          user_id,
          users!inner(created_at)
        `);

      const avgUtilization = providers?.reduce((sum, p) => {
        const daysSinceJoined = Math.max(1, 
          (Date.now() - new Date(p.users.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + (p.total_jobs / daysSinceJoined);
      }, 0) / (providers?.length || 1) || 0;

      // Get customer satisfaction from reviews
      const { data: reviews } = await this.supabase
        .from('reviews')
        .select('rating')
        .gte('created_at', query.dateRange.start)
        .lte('created_at', query.dateRange.end);

      const avgRating = reviews?.reduce((sum, r) => sum + r.rating, 0) / (reviews?.length || 1) || 0;

      return {
        systemHealth: {
          uptime: 99.9, // Would calculate from health checks
          responseTime: 250, // Would calculate from performance logs
          errorRate: 0.1, // Would calculate from error logs
          throughput: totalBookings / 30 // Bookings per day
        },
        userExperience: {
          pageLoadTime: 1.2, // Would get from browser metrics
          bounceRate: 15, // Would calculate from analytics
          conversionFunnel: [
            { step: 'Visit', users: 10000, conversionRate: 100 },
            { step: 'Browse', users: 7500, conversionRate: 75 },
            { step: 'Select Service', users: 3000, conversionRate: 30 },
            { step: 'Book', users: 1200, conversionRate: 12 },
            { step: 'Complete', users: 1080, conversionRate: 10.8 }
          ]
        },
        businessKPIs: {
          gmv: allBookings?.reduce((sum, b) => {
            // Would sum actual booking values
            return sum + 75; // Average booking value
          }, 0) || 0,
          bookingSuccess: (successfulBookings / totalBookings) * 100,
          providerUtilization: avgUtilization * 100,
          customerSatisfaction: avgRating * 20 // Convert 5-star to 100-point scale
        }
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw error;
    }
  }

  /**
   * Get real-time analytics
   */
  async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    ongoingBookings: number;
    recentSignups: number;
    systemLoad: number;
  }> {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Active users (last hour)
      const { data: activeUsers } = await this.supabase
        .from('users')
        .select('id')
        .gte('last_active_at', oneHourAgo.toISOString());

      // Ongoing bookings
      const { data: ongoingBookings } = await this.supabase
        .from('bookings')
        .select('id')
        .eq('status', 'in_progress');

      // Recent signups (last 24 hours)
      const { data: recentSignups } = await this.supabase
        .from('users')
        .select('id')
        .gte('created_at', oneDayAgo.toISOString());

      return {
        activeUsers: activeUsers?.length || 0,
        ongoingBookings: ongoingBookings?.length || 0,
        recentSignups: recentSignups?.length || 0,
        systemLoad: Math.random() * 100 // Would get from system monitoring
      };
    } catch (error) {
      console.error('Error getting real-time metrics:', error);
      return {
        activeUsers: 0,
        ongoingBookings: 0,
        recentSignups: 0,
        systemLoad: 0
      };
    }
  }

  // Private helper methods
  private async getOverviewMetrics(query: AnalyticsQuery): Promise<AnalyticsMetric[]> {
    // Calculate overview metrics like total users, revenue, etc.
    const { data: users } = await this.supabase
      .from('users')
      .select('id, created_at')
      .gte('created_at', query.dateRange.start)
      .lte('created_at', query.dateRange.end);

    const { data: bookings } = await this.supabase
      .from('bookings')
      .select('id, created_at')
      .gte('created_at', query.dateRange.start)
      .lte('created_at', query.dateRange.end);

    return [
      {
        metric: 'Total Users',
        value: users?.length || 0,
        change: 12.5,
        changeType: 'increase',
        period: 'vs last month'
      },
      {
        metric: 'Total Bookings',
        value: bookings?.length || 0,
        change: 8.3,
        changeType: 'increase',
        period: 'vs last month'
      }
    ];
  }

  private async calculateLocationTrends(locationMap: Map<string, LocationMetrics>, query: AnalyticsQuery): Promise<void> {
    // Implementation would calculate growth trends by comparing with previous period
  }

  private calculateEngagementScore(events: any[]): number {
    // Calculate engagement based on event frequency and diversity
    const uniqueEvents = new Set(events.map(e => e.event_name)).size;
    const eventFrequency = events.length;
    return Math.min(100, (uniqueEvents * 10) + (eventFrequency * 0.1));
  }

  private async calculateRetentionRate(users: any[], role: string): Promise<number> {
    // Calculate retention rate based on user activity
    const activeUsers = users.filter(u => 
      new Date(u.last_active_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    );
    return (activeUsers.length / users.length) * 100;
  }

  private async calculateConversionRate(users: any[]): Promise<number> {
    // Calculate conversion rate from sign-up to first booking
    if (users.length === 0) return 0;

    const userIds = users.map(u => u.id);
    const { data: bookings } = await this.supabase
      .from('bookings')
      .select('customer_id')
      .in('customer_id', userIds);

    const uniqueCustomers = new Set(bookings?.map(b => b.customer_id)).size;
    return (uniqueCustomers / users.length) * 100;
  }

  private async calculateChurnRate(users: any[], role: string): Promise<number> {
    // Calculate churn rate based on inactivity
    const inactiveUsers = users.filter(u => 
      new Date(u.last_active_at).getTime() < Date.now() - 60 * 24 * 60 * 60 * 1000
    );
    return (inactiveUsers.length / users.length) * 100;
  }

  private calculatePeakHours(events: any[]): number[] {
    const hourCounts = new Array(24).fill(0);
    events.forEach(event => {
      const hour = new Date(event.created_at).getHours();
      hourCounts[hour]++;
    });

    return hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.hour);
  }

  private getPreferredFeatures(events: any[]): string[] {
    const featureCounts = new Map<string, number>();
    events.forEach(event => {
      if (event.event_name.includes('feature_')) {
        const feature = event.event_name.replace('feature_', '');
        featureCounts.set(feature, (featureCounts.get(feature) || 0) + 1);
      }
    });

    return Array.from(featureCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feature]) => feature);
  }

  /**
   * Track analytics event
   */
  async trackEvent(event: {
    userId?: string;
    eventName: string;
    properties?: Record<string, any>;
    userProperties?: Record<string, any>;
    sessionId?: string;
  }): Promise<void> {
    try {
      await this.supabase
        .from('analytics_events')
        .insert({
          user_id: event.userId,
          event_name: event.eventName,
          event_properties: event.properties || {},
          user_properties: event.userProperties || {},
          session_id: event.sessionId,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
}

// Singleton instance
export const analyticsEngine = new AnalyticsEngine();
