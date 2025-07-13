import RedisService from '@/lib/redis';
import { User } from '@/types/auth';
import { BlogStats, PostWithDetails } from '@/types/blog';
import { WebsiteWithDetails, WebsiteStats, WebsiteListQuery } from '@/types/website';

// 缓存键前缀
const CACHE_KEYS = {
  WEBSITE: {
    LIST: 'website:list',
    DETAIL: 'website:detail',
    STATS: 'website:stats',
    POPULAR: 'website:popular',
    RECENT: 'website:recent',
    CATEGORIES: 'website:categories',
    TAGS: 'website:tags',
    CLICKS: 'website:clicks',
  },
  BLOG: {
    LIST: 'blog:list',
    DETAIL: 'blog:detail',
    STATS: 'blog:stats',
    RECENT: 'blog:recent',
  },
  USER: {
    SESSION: 'user:session',
    PROFILE: 'user:profile',
  },
} as const;

// 缓存过期时间（秒）
const CACHE_TTL = {
  SHORT: 5 * 60, // 5分钟
  MEDIUM: 30 * 60, // 30分钟
  LONG: 2 * 60 * 60, // 2小时
  VERY_LONG: 24 * 60 * 60, // 24小时
} as const;

export class CacheService {
  // ==================== 网站缓存 ====================
  
