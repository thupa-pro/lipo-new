'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Phone, MapPin, Calendar, Star, Zap, Brain, Sparkles, Bot, User, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { AIRecommendationEngine } from '@/lib/ai/recommendation-engine'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    providers?: any[]
    actions?: any[]
    recommendations?: any[]
  }
}

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  action: () => void
  color: string
}

interface AIInsight {
  type: 'tip' | 'recommendation' | 'warning' | 'success'
  content: string
  confidence: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI assistant. I can help you find the perfect service providers, book appointments, get recommendations, and answer any questions about our platform. What can I help you with today?',
      timestamp: new Date(),
      metadata: {
        intent: 'greeting',
        confidence: 1.0
      }
    }
  ])
  
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<AIInsight[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const aiEngine = useRef(new AIRecommendationEngine())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const analyzeIntent = async (message: string): Promise<any> => {
    // Simulate AI intent analysis
    const intents = [
      { pattern: /book|appointment|schedule/i, intent: 'booking', confidence: 0.9 },
      { pattern: /find|search|looking for/i, intent: 'search', confidence: 0.85 },
      { pattern: /price|cost|how much/i, intent: 'pricing', confidence: 0.8 },
      { pattern: /recommend|suggest|best/i, intent: 'recommendation', confidence: 0.9 },
      { pattern: /help|support|problem/i, intent: 'support', confidence: 0.75 },
      { pattern: /cancel|refund|dispute/i, intent: 'dispute', confidence: 0.85 }
    ]

    for (const { pattern, intent, confidence } of intents) {
      if (pattern.test(message)) {
        return { intent, confidence }
      }
    }

    return { intent: 'general', confidence: 0.6 }
  }

  const generateResponse = async (userMessage: string, intent: string): Promise<string> => {
    // Simulate AI response generation based on intent
    const responses = {
      booking: `I'd be happy to help you book an appointment! Based on your request, I can see you're looking for "${userMessage}". Let me find available providers for you. Would you like to specify a preferred date and time?`,
      search: `I'll help you find exactly what you're looking for. Based on "${userMessage}", I'm searching our network of verified providers. Here are some options that match your criteria:`,
      pricing: `Great question about pricing! For the service you mentioned, prices typically range based on several factors. Let me provide you with accurate pricing information and help you find the best value options.`,
      recommendation: `Based on your preferences and our AI analysis, I have some excellent recommendations for you. These providers have been carefully selected based on their ratings, availability, and match to your specific needs.`,
      support: `I'm here to help! Let me understand your issue better so I can provide the best assistance. Can you tell me more about what you're experiencing?`,
      dispute: `I understand your concern and I'm here to help resolve this. Let me connect you with our resolution team and gather the necessary information to address your issue promptly.`,
      general: `Thank you for your message! I'm here to help with any questions about our services, finding providers, booking appointments, or anything else you need assistance with.`
    }

    return responses[intent as keyof typeof responses] || responses.general
  }

  const generateInsights = (intent: string, confidence: number): AIInsight[] => {
    const baseInsights: AIInsight[] = []

    if (confidence > 0.8) {
      baseInsights.push({
        type: 'success',
        content: `High confidence match (${Math.round(confidence * 100)}%) - I understand your request clearly!`,
        confidence
      })
    } else if (confidence < 0.7) {
      baseInsights.push({
        type: 'warning',
        content: `I might need more details to better understand your request. Could you be more specific?`,
        confidence
      })
    }

    switch (intent) {
      case 'booking':
        baseInsights.push({
          type: 'tip',
          content: 'Pro tip: Booking during off-peak hours can save you up to 20%!',
          confidence: 0.9,
          action: {
            label: 'View Off-Peak Times',
            onClick: () => console.log('Show off-peak times')
          }
        })
        break
      case 'search':
        baseInsights.push({
          type: 'recommendation',
          content: 'Our AI found 12 highly-rated providers in your area with instant availability.',
          confidence: 0.85,
          action: {
            label: 'View Providers',
            onClick: () => console.log('Show providers')
          }
        })
        break
      case 'pricing':
        baseInsights.push({
          type: 'tip',
          content: 'Bundle multiple services together to unlock volume discounts!',
          confidence: 0.8,
          action: {
            label: 'Explore Bundles',
            onClick: () => console.log('Show bundles')
          }
        })
        break
    }

    return baseInsights
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Analyze intent
      const { intent, confidence } = await analyzeIntent(userMessage.content)
      
      // Generate response
      const responseContent = await generateResponse(userMessage.content, intent)
      
      // Get AI recommendations if applicable
      let recommendations = []
      if (intent === 'search' || intent === 'recommendation') {
        recommendations = await aiEngine.current.getRecommendations(
          'mock-user-id',
          { query: userMessage.content, intent },
          { location: 'user-location', category: 'auto-detect' }
        )
      }

      // Generate insights
      const newInsights = generateInsights(intent, confidence)
      setInsights(newInsights)

      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        metadata: {
          intent,
          confidence,
          recommendations: recommendations.slice(0, 3),
          actions: intent === 'booking' ? [
            { type: 'book', label: 'Book Now', providerId: 'mock-provider' },
            { type: 'schedule', label: 'Schedule Later', providerId: 'mock-provider' }
          ] : []
        }
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Chat Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an issue processing your request. Please try again or contact support if the problem persists.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions: QuickAction[] = [
    {
      id: 'find-plumber',
      label: 'Find Plumber',
      icon: MapPin,
      action: () => setInput('I need to find a plumber near me'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'book-cleaning',
      label: 'Book Cleaning',
      icon: Calendar,
      action: () => setInput('I want to book a house cleaning service'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'get-quote',
      label: 'Get Quote',
      icon: Star,
      action: () => setInput('Can you help me get quotes for home renovation?'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: Zap,
      action: () => setInput('I need emergency service right now'),
      color: 'bg-red-500 hover:bg-red-600'
    }
  ]

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/ai-assistant-avatar.png" alt="AI Assistant" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">AI Assistant</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                <Brain className="h-3 w-3 mr-1" />
                Advanced AI • Always Learning
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 dark:from-green-900 dark:to-blue-900 dark:text-green-200">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart Mode
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b bg-white/50 dark:bg-slate-800/50">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={action.action}
              className={`${action.color} text-white border-none whitespace-nowrap flex items-center space-x-1 hover:scale-105 transition-transform`}
            >
              <action.icon className="h-3 w-3" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* AI Insights Panel */}
      {insights.length > 0 && (
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </h4>
            {insights.map((insight, index) => (
              <Card key={index} className="p-3 border-l-4 border-l-blue-500 bg-white/80 dark:bg-slate-800/80">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {insight.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {insight.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                      {insight.type === 'tip' && <Sparkles className="h-4 w-4 text-blue-500" />}
                      {insight.type === 'recommendation' && <Star className="h-4 w-4 text-purple-500" />}
                      <span className="text-sm font-medium capitalize">{insight.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{insight.content}</p>
                  </div>
                  {insight.action && (
                    <Button size="sm" variant="ghost" onClick={insight.action.onClick} className="ml-2">
                      {insight.action.label}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-2 max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                {message.role === 'user' ? (
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="space-y-1">
                <Card className={`${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Show metadata for assistant messages */}
                    {message.role === 'assistant' && message.metadata && (
                      <div className="mt-3 space-y-2">
                        {message.metadata.intent && (
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              Intent: {message.metadata.intent}
                            </Badge>
                            {message.metadata.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round(message.metadata.confidence * 100)}% confident
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {message.metadata.recommendations && message.metadata.recommendations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium mb-2">Top Recommendations:</p>
                            <div className="space-y-1">
                              {message.metadata.recommendations.slice(0, 2).map((rec: any, index: number) => (
                                <div key={index} className="text-xs p-2 bg-slate-50 dark:bg-slate-700 rounded border">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{rec.name || `Provider ${index + 1}`}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {Math.round(rec.confidence * 100)}% match
                                    </Badge>
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    {rec.description || 'Highly rated local provider'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {message.metadata.actions && message.metadata.actions.length > 0 && (
                          <div className="flex space-x-2 mt-2">
                            {message.metadata.actions.map((action: any, index: number) => (
                              <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                onClick={() => console.log('Action:', action)}
                                className="text-xs"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className={`flex items-center space-x-1 text-xs text-slate-500 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <Clock className="h-3 w-3" />
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.metadata?.confidence && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <Brain className="h-3 w-3" />
                      <span>{Math.round(message.metadata.confidence * 100)}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-2 max-w-[70%]">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">AI is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about our services..."
              className="pr-12 min-h-[44px] resize-none border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
              disabled={isLoading}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={isListening ? stopListening : startListening}
              className={`absolute right-1 top-1 h-8 w-8 p-0 ${
                isListening ? 'text-red-500 hover:text-red-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              disabled={!recognitionRef.current}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-powered responses
            </span>
            <span className="flex items-center">
              <Brain className="h-3 w-3 mr-1" />
              Context-aware suggestions
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {recognitionRef.current && (
              <Badge variant="outline" className="text-xs">
                <Mic className="h-3 w-3 mr-1" />
                Voice enabled
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Press Enter to send
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
