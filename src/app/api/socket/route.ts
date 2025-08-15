import { NextRequest } from 'next/server';
import { initializeSocket, SocketServerResponse } from '@/lib/socket/server';

export async function GET(request: NextRequest) {
  // Socket.IO is handled via the server instance
  // This route exists for Next.js routing but actual socket handling
  // is done through the socket server initialization
  
  return new Response('Socket.IO server running', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

// For development, we need to handle socket initialization differently
// In production, this would be handled by the server startup
if (process.env.NODE_ENV === 'development') {
  // Development socket handling will be managed through middleware
  console.log('Socket.IO development mode - use middleware for proper setup');
}
