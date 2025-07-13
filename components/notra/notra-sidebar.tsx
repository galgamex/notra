'use client';

import { Home, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { create } from 'zustand';

interface SidebarItem {
	title: string;
	href: string;
	icon: React.ReactNode;
}

interface NotraSidebarProps {
	children?: React.ReactNode;
	className?: string;
}

interface SidebarState {
	mobileOpen: boolean;
	isResizing: boolean;
	toggleMobileOpen: () => void;
	setResizing: (resizing: boolean) => void;
}

export const useNotraSidebar = create<SidebarState>((set) => ({
	mobileOpen: false,
	isResizing: false,
	toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
	setResizing: (resizing: boolean) => set({ isResizing: resizing })
}));

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
	}
];

export default function NotraSidebar({
	children,
	className = ''
}: NotraSidebarProps) {
	const pathname = usePathname();
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

	// 如果有children，渲染自定义内容，否则渲染默认导航
	if (children) {
		return (
			<>
				{/* 侧边栏 */}
				<aside
					className={`
          fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-64 
          transform border-r border-gray-200 shadow-sm
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${className}
        `}
				>
					{children}
				</aside>
			</>
		);
	}

	return (
		<>
			{/* 侧边栏 */}
			<aside
				className={`
        fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-64 
        transform border-r border-gray-200 bg-white
        shadow-sm transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${className}
      `}
			>
				<nav className="p-4">
					<ul className="space-y-2">
						{sidebarItems.map((item) => {
							const isActive =
								pathname === item.href ||
								(item.href === '/blog' && pathname.startsWith('/blog'));

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
										onClick={() => toggleMobileOpen()} // 移动端点击后关闭菜单
									>
										{item.icon}
										<span>{item.title}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</aside>
		</>
	);
}
