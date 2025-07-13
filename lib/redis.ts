import Redis from 'ioredis';

let redis: Redis | null = null;

// Redis 配置
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

// 获取 Redis 实例
export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(redisConfig);
    
    redis.on('connect', () => {
      console.log('Redis 连接成功');
    });
    
    redis.on('error', (error) => {
      console.error('Redis 连接错误:', error);
    });
    
    redis.on('close', () => {
      console.log('Redis 连接已关闭');
    });
  }
  
  return redis;
}

// 关闭 Redis 连接
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

// Redis 工具函数
export class RedisService {
  private static redis = getRedis();
  private static isConnected = false;
  
  // 检查 Redis 连接状态
  static async checkConnection(): Promise<boolean> {
    try {
      await this.redis.ping();
      this.isConnected = true;

      return true;
    } catch (error) {
      this.isConnected = false;
      console.warn('Redis 连接不可用，将跳过缓存操作:', (error as Error).message);

      return false;
    }
  }
  
  // 断开连接
  static async disconnect(): Promise<void> {
    try {
      await closeRedis();
    } catch (error) {
      console.warn('Redis 断开连接失败:', (error as Error).message);
    }
  }
  
  // 设置缓存
  static async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      if (!(await this.checkConnection())) return;
      
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      if (ttl) {
        await this.redis.setex(key, ttl, stringValue);
      } else {
        await this.redis.set(key, stringValue);
      }
    } catch (error) {
      console.warn('Redis SET 操作失败:', (error as Error).message);
    }
  }
  
  // 获取缓存
  static async get<T = unknown>(key: string): Promise<T | null> {
    try {
      if (!(await this.checkConnection())) return null;
      
      const value = await this.redis.get(key);

      if (!value) return null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value as T;
      }
    } catch (error) {
      console.warn('Redis GET 操作失败:', (error as Error).message);

      return null;
    }
  }
  
  // 删除缓存
  static async del(key: string): Promise<void> {
    try {
      if (!(await this.checkConnection())) return;

      await this.redis.del(key);
    } catch (error) {
      console.warn('Redis DEL 操作失败:', (error as Error).message);
    }
  }
  
  // 检查键是否存在
  static async exists(key: string): Promise<boolean> {
    try {
      if (!(await this.checkConnection())) return false;

      const result = await this.redis.exists(key);

      return result === 1;
    } catch (error) {
      console.warn('Redis EXISTS 操作失败:', (error as Error).message);

      return false;
    }
  }
  
  // 设置过期时间
  static async expire(key: string, ttl: number): Promise<void> {
    await this.redis.expire(key, ttl);
  }
  
  // 获取剩余过期时间
  static async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }
  
  // 批量删除
  static async delPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
  
  // 增加计数器
  static async incr(key: string): Promise<number> {
    try {
      if (!(await this.checkConnection())) return 0;

      return await this.redis.incr(key);
    } catch (error) {
      console.warn('Redis INCR 操作失败:', (error as Error).message);

      return 0;
    }
  }
  
  // 减少计数器
  static async decr(key: string): Promise<number> {
    try {
      if (!(await this.checkConnection())) return 0;

      return await this.redis.decr(key);
    } catch (error) {
      console.warn('Redis DECR 操作失败:', (error as Error).message);

      return 0;
    }
  }
  
  // 哈希操作
  static async hset(key: string, field: string, value: unknown): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    await this.redis.hset(key, field, stringValue);
  }
  
  static async hget<T = unknown>(key: string, field: string): Promise<T | null> {
    const value = await this.redis.hget(key, field);

    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value as T;
    }
  }
  
  static async hdel(key: string, field: string): Promise<void> {
    await this.redis.hdel(key, field);
  }
  
  static async hgetall<T = Record<string, unknown>>(key: string): Promise<T | null> {
    const result = await this.redis.hgetall(key);

    if (Object.keys(result).length === 0) return null;
    
    const parsed: Record<string, unknown> = {};

    for (const [field, value] of Object.entries(result)) {
      try {
        parsed[field] = JSON.parse(value);
      } catch {
        parsed[field] = value;
      }
    }
    
    return parsed as T;
  }
  
  // 列表操作
  static async lpush(key: string, ...values: unknown[]): Promise<number> {
    const stringValues = values.map(v => typeof v === 'string' ? v : JSON.stringify(v));

    return await this.redis.lpush(key, ...stringValues);
  }
  
  static async rpush(key: string, ...values: unknown[]): Promise<number> {
    const stringValues = values.map(v => typeof v === 'string' ? v : JSON.stringify(v));

    return await this.redis.rpush(key, ...stringValues);
  }
  
  static async lpop<T = unknown>(key: string): Promise<T | null> {
    const value = await this.redis.lpop(key);

    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value as T;
    }
  }
  
  static async rpop<T = unknown>(key: string): Promise<T | null> {
    const value = await this.redis.rpop(key);

    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value as T;
    }
  }
  
  static async lrange<T = unknown>(key: string, start: number, stop: number): Promise<T[]> {
    const values = await this.redis.lrange(key, start, stop);

    return values.map(value => {
      try {
        return JSON.parse(value);
      } catch {
        return value as T;
      }
    });
  }
  
  // 集合操作
  static async sadd(key: string, ...members: unknown[]): Promise<number> {
    const stringMembers = members.map(m => typeof m === 'string' ? m : JSON.stringify(m));

    return await this.redis.sadd(key, ...stringMembers);
  }
  
  static async srem(key: string, ...members: unknown[]): Promise<number> {
    const stringMembers = members.map(m => typeof m === 'string' ? m : JSON.stringify(m));

    return await this.redis.srem(key, ...stringMembers);
  }
  
  static async smembers<T = unknown>(key: string): Promise<T[]> {
    const members = await this.redis.smembers(key);

    return members.map(member => {
      try {
        return JSON.parse(member);
      } catch {
        return member as T;
      }
    });
  }
  
  static async sismember(key: string, member: unknown): Promise<boolean> {
    const stringMember = typeof member === 'string' ? member : JSON.stringify(member);
    const result = await this.redis.sismember(key, stringMember);

    return result === 1;
  }
}

export default RedisService;