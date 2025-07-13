import { NextRequest, NextResponse } from 'next/server';

import { WebsiteService } from '@/services/website';

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

		const suggestions = await WebsiteService.searchSuggestions(query, limit);

		return NextResponse.json(suggestions);
	} catch (error) {
		console.error('获取搜索建议失败:', error);

		return NextResponse.json({ error: '获取搜索建议失败' }, { status: 500 });
	}
}
