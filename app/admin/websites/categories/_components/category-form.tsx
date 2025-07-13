'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
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
import type { WebsiteCategoryWithDetails } from '@/types/website';

const formSchema = z.object({
	name: z.string().min(1, '分类名称不能为空'),
	slug: z
		.string()
		.min(1, '标识符不能为空')
		.regex(/^[a-z0-9-]+$/, '标识符只能包含小写字母、数字和连字符'),
	description: z.string().optional(),
	icon: z.string().optional(),
	color: z.string().optional(),
	parentId: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
	initialData?: WebsiteCategoryWithDetails;
	categoryId?: string;
}

export default function CategoryForm({
	initialData,
	categoryId
}: CategoryFormProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [parentCategories, setParentCategories] = useState<
		WebsiteCategoryWithDetails[]
	>([]);

	// 从URL参数获取父分类ID
	const parentIdFromUrl = searchParams.get('parentId');

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: initialData?.name || '',
			slug: initialData?.slug || '',
			description: initialData?.description || '',
			icon: initialData?.icon || '',
			color: initialData?.color || '#6b7280',
			parentId: initialData?.parentId || parentIdFromUrl || 'none'
		}
	});

	useEffect(() => {
		// 获取可作为父分类的分类列表（只获取一级分类）
		const fetchParentCategories = async () => {
			try {
				const response = await fetch(
					'/api/website/categories?level=0&limit=100'
				);

				if (response.ok) {
					const data = await response.json();
					// 如果是编辑模式，过滤掉当前分类
					const categories =
						data.categories?.filter(
							(cat: WebsiteCategoryWithDetails) => cat.id !== categoryId
						) || [];

					setParentCategories(categories);
				}
			} catch (error) {
				console.error('获取父分类列表失败:', error);
			}
		};

		fetchParentCategories();
	}, [categoryId]);

	// 根据名称自动生成slug
	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	};

	const onSubmit = async (values: FormValues) => {
		setLoading(true);

		try {
			const url = categoryId
				? `/api/website/categories/${categoryId}`
				: '/api/website/categories';

			const method = categoryId ? 'PUT' : 'POST';

			// 处理parentId值，将'none'转换为undefined
			const submitData = {
				...values,
				parentId: values.parentId === 'none' ? undefined : values.parentId
			};

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(submitData)
			});

			if (response.ok) {
				toast.success(categoryId ? '分类更新成功' : '分类创建成功');
				router.push('/admin/websites/categories');
				router.refresh();
			} else {
				const error = await response.json();

				toast.error(error.message || '操作失败');
			}
		} catch (error) {
			console.error('提交失败:', error);
			toast.error('操作失败');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>分类名称</FormLabel>
								<FormControl>
									<Input
										placeholder="输入分类名称"
										{...field}
										onChange={(e) => {
											field.onChange(e);

											// 自动生成slug
											if (!categoryId) {
												form.setValue('slug', generateSlug(e.target.value));
											}
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>标识符</FormLabel>
								<FormControl>
									<Input placeholder="category-slug" {...field} />
								</FormControl>
								<FormDescription>
									用于URL中的标识符，只能包含小写字母、数字和连字符
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="parentId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>父分类</FormLabel>
							<Select defaultValue={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="选择父分类（可选）" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="none">无父分类（一级分类）</SelectItem>
									{parentCategories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.icon && (
												<span className="mr-2">{category.icon}</span>
											)}
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								选择父分类后，此分类将成为二级分类
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>描述</FormLabel>
							<FormControl>
								<Textarea
									className="resize-none"
									placeholder="输入分类描述（可选）"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="icon"
						render={({ field }) => (
							<FormItem>
								<FormLabel>图标</FormLabel>
								<FormControl>
									<Input placeholder="🌐" {...field} />
								</FormControl>
								<FormDescription>可以使用emoji或图标字符</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="color"
						render={({ field }) => (
							<FormItem>
								<FormLabel>颜色</FormLabel>
								<FormControl>
									<div className="flex items-center gap-2">
										<Input className="h-10 w-16" type="color" {...field} />
										<Input placeholder="#6b7280" {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex items-center gap-4">
					<Button disabled={loading} type="submit">
						{loading ? '保存中...' : categoryId ? '更新分类' : '创建分类'}
					</Button>
					<Button type="button" variant="outline" onClick={() => router.back()}>
						取消
					</Button>
				</div>
			</form>
		</Form>
	);
}
