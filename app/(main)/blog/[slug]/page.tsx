import { PostStatus } from '@prisma/client';
import { notFound } from 'next/navigation';

import { BlogService } from '@/services/blog';

import BlogPostDetail from './_components/blog-post-detail';

interface BlogPostPageProps {
	params: {
		slug: string;
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	// 解码URL中的中文字符
	const decodedSlug = decodeURIComponent(slug);
	const post = await BlogService.getPostBySlug(decodedSlug);

	// 如果文章不存在或未发布，返回404
	if (!post || post.status !== PostStatus.PUBLISHED) {
		notFound();
	}

	// 增加浏览次数
	await BlogService.incrementViewCount(post.id);

	return (
		<div className="min-h-screen">
			<BlogPostDetail post={post} />
		</div>
	);
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
	const { posts } = await BlogService.getPosts({
		status: PostStatus.PUBLISHED,
		limit: 100 // 限制数量以避免构建时间过长
	});

	return posts.map((post) => ({
		slug: post.slug
	}));
}

// 生成元数据
export async function generateMetadata({ params }: BlogPostPageProps) {
	const { slug } = await params;
	// 解码URL中的中文字符
	const decodedSlug = decodeURIComponent(slug);
	const post = await BlogService.getPostBySlug(decodedSlug);

	if (!post) {
		return {
			title: '文章不存在'
		};
	}

	return {
		title: post.title,
		description: post.excerpt || post.title,
		openGraph: {
			title: post.title,
			description: post.excerpt || post.title,
			images: post.coverImage ? [post.coverImage] : []
		}
	};
}
