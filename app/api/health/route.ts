import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/client"

export async function GET() {
  const startTime = Date.now()

  try {
    // Check database connectivity
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase.from("health_check").select("*").limit(1)

    if (error && error.code !== "PGRST116") {
      // PGRST116 = table doesn't exist, which is fine
      throw error
    }

    const dbLatency = Date.now() - startTime

    // Check external services
    const checks = {
      database: {
        status: "healthy",
        latency: dbLatency,
        timestamp: new Date().toISOString(),
      },
      memory: {
        usage: process.memoryUsage(),
        timestamp: new Date().toISOString(),
      },
      uptime: {
        seconds: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      checks,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        checks: {
          database: {
            status: "unhealthy",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          },
        },
      },
      { status: 503 },
    )
  }
}
