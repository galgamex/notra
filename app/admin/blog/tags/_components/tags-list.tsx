'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

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
import { TagWithDetails } from '@/types/blog';

export default function TagsList() {
  const [tags, setTags] = useState<TagWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/blog/tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      } else {
        toast.error('获取标签列表失败');
      }
    } catch (error) {
      console.error('获取标签列表失败:', error);
      toast.error('获取标签列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/blog/tags/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('标签删除成功');
        setTags(tags.filter(tag => tag.id !== id));
      } else {
        const error = await response.json();
        toast.error(error.error || '删除标签失败');
      }
    } catch (error) {
      console.error('删除标签失败:', error);
      toast.error('删除标签失败');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-muted-foreground mb-4">还没有创建任何标签</p>
        <Button asChild variant="outline">
          <Link href="/admin/blog/tags/new">
            <Plus size={16} className="mr-2" />
            创建第一个标签
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tags.map((tag) => (
        <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{tag.name}</h3>
              {tag.color && (
                <div 
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: tag.color }}
                />
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              别名: <code className="bg-gray-100 px-1 rounded">{tag.slug}</code>
            </div>
            
            <Badge variant="secondary" className="text-xs">
              {tag._count.posts} 篇文章
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/blog/tags/${tag.id}/edit`}>
                <Edit size={12} className="mr-1" />
                编辑
              </Link>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={deletingId === tag.id}
                >
                  <Trash2 size={12} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除标签</AlertDialogTitle>
                  <AlertDialogDescription>
                    您确定要删除标签 "{tag.name}" 吗？此操作无法撤销。
                    {tag._count.posts > 0 && (
                      <span className="block mt-2 text-red-600">
                        注意：该标签下还有 {tag._count.posts} 篇文章，删除后这些文章将失去该标签。
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(tag.id)}
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