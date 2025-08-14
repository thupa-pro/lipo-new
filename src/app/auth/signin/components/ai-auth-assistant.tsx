"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  MessageCircle, 
  HelpCircle, 
  Key, 
  Mail, 
  Shield, 
  Sparkles,
  ChevronRight,
  Bot,
  Lightbulb,
  Zap
} from "lucide-react";

interface AIMessage {
  id: string;
  type: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AIAuthAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'greeting' | 'help' | 'troubleshoot'>('greeting');

  // AI-powered assistance scenarios
  const assistanceScenarios = [
    {
      id: 'forgot-password',
      icon: Key,
      title: 'Forgot Password?',
      description: 'I\'ll guide you through secure password recovery',
      action: () => handleScenario('password-reset')
    },
    {
      id: 'account-issues',
      icon: HelpCircle,
      title: 'Account Issues',
      description: 'Let me help troubleshoot login problems',
      action: () => handleScenario('troubleshoot')
    },
    {
      id: 'new-user',
      icon: Sparkles,
      title: 'New to Loconomy?',
      description: 'I\'ll explain how our platform works',
      action: () => handleScenario('onboarding')
    },
    {
      id: 'security-help',
      icon: Shield,
      title: 'Security Questions',
      description: 'Learn about our security measures',
      action: () => handleScenario('security')
    }
  ];

  // Initialize with greeting
  useEffect(() => {
    const greeting: AIMessage = {
      id: 'greeting',
      type: 'assistant',
      content: "Hi! I'm your AI authentication assistant. I can help you with login issues, password recovery, or explain how Loconomy works. How can I assist you today?",
      timestamp: new Date(),
      suggestions: ['Forgot password', 'Account locked', 'New user help', 'Security questions']
    };

    setMessages([greeting]);
  }, []);

  const handleScenario = (scenario: string) => {
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      let response: AIMessage;

      switch (scenario) {
        case 'password-reset':
          response = {
            id: `msg-${Date.now()}`,
            type: 'assistant',
            content: "I'll help you reset your password securely. First, I need to verify your email address. Please enter your email in the form above, then click 'Forgot password?' link below the password field. You'll receive a secure reset link within 2 minutes.",
            timestamp: new Date(),
            suggestions: ['Check spam folder', 'Use different email', 'Contact support']
          };
          break;

        case 'troubleshoot':
          response = {
            id: `msg-${Date.now()}`,
            type: 'assistant',
            content: "Let's troubleshoot this together. Common issues include: 1) Caps Lock being on, 2) Browser blocking cookies, 3) Using outdated credentials. Try clearing your browser cache or using an incognito window. If the issue persists, I can escalate to our support team.",
            timestamp: new Date(),
            suggestions: ['Clear cache', 'Try incognito', 'Contact support', 'Check caps lock']
          };
          break;

        case 'onboarding':
          response = {
            id: `msg-${Date.now()}`,
            type: 'assistant',
            content: "Welcome to Loconomy! 🎉 We're an AI-powered platform that connects you with trusted local service providers. Our intelligent matching system learns your preferences and finds the perfect professionals for your needs. You can book services, track progress, and rate providers all in one place.",
            timestamp: new Date(),
            suggestions: ['How does AI matching work?', 'What services available?', 'Pricing info', 'Safety measures']
          };
          break;

        case 'security':
          response = {
            id: `msg-${Date.now()}`,
            type: 'assistant',
            content: "Your security is our top priority! We use bank-level 256-bit SSL encryption, multi-factor authentication, and regular security audits. Your personal data is never shared with third parties. All payments are processed through secure, PCI-compliant systems.",
            timestamp: new Date(),
            suggestions: ['Two-factor auth', 'Payment security', 'Data privacy', 'Report security issue']
          };
          break;

        default:
          response = {
            id: `msg-${Date.now()}`,
            type: 'assistant',
            content: "I'm here to help with any questions you have. Feel free to ask about account issues, platform features, or security concerns.",
            timestamp: new Date()
          };
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response based on suggestion
    handleScenario(suggestion.toLowerCase().replace(/\s+/g, '-'));
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">AI Assistant</h3>
            <Badge variant="secondary" className="mt-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              <Bot className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>

        {/* Message History */}
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-2 justify-start text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Lightbulb className="w-3 h-3 mr-2" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                  <span className="text-xs text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Quick Help
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {assistanceScenarios.slice(0, 4).map((scenario) => (
              <Button
                key={scenario.id}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-start gap-2 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                onClick={scenario.action}
              >
                <div className="flex items-center gap-2 w-full">
                  <scenario.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-xs">{scenario.title}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-left leading-tight">
                  {scenario.description}
                </p>
              </Button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI assistant is online</span>
            </div>
            <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              Live chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
