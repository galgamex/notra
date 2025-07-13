import { Suspense } from 'react';

import { PopularWebsites } from './_components/popular-websites';
import { RecentWebsites } from './_components/recent-websites';
import { WebsiteCategories } from './_components/website-categories';
import { WebsiteList } from './_components/website-list';
import { WebsiteSearch } from './_components/website-search';

export default function WebsitesPage() {
	return (
		<div className="space-y-8 py-6">
			{/* 页面标题 */}
			<div className="text-center">
				<h1 className="mb-2 text-3xl font-bold text-gray-900">网站导航</h1>
				<p className="text-gray-600">发现优质网站，提升工作效率</p>
			</div>

			{/* 搜索区域 */}
			<div className="mx-auto max-w-2xl">
				<Suspense
					fallback={
						<div className="h-12 animate-pulse rounded-lg bg-gray-100" />
					}
				>
					<WebsiteSearch />
				</Suspense>
			</div>

			{/* 热门网站 */}
			<section>
				<h2 className="mb-4 text-xl font-semibold text-gray-900">热门网站</h2>
				<Suspense
					fallback={
						<div className="h-32 animate-pulse rounded-lg bg-gray-100" />
					}
				>
					<PopularWebsites />
				</Suspense>
			</section>

			{/* 最新网站 */}
			<section>
				<h2 className="mb-4 text-xl font-semibold text-gray-900">最新收录</h2>
				<Suspense
					fallback={
						<div className="h-32 animate-pulse rounded-lg bg-gray-100" />
					}
				>
					<RecentWebsites />
				</Suspense>
			</section>

			{/* 网站分类 */}
			<section>
				<h2 className="mb-4 text-xl font-semibold text-gray-900">网站分类</h2>
				<Suspense
					fallback={
						<div className="h-48 animate-pulse rounded-lg bg-gray-100" />
					}
				>
					<WebsiteCategories />
				</Suspense>
			</section>

			{/* 所有网站 */}
			<section>
				<h2 className="mb-4 text-xl font-semibold text-gray-900">所有网站</h2>
				<Suspense
					fallback={
						<div className="h-96 animate-pulse rounded-lg bg-gray-100" />
					}
				>
					<WebsiteList />
				</Suspense>
			</section>
		</div>
	);
}
