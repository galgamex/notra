import { NextRequest, NextResponse } from 'next/server';

import WebsiteService from '@/services/website';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get('limit') || '10');

		// 检查用户的NSFW偏好设置
		const nsfwCookie = await request.cookies.get('nsfw_enabled');
		const nsfwEnabled = nsfwCookie?.value === 'true';

		const websites = await WebsiteService.getRecentWebsites(limit, nsfwEnabled);

		return NextResponse.json(websites);
	} catch (error) {

		console.error('Failed to get recent websites:', error);

		return NextResponse.json({ error: '获取最新网站失败' }, { status: 500 });
	}
}
