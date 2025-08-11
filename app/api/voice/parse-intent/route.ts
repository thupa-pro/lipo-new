import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { llmClient } from '@/lib/ai/llm-client'

const parseIntentSchema = z.object({
  command: z.string().min(1).max(500),
})

interface VoiceIntent {
  action: 'search' | 'book' | 'reschedule' | 'cancel' | 'help' | 'unknown'
  query?: string
  serviceType?: string
  location?: string
  datetime?: string
  confidence: number
}

const intentExtractionPrompt = `You are a voice assistant for a local services marketplace called Loconomy. 
Your job is to parse user voice commands and extract structured intent.

Parse the following voice command and return a JSON object with this exact structure:
{
  "action": "search|book|reschedule|cancel|help|unknown",
  "query": "the full user query if searching",
  "serviceType": "type of service like plumber, cleaner, electrician",
  "location": "location mentioned by user if any",
  "datetime": "date/time mentioned by user if any",
  "confidence": 0.0-1.0
}

Rules:
- action must be one of: search, book, reschedule, cancel, help, unknown
- serviceType should be standardized (e.g., "house cleaning" not "cleaning lady")
- confidence should reflect how sure you are about the intent
- If unclear, use "unknown" action with low confidence

Examples:
"Find a plumber near me" → {"action": "search", "serviceType": "plumber", "confidence": 0.95}
"Book a house cleaner for tomorrow" → {"action": "book", "serviceType": "house cleaning", "datetime": "tomorrow", "confidence": 0.9}
"I need help" → {"action": "help", "confidence": 0.95}

User command: `

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { command } = parseIntentSchema.parse(body)

    // Use LLM to extract intent from voice command
    const response = await llmClient.generateStructuredOutput<VoiceIntent>(
      `${intentExtractionPrompt}"${command}"`,
      {
        action: 'string',
        query: 'string',
        serviceType: 'string', 
        location: 'string',
        datetime: 'string',
        confidence: 'number'
      },
      {
        userId: 'voice-system',
        model: 'gemini-1.5-flash',
        maxTokens: 200,
      }
    )

    const intent = response.content

    // Validate and normalize the response
    const normalizedIntent: VoiceIntent = {
      action: intent.action || 'unknown',
      query: intent.query?.trim() || undefined,
      serviceType: intent.serviceType?.toLowerCase().trim() || undefined,
      location: intent.location?.trim() || undefined,
      datetime: intent.datetime?.trim() || undefined,
      confidence: Math.max(0, Math.min(1, intent.confidence || 0)),
    }

    // If confidence is too low, mark as unknown
    if (normalizedIntent.confidence < 0.3) {
      normalizedIntent.action = 'unknown'
      normalizedIntent.confidence = 0.2
    }

    return NextResponse.json(normalizedIntent)

  } catch (error) {
    console.error('Voice intent parsing error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400 }
      )
    }

    // Return a fallback unknown intent
    return NextResponse.json({
      action: 'unknown',
      confidence: 0.1,
    } as VoiceIntent)
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Voice Intent Parser API',
    endpoints: {
      'POST /': 'Parse voice command into structured intent',
    },
    supported_actions: ['search', 'book', 'reschedule', 'cancel', 'help'],
    supported_services: [
      'plumber',
      'electrician', 
      'house cleaning',
      'handyman',
      'landscaping',
      'moving services',
      'appliance repair',
      'hvac technician',
      'painter',
      'carpenter'
    ]
  })
}
