'use client';

import { ExternalLink, Star, TrendingUp, Filter } from 'lucide-react';
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
	const limit = 12;

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

	// 处理访问网站
	const handleVisitWebsite = async (
		websiteId: string,
		url: string,
		event: React.MouseEvent
	) => {
		event.stopPropagation(); // 阻止事件冒泡

		try {
			// 记录点击
			await fetch('/api/website/clicks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					websiteId,
					referer: window.location.href
				})
			});
		} catch (error) {
			console.error('记录点击失败:', error);
		}

		// 打开网站
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	if (loading && websites.length === 0) {
		return (
			<div className="space-y-4">
				{/* 筛选器骨架 */}
				<div className="mb-6 flex gap-4">
					<div className="h-10 w-48 animate-pulse rounded bg-gray-200"></div>
					<div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
				</div>

				{/* 网站卡片骨架 */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="h-48 animate-pulse rounded-lg bg-gray-200"
						></div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* 筛选和排序 */}
			<div className="flex flex-wrap items-center gap-4">
				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4 text-gray-500" />
					<span className="text-sm text-gray-600">筛选:</span>
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
				<div className="py-12 text-center text-gray-500">
					{selectedCategory ? '该分类下暂无网站' : '暂无网站'}
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{websites.map((website) => (
						<div
							key={website.id}
							className="group rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg"
						>
							<Link className="block p-6 pb-4" href={`/websites/${website.id}`}>
								<div className="mb-4 flex items-start gap-4">
									{website.logo ? (
										<div className="relative h-16 w-16 flex-shrink-0">
											<Image
												alt={website.name}
												className="rounded-lg object-cover"
												src={website.logo}
												fill
												sizes="64px"
											/>
										</div>
									) : (
										<div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
											<span className="text-lg font-medium text-gray-500">
												{website.name.charAt(0).toUpperCase()}
											</span>
										</div>
									)}

									<div className="min-w-0 flex-1">
										<div className="mb-2 flex items-start justify-between">
											<h3 className="truncate font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
												{website.name}
											</h3>
											{website.isRecommend && (
												<Star
													className="ml-2 h-4 w-4 flex-shrink-0 text-yellow-500"
													fill="currentColor"
												/>
											)}
										</div>

										<div
											className="mb-2 inline-block rounded-full px-2 py-1 text-xs font-medium"
											style={{
												backgroundColor: website.category.color
													? `${website.category.color}20`
													: '#f3f4f6',
												color: website.category.color || '#6b7280'
											}}
										>
											{website.category.name}
										</div>
									</div>
								</div>

								{website.description && (
									<p className="mb-4 line-clamp-2 text-sm text-gray-600">
										{website.description}
									</p>
								)}

								<div className="flex items-center justify-between text-sm text-gray-500">
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-1">
											<TrendingUp className="h-4 w-4" />
											<span>{website.clickCount.toLocaleString()}</span>
										</div>
									</div>

									{website.tags.length > 0 && (
										<div className="flex gap-1">
											{website.tags.slice(0, 2).map((tagRelation) => (
												<span
													key={tagRelation.tag.id}
													className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
												>
													{tagRelation.tag.name}
												</span>
											))}
											{website.tags.length > 2 && (
												<span className="text-xs text-gray-400">
													+{website.tags.length - 2}
												</span>
											)}
										</div>
									)}
								</div>
							</Link>

							{/* 访问按钮 */}
							<div className="px-6 pb-6">
								<Button
									className="w-full"
									size="sm"
									variant="outline"
									onClick={(e) =>
										handleVisitWebsite(website.id, website.url, e)
									}
								>
									<ExternalLink className="mr-2 h-4 w-4" />
									访问网站
								</Button>
							</div>
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
