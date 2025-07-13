// 内存缓存降级方案
class MemoryCache {
  private cache = new Map<string, { value: unknown; expiry?: number }>();
  private timers = new Map<string, NodeJS.Timeout>();

  set(key: string, value: unknown, ttl?: number): void {
    // 清除现有的定时器
    if (this.timers.has(key)) {

          clearTimeout(this.timers.get(key)!);
      this.timers.delete(key);
    }

    const expiry = ttl ? Date.now() + ttl * 1000 : undefined;

    this.cache.set(key, { value, expiry });

    // 设置过期定时器

    if (ttl) {
      const timer = setTimeout(() => {
        this.cache.delete(key);
        this.timers.delete(key);
      }, ttl * 1000);

      this.timers.set(key, timer);
    }
  }

  get<T = unknown>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    // 检查是否过期
    if (item.expiry && Date.now() > item.expiry) {

      this.cache.delete(key);

      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key)!);
        this.timers.delete(key);
      }

      return null;
    }

    return item.value as T;
  }

  del(key: string): void {

    this.cache.delete(key);

    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
      this.timers.delete(key);
    }

  }

  exists(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) return false;

    // 检查是否过期

    if (item.expiry && Date.now() > item.expiry) {

      this.del(key);

      return false;
    }

    return true;
  }

  clear(): void {
    // 清除所有定时器

    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
    this.cache.clear();
  }

  size(): number {

    return this.cache.size;
  }

  // 清理过期项

  cleanup(): void {
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && now > item.expiry) {

          this.del(key);
      }
    }
  }
}

// 全局内存缓存实例

const memoryCache = new MemoryCache();

// 定期清理过期项（每5分钟）
setInterval(() => {
  memoryCache.cleanup();
}, 5 * 60 * 1000);

export default memoryCache;