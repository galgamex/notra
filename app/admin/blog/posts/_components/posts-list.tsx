'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PostWithDetails } from '@/types/blog';
import { PostStatus } from '@prisma/client';

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
        method: 'DELETE',
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
        return <Badge variant="default" className="bg-green-100 text-green-800">已发布</Badge>;
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
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Edit className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无文章</h3>
        <p className="text-gray-500 mb-6">开始创建您的第一篇文章吧</p>
        <Button asChild>
          <Link href="/admin/blog/posts/new">
            <Plus className="w-4 h-4 mr-2" />
            创建文章
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 hover:text-blue-600 truncate">
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
                variant="outline" 
                className="text-xs"
                style={{ 
                  borderColor: post.category.color || '#e5e7eb',
                  color: post.category.color || '#6b7280'
                }}
              >
                {post.category.name}
              </Badge>
            )}
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
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
                  })
              }
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1">
                {post.tags.slice(0, 2).map((postTag) => (
                  <Badge 
                    key={postTag.tag.id} 
                    variant="secondary" 
                    className="text-xs"
                    style={{
                      backgroundColor: postTag.tag.color ? `${postTag.tag.color}20` : undefined,
                      color: postTag.tag.color || undefined,
                      borderColor: postTag.tag.color || undefined
                    }}
                  >
                    {postTag.tag.name}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">+{post.tags.length - 2}</Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/blog/posts/${post.id}/edit`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={deletingId === post.id}
                >
                  <Trash2 className="w-4 h-4" />
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
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-600 hover:bg-red-700"
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