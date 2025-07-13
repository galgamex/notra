import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import CacheService from '@/services/cache';
import WebsiteService from '@/services/website';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		// 尝试从缓存获取
		let website = await CacheService.getWebsiteDetail(id);

		if (!website) {
			// 缓存未命中，从数据库获取
			console.log('缓存未命中，从数据库获取网站详情');
			website = await WebsiteService.getWebsiteById(id);

			if (!website) {
				return NextResponse.json({ error: '网站不存在' }, { status: 404 });
			}

			// 缓存结果（15分钟）
			await CacheService.cacheWebsiteDetail(id, website, 15 * 60);
		} else {
			console.log('从缓存获取网站详情');
		}

		return NextResponse.json(website);
	} catch (error) {
		console.error('获取网站详情失败:', error);

		return NextResponse.json({ error: '获取网站详情失败' }, { status: 500 });
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const session = await auth();

		if (!session?.user) {
			return NextResponse.json({ error: '未授权' }, { status: 401 });
		}

		const data = await request.json();

		// 设置 ID
		data.id = id;

		// 检查网站是否存在
		const existingWebsite = await WebsiteService.getWebsiteById(id);

		if (!existingWebsite) {
			return NextResponse.json({ error: '网站不存在' }, { status: 404 });
		}

		if (
			session.user.role !== 'ADMIN' &&
			existingWebsite.submitterId !== session.user.id
		) {
			return NextResponse.json({ error: '权限不足' }, { status: 403 });
		}

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

		const website = await WebsiteService.updateWebsite(data);

		// 清除相关缓存
		await CacheService.clearWebsiteDetail(id);
		await CacheService.clearWebsiteListCache();
		await CacheService.clearWebsiteStatsCache();

		return NextResponse.json(website);
	} catch (error) {
		console.error('更新网站失败:', error);

		return NextResponse.json({ error: '更新网站失败' }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const session = await auth();

		if (!session?.user) {
			return NextResponse.json({ error: '未授权' }, { status: 401 });
		}

		// 检查网站是否存在
		const existingWebsite = await WebsiteService.getWebsiteById(id);

		if (!existingWebsite) {
			return NextResponse.json({ error: '网站不存在' }, { status: 404 });
		}

		if (
			session.user.role !== 'ADMIN' &&
			existingWebsite.submitterId !== session.user.id
		) {
			return NextResponse.json({ error: '权限不足' }, { status: 403 });
		}

// 删除网站
		await WebsiteService.deleteWebsite(id);

		// 清除相关缓存
		await CacheService.clearWebsiteDetail(id);
		await CacheService.clearWebsiteListCache();
		await CacheService.clearWebsiteStatsCache();

		return NextResponse.json({ message: '删除成功' });
	} catch (error) {
		console.error('删除网站失败:', error);

		return NextResponse.json({ error: '删除网站失败' }, { status: 500 });
	}
}
