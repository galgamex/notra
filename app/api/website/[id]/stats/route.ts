import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

// 检测设备类型
function getDeviceType(userAgent: string): 'mobile' | 'desktop' {
	const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
	return mobileRegex.test(userAgent) ? 'mobile' : 'desktop';
}

const statsQuerySchema = z.object({
	days: z.coerce.number().min(1).max(90).default(30)
});

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { searchParams } = new URL(request.url);
		const { days } = statsQuerySchema.parse({
			days: searchParams.get('days')
		});

		const resolvedParams = await params;
		const websiteId = resolvedParams.id;

		// 验证网站是否存在
		const website = await prisma.website.findUnique({
			where: { id: websiteId }
		});

		if (!website) {
			return NextResponse.json(
				{ error: '网站不存在' },
				{ status: 404 }
			);
		}

		// 计算日期范围
		const endDate = endOfDay(new Date());
		const startDate = startOfDay(subDays(endDate, days - 1));

		// 获取点击数据，按日期分组
		const clickStats = await prisma.websiteClick.groupBy({
			by: ['createdAt'],
			where: {
				websiteId,
				createdAt: {
					gte: startDate,
					lte: endDate
				}
			},
			_count: {
				id: true
			}
		});

		// 获取唯一设备数据（基于IP地址和User Agent组合）
		const deviceStats = await prisma.websiteClick.groupBy({
			by: ['createdAt', 'ipAddress', 'userAgent'],
			where: {
				websiteId,
				createdAt: {
					gte: startDate,
					lte: endDate
				}
			}
		});

		// 按日期整理数据
		const dailyStats = new Map<string, { 
			visits: number; 
			mobileDevices: Set<string>;
			desktopDevices: Set<string>;
		}>();

		// 初始化所有日期
		for (let i = 0; i < days; i++) {
			const date = format(subDays(endDate, days - 1 - i), 'yyyy-MM-dd');
			dailyStats.set(date, { 
				visits: 0, 
				mobileDevices: new Set(),
				desktopDevices: new Set()
			});
		}

		// 统计访问次数
		clickStats.forEach((stat) => {
			const date = format(stat.createdAt, 'yyyy-MM-dd');
			const dayData = dailyStats.get(date);
			if (dayData) {
				dayData.visits += stat._count.id;
			}
		});

		// 统计唯一设备数（按设备类型分类）
		deviceStats.forEach((stat) => {
			const date = format(stat.createdAt, 'yyyy-MM-dd');
			const dayData = dailyStats.get(date);
			if (dayData && stat.ipAddress && stat.userAgent) {
				const deviceId = `${stat.ipAddress}-${stat.userAgent}`;
				const deviceType = getDeviceType(stat.userAgent);
				
				if (deviceType === 'mobile') {
					dayData.mobileDevices.add(deviceId);
				} else {
					dayData.desktopDevices.add(deviceId);
				}
			}
		});

		// 转换为数组格式
		const result = Array.from(dailyStats.entries()).map(([date, data]) => ({
			date,
			visits: data.visits,
			mobileDevices: data.mobileDevices.size,
			desktopDevices: data.desktopDevices.size,
			totalDevices: data.mobileDevices.size + data.desktopDevices.size
		}));

		// 计算总体统计
		const allMobileDevices = new Set<string>();
		const allDesktopDevices = new Set<string>();
		
		deviceStats.forEach((stat) => {
			if (stat.ipAddress && stat.userAgent) {
				const deviceId = `${stat.ipAddress}-${stat.userAgent}`;
				const deviceType = getDeviceType(stat.userAgent);
				
				if (deviceType === 'mobile') {
					allMobileDevices.add(deviceId);
				} else {
					allDesktopDevices.add(deviceId);
				}
			}
		});

		return NextResponse.json({
			stats: result,
			total: {
				visits: result.reduce((sum, day) => sum + day.visits, 0),
				mobileDevices: allMobileDevices.size,
				desktopDevices: allDesktopDevices.size,
				totalDevices: allMobileDevices.size + allDesktopDevices.size
			}
		});
	} catch (error) {
		console.error('获取网站统计数据失败:', error);
		return NextResponse.json(
			{ error: '获取统计数据失败' },
			{ status: 500 }
		);
	}
}