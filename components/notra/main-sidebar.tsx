'use client';

import { Home, BookOpen, Globe, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { setSidebarToggleCallback } from './notra-header';

interface SidebarItem {
	title: string;
	href: string;
	icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
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

export default function MainSidebar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		// 注册切换回调函数
		setSidebarToggleCallback(() => {
			setIsOpen((prev) => !prev);
		});
	}, []);

	const closeSidebar = () => {
		setIsOpen(false);
	};

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
					<ul className="space-y-2">
						{sidebarItems.map((item) => {
							const isActive =
								pathname === item.href ||
								(item.href === '/blog' && pathname.startsWith('/blog')) ||
								(item.href === '/websites' && pathname.startsWith('/websites'));

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
										onClick={closeSidebar} // 移动端点击后关闭菜单
									>
										{item.icon}
										<span>{item.title}</span>
									</Link>
								</li>
							);
						})}
					</ul>

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
