'use client';

import { TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import type { PopularWebsite } from '@/types/website';

export function PopularWebsites() {
	const [websites, setWebsites] = useState<PopularWebsite[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPopularWebsites = async () => {
			try {
				const response = await fetch('/api/website/popular?limit=8');

				if (!response.ok) {
					throw new Error('Failed to fetch popular websites');
				}

				const data = await response.json();
				setWebsites(data || []);
			} catch (error) {
				console.error('获取热门网站失败:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPopularWebsites();
	}, []);

	if (loading) {
		return <div className="py-8 text-center text-gray-500 dark:text-gray-400">加载中...</div>;
	}

	if (websites.length === 0) {
		return <div className="py-8 text-center text-gray-500 dark:text-gray-400">暂无热门网站</div>;
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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
									<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
										<TrendingUp className="h-3 w-3" />
										<span>{website.clickCount.toLocaleString()}</span>
									</div>
								</div>
							</div>
						</div>
					</Link>
				</div>
			))}
		</div>
	);
}
