'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateTagFormValues } from '@/types/blog';

export default function TagForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTagFormValues>({
    name: '',
    slug: '',
    color: '#10b981'
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('请输入标签名称');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('请输入标签别名');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/blog/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '创建标签失败');
      }

      const tag = await response.json();
      toast.success('标签创建成功！');
      router.push('/admin/blog/tags');
    } catch (error) {
      console.error('创建标签失败:', error);
      toast.error(error instanceof Error ? error.message : '创建标签失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>标签信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">标签名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="请输入标签名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">标签别名 *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="标签别名（用于URL）"
              required
            />
            <p className="text-sm text-muted-foreground">
              标签别名将用于URL中，建议使用英文字母、数字和连字符
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">标签颜色</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                value={formData.color || '#10b981'}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={formData.color || '#10b981'}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="#10b981"
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              选择一个颜色来标识这个标签
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '创建中...' : '创建标签'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/admin/blog/tags')}
              disabled={isLoading}
            >
              取消
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}