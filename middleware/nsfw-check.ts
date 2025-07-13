import { NextRequest, NextResponse } from 'next/server';

import WebsiteService from '@/services/website';

/**
 * 检查NSFW网站访问权限的中间件
 * @param request NextRequest对象
 * @param websiteId 网站ID
 * @returns 如果允许访问返回null，否则返回重定向响应
 */
export async function checkNSFWAccess(
	request: NextRequest,
	websiteId: string
): Promise<NextResponse | null> {
	try {
		// 获取网站信息
		const website = await WebsiteService.getWebsiteById(websiteId);
		
		if (!website) {
			return NextResponse.json(
				{ error: '网站不存在' },
				{ status: 404 }
			);
		}

		// 如果不是NSFW网站，直接允许访问
		if (!website.isNSFW) {
			return null;
		}

		// 检查用户的NSFW偏好设置
		const nsfwCookie = request.cookies.get('nsfw_enabled');
		const nsfwEnabled = nsfwCookie?.value === 'true';

		// 如果用户未启用NSFW，拒绝访问
		if (!nsfwEnabled) {
			return NextResponse.json(
				{ 
					error: 'NSFW_ACCESS_DENIED',
					message: '此网站包含NSFW内容，请先在设置中启用NSFW内容显示',
					websiteId,
					websiteName: website.name
				},
				{ status: 403 }
			);
		}

		// 允许访问
		return null;
	} catch (error) {
		console.error('NSFW访问检查失败:', error);

		return NextResponse.json(
			{ error: '服务器错误' },
			{ status: 500 }
		);
	}
}

/**
 * 创建NSFW访问检查的API路由处理器
 * @param websiteId 网站ID
 * @returns API路由处理器
 */
export function createNSFWCheckHandler(websiteId: string) {
	return async function GET(request: NextRequest) {
		const checkResult = await checkNSFWAccess(request, websiteId);
		
		if (checkResult) {
			return checkResult;
		}
		
		return NextResponse.json({ allowed: true });
	};
}