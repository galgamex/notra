'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Eye, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PostWithDetails } from '@/types/blog';

interface RelatedPostsProps {
  currentPost: PostWithDetails;
}

interface RelatedPostCardProps {
  post: PostWithDetails;
}

function RelatedPostCard({ post }: RelatedPostCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blog/${post.slug}`}>
        <div className="cursor-pointer">
          {/* 图片 */}
          <div className="relative h-48 bg-gray-200 overflow-hidden rounded-t-lg">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">暂无图片</span>
              </div>
            )}
            
            {/* 分类标签 */}
            {post.category && (
              <div className="absolute top-2 left-2">
                <Badge 
                  className="text-white text-xs"
                  style={{ backgroundColor: post.category.color || '#3B82F6' }}
                >
                  {post.category.name}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            {/* 标题 */}
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
              {post.title}
            </h3>

            {/* 摘要 */}
            {post.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {post.excerpt}
              </p>
            )}

            {/* 标签 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 2).map(({ tag }) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs"
                    style={{ 
                      borderColor: tag.color || undefined, 
                      color: tag.color || undefined 
                    }}
                  >
                    #{tag.name}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* 底部信息 */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: zhCN })}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.viewCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3" />
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
          status: 'PUBLISHED',
        });

        // 如果有分类，优先获取同分类的文章
        if (currentPost.categoryId) {
          params.append('categoryId', currentPost.categoryId);
        }

        const response = await fetch(`/api/blog/posts?${params}`);
        
        if (response.ok) {
          const data = await response.json();
          // 过滤掉当前文章
          const filtered = data.posts.filter((post: PostWithDetails) => post.id !== currentPost.id);
          
          // 如果同分类的文章不够，再获取一些其他文章
          if (filtered.length < 3) {
            const additionalParams = new URLSearchParams({
              limit: '6',
              status: 'PUBLISHED',
            });
            
            const additionalResponse = await fetch(`/api/blog/posts?${additionalParams}`);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
            <Button variant="ghost" size="sm">
              查看更多
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <RelatedPostCard key={post.id} post={post} />
          ))})
        </div>
      </CardContent>
    </Card>
  );
}