import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import type { WebsiteCategoryWithDetails } from '@/types/website';

import { CategoryWebsiteList } from './_components/category-website-list';
import { SubCategorySection } from './_components/sub-category-section';

interface CategoryPageProps {
	params: {
		slug: string;
	};
}

async function getCategoryBySlug(
	slug: string
): Promise<WebsiteCategoryWithDetails | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/website/categories/${slug}`,
			{
				cache: 'no-store'
			}
		);

		if (!response.ok) {
			return null;
		}

		const category = await response.json();

		return category;
	} catch (error) {
		console.error('获取分类失败:', error);

		return null;
	}
}

async function getSubCategories(
	parentId: string
): Promise<WebsiteCategoryWithDetails[]> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/website/categories?parentId=${parentId}&isVisible=true&limit=100`,
			{
				cache: 'no-store'
			}
		);

		if (!response.ok) {
			return [];
		}

		const data = await response.json();

		return data.categories || [];
	} catch (error) {
		console.error('获取子分类失败:', error);

		return [];
	}
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const category = await getCategoryBySlug(params.slug);

	if (!category) {
		notFound();
	}

	// 如果是一级分类，获取子分类
	const subCategories =
		category.level === 0 ? await getSubCategories(category.id) : [];
	const isParentCategory = category.level === 0 && subCategories.length > 0;

	return (
		<div className="space-y-8 py-6">
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

			{/* 内容区域 */}
			<div>
				{isParentCategory ? (
					/* 一级分类：展示所有子分类的内容 */
					<div className="space-y-12">
						{subCategories.map((subCategory) => (
							<div
								key={subCategory.id}
								className="scroll-mt-20"
								id={`category-${subCategory.slug}`}
							>
								<Suspense
									fallback={
										<div className="space-y-4">
											<div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
											<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
												{Array.from({ length: 20 }).map((_, i) => (
													<div
														key={i}
														className="h-32 animate-pulse rounded-lg bg-gray-200"
													></div>
												))}
											</div>
										</div>
									}
								>
									<SubCategorySection
										category={subCategory}
										gridCols={5}
										maxItems={20}
									/>
								</Suspense>
							</div>
						))}
					</div>
				) : (
					/* 二级分类或无子分类的一级分类：展示当前分类的网站 */
					<Suspense
						fallback={
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{Array.from({ length: 6 }).map((_, i) => (
									<div
										key={i}
										className="h-48 animate-pulse rounded-lg bg-gray-200"
									></div>
								))}
							</div>
						}
					>
						<CategoryWebsiteList categoryId={category.id} />
					</Suspense>
				)}
			</div>
		</div>
	);
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/website/categories?isVisible=true&limit=100`
		);

		if (!response.ok) {
			return [];
		}

		const data = await response.json();
		const categories = data.categories || [];

		return categories.map((category: WebsiteCategoryWithDetails) => ({
			slug: category.slug
		}));
	} catch (error) {
		console.error('生成静态参数失败:', error);

		return [];
	}
}
