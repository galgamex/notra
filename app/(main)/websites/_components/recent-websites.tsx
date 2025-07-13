import { Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { RecentWebsite } from '@/types/website';

async function getRecentWebsites(): Promise<RecentWebsite[]> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/website/recent?limit=6`,
			{
				cache: 'no-store'
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch recent websites');
		}

		return response.json();
	} catch (error) {
		console.error('获取最新网站失败:', error);

		return [];
	}
}

function formatDate(date: string | Date) {
	const d = new Date(date);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - d.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 1) {
		return '今天';
	} else if (diffDays === 2) {
		return '昨天';
	} else if (diffDays <= 7) {
		return `${diffDays - 1} 天前`;
	} else {
		return d.toLocaleDateString('zh-CN');
	}
}

export async function RecentWebsites() {
	const websites = await getRecentWebsites();

	if (websites.length === 0) {
		return <div className="py-8 text-center text-gray-500">暂无最新网站</div>;
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{websites.map((website) => (
				<Link
					key={website.id}
					className="group block rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
					href={website.url}
					rel="noopener noreferrer"
					target="_blank"
				>
					<div className="flex items-start gap-3">
						{website.logo ? (
						<div className="relative h-12 w-12 flex-shrink-0">
							<Image
								alt={website.name}
								className="rounded-lg object-cover"
								src={website.logo}
								fill
								sizes="48px"
							/>
						</div>
					) : (
						<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
							<span className="font-medium text-gray-500">
								{website.name.charAt(0).toUpperCase()}
							</span>
						</div>
					)}

						<div className="min-w-0 flex-1">
							<h3 className="mb-1 truncate font-medium text-gray-900 transition-colors group-hover:text-blue-600">
								{website.name}
							</h3>

							{website.description && (
								<p className="mb-2 line-clamp-2 text-sm text-gray-600">
									{website.description}
								</p>
							)}

							<div className="flex items-center justify-between">
								<div
									className="rounded-full px-2 py-1 text-xs"
									style={{
										backgroundColor: website.category.color
											? `${website.category.color}20`
											: '#f3f4f6',
										color: website.category.color || '#6b7280'
									}}
								>
									{website.category.name}
								</div>

								<div className="flex items-center gap-1 text-xs text-gray-500">
									<Clock className="h-3 w-3" />
									<span>{formatDate(website.createdAt)}</span>
								</div>
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
