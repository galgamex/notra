'use client';

import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import type { WebsiteWithDetails } from '@/types/website';

interface RelatedWebsitesProps {
	categoryId: string;
	currentWebsiteId: string;
}

export function RelatedWebsites({
	categoryId,
	currentWebsiteId
}: RelatedWebsitesProps) {
	const [relatedWebsites, setRelatedWebsites] = useState<WebsiteWithDetails[]>(
		[]
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRelatedWebsites = async () => {
			try {
				const params = new URLSearchParams({
					categoryId,
					status: 'APPROVED',
					limit: '6',
					sortBy: 'clickCount',
					sortOrder: 'desc'
				});

				const response = await fetch(`/api/website?${params}`);

				if (!response.ok) {
					throw new Error('Failed to fetch websites');
				}

				const { websites } = await response.json();

				// 过滤掉当前网站
				const filtered = websites.filter(
					(website: WebsiteWithDetails) => website.id !== currentWebsiteId
				);

				setRelatedWebsites(filtered);
			} catch (error) {
				console.error('获取相关网站失败:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchRelatedWebsites();
	}, [categoryId, currentWebsiteId]);

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<div className="mb-4 h-5 animate-pulse rounded bg-gray-200"></div>
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex items-center gap-3">
								<div className="h-10 w-10 animate-pulse rounded bg-gray-200"></div>
								<div className="flex-1">
									<div className="mb-1 h-4 animate-pulse rounded bg-gray-200"></div>
									<div className="h-3 w-2/3 animate-pulse rounded bg-gray-200"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (relatedWebsites.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6">
			{/* 相关网站 */}
			<div className="rounded-lg border border-gray-200 bg-white p-4">
				<h3 className="mb-4 font-medium text-gray-900">相关网站</h3>
				<div className="space-y-3">
					{relatedWebsites.slice(0, 5).map((website) => (
						<div key={website.id} className="group">
							<Link
								className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
								href={`/websites/${website.id}`}
							>
								{/* 网站Logo */}
								<div className="flex-shrink-0">
									{website.logo ? (
										<Image
											alt={`${website.name} Logo`}
											className="rounded border border-gray-200"
											height={40}
											src={website.logo}
											width={40}
											onError={(e) => {
												const target = e.target as HTMLImageElement;

												target.style.display = 'none';
											}}
										/>
									) : (
										<div className="flex h-10 w-10 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-purple-600">
											<span className="text-sm font-bold text-white">
												{website.name.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
								</div>

								{/* 网站信息 */}
								<div className="min-w-0 flex-1">
									<h4 className="truncate font-medium text-gray-900 transition-colors group-hover:text-blue-600">
										{website.name}
									</h4>
									<div className="mt-1 flex items-center gap-2">
										<div className="flex items-center gap-1 text-xs text-gray-500">
											<Eye className="h-3 w-3" />
											<span>{website.clickCount}</span>
										</div>
										{website.isRecommend && (
											<Badge
												className="h-4 px-1 py-0 text-xs"
												variant="outline"
											>
												推荐
											</Badge>
										)}
									</div>
								</div>
							</Link>
						</div>
					))}
				</div>

				{relatedWebsites.length > 5 && (
					<div className="mt-4 border-t border-gray-100 pt-3">
						<Link
							className="text-sm font-medium text-blue-600 hover:text-blue-700"
							href={`/websites/category/${relatedWebsites[0]?.category.slug || ''}`}
						>
							查看更多同类网站 →
						</Link>
					</div>
				)}
			</div>

			{/* 热门网站 */}
			<PopularWebsites currentWebsiteId={currentWebsiteId} />
		</div>
	);
}

// 热门网站组件
function PopularWebsites({ currentWebsiteId }: { currentWebsiteId: string }) {
	const [popularWebsites, setPopularWebsites] = useState<WebsiteWithDetails[]>(
		[]
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPopularWebsites = async () => {
			try {
				const response = await fetch('/api/website/popular?limit=6');

				if (!response.ok) {
					throw new Error('Failed to fetch popular websites');
				}

				const websites = await response.json();

				// 过滤掉当前网站
				const filtered = websites.filter(
					(website: WebsiteWithDetails) => website.id !== currentWebsiteId
				);

				setPopularWebsites(filtered);
			} catch (error) {
				console.error('获取热门网站失败:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPopularWebsites();
	}, [currentWebsiteId]);

	if (loading) {
		return (
			<div className="rounded-lg border border-gray-200 bg-white p-4">
				<div className="mb-4 h-5 animate-pulse rounded bg-gray-200"></div>
				<div className="space-y-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
							<div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
							<div className="flex-1">
								<div className="mb-1 h-4 animate-pulse rounded bg-gray-200"></div>
								<div className="h-3 w-2/3 animate-pulse rounded bg-gray-200"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (popularWebsites.length === 0) {
		return null;
	}

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<h3 className="mb-4 font-medium text-gray-900">热门网站</h3>
			<div className="space-y-3">
				{popularWebsites.slice(0, 5).map((website, index) => (
					<div key={website.id} className="group">
						<Link
							className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
							href={`/websites/${website.id}`}
						>
							{/* 排名 */}
							<div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
								<span
									className={`text-sm font-bold ${
										index === 0
											? 'text-yellow-600'
											: index === 1
												? 'text-gray-500'
												: index === 2
													? 'text-orange-600'
													: 'text-gray-400'
									}`}
								>
									{index + 1}
								</span>
							</div>

							{/* 网站Logo */}
							<div className="flex-shrink-0">
								{website.logo ? (
									<Image
										alt={`${website.name} Logo`}
										className="rounded border border-gray-200"
										height={32}
										src={website.logo}
										width={32}
										onError={(e) => {
											const target = e.target as HTMLImageElement;

											target.style.display = 'none';
										}}
									/>
								) : (
									<div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-purple-600">
										<span className="text-xs font-bold text-white">
											{website.name.charAt(0).toUpperCase()}
										</span>
									</div>
								)}
							</div>

							{/* 网站信息 */}
							<div className="min-w-0 flex-1">
								<h4 className="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">
									{website.name}
								</h4>
								<div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
									<Eye className="h-3 w-3" />
									<span>{website.clickCount.toLocaleString()}</span>
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>

			<div className="mt-4 border-t border-gray-100 pt-3">
				<Link
					className="text-sm font-medium text-blue-600 hover:text-blue-700"
					href="/websites?sort=popular"
				>
					查看更多热门网站 →
				</Link>
			</div>
		</div>
	);
}
