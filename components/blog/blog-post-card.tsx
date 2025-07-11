import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Eye, MessageCircle, Calendar, User } from 'lucide-react';
import type { PostWithDetails } from '@/types/blog';

interface BlogPostCardProps {
  post: PostWithDetails;
  variant?: 'default' | 'compact';
}

export function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${isCompact ? 'h-64' : 'h-80'}`}>
      <Link href={`/blog/${post.slug}`}>
        <div className="relative group">
          {/* 特色图片 */}
          <div className={`relative ${isCompact ? 'h-32' : 'h-48'} bg-gray-200 overflow-hidden`}>
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">暂无图片</span>
              </div>
            )}
            
            {/* 分类标签 */}
            {post.category && (
              <div className="absolute top-2 left-2">
                <span 
                  className="px-2 py-1 text-xs font-medium text-white rounded"
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
            <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 ${isCompact ? 'text-sm mb-1' : 'text-lg mb-2'}`}>
              {post.title}
            </h3>

            {/* 摘要 */}
            {!isCompact && post.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {post.excerpt}
              </p>
            )}

            {/* 标签 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.slice(0, isCompact ? 2 : 3).map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                    style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined, color: tag.color || undefined }}
                  >
                    #{tag.name}
                  </span>
                ))}
                {post.tags.length > (isCompact ? 2 : 3) && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{post.tags.length - (isCompact ? 2 : 3)}
                  </span>
                )}
              </div>
            )}

            {/* 底部信息 */}
            <div className={`flex items-center justify-between text-xs text-gray-500 ${isCompact ? 'mt-auto' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{post.author.name || post.author.username}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: zhCN })}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
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
          </div>
        </div>
      </Link>
    </div>
  );
}