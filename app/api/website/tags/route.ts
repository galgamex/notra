import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { WebsiteService } from '@/services/website';
import type {
	CreateWebsiteTagFormValues,
	WebsiteTagListQuery
} from '@/types/website';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		const query: WebsiteTagListQuery = {
			page: parseInt(searchParams.get('page') || '1'),
			limit: parseInt(searchParams.get('limit') || '10'),
			search: searchParams.get('search') || undefined,
			sortBy: (searchParams.get('sortBy') as 'createdAt' | 'updatedAt' | 'name') || 'createdAt',
			sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
		};

		const result = await WebsiteService.getTags(query);

		return NextResponse.json(result);
	} catch (error) {
		console.error('获取网站标签列表失败:', error);

		return NextResponse.json(
			{ error: '获取网站标签列表失败' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: '权限不足' }, { status: 403 });
		}

		const data: CreateWebsiteTagFormValues = await request.json();

		// 验证必填字段
		if (!data.name || !data.slug) {
			return NextResponse.json(
				{ error: '标签名称和别名不能为空' },
				{ status: 400 }
			);
		}

		const tag = await WebsiteService.createTag(data);

		return NextResponse.json(tag, { status: 201 });
	} catch (error) {
		console.error('创建网站标签失败:', error);

		return NextResponse.json({ error: '创建网站标签失败' }, { status: 500 });
	}
}
