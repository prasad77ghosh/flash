import Redis, { Redis as RedisType } from "ioredis";
import { NotFound } from "http-errors";

export class RedisConfig {
  private static pubClient: RedisType | null = null;
  private static subClient: RedisType | null = null;
  private static cacheClient: RedisType | null = null;
  private static initialized = false;

  static async initialize(): Promise<void> {
    if (this.initialized) return;
    try {
      const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

      this.pubClient = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
      });

      this.subClient = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
      });

      this.cacheClient = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
      });

      // Error listeners
      this.pubClient.on("error", (err) =>
        console.error("Redis Pub Error:", err)
      );

      this.subClient.on("error", (err) =>
        console.error("Redis Sub Error:", err)
      );

      this.cacheClient.on("error", (err) =>
        console.error("Redis Cache Error:", err)
      );

      this.initialized = true;
      console.log("🚀 Redis clients initialized");
    } catch (error) {
      console.error("❌ Redis initialization failed:", error);
      throw error;
    }
  }

  static getPubClient(): RedisType {
    if (!this.pubClient) throw new NotFound("Publishe notr found!");
    return this.pubClient;
  }
  static getSubClient(): RedisType {
    if (!this.subClient) throw new NotFound("Subscriber not found!");
    return this.subClient;
  }
  static getCacheClient(): RedisType {
    if (!this.cacheClient) throw new NotFound("Cache client not found!");
    return this.cacheClient;
  }
  static async closeAll(): Promise<void> {
    await Promise.all([
      this.pubClient?.quit(),
      this.subClient?.quit(),
      this.cacheClient?.quit(),
    ]);

    console.log("🔌 ioredis clients disconnected");
  }
}
