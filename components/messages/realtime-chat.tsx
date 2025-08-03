"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  CheckCheck,
  Check,
  AlertCircle,
  Wifi,
  WifiOff,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/use-socket";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  read_at?: string;
  created_at: string;
  sender?: {
    display_name: string;
    avatar_url?: string;
  };
}

interface ChatUser {
  id: string;
  display_name: string;
  avatar_url?: string;
  is_online?: boolean;
  last_seen?: string;
}

interface RealtimeChatProps {
  conversationId: string;
  currentUserId: string;
  recipient: ChatUser;
  initialMessages?: Message[];
  className?: string;
}

export function RealtimeChat({
  conversationId,
  currentUserId,
  recipient,
  initialMessages = [],
  className,
}: RealtimeChatProps) {
  const {
    isConnected,
    messages: socketMessages,
    typingUsers,
    userPresence,
    sendMessage,
    markMessageRead,
    joinRoom,
    leaveRoom,
    startTypingIndicator,
    stopTypingIndicator,
    error: socketError,
  } = useSocket();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Merge initial messages with socket messages
  useEffect(() => {
    const allMessages = [...initialMessages, ...socketMessages];
    const uniqueMessages = allMessages.filter((message, index, arr) => 
      arr.findIndex(m => m.id === message.id) === index
    );
    
    setMessages(uniqueMessages.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ));
  }, [initialMessages, socketMessages]);

  // Join conversation room on mount
  useEffect(() => {
    if (isConnected && conversationId) {
      joinRoom(conversationId);
      
      return () => {
        leaveRoom(conversationId);
      };
    }
  }, [isConnected, conversationId, joinRoom, leaveRoom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when they come into view
  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => msg.sender_id !== currentUserId && !msg.read_at
    );
    
    unreadMessages.forEach(msg => {
      markMessageRead(msg.id);
    });
  }, [messages, currentUserId, markMessageRead]);

  // Handle socket error
  useEffect(() => {
    if (socketError) {
      setError(socketError);
      setTimeout(() => setError(null), 5000);
    }
  }, [socketError]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !isConnected) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    
    // Stop typing indicator
    if (isTyping) {
      stopTypingIndicator(conversationId, recipient.id);
      setIsTyping(false);
    }

    try {
      sendMessage({
        conversationId,
        recipientId: recipient.id,
        content: messageContent,
        messageType: 'text',
      });
    } catch (err) {
      setError('Failed to send message');
      setNewMessage(messageContent); // Restore message on error
    }
  }, [newMessage, isConnected, isTyping, conversationId, recipient.id, sendMessage, stopTypingIndicator]);

  const handleTyping = useCallback((value: string) => {
    setNewMessage(value);
    
    if (!isConnected) return;

    // Start typing indicator if not already typing
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      startTypingIndicator(conversationId, recipient.id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        stopTypingIndicator(conversationId, recipient.id);
      }
    }, 2000);

    // Stop typing if message is empty
    if (!value.trim() && isTyping) {
      setIsTyping(false);
      stopTypingIndicator(conversationId, recipient.id);
    }
  }, [isConnected, isTyping, conversationId, recipient.id, startTypingIndicator, stopTypingIndicator]);

  const getMessageStatus = (message: Message) => {
    if (message.sender_id !== currentUserId) return null;
    
    if (message.read_at) {
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    }
    return <Check className="w-3 h-3 text-gray-400" />;
  };

  const recipientStatus = userPresence[recipient.id];
  const isRecipientOnline = recipientStatus?.status === 'online';
  const isRecipientTyping = typingUsers.some(user => user.userId === recipient.id);

  return (
    <Card className={cn("flex flex-col h-[600px]", className)}>
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={recipient.avatar_url} />
                <AvatarFallback>
                  {recipient.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isRecipientOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <CardTitle className="text-lg">{recipient.display_name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isConnected ? (
                  <Wifi className="w-3 h-3 text-green-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-500" />
                )}
                
                {isRecipientTyping ? (
                  <span className="text-blue-500">typing...</span>
                ) : isRecipientOnline ? (
                  <span className="text-green-500">online</span>
                ) : recipientStatus?.lastSeen ? (
                  <span>last seen {formatDistanceToNow(new Date(recipientStatus.lastSeen))} ago</span>
                ) : (
                  <span>offline</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Connection/Error Status */}
      {(error || !isConnected) && (
        <div className="px-4 py-2">
          <Alert variant={error ? "destructive" : "default"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Connecting to chat server..."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4 py-2">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isOwn = message.sender_id === currentUserId;
              const showAvatar = !isOwn && (
                index === 0 || 
                messages[index - 1]?.sender_id !== message.sender_id
              );
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  {!isOwn && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {showAvatar && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.sender?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {message.sender?.display_name?.charAt(0).toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[70%] space-y-1",
                    isOwn && "flex flex-col items-end"
                  )}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 relative",
                        isOwn
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-foreground"
                      )}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-1 text-xs text-muted-foreground",
                      isOwn ? "justify-end" : "justify-start"
                    )}>
                      <span>
                        {formatDistanceToNow(new Date(message.created_at))} ago
                      </span>
                      {getMessageStatus(message)}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator */}
            {isRecipientTyping && (
              <div className="flex gap-2 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={recipient.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {recipient.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            type="submit" 
            size="sm"
            disabled={!newMessage.trim() || !isConnected}
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
