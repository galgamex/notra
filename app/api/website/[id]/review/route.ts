import { WebsiteStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import WebsiteService from '@/services/website';
import type { WebsiteReviewFormValues } from '@/types/website';

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const session = await auth();

		if (!session?.user?.id || session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: '权限不足，只有管理员可以审核网站' },
				{ status: 403 }
			);
		}

		const { status, reviewNote } = await request.json();

		// 验证状态值
		if (!Object.values(WebsiteStatus).includes(status)) {
			return NextResponse.json({ error: '无效的审核状态' }, { status: 400 });
		}

		// 检查网站是否存在
		const existingWebsite = await WebsiteService.getWebsiteById(id);

		if (!existingWebsite) {
			return NextResponse.json({ error: '网站不存在' }, { status: 404 });
		}

		const reviewData: WebsiteReviewFormValues = {
			id: id,
			status,
			reviewNote
		};

		const website = await WebsiteService.reviewWebsite(
			reviewData,
			session.user.id
		);

		return NextResponse.json({
			message: '审核完成',
			website
		});
	} catch (error) {
		console.error('审核网站失败:', error);

		return NextResponse.json({ error: '审核网站失败' }, { status: 500 });
	}
}
