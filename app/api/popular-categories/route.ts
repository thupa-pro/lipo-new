import { NextResponse } from 'next/server';
import { createSupabaseServerComponent } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env-check';

const defaultCategories = [
  {
    id: '1',
    name: 'Home Services',
    slug: 'home-services',
    description: 'Plumbing, electrical, cleaning, and repairs. Professional home maintenance.',
    icon_name: 'home'
  },
  {
    id: '2', 
    name: 'Wellness & Fitness',
    slug: 'wellness-fitness',
    description: 'Personal trainers, yoga, nutrition coaching, and wellness services.',
    icon_name: 'dumbbell'
  },
  {
    id: '3',
    name: 'Education & Tutoring',
    slug: 'education-tutoring',
    description: 'Expert tutors for all subjects, test prep, and skill development.',
    icon_name: 'graduation-cap'
  },
  {
    id: '4',
    name: 'Tech & Repair',
    slug: 'tech-repair',
    description: 'Device repair, IT support, and technical troubleshooting.',
    icon_name: 'monitor'
  },
  {
    id: '5',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car repair, maintenance, detailing, and automotive expertise.',
    icon_name: 'car'
  },
  {
    id: '6',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Event planning, photography, music, and entertainment services.',
    icon_name: 'party-popper'
  },
  {
    id: '7',
    name: 'Business Services',
    slug: 'business-services',
    description: 'Consulting, accounting, legal, and professional business support.',
    icon_name: 'briefcase'
  },
  {
    id: '8',
    name: 'Creative Services',
    slug: 'creative-services',
    description: 'Design, writing, marketing, and creative professional services.',
    icon_name: 'palette'
  }
];

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(defaultCategories);
  }

  try {
    const supabase = createSupabaseServerComponent();

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug, description, icon_name')
      .eq('parent_id', null)
      .order('sort_order')
      .limit(8);

    return NextResponse.json(categories || defaultCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(defaultCategories);
  }
}
