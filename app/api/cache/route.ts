import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import RedisService from '@/lib/redis';
import CacheService from '@/services/cache';

export async function GET() {
	try {
		const session = await auth();

		if (!session?.user?.id || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: '权限不足' }, { status: 403 });
		}

		// 获取 Redis 连接状态
		const isConnected = await RedisService.checkConnection();

		// 获取缓存统计信息
		const stats = {
			redisConnected: isConnected,
			timestamp: new Date().toISOString()
		};

		return NextResponse.json(stats);
	} catch (error) {
		console.error('获取缓存状态失败:', error);

		return NextResponse.json({ error: '获取缓存状态失败' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: '权限不足' }, { status: 403 });
		}

		const { searchParams } = new URL(request.url);
		const type = searchParams.get('type');

		switch (type) {
			case 'website-list':
				await CacheService.clearWebsiteListCache();
				break;
			case 'website-stats':
				await CacheService.clearWebsiteStatsCache();
				break;
			case 'all':
				await CacheService.clearWebsiteListCache();
				await CacheService.clearWebsiteStatsCache();
				// 清除所有网站详情缓存
				await RedisService.delPattern('website:detail:*');
				// 清除所有点击计数缓存
				await RedisService.delPattern('website:clicks:*');
				break;
			default:
				return NextResponse.json(
					{ error: '无效的缓存类型' },
					{ status: 400 }
				);
		}

		return NextResponse.json({ message: '缓存清除成功' });
	} catch (error) {
		console.error('清除缓存失败:', error);

		return NextResponse.json({ error: '清除缓存失败' }, { status: 500 });
	}
}