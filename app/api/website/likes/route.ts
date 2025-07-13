import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import prisma from '@/lib/prisma';
import type { WebsiteLikeRequest, WebsiteLikeResponse } from '@/types/website';

// 获取客户端IP地址
function getClientIP(request: NextRequest): string {
	const forwarded = request.headers.get('x-forwarded-for');
	const realIP = request.headers.get('x-real-ip');
	const remoteAddr = request.headers.get('remote-addr');
	
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}
	if (realIP) {
		return realIP;
	}
	if (remoteAddr) {
		return remoteAddr;
	}
	
	return 'unknown';
}

// POST /api/website/likes - 切换点赞状态
export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		const body: WebsiteLikeRequest = await request.json();
		const { websiteId } = body;
		
		if (!websiteId) {
			return NextResponse.json(
				{ success: false, message: '网站ID不能为空' },
				{ status: 400 }
			);
		}
		
		// 验证网站是否存在且已审核通过
		const website = await prisma.website.findFirst({
			where: {
				id: websiteId,
				status: 'APPROVED'
			}
		});
		
		if (!website) {
			return NextResponse.json(
				{ success: false, message: '网站不存在或未通过审核' },
				{ status: 404 }
			);
		}
		
		const userId = session?.user?.id;
		const ipAddress = getClientIP(request);
		const userAgent = request.headers.get('user-agent') || undefined;
		
		// 检查是否已经点赞
		let existingLike;
		if (userId) {
			// 已登录用户：按用户ID查找
			existingLike = await prisma.websiteLike.findFirst({
				where: {
					websiteId,
					userId
				}
			});
		} else {
			// 未登录用户：按IP地址查找
			existingLike = await prisma.websiteLike.findFirst({
				where: {
					websiteId,
					ipAddress,
					userId: null
				}
			});
		}
		
		let liked: boolean;
		
		if (existingLike) {
			// 已点赞，取消点赞
			await prisma.$transaction(async (tx) => {
				// 删除点赞记录
				await tx.websiteLike.delete({
					where: { id: existingLike.id }
				});
				
				// 减少点赞计数
				await tx.website.update({
					where: { id: websiteId },
					data: {
						likeCount: {
							decrement: 1
						}
					}
				});
			});
			
			liked = false;
		} else {
			// 未点赞，添加点赞
			await prisma.$transaction(async (tx) => {
				// 创建点赞记录
				await tx.websiteLike.create({
					data: {
						websiteId,
						userId,
						ipAddress: userId ? undefined : ipAddress,
						userAgent
					}
				});
				
				// 增加点赞计数
				await tx.website.update({
					where: { id: websiteId },
					data: {
						likeCount: {
							increment: 1
						}
					}
				});
			});
			
			liked = true;
		}
		
		// 获取更新后的点赞数
		const updatedWebsite = await prisma.website.findUnique({
			where: { id: websiteId },
			select: { likeCount: true }
		});
		
		const response: WebsiteLikeResponse = {
			success: true,
			liked,
			likeCount: updatedWebsite?.likeCount || 0,
			message: liked ? '点赞成功' : '取消点赞成功'
		};
		
		return NextResponse.json(response);
		
	} catch (error) {
		console.error('点赞操作失败:', error);
		return NextResponse.json(
			{ success: false, message: '操作失败，请稍后重试' },
			{ status: 500 }
		);
	}
}

// GET /api/website/likes?websiteId=xxx - 获取点赞状态
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const websiteId = searchParams.get('websiteId');
		
		if (!websiteId) {
			return NextResponse.json(
				{ success: false, message: '网站ID不能为空' },
				{ status: 400 }
			);
		}
		
		const session = await auth();
		const userId = session?.user?.id;
		const ipAddress = getClientIP(request);
		
		// 检查是否已点赞
		let liked = false;
		if (userId) {
			const existingLike = await prisma.websiteLike.findFirst({
				where: {
					websiteId,
					userId
				}
			});
			liked = !!existingLike;
		} else {
			const existingLike = await prisma.websiteLike.findFirst({
				where: {
					websiteId,
					ipAddress,
					userId: null
				}
			});
			liked = !!existingLike;
		}
		
		// 获取总点赞数
		const website = await prisma.website.findUnique({
			where: { id: websiteId },
			select: { likeCount: true }
		});
		
		const response: WebsiteLikeResponse = {
			success: true,
			liked,
			likeCount: website?.likeCount || 0
		};
		
		return NextResponse.json(response);
		
	} catch (error) {
		console.error('获取点赞状态失败:', error);
		return NextResponse.json(
			{ success: false, message: '获取失败，请稍后重试' },
			{ status: 500 }
		);
	}
}