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

import TagsList from './_components/tags-list';

export const metadata: Metadata = {
	title: '网站标签管理',
	description: '管理网站标签'
};

export default function WebsiteTagsPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">网站标签管理</h1>
					<p className="text-muted-foreground">
						管理网站标签，为网站添加更多描述信息
					</p>
				</div>
				<Button asChild>
					<Link href="/admin/websites/tags/new">
						<Plus className="mr-2 h-4 w-4" />
						添加标签
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>标签列表</CardTitle>
					<CardDescription>
						管理所有网站标签，包括编辑和删除操作
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<div>加载中...</div>}>
						<TagsList />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}
