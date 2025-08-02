import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/client"

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient()
    
    // Test basic connection and table operations
    const tests = {
      connection: { status: 'pending', result: null },
      categories: { status: 'pending', result: null },
      healthCheck: { status: 'pending', result: null }
    }

    // Test 1: Basic connection
    try {
      const { data, error } = await supabase.from("health_check").select("count")
      tests.connection = { 
        status: error ? 'failed' : 'passed', 
        result: error ? error.message : `Connected successfully` 
      }
    } catch (error) {
      tests.connection = { 
        status: 'failed', 
        result: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    // Test 2: Categories table
    try {
      const { data, error } = await supabase.from("categories").select("id, name, slug").limit(3)
      tests.categories = { 
        status: error ? 'failed' : 'passed', 
        result: error ? error.message : `Found ${data?.length || 0} categories` 
      }
    } catch (error) {
      tests.categories = { 
        status: 'failed', 
        result: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    // Test 3: Health check table specifically
    try {
      const { data, error } = await supabase.from("health_check").select("*").limit(1)
      tests.healthCheck = { 
        status: error ? 'failed' : 'passed', 
        result: error ? error.message : `Health check table accessible` 
      }
    } catch (error) {
      tests.healthCheck = { 
        status: 'failed', 
        result: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    const allPassed = Object.values(tests).every(test => test.status === 'passed')

    return NextResponse.json({
      status: allPassed ? 'healthy' : 'partial',
      timestamp: new Date().toISOString(),
      tests,
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeEnv: process.env.NODE_ENV,
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: {
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          nodeEnv: process.env.NODE_ENV,
        }
      },
      { status: 500 }
    )
  }
}
