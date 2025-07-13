import { NextRequest, NextResponse } from 'next/server';

import { BlogService } from '@/services/blog';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = await params;

		// 验证文章ID
		if (!id) {
			return NextResponse.json({ error: '文章ID不能为空' }, { status: 400 });
		}

		// 获取文章评论
		const comments = await BlogService.getCommentsByPostId(id);

		return NextResponse.json(comments);
	} catch (error) {
		console.error('获取评论失败:', error);

		return NextResponse.json({ error: '获取评论失败' }, { status: 500 });
	}
}
