'use client';

import { Hash, TrendingUp } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { WebsiteWithDetails } from '@/types/website';

interface WebsiteStatsProps {
	type: 'popular' | 'recent' | 'categories';
}

interface CategoryStats {
	id: string;
	name: string;
	slug: string;
	_count: {
		websites: number;
	};
}

export default function WebsiteStats({ type }: WebsiteStatsProps) {
	const [data, setData] = useState<WebsiteWithDetails[] | CategoryStats[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			let url = '';

			switch (type) {
				case 'popular':
					url = '/api/website/popular';
					break;
				case 'recent':
					url = '/api/website/recent';
					break;
				case 'categories':
					url = '/api/website/categories';
					break;
			}

			const response = await fetch(url);

			if (response.ok) {
				const result = await response.json();

				if (type === 'categories') {
					setData(result.categories || []);
				} else {
					setData(result);
				}
			}
		} catch (error) {
			console.error('Failed to fetch data:', error);
		} finally {
			setLoading(false);
		}
	}, [type]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (loading) {
		return <div className="py-4 text-center">加载中...</div>;
	}

	if (type === 'categories') {
		const categories = data as CategoryStats[];
		const maxCount = Math.max(...categories.map((cat) => cat._count.websites));

		return (
			<div className="space-y-4">
				{categories.map((category) => (
					<div key={category.id} className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="flex items-center space-x-2">
								<Hash className="h-4 w-4 text-muted-foreground" />
								<span className="font-medium">{category.name}</span>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-24">
								<Progress
									className="h-2"
									value={(category._count.websites / maxCount) * 100}
								/>
							</div>
							<span className="w-8 text-right text-sm text-muted-foreground">
								{category._count.websites}
							</span>
						</div>
					</div>
				))}
				{categories.length === 0 && (
					<div className="py-4 text-center text-muted-foreground">
						暂无分类数据
					</div>
				)}
			</div>
		);
	}

	const websites = data as WebsiteWithDetails[];

	return (
		<div className="space-y-4">
			{websites.map((website, index) => (
				<div key={website.id} className="flex items-center space-x-3">
					<div className="flex flex-1 items-center space-x-3">
						<div className="w-6 text-sm text-muted-foreground">
							#{index + 1}
						</div>
						<Avatar className="h-8 w-8">
							<AvatarImage alt={website.name} src={website.logo || ''} />
							<AvatarFallback>{website.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<div className="truncate font-medium">{website.name}</div>
							<div className="truncate text-sm text-muted-foreground">
								{website.description || website.url}
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						{type === 'popular' && (
							<div className="flex items-center space-x-1 text-sm text-muted-foreground">
								<TrendingUp className="h-3 w-3" />
								<span>{website.clickCount || 0}</span>
							</div>
						)}
						{website.category && (
							<Badge className="text-xs" variant="outline">
								{website.category.name}
							</Badge>
						)}
					</div>
				</div>
			))}
			{websites.length === 0 && (
				<div className="py-4 text-center text-muted-foreground">
					暂无网站数据
				</div>
			)}
		</div>
	);
}
