import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import type { WebsiteCategoryWithDetails } from '@/types/website';

import { CategoryWebsiteList } from './_components/category-website-list';
import { SubCategorySection } from './_components/sub-category-section';

interface CategoryPageProps {
	params: Promise<{
		slug: string;
	}>;
}

// 生成动态metadata
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
	try {
		const { slug } = await params;
		const category = await getCategoryBySlug(slug);

		if (!category) {
			return {
				title: '分类未找到',
				description: '您访问的分类不存在或已被删除。'
			};
		}

		const title = `${category.name} - 网站分类`;
		const description = category.description || `${category.name}分类下的优质网站推荐，发现更多实用工具和资源。`;

		return {
			title,
			description,
			keywords: `${category.name},网站分类,网站导航,${category.name}工具,${category.name}资源`,
			openGraph: {
				title,
				description,
				type: 'website',
			},
			twitter: {
				card: 'summary_large_image',
				title,
				description,
			},
		};
	} catch (error) {
		console.error('生成metadata失败:', error);
		return {
			title: '网站分类',
			description: '浏览网站分类，发现优质网站资源。'
		};
	}
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
	const { slug } = await params;
	const category = await getCategoryBySlug(slug);

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
			<div className="mb-6 flex items-center gap-4 md:hidden">
				<Link
					className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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
								<SubCategorySection
									category={subCategory}
									gridCols={5}
									maxItems={20}
								/>
							</div>
						))}
					</div>
				) : (
					/* 二级分类或无子分类的一级分类：展示当前分类的网站 */
					<CategoryWebsiteList categoryId={category.id} />
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
