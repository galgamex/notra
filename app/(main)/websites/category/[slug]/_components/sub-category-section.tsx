'use client';

import { ExternalLink, Globe, Folder } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import type {
	WebsiteCategoryWithDetails,
	WebsiteWithDetails
} from '@/types/website';

interface SubCategorySectionProps {
	category: WebsiteCategoryWithDetails;
	maxItems?: number;
	gridCols?: number;
}

interface WebsiteListResponse {
	websites: WebsiteWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export function SubCategorySection({
	category,
	maxItems = 20,
	gridCols = 5
}: SubCategorySectionProps) {
	const [websites, setWebsites] = useState<WebsiteWithDetails[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);

	const fetchWebsites = useCallback(async () => {
		setLoading(true);

		try {
			const response = await fetch(
				`/api/website?categoryId=${category.id}&status=APPROVED&limit=${maxItems}&sortBy=sortOrder&sortOrder=asc`
			);

			if (response.ok) {
				const data: WebsiteListResponse = await response.json();

				setWebsites(data.websites || []);
				setTotal(data.total || 0);
			}
		} catch (error) {
			console.error('获取网站列表失败:', error);
		} finally {
			setLoading(false);
		}
	}, [category.id, maxItems]);

	useEffect(() => {
		fetchWebsites();
	}, [fetchWebsites]);



	const handleWebsiteClick = async (websiteId: string, url: string) => {
		try {
			// 记录点击
			await fetch('/api/website/click', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					websiteId,
					referrer: window.location.href
				})
			});

			// 打开网站
			window.open(url, '_blank', 'noopener,noreferrer');
		} catch (error) {
			console.error('记录点击失败:', error);
			// 即使记录失败也要打开网站
			window.open(url, '_blank', 'noopener,noreferrer');
		}
	};

	if (loading) {
		return (
			<div className="space-y-4">
				<div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
				<div
					className={`xl:grid-cols- grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4${gridCols}`}
				>
					{Array.from({ length: maxItems }).map((_, i) => (
						<div
							key={i}
							className="h-32 animate-pulse rounded-lg bg-gray-200"
						></div>
					))}
				</div>
			</div>
		);
	}

	if (websites.length === 0) {
		return (
			<div className="space-y-4">
				{/* 分类标题 */}
				<div className="flex items-center gap-3">
					{category.icon ? (
						<div
							className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white"
							style={{ backgroundColor: category.color || '#6b7280' }}
						>
							<span>{category.icon}</span>
						</div>
					) : (
						<div
							className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
							style={{ backgroundColor: category.color || '#6b7280' }}
						>
							<Folder className="h-4 w-4" />
						</div>
					)}
					<h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
					<span className="text-sm text-gray-500">({total})</span>
				</div>

				<div className="py-12 text-center text-gray-500">
					<Globe className="mx-auto mb-4 h-12 w-12 text-gray-300" />
					<p>该分类暂无网站</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* 分类标题 */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{category.icon ? (
						<div
							className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white"
							style={{ backgroundColor: category.color || '#6b7280' }}
						>
							<span>{category.icon}</span>
						</div>
					) : (
						<div
							className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
							style={{ backgroundColor: category.color || '#6b7280' }}
						>
							<Folder className="h-4 w-4" />
						</div>
					)}
					<h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
					<span className="text-sm text-gray-500">({total})</span>
				</div>

				{total > maxItems && (
					<Link
						className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
						href={`/websites/category/${category.slug}`}
					>
						查看全部 →
					</Link>
				)}
			</div>

			{/* 网站网格 */}
			<div
				className={`xl:grid-cols- grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4${gridCols}`}
			>
				{websites.map((website) => (
					<div
						key={website.id}
						className="group cursor-pointer rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md"
						onClick={() => handleWebsiteClick(website.id, website.url)}
					>
						<div className="p-4">
							{/* 网站图标和名称 */}
							<div className="mb-2 flex items-center gap-3">
								{website.logo ? (
									<div className="relative h-8 w-8 flex-shrink-0">
										<Image
											alt={website.name}
											className="rounded-lg object-cover"
											src={website.logo}
											fill
											sizes="32px"
										/>
									</div>
								) : (
									<div
										className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm text-white"
										style={{
											backgroundColor: website.category.color || '#6b7280'
										}}
									>
										<Globe className="h-4 w-4" />
									</div>
								)}
								<div className="min-w-0 flex-1">
									<h3 className="truncate font-medium text-gray-900 transition-colors group-hover:text-blue-600">
										{website.name}
									</h3>
								</div>
								<ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover:text-blue-600" />
							</div>

							{/* 网站描述 */}
							{website.description && (
								<p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
									{website.description}
								</p>
							)}

							{/* 推荐和精选标记 */}
							<div className="mt-2 flex gap-2">
								{website.isRecommend && (
									<span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
										推荐
									</span>
								)}
								{website.isFeatured && (
									<span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
										精选
									</span>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* 分类描述 */}
			{category.description && (
				<div className="mt-4 rounded-lg bg-gray-50 p-4">
					<p className="text-sm text-gray-600">{category.description}</p>
				</div>
			)}
		</div>
	);
}
