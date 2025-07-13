import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { WebsiteService } from '@/services/website';
import type {
	CreateWebsiteCategoryFormValues,
	WebsiteCategoryListQuery
} from '@/types/website';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		const query: WebsiteCategoryListQuery = {
			page: parseInt(searchParams.get('page') || '1'),
			limit: parseInt(searchParams.get('limit') || '10'),
			search: searchParams.get('search') || undefined,
			isVisible:
				searchParams.get('isVisible') === 'true'
					? true
					: searchParams.get('isVisible') === 'false'
						? false
						: undefined,
			sortBy: (searchParams.get('sortBy') as 'createdAt' | 'updatedAt' | 'sortOrder' | 'name') || 'sortOrder',
			sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
			level: searchParams.get('level')
				? parseInt(searchParams.get('level')!)
				: undefined,
			parentId: searchParams.get('parentId') || undefined
		};

		const result = await WebsiteService.getCategories(query);

		return NextResponse.json(result);
	} catch (error) {
		console.error('获取网站分类列表失败:', error);

		return NextResponse.json(
			{ error: '获取网站分类列表失败' },
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

		const data: CreateWebsiteCategoryFormValues = await request.json();

		// 验证必填字段
		if (!data.name || !data.slug) {
			return NextResponse.json(
				{ error: '分类名称和别名不能为空' },
				{ status: 400 }
			);
		}

		const category = await WebsiteService.createCategory(data);

		return NextResponse.json(category, { status: 201 });
	} catch (error) {
		console.error('创建网站分类失败:', error);

		return NextResponse.json({ error: '创建网站分类失败' }, { status: 500 });
	}
}
