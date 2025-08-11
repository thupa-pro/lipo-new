import { GoogleGenerativeAI } from '@google/generative-ai'

export interface LLMUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
}

export interface LLMResponse<T = string> {
  content: T
  usage: LLMUsage
  model: string
  timestamp: Date
}

export interface TokenBudget {
  dailyLimit: number
  monthlyLimit: number
  currentDaily: number
  currentMonthly: number
}

class LLMClient {
  private client: GoogleGenerativeAI
  private defaultModel = 'gemini-1.5-flash'
  private tokenPricing = {
    'gemini-1.5-flash': {
      input: 0.075 / 1000000, // $0.075 per 1M input tokens
      output: 0.30 / 1000000,  // $0.30 per 1M output tokens
    }
  }

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is required')
    }
    this.client = new GoogleGenerativeAI(apiKey)
  }

  async checkTokenBudget(userId: string): Promise<TokenBudget> {
    // In production, this would check against a database or cache
    // For now, return safe defaults
    return {
      dailyLimit: 10000,
      monthlyLimit: 100000,
      currentDaily: 0,
      currentMonthly: 0,
    }
  }

  async updateTokenUsage(userId: string, usage: LLMUsage): Promise<void> {
    // In production, this would update the database
    console.log(`Token usage for user ${userId}:`, usage)
  }

  private calculateCost(usage: LLMUsage, model: string): number {
    const pricing = this.tokenPricing[model as keyof typeof this.tokenPricing]
    if (!pricing) return 0
    
    return (usage.promptTokens * pricing.input) + (usage.completionTokens * pricing.output)
  }

  async generateText(
    prompt: string,
    options: {
      userId?: string
      model?: string
      maxTokens?: number
      temperature?: number
      systemPrompt?: string
    } = {}
  ): Promise<LLMResponse> {
    const model = options.model || this.defaultModel
    const userId = options.userId || 'anonymous'

    // Check token budget
    const budget = await this.checkTokenBudget(userId)
    if (budget.currentDaily >= budget.dailyLimit) {
      throw new Error('Daily token limit exceeded')
    }

    try {
      const genAI = this.client.getGenerativeModel({ 
        model,
        generationConfig: {
          maxOutputTokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
        }
      })

      const fullPrompt = options.systemPrompt 
        ? `${options.systemPrompt}\n\nUser: ${prompt}`
        : prompt

      const result = await genAI.generateContent(fullPrompt)
      const response = await result.response
      const text = response.text()

      // Estimate token usage (Gemini doesn't provide exact counts)
      const promptTokens = Math.ceil(fullPrompt.length / 4)
      const completionTokens = Math.ceil(text.length / 4)
      const totalTokens = promptTokens + completionTokens

      const usage: LLMUsage = {
        promptTokens,
        completionTokens,
        totalTokens,
        cost: this.calculateCost({ promptTokens, completionTokens, totalTokens, cost: 0 }, model)
      }

      // Update usage tracking
      await this.updateTokenUsage(userId, usage)

      return {
        content: text,
        usage,
        model,
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('LLM generation error:', error)
      throw new Error('Failed to generate AI response')
    }
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: object,
    options: {
      userId?: string
      model?: string
      maxTokens?: number
    } = {}
  ): Promise<LLMResponse<T>> {
    const systemPrompt = `You are a helpful assistant that responds with valid JSON matching this schema: ${JSON.stringify(schema, null, 2)}

IMPORTANT: Your response must be valid JSON only, no additional text or formatting.`

    const response = await this.generateText(prompt, {
      ...options,
      systemPrompt,
    })

    try {
      const parsed = JSON.parse(response.content) as T
      return {
        ...response,
        content: parsed,
      }
    } catch (error) {
      throw new Error('Failed to parse structured response from AI')
    }
  }
}

export const llmClient = new LLMClient()
