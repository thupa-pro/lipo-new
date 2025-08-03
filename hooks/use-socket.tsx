"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { 
  initializeSocket, 
  getSocket, 
  disconnectSocket,
  joinConversation,
  leaveConversation,
  sendMessage as socketSendMessage,
  markMessageRead as socketMarkMessageRead,
  startTyping,
  stopTyping,
  updatePresence,
  onNewMessage,
  onMessageRead,
  onUserTyping,
  onUserPresence,
  onMessageNotification,
  onMessageError,
  removeAllListeners,
} from '@/lib/socket/client';
import { createClient } from '@/lib/supabase/client';

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

interface TypingUser {
  userId: string;
  userName: string;
  isTyping: boolean;
}

interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
  typingUsers: TypingUser[];
  userPresence: Record<string, UserPresence>;
  sendMessage: (data: {
    conversationId: string;
    recipientId: string;
    content: string;
    messageType?: 'text' | 'image' | 'file';
  }) => void;
  markMessageRead: (messageId: string) => void;
  joinRoom: (conversationId: string) => void;
  leaveRoom: (conversationId: string) => void;
  startTypingIndicator: (conversationId: string, recipientId: string) => void;
  stopTypingIndicator: (conversationId: string, recipientId: string) => void;
  error: string | null;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [userPresence, setUserPresence] = useState<Record<string, UserPresence>>({});
  const [error, setError] = useState<string | null>(null);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const initSocket = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session?.access_token || !session?.user) {
          setError('Authentication required for real-time messaging');
          return;
        }

        const socketInstance = initializeSocket({
          token: session.access_token,
          userId: session.user.id,
        });

        setSocket(socketInstance);

        // Connection event listeners
        socketInstance.on('connect', () => {
          setIsConnected(true);
          setError(null);
          updatePresence('online');
        });

        socketInstance.on('disconnect', () => {
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
          setError(`Connection failed: ${err.message}`);
          setIsConnected(false);
        });

        // Message event listeners
        onNewMessage((message: Message) => {
          setMessages((prev) => {
            // Avoid duplicates
            const exists = prev.some(m => m.id === message.id);
            if (exists) return prev;
            
            return [...prev, message].sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
        });

        onMessageRead((data: { messageId: string; readBy: string }) => {
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === data.messageId 
                ? { ...msg, read_at: new Date().toISOString() }
                : msg
            )
          );
        });

        onUserTyping((data: TypingUser) => {
          setTypingUsers((prev) => {
            const filtered = prev.filter(user => user.userId !== data.userId);
            return data.isTyping ? [...filtered, data] : filtered;
          });

          // Clear typing indicator after 3 seconds
          if (data.isTyping) {
            setTimeout(() => {
              setTypingUsers((prev) => 
                prev.filter(user => user.userId !== data.userId)
              );
            }, 3000);
          }
        });

        onUserPresence((data: UserPresence) => {
          setUserPresence((prev) => ({
            ...prev,
            [data.userId]: data,
          }));
        });

        onMessageNotification((data: any) => {
          // Handle notifications for messages in other conversations
          console.log('New message notification:', data);
          // You could show a toast notification here
        });

        onMessageError((data: any) => {
          setError(data.error);
          setTimeout(() => setError(null), 5000);
        });

      } catch (err) {
        setError('Failed to initialize socket connection');
        console.error('Socket initialization error:', err);
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      removeAllListeners();
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const sendMessage = useCallback((data: {
    conversationId: string;
    recipientId: string;
    content: string;
    messageType?: 'text' | 'image' | 'file';
  }) => {
    if (socket && isConnected) {
      socketSendMessage(data);
    } else {
      setError('Not connected to chat server');
    }
  }, [socket, isConnected]);

  const markMessageRead = useCallback((messageId: string) => {
    if (socket && isConnected) {
      socketMarkMessageRead(messageId);
    }
  }, [socket, isConnected]);

  const joinRoom = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      joinConversation(conversationId);
    }
  }, [socket, isConnected]);

  const leaveRoom = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      leaveConversation(conversationId);
    }
  }, [socket, isConnected]);

  const startTypingIndicator = useCallback((conversationId: string, recipientId: string) => {
    if (socket && isConnected) {
      startTyping(conversationId, recipientId);
    }
  }, [socket, isConnected]);

  const stopTypingIndicator = useCallback((conversationId: string, recipientId: string) => {
    if (socket && isConnected) {
      stopTyping(conversationId, recipientId);
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    messages,
    typingUsers,
    userPresence,
    sendMessage,
    markMessageRead,
    joinRoom,
    leaveRoom,
    startTypingIndicator,
    stopTypingIndicator,
    error,
  };
};

export default useSocket;
