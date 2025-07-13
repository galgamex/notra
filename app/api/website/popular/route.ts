import { NextRequest, NextResponse } from 'next/server';

import { WebsiteService } from '@/services/website';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get('limit') || '10');

		const websites = await WebsiteService.getPopularWebsites(limit);

		return NextResponse.json(websites);
	} catch (error) {
		console.error('获取热门网站失败:', error);

		return NextResponse.json({ error: '获取热门网站失败' }, { status: 500 });
	}
}
