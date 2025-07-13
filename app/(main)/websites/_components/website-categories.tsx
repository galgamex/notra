'use client';

import { Folder, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import type { WebsiteCategoryWithDetails } from '@/types/website';

export function WebsiteCategories() {
	const [categoryTree, setCategoryTree] = useState<
		WebsiteCategoryWithDetails[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);

	useEffect(() => {
		const fetchCategoryTree = async () => {
			try {
				const response = await fetch('/api/website/categories/tree');

				if (response.ok) {
					const data = await response.json();

					setCategoryTree(data || []);
				}
			} catch (error) {
				console.error('获取分类树失败:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategoryTree();
	}, []);

	const toggleCategory = (categoryId: string) => {
		const newExpanded = new Set(expandedCategories);

		if (newExpanded.has(categoryId)) {
			newExpanded.delete(categoryId);
		} else {
			newExpanded.add(categoryId);
		}

		setExpandedCategories(newExpanded);
	};

	const renderCategory = (
		category: WebsiteCategoryWithDetails,
		level: number = 0
	) => {
		const hasChildren = category.children && category.children.length > 0;
		const isExpanded = expandedCategories.has(category.id);

		return (
			<div key={category.id} className="mb-2">
				<div
					className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
					style={{ marginLeft: `${level * 20}px` }}
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

					<Link
						className="group flex flex-1 items-center gap-3"
						href={`/websites/category/${category.slug}`}
					>
						{category.icon ? (
							<div
								className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm text-white"
								style={{ backgroundColor: category.color || '#6b7280' }}
							>
								<span>{category.icon}</span>
							</div>
						) : (
							<div
								className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-white"
								style={{ backgroundColor: category.color || '#6b7280' }}
							>
								<Folder className="h-5 w-5" />
							</div>
						)}

						<div className="flex-1">
							<h3 className="text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">
								{category.name}
							</h3>
							<div className="flex items-center gap-2 text-xs text-gray-500">
								<span>{category._count.websites} 个网站</span>
								{category.description && (
									<span className="truncate">{category.description}</span>
								)}
							</div>
						</div>
					</Link>
				</div>

				{hasChildren && isExpanded && (
					<div className="mt-2">
						{category.children!.map((child) =>
							renderCategory(child, level + 1)
						)}
					</div>
				)}
			</div>
		);
	};

	if (loading) {
		return <div className="py-8 text-center text-gray-500">加载中...</div>;
	}

	if (categoryTree.length === 0) {
		return <div className="py-8 text-center text-gray-500">暂无网站分类</div>;
	}

	return (
		<div className="space-y-2">
			{categoryTree.map((category) => renderCategory(category))}
		</div>
	);
}
