'use client';

import { PostStatus } from '@prisma/client';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CreatePostFormValues,
  CategoryWithDetails,
  TagWithDetails,
  PostWithDetails
} from '@/types/blog';

import Editor from './editor';

interface PostFormProps {
	mode: 'create' | 'edit';
	postId?: string;
}

export default function PostForm({ mode, postId }: PostFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isDataLoading, setIsDataLoading] = useState(true);
	const [categories, setCategories] = useState<CategoryWithDetails[]>([]);
	const [tags, setTags] = useState<TagWithDetails[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState<string>('');
	const [formData, setFormData] = useState<CreatePostFormValues>({
		title: '',
		slug: '',
		content: '',
		excerpt: '',
		coverImage: '',
		status: PostStatus.DRAFT,
		categoryId: '',
		tagIds: []
	});

	// 加载数据
	useEffect(() => {
		const loadData = async () => {
			try {
				const promises = [
					fetch('/api/blog/categories').then((res) =>
						res.ok ? res.json() : []
					),
					fetch('/api/blog/tags').then((res) => (res.ok ? res.json() : []))
				];

				// 如果是编辑模式，加载文章数据
				if (mode === 'edit' && postId) {
					promises.push(
						fetch(`/api/blog/posts/${postId}`).then((res) =>
							res.ok ? res.json() : null
						)
					);
				}

				const results = await Promise.all(promises);
				const [categoriesData, tagsData, postData] = results;

				setCategories(categoriesData);
				setTags(tagsData);

				// 如果是编辑模式，填充表单数据
				if (mode === 'edit' && postData) {
					const post = postData as PostWithDetails;

					setFormData({
						title: post.title,
						slug: post.slug,
						content: post.content,
						excerpt: post.excerpt || '',
						coverImage: post.coverImage || '',
						status: post.status,
						categoryId: post.categoryId || '',
						tagIds: post.tags.map((pt) => pt.tag.id)
					});
					setSelectedTags(post.tags.map((pt) => pt.tag.id));
				}
			} catch (error) {
				console.error('加载数据失败:', error);
				toast.error('加载数据失败');
			} finally {
				setIsDataLoading(false);
			}
		};

		loadData();
	}, [mode, postId]);

	// 自动生成slug
	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
			.replace(/^-+|-+$/g, '');
	};

	const handleTitleChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			title: value,
			// 只在新建模式下自动生成slug
			...(mode === 'create' && { slug: generateSlug(value) })
		}));
	};

	const handleContentChange = (content: string) => {
		setFormData((prev) => ({ ...prev, content }));
	};

	// 标签操作

	const removeTag = (tagToRemove: string) => {
		setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
	};

	const getTagName = (tagId: string) => {
		const tag = tags.find((t) => t.id === tagId);

		return tag?.name || tagId;
	};

	// 处理标签输入
	const handleTagInput = async (value: string) => {
		setTagInput(value);

		// 检查是否包含逗号，如果有则处理标签
		if (value.includes(',')) {
			const tagNames = value
				.split(',')
				.map((name) => name.trim())
				.filter((name) => name.length > 0);
			const lastTag = tagNames.pop(); // 保留最后一个未完成的标签

			for (const tagName of tagNames) {
				await processTag(tagName);
			}

			setTagInput(lastTag || '');
		}
	};

	// 处理单个标签（查找或创建）
	const processTag = async (tagName: string) => {
		// 检查是否已存在该标签
		const existingTag = tags.find(
			(tag) => tag.name.toLowerCase() === tagName.toLowerCase()
		);

		if (existingTag) {
			// 如果标签存在且未选中，则添加到选中列表
			if (!selectedTags.includes(existingTag.id)) {
				setSelectedTags((prev) => [...prev, existingTag.id]);
			}
		} else {
			// 如果标签不存在，创建新标签
			try {
				const response = await fetch('/api/blog/tags', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: tagName,
						slug: generateSlug(tagName),
						color: '#10b981'
					})
				});

				if (response.ok) {
					const newTag = await response.json();

					setTags((prev) => [...prev, newTag]);
					setSelectedTags((prev) => [...prev, newTag.id]);
					toast.success(`标签 "${tagName}" 创建成功`);
				} else {
					toast.error(`创建标签 "${tagName}" 失败`);
				}
			} catch (error) {
				console.error('创建标签失败:', error);
				toast.error(`创建标签 "${tagName}" 失败`);
			}
		}
	};

	// 处理回车键
	const handleTagKeyDown = async (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && tagInput.trim()) {
			e.preventDefault();
			await processTag(tagInput.trim());
			setTagInput('');
		}
	};

	const handleSubmit = async (status: PostStatus) => {
		if (!formData.title.trim()) {
			toast.error('请输入文章标题');

			return;
		}

		if (!formData.content.trim()) {
			toast.error('请输入文章内容');

			return;
		}

		setIsLoading(true);

		try {
			const submitData = {
				...formData,
				status,
				tagIds: selectedTags
			};

			let response;

			if (mode === 'create') {
				response = await fetch('/api/blog/posts', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(submitData)
				});
			} else {
				response = await fetch(`/api/blog/posts/${postId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ id: postId, ...submitData })
				});
			}

			if (!response.ok) {
				const error = await response.json();

				throw new Error(
					error.error || `${mode === 'create' ? '创建' : '更新'}文章失败`
				);
			}

			toast.success(
				status === PostStatus.PUBLISHED
					? `文章${mode === 'create' ? '发布' : '更新'}成功`
					: `文章${mode === 'create' ? '保存' : '更新'}成功`
			);
			router.push('/admin/blog/posts');
		} catch (error) {
			console.error(
				`Error ${mode === 'create' ? 'creating' : 'updating'} post:`,
				error
			);
			toast.error(error instanceof Error ? error.message : '操作失败，请重试');
		} finally {
			setIsLoading(false);
		}
	};

	if (isDataLoading) {
		return (
			<div className="space-y-6">
				<div className="py-8 text-center">
					<div className="text-lg">加载中...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* 文章基本信息 */}
			<Card>
				<CardHeader>
					<CardTitle>基本信息</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">文章标题 *</Label>
						<Input
							id="title"
							placeholder="请输入文章标题"
							value={formData.title}
							onChange={(e) => handleTitleChange(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="slug">URL别名</Label>
						<Input
							id="slug"
							placeholder="自动生成或手动输入"
							value={formData.slug}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, slug: e.target.value }))
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="excerpt">文章摘要</Label>
						<Textarea
							id="excerpt"
							placeholder="请输入文章摘要（可选）"
							rows={3}
							value={formData.excerpt}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* 文章内容 */}
			<Card>
				<CardHeader>
					<CardTitle>文章内容</CardTitle>
				</CardHeader>
				<CardContent>
					<Editor
						initialContent={formData.content}
						onContentChange={handleContentChange}
					/>
				</CardContent>
			</Card>

			{/* 文章设置 */}
			<Card>
				<CardHeader>
					<CardTitle>文章设置</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="category">分类</Label>
							<Select
								value={formData.categoryId}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, categoryId: value }))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="选择分类" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="tags">标签</Label>
							<Input
								id="tags"
								placeholder="输入标签名称，用逗号分隔，按回车添加"
								value={tagInput}
								onChange={(e) => handleTagInput(e.target.value)}
								onKeyDown={handleTagKeyDown}
							/>
							<p className="text-xs text-muted-foreground">
								提示：输入标签名称后按回车或用逗号分隔，不存在的标签将自动创建
							</p>
							<div className="mt-2 flex flex-wrap gap-2">
								{selectedTags.map((tagId) => (
									<Badge
										key={tagId}
										className="flex items-center gap-1"
										variant="secondary"
									>
										{getTagName(tagId)}
										<X
											className="h-3 w-3 cursor-pointer"
											onClick={() => removeTag(tagId)}
										/>
									</Badge>
								))}
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="coverImage">封面图片</Label>
						<Input
							id="coverImage"
							placeholder="请输入图片URL"
							type="url"
							value={formData.coverImage}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
							}
						/>
						{/* TODO: 添加图片上传功能 */}
					</div>
				</CardContent>
			</Card>

			{/* 操作按钮 */}
			<div className="flex justify-end space-x-4">
				<Button
					disabled={isLoading}
					variant="outline"
					onClick={() => router.back()}
				>
					取消
				</Button>
				<Button
					disabled={isLoading}
					variant="outline"
					onClick={() => handleSubmit(PostStatus.DRAFT)}
				>
					保存草稿
				</Button>
				<Button
					disabled={isLoading}
					onClick={() => handleSubmit(PostStatus.PUBLISHED)}
				>
					{mode === 'create' ? '发布文章' : '更新文章'}
				</Button>
			</div>
		</div>
	);
}
