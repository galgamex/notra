'use client';

import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Image from 'next/image';

import type { PostWithDetails } from '@/types/blog';

import CommentSection from './comment-section';

// 渲染内容函数，处理JSON格式转换
function renderContent(content: string): string {
	// 检查是否为JSON格式
	try {
		const parsed = JSON.parse(content);

		if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
			// 这是BlockNote的JSON格式，需要转换为HTML
			// 简单的转换逻辑，将段落转换为HTML
			return parsed
				.map((block) => {
					if (block.type === 'paragraph' && block.content) {
						const text = block.content
							.map((item: { text?: string }) => item.text || '')
							.join('');

						return `<p>${text}</p>`;
					}

					return '';
				})
				.join('');
		}
	} catch {
		// 不是JSON格式，直接返回原内容
	}

	return content;
}

interface BlogPostDetailProps {
	post: PostWithDetails;
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
	return (
		<article className=" mx-auto ">
			{/* 文章头部 */}
			<header className="mb-12 pt-8">
				{/* 标题 */}
				<h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl dark:text-gray-100">
					{post.title}
				</h1>

				{/* 文章元信息 */}
				<div className="flex items-center space-x-4 text-sm text-gray-500">
					<span>{post.author.name || post.author.username}</span>
					<span>•</span>
					<time>
						{format(new Date(post.createdAt), 'yyyy年MM月dd日', {
							locale: zhCN
						})}
					</time>
					<span>•</span>
					<span>{post.viewCount} 次阅读</span>
				</div>
			</header>

			{/* 特色图片 */}
			{post.coverImage && (
				<div className="relative mb-12 h-80">
					<Image
						fill
						alt={post.title}
						className="object-cover"
						src={post.coverImage}
					/>
				</div>
			)}

			{/* 文章内容 */}
			<main className="mb-12">
				<div
					dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
					className="prose prose-lg prose-gray-700 dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed max-w-none"
				/>
			</main>

			{/* 分类和标签 */}
			<div className="mb-16 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-8 text-sm text-gray-500">
				{post.category && (
					<span className="font-medium">{post.category.name}</span>
				)}
				{post.category && post.tags.length > 0 && <span>•</span>}
				{post.tags.map(({ tag }) => (
					<span
						key={tag.id}
						className="cursor-pointer text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					>
						#{tag.name}
					</span>
				))}
			</div>

			{/* 评论区 */}
			<section>
				<CommentSection comments={post.comments || []} postId={post.id} />
			</section>
		</article>
	);
}
