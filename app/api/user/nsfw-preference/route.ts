import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const NSFW_COOKIE_NAME = 'nsfw_enabled';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1年

// 获取用户NSFW偏好
export async function GET() {
	try {
		const cookieStore = await cookies();
		const nsfwEnabled = cookieStore.get(NSFW_COOKIE_NAME)?.value === 'true';

		return NextResponse.json({ nsfwEnabled });
	} catch (error) {
		console.error('获取NSFW偏好失败:', error);

		return NextResponse.json(
			{ error: '获取NSFW偏好失败' },
			{ status: 500 }
		);
	}
}

// 设置用户NSFW偏好
export async function POST(request: NextRequest) {
	try {
		const { nsfwEnabled } = await request.json();

		if (typeof nsfwEnabled !== 'boolean') {
			return NextResponse.json(
				{ error: 'nsfwEnabled必须是布尔值' },
				{ status: 400 }
			);
		}

		const response = NextResponse.json({ 
			message: 'NSFW偏好设置成功',
			nsfwEnabled 
		});

		// 设置Cookie
		response.cookies.set(NSFW_COOKIE_NAME, nsfwEnabled.toString(), {
			maxAge: COOKIE_MAX_AGE,
			httpOnly: false, // 允许客户端访问
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/'
		});

		return response;
	} catch (error) {
		console.error('设置NSFW偏好失败:', error);

		return NextResponse.json(
			{ error: '设置NSFW偏好失败' },
			{ status: 500 }
		);
	}
}