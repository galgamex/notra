import { NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { BlogService } from '@/services/blog';

export async function GET() {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: '请先登录' }, { status: 401 });
		}

		// 检查是否为管理员
		if ((session.user as { role?: string }).role !== 'ADMIN') {
			return NextResponse.json(
				{ error: '只有管理员可以查看统计数据' },
				{ status: 403 }
			);
		}

		const stats = await BlogService.getStats();

		return NextResponse.json(stats);
	} catch (error) {
		console.error('获取统计数据失败:', error);

		return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
	}
}
