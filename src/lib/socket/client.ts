"use client";

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

interface SocketOptions {
  token: string;
  userId: string;
}

export const initializeSocket = ({ token, userId }: SocketOptions): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_APP_URL! 
    : 'http://localhost:3000', {
    path: '/api/socket',
    auth: { token },
    transports: ['websocket', 'polling'],
    upgrade: true,
  });

  socket.on('connect', () => {
    console.log('Connected to socket server:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from socket server:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Message management
export const joinConversation = (conversationId: string): void => {
  if (socket) {
    socket.emit('join_conversation', conversationId);
  }
};

export const leaveConversation = (conversationId: string): void => {
  if (socket) {
    socket.emit('leave_conversation', conversationId);
  }
};

export const sendMessage = (data: {
  conversationId: string;
  recipientId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file';
}): void => {
  if (socket) {
    socket.emit('send_message', data);
  }
};

export const markMessageRead = (messageId: string): void => {
  if (socket) {
    socket.emit('mark_message_read', messageId);
  }
};

// Typing indicators
export const startTyping = (conversationId: string, recipientId: string): void => {
  if (socket) {
    socket.emit('typing_start', { conversationId, recipientId });
  }
};

export const stopTyping = (conversationId: string, recipientId: string): void => {
  if (socket) {
    socket.emit('typing_stop', { conversationId, recipientId });
  }
};

// Presence management
export const updatePresence = (status: 'online' | 'away' | 'offline'): void => {
  if (socket) {
    socket.emit('update_presence', status);
  }
};

// Event listeners
export const onNewMessage = (callback: (message: any) => void): void => {
  if (socket) {
    socket.on('new_message', callback);
  }
};

export const onMessageRead = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('message_read', callback);
  }
};

export const onUserTyping = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('user_typing', callback);
  }
};

export const onUserPresence = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('user_presence', callback);
  }
};

export const onMessageNotification = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('new_message_notification', callback);
  }
};

export const onMessageError = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('message_error', callback);
  }
};

// Remove event listeners
export const removeAllListeners = (): void => {
  if (socket) {
    socket.removeAllListeners();
  }
};

export const removeListener = (event: string, callback?: Function): void => {
  if (socket) {
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }
};
