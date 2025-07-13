import { NextResponse } from 'next/server';

import WebsiteService from '@/services/website';

export async function GET() {
	try {
		const categoryTree = await WebsiteService.getCategoryTree();

		return NextResponse.json(categoryTree);
	} catch (error) {
		console.error('获取分类树失败:', error);

		return NextResponse.json({ error: '获取分类树失败' }, { status: 500 });
	}
}
