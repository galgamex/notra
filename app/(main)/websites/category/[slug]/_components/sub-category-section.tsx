'use client';

import { Globe, Folder } from 'lucide-react';
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
	maxItems = 24,
	gridCols = 6
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



	// 移除加载占位动画，直接显示内容

	if (websites.length === 0) {
		return (
			<div className="space-y-4">
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
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h2>
						<span className="text-sm text-gray-500 dark:text-gray-400">({total})</span>
					</div>

					{total > maxItems && (
						<Link
							className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
							href={`/websites/category/${category.slug}`}
						>
							查看更多 →
						</Link>
					)}
				</div>

				<div className="py-12 text-center text-gray-500 dark:text-gray-400">
					<Globe className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
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
					<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h2>
					<span className="text-sm text-gray-500 dark:text-gray-400">({total})</span>
				</div>

				{total > maxItems && (
					<Link
						className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
						href={`/websites/category/${category.slug}`}
					>
						查看全部 →
					</Link>
				)}
			</div>

			{/* 网站网格 */}
			<div
				className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
			>
				{websites.map((website) => (
					<div
						key={website.id}
						className={`group rounded-lg border transition-all duration-200 hover:shadow-md ${website.isFeatured
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
										<div
											className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-sm text-white"
											style={{
												backgroundColor: website.category.color || '#6b7280'
											}}
										>
											<Globe className="h-5 w-5" />
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

			{/* 分类描述 */}
			{category.description && (
				<div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-card">
					<p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
				</div>
			)}
		</div>
	);
}
