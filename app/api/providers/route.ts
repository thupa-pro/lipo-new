import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/client"

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const location = searchParams.get("location")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let query = supabase
      .from("providers")
      .select(`
        *,
        users!inner(display_name, avatar_url),
        categories(name, slug),
        services(*)
      `)
      .eq("is_active", true)

    // Apply filters
    if (category) {
      query = query.eq("categories.slug", category)
    }

    if (search) {
      query = query.or(`business_name.ilike.%${search}%,bio.ilike.%${search}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    // Order by rating
    query = query.order("rating_average", { ascending: false })

    const { data: providers, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ providers, page, limit })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check if user is authenticated
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { business_name, bio, category_id, cover_photo_url } = body

    // Create provider profile
    const { data: provider, error } = await supabase
      .from("providers")
      .insert({
        user_id: session.user.id,
        business_name,
        bio,
        category_id,
        cover_photo_url
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ provider }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
