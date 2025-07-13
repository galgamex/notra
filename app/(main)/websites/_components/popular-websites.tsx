import { TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { PopularWebsite } from '@/types/website';

async function getPopularWebsites(): Promise<PopularWebsite[]> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/website/popular?limit=8`,
			{
				cache: 'no-store'
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch popular websites');
		}

		return response.json();
	} catch (error) {
		console.error('获取热门网站失败:', error);

		return [];
	}
}

export async function PopularWebsites() {
	const websites = await getPopularWebsites();

	if (websites.length === 0) {
		return <div className="py-8 text-center text-gray-500">暂无热门网站</div>;
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{websites.map((website) => (
				<Link
					key={website.id}
					className="group block rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
					href={website.url}
					rel="noopener noreferrer"
					target="_blank"
				>
					<div className="mb-3 flex items-center gap-3">
						{website.logo ? (
						<div className="relative h-10 w-10">
							<Image
								alt={website.name}
								className="rounded-lg object-cover"
								src={website.logo}
								fill
								sizes="40px"
							/>
						</div>
					) : (
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
							<span className="font-medium text-gray-500">
								{website.name.charAt(0).toUpperCase()}
							</span>
						</div>
					)}
						<div className="min-w-0 flex-1">
							<h3 className="truncate font-medium text-gray-900 transition-colors group-hover:text-blue-600">
								{website.name}
							</h3>
							<div
								className="mt-1 inline-block rounded-full px-2 py-1 text-xs"
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

					<div className="flex items-center justify-between text-sm text-gray-500">
						<div className="flex items-center gap-1">
							<TrendingUp className="h-4 w-4" />
							<span>{website.clickCount.toLocaleString()} 次访问</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
