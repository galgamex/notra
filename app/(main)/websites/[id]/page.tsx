import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import WebsiteService from '@/services/website';

import { RelatedWebsites } from './_components/related-websites';
import { WebsiteDetail } from './_components/website-detail';

interface WebsitePageProps {
	params: Promise<{
		id: string;
	}>;
}

// 生成动态metadata
export async function generateMetadata({ params }: WebsitePageProps): Promise<Metadata> {
	try {
		const { id } = await params;
		const website = await WebsiteService.getWebsiteById(id);

		if (!website || website.status !== 'APPROVED') {
			return {
				title: '网站未找到',
				description: '您访问的网站不存在或已被删除。'
			};
		}

		const title = `${website.name} - 网站详情`;
		const description = website.description || `${website.name} - 优质网站推荐，提升您的工作效率。`;

		return {
			title,
			description,
			keywords: `${website.name},网站推荐,${website.category?.name || '工具'},网站导航`,
			openGraph: {
				title,
				description,
				type: 'website',
				url: website.url,
				images: website.logo ? [{
					url: website.logo,
					width: 400,
					height: 400,
					alt: website.name
				}] : undefined,
			},
			twitter: {
				card: 'summary_large_image',
				title,
				description,
				images: website.logo ? [website.logo] : undefined,
			},
		};
	} catch (error) {
		console.error('生成metadata失败:', error);
		return {
			title: '网站详情',
			description: '查看网站详细信息和相关推荐。'
		};
	}
}

export default async function WebsitePage({ params }: WebsitePageProps) {
	try {
		const { id } = await params;
		const website = await WebsiteService.getWebsiteById(id);

		if (!website || website.status !== 'APPROVED') {
			notFound();
		}

		return (
			<div className="py-6">
				{/* 返回按钮 */}
				<div className="mb-6 flex items-center gap-4 md:hidden">
					<Link
						className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
						href="/websites"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>返回网站导航</span>
					</Link>
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* 主要内容 */}
					<div className="lg:col-span-2">
						<WebsiteDetail website={website} />
					</div>

					{/* 侧边栏 */}
					<div className="lg:col-span-1">
						<RelatedWebsites
							categoryId={website.categoryId}
							currentWebsiteId={website.id}
						/>
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error('获取网站详情失败:', error);
		notFound();
	}
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
	try {
		const { websites } = await WebsiteService.getWebsites({
			status: 'APPROVED',
			limit: 100
		});

		return websites.map((website) => ({
			id: website.id
		}));
	} catch (error) {
		console.error('生成静态参数失败:', error);

		return [];
	}
}
