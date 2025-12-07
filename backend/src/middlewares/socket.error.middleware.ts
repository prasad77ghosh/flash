import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export class SocketErrorMiddleware {
  /**
   * Global error handler for socket connections
   */
  static handleError = (
    socket: Socket,
    next: (err?: ExtendedError) => void
  ): void => {
    try {
      // Log connection attempt
      console.log(`📡 Connection attempt from ${socket.handshake.address}`);

      // Rate limiting check (optional)
      if (SocketErrorMiddleware.isRateLimited(socket)) {
        return next(new Error('Too many connection attempts. Please try again later.'));
      }

      // IP blacklist check (optional)
      if (SocketErrorMiddleware.isBlacklisted(socket)) {
        return next(new Error('Connection rejected'));
      }

      next();
    } catch (error: any) {
      console.error('Error in socket error middleware:', error);
      return next(new Error('Connection error'));
    }
  };

  /**
   * Check if socket is rate limited
   */
  private static isRateLimited(socket: Socket): boolean {
    // Implement rate limiting logic
    // For example, check Redis for connection attempts from this IP
    const ip = socket.handshake.address;
    
    // Simple in-memory rate limiting (replace with Redis in production)
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxAttempts = 10;

    // This is simplified - use Redis for production
    return false;
  }

  /**
   * Check if IP is blacklisted
   */
  private static isBlacklisted(socket: Socket): boolean {
    // Implement IP blacklist check
    const ip = socket.handshake.address;
    const blacklist = process.env.IP_BLACKLIST?.split(',') || [];
    
    return blacklist.includes(ip);
  }

  /**
   * Setup socket-level error handlers
   */
  static setupSocketErrorHandlers(socket: Socket): void {
    // Handle socket errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });

    // Handle connection errors
    socket.conn.on('error', (error) => {
      console.error(`Connection error for ${socket.id}:`, error);
    });

    // Handle packet errors
    socket.on('packet', (packet) => {
      if (packet.type === 'error') {
        console.error(`Packet error for ${socket.id}:`, packet);
      }
    });
  }
}

