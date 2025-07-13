'use client';

import { Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryWithDetails } from '@/types/blog';

export default function CategoriesList() {
	const [categories, setCategories] = useState<CategoryWithDetails[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const fetchCategories = async () => {
		try {
			const response = await fetch('/api/blog/categories');

			if (response.ok) {
				const data = await response.json();

				setCategories(data);
			} else {
				toast.error('获取分类列表失败');
			}
		} catch (error) {
			console.error('获取分类列表失败:', error);
			toast.error('获取分类列表失败');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		setDeletingId(id);

		try {
			const response = await fetch(`/api/blog/categories/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				toast.success('分类删除成功');
				setCategories(categories.filter((cat) => cat.id !== id));
			} else {
				const error = await response.json();

				toast.error(error.error || '删除分类失败');
			}
		} catch (error) {
			console.error('删除分类失败:', error);
			toast.error('删除分类失败');
		} finally {
			setDeletingId(null);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="animate-pulse">
								<div className="mb-2 h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="mb-4 h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (categories.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
				<p className="mb-4 text-muted-foreground">还没有创建任何分类</p>
				<Button asChild variant="outline">
					<Link href="/admin/blog/categories/new">
						<Plus className="mr-2" size={16} />
						创建第一个分类
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{categories.map((category) => (
				<div
					key={category.id}
					className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
				>
					<div className="flex min-w-0 flex-1 items-center gap-4">
						<div className="flex items-center gap-3">
							<h3 className="font-medium">{category.name}</h3>
							{category.color && (
								<div
									className="h-4 w-4 rounded-full border border-gray-200"
									style={{ backgroundColor: category.color }}
								/>
							)}
						</div>

						<div className="text-sm text-muted-foreground">
							别名:{' '}
							<code className="rounded bg-gray-100 px-1 dark:bg-gray-700">{category.slug}</code>
						</div>

						{category.description && (
							<div className="flex-1 truncate text-sm text-muted-foreground">
								{category.description}
							</div>
						)}

						<Badge variant="secondary">{category._count.posts} 篇文章</Badge>
					</div>

					<div className="flex items-center gap-2">
						<Button asChild size="sm" variant="outline">
							<Link href={`/admin/blog/categories/${category.id}/edit`}>
								<Edit className="mr-1" size={14} />
								编辑
							</Link>
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									disabled={deletingId === category.id}
									size="sm"
									variant="outline"
								>
									<Trash2 size={14} />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>确认删除分类</AlertDialogTitle>
									<AlertDialogDescription>
										您确定要删除分类 &ldquo;{category.name}&rdquo;
										吗？此操作无法撤销。
										{category._count.posts > 0 && (
											<span className="mt-2 block text-red-600">
												注意：该分类下还有 {category._count.posts}{' '}
												篇文章，删除后这些文章将失去分类。
											</span>
										)}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>取消</AlertDialogCancel>
									<AlertDialogAction
										className="bg-red-600 hover:bg-red-700"
										onClick={() => handleDelete(category.id)}
									>
										删除
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			))}
		</div>
	);
}
