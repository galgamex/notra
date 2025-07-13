'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function BlogSearch() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchTerm, setSearchTerm] = useState(
		searchParams.get('search') || ''
	);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();

		if (searchTerm.trim()) {
			router.push(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
		} else {
			router.push('/blog');
		}
	};

	const handleClear = () => {
		setSearchTerm('');
		router.push('/blog');
	};

	return (
		<Card className="mb-6">
			<CardContent className="p-4">
				<form className="flex space-x-2" onSubmit={handleSearch}>
					<div className="relative flex-1">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
						<Input
							className="pr-10 pl-10"
							placeholder="搜索文章..."
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						{searchTerm && (
							<button
								className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
								type="button"
								onClick={handleClear}
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>
					<Button size="sm" type="submit">
						搜索
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