  // 缓存网站列表
  static async cacheWebsiteList(
    key: string,
    data: WebsiteWithDetails[],
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<void> {
    await RedisService.set(`${CACHE_KEYS.WEBSITE.LIST}:${key}`, data, ttl);
  }
  
  // 获取网站列表缓存
  static async getWebsiteList(key: string): Promise<WebsiteWithDetails[] | null> {
    return await RedisService.get<WebsiteWithDetails[]>(`${CACHE_KEYS.WEBSITE.LIST}:${key}`);
  }
  
  // 缓存网站详情
  static async cacheWebsiteDetail(
    id: string,
    data: WebsiteWithDetails,
    ttl: number = CACHE_TTL.LONG
  ): Promise<void> {
    await RedisService.set(`${CACHE_KEYS.WEBSITE.DETAIL}:${id}`, data, ttl);
  }
  
  // 获取网站详情缓存
  static async getWebsiteDetail(id: string): Promise<WebsiteWithDetails | null> {
    return await RedisService.get<WebsiteWithDetails>(`${CACHE_KEYS.WEBSITE.DETAIL}:${id}`);
  }
  
  // 缓存网站统计
  static async cacheWebsiteStats(
    data: WebsiteStats,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<void> {
    await RedisService.set(CACHE_KEYS.WEBSITE.STATS, data, ttl);
  }
  
  // 获取网站统计缓存
  static async getWebsiteStats(): Promise<WebsiteStats | null> {
    return await RedisService.get<WebsiteStats>(CACHE_KEYS.WEBSITE.STATS);
  }
  
  // 缓存热门网站
  static async cachePopularWebsites(
    data: WebsiteWithDetails[],
    ttl: number = CACHE_TTL.LONG
  ): Promise<void> {
    await RedisService.set(CACHE_KEYS.WEBSITE.POPULAR, data, ttl);
  }
  
  // 获取热门网站缓存
  static async getPopularWebsites(): Promise<WebsiteWithDetails[] | null> {
    return await RedisService.get<WebsiteWithDetails[]>(CACHE_KEYS.WEBSITE.POPULAR);
  }
  
  // 缓存最新网站
  static async cacheRecentWebsites(
    data: WebsiteWithDetails[],
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<void> {
    await RedisService.set(CACHE_KEYS.WEBSITE.RECENT, data, ttl);
  }
  
  // 获取最新网站缓存
  static async getRecentWebsites(): Promise<WebsiteWithDetails[] | null> {
    return await RedisService.get<WebsiteWithDetails[]>(CACHE_KEYS.WEBSITE.RECENT);
  }
  
  // 生成网站列表缓存键
  static generateWebsiteListKey(query: WebsiteListQuery): string {
    const params = {
      page: query.page || 1,
      limit: query.limit || 10,
      categoryId: query.categoryId,
      tagId: query.tagId,
      status: query.status,
      search: query.search,
      submitterId: query.submitterId,
      isRecommend: query.isRecommend,
      isFeatured: query.isFeatured,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder || 'desc'
    };

    return this.generateCacheKey('list', params);
  }
  
  // ==================== 博客缓存 ====================
  
  // 缓存博客列表
  static async cacheBlogList(
    key: string,
    data: PostWithDetails[],
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<void> {
    await RedisService.set(`${CACHE_KEYS.BLOG.LIST}:${key}`, data, ttl);
  }
  
  // 获取博客列表缓存
  static async getBlogList(key: string): Promise<PostWithDetails[] | null> {
    return await RedisService.get<PostWithDetails[]>(`${CACHE_KEYS.BLOG.LIST}:${key}`);
  }
  
  // 缓存博客详情
  static async cacheBlogDetail(
    id: string,
    data: PostWithDetails,
    ttl: number = CACHE_TTL.LONG
  ): Promise<void> {
    await RedisService.set(`${CACHE_KEYS.BLOG.DETAIL}:${id}`, data, ttl);
  }
  
  // 获取博客详情缓存
  static async getBlogDetail(id: string): Promise<PostWithDetails | null> {
    return await RedisService.get<PostWithDetails>(`${CACHE_KEYS.BLOG.DETAIL}:${id}`);
  }
  
  // 缓存博客统计
  static async cacheBlogStats(
    data: BlogStats,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<void> {
    await RedisService.set(CACHE_KEYS.BLOG.STATS, data, ttl);
  }
  
  // 获取博客统计缓存
  static async getBlogStats(): Promise<BlogStats | null> {
    return await RedisService.get<BlogStats>(CACHE_KEYS.BLOG.STATS);
  }
  
  // ==================== 用户缓存 ====================
  
  // 缓存用户会话
  static async cacheUserSession(
    userId: string,
    data: Record<string, unknown>,
    ttl: number = CACHE_TTL.LONG
  ): Promise<void> {
    await RedisService.set(`${CACHE_KEYS.USER.SESSION}:${userId}`, data, ttl);
  }
  
  // 获取用户会话缓存
  static async getUserSession(userId: string): Promise<Record<string, unknown> | null> {
    return await RedisService.get(`${CACHE_KEYS.USER.SESSION}:${userId}`);
  }
  
  // 缓存用户资料
  static async cacheUserProfile(
    userId: string,
    data: User,
    ttl: number = CACHE_TTL.VERY_LONG
  ): Promise<void> {
    await RedisService.set(`${CACHE_KEYS.USER.PROFILE}:${userId}`, data, ttl);
  }
  
  // 获取用户资料缓存
  static async getUserProfile(userId: string): Promise<User | null> {
    return await RedisService.get(`${CACHE_KEYS.USER.PROFILE}:${userId}`);
  }
  
  // ==================== 点击统计缓存 ====================
  
  // 记录网站点击（使用计数器）
  static async incrementWebsiteClicks(websiteId: string): Promise<number> {
    return await RedisService.incr(`${CACHE_KEYS.WEBSITE.CLICKS}:${websiteId}`);
  }
  
  // 获取网站点击数
  static async getWebsiteClicks(websiteId: string): Promise<number> {
    const clicks = await RedisService.get<number>(`${CACHE_KEYS.WEBSITE.CLICKS}:${websiteId}`);

    return clicks || 0;
  }
  
  // 批量获取网站点击数
  static async getBatchWebsiteClicks(websiteIds: string[]): Promise<Record<string, number>> {
    const result: Record<string, number> = {};
    
    for (const id of websiteIds) {
      result[id] = await this.getWebsiteClicks(id);
    }

    return result;
  }
  
  // ==================== 缓存清理 ====================
  
  // 清理网站详情缓存
  static async clearWebsiteDetail(websiteId: string): Promise<void> {
    await RedisService.del(`${CACHE_KEYS.WEBSITE.DETAIL}:${websiteId}`);
  }
  
  // 清理网站列表缓存
  static async clearWebsiteListCache(): Promise<void> {
    await RedisService.delPattern(`${CACHE_KEYS.WEBSITE.LIST}:*`);
    await RedisService.del(CACHE_KEYS.WEBSITE.POPULAR);
    await RedisService.del(CACHE_KEYS.WEBSITE.RECENT);
  }
  
  // 清理网站统计缓存
  static async clearWebsiteStatsCache(): Promise<void> {
    await RedisService.del(CACHE_KEYS.WEBSITE.STATS);
  }
  
  // 清理网站相关缓存
  static async clearWebsiteCache(websiteId?: string): Promise<void> {
    if (websiteId) {
      // 清理特定网站的缓存
      await RedisService.del(`${CACHE_KEYS.WEBSITE.DETAIL}:${websiteId}`);
      await RedisService.del(`${CACHE_KEYS.WEBSITE.CLICKS}:${websiteId}`);
    }

    // 清理列表和统计缓存
    await RedisService.delPattern(`${CACHE_KEYS.WEBSITE.LIST}:*`);
    await RedisService.del(CACHE_KEYS.WEBSITE.STATS);
    await RedisService.del(CACHE_KEYS.WEBSITE.POPULAR);
    await RedisService.del(CACHE_KEYS.WEBSITE.RECENT);
    await RedisService.del(CACHE_KEYS.WEBSITE.CATEGORIES);
  }
  
  // 清理博客相关缓存
  static async clearBlogCache(blogId?: string): Promise<void> {
    if (blogId) {
      // 清理特定博客的缓存
      await RedisService.del(`${CACHE_KEYS.BLOG.DETAIL}:${blogId}`);
    }

    // 清理列表和统计缓存
    await RedisService.delPattern(`${CACHE_KEYS.BLOG.LIST}:*`);
    await RedisService.del(CACHE_KEYS.BLOG.STATS);
  }
  
  // 清理用户相关缓存
  static async clearUserCache(userId: string): Promise<void> {
    await RedisService.del(`${CACHE_KEYS.USER.SESSION}:${userId}`);
    await RedisService.del(`${CACHE_KEYS.USER.PROFILE}:${userId}`);
  }
  
  // 清理所有缓存
  static async clearAllCache(): Promise<void> {
    await RedisService.delPattern('website:*');
    await RedisService.delPattern('blog:*');
    await RedisService.delPattern('user:*');
  }
  
  // ==================== 缓存工具方法 ====================
  
  // 生成缓存键
  static generateCacheKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');

    return `${prefix}:${sortedParams}`;
  }
  
  // 检查缓存是否存在
  static async cacheExists(key: string): Promise<boolean> {
    return await RedisService.exists(key);
  }
  
  // 获取缓存剩余时间
  static async getCacheTTL(key: string): Promise<number> {
    return await RedisService.ttl(key);
  }
  
  // 延长缓存时间
  static async extendCacheTTL(key: string, ttl: number): Promise<void> {
    await RedisService.expire(key, ttl);
  }
}

export default CacheService;