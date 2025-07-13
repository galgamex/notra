import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Eye, MessageCircle, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { PostWithDetails } from '@/types/blog';

interface BlogPostCardProps {
	post: PostWithDetails;
	variant?: 'default' | 'compact';
}

export function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
	const isCompact = variant === 'compact';

	return (
		<div
			className={`overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-card ${isCompact ? 'h-64' : 'h-80'}`}
		>
			<Link href={`/blog/${post.slug}`}>
				<div className="group relative">
					{/* 特色图片 */}
					<div
						className={`relative ${isCompact ? 'h-32' : 'h-48'} overflow-hidden bg-gray-200 dark:bg-gray-700`}
					>
						{post.coverImage ? (
							<Image
								fill
								alt={post.title}
								className="object-cover transition-transform duration-300 group-hover:scale-105"
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
								<span
									className="rounded px-2 py-1 text-xs font-medium text-white"
									style={{ backgroundColor: post.category.color || '#3B82F6' }}
								>
									{post.category.name}
								</span>
							</div>
						)}
					</div>

					{/* 内容区域 */}
					<div className="p-4">
						{/* 标题 */}
						<h3
							className={`line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600 ${isCompact ? 'mb-1 text-sm' : 'mb-2 text-lg'}`}
						>
							{post.title}
						</h3>

						{/* 摘要 */}
						{!isCompact && post.excerpt && (
							<p className="mb-3 line-clamp-2 text-sm text-gray-600">
								{post.excerpt}
							</p>
						)}

						{/* 标签 */}
						{post.tags.length > 0 && (
							<div className="mb-2 flex flex-wrap gap-1">
								{post.tags.slice(0, isCompact ? 2 : 3).map(({ tag }) => (
									<span
										key={tag.id}
										className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
										style={{
											backgroundColor: tag.color ? `${tag.color}20` : undefined,
											color: tag.color || undefined
										}}
									>
										#{tag.name}
									</span>
								))}
								{post.tags.length > (isCompact ? 2 : 3) && (
									<span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
										+{post.tags.length - (isCompact ? 2 : 3)}
									</span>
								)}
							</div>
						)}

						{/* 底部信息 */}
						<div
							className={`flex items-center justify-between text-xs text-gray-500 ${isCompact ? 'mt-auto' : ''}`}
						>
							<div className="flex items-center space-x-3">
								<div className="flex items-center space-x-1">
									<User className="h-3 w-3" />
									<span>{post.author.name || post.author.username}</span>
								</div>
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

							<div className="flex items-center space-x-3">
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
					</div>
				</div>
			</Link>
		</div>
	);
}
