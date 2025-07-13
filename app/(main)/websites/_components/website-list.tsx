'use client';

import { Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import type {
	WebsiteWithDetails,
	WebsiteCategoryWithDetails
} from '@/types/website';

interface WebsiteListResponse {
	websites: WebsiteWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export function WebsiteList() {
	const [websites, setWebsites] = useState<WebsiteWithDetails[]>([]);
	const [categories, setCategories] = useState<WebsiteCategoryWithDetails[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [sortBy, setSortBy] = useState<string>('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const limit = 24;

	// 获取网站列表
	const fetchWebsites = useCallback(async () => {
		setLoading(true);

		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				status: 'APPROVED',
				sortBy,
				sortOrder
			});

			if (selectedCategory && selectedCategory !== 'all') {
				params.append('categoryId', selectedCategory);
			}

			const response = await fetch(`/api/website?${params}`);

			if (response.ok) {
				const data: WebsiteListResponse = await response.json();

				setWebsites(data.websites);
				setTotalPages(data.totalPages);
			}
		} catch (error) {
			console.error('获取网站列表失败:', error);
		} finally {
			setLoading(false);
		}
	}, [page, selectedCategory, sortBy, sortOrder, limit]);

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

	useEffect(() => {
		fetchCategories();
	}, []);

	useEffect(() => {
		fetchWebsites();
	}, [fetchWebsites]);



	// 移除加载占位动画，直接显示内容

	return (
		<div className="space-y-6">
			{/* 筛选和排序 */}
			<div className="flex flex-wrap items-center gap-4">
				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
					<span className="text-sm text-gray-600 dark:text-gray-400">筛选:</span>
				</div>

				<Select value={selectedCategory} onValueChange={setSelectedCategory}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="选择分类" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部分类</SelectItem>
						{categories.map((category) => (
							<SelectItem key={category.id} value={category.id}>
								{category.name} ({category._count.websites})
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={`${sortBy}-${sortOrder}`}
					onValueChange={(value) => {
						const [newSortBy, newSortOrder] = value.split('-');

						setSortBy(newSortBy);
						setSortOrder(newSortOrder as 'asc' | 'desc');
					}}
				>
					<SelectTrigger className="w-32">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="createdAt-desc">最新</SelectItem>
						<SelectItem value="createdAt-asc">最早</SelectItem>
						<SelectItem value="clickCount-desc">最热门</SelectItem>
						<SelectItem value="name-asc">名称 A-Z</SelectItem>
						<SelectItem value="name-desc">名称 Z-A</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* 网站列表 */}
			{websites.length === 0 ? (
				<div className="py-12 text-center text-gray-500 dark:text-gray-400">
					{selectedCategory ? '该分类下暂无网站' : '暂无网站'}
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
					{websites.map((website) => (
						<div
							key={website.id}
							className={`group rounded-lg border transition-all duration-200 hover:shadow-lg ${website.isFeatured
								? 'border-blue-500 bg-blue-50/50 hover:border-blue-600 dark:border-blue-600 dark:bg-blue-900/20 dark:hover:border-blue-500'
								: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-card dark:hover:border-gray-600'
								}`}
						>
							<Link className="block" href={`/websites/${website.id}`}>
								<div className="p-4">
									{/* 两列布局：左列logo，右列名称和描述 */}
									<div className="flex gap-3">
										{/* 左列：Logo */}
										{website.logo ? (
											<div className="relative h-12 w-12 flex-shrink-0">
												<Image
													fill
													alt={website.name}
													className="rounded-lg object-cover"
													sizes="48px"
													src={website.logo}
												/>
											</div>
										) : (
											<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
												<span className="font-medium text-gray-500 dark:text-gray-400">
													{website.name.charAt(0).toUpperCase()}
												</span>
											</div>
										)}

										{/* 右列：网站名称和描述 */}
										<div className="min-w-0 flex-1">
											<h3 className="mb-1 font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 truncate">
												{website.name}
											</h3>
											{website.description && (
												<p className="line-clamp-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
													{website.description}
												</p>
											)}
										</div>
									</div>
								</div>
							</Link>
						</div>
					))}
				</div>
			)}

			{/* 分页 */}
			{totalPages > 1 && (
				<div className="mt-8 flex items-center justify-center gap-2">
					<Button
						disabled={page === 1 || loading}
						variant="outline"
						onClick={() => setPage((p) => Math.max(1, p - 1))}
					>
						上一页
					</Button>

					<div className="flex items-center gap-1">
						{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
							let pageNum;

							if (totalPages <= 5) {
								pageNum = i + 1;
							} else if (page <= 3) {
								pageNum = i + 1;
							} else if (page >= totalPages - 2) {
								pageNum = totalPages - 4 + i;
							} else {
								pageNum = page - 2 + i;
							}

							return (
								<Button
									key={pageNum}
									disabled={loading}
									size="sm"
									variant={page === pageNum ? 'default' : 'outline'}
									onClick={() => setPage(pageNum)}
								>
									{pageNum}
								</Button>
							);
						})}
					</div>

					<Button
						disabled={page === totalPages || loading}
						variant="outline"
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
					>
						下一页
					</Button>
				</div>
			)}
		</div>
	);
}
