import { NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import CacheService from '@/services/cache';
import WebsiteService from '@/services/website';

export async function GET() {
	try {
		const session = await auth();

		if (!session?.user?.id || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: '权限不足' }, { status: 403 });
		}

		// 尝试从缓存获取统计数据
		let stats = await CacheService.getWebsiteStats();

		if (!stats) {
			// 缓存未命中，从数据库获取
			console.log('缓存未命中，从数据库获取网站统计数据');
			stats = await WebsiteService.getStats();

			// 缓存结果（30分钟）
			await CacheService.cacheWebsiteStats(stats, 30 * 60);
		} else {
			console.log('从缓存获取网站统计数据');
		}

		return NextResponse.json(stats);
	} catch (error) {
		console.error('获取网站统计失败:', error);

		return NextResponse.json({ error: '获取网站统计失败' }, { status: 500 });
	}
}
