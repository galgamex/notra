import { NextRequest, NextResponse } from 'next/server';

import WebsiteService from '@/services/website';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('q');
		const limit = parseInt(searchParams.get('limit') || '5');

		if (!query) {
			return NextResponse.json(
				{ error: '搜索关键词不能为空' },
				{ status: 400 }
			);
		}

		// 检查用户的NSFW偏好设置
		const nsfwCookie = await request.cookies.get('nsfw_enabled');
		const nsfwEnabled = nsfwCookie?.value === 'true';

		const websites = await WebsiteService.searchSuggestions(query, limit, nsfwEnabled);

		return NextResponse.json(websites);
	} catch (error) {

		console.error('Failed to search websites:', error);

		return NextResponse.json({ error: '获取搜索建议失败' }, { status: 500 });
	}
}
