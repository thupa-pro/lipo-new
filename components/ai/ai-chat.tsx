'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  Send, 
  Brain, 
  Sparkles, 
  Clock,
  MapPin,
  DollarSign,
  Star,
  Lightbulb,
  Zap,
  User,
  Bot,
  Calendar,
  Phone,
  Settings,
  Mic,
  MicOff
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  metadata?: {
    suggestions?: string[]
    actions?: Array<{
      type: 'book' | 'call' | 'view' | 'search'
      label: string
      data: any
    }>
    providers?: Array<{
      id: string
      name: string
      rating: number
      price: string
    }>
    insights?: Array<{
      type: string
      message: string
    }>
  }
  status?: 'sending' | 'sent' | 'error'
}

interface AIChatProps {
  userId?: string
  context?: {
    location?: string
    budget?: string
    urgency?: string
  }
  onActionTrigger?: (action: string, data: any) => void
  className?: string
}

export default function AIChat({ 
  userId, 
  context = {}, 
  onActionTrigger,
  className = ""
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: "Hi! I'm your AI assistant for finding local services. I can help you discover the perfect service providers based on your needs, location, and preferences. What service are you looking for today?",
      timestamp: new Date(),
      metadata: {
        suggestions: [
          "Find a plumber near me",
          "Book house cleaning service",
          "Emergency electrician",
          "Dog walker in my area",
          "Wedding photographer recommendations"
        ]
      }
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI processing delay
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(content, context)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = async (userInput: string, context: any): Promise<Message> => {
    // Simulate AI processing with different response types
    const input = userInput.toLowerCase()
    
    if (input.includes('plumber') || input.includes('plumbing')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "I found several excellent plumbers in your area! Based on your location and typical pricing, here are my top AI-powered recommendations:",
        timestamp: new Date(),
        metadata: {
          providers: [
            { id: '1', name: 'Elite Plumbing Services', rating: 4.9, price: '$75-150/hr' },
            { id: '2', name: 'Quick Fix Plumbing', rating: 4.7, price: '$60-120/hr' },
            { id: '3', name: 'Pro Drain Solutions', rating: 4.8, price: '$80-140/hr' }
          ],
          actions: [
            { type: 'book', label: 'Book Now', data: { service: 'plumbing' } },
            { type: 'call', label: 'Call Provider', data: { phone: true } },
            { type: 'view', label: 'View Details', data: { details: true } }
          ],
          insights: [
            { type: 'tip', message: 'Emergency plumbing rates are typically 1.5x higher after 6 PM' },
            { type: 'trend', message: 'Plumbing demand is 23% higher this week due to cold weather' }
          ]
        }
      }
    }

    if (input.includes('clean') || input.includes('house') || input.includes('maid')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "Perfect! I can help you find house cleaning services. Based on your preferences, I recommend these highly-rated cleaning professionals:",
        timestamp: new Date(),
        metadata: {
          providers: [
            { id: '4', name: 'Sparkle Clean Pro', rating: 4.9, price: '$25-40/hr' },
            { id: '5', name: 'Green Clean Solutions', rating: 4.8, price: '$30-45/hr' },
            { id: '6', name: 'Maid to Perfection', rating: 4.7, price: '$28-42/hr' }
          ],
          suggestions: [
            "Schedule weekly recurring cleaning",
            "One-time deep cleaning service",
            "Move-in/move-out cleaning",
            "Post-construction cleaning"
          ],
          insights: [
            { type: 'savings', message: 'Save 15% by booking recurring weekly service' },
            { type: 'timing', message: 'Tuesday-Thursday bookings often have better availability' }
          ]
        }
      }
    }

    if (input.includes('emergency') || input.includes('urgent') || input.includes('asap')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "I understand this is urgent! I'm searching for providers with immediate availability and emergency response capabilities:",
        timestamp: new Date(),
        metadata: {
          providers: [
            { id: '7', name: '24/7 Emergency Services', rating: 4.8, price: 'Emergency rates apply' },
            { id: '8', name: 'Rapid Response Repair', rating: 4.6, price: 'Call for pricing' }
          ],
          actions: [
            { type: 'call', label: 'Call Emergency Line', data: { emergency: true } },
            { type: 'book', label: 'Request Immediate Service', data: { urgent: true } }
          ],
          insights: [
            { type: 'warning', message: 'Emergency services typically cost 50-100% more than standard rates' },
            { type: 'timing', message: 'Average emergency response time in your area: 45 minutes' }
          ]
        }
      }
    }

    if (input.includes('price') || input.includes('cost') || input.includes('budget') || input.includes('cheap')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "I'll help you find cost-effective options! Here are some budget-friendly providers with excellent value:",
        timestamp: new Date(),
        metadata: {
          suggestions: [
            "Set a specific budget range",
            "Compare multiple quotes",
            "Consider off-peak scheduling for discounts",
            "Ask about package deals for multiple services"
          ],
          insights: [
            { type: 'savings', message: 'Booking during weekdays can save 10-20% compared to weekends' },
            { type: 'tip', message: 'Many providers offer senior, military, or first-time customer discounts' }
          ]
        }
      }
    }

    if (input.includes('best') || input.includes('recommend') || input.includes('top rated')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "Based on AI analysis of ratings, reviews, and performance data, here are the top-rated service providers in your area:",
        timestamp: new Date(),
        metadata: {
          providers: [
            { id: '9', name: 'Premium Pro Services', rating: 4.95, price: 'Premium pricing' },
            { id: '10', name: 'Excellence First', rating: 4.92, price: 'Competitive rates' },
            { id: '11', name: 'Five Star Solutions', rating: 4.89, price: 'Standard pricing' }
          ],
          insights: [
            { type: 'quality', message: 'These providers have 98%+ customer satisfaction rates' },
            { type: 'reliability', message: 'Average response time: 15 minutes or less' }
          ]
        }
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: "I'd be happy to help you find the right service provider! Could you tell me more about what specific service you need? For example: plumbing, cleaning, electrical work, landscaping, etc. Also, feel free to mention your location, budget, or any specific requirements you have.",
      timestamp: new Date(),
      metadata: {
        suggestions: [
          "Home maintenance services",
          "Cleaning and housekeeping",
          "Lawn and garden care",
          "Automotive services",
          "Personal services",
          "Pet care services",
          "Event services",
          "Professional services"
        ]
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleActionClick = (action: any) => {
    onActionTrigger?.(action.type, action.data)
  }

  const toggleVoiceRecording = () => {
    setIsListening(!isListening)
    // Implement voice recognition here
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Brain className="w-5 h-5" />
              AI Service Assistant
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by AI
              </Badge>
            </CardTitle>
            <CardDescription>
              Get personalized service recommendations and instant booking assistance
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] space-y-2`}>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white ml-auto' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {/* AI Message Metadata */}
                  {message.type === 'ai' && message.metadata && (
                    <div className="space-y-3">
                      {/* Provider Cards */}
                      {message.metadata.providers && (
                        <div className="space-y-2">
                          {message.metadata.providers.map((provider) => (
                            <Card key={provider.id} className="p-3 border border-gray-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">{provider.name}</div>
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span>{provider.rating}</span>
                                    <DollarSign className="w-3 h-3" />
                                    <span>{provider.price}</span>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {message.metadata.actions && (
                        <div className="flex flex-wrap gap-2">
                          {message.metadata.actions.map((action, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              variant="outline"
                              onClick={() => handleActionClick(action)}
                              className="text-xs"
                            >
                              {action.type === 'call' && <Phone className="w-3 h-3 mr-1" />}
                              {action.type === 'book' && <Calendar className="w-3 h-3 mr-1" />}
                              {action.type === 'view' && <Star className="w-3 h-3 mr-1" />}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* AI Insights */}
                      {message.metadata.insights && (
                        <div className="space-y-2">
                          {message.metadata.insights.map((insight, idx) => (
                            <div key={idx} className={`p-2 rounded text-xs ${
                              insight.type === 'tip' ? 'bg-blue-50 text-blue-700' :
                              insight.type === 'warning' ? 'bg-orange-50 text-orange-700' :
                              insight.type === 'savings' ? 'bg-green-50 text-green-700' :
                              'bg-purple-50 text-purple-700'
                            }`}>
                              <div className="flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                <span>{insight.message}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {message.metadata.suggestions && (
                        <div className="flex flex-wrap gap-2">
                          {message.metadata.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Ask me about any service you need..."
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVoiceRecording}
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 ${
                  isListening ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button 
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 text-center">
            Powered by advanced AI • Real-time service matching • Secure & private
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
