import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { WebsiteService } from '@/services/website';

import CategoryForm from '../../_components/category-form';

export const metadata: Metadata = {
	title: '编辑网站分类',
	description: '编辑网站分类信息'
};

interface EditCategoryPageProps {
	params: {
		id: string;
	};
}

export default async function EditCategoryPage({
	params
}: EditCategoryPageProps) {
	let category;

	try {
		category = await WebsiteService.getCategoryById(params.id);
	} catch (error) {
		console.error('获取分类失败:', error);
		notFound();
	}

	if (!category) {
		notFound();
	}

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
					<h1 className="text-3xl font-bold tracking-tight">编辑分类</h1>
					<p className="text-muted-foreground">编辑分类：{category.name}</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>分类信息</CardTitle>
					<CardDescription>修改分类的基本信息</CardDescription>
				</CardHeader>
				<CardContent>
					<CategoryForm categoryId={params.id} initialData={category} />
				</CardContent>
			</Card>
		</div>
	);
}
