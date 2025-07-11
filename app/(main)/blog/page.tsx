import { BlogService } from '@/services/blog';
import { PostStatus } from '@prisma/client';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import BlogSearch from './_components/blog-search';

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const awaitedSearchParams = await searchParams;
  const page = parseInt(awaitedSearchParams.page || '1');
  const limit = 12;

  const { posts, total, totalPages } = await BlogService.getPosts({
    page,
    limit,
    status: PostStatus.PUBLISHED,
    categoryId: awaitedSearchParams.category,
    tagId: awaitedSearchParams.tag,
    search: awaitedSearchParams.search,
  });

  // 获取分类和标签用于筛选
  const categories = await BlogService.getCategories();
  const tags = await BlogService.getTags();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 py-8">
        

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 分类筛选 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">分类</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link 
                      href="/blog" 
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        !awaitedSearchParams.category 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      全部分类
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog?category=${category.id}`}
                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                          awaitedSearchParams.category === category.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category._count.posts}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 标签筛选 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">标签</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 20).map((tag) => (
                      <Link key={tag.id} href={`/blog?tag=${tag.id}`}>
                        <Badge
                          variant={awaitedSearchParams.tag === tag.id ? 'default' : 'outline'}
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          style={{
                            borderColor: tag.color || undefined,
                            color: awaitedSearchParams.tag === tag.id ? 'white' : (tag.color || undefined),
                            backgroundColor: awaitedSearchParams.tag === tag.id ? (tag.color || undefined) : undefined,
                          }}
                        >
                          #{tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {/* 搜索框 */}
            <BlogSearch />
            
            {/* 搜索结果提示 */}
            {(awaitedSearchParams.search || awaitedSearchParams.category || awaitedSearchParams.tag) && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {awaitedSearchParams.search && `搜索 "${awaitedSearchParams.search}" `}
                  {awaitedSearchParams.category && `分类筛选 `}
                  {awaitedSearchParams.tag && `标签筛选 `}
                  共找到 {total} 篇文章
                </p>
              </div>
            )}

            {/* 文章列表 */}
            {posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 text-lg">暂无文章</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} variant="compact" />
                  ))}
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    {page > 1 && (
                      <Link
                        href={`/blog?page=${page - 1}${awaitedSearchParams.category ? `&category=${awaitedSearchParams.category}` : ''}${awaitedSearchParams.tag ? `&tag=${awaitedSearchParams.tag}` : ''}${awaitedSearchParams.search ? `&search=${awaitedSearchParams.search}` : ''}`}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        上一页
                      </Link>
                    )}
                    
                    <span className="px-4 py-2 bg-blue-500 text-white rounded-md">
                      {page} / {totalPages}
                    </span>
                    
                    {page < totalPages && (
                      <Link
                        href={`/blog?page=${page + 1}${awaitedSearchParams.category ? `&category=${awaitedSearchParams.category}` : ''}${awaitedSearchParams.tag ? `&tag=${awaitedSearchParams.tag}` : ''}${awaitedSearchParams.search ? `&search=${awaitedSearchParams.search}` : ''}`}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        下一页
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 生成元数据
export async function generateMetadata({ searchParams }: BlogPageProps) {
  const awaitedSearchParams = await searchParams;
  let title = '博客文章';
  
  if (awaitedSearchParams.search) {
    title = `搜索: ${awaitedSearchParams.search} - 博客文章`;
  } else if (awaitedSearchParams.category) {
    // 这里可以根据分类ID获取分类名称
    title = '分类文章 - 博客';
  } else if (awaitedSearchParams.tag) {
    // 这里可以根据标签ID获取标签名称
    title = '标签文章 - 博客';
  }

  return {
    title,
    description: '浏览我们的博客文章，获取最新的技术见解和生活感悟',
  };
}