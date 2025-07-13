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

import CategoriesList from './_components/categories-list';

export const metadata: Metadata = {
	title: '网站分类管理',
	description: '管理网站分类'
};

export default function WebsiteCategoriesPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">网站分类管理</h1>
					<p className="text-muted-foreground">管理网站分类，组织网站内容</p>
				</div>
				<Button asChild>
					<Link href="/admin/websites/categories/new">
						<Plus className="mr-2 h-4 w-4" />
						添加分类
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>分类列表</CardTitle>
					<CardDescription>
						管理所有网站分类，包括编辑和删除操作
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<div>加载中...</div>}>
						<CategoriesList />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}
