import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

import CategoryForm from '../_components/category-form';

export const metadata: Metadata = {
	title: '添加网站分类',
	description: '添加新的网站分类'
};

export default function NewCategoryPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button asChild size="sm" variant="ghost">
					<Link href="/admin/websites/categories">
						<ArrowLeft className="h-4 w-4" />
						返回
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">添加网站分类</h1>
					<p className="text-muted-foreground">创建新的网站分类</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>分类信息</CardTitle>
					<CardDescription>填写分类的基本信息</CardDescription>
				</CardHeader>
				<CardContent>
					<CategoryForm />
				</CardContent>
			</Card>
		</div>
	);
}
