'use client';

import { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WebsiteStats } from '@/types/website';

export default function WebsiteStatsCards() {
	const [stats, setStats] = useState<WebsiteStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			const response = await fetch('/api/website/stats');

			if (response.ok) {
				const data = await response.json();

				setStats(data);
			}
		} catch (error) {
			console.error('Failed to fetch website stats:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">加载中...</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">-</div>
							<p className="text-xs text-muted-foreground">正在获取数据</p>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">总网站数</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats?.totalWebsites || 0}</div>
					<p className="text-xs text-muted-foreground">所有状态的网站</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">已审核</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{stats?.approvedWebsites || 0}
					</div>
					<p className="text-xs text-muted-foreground">已通过审核的网站</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">待审核</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{stats?.pendingWebsites || 0}
					</div>
					<p className="text-xs text-muted-foreground">等待审核的网站</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">总点击数</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats?.totalClicks || 0}</div>
					<p className="text-xs text-muted-foreground">所有网站的点击总数</p>
				</CardContent>
			</Card>
		</div>
	);
}
