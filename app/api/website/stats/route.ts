import { NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { WebsiteService } from '@/services/website';

export async function GET() {
	try {
		const session = await auth();

		if (!session?.user?.id || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: '权限不足' }, { status: 403 });
		}

		const stats = await WebsiteService.getStats();

		return NextResponse.json(stats);
	} catch (error) {
		console.error('获取网站统计失败:', error);

		return NextResponse.json({ error: '获取网站统计失败' }, { status: 500 });
	}
}
