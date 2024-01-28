import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from '../../config';

export const REDIS_KEY_NAMESPACES = {
  GEOCODE: 'geocode',
};

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: config.redisHost,
      port: parseInt(config.redisPort),
    });
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async getValue(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async closeConnection(): Promise<void> {
    await this.client.quit();
  }
}
