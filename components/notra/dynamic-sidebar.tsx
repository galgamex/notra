'use client';

import { Home, BookOpen, Globe, Plus, ArrowLeft, Folder } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import type { WebsiteCategoryWithDetails } from '@/types/website';

import { setSidebarToggleCallback } from './notra-header';

interface SidebarItem {
	title: string;
	href: string;
	icon: React.ReactNode;
}

const defaultSidebarItems: SidebarItem[] = [
	{
		title: '首页',
		href: '/',
		icon: <Home className="h-5 w-5" />
	},
	{
		title: '文章列表',
		href: '/blog',
		icon: <BookOpen className="h-5 w-5" />
	},
	{
		title: '网站导航',
		href: '/websites',
		icon: <Globe className="h-5 w-5" />
	}
];

export default function DynamicSidebar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [currentCategory, setCurrentCategory] =
		useState<WebsiteCategoryWithDetails | null>(null);
	const [subCategories, setSubCategories] = useState<
		WebsiteCategoryWithDetails[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	useEffect(() => {
		// 注册切换回调函数
		setSidebarToggleCallback(() => {
			setIsOpen((prev) => !prev);
		});
	}, []);

	useEffect(() => {
		// 检查是否在分类详情页
		const categoryMatch = pathname.match(/^\/websites\/category\/([^/]+)$/);

		// 开始过渡动画
		setIsTransitioning(true);

		// 延迟执行内容更新，让淡出动画先执行
		const timer = setTimeout(() => {
			if (categoryMatch) {
				const slug = categoryMatch[1];

				fetchCategoryAndSubCategories(slug);
			} else {
				setCurrentCategory(null);
				setSubCategories([]);
			}

			// 内容更新后，结束过渡动画
			setTimeout(() => {
				setIsTransitioning(false);
			}, 50);
		}, 150);

		return () => clearTimeout(timer);
	}, [pathname]);

	const fetchCategoryAndSubCategories = async (slug: string) => {
		setLoading(true);

		try {
			// 获取当前分类信息
			const categoryResponse = await fetch(`/api/website/categories/${slug}`);

			if (categoryResponse.ok) {
				const category = await categoryResponse.json();

				setCurrentCategory(category);

				// 如果是一级分类，获取其子分类
				if (category.level === 0) {
					const subCategoriesResponse = await fetch(
						`/api/website/categories?parentId=${category.id}&isVisible=true&limit=100`
					);

					if (subCategoriesResponse.ok) {
						const subCategoriesData = await subCategoriesResponse.json();

						setSubCategories(subCategoriesData.categories || []);
					}
				} else {
					setSubCategories([]);
				}
			}
		} catch (error) {
			console.error('获取分类信息失败:', error);
		} finally {
			setLoading(false);
		}
	};

	const closeSidebar = () => {
		setIsOpen(false);
	};

	// 判断是否在分类详情页且有子分类
	const showSubCategories =
		currentCategory && currentCategory.level === 0 && subCategories.length > 0;

	return (
		<>
			{/* 侧边栏 */}
			<aside
				className={`
        fixed top-nav-height left-0 z-30 h-[calc(100vh-56px)] w-64 
        transform border-r border-gray-200 bg-white
        shadow-sm transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
			>
				<nav className="flex h-full flex-col p-4">
					<div
						className={`transition-opacity duration-200 ease-in-out ${
							isTransitioning ? 'opacity-0' : 'opacity-100'
						}`}
					>
						{showSubCategories ? (
							// 显示分类详情页的子分类菜单
							<>
								{/* 返回按钮 */}
								<div className="mb-4">
									<Link
										className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
										href="/websites"
										onClick={closeSidebar}
									>
										<ArrowLeft className="h-4 w-4" />
										<span>返回网站导航</span>
									</Link>
								</div>

								{/* 当前分类信息 */}
								<div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
									<div className="flex items-center gap-3">
										{currentCategory.icon ? (
											<div
												className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white"
												style={{
													backgroundColor: currentCategory.color || '#6b7280'
												}}
											>
												<span>{currentCategory.icon}</span>
											</div>
										) : (
											<div
												className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
												style={{
													backgroundColor: currentCategory.color || '#6b7280'
												}}
											>
												<Folder className="h-4 w-4" />
											</div>
										)}
										<div>
											<h3 className="font-medium text-gray-900">
												{currentCategory.name}
											</h3>
											<p className="text-xs text-gray-600">分类详情</p>
										</div>
									</div>
								</div>

								{/* 子分类列表 */}
								<div className="mb-4">
									<h4 className="mb-2 px-3 text-sm font-medium text-gray-500">
										分类导航
									</h4>
									<ul className="space-y-1">
										{loading ? (
											<li className="px-3 py-2 text-sm text-gray-500">
												加载中...
											</li>
										) : (
											subCategories.map((subCategory) => {
												const handleCategoryClick = (e: React.MouseEvent) => {
													e.preventDefault();
													const element = document.getElementById(
														`category-${subCategory.slug}`
													);

													if (element) {
														element.scrollIntoView({
															behavior: 'smooth',
															block: 'start'
														});
													}

													closeSidebar();
												};

												return (
													<li key={subCategory.id}>
														<a
															className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
															href={`#category-${subCategory.slug}`}
															onClick={handleCategoryClick}
														>
															{subCategory.icon ? (
																<div
																	className="flex h-5 w-5 items-center justify-center rounded text-xs text-white"
																	style={{
																		backgroundColor:
																			subCategory.color || '#6b7280'
																	}}
																>
																	<span>{subCategory.icon}</span>
																</div>
															) : (
																<Folder className="h-5 w-5 text-gray-400" />
															)}
															<span>{subCategory.name}</span>
															<span className="ml-auto text-xs text-gray-500">
																({subCategory._count.websites})
															</span>
														</a>
													</li>
												);
											})
										)}
									</ul>
								</div>
							</>
						) : (
							// 显示默认导航菜单
							<ul className="space-y-2">
								{defaultSidebarItems.map((item) => {
									const isActive =
										pathname === item.href ||
										(item.href === '/blog' && pathname.startsWith('/blog')) ||
										(item.href === '/websites' &&
											pathname.startsWith('/websites'));

									return (
										<li key={item.href}>
											<Link
												className={`
                        flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                        transition-colors duration-200
                        ${
													isActive
														? 'border-l-4 border-blue-700 bg-blue-50 text-blue-700'
														: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
												}
                      `}
												href={item.href}
												onClick={closeSidebar}
											>
												{item.icon}
												<span>{item.title}</span>
											</Link>
										</li>
									);
								})}
							</ul>
						)}
					</div>

					{/* 底部申请收录按钮 */}
					<div className="mt-auto border-t border-gray-200 pt-4">
						<Link
							className={`
                flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm
                font-medium transition-colors duration-200
                ${
									pathname === '/websites/submit'
										? 'border-l-4 border-green-700 bg-green-50 text-green-700'
										: 'border border-green-200 text-green-700 hover:border-green-300 hover:bg-green-50 hover:text-green-800'
								}
              `}
							href="/websites/submit"
							onClick={closeSidebar}
						>
							<Plus className="h-5 w-5" />
							<span>申请收录网址</span>
						</Link>
					</div>
				</nav>
			</aside>

			{/* 移动端遮罩层 */}
			{isOpen && (
				<div
					className="fixed inset-0 z-20 bg-black/50 md:hidden"
					onClick={closeSidebar}
				/>
			)}
		</>
	);
}
