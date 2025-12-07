import { RedisConfig } from "../config/redis.config";

export class RedisService {
  private static instance: RedisService | null = null;
  private client: any;

  private constructor() {
    try {
      this.client = RedisConfig.getCacheClient();
    } catch (err) {
      // Redis NOT initialized yet; mark as pending
      this.client = null;
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RedisService();
    }
    return this.instance;
  }

  private ensureClient() {
    if (!this.client) {
      // Now Redis should be initialized
      this.client = RedisConfig.getCacheClient();
    }
  }

  async set(key: string, value: unknown, expiry?: number) {
    this.ensureClient();

    const store = typeof value === "string" ? value : JSON.stringify(value);
    expiry
      ? await this.client.set(key, store, "EX", expiry)
      : await this.client.set(key, store);
  }

  async get<T = string>(key: string): Promise<T | null> {
    this.ensureClient();
    const value = await this.client.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }
}


export const redisServer = RedisService.getInstance();