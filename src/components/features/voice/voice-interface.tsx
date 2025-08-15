'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface VoiceSearchResult {
  id: string
  name: string
  description: string
  category: string
  rating: number
  price: number
  location: string
  distance: number
}

interface VoiceIntent {
  action: 'search' | 'book' | 'reschedule' | 'cancel' | 'help'
  query?: string
  serviceType?: string
  location?: string
  datetime?: string
  confidence: number
}

interface VoiceInterfaceProps {
  onSearchResults?: (results: VoiceSearchResult[]) => void
  onBookingAction?: (action: string, details: any) => void
  className?: string
}

export default function VoiceInterface({
  onSearchResults,
  onBookingAction,
  className,
}: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [intent, setIntent] = useState<VoiceIntent | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [results, setResults] = useState<VoiceSearchResult[]>([])
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const { toast } = useToast()

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      const recognition = recognitionRef.current
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setTranscript('')
      }

      recognition.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)

        if (finalTranscript) {
          processVoiceCommand(finalTranscript)
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setIsProcessing(false)
        
        if (event.error === 'not-allowed') {
          toast({
            title: 'Microphone Access Denied',
            description: 'Please allow microphone access to use voice search.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Voice Recognition Error',
            description: 'Unable to process voice input. Please try again.',
            variant: 'destructive',
          })
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [toast])

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true)
    
    try {
      // Extract intent from voice command using AI
      const response = await fetch('/api/voice/parse-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      })

      if (!response.ok) {
        throw new Error('Failed to parse voice command')
      }

      const parsedIntent: VoiceIntent = await response.json()
      setIntent(parsedIntent)

      // Handle different intents
      switch (parsedIntent.action) {
        case 'search':
          await handleVoiceSearch(parsedIntent)
          break
        case 'book':
          await handleVoiceBooking(parsedIntent)
          break
        case 'help':
          speakResponse('I can help you search for services, book appointments, or manage your bookings. What would you like to do?')
          break
        default:
          speakResponse('I didn\'t understand that command. Try saying "search for a plumber" or "book a cleaner".')
      }
    } catch (error) {
      console.error('Voice processing error:', error)
      toast({
        title: 'Processing Error',
        description: 'Unable to process your voice command. Please try again.',
        variant: 'destructive',
      })
      speakResponse('Sorry, I had trouble understanding that. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceSearch = async (intent: VoiceIntent) => {
    try {
      const response = await fetch('/api/voice/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: intent.query,
          serviceType: intent.serviceType,
          location: intent.location,
        }),
      })

      if (!response.ok) {
        throw new Error('Voice search failed')
      }

      const searchResults: VoiceSearchResult[] = await response.json()
      setResults(searchResults)
      onSearchResults?.(searchResults)

      // Provide voice feedback
      if (searchResults.length === 0) {
        speakResponse('I couldn\'t find any services matching your request. Try a different search term.')
      } else if (searchResults.length === 1) {
        const result = searchResults[0]
        speakResponse(`I found ${result.name}, a ${result.category} service with ${result.rating} stars, priced at $${result.price}. Would you like to book this service?`)
      } else {
        const topResult = searchResults[0]
        speakResponse(`I found ${searchResults.length} services. The top result is ${topResult.name} with ${topResult.rating} stars at $${topResult.price}. Would you like to hear more options or book this one?`)
      }
    } catch (error) {
      console.error('Voice search error:', error)
      speakResponse('Sorry, I had trouble searching for services. Please try again.')
    }
  }

  const handleVoiceBooking = async (intent: VoiceIntent) => {
    // This would integrate with the booking system
    speakResponse('I\'ll help you book that service. Please confirm the details on screen.')
    onBookingAction?.('initiate_booking', intent)
  }

  const speakResponse = useCallback((text: string) => {
    if (!audioEnabled || !synthesisRef.current) return

    // Cancel any ongoing speech
    synthesisRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    // Use a natural voice if available
    const voices = synthesisRef.current.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.default
    )
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    synthesisRef.current.speak(utterance)
  }, [audioEnabled])

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Voice Not Supported',
        description: 'Voice recognition is not supported in your browser.',
        variant: 'destructive',
      })
      return
    }

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Start recognition error:', error)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    if (!audioEnabled) {
      speakResponse('Voice responses enabled.')
    }
  }

  return (
    <div className={className}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Controls */}
          <div className="flex justify-center gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              variant={isListening ? 'destructive' : 'default'}
              size="lg"
              className="flex-1"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : isListening ? (
                <MicOff className="w-4 h-4 mr-2" />
              ) : (
                <Mic className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? 'Processing...' : isListening ? 'Stop' : 'Talk'}
            </Button>
            
            <Button
              onClick={toggleAudio}
              variant="outline"
              size="lg"
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="space-y-2">
            {isListening && (
              <Badge variant="default" className="w-full justify-center">
                Listening...
              </Badge>
            )}
            
            {isProcessing && (
              <Badge variant="secondary" className="w-full justify-center">
                Processing command...
              </Badge>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">You said:</p>
              <p className="text-sm font-medium">{transcript}</p>
            </div>
          )}

          {/* Intent Display */}
          {intent && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                Intent detected:
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {intent.action}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {Math.round(intent.confidence * 100)}% confidence
                </span>
              </div>
              {intent.query && (
                <p className="text-sm mt-1">{intent.query}</p>
              )}
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Found {results.length} services:</p>
              {results.slice(0, 3).map((result) => (
                <div key={result.id} className="p-2 border rounded-lg text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-muted-foreground">{result.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${result.price}</p>
                      <p className="text-muted-foreground">⭐ {result.rating}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help Text */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Try saying:</p>
            <p>&quot;Find a plumber near me&quot;</p>
            <p>&quot;Book a house cleaner for tomorrow&quot;</p>
            <p>&quot;Show me electricians&quot;</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Type declarations for speech APIs
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
