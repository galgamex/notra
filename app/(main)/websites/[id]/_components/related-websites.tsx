'use client';

import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

	// 移除加载占位动画，直接显示内容

	if (relatedWebsites.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6">
			{/* 相关网站 */}
			<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-card">
				<h2 className="mb-4 font-medium text-gray-900 dark:text-gray-100">相关网站</h2>
				<div className="space-y-3">
					{relatedWebsites.slice(0, 5).map((website) => (
						<div key={website.id} className="group">
							<Link
								className={`block rounded-lg p-2 transition-colors ${website.isFeatured
									? 'border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 dark:border-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
									: 'hover:bg-gray-50 dark:hover:bg-gray-700'
									}`}
								href={`/websites/${website.id}`}
							>
								{/* 两列布局：左列logo，右列名称和描述 */}
								<div className="flex gap-3">
									{/* 左列：Logo */}
									{website.logo ? (
										<div className="relative h-10 w-10 flex-shrink-0">
											<Image
												fill
												alt={`${website.name} Logo`}
												className="rounded-lg object-cover"
												sizes="40px"
												src={website.logo}
												onError={(e) => {
													const target = e.target as HTMLImageElement;

													target.style.display = 'none';
												}}
											/>
										</div>
									) : (
										<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
											<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
												{website.name.charAt(0).toUpperCase()}
											</span>
										</div>
									)}

									{/* 右列：网站名称和描述 */}
									<div className="min-w-0 flex-1">
										<h4 className="mb-1 font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 truncate">
											{website.name}
										</h4>
										<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
											<Eye className="h-3 w-3" />
											<span>{website.clickCount}</span>
										</div>
									</div>
								</div>
							</Link>
						</div>
					))}
				</div>

				{relatedWebsites.length > 5 && (
					<div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-700">
						<Link
							className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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

	// 移除加载占位动画，直接显示内容

	if (popularWebsites.length === 0) {
		return null;
	}

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-card">
			<h2 className="mb-4 font-medium text-gray-900 dark:text-gray-100">热门网站</h2>
			<div className="space-y-3">
				{popularWebsites.slice(0, 5).map((website, index) => (
					<div key={website.id} className="group">
						<Link
							className={`block rounded-lg p-2 transition-colors ${website.isFeatured
								? 'border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 dark:border-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
								: 'hover:bg-gray-50 dark:hover:bg-gray-700'
								}`}
							href={`/websites/${website.id}`}
						>
							{/* 两列布局：左列logo，右列名称和描述 */}
							<div className="flex gap-3">
								{/* 左列：Logo */}
								{website.logo ? (
									<div className="relative h-8 w-8 flex-shrink-0">
										<Image
											fill
											alt={`${website.name} Logo`}
											className="rounded border border-gray-200 object-cover dark:border-gray-700"
											sizes="32px"
											src={website.logo}
											onError={(e) => {
												const target = e.target as HTMLImageElement;

												target.style.display = 'none';
											}}
										/>
									</div>
								) : (
									<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-purple-600">
										<span className="text-xs font-bold text-white">
											{website.name.charAt(0).toUpperCase()}
										</span>
									</div>
								)}

								{/* 右列：网站名称和描述 */}
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<span
											className={`text-sm font-bold ${index === 0
												? 'text-yellow-600 dark:text-yellow-400'
												: index === 1
													? 'text-gray-500 dark:text-gray-400'
													: index === 2
														? 'text-orange-600 dark:text-orange-400'
														: 'text-gray-400 dark:text-gray-500'
												}`}
										>
											{index + 1}
										</span>
										<h4 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 truncate">
											{website.name}
										</h4>
									</div>
									<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
										<Eye className="h-3 w-3" />
										<span>{website.clickCount.toLocaleString()}</span>
									</div>
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>

			<div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-700">
				<Link
					className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
					href="/websites?sort=popular"
				>
					查看更多热门网站 →
				</Link>
			</div>
		</div>
	);
}
