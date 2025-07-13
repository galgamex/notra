'use client';

import { ExternalLink, Star, TrendingUp, Grid, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import type { WebsiteWithDetails } from '@/types/website';

interface CategoryWebsiteListProps {
	categoryId: string;
}

interface WebsiteListResponse {
	websites: WebsiteWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export function CategoryWebsiteList({ categoryId }: CategoryWebsiteListProps) {
	const [websites, setWebsites] = useState<WebsiteWithDetails[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [sortBy, setSortBy] = useState<string>('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [filterType, setFilterType] = useState<
		'all' | 'featured' | 'recommended'
	>('all');
	const limit = 12;

	// 获取网站列表
	const fetchWebsites = useCallback(async () => {
		setLoading(true);

		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				status: 'APPROVED',
				categoryId,
				sortBy,
				sortOrder
			});

			// 添加筛选参数
			if (filterType === 'featured') {
				params.append('isFeatured', 'true');
			} else if (filterType === 'recommended') {
				params.append('isRecommend', 'true');
			}

			const response = await fetch(`/api/website?${params}`);

			if (response.ok) {
				const data: WebsiteListResponse = await response.json();

				setWebsites(data.websites);
				setTotalPages(data.totalPages);
				setTotal(data.total);
			}
		} catch (error) {
			console.error('获取网站列表失败:', error);
		} finally {
			setLoading(false);
		}
	}, [page, categoryId, sortBy, sortOrder, filterType, limit]);

	useEffect(() => {
		fetchWebsites();
	}, [fetchWebsites]);

	// 处理访问网站（外部链接）
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

	// 移除加载占位动画，直接显示内容

	return (
		<div className="space-y-6">
			{/* 工具栏 */}
			<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-card">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					{/* 统计信息和筛选 */}
					<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
						<div className="text-sm text-gray-600">
							共找到 <span className="font-medium text-gray-900 dark:text-gray-100">{total}</span>{' '}
							个网站
						</div>

						{/* 筛选标签 */}
						<div className="flex gap-2">
							<Button
								size="sm"
								variant={filterType === 'all' ? 'default' : 'outline'}
								onClick={() => {
									setFilterType('all');
									setPage(1);
								}}
							>
								全部
							</Button>
							<Button
								size="sm"
								variant={filterType === 'featured' ? 'default' : 'outline'}
								onClick={() => {
									setFilterType('featured');
									setPage(1);
								}}
							>
								<Star className="mr-1 h-3 w-3" />
								精选
							</Button>
							<Button
								size="sm"
								variant={filterType === 'recommended' ? 'default' : 'outline'}
								onClick={() => {
									setFilterType('recommended');
									setPage(1);
								}}
							>
								推荐
							</Button>
						</div>
					</div>

					{/* 排序和视图切换 */}
					<div className="flex items-center gap-2">
						{/* 视图切换 */}
						<div className="flex rounded-md border border-gray-200 dark:border-gray-700">
							<Button
								className="rounded-r-none"
								size="sm"
								variant={viewMode === 'grid' ? 'default' : 'ghost'}
								onClick={() => setViewMode('grid')}
							>
								<Grid className="h-4 w-4" />
							</Button>
							<Button
								className="rounded-l-none"
								size="sm"
								variant={viewMode === 'list' ? 'default' : 'ghost'}
								onClick={() => setViewMode('list')}
							>
								<List className="h-4 w-4" />
							</Button>
						</div>

						{/* 排序 */}
						<Select
							value={`${sortBy}-${sortOrder}`}
							onValueChange={(value) => {
								const [newSortBy, newSortOrder] = value.split('-');

								setSortBy(newSortBy);
								setSortOrder(newSortOrder as 'asc' | 'desc');
								setPage(1);
							}}
						>
							<SelectTrigger className="w-36">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="createdAt-desc">最新收录</SelectItem>
								<SelectItem value="createdAt-asc">最早收录</SelectItem>
								<SelectItem value="clickCount-desc">最热门</SelectItem>
								<SelectItem value="clickCount-asc">最冷门</SelectItem>
								<SelectItem value="name-asc">名称 A-Z</SelectItem>
								<SelectItem value="name-desc">名称 Z-A</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* 网站列表 */}
			{websites.length === 0 ? (
				<div className="py-16 text-center">
					<div className="mb-4 text-gray-400 dark:text-gray-600">
						<ExternalLink className="mx-auto h-16 w-16" />
					</div>
					<h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">暂无网站</h3>
					<p className="text-gray-500 dark:text-gray-400">
						{filterType === 'all'
							? '该分类下暂无网站'
							: filterType === 'featured'
								? '该分类下暂无精选网站'
								: '该分类下暂无推荐网站'}
					</p>
				</div>
			) : (
				<div
					className={
						viewMode === 'grid'
							? 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
							: 'space-y-4'
					}
				>
					{websites.map((website) =>
						viewMode === 'grid' ? (
							// 网格视图
							<div
								key={website.id}
								className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-blue-200 hover:shadow-xl dark:border-gray-700 dark:bg-card dark:hover:border-blue-600"
							>
								<Link className="block" href={`/websites/${website.id}`}>
									<div className="p-6">
										<div className="flex items-start gap-4">
											{/* Logo */}
											<div className="flex-shrink-0">
												{website.logo ? (
													<div className="relative h-16 w-16">
														<Image
															fill
															alt={website.name}
															className="rounded-xl object-cover shadow-sm"
															sizes="64px"
															src={website.logo}
														/>
													</div>
												) : (
													<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
														<span className="text-lg font-bold text-white">
															{website.name.charAt(0).toUpperCase()}
														</span>
													</div>
												)}
											</div>

											{/* Content */}
											<div className="min-w-0 flex-1">
												<div className="mb-2 flex items-start justify-between">
													<h3 className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
														{website.name}
													</h3>
													{website.isRecommend && (
														<Star
															className="ml-2 h-5 w-5 flex-shrink-0 text-yellow-500"
															fill="currentColor"
														/>
													)}
												</div>

												{website.description && (
													<p className="line-clamp-1 text-sm text-gray-600 dark:text-gray-400">
														{website.description}
													</p>
												)}

												<div className="mt-2 flex gap-2">
													{website.isFeatured && (
														<Badge
															className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-900"
															variant="secondary"
														>
															精选
														</Badge>
													)}
													{website.isRecommend && (
														<Badge
															className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-900"
															variant="secondary"
														>
															推荐
														</Badge>
													)}
												</div>

												<div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
													<div className="flex items-center gap-1">
														<TrendingUp className="h-4 w-4" />
														<span>{website.clickCount.toLocaleString()}</span>
													</div>
												</div>

												{website.tags.length > 0 && (
													<div className="mt-2 flex gap-1">
														{website.tags.slice(0, 2).map((tagRelation) => (
															<Badge
																key={tagRelation.tag.id}
																className="text-xs"
																variant="outline"
															>
																{tagRelation.tag.name}
															</Badge>
														))}
														{website.tags.length > 2 && (
															<span className="text-xs text-gray-400 dark:text-gray-500">
																+{website.tags.length - 2}
															</span>
														)}
													</div>
												)}
											</div>
										</div>
									</div>
								</Link>

								{/* 访问按钮 */}
								<div className="px-6 pb-6">
									<Button
										className="w-full"
										size="sm"
										variant="outline"
										onClick={(e) => handleVisitWebsite(website.id, website.url, e)}
									>
										<ExternalLink className="mr-2 h-4 w-4" />
										访问网站
									</Button>
								</div>
							</div>
						) : (
							// 列表视图
							<div
								key={website.id}
								className="group rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-card dark:hover:border-blue-600"
							>
								<Link className="block" href={`/websites/${website.id}`}>
									<div className="p-4">
										<div className="flex items-center gap-4">
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
												<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
													<span className="font-medium text-white">
														{website.name.charAt(0).toUpperCase()}
													</span>
												</div>
											)}

											<div className="min-w-0 flex-1">
												<div className="mb-1 flex items-center gap-2">
													<h3 className="truncate font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
														{website.name}
													</h3>
													{website.isRecommend && (
														<Star
															className="h-4 w-4 text-yellow-500"
															fill="currentColor"
														/>
													)}
													{website.isFeatured && (
														<Badge
															className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-900"
															variant="secondary"
														>
															精选
														</Badge>
													)}
												</div>

												{website.description && (
													<p className="mb-2 line-clamp-1 text-sm text-gray-600 dark:text-gray-400">
														{website.description}
													</p>
												)}

												<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
													<div className="flex items-center gap-1">
														<TrendingUp className="h-3 w-3" />
														<span>
															{website.clickCount.toLocaleString()} 次访问
														</span>
													</div>
													{website.tags.length > 0 && (
														<div className="flex gap-1">
															{website.tags.slice(0, 3).map((tagRelation) => (
																<span
																	key={tagRelation.tag.id}
																	className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
																>
																	{tagRelation.tag.name}
																</span>
															))}
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</Link>

								{/* 访问按钮 */}
								<div className="px-4 pb-4">
									<Button
										size="sm"
										variant="outline"
										onClick={(e) => handleVisitWebsite(website.id, website.url, e)}
									>
										<ExternalLink className="mr-2 h-4 w-4" />
										访问
									</Button>
								</div>
							</div>
						)
					)}
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
