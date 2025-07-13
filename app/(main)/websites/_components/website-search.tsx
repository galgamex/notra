'use client';

import { Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import type { WebsiteSearchSuggestion } from '@/types/website';

export function WebsiteSearch() {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<WebsiteSearchSuggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);

	const debouncedQuery = useDebounce(query, 300);

	useEffect(() => {
		if (debouncedQuery.trim()) {
			searchSuggestions(debouncedQuery);
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	}, [debouncedQuery]);

	const searchSuggestions = async (searchQuery: string) => {
		setIsLoading(true);

		try {
			const response = await fetch(
				`/api/website/search?q=${encodeURIComponent(searchQuery)}&limit=5`
			);

			if (response.ok) {
				const data = await response.json();

				setSuggestions(data);
				setShowSuggestions(true);
			}
		} catch (error) {
			console.error('搜索失败:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const clearSearch = () => {
		setQuery('');
		setSuggestions([]);
		setShowSuggestions(false);
	};

	const handleSuggestionClick = () => {
		setShowSuggestions(false);
	};

	return (
		<div className="relative">
			<div className="relative">
				<Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
				<Input
					className="h-12 pr-10 pl-10 text-lg"
					placeholder="搜索网站..."
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => query.trim() && setShowSuggestions(true)}
				/>
				{query && (
					<Button
						className="absolute top-1/2 right-2 h-auto -translate-y-1/2 transform p-1"
						size="sm"
						variant="ghost"
						onClick={clearSearch}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>

			{/* 搜索建议 */}
			{showSuggestions && (
				<div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
					{isLoading ? (
						<div className="p-4 text-center text-gray-500">
							<div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
							搜索中...
						</div>
					) : suggestions.length > 0 ? (
						<div className="py-2">
							{suggestions.map((website) => (
								<Link
									key={website.id}
									className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
									href={website.url}
									rel="noopener noreferrer"
									target="_blank"
									onClick={handleSuggestionClick}
								>
									{website.logo ? (
										<div className="relative h-8 w-8">
											<Image
												alt={website.name}
												className="rounded-lg object-cover"
												src={website.logo}
												fill
												sizes="32px"
											/>
										</div>
									) : (
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200">
											<span className="text-sm font-medium text-gray-500">
												{website.name.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
									<div className="min-w-0 flex-1">
										<div className="truncate font-medium text-gray-900">
											{website.name}
										</div>
										{website.description && (
											<div className="truncate text-sm text-gray-500">
												{website.description}
											</div>
										)}
									</div>
									<div
										className="rounded px-2 py-1 text-xs font-medium"
										style={{
											backgroundColor: website.category.color
												? `${website.category.color}20`
												: '#f3f4f6',
											color: website.category.color || '#6b7280'
										}}
									>
										{website.category.name}
									</div>
								</Link>
							))}
						</div>
					) : query.trim() && !isLoading ? (
						<div className="p-4 text-center text-gray-500">未找到相关网站</div>
					) : null}
				</div>
			)}

			{/* 点击外部关闭建议 */}
			{showSuggestions && (
				<div
					className="fixed inset-0 z-40"
					onClick={() => setShowSuggestions(false)}
				/>
			)}
		</div>
	);
}
