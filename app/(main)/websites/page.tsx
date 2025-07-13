import { Metadata } from 'next';
import NSFWToggle from '@/components/nsfw-toggle';

import { PopularWebsites } from './_components/popular-websites';
import { RecentWebsites } from './_components/recent-websites';
import { WebsiteCategories } from './_components/website-categories';
import { WebsiteList } from './_components/website-list';
import { WebsiteSearch } from './_components/website-search';

export const metadata: Metadata = {
	title: '网站导航 - 发现优质网站资源',
	description: '精选优质网站导航，涵盖工具、设计、开发、学习等多个分类，帮助您快速找到所需的网站资源，提升工作和学习效率。',
	keywords: '网站导航,网站收录,优质网站,工具网站,设计资源,开发工具,学习资源',
	openGraph: {
		title: '网站导航 - 发现优质网站资源',
		description: '精选优质网站导航，涵盖工具、设计、开发、学习等多个分类，帮助您快速找到所需的网站资源。',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: '网站导航 - 发现优质网站资源',
		description: '精选优质网站导航，涵盖工具、设计、开发、学习等多个分类，帮助您快速找到所需的网站资源。',
	},
};

export default function WebsitesPage() {
	return (
		<div className="space-y-8 py-6">
			{/* 页面标题和设置 */}
			<div className="text-center">
				<div className="mb-4 flex items-center justify-between">
					<div></div>
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">网站导航</h1>
						<p className="mt-2 text-gray-700 dark:text-gray-300">发现优质网站，提升工作效率</p>
					</div>
					<div className="flex items-center">
						<NSFWToggle />
					</div>
				</div>
			</div>

			{/* 搜索区域 */}
			<div className="mx-auto max-w-2xl">
				<WebsiteSearch />
			</div>

			{/* 热门网站 */}
			<section>
				<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">热门网站</h2>
				<PopularWebsites />
			</section>

			{/* 最新网站 */}
			<section>
				<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">最新收录</h2>
				<RecentWebsites />
			</section>

			{/* 网站分类 */}
			<section>
				<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">网站分类</h2>
				<WebsiteCategories />
			</section>

			{/* 所有网站 */}
			<section>
				<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">所有网站</h2>
				<WebsiteList />
			</section>
		</div>
	);
}
