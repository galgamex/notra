'use client';

import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Eye, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PostWithDetails } from '@/types/blog';

interface RelatedPostsProps {
	currentPost: PostWithDetails;
}

interface RelatedPostCardProps {
	post: PostWithDetails;
}

function RelatedPostCard({ post }: RelatedPostCardProps) {
	return (
		<Card className="h-full transition-shadow duration-300 hover:shadow-lg">
			<Link href={`/blog/${post.slug}`}>
				<div className="cursor-pointer">
					{/* 图片 */}
					<div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-700">
						{post.coverImage ? (
							<Image
								fill
								alt={post.title}
								className="object-cover transition-transform duration-300 hover:scale-105"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								src={post.coverImage}
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
								<span className="text-sm text-gray-400">暂无图片</span>
							</div>
						)}

						{/* 分类标签 */}
						{post.category && (
							<div className="absolute top-2 left-2">
								<Badge
									className="text-xs text-white"
									style={{ backgroundColor: post.category.color || '#3B82F6' }}
								>
									{post.category.name}
								</Badge>
							</div>
						)}
					</div>

					<CardContent className="p-4">
						{/* 标题 */}
						<h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400">
							{post.title}
						</h3>

						{/* 摘要 */}
						{post.excerpt && (
							<p className="mb-3 line-clamp-2 text-sm text-gray-600">
								{post.excerpt}
							</p>
						)}

						{/* 标签 */}
						{post.tags.length > 0 && (
							<div className="mb-3 flex flex-wrap gap-1">
								{post.tags.slice(0, 2).map(({ tag }) => (
									<Badge
										key={tag.id}
										className="text-xs"
										style={{
											borderColor: tag.color || undefined,
											color: tag.color || undefined
										}}
										variant="outline"
									>
										#{tag.name}
									</Badge>
								))}
								{post.tags.length > 2 && (
									<Badge className="text-xs" variant="outline">
										+{post.tags.length - 2}
									</Badge>
								)}
							</div>
						)}

						{/* 底部信息 */}
						<div className="flex items-center justify-between text-xs text-gray-500">
							<div className="flex items-center space-x-2">
								<div className="flex items-center space-x-1">
									<Calendar className="h-3 w-3" />
									<span>
										{formatDistanceToNow(new Date(post.createdAt), {
											addSuffix: true,
											locale: zhCN
										})}
									</span>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<div className="flex items-center space-x-1">
									<Eye className="h-3 w-3" />
									<span>{post.viewCount}</span>
								</div>
								<div className="flex items-center space-x-1">
									<MessageCircle className="h-3 w-3" />
									<span>{post._count.comments}</span>
								</div>
							</div>
						</div>
					</CardContent>
				</div>
			</Link>
		</Card>
	);
}

export default function RelatedPosts({ currentPost }: RelatedPostsProps) {
	const [relatedPosts, setRelatedPosts] = useState<PostWithDetails[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRelatedPosts = async () => {
			try {
				// 构建查询参数，优先获取同分类或同标签的文章
				const params = new URLSearchParams({
					limit: '6',
					status: 'PUBLISHED'
				});

				// 如果有分类，优先获取同分类的文章
				if (currentPost.categoryId) {
					params.append('categoryId', currentPost.categoryId);
				}

				const response = await fetch(`/api/blog/posts?${params}`);

				if (response.ok) {
					const data = await response.json();
					// 过滤掉当前文章
					const filtered = data.posts.filter(
						(post: PostWithDetails) => post.id !== currentPost.id
					);

					// 如果同分类的文章不够，再获取一些其他文章
					if (filtered.length < 3) {
						const additionalParams = new URLSearchParams({
							limit: '6',
							status: 'PUBLISHED'
						});

						const additionalResponse = await fetch(
							`/api/blog/posts?${additionalParams}`
						);

						if (additionalResponse.ok) {
							const additionalData = await additionalResponse.json();
							const additionalFiltered = additionalData.posts.filter(
								(post: PostWithDetails) =>
									post.id !== currentPost.id &&
									!filtered.some((p: PostWithDetails) => p.id === post.id)
							);

							setRelatedPosts([...filtered, ...additionalFiltered].slice(0, 3));
						} else {
							setRelatedPosts(filtered.slice(0, 3));
						}
					} else {
						setRelatedPosts(filtered.slice(0, 3));
					}
				}
			} catch (error) {
				console.error('获取相关文章失败:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRelatedPosts();
	}, [currentPost.id, currentPost.categoryId]);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>相关文章</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="animate-pulse">
								<div className="mb-4 h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
					<div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (relatedPosts.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>相关文章</CardTitle>
					<Link href="/">
						<Button size="sm" variant="ghost">
							查看更多
							<ArrowRight className="ml-1 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{relatedPosts.map((post) => (
						<RelatedPostCard key={post.id} post={post} />
					))}
					)
				</div>
			</CardContent>
		</Card>
	);
}
