import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import WebsiteService from '@/services/website';
import type { WebsiteSubmissionFormValues } from '@/types/website';

export async function POST(request: NextRequest) {
	try {
		const data: WebsiteSubmissionFormValues = await request.json();

		// 验证必填字段
		if (!data.name || !data.url || !data.categoryId) {
			return NextResponse.json(
				{ error: '网站名称、链接和分类不能为空' },
				{ status: 400 }
			);
		}

		// 验证URL格式
		try {
			new URL(data.url);
		} catch {
			return NextResponse.json(
				{ error: '请输入有效的网站链接' },
				{ status: 400 }
			);
		}

		// 检查是否已登录
		const session = await auth();
		const submitterId = session?.user?.id;

		const website = await WebsiteService.submitWebsite(data, submitterId);

		return NextResponse.json(
			{
				message: '网站提交成功，等待管理员审核',
				website
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('提交网站失败:', error);

		return NextResponse.json({ error: '提交网站失败' }, { status: 500 });
	}
}
