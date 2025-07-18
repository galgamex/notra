import { WebsiteStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import CacheService from '@/services/cache';
import WebsiteService from '@/services/website';
import type {
	CreateWebsiteFormValues,
	WebsiteListQuery
} from '@/types/website';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// 检查用户的NSFW偏好设置
		const nsfwCookie = await request.cookies.get('nsfw_enabled');
		const nsfwEnabled = nsfwCookie?.value === 'true';

		const query: WebsiteListQuery = {
			page: parseInt(searchParams.get('page') || '1'),
			limit: parseInt(searchParams.get('limit') || '10'),
			categoryId: searchParams.get('categoryId') || undefined,
			tagId: searchParams.get('tagId') || undefined,
			status: (searchParams.get('status') as WebsiteStatus) || undefined,
			search: searchParams.get('search') || undefined,
			submitterId: searchParams.get('submitterId') || undefined,
			isRecommend:
				searchParams.get('isRecommend') === 'true'
					? true
					: searchParams.get('isRecommend') === 'false'
						? false
						: undefined,
			isFeatured:
				searchParams.get('isFeatured') === 'true'
					? true
					: searchParams.get('isFeatured') === 'false'
						? false
						: undefined,
			isNSFW: nsfwEnabled ? undefined : false, // 如果未启用NSFW，则过滤掉NSFW内容
			sortBy:
				(searchParams.get('sortBy') as
					| 'createdAt'
					| 'updatedAt'
					| 'clickCount'
					| 'sortOrder'
					| 'name') || 'createdAt',
			sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
		};

		// 直接从数据库获取数据，确保数据准确性
		const result = await WebsiteService.getWebsites(query);

		return NextResponse.json(result);
	} catch (error) {

		console.error('获取网站列表失败:', error);

		return NextResponse.json({ error: '获取网站列表失败' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: '请先登录' }, { status: 401 });
		}

		const data: CreateWebsiteFormValues = await request.json();

		// 验证必填字段
		if (!data.name || !data.url || !data.categoryId) {
			return NextResponse.json(
				{ error: '网站名称、链接和分类不能为空' },
				{ status: 400 }
			);
		}

		// 验证URL格式
		try {
			new URL(data.url);
		} catch {
			return NextResponse.json(
				{ error: '请输入有效的网站链接' },
				{ status: 400 }
			);
		}

		const website = await WebsiteService.createWebsite(data, session.user.id);

		// 清除相关缓存
		await CacheService.clearWebsiteListCache();
		await CacheService.clearWebsiteStatsCache();

		return NextResponse.json(website, { status: 201 });
	} catch (error) {

		console.error('创建网站失败:', error);

		return NextResponse.json({ error: '创建网站失败' }, { status: 500 });
	}
}
