"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  USER_AI_AGENTS,
  userAIClient,
  type UserAIAgent,
} from "@/lib/ai/user-ai-agents";
import { GlassmorphicContainer } from "@/components/features/admin/design-system/glassmorphic-container";
import { AICard } from "@/components/features/admin/design-system/ai-native-card";
import { HolographicText } from "@/components/features/admin/design-system/holographic-text";
import { NeuralLoading } from "@/components/features/admin/design-system/neural-loading";
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  X,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  Brain,
  Network,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentId?: string;
}

interface AIChatProps {
  agentId?: string; // Specific agent to use
  context?: any; // User context for personalization
  position?: "floating" | "embedded" | "fullwidth";
  theme?: "light" | "dark" | "brand";
  autoOpen?: boolean;
  proactiveMessage?: boolean;
  className?: string;
}

export default function AIChat({
  agentId,
  context = {},
  position = "floating",
  theme = "light",
  autoOpen = false,
  proactiveMessage = true,
  className = "",
}: AIChatProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<UserAIAgent | null>(null);
  const [hasShownProactive, setHasShownProactive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get agent based on context or specific agentId
  useEffect(() => {
    setMounted(true);
    const getRelevantAgent = () => {
      if (agentId) {
        return USER_AI_AGENTS.find((agent) => agent.id === agentId);
      }

      // Auto-select agent based on current page context
      const currentPage = context.currentPage || "homepage";
      return (
        USER_AI_AGENTS.find((agent) => agent.contexts.includes(currentPage)) ||
        USER_AI_AGENTS[0]
      ); // Default to Maya
    };

    setCurrentAgent(getRelevantAgent() || null);
  }, [agentId, context.currentPage]);

  // Show proactive message
  useEffect(() => {
    if (currentAgent && proactiveMessage && !hasShownProactive && isOpen) {
      generateProactiveMessage();
      setHasShownProactive(true);
    }
  }, [currentAgent, isOpen, proactiveMessage, hasShownProactive]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateProactiveMessage = async () => {
    if (!currentAgent) return;

    try {
      const proactiveText = await userAIClient.generateProactiveMessage(
        currentAgent.id,
        { ...context, currentPage: context.currentPage || "homepage" },
      );

      const proactiveMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: proactiveText,
        timestamp: new Date(),
        agentId: currentAgent.id,
      };

      setMessages([proactiveMessage]);
    } catch (error) {
      console.error("Error generating proactive message:", error);
      // Show default greeting
      const greetingMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: currentAgent.greeting,
        timestamp: new Date(),
        agentId: currentAgent.id,
      };
      setMessages([greetingMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !currentAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await userAIClient.generateResponse(
        currentAgent.id,
        input,
        { ...context, currentPage: context.currentPage || "homepage" },
        messages,
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        agentId: currentAgent.id,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I'm having trouble connecting right now. Please try again, or feel free to browse our services while I get back online!`,
        timestamp: new Date(),
        agentId: currentAgent.id,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentAvatar = (agentId: string) => {
    const agent = USER_AI_AGENTS.find((a) => a.id === agentId);
    return agent?.avatar || "🤖";
  };

  const getAgentName = (agentId: string) => {
    const agent = USER_AI_AGENTS.find((a) => a.id === agentId);
    return agent?.name || "AI Assistant";
  };

  const getThemeClasses = () => {
    const themes = {
      light: "bg-white/90 backdrop-blur-md border-white/20 text-gray-900",
      dark: "bg-gray-900/90 backdrop-blur-md border-gray-700/30 text-white",
      brand: "bg-gradient-to-br from-blue-50/90 via-purple-50/90 to-pink-50/90 backdrop-blur-md border-blue-200/30 text-gray-900",
    };
    return themes[theme];
  };

  const getPositionClasses = () => {
    const positions = {
      floating: "fixed bottom-6 right-6 z-50 w-80 max-h-[32rem]",
      embedded: "w-full max-w-md mx-auto",
      fullwidth: "w-full",
    };
    return positions[position];
  };

  if (!mounted || !currentAgent) return null;

  // Floating chat bubble when closed
  if (position === "floating" && !isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 via-sky-500 to-blue-600 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 hover:from-indigo-700 hover:via-sky-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:via-purple-700 dark:hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
        size="icon"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <div className="relative z-10 flex items-center justify-center">
          <MessageCircle className="h-7 w-7" />
        </div>
        <div className="absolute inset-0 bg-blue-400/30 rounded-full animate-ping" />
      </Button>
    );
  }

  return (
    <GlassmorphicContainer
      variant="intense"
      glow
      animated
      className={`${getPositionClasses()} ${className} shadow-2xl relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      
      {/* Header */}
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="text-2xl relative z-10">{currentAgent.avatar}</div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full animate-pulse" />
            </div>
            <div>
              <HolographicText className="font-bold text-sm">{currentAgent.name}</HolographicText>
              <p className="text-xs text-gray-600/80 font-medium">{currentAgent.role}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 font-medium">AGI Online</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {position === "floating" && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 rounded-lg hover:bg-white/20"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-lg hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      {!isMinimized && (
        <CardContent className="p-0 relative">
          <div className="h-64 overflow-y-auto px-4 space-y-4 bg-gradient-to-br from-gray-50/30 to-white/20 backdrop-blur-sm">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-white/80 border border-white/40 text-gray-900 shadow-md"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className="text-lg relative">
                        {getAgentAvatar(message.agentId!)}
                        <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping" />
                      </span>
                      <span className="font-semibold text-gray-600">
                        {getAgentName(message.agentId!)}
                      </span>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        AGI
                      </Badge>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/80 border border-white/40 p-4 rounded-xl backdrop-blur-sm shadow-md max-w-[85%]">
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className="text-lg relative">
                      {currentAgent.avatar}
                      <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping" />
                    </span>
                    <span className="font-semibold text-gray-600">{currentAgent.name}</span>
                    <Badge className="bg-blue-100 text-blue-700 text-xs animate-pulse">
                      Processing
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <NeuralLoading size="sm" />
                    <span className="text-sm text-gray-700 font-medium">Neural networks thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/20 relative">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                placeholder={`Message ${currentAgent.name}...`}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === "Enter" && handleSendMessage()
                }
                disabled={isLoading}
                className="flex-1 text-sm bg-white/80 backdrop-blur-sm border-white/40 focus:border-blue-400 focus:ring-blue-400/30 rounded-xl"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentAgent.capabilities
                  .slice(0, 2)
                  .map((capability, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setInput(`Help me with ${capability.toLowerCase()}`)
                      }
                      className="text-xs bg-white/30 backdrop-blur-sm border-white/40 hover:bg-white/40 rounded-lg group"
                    >
                      <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded mr-2 group-hover:scale-110 transition-transform">
                        <Lightbulb className="h-2.5 w-2.5 text-white" />
                      </div>
                      {capability}
                    </Button>
                  ))}
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-xl -z-10 blur-xl" />
          </div>
        </CardContent>
      )}
    </GlassmorphicContainer>
  );
}
