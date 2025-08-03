import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiResponse } from 'next';
import { createClient } from '@/lib/supabase/server';

export interface SocketServerResponse extends NextApiResponse {
  socket: {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
}

export interface AuthenticatedSocket {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    display_name: string;
  };
}

interface MessageData {
  conversationId: string;
  recipientId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file';
}

interface TypingData {
  conversationId: string;
  recipientId: string;
  isTyping: boolean;
}

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL
        : ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return next(new Error('Invalid authentication token'));
      }

      // Attach user data to socket
      (socket as any).userId = user.id;
      (socket as any).user = {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
      };

      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId;
    const user = (socket as any).user;
    
    console.log(`User ${user.display_name} connected: ${socket.id}`);

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Handle joining conversation rooms
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${user.display_name} joined conversation: ${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${user.display_name} left conversation: ${conversationId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data: MessageData) => {
      try {
        const supabase = createClient();
        
        // Insert message into database
        const { data: message, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: data.conversationId,
            sender_id: userId,
            recipient_id: data.recipientId,
            content: data.content,
            message_type: data.messageType || 'text',
          })
          .select(`
            *,
            sender:users!sender_id(display_name, avatar_url),
            recipient:users!recipient_id(display_name)
          `)
          .single();

        if (error) {
          socket.emit('message_error', { error: 'Failed to send message' });
          return;
        }

        // Broadcast message to conversation participants
        io.to(`conversation:${data.conversationId}`).emit('new_message', {
          ...message,
          timestamp: new Date().toISOString(),
        });

        // Send notification to recipient if they're online but not in conversation
        io.to(`user:${data.recipientId}`).emit('new_message_notification', {
          conversationId: data.conversationId,
          senderName: user.display_name,
          preview: data.content.substring(0, 50),
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data: TypingData) => {
      socket.to(`conversation:${data.conversationId}`).emit('user_typing', {
        userId,
        userName: user.display_name,
        isTyping: true,
      });
    });

    socket.on('typing_stop', (data: TypingData) => {
      socket.to(`conversation:${data.conversationId}`).emit('user_typing', {
        userId,
        userName: user.display_name,
        isTyping: false,
      });
    });

    // Handle message read receipts
    socket.on('mark_message_read', async (messageId: string) => {
      try {
        const supabase = createClient();
        
        const { error } = await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('id', messageId)
          .eq('recipient_id', userId);

        if (!error) {
          // Notify sender that message was read
          const { data: message } = await supabase
            .from('messages')
            .select('sender_id, conversation_id')
            .eq('id', messageId)
            .single();

          if (message) {
            io.to(`user:${message.sender_id}`).emit('message_read', {
              messageId,
              conversationId: message.conversation_id,
              readBy: userId,
            });
          }
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle user presence
    socket.on('update_presence', (status: 'online' | 'away' | 'offline') => {
      socket.broadcast.emit('user_presence', {
        userId,
        status,
        lastSeen: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${user.display_name} disconnected: ${socket.id}`);
      
      // Notify others that user is offline
      socket.broadcast.emit('user_presence', {
        userId,
        status: 'offline',
        lastSeen: new Date().toISOString(),
      });
    });

    // Send initial presence update
    socket.emit('connected', {
      socketId: socket.id,
      user: user,
    });
  });

  return io;
};

export default initializeSocket;
