'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, ExternalLink, Eye, EyeOff, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type {
	WebsiteCategoryWithDetails,
	WebsiteTagWithDetails,
	CreateWebsiteFormValues
} from '@/types/website';

const websiteFormSchema = z.object({
	name: z
		.string()
		.min(1, '网站名称不能为空')
		.max(100, '网站名称不能超过100个字符'),
	url: z.string().url('请输入有效的网站链接'),
	description: z.string().optional(),
	logo: z.string().optional(),
	favicon: z.string().optional(),
	screenshot: z.string().optional(),
	categoryId: z.string().min(1, '请选择网站分类'),
	tagIds: z.array(z.string()),
	isRecommend: z.boolean().optional(),
	isFeatured: z.boolean().optional(),
	isNSFW: z.boolean().optional(),
	sortOrder: z.number().optional()
});

export default function WebsiteForm() {
	const router = useRouter();
	const [categories, setCategories] = useState<WebsiteCategoryWithDetails[]>(
		[]
	);
	const [tags, setTags] = useState<WebsiteTagWithDetails[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAutoFetching, setIsAutoFetching] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [previewImages, setPreviewImages] = useState({
		logo: '',
		favicon: '',
		screenshot: ''
	});

	const form = useForm<CreateWebsiteFormValues>({
		resolver: zodResolver(websiteFormSchema),
		defaultValues: {
			name: '',
			url: '',
			description: '',
			logo: '',
			favicon: '',
			screenshot: '',
			categoryId: '',
			tagIds: [],
			isRecommend: false,
			isFeatured: false,
			isNSFW: false,
			sortOrder: 0
		}
	});

	useEffect(() => {
		fetchCategories();
		fetchTags();
	}, []);

	const fetchCategories = async () => {
		try {
			const response = await fetch('/api/website/categories?limit=100');

			if (response.ok) {
				const data = await response.json();

				setCategories(data.categories || []);
			}
		} catch (error) {
			console.error('Failed to fetch categories:', error);
			toast.error('获取分类列表失败');
		}
	};

	const fetchTags = async () => {
		try {
			const response = await fetch('/api/website/tags?limit=100');

			if (response.ok) {
				const data = await response.json();

				setTags(data.tags || []);
			}
		} catch (error) {
			console.error('Failed to fetch tags:', error);
			toast.error('获取标签列表失败');
		}
	};

	const handleTagToggle = (tagId: string) => {
		const newSelectedTags = selectedTags.includes(tagId)
			? selectedTags.filter((id) => id !== tagId)
			: [...selectedTags, tagId];

		setSelectedTags(newSelectedTags);
		form.setValue('tagIds', newSelectedTags);
	};

	const removeTag = (tagId: string) => {
		const newSelectedTags = selectedTags.filter((id) => id !== tagId);

		setSelectedTags(newSelectedTags);
		form.setValue('tagIds', newSelectedTags);
	};

	// 自动获取网站信息
	const autoFetchWebsiteInfo = async (url: string) => {
		if (!url || !url.startsWith('http')) {
			return;
		}

		setIsAutoFetching(true);

		try {
			const response = await fetch('/api/website/fetch-info', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ url })
			});

			if (response.ok) {
				const data = await response.json();

				// 自动填充表单字段
				if (data.title && !form.getValues('name')) {
					form.setValue('name', data.title);
				}

				if (data.description && !form.getValues('description')) {
					form.setValue('description', data.description);
				}

				if (data.favicon && !form.getValues('favicon')) {
					form.setValue('favicon', data.favicon);
					setPreviewImages(prev => ({ ...prev, favicon: data.favicon }));
				}

				if (data.logo && !form.getValues('logo')) {
					form.setValue('logo', data.logo);
					setPreviewImages(prev => ({ ...prev, logo: data.logo }));
				}

				toast.success('网站信息获取成功');
			} else {
				toast.error('获取网站信息失败');
			}
		} catch (error) {
			console.error('Failed to fetch website info:', error);
			toast.error('获取网站信息失败');
		} finally {
			setIsAutoFetching(false);
		}
	};

	// 更新图片预览
	const updateImagePreview = (field: 'logo' | 'favicon' | 'screenshot', url: string) => {

		setPreviewImages(prev => ({ ...prev, [field]: url }));
	};

	const onSubmit = async (values: CreateWebsiteFormValues) => {
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/website', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...values,
					tagIds: selectedTags
				})
			});

			if (response.ok) {
				toast.success('网站添加成功');
				router.push('/admin/websites');
			} else {
				const error = await response.json();

				toast.error(error.error || '添加网站失败');
			}
		} catch (error) {

			console.error('Failed to create website:', error);
			toast.error('添加网站失败');
		} finally {

			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>网站名称 *</FormLabel>
								<FormControl>
									<Input placeholder="请输入网站名称" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="url"
						render={({ field }) => (
							<FormItem>
								<FormLabel>网站链接 *</FormLabel>
								<div className="flex space-x-2">
									<FormControl>
										<Input
											placeholder="https://example.com"
											{...field}
											onBlur={(e) => {
												field.onBlur();

												if (e.target.value && e.target.value.startsWith('http')) {
													autoFetchWebsiteInfo(e.target.value);
												}
											}}
										/>
									</FormControl>
									<Button
										disabled={!field.value || isAutoFetching}
										size="icon"
										title="自动获取网站信息"
										type="button"
										variant="outline"
										onClick={() => autoFetchWebsiteInfo(field.value)}
									>
										{isAutoFetching ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Globe className="h-4 w-4" />
										)}
									</Button>
									{field.value && field.value.startsWith('http') && (
										<Button
											size="icon"
											title="预览网站"
											type="button"
											variant="outline"
											onClick={() => window.open(field.value, '_blank')}
										>
											<ExternalLink className="h-4 w-4" />
										</Button>
									)}
								</div>
								<FormDescription>
									输入完整的网站URL，系统将自动获取网站信息
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>网站描述</FormLabel>
							<FormControl>
								<Textarea
									className="min-h-[100px]"
									placeholder="请输入网站描述"
									{...field}
								/>
							</FormControl>
							<FormDescription>简要描述网站的功能和特色</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<FormLabel className="text-base font-semibold">图片资源</FormLabel>
						<Button
							size="sm"
							type="button"
							variant="outline"
							onClick={() => setShowPreview(!showPreview)}
						>
							{showPreview ? (
								<><EyeOff className="mr-2 h-4 w-4" />隐藏预览</>
							) : (
								<><Eye className="mr-2 h-4 w-4" />显示预览</>
							)}
						</Button>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						<FormField
							control={form.control}
							name="logo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Logo链接</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com/logo.png"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												updateImagePreview('logo', e.target.value);
											}}
										/>
									</FormControl>
									<FormDescription>网站Logo图片链接</FormDescription>
									{showPreview && previewImages.logo && (
										<Card className="mt-2">
											<CardContent className="p-3">
												<img
													alt="Logo预览"
													className="h-16 max-w-full object-contain"
													src={previewImages.logo}
													onError={() => updateImagePreview('logo', '')}
												/>
											</CardContent>
										</Card>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="favicon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Favicon链接</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com/favicon.ico"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												updateImagePreview('favicon', e.target.value);
											}}
										/>
									</FormControl>
									<FormDescription>网站图标链接</FormDescription>
									{showPreview && previewImages.favicon && (
										<Card className="mt-2">
											<CardContent className="p-3">
												<img
													alt="Favicon预览"
													className="h-8 w-8 object-contain"
													src={previewImages.favicon}
													onError={() => updateImagePreview('favicon', '')}
												/>
											</CardContent>
										</Card>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="screenshot"
							render={({ field }) => (
								<FormItem>
									<FormLabel>截图链接</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com/screenshot.png"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												updateImagePreview('screenshot', e.target.value);
											}}
										/>
									</FormControl>
									<FormDescription>网站截图链接</FormDescription>
									{showPreview && previewImages.screenshot && (
										<Card className="mt-2">
											<CardContent className="p-3">
												<img
													alt="截图预览"
													className="h-32 max-w-full object-contain"
													src={previewImages.screenshot}
													onError={() => updateImagePreview('screenshot', '')}
												/>
											</CardContent>
										</Card>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="categoryId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>网站分类 *</FormLabel>
								<Select
									defaultValue={field.value}
									onValueChange={field.onChange}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="请选择网站分类" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category.id} value={category.id}>
												<div className="flex items-center space-x-2">
													{category.icon && <span>{category.icon}</span>}
													<span>{category.name}</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="sortOrder"
						render={({ field }) => (
							<FormItem>
								<FormLabel>排序权重</FormLabel>
								<FormControl>
									<Input
										placeholder="0"
										type="number"
										{...field}
										onChange={(e) =>
											field.onChange(parseInt(e.target.value) || 0)
										}
									/>
								</FormControl>
								<FormDescription>数值越大排序越靠前</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="space-y-4">
					<FormLabel>网站标签</FormLabel>
					<div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
						{tags.map((tag) => (
							<div key={tag.id} className="flex items-center space-x-2">
								<Checkbox
									checked={selectedTags.includes(tag.id)}
									id={tag.id}
									onCheckedChange={() => handleTagToggle(tag.id)}
								/>
								<label
									className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor={tag.id}
								>
									{tag.name}
								</label>
							</div>
						))}
					</div>

					{selectedTags.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">已选择的标签：</p>
							<div className="flex flex-wrap gap-2">
								{selectedTags.map((tagId) => {
									const tag = tags.find((t) => t.id === tagId);

									return tag ? (
										<Badge
											key={tagId}
											className="flex items-center space-x-1"
											variant="secondary"
										>
											<span>{tag.name}</span>
											<button
												className="ml-1 rounded-full p-0.5 hover:bg-muted"
												type="button"
												onClick={() => removeTag(tagId)}
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									) : null;
								})}
							</div>
						</div>
					)}
				</div>

				<div className="space-y-4">
					<FormLabel>特殊标记</FormLabel>
					<div className="space-y-3">
						<FormField
							control={form.control}
							name="isRecommend"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-y-0 space-x-3">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>推荐网站</FormLabel>
										<FormDescription>
											标记为推荐网站，会在首页推荐区域显示
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isFeatured"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-y-0 space-x-3">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>精选网站</FormLabel>
										<FormDescription>
											标记为精选网站，会获得更高的展示优先级
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isNSFW"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-y-0 space-x-3">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel className="text-amber-600">NSFW内容</FormLabel>
										<FormDescription>
											标记为NSFW（Not Safe For Work）内容，仅对启用此选项的用户显示
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="flex justify-end space-x-4">
					<Button
						disabled={isSubmitting}
						type="button"
						variant="outline"
						onClick={() => router.back()}
					>
						取消
					</Button>
					<Button disabled={isSubmitting} type="submit">
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						添加网站
					</Button>
				</div>
			</form>
		</Form>
	);
}
