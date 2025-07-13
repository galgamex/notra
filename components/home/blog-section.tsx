import { PostStatus } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { BlogPostCard } from '@/components/blog/blog-post-card';
import { BlogService } from '@/services/blog';

export async function BlogSection() {
	// 获取最新的20篇已发布文章（5列4行）
	const { posts } = await BlogService.getPosts({
		page: 1,
		limit: 20,
		status: PostStatus.PUBLISHED
	});

	if (posts.length === 0) {
		return (
			<section className="bg-gray-50 py-16">
				<div className="container mx-auto px-4">
					<div className="text-center">
						<h2 className="mb-4 text-3xl font-bold text-gray-900">最新博客</h2>
						<p className="mb-8 text-gray-600">分享技术见解与生活感悟</p>
						<div className="py-12 text-center">
							<p className="text-lg text-gray-500">暂无文章，敬请期待...</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-gray-50 py-16">
			<div className="container mx-auto px-4">
				{/* 博客网格 - 五列四行 */}
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{posts.map((post) => (
						<BlogPostCard key={post.id} post={post} variant="compact" />
					))}
				</div>

				{/* 底部查看更多按钮 */}
				<div className="mt-12 text-center">
					<Link
						className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
						href="/blog"
					>
						<span>查看更多文章</span>
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
