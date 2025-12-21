import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import {
  IAuthenticatedSocket,
  IClientToServerEvents,
  IServerToClientEvents,
  ISocketData,
} from "./types/socket"
import { RedisConfig } from "./config/redis.config";
import { SOCKET_EVENTS, socketConfig } from "./config/socker.config";
import { SocketAuthMiddleware } from "./middlewares/socket.auth.middleware";
import { SocketErrorMiddleware } from "./middlewares/socket.error.middleware";

export class SocketServer {
  private static instance: SocketServer;
  private io!: Server<
    IClientToServerEvents,
    IServerToClientEvents,
    {},
    ISocketData
  >;
  private activeConnections: Map<string, string> = new Map();

  private constructor() { }

  static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer();
    }
    return SocketServer.instance;
  }

  async initialize(httpServer: HTTPServer): Promise<void> {
    try {
      // Initialize Redis clients
      const { pubClient, subClient } = RedisConfig.getClients();

      // Create Socket.io server with Redis adapter
      this.io = new Server<
        IClientToServerEvents,
        IServerToClientEvents,
        {},
        ISocketData
      >(httpServer, socketConfig);

      // Set up Redis adapter for scaling across multiple servers
      this.io.adapter(createAdapter(pubClient, subClient));

      console.log("✅ Socket.io server initialized with Redis adapter");

      // Apply middleware
      this.setupMiddleware();

      // Initialize handlers
      //   this.initializeHandlers();

      // Set up connection handling
      this.setupConnectionHandling();

      // Monitor connections
      this.setupMonitoring();

      console.log("🚀 Socket.io server ready to accept connections");
    } catch (error) {
      console.error("❌ Failed to initialize Socket.io server:", error);
      throw error;
    }
  }

  private setupMiddleware(): void {

    // Authentication middleware
    this.io.use(SocketAuthMiddleware.authenticate);

    // Error handling middleware
    this.io.use(SocketErrorMiddleware.handleError);

    console.log("✅ Socket.io middleware configured");
  }

  private setupConnectionHandling(): void {
    this.io.on(
      SOCKET_EVENTS.CONNECTION,
      async (socket: IAuthenticatedSocket) => {
        const userId = socket.user?.id;
        const username = socket.user?.username || "Anonymous";
        if (!userId) {
          socket.disconnect();
          return;
        }

        console.log(
          `🟢 User connected: ${username} (${userId}) [${socket.id}]`
        );

        // Track connection
        this.activeConnections.set(userId, socket.id);

        // Cache user socket ID in Redis for cross-server communication
        await this.cacheUserSocket(userId, socket.id);

        //   // Attach handlers to this socket
        //   this.roomHandler.handleConnection(socket);
        //   this.gameHandler.handleConnection(socket);
        //   this.chatHandler.handleConnection(socket);

        // Handle disconnection
        socket.on(SOCKET_EVENTS.DISCONNECT, async (reason) => {
          await this.handleDisconnection(socket, reason);
        });

        // Send welcome notification
        socket.emit("notification", {
          message: `Welcome ${username}!`,
          type: "success",
        });
      }
    );
  }

  private async handleDisconnection(
    socket: IAuthenticatedSocket,
    reason: string
  ): Promise<void> {
    const userId = socket.user?.id;
    const username = socket.user?.username || "Anonymous";

    console.log(
      `🔴 User disconnected: ${username} (${userId}) - Reason: ${reason}`
    );

    if (!userId) return;

    try {
      // Remove from active connections
      // this.activeConnections.delete(userId);

      // Remove from Redis cache
      // await this.removeUserSocket(userId);

      // Handle room cleanup if user was in a room
      //   if (socket.roomCode) {
      //     await this.roomHandler.handlePlayerLeave(socket);
      //   }
    } catch (error) {
      console.error("Error handling disconnection:", error);
    }
  }

  private setupMonitoring(): void {
    // Log socket.io stats every 30 seconds
    setInterval(() => {
      const socketsCount = this.io.sockets.sockets.size;
      const roomsCount = this.io.sockets.adapter.rooms.size;

      console.log(`📊 Stats: ${socketsCount} connections, ${roomsCount} rooms`);
    }, 30000);

    // Monitor adapter events (useful for debugging multi-server setup)
    this.io.of("/").adapter.on("create-room", (room) => {
      console.log(`📦 Room created: ${room}`);
    });

    this.io.of("/").adapter.on("delete-room", (room) => {
      console.log(`🗑️  Room deleted: ${room}`);
    });

    this.io.of("/").adapter.on("join-room", (room, id) => {
      console.log(`➕ Socket ${id} joined room: ${room}`);
    });

    this.io.of("/").adapter.on("leave-room", (room, id) => {
      console.log(`➖ Socket ${id} left room: ${room}`);
    });
  }

  private async cacheUserSocket(
    userId: string,
    socketId: string
  ): Promise<void> {
    try {
      const redis = RedisConfig.getCacheClient();
      await redis.setex(`user:${userId}:socket`, 86400, socketId); // 24 hour TTL
    } catch (error) {
      console.error("Error caching user socket:", error);
    }
  }

  private async removeUserSocket(userId: string): Promise<void> {
    try {
      const redis = RedisConfig.getCacheClient();
      await redis.del(`user:${userId}:socket`);
    } catch (error) {
      console.error("Error removing user socket:", error);
    }
  }

  // Public method to get Socket.io server instance
  getIO(): Server<
    IClientToServerEvents,
    IServerToClientEvents,
    {},
    ISocketData
  > {
    return this.io;
  }

  // Method to emit to specific user (works across multiple servers)
  async emitToUser(userId: string, event: string, data: any): Promise<void> {
    try {
      const redis = RedisConfig.getCacheClient();
      const socketId = await redis.get(`user:${userId}:socket`);

      if (socketId) {
        this.io.to(socketId).emit(event as any, data);
      }
    } catch (error) {
      console.error("Error emitting to user:", error);
    }
  }

  // Method to broadcast to room
  emitToRoom(roomCode: string, event: string, data: any): void {
    this.io.to(roomCode).emit(event as any, data);
  }

  // Method to get connected sockets count
  getConnectionsCount(): number {
    return this.activeConnections.size;
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log("🛑 Shutting down Socket.io server...");

    // Notify all connected clients
    this.io.emit("notification", {
      message: "Server is shutting down. Please reconnect shortly.",
      type: "warning",
    });

    // Wait a bit for messages to be sent
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Close all connections
    this.io.close();

    // Close Redis connections
    await RedisConfig.closeAll();

    console.log("✅ Socket.io server shut down gracefully");
  }
}
