import { NextResponse } from 'next/server';
import { createSupabaseServerComponent } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env-check';

const mockProviders = [
  {
    id: '1',
    business_name: "Sarah's Cleaning Service",
    bio: "Professional house cleaning with eco-friendly products",
    rating_average: 4.9,
    rating_count: 127,
    response_time_minutes: 120,
    users: {
      display_name: "Sarah Mitchell",
      avatar_url: null
    },
    categories: {
      name: "House Cleaning",
      slug: "house-cleaning"
    },
    location: "2.3 miles away",
    hourlyRate: 35,
    tags: ["Eco-Friendly", "Pet-Safe", "Same-Day"],
    verified: true,
    completedJobs: 245,
    specialty: "Deep Cleaning",
    badge: "Elite Provider"
  },
  {
    id: '2',
    business_name: "Rodriguez Handyman Services",
    bio: "Licensed handyman for all your home repair needs",
    rating_average: 4.8,
    rating_count: 89,
    response_time_minutes: 60,
    users: {
      display_name: "Michael Rodriguez",
      avatar_url: null
    },
    categories: {
      name: "Home Repair",
      slug: "home-repair"
    },
    location: "1.8 miles away",
    hourlyRate: 45,
    tags: ["Licensed", "Insured", "Emergency"],
    verified: true,
    completedJobs: 156,
    specialty: "Electrical Work",
    badge: "Top Rated"
  },
  {
    id: '3',
    business_name: "FitLife Personal Training",
    bio: "Certified personal trainer specializing in weight loss and strength training",
    rating_average: 4.9,
    rating_count: 203,
    response_time_minutes: 90,
    users: {
      display_name: "Jessica Chen",
      avatar_url: null
    },
    categories: {
      name: "Personal Training",
      slug: "personal-training"
    },
    location: "0.9 miles away",
    hourlyRate: 65,
    tags: ["Certified", "Nutrition", "Flexible"],
    verified: true,
    completedJobs: 312,
    specialty: "Weight Loss",
    badge: "Featured"
  }
];

const mockCategories = [
  { id: '1', name: 'Home Services', slug: 'home-services' },
  { id: '2', name: 'Fitness & Wellness', slug: 'fitness-wellness' },
  { id: '3', name: 'Education', slug: 'education' },
  { id: '4', name: 'Tech Support', slug: 'tech-support' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const location = searchParams.get('location');
  const category = searchParams.get('category');

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      providers: mockProviders,
      categories: mockCategories
    });
  }

  try {
    const supabase = createSupabaseServerComponent();
    
    // Fetch providers
    let providersQuery = supabase
      .from('providers')
      .select(`
        *,
        users (display_name, avatar_url),
        categories (name, slug),
        reviews (rating)
      `)
      .eq('is_active', true);

    // Apply filters if provided
    if (category) {
      providersQuery = providersQuery.eq('categories.slug', category);
    }

    // For now, limit results for performance
    const { data: providers, error: providersError } = await providersQuery
      .order('rating_average', { ascending: false })
      .limit(12);

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('parent_id', null)
      .order('sort_order');

    if (providersError || categoriesError) {
      console.error('Error fetching data:', providersError || categoriesError);
      return NextResponse.json({
        providers: mockProviders,
        categories: mockCategories
      });
    }

    return NextResponse.json({
      providers: providers || mockProviders,
      categories: categories || mockCategories
    });
  } catch (error) {
    console.error('Error in providers-browse API:', error);
    return NextResponse.json({
      providers: mockProviders,
      categories: mockCategories
    });
  }
}
