import { NextRequest, NextResponse } from 'next/server';

import WebsiteService from '@/services/website';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

		if (!slug) {
			return NextResponse.json({ error: '分类标识不能为空' }, { status: 400 });
		}

		const category = await WebsiteService.getCategoryBySlug(slug);

		if (!category) {
			return NextResponse.json({ error: '分类不存在' }, { status: 404 });
		}

		return NextResponse.json(category);
	} catch (error) {
		console.error('获取分类失败:', error);

		return NextResponse.json({ error: '获取分类失败' }, { status: 500 });
	}
}
