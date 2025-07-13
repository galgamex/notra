import { NextRequest, NextResponse } from 'next/server';

import { BlogService } from '@/services/blog';

interface RouteParams {
	params: {
		slug: string;
	};
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { slug } = await params;
		const post = await BlogService.getPostBySlug(slug);

		if (!post) {
			return NextResponse.json({ error: '文章不存在' }, { status: 404 });
		}

		// 增加浏览次数
		await BlogService.incrementViewCount(post.id);

		return NextResponse.json(post);
	} catch (error) {
		console.error('获取文章失败:', error);

		return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
	}
}
