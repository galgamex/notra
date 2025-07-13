'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
		setFormData((prev) => ({
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
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const error = await response.json();

				throw new Error(error.error || '创建标签失败');
			}

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
		<form className="max-w-2xl" onSubmit={handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>标签信息</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name">标签名称 *</Label>
						<Input
							required
							id="name"
							placeholder="请输入标签名称"
							value={formData.name}
							onChange={(e) => handleNameChange(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="slug">标签别名 *</Label>
						<Input
							required
							id="slug"
							placeholder="标签别名（用于URL）"
							value={formData.slug}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, slug: e.target.value }))
							}
						/>
						<p className="text-sm text-muted-foreground">
							标签别名将用于URL中，建议使用英文字母、数字和连字符
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="color">标签颜色</Label>
						<div className="flex items-center gap-3">
							<Input
								className="h-10 w-16 rounded border p-1"
								id="color"
								type="color"
								value={formData.color || '#10b981'}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, color: e.target.value }))
								}
							/>
							<Input
								className="flex-1"
								placeholder="#10b981"
								value={formData.color || '#10b981'}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, color: e.target.value }))
								}
							/>
						</div>
						<p className="text-sm text-muted-foreground">
							选择一个颜色来标识这个标签
						</p>
					</div>

					<div className="flex gap-3 pt-4">
						<Button disabled={isLoading} type="submit">
							{isLoading ? '创建中...' : '创建标签'}
						</Button>
						<Button
							disabled={isLoading}
							type="button"
							variant="outline"
							onClick={() => router.push('/admin/blog/tags')}
						>
							取消
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
