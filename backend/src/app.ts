import compression from "compression";
import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { Response, Request, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { createServer, Server } from "node:http";
import BottomMiddleware from "./middlewares/bottom.middleware";
import AuthRoutes from "./routes/auth.routes";
import DB from "./db/databse";
import { SocketServer } from "./socker.server";
import { RedisConfig } from "./config/redis.config";

class App {
  public app: Application;
  public static server: Server;
  private static socketServer: SocketServer;

  constructor() {
    this.app = express();
    this.app.use(
      express.json({
        limit: "15mb",
      })
    );
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(
      cors({
        origin: [
          "https://num-tree-frontend.vercel.app",
          "http://localhost:3000",
          "http://localhost:5173",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
      })
    );

    this.app.use(this.cacheClear);
    DB.connect();

    this.initilizeToutes();
    new BottomMiddleware(this.app);
  }

  private initilizeToutes() {
    const authRoutes = new AuthRoutes();
    this.app.use(`/api/v1/${authRoutes.path}`, authRoutes.router);
  }

  public listen(port: number) {
    App.server = createServer(this.app);
    App.server.listen(port, async () => {
      console.log(`✅ Server running on port ${port}`);
      await RedisConfig.initialize();
      await this.initializeSocketServer();
    });
  }

  private async initializeSocketServer(): Promise<void> {
    try {
      App.socketServer = SocketServer.getInstance();
      await App.socketServer.initialize(App.server);
      console.log("✅ Socket.IO server integrated successfully");
    } catch (error) {
      console.error("❌ Failed to initialize Socket.IO server:", error);
      // Don't crash the server, but log the error
    }
  }

  private cacheClear(req: Request, res: Response, next: NextFunction) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
  }

  public static async shutdown(): Promise<void> {
    try {
      if (App.socketServer) {
        await App.socketServer.shutdown();
      }
      if (App.server) {
        await new Promise<void>((resolve, reject) => {
          App.server.close((error) => {
            if (error) reject(error);
            else resolve();
          });
        });

        DB.disConnect();
        console.log("✅ HTTP server closed");
        console.log("✅ Graceful shutdown completed");
        process.exit(0);
      }
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  }
}

export default App;
