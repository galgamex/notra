import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { WebsiteService } from '@/services/website';

import { RelatedWebsites } from './_components/related-websites';
import { WebsiteDetail } from './_components/website-detail';

interface WebsitePageProps {
	params: {
		id: string;
	};
}

export default async function WebsitePage({ params }: WebsitePageProps) {
	try {
		const website = await WebsiteService.getWebsiteById(params.id);

		if (!website || website.status !== 'APPROVED') {
			notFound();
		}

		return (
			<div className="py-6">
				{/* 返回按钮 */}
				<div className="mb-6 flex items-center gap-4">
					<Link
						className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
						href="/websites"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>返回网站导航</span>
					</Link>
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* 主要内容 */}
					<div className="lg:col-span-2">
						<Suspense
							fallback={
								<div className="rounded-lg border border-gray-200 bg-white p-6">
									<div className="animate-pulse">
										<div className="mb-6 flex items-start gap-4">
											<div className="h-16 w-16 rounded-lg bg-gray-200"></div>
											<div className="flex-1">
												<div className="mb-2 h-6 rounded bg-gray-200"></div>
												<div className="mb-2 h-4 w-2/3 rounded bg-gray-200"></div>
												<div className="h-4 w-1/2 rounded bg-gray-200"></div>
											</div>
										</div>
										<div className="space-y-3">
											<div className="h-4 rounded bg-gray-200"></div>
											<div className="h-4 rounded bg-gray-200"></div>
											<div className="h-4 w-3/4 rounded bg-gray-200"></div>
										</div>
									</div>
								</div>
							}
						>
							<WebsiteDetail website={website} />
						</Suspense>
					</div>

					{/* 侧边栏 */}
					<div className="lg:col-span-1">
						<Suspense
							fallback={
								<div className="space-y-6">
									<div className="rounded-lg border border-gray-200 bg-white p-4">
										<div className="mb-4 h-5 rounded bg-gray-200"></div>
										<div className="space-y-3">
											{Array.from({ length: 3 }).map((_, i) => (
												<div key={i} className="flex items-center gap-3">
													<div className="h-10 w-10 rounded bg-gray-200"></div>
													<div className="flex-1">
														<div className="mb-1 h-4 rounded bg-gray-200"></div>
														<div className="h-3 w-2/3 rounded bg-gray-200"></div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							}
						>
							<RelatedWebsites
								categoryId={website.categoryId}
								currentWebsiteId={website.id}
							/>
						</Suspense>
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
