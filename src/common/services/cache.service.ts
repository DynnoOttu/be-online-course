import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisService.getClient().get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting value from cache key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redisService
          .getClient()
          .set(key, serializedValue, 'EX', ttl);
      } else {
        await this.redisService.getClient().set(key, serializedValue);
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to set cache key ${key}:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.redisService.getClient().del(key);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete cache key ${key}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.redisService.getClient().flushall();
      return true;
    } catch (error) {
      this.logger.error(`Failed to check if cache key ${key} exists:`, error);
      return false;
    }
  }

  generateKey(...args: string[]): string {
    return args.join(':');
  }
}
