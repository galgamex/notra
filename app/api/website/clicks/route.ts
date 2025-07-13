import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { WebsiteService } from '@/services/website';
import type { WebsiteClickQuery } from '@/types/website';

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: '权限不足' }, { status: 403 });
		}

		const { searchParams } = new URL(request.url);

		const query: WebsiteClickQuery = {
			websiteId: searchParams.get('websiteId') || undefined,
			userId: searchParams.get('userId') || undefined,
			startDate: searchParams.get('startDate')
				? new Date(searchParams.get('startDate')!)
				: undefined,
			endDate: searchParams.get('endDate')
				? new Date(searchParams.get('endDate')!)
				: undefined,
			page: parseInt(searchParams.get('page') || '1'),
			limit: parseInt(searchParams.get('limit') || '10')
		};

		const result = await WebsiteService.getClicks(query);

		return NextResponse.json(result);
	} catch (error) {
		console.error('获取点击记录失败:', error);

		return NextResponse.json({ error: '获取点击记录失败' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { websiteId } = await request.json();

		if (!websiteId) {
			return NextResponse.json({ error: '网站ID不能为空' }, { status: 400 });
		}

		const session = await auth();

		const click = await WebsiteService.recordClick({
			websiteId,
			userId: session?.user?.id,
			ipAddress:
				request.headers.get('x-forwarded-for')?.split(',')[0] ||
				request.headers.get('x-real-ip') ||
				(request as { ip?: string }).ip ||
				'unknown',
			userAgent: request.headers.get('user-agent') || 'unknown',
			referrer: request.headers.get('referer') || undefined
		});

		return NextResponse.json(click, { status: 201 });
	} catch (error) {
		console.error('记录点击失败:', error);

		return NextResponse.json({ error: '记录点击失败' }, { status: 500 });
	}
}
