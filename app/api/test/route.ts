import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "Loconomy API is working!", 
    timestamp: new Date().toISOString(),
    status: "All systems operational" 
  })
}
