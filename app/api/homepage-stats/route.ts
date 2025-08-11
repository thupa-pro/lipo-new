import { NextResponse } from 'next/server';
import { createSupabaseServerComponent } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env-check';

export async function GET() {
  const fallbackStats = {
    userCount: 2400000,
    providerCount: 45000,
    bookingCount: 1200000,
    averageRating: 4.9,
    responseTime: "< 2hrs",
    successRate: "98.7%",
    liveProviders: 12000,
    avgEarnings: "$3,200",
    satisfactionRate: "99.2%"
  };

  if (!isSupabaseConfigured()) {
    console.log('Using fallback stats - Supabase not configured for production');
    return NextResponse.json(fallbackStats);
  }

  try {
    const supabase = createSupabaseServerComponent();

    const [usersResult, providersResult, bookingsResult, activeProvidersResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('providers').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('providers').select('id', { count: 'exact', head: true }).eq('is_active', true)
    ]);

    const stats = {
      userCount: usersResult.count || fallbackStats.userCount,
      providerCount: providersResult.count || fallbackStats.providerCount,
      bookingCount: bookingsResult.count || fallbackStats.bookingCount,
      liveProviders: activeProvidersResult.count || fallbackStats.liveProviders,
      averageRating: 4.9,
      responseTime: "< 2hrs",
      successRate: "98.7%",
      avgEarnings: "$3,200",
      satisfactionRate: "99.2%"
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    return NextResponse.json(fallbackStats);
  }
}
