import Redis, { Redis as RedisType } from "ioredis";

export class RedisConfig {
  private static pubClient: RedisType | null = null;
  private static subClient: RedisType | null = null;
  private static cacheClient: RedisType | null = null;

  private static initialized = false;

  /**
   * ------------------------------------------------------
   * 1️⃣ Initialize Redis Clients (Call Only Once)
   * ------------------------------------------------------
   */
  static async initialize(): Promise<void> {
    if (this.initialized) return; // avoid re-initialization

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

  /**
   * ------------------------------------------------------
   * 2️⃣ Return All Clients Together
   * ------------------------------------------------------
   */
  static getClients(): {
    pubClient: RedisType;
    subClient: RedisType;
    cacheClient: RedisType;
  } {
    if (!this.pubClient || !this.subClient || !this.cacheClient) {
      throw new Error("Redis clients NOT initialized. Call RedisConfig.initialize() first.");
    }

    return {
      pubClient: this.pubClient,
      subClient: this.subClient,
      cacheClient: this.cacheClient,
    };
  }

  /**
   * ------------------------------------------------------
   * 3️⃣ Individual Getter Functions
   * ------------------------------------------------------
   */
  static getPubClient(): RedisType {
    if (!this.pubClient) throw new Error("Redis pub client not initialized");
    return this.pubClient;
  }

  static getSubClient(): RedisType {
    if (!this.subClient) throw new Error("Redis sub client not initialized");
    return this.subClient;
  }

  static getCacheClient(): RedisType {
    if (!this.cacheClient) throw new Error("Redis cache client not initialized");
    return this.cacheClient;
  }

  /**
   * ------------------------------------------------------
   * 4️⃣ Close All Connections
   * ------------------------------------------------------
   */
  static async closeAll(): Promise<void> {
    await Promise.all([
      this.pubClient?.quit(),
      this.subClient?.quit(),
      this.cacheClient?.quit(),
    ]);

    console.log("🔌 ioredis clients disconnected");
  }
}
