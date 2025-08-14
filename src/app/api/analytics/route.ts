import { NextRequest, NextResponse } from 'next/server';
import { analyticsEngine } from '@/lib/analytics/analytics-engine';
import { createSupabaseServerComponent } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerComponent();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, query } = body;

    switch (action) {
      case 'dashboard':
        if (!query || !query.dateRange) {
          return NextResponse.json(
            { error: 'Date range required' },
            { status: 400 }
          );
        }

        const dashboardData = await analyticsEngine.getDashboardAnalytics(query);
        return NextResponse.json(dashboardData);

      case 'location_analytics':
        const locationData = await analyticsEngine.getLocationAnalytics(query || {
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          filters: {},
          groupBy: 'location'
        });
        return NextResponse.json(locationData);

      case 'role_analytics':
        const roleData = await analyticsEngine.getRoleBasedAnalytics(query || {
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          filters: {},
          groupBy: 'role'
        });
        return NextResponse.json(roleData);

      case 'revenue_analytics':
        const revenueData = await analyticsEngine.getRevenueAnalytics(query || {
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          filters: {},
          groupBy: 'day'
        });
        return NextResponse.json(revenueData);

      case 'track_event':
        const { eventData } = body;
        if (!eventData || !eventData.eventName) {
          return NextResponse.json(
            { error: 'Event data required' },
            { status: 400 }
          );
        }

        await analyticsEngine.trackEvent({
          userId: user.id,
          ...eventData
        });
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerComponent();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'realtime':
        const realtimeMetrics = await analyticsEngine.getRealTimeMetrics();
        return NextResponse.json(realtimeMetrics);

      case 'user_analytics':
        // Get user-specific analytics (for their own data)
        const userQuery = {
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          filters: { userRole: searchParams.get('role') as any },
          groupBy: 'day' as const
        };

        const userData = await analyticsEngine.getRoleBasedAnalytics(userQuery);
        const userRole = searchParams.get('role') || 'customer';
        const userRoleData = userData.find(d => d.role === userRole);

        return NextResponse.json(userRoleData || null);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Analytics GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
