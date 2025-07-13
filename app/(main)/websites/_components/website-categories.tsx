'use client';

import { Folder, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import type { WebsiteCategoryWithDetails } from '@/types/website';
import { Button } from '@/components/ui/button';

export function WebsiteCategories() {
	const [categories, setCategories] = useState<
		WebsiteCategoryWithDetails[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 6;

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch('/api/website/categories?isVisible=true&level=0');

				if (response.ok) {
					const data = await response.json();

					setCategories(data.categories || []);
				}
			} catch (error) {
				console.error('获取分类列表失败:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const totalPages = Math.ceil(categories.length / itemsPerPage);
	const currentCategories = categories.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	);

	const goToPrevious = () => {
		setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
	};

	const goToNext = () => {
		setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
	};



	if (loading) {
		return <div className="py-8 text-center text-gray-500 dark:text-gray-400">加载中...</div>;
	}

	if (categories.length === 0) {
		return <div className="py-8 text-center text-gray-500 dark:text-gray-400">暂无网站分类</div>;
	}

	return (
		<div className="relative px-12">
			{/* 轮播容器 */}
			<div className="overflow-hidden relative min-h-[200px] flex items-center">
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full">
					{currentCategories.map((category) => (
						<Link
							key={category.id}
							className="group flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-card dark:hover:border-gray-600"
							href={`/websites/category/${category.slug}`}
						>
							{category.icon ? (
								<div
									className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg text-lg text-white"
									style={{ backgroundColor: category.color || '#6b7280' }}
								>
									<span>{category.icon}</span>
								</div>
							) : (
								<div
									className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg text-white"
									style={{ backgroundColor: category.color || '#6b7280' }}
								>
									<Folder className="h-6 w-6" />
								</div>
							)}

							<h3 className="mb-1 text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
								{category.name}
							</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{category._count.websites} 个网站
							</p>
						</Link>
					))}
				</div>
			</div>

			{/* 导航按钮 */}
			{totalPages > 1 && (
				<>
					<Button
						variant="outline"
						size="icon"
						className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md hover:shadow-lg dark:bg-gray-800 z-10"
						onClick={goToPrevious}
						aria-label="上一页分类"
						title="上一页分类"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md hover:shadow-lg dark:bg-gray-800 z-10"
						onClick={goToNext}
						aria-label="下一页分类"
						title="下一页分类"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</>
			)}


		</div>
	);
}
