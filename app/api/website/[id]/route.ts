import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { WebsiteService } from '@/services/website';
import type { UpdateWebsiteFormValues } from '@/types/website';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const website = await WebsiteService.getWebsiteById(params.id);

		if (!website) {
			return NextResponse.json({ error: '网站不存在' }, { status: 404 });
		}

		return NextResponse.json(website);
	} catch (error) {
		console.error('获取网站详情失败:', error);

		return NextResponse.json({ error: '获取网站详情失败' }, { status: 500 });
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: '请先登录' }, { status: 401 });
		}

		const data: UpdateWebsiteFormValues = await request.json();

		data.id = params.id;

		// 检查权限：管理员或网站提交者可以编辑
		const existingWebsite = await WebsiteService.getWebsiteById(params.id);

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

		return NextResponse.json(website);
	} catch (error) {
		console.error('更新网站失败:', error);

		return NextResponse.json({ error: '更新网站失败' }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: '请先登录' }, { status: 401 });
		}

		// 检查权限：管理员或网站提交者可以删除
		const existingWebsite = await WebsiteService.getWebsiteById(params.id);

		if (!existingWebsite) {
			return NextResponse.json({ error: '网站不存在' }, { status: 404 });
		}

		if (
			session.user.role !== 'ADMIN' &&
			existingWebsite.submitterId !== session.user.id
		) {
			return NextResponse.json({ error: '权限不足' }, { status: 403 });
		}

		await WebsiteService.deleteWebsite(params.id);

		return NextResponse.json({ message: '删除成功' });
	} catch (error) {
		console.error('删除网站失败:', error);

		return NextResponse.json({ error: '删除网站失败' }, { status: 500 });
	}
}
