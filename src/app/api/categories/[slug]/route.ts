import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createClient();
    const { slug } = params;

    // Get search parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '1000');
    const maxDistance = parseInt(searchParams.get('distance') || '25');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const verifiedOnly = searchParams.get('verified') === 'true';
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');

    // First, get the category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Build the query for providers in this category
    let query = supabase
      .from('providers')
      .select(`
        id,
        user_id,
        business_name,
        bio,
        cover_photo_url,
        rating_average,
        rating_count,
        response_time_minutes,
        location,
        created_at,
        users!inner(
          display_name,
          is_verified
        ),
        services!inner(
          id,
          name,
          description,
          price,
          duration_minutes
        )
      `)
      .eq('category_id', category.id)
      .eq('is_active', true);

    // Apply verified filter
    if (verifiedOnly) {
      query = query.eq('users.is_verified', true);
    }

    // Execute the query
    const { data: providers, error: providersError } = await query;

    if (providersError) {
      console.error('Error fetching providers:', providersError);
      return NextResponse.json(
        { error: 'Failed to fetch providers' },
        { status: 500 }
      );
    }

    // Filter and process providers
    let filteredProviders = providers || [];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProviders = filteredProviders.filter(provider =>
        provider.business_name.toLowerCase().includes(searchLower) ||
        provider.bio?.toLowerCase().includes(searchLower) ||
        provider.services?.some((service: any) =>
          service.name.toLowerCase().includes(searchLower) ||
          service.description?.toLowerCase().includes(searchLower)
        )
      );
    }

    // Price filter
    filteredProviders = filteredProviders.filter(provider => {
      if (!provider.services || provider.services.length === 0) return false;
      const minServicePrice = Math.min(...provider.services.map((s: any) => s.price));
      return minServicePrice >= minPrice && minServicePrice <= maxPrice;
    });

    // Calculate distance if user location provided
    if (lat !== 0 && lng !== 0) {
      filteredProviders = filteredProviders.map(provider => {
        let distance = null;
        
        if (provider.location && typeof provider.location === 'object' && 'coordinates' in provider.location) {
          const [providerLng, providerLat] = (provider.location as any).coordinates;
          
          // Haversine formula for distance calculation
          const R = 3959; // Earth's radius in miles
          const dLat = (providerLat - lat) * Math.PI / 180;
          const dLng = (providerLng - lng) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat * Math.PI / 180) * Math.cos(providerLat * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distance = R * c;
        }
        
        return { ...provider, distance };
      });

      // Filter by distance
      filteredProviders = filteredProviders.filter(provider => 
        provider.distance === null || provider.distance <= maxDistance
      );
    }

    // Sort providers
    switch (sortBy) {
      case 'rating':
        filteredProviders.sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0));
        break;
      case 'price_low':
        filteredProviders.sort((a, b) => {
          const aMin = a.services?.length ? Math.min(...a.services.map((s: any) => s.price)) : 0;
          const bMin = b.services?.length ? Math.min(...b.services.map((s: any) => s.price)) : 0;
          return aMin - bMin;
        });
        break;
      case 'price_high':
        filteredProviders.sort((a, b) => {
          const aMin = a.services?.length ? Math.min(...a.services.map((s: any) => s.price)) : 0;
          const bMin = b.services?.length ? Math.min(...b.services.map((s: any) => s.price)) : 0;
          return bMin - aMin;
        });
        break;
      case 'distance':
        filteredProviders.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
      case 'response_time':
        filteredProviders.sort((a, b) => 
          (a.response_time_minutes || 999) - (b.response_time_minutes || 999)
        );
        break;
      case 'newest':
        filteredProviders.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    // Format providers for frontend
    const formattedProviders = filteredProviders.map(provider => ({
      id: provider.id,
      business_name: provider.business_name,
      bio: provider.bio,
      cover_photo_url: provider.cover_photo_url,
      rating_average: provider.rating_average || 0,
      rating_count: provider.rating_count || 0,
      response_time_minutes: provider.response_time_minutes,
      is_verified: provider.users?.is_verified || false,
      distance: provider.distance,
      services: provider.services || [],
      starting_price: provider.services?.length 
        ? Math.min(...provider.services.map((s: any) => s.price))
        : null,
      service_count: provider.services?.length || 0,
    }));

    // Calculate stats
    const stats = {
      total_providers: formattedProviders.length,
      avg_rating: formattedProviders.length > 0 
        ? formattedProviders.reduce((sum, p) => sum + p.rating_average, 0) / formattedProviders.length
        : 0,
      avg_price: formattedProviders.length > 0 && formattedProviders.some(p => p.starting_price)
        ? formattedProviders
            .filter(p => p.starting_price)
            .reduce((sum, p) => sum + (p.starting_price || 0), 0) / 
          formattedProviders.filter(p => p.starting_price).length
        : 0,
      verified_count: formattedProviders.filter(p => p.is_verified).length,
    };

    return NextResponse.json({
      category,
      providers: formattedProviders,
      stats,
      filters: {
        search,
        minPrice,
        maxPrice,
        maxDistance,
        sortBy,
        verifiedOnly,
      }
    });

  } catch (error) {
    console.error('Category API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
