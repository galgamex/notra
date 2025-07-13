import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { BlogService } from '@/services/blog';
import type { CreateCategoryFormValues } from '@/types/blog';

export async function GET() {
	try {
		const categories = await BlogService.getCategories();

		return NextResponse.json(categories);
	} catch (error) {
		console.error('获取分类列表失败:', error);

		return NextResponse.json({ error: '获取分类列表失败' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: '请先登录' }, { status: 401 });
		}

		// 检查是否为管理员
		if ((session.user as { role?: string }).role !== 'ADMIN') {
			return NextResponse.json(
				{ error: '只有管理员可以创建分类' },
				{ status: 403 }
			);
		}

		const data: CreateCategoryFormValues = await request.json();

		// 验证必填字段
		if (!data.name || !data.slug) {
			return NextResponse.json(
				{ error: '分类名称和别名不能为空' },
				{ status: 400 }
			);
		}

		const category = await BlogService.createCategory(data);

		return NextResponse.json(category, { status: 201 });
	} catch (error) {
		console.error('创建分类失败:', error);

		return NextResponse.json({ error: '创建分类失败' }, { status: 500 });
	}
}
