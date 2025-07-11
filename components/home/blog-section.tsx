import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogService } from '@/services/blog';
import { PostStatus } from '@prisma/client';
import { BlogPostCard } from '@/components/blog/blog-post-card';

export async function BlogSection() {
  // 获取最新的20篇已发布文章（5列4行）
  const { posts } = await BlogService.getPosts({
    page: 1,
    limit: 20,
    status: PostStatus.PUBLISHED,
  });

  if (posts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">最新博客</h2>
            <p className="text-gray-600 mb-8">分享技术见解与生活感悟</p>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">暂无文章，敬请期待...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
          

        {/* 博客网格 - 五列四行 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {posts.map((post) => (
            <BlogPostCard 
              key={post.id} 
              post={post} 
              variant="compact"
            />
          ))}
        </div>

        {/* 底部查看更多按钮 */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <span>查看更多文章</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
} 