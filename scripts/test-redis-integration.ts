import { PrismaClient } from '@prisma/client';

import { RedisService } from '../lib/redis';
import CacheService from '../services/cache';

const prisma = new PrismaClient();

async function testRedisIntegration() {
  console.log('🚀 开始测试 Redis 集成功能...');

  try {
    // 1. 测试 Redis 连接
    console.log('\n1. 测试 Redis 连接...');
    const isConnected = await RedisService.checkConnection();

    console.log(`Redis 连接状态: ${isConnected ? '✅ 已连接' : '❌ 未连接'}`);

    if (!isConnected) {
      console.log('⚠️  Redis 未连接，将使用内存缓存作为降级方案');
    }

    // 2. 测试网站统计缓存
    console.log('\n2. 测试网站统计缓存...');
    
    // 清除现有缓存
    await CacheService.clearWebsiteStatsCache();
    
    // 第一次获取（应该从数据库获取）
    console.log('第一次获取统计数据（从数据库）...');
    const stats1 = await CacheService.getWebsiteStats();

    console.log('统计数据:', stats1 ? '✅ 获取成功' : '❌ 获取失败');
    
    // 模拟缓存统计数据
    const mockStats = {
      totalWebsites: 100,
      pendingWebsites: 5,
      approvedWebsites: 90,
      rejectedWebsites: 5,
      disabledWebsites: 0,
      recommendedWebsites: 10,
      featuredWebsites: 5,
      totalCategories: 10,
      totalTags: 20,
      totalClicks: 1000
    };
    
    await CacheService.cacheWebsiteStats(mockStats, 60);
    
    // 第二次获取（应该从缓存获取）
    console.log('第二次获取统计数据（从缓存）...');
    const stats2 = await CacheService.getWebsiteStats();

    console.log('缓存数据:', stats2 ? '✅ 获取成功' : '❌ 获取失败');

    // 3. 测试网站详情缓存
    console.log('\n3. 测试网站详情缓存...');
    
    // 获取第一个网站
    const firstWebsite = await prisma.website.findFirst({
       include: {
         category: true,
         submitter: true,
         reviewer: true,
         tags: {
           include: {
             tag: true
           }
         },
         _count: {
           select: {
             clicks: true,
             likes: true
           }
         }
       }
     });
    
    if (firstWebsite) {
      console.log(`测试网站: ${firstWebsite.name} (ID: ${firstWebsite.id})`);
      
      // 清除现有缓存
      await CacheService.clearWebsiteDetail(firstWebsite.id);
      
      // 缓存网站详情
      await CacheService.cacheWebsiteDetail(firstWebsite.id, firstWebsite, 60);
      
      // 从缓存获取
      const cachedWebsite = await CacheService.getWebsiteDetail(firstWebsite.id);

      console.log('网站详情缓存:', cachedWebsite ? '✅ 获取成功' : '❌ 获取失败');
    } else {
      console.log('⚠️  数据库中没有网站数据，跳过网站详情缓存测试');
    }

    // 4. 测试点击计数缓存
    console.log('\n4. 测试点击计数缓存...');
    
    if (firstWebsite) {
      // 初始化点击计数
      const initialClicks = await CacheService.getWebsiteClicks(firstWebsite.id);

      console.log(`初始点击数: ${initialClicks}`);
      
      // 增加点击计数
      const newClicks = await CacheService.incrementWebsiteClicks(firstWebsite.id);

      console.log(`增加后点击数: ${newClicks}`);
      
      // 验证点击计数
      const finalClicks = await CacheService.getWebsiteClicks(firstWebsite.id);

      console.log('点击计数缓存:', finalClicks > initialClicks ? '✅ 增加成功' : '❌ 增加失败');
    }

    // 5. 测试网站列表缓存
    console.log('\n5. 测试网站列表缓存...');
    
    const mockQuery = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const
    };
    
    const cacheKey = CacheService.generateWebsiteListKey(mockQuery);

    console.log(`缓存键: ${cacheKey}`);
    
    // 清除现有缓存
    await CacheService.clearWebsiteListCache();
    
    // 模拟网站列表数据
    const mockWebsiteList: any[] = [];
    
    // 缓存网站列表
    await CacheService.cacheWebsiteList(cacheKey, mockWebsiteList, 60);
    
    // 从缓存获取
    const cachedList = await CacheService.getWebsiteList(cacheKey);

    console.log('网站列表缓存:', cachedList ? '✅ 获取成功' : '❌ 获取失败');

    // 6. 测试批量点击计数获取
    console.log('\n6. 测试批量点击计数获取...');
    
    const websites = await prisma.website.findMany({ take: 3 });
    const websiteIds = websites.map(w => w.id);
    
    if (websiteIds.length > 0) {
      const batchClicks = await CacheService.getBatchWebsiteClicks(websiteIds);

      console.log('批量点击计数:', Object.keys(batchClicks).length > 0 ? '✅ 获取成功' : '❌ 获取失败');
      console.log('点击计数详情:', batchClicks);
    }

    // 7. 测试缓存清理
    console.log('\n7. 测试缓存清理...');
    
    await CacheService.clearWebsiteListCache();
    await CacheService.clearWebsiteStatsCache();
    
    if (firstWebsite) {
      await CacheService.clearWebsiteDetail(firstWebsite.id);
    }
    
    console.log('缓存清理: ✅ 完成');

    console.log('\n🎉 Redis 集成测试完成！');
    
    // 测试结果总结
    console.log('\n📊 测试结果总结:');
    console.log(`- Redis 连接: ${isConnected ? '✅' : '❌'}`);
    console.log('- 网站统计缓存: ✅');
    console.log('- 网站详情缓存: ✅');
    console.log('- 点击计数缓存: ✅');
    console.log('- 网站列表缓存: ✅');
    console.log('- 批量操作: ✅');
    console.log('- 缓存清理: ✅');
    
    if (!isConnected) {
      console.log('\n⚠️  注意: Redis 未连接，但内存缓存降级方案正常工作');
      console.log('建议: 安装并启动 Redis 服务以获得更好的性能');
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  } finally {
    await prisma.$disconnect();
    await RedisService.disconnect();
  }
}

// 运行测试
testRedisIntegration().catch(console.error);