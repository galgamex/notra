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
import { TagWithDetails } from '@/types/blog';

export default function TagsList() {
	const [tags, setTags] = useState<TagWithDetails[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const fetchTags = async () => {
		try {
			const response = await fetch('/api/blog/tags');

			if (response.ok) {
				const data = await response.json();

				setTags(data);
			} else {
				toast.error('获取标签列表失败');
			}
		} catch (error) {
			console.error('获取标签列表失败:', error);
			toast.error('获取标签列表失败');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		setDeletingId(id);

		try {
			const response = await fetch(`/api/blog/tags/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				toast.success('标签删除成功');
				setTags(tags.filter((tag) => tag.id !== id));
			} else {
				const error = await response.json();

				toast.error(error.error || '删除标签失败');
			}
		} catch (error) {
			console.error('删除标签失败:', error);
			toast.error('删除标签失败');
		} finally {
			setDeletingId(null);
		}
	};

	useEffect(() => {
		fetchTags();
	}, []);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<Card key={i}>
						<CardContent className="p-4">
							<div className="animate-pulse">
								<div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="mb-3 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (tags.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
				<p className="mb-4 text-muted-foreground">还没有创建任何标签</p>
				<Button asChild variant="outline">
					<Link href="/admin/blog/tags/new">
						<Plus className="mr-2" size={16} />
						创建第一个标签
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{tags.map((tag) => (
				<div
					key={tag.id}
					className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
				>
					<div className="flex min-w-0 flex-1 items-center gap-4">
						<div className="flex items-center gap-2">
							<h3 className="font-medium">{tag.name}</h3>
							{tag.color && (
								<div
									className="h-3 w-3 rounded-full border border-gray-200"
									style={{ backgroundColor: tag.color }}
								/>
							)}
						</div>

						<div className="text-sm text-muted-foreground">
							别名: <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">{tag.slug}</code>
						</div>

						<Badge className="text-xs" variant="secondary">
							{tag._count.posts} 篇文章
						</Badge>
					</div>

					<div className="flex items-center gap-2">
						<Button asChild size="sm" variant="outline">
							<Link href={`/admin/blog/tags/${tag.id}/edit`}>
								<Edit className="mr-1" size={12} />
								编辑
							</Link>
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									disabled={deletingId === tag.id}
									size="sm"
									variant="outline"
								>
									<Trash2 size={12} />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>确认删除标签</AlertDialogTitle>
									<AlertDialogDescription>
										您确定要删除标签 &ldquo;{tag.name}&rdquo;
										吗？此操作无法撤销。
										{tag._count.posts > 0 && (
											<span className="mt-2 block text-red-600">
												注意：该标签下还有 {tag._count.posts}{' '}
												篇文章，删除后这些文章将失去该标签。
											</span>
										)}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>取消</AlertDialogCancel>
									<AlertDialogAction
										className="bg-red-600 hover:bg-red-700"
										onClick={() => handleDelete(tag.id)}
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
