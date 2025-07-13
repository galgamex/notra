import RedisService from '@/lib/redis';
import CacheService from '@/services/cache';

async function testRedis() {
  try {
    console.log('🔄 开始测试 Redis 连接和功能...');
    
    // 测试基本连接
    console.log('\n1. 测试基本连接');
    await RedisService.set('test:connection', 'Redis 连接成功!', 60);
    const connectionTest = await RedisService.get('test:connection');

    console.log('✅ 连接测试:', connectionTest);
    
    // 测试字符串操作
    console.log('\n2. 测试字符串操作');
    await RedisService.set('test:string', 'Hello Redis', 60);
    const stringValue = await RedisService.get('test:string');

    console.log('✅ 字符串值:', stringValue);
    
    // 测试 JSON 对象
    console.log('\n3. 测试 JSON 对象');
    const testObject = { name: 'Notra', version: '1.0.0', features: ['Redis', 'Cache'] };

    await RedisService.set('test:object', testObject, 60);
    const objectValue = await RedisService.get('test:object');

    console.log('✅ 对象值:', objectValue);
    
    // 测试计数器
    console.log('\n4. 测试计数器');
    await RedisService.set('test:counter', '0');
    const count1 = await RedisService.incr('test:counter');
    const count2 = await RedisService.incr('test:counter');

    console.log('✅ 计数器:', count1, '->', count2);
    
    // 测试哈希操作
    console.log('\n5. 测试哈希操作');
    await RedisService.hset('test:hash', 'field1', 'value1');
    await RedisService.hset('test:hash', 'field2', { nested: 'object' });
    const hashValue1 = await RedisService.hget('test:hash', 'field1');
    const hashValue2 = await RedisService.hget('test:hash', 'field2');
    const allHash = await RedisService.hgetall('test:hash');

    console.log('✅ 哈希值1:', hashValue1);
    console.log('✅ 哈希值2:', hashValue2);
    console.log('✅ 所有哈希:', allHash);
    
    // 测试列表操作
    console.log('\n6. 测试列表操作');
    await RedisService.lpush('test:list', 'item1', 'item2', 'item3');
    const listItems = await RedisService.lrange('test:list', 0, -1);

    console.log('✅ 列表项:', listItems);
    
    // 测试集合操作
    console.log('\n7. 测试集合操作');
    await RedisService.sadd('test:set', 'member1', 'member2', 'member3');
    const setMembers = await RedisService.smembers('test:set');
    const isMember = await RedisService.sismember('test:set', 'member1');

    console.log('✅ 集合成员:', setMembers);
    console.log('✅ 是否为成员:', isMember);
    
    // 测试 TTL
    console.log('\n8. 测试 TTL');
    await RedisService.set('test:ttl', 'expires soon', 5);
    const ttl = await RedisService.ttl('test:ttl');

    console.log('✅ 剩余时间:', ttl, '秒');
    
    // 测试缓存服务
    console.log('\n9. 测试缓存服务');
    const testWebsite = {
      id: 'test-website-1',
      title: '测试网站',
      url: 'https://example.com',
      description: '这是一个测试网站',
      clicks: 100
    };
    
    // 缓存网站详情
    await CacheService.cacheWebsiteDetail('test-website-1', testWebsite as any, 60);
    const cachedWebsite = await CacheService.getWebsiteDetail('test-website-1');

    console.log('✅ 缓存的网站:', cachedWebsite);
    
    // 测试点击计数
    const clicks1 = await CacheService.incrementWebsiteClicks('test-website-1');
    const clicks2 = await CacheService.incrementWebsiteClicks('test-website-1');

    console.log('✅ 点击计数:', clicks1, '->', clicks2);
    
    // 测试缓存键生成
    const cacheKey = CacheService.generateCacheKey('website:list', {
      page: 1,
      limit: 10,
      categoryId: 'tech'
    });

    console.log('✅ 生成的缓存键:', cacheKey);
    
    // 清理测试数据
    console.log('\n10. 清理测试数据');
    await RedisService.delPattern('test:*');
    await CacheService.clearWebsiteCache('test-website-1');
    console.log('✅ 测试数据已清理');
    
    console.log('\n🎉 Redis 测试完成！所有功能正常工作。');
    
  } catch (error) {
    console.error('❌ Redis 测试失败:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 提示: Redis 服务器未运行，请确保:');
        console.log('   1. 已安装 Redis');
        console.log('   2. Redis 服务正在运行');
        console.log('   3. 连接配置正确 (检查 .env 文件)');
      }
    }
  } finally {
    // 关闭连接
    const { closeRedis } = await import('@/lib/redis');

    await closeRedis();
    console.log('\n🔌 Redis 连接已关闭');
  }
}

testRedis();