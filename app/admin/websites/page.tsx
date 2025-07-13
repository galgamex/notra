import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

import WebsiteStatsCards from './_components/website-stats-cards';
import WebsitesList from './_components/websites-list';

export const metadata: Metadata = {
	title: '网站管理',
	description: '管理网站收录和审核'
};

export default function WebsitesPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">网站管理</h1>
					<p className="text-muted-foreground">管理网站收录、审核和分类</p>
				</div>
				<Button asChild>
					<Link href="/admin/websites/new">
						<Plus className="mr-2 h-4 w-4" />
						添加网站
					</Link>
				</Button>
			</div>

			<WebsiteStatsCards />

			<Card>
				<CardHeader>
					<CardTitle>网站列表</CardTitle>
					<CardDescription>
						管理所有收录的网站，包括审核、编辑和删除操作
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<div>加载中...</div>}>
						<WebsitesList />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}
