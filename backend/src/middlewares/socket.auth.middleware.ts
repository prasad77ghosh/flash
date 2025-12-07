import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { IAuthenticatedSocket, IUser } from '../types/socket';
import jwt from 'jsonwebtoken';
export class SocketAuthMiddleware {

static authenticate = async (
    socket: Socket,
    next: (err?: ExtendedError) => void
  ): Promise<void> => {
    try {
      // Get token from handshake auth or query
      const token = 
        socket.handshake.auth.token || 
        socket.handshake.headers.authorization?.split(' ')[1] ||
        socket.handshake.query.token as string;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify JWT token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as IUser & { userId: string };

      // Attach user to socket
      (socket as IAuthenticatedSocket).user = {
        id: decoded.userId || decoded.id,
        username: decoded.username,
        email: decoded.email,
        avatar: decoded.avatar,
      };

      console.log(`✅ Socket authenticated: ${decoded.username} (${decoded.userId})`);

      next();
    } catch (error: any) {
      console.error('❌ Socket authentication failed:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return next(new Error('Authentication error: Token expired'));
      }
      
      if (error.name === 'JsonWebTokenError') {
        return next(new Error('Authentication error: Invalid token'));
      }

      return next(new Error('Authentication error: Failed to authenticate'));
    }
  };

}