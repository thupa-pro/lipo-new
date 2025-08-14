'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS, aiClient, type AIAgent } from '@/lib/ai/gemini-client';
import { GlassmorphicContainer } from '@/components/admin/design-system/glassmorphic-container';
import { AICard } from '@/components/admin/design-system/ai-native-card';
import { HolographicText } from '@/components/admin/design-system/holographic-text';
import { NeuralLoading } from '@/components/admin/design-system/neural-loading';
import { Send, Zap, Eye, MessageCircle, Lightbulb, AlertTriangle, TrendingUp, Shield, Sparkles, Brain, Network } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentId?: string;
}

interface AIAssistantProps {
  platformData?: any;
  onInsightGenerated?: (insight: string, agentId: string) => void;
}

export default function AIAssistant({ platformData, onInsightGenerated }: AIAssistantProps) {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(AI_AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiClient.generateResponse(
        selectedAgent.id,
        input,
        platformData
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        agentId: selectedAgent.id,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an issue processing your request. As ${selectedAgent.name}, I'm still here to help you with platform insights and analysis. Please try rephrasing your question.`,
        timestamp: new Date(),
        agentId: selectedAgent.id,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateProactiveInsight = async (agent: AIAgent, dataType: string) => {
    setIsAnalyzing(true);
    try {
      const insight = await aiClient.generateInsight(agent.id, dataType, platformData);
      onInsightGenerated?.(insight, agent.id);
      
      const insightMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `💡 **Proactive AGI Insight**: ${insight}`,
        timestamp: new Date(),
        agentId: agent.id,
      };
      
      setMessages(prev => [...prev, insightMessage]);
    } catch (error) {
      console.error('Error generating insight:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAgentIcon = (agentId: string) => {
    const icons = {
      sophia: <Brain className="h-4 w-4" />,
      marcus: <Shield className="h-4 w-4" />,
      elena: <Sparkles className="h-4 w-4" />,
      alex: <TrendingUp className="h-4 w-4" />
    };
    return icons[agentId as keyof typeof icons] || <MessageCircle className="h-4 w-4" />;
  };

  const getQuickActions = (agent: AIAgent) => {
    const actions = {
      sophia: [
        'Analyze user growth trends',
        'Identify optimization opportunities',
        'Review platform performance',
        'Predict upcoming challenges'
      ],
      marcus: [
        'Security threat assessment',
        'Vulnerability scan summary',
        'Compliance status check',
        'Risk mitigation strategies'
      ],
      elena: [
        'User satisfaction analysis',
        'Journey optimization tips',
        'Conversion rate insights',
        'Experience enhancement ideas'
      ],
      alex: [
        'Revenue performance review',
        'Market opportunity analysis',
        'Pricing strategy recommendations',
        'Financial forecasting'
      ]
    };
    return actions[agent.id as keyof typeof actions] || [];
  };

  return (
    <div className="space-y-8">
      {/* Agent Selection */}
      <GlassmorphicContainer variant="intense" glow animated className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <CardHeader className="relative">
          <HolographicText className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            AI Advisory Neural Network
          </HolographicText>
          <p className="text-sm text-gray-600/80 mt-2 font-medium">Elite AGI agents with quantum-enhanced reasoning capabilities</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-600">All Agents Online • Neural Sync Active</span>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AI_AGENTS.map((agent) => (
              <AICard
                key={agent.id}
                aiInsight={{
                  title: agent.name,
                  description: agent.role,
                  confidence: 98,
                  status: 'active' as const
                }}
                onClick={() => setSelectedAgent(agent)}
                className={`cursor-pointer transition-all duration-500 ${
                  selectedAgent.id === agent.id
                    ? 'ring-2 ring-blue-400 ring-opacity-60 shadow-2xl bg-gradient-to-br from-blue-50/90 to-purple-50/90'
                    : 'hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="text-3xl relative z-10">{agent.avatar}</div>
                      {selectedAgent.id === agent.id && (
                        <div className="absolute inset-0 bg-blue-400/30 rounded-full animate-ping" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">{agent.name}</h4>
                        <div className="text-blue-600">{getAgentIcon(agent.id)}</div>
                        {selectedAgent.id === agent.id && (
                          <Badge className="bg-green-100 text-green-700 text-xs animate-pulse">
                            <Network className="h-3 w-3 mr-1" />
                            ACTIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {agent.role}
                      </p>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">{agent.specialty}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs font-medium bg-white/50">
                          {agent.personality.split(',')[0]}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100">
                          AGI-Enhanced
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </AICard>
            ))}
          </div>
        </CardContent>
      </GlassmorphicContainer>

      {/* Quick Actions */}
      <GlassmorphicContainer variant="neon" glow animated className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-red-500/5" />
        <CardHeader className="relative">
          <HolographicText className="text-lg font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl animate-pulse">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            Neural Insights with {selectedAgent.name}
          </HolographicText>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-amber-600">Quantum Processing Active</span>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getQuickActions(selectedAgent).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-4 text-left bg-white/30 backdrop-blur-sm border-white/20 hover:bg-white/40 hover:border-white/30 transition-all duration-300 group"
                onClick={() => setInput(action)}
              >
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">{action}</span>
              </Button>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <Button
              onClick={() => generateProactiveInsight(selectedAgent, 'platform_overview')}
              disabled={isAnalyzing}
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {isAnalyzing ? (
                <>
                  <NeuralLoading size="sm" className="mr-3" />
                  <span className="animate-pulse">{selectedAgent.name} Neural Processing...</span>
                </>
              ) : (
                <>
                  <div className="p-1.5 bg-white/20 rounded-lg mr-3">
                    <Brain className="h-5 w-5" />
                  </div>
                  <span>Generate AGI Insight</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </GlassmorphicContainer>

      {/* Chat Interface */}
      <GlassmorphicContainer variant="intense" glow animated className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <HolographicText className="text-lg font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl animate-pulse">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              Neural Conversation with {selectedAgent.name}
            </HolographicText>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-600">Quantum Link Active</span>
              </div>
              <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-green-200 animate-pulse">
                <span className="text-lg mr-1">{selectedAgent.avatar}</span>
                AGI Online
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {/* Messages */}
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gradient-to-br from-gray-50/50 to-white/30 backdrop-blur-sm rounded-xl border border-white/20">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="relative mb-4">
                  <div className="text-5xl mb-2 relative z-10">{selectedAgent.avatar}</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full animate-pulse" />
                </div>
                <HolographicText className="text-lg font-bold mb-2">
                  Hello! I'm {selectedAgent.name}, your {selectedAgent.role}.
                </HolographicText>
                <p className="text-sm text-gray-600/80 mt-2 font-medium">
                  I specialize in {selectedAgent.specialty.toLowerCase()}. My neural networks are ready to assist you with advanced insights and analysis.
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-blue-600">AGI Mode: Enhanced Reasoning Active</span>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/80 border border-white/40 text-gray-900 shadow-md'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                      <span className="text-lg">
                        {AI_AGENTS.find(a => a.id === message.agentId)?.avatar}
                      </span>
                      <span className="font-medium">
                        {AI_AGENTS.find(a => a.id === message.agentId)?.name}
                      </span>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        AGI
                      </Badge>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/80 border border-white/40 p-4 rounded-xl backdrop-blur-sm shadow-md">
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                    <span className="text-lg relative">
                      {selectedAgent.avatar}
                      <div className="absolute inset-0 bg-blue-400/30 rounded-full animate-ping" />
                    </span>
                    <span className="font-semibold">{selectedAgent.name}</span>
                    <Badge className="bg-blue-100 text-blue-700 text-xs animate-pulse">
                      Processing
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <NeuralLoading size="sm" />
                    <span className="text-gray-700 font-medium">Neural networks analyzing and generating insights...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="relative">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                placeholder={`Ask ${selectedAgent.name} anything about your platform...`}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1 h-12 bg-white/80 backdrop-blur-sm border-white/40 focus:border-blue-400 focus:ring-blue-400/30 text-gray-900 font-medium"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-xl -z-10 blur-xl" />
          </div>
        </CardContent>
      </GlassmorphicContainer>
    </div>
  );
}
