'use client';

import {
	MoreHorizontal,
	Edit,
	Trash2,
	Globe,
	ChevronDown,
	ChevronRight,
	Plus
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import type { WebsiteCategoryWithDetails } from '@/types/website';

interface Category
	extends Omit<WebsiteCategoryWithDetails, 'createdAt' | 'updatedAt'> {
	createdAt: string;
	updatedAt: string;
}

export default function CategoriesList() {
	const [categoryTree, setCategoryTree] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);

	useEffect(() => {
		fetchCategoryTree();
	}, []);

	const fetchCategoryTree = async () => {
		try {
			const response = await fetch('/api/website/categories/tree');

			if (response.ok) {
				const data = await response.json();

				setCategoryTree(data || []);
				// 默认展开所有一级分类
				const parentIds =
					data
						?.filter((cat: Category) => cat.level === 0)
						.map((cat: Category) => cat.id) || [];

				setExpandedCategories(new Set(parentIds));
			}
		} catch (error) {
			console.error('Failed to fetch category tree:', error);
		} finally {
			setLoading(false);
		}
	};

	const toggleCategory = (categoryId: string) => {
		const newExpanded = new Set(expandedCategories);

		if (newExpanded.has(categoryId)) {
			newExpanded.delete(categoryId);
		} else {
			newExpanded.add(categoryId);
		}

		setExpandedCategories(newExpanded);
	};

	const handleDelete = async (categoryId: string) => {
		if (
			!confirm('确定要删除这个分类吗？删除后该分类下的网站将变为未分类状态。')
		) {
			return;
		}

		try {
			const response = await fetch(`/api/website/categories/${categoryId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// 刷新列表
				fetchCategoryTree();
			}
		} catch (error) {
			console.error('Failed to delete category:', error);
		}
	};

	const renderCategory = (
		category: Category,
		level: number = 0
	): React.ReactNode => {
		const hasChildren = category.children && category.children.length > 0;
		const isExpanded = expandedCategories.has(category.id);
		const paddingLeft = level * 24;

		return (
			<>
				<TableRow key={category.id}>
					<TableCell className="font-medium">
						<div
							className="flex items-center space-x-2"
							style={{ paddingLeft: `${paddingLeft}px` }}
						>
							{hasChildren && (
								<button
									className="flex-shrink-0 rounded p-1 hover:bg-gray-100"
									onClick={() => toggleCategory(category.id)}
								>
									{isExpanded ? (
										<ChevronDown className="h-4 w-4" />
									) : (
										<ChevronRight className="h-4 w-4" />
									)}
								</button>
							)}
							{!hasChildren && level > 0 && (
								<div className="h-4 w-6" /> // 占位符，保持对齐
							)}
							{category.icon && (
								<span className="text-lg">{category.icon}</span>
							)}
							<span>{category.name}</span>
							{category.color && (
								<div
									className="h-3 w-3 rounded-full"
									style={{ backgroundColor: category.color }}
								/>
							)}
							{level === 0 && <Badge variant="secondary">一级分类</Badge>}
							{level === 1 && <Badge variant="outline">二级分类</Badge>}
						</div>
					</TableCell>
					<TableCell>
						<Badge variant="outline">{category.slug}</Badge>
					</TableCell>
					<TableCell className="max-w-xs truncate">
						{category.description || '暂无描述'}
					</TableCell>
					<TableCell>
						<div className="flex items-center space-x-1">
							<Globe className="h-4 w-4 text-muted-foreground" />
							<span>{category._count?.websites || 0}</span>
						</div>
					</TableCell>
					<TableCell>
						{new Date(category.createdAt).toLocaleDateString('zh-CN')}
					</TableCell>
					<TableCell className="text-right">
						<div className="flex items-center justify-end gap-2">
							{level === 0 && (
								<Button asChild size="sm" variant="ghost">
									<Link
										href={`/admin/websites/categories/new?parentId=${category.id}`}
									>
										<Plus className="h-4 w-4" />
									</Link>
								</Button>
							)}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className="h-8 w-8 p-0" variant="ghost">
										<span className="sr-only">打开菜单</span>
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>操作</DropdownMenuLabel>
									<DropdownMenuItem asChild>
										<Link
											href={`/websites/category/${category.slug}`}
											target="_blank"
										>
											<Globe className="mr-2 h-4 w-4" />
											查看分类页面
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link
											href={`/admin/websites/categories/${category.id}/edit`}
										>
											<Edit className="mr-2 h-4 w-4" />
											编辑
										</Link>
									</DropdownMenuItem>
									{level === 0 && (
										<DropdownMenuItem asChild>
											<Link
												href={`/admin/websites/categories/new?parentId=${category.id}`}
											>
												<Plus className="mr-2 h-4 w-4" />
												添加子分类
											</Link>
										</DropdownMenuItem>
									)}
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-red-600"
										onClick={() => handleDelete(category.id)}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										删除
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</TableCell>
				</TableRow>
				{hasChildren &&
					isExpanded &&
					category.children!.map((child) => (
						<React.Fragment key={child.id}>
							{renderCategory(child as unknown as Category, level + 1)}
						</React.Fragment>
					))}
			</>
		);
	};

	if (loading) {
		return <div className="py-4 text-center">加载中...</div>;
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>分类名称</TableHead>
						<TableHead>标识符</TableHead>
						<TableHead>描述</TableHead>
						<TableHead>网站数量</TableHead>
						<TableHead>创建时间</TableHead>
						<TableHead className="text-right">操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categoryTree.map((category) => renderCategory(category))}
				</TableBody>
			</Table>
			{categoryTree.length === 0 && (
				<div className="py-8 text-center text-muted-foreground">
					暂无分类数据
				</div>
			)}
		</div>
	);
}
