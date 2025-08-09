import { NextRequest, NextResponse } from "next/server"
import { auth } from '@clerk/nextjs/server'
import { createSupabaseAdminClient } from "@/lib/supabase/client"

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createSupabaseAdminClient()

    if (id && id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const targetId = id || userId

    // Get user profile
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", targetId)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createSupabaseAdminClient()
    const body = await request.json()
    const { display_name, phone, avatar_url } = body

    // Update user profile
    const { data: user, error } = await supabase
      .from("users")
      .update({
        display_name,
        phone,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
