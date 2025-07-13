import { Metadata } from 'next';
import { Suspense } from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

import WebsiteStats from './_components/website-stats';
import WebsiteStatsCards from '../_components/website-stats-cards';

export const metadata: Metadata = {
	title: '网站统计',
	description: '查看网站访问统计和数据分析'
};

export default function WebsiteStatsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">网站统计</h1>
				<p className="text-muted-foreground">
					查看网站访问统计、热门网站和数据分析
				</p>
			</div>

			<Suspense fallback={<div>加载统计数据中...</div>}>
				<WebsiteStatsCards />
			</Suspense>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>热门网站排行</CardTitle>
						<CardDescription>按点击数排序的热门网站</CardDescription>
					</CardHeader>
					<CardContent>
						<Suspense fallback={<div>加载中...</div>}>
							<WebsiteStats type="popular" />
						</Suspense>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>最新添加</CardTitle>
						<CardDescription>最近添加的网站</CardDescription>
					</CardHeader>
					<CardContent>
						<Suspense fallback={<div>加载中...</div>}>
							<WebsiteStats type="recent" />
						</Suspense>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>分类统计</CardTitle>
					<CardDescription>各分类下的网站数量统计</CardDescription>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<div>加载中...</div>}>
						<WebsiteStats type="categories" />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}
