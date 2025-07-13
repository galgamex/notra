'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription
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
	WebsiteTagWithDetails
} from '@/types/website';

const submitSchema = z.object({
	name: z
		.string()
		.min(1, '网站名称不能为空')
		.max(100, '网站名称不能超过100个字符'),
	url: z.string().url('请输入有效的网站链接'),
	description: z.string().max(500, '网站描述不能超过500个字符').optional(),
	categoryId: z.string().min(1, '请选择网站分类'),
	tagIds: z.array(z.string()).optional(),
	submitterName: z.string().max(50, '姓名不能超过50个字符').optional(),
	submitterEmail: z.string().email('请输入有效的邮箱地址').optional()
});

type SubmitFormValues = z.infer<typeof submitSchema>;

export function WebsiteSubmitForm() {
	const router = useRouter();
	const [categories, setCategories] = useState<WebsiteCategoryWithDetails[]>(
		[]
	);
	const [tags, setTags] = useState<WebsiteTagWithDetails[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const form = useForm<SubmitFormValues>({
		resolver: zodResolver(submitSchema),
		defaultValues: {
			name: '',
			url: '',
			description: '',
			categoryId: '',
			tagIds: [],
			submitterName: '',
			submitterEmail: ''
		}
	});

	// 获取分类列表
	const fetchCategories = async () => {
		try {
			const response = await fetch(
				'/api/website/categories?isVisible=true&limit=100'
			);

			if (response.ok) {
				const data = await response.json();

				setCategories(data.categories || []);
			}
		} catch (error) {
			console.error('获取分类列表失败:', error);
		}
	};

	// 获取标签列表
	const fetchTags = async () => {
		try {
			const response = await fetch('/api/website/tags?limit=100');

			if (response.ok) {
				const data = await response.json();

				setTags(data.tags || []);
			}
		} catch (error) {
			console.error('获取标签列表失败:', error);
		}
	};

	useEffect(() => {
		fetchCategories();
		fetchTags();
	}, []);

	const onSubmit = async (data: SubmitFormValues) => {
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/website/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (response.ok) {
				setIsSubmitted(true);
				toast.success('网站提交成功！感谢您的分享，我们会尽快审核。');

				// 3秒后跳转回网站导航页面
				setTimeout(() => {
					router.push('/websites');
				}, 3000);
			} else {
				const error = await response.json();

				toast.error(error.error || '提交失败，请稍后重试');
			}
		} catch (error) {
			console.error('提交网站失败:', error);
			toast.error('提交失败，请检查网络连接后重试');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="py-12 text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<Check className="h-8 w-8 text-green-600" />
				</div>
				<h3 className="mb-2 text-xl font-semibold text-gray-900">提交成功！</h3>
				<p className="mb-4 text-gray-600">
					感谢您的分享，我们会尽快审核您提交的网站。
				</p>
				<p className="text-sm text-gray-500">3秒后自动跳转到网站导航页面...</p>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				{/* 网站名称 */}
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

				{/* 网站链接 */}
				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>网站链接 *</FormLabel>
							<FormControl>
								<Input placeholder="https://example.com" {...field} />
							</FormControl>
							<FormDescription>
								请输入完整的网站链接，包含 http:// 或 https://
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 网站描述 */}
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>网站描述</FormLabel>
							<FormControl>
								<Textarea
									className="min-h-[100px]"
									placeholder="请简要描述网站的功能和特色（可选）"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								简要介绍网站的主要功能、特色或用途
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 网站分类 */}
				<FormField
					control={form.control}
					name="categoryId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>网站分类 *</FormLabel>
							<Select defaultValue={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="请选择网站分类" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											<div className="flex items-center gap-2">
												{category.icon && (
													<span
														className="flex h-4 w-4 items-center justify-center rounded text-xs text-white"
														style={{
															backgroundColor: category.color || '#6b7280'
														}}
													>
														{category.icon}
													</span>
												)}
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

				{/* 网站标签 */}
				<FormField
					control={form.control}
					name="tagIds"
					render={({ field }) => (
						<FormItem>
							<FormLabel>网站标签</FormLabel>
							<FormDescription>
								选择适合的标签来描述网站特性（可选，最多选择5个）
							</FormDescription>
							<div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
								{tags.slice(0, 15).map((tag) => {
									const isSelected = field.value?.includes(tag.id) || false;

									return (
										<label
											key={tag.id}
											className={`
                        flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-colors
                        ${isSelected
													? 'border-blue-300 bg-blue-50 text-blue-700'
													: 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-card dark:hover:bg-gray-700'
												}
                      `}
										>
											<input
												checked={isSelected}
												className="sr-only"
												type="checkbox"
												onChange={(e) => {
													const currentValue = field.value || [];

													if (e.target.checked) {
														if (currentValue.length < 5) {
															field.onChange([...currentValue, tag.id]);
														} else {
															toast.error('最多只能选择5个标签');
														}
													} else {
														field.onChange(
															currentValue.filter((id) => id !== tag.id)
														);
													}
												}}
											/>
											<span className="text-sm">{tag.name}</span>
										</label>
									);
								})}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* 联系信息 */}
				<div className="border-t pt-6">
					<h3 className="mb-4 font-medium text-gray-900">联系信息（可选）</h3>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="submitterName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>您的姓名</FormLabel>
									<FormControl>
										<Input placeholder="请输入您的姓名" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="submitterEmail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>您的邮箱</FormLabel>
									<FormControl>
										<Input placeholder="请输入您的邮箱" {...field} />
									</FormControl>
									<FormDescription>用于接收审核结果通知</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* 提交按钮 */}
				<div className="flex gap-4 pt-6">
					<Button
						className="flex-1"
						disabled={isSubmitting}
						type="button"
						variant="outline"
						onClick={() => router.back()}
					>
						取消
					</Button>
					<Button className="flex-1" disabled={isSubmitting} type="submit">
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								提交中...
							</>
						) : (
							'提交网站'
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
