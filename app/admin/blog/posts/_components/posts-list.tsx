'use client';

import { PostStatus } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
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
import { PostWithDetails } from '@/types/blog';

export default function PostsList() {
	const [posts, setPosts] = useState<PostWithDetails[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const fetchPosts = async () => {
		try {
			const response = await fetch('/api/blog/posts');

			if (response.ok) {
				const data = await response.json();

				setPosts(data.posts || []);
			} else {
				toast.error('获取文章列表失败');
			}
		} catch (error) {
			console.error('获取文章列表失败:', error);
			toast.error('获取文章列表失败');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		setDeletingId(id);

		try {
			const response = await fetch(`/api/blog/posts/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				toast.success('文章删除成功');
				fetchPosts(); // 重新获取列表
			} else {
				toast.error('删除文章失败');
			}
		} catch (error) {
			console.error('删除文章失败:', error);
			toast.error('删除文章失败');
		} finally {
			setDeletingId(null);
		}
	};

	const getStatusBadge = (status: PostStatus) => {
		switch (status) {
			case PostStatus.PUBLISHED:
				return (
					<Badge className="bg-green-100 text-green-800" variant="default">
						已发布
					</Badge>
				);
			case PostStatus.DRAFT:
				return <Badge variant="secondary">草稿</Badge>;
			case PostStatus.ARCHIVED:
				return <Badge variant="outline">已归档</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardContent className="p-6">
							<div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
							<div className="mb-4 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
							<div className="flex gap-2">
								<div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
								<div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="py-12 text-center">
				<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
					<Edit className="h-12 w-12 text-gray-400" />
				</div>
				<h3 className="mb-2 text-lg font-medium text-gray-900">暂无文章</h3>
				<p className="mb-6 text-gray-500">开始创建您的第一篇文章吧</p>
				<Button asChild>
					<Link href="/admin/blog/posts/new">
						<Plus className="mr-2 h-4 w-4" />
						创建文章
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{posts.map((post) => (
				<div
					key={post.id}
					className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
				>
					<div className="flex min-w-0 flex-1 items-center gap-4">
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<h3 className="truncate font-medium text-gray-900 hover:text-blue-600">
									<Link href={`/admin/blog/posts/${post.id}/edit`}>
										{post.title}
									</Link>
								</h3>
								{getStatusBadge(post.status)}
							</div>
						</div>

						<div className="flex items-center gap-2 text-sm text-gray-500">
							<span>{post.author.name || post.author.username}</span>
						</div>

						{post.category && (
							<Badge
								className="text-xs"
								style={{
									borderColor: post.category.color || '#e5e7eb',
									color: post.category.color || '#6b7280'
								}}
								variant="outline"
							>
								{post.category.name}
							</Badge>
						)}

						<div className="flex items-center gap-1 text-sm text-gray-500">
							<Eye className="h-4 w-4" />
							<span>{post.viewCount}</span>
						</div>

						<div className="text-sm text-gray-500">
							{post.publishedAt
								? formatDistanceToNow(new Date(post.publishedAt), {
									addSuffix: true,
									locale: zhCN
								})
								: formatDistanceToNow(new Date(post.createdAt), {
									addSuffix: true,
									locale: zhCN
								})}
						</div>

						{post.tags && post.tags.length > 0 && (
							<div className="flex gap-1">
								{post.tags.slice(0, 2).map((postTag) => (
									<Badge
										key={postTag.tag.id}
										className="text-xs"
										style={{
											backgroundColor: postTag.tag.color
												? `${postTag.tag.color}20`
												: undefined,
											color: postTag.tag.color || undefined,
											borderColor: postTag.tag.color || undefined
										}}
										variant="secondary"
									>
										{postTag.tag.name}
									</Badge>
								))}
								{post.tags.length > 2 && (
									<Badge className="text-xs" variant="secondary">
										+{post.tags.length - 2}
									</Badge>
								)}
							</div>
						)}
					</div>

					<div className="flex items-center gap-2">
						<Button asChild size="sm" variant="outline">
							<Link href={`/admin/blog/posts/${post.id}/edit`}>
								<Edit className="h-4 w-4" />
							</Link>
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									disabled={deletingId === post.id}
									size="sm"
									variant="outline"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>确认删除</AlertDialogTitle>
									<AlertDialogDescription>
										您确定要删除文章「{post.title}」吗？此操作无法撤销。
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>取消</AlertDialogCancel>
									<AlertDialogAction
										className="bg-red-600 hover:bg-red-700"
										onClick={() => handleDelete(post.id)}
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
