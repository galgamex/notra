'use client';

<<<<<<< HEAD
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Menu, X } from 'lucide-react';
import { create } from 'zustand';
import { Button } from '@/components/ui/button';

// 侧边栏状态管理
interface NotraSidebarState {
  mobileOpen: boolean;
  isResizing: boolean;
  toggleMobileOpen: () => void;
  setMobileOpen: (open: boolean) => void;
  setIsResizing: (resizing: boolean) => void;
}

export const useNotraSidebar = create<NotraSidebarState>((set) => ({
  mobileOpen: false,
  isResizing: false,
  toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
  setMobileOpen: (open) => set({ mobileOpen: open }),
  setIsResizing: (resizing) => set({ isResizing: resizing }),
}));

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    title: '首页',
    href: '/',
    icon: <Home className="w-5 h-5" />
  },
  {
    title: '文章列表',
    href: '/blog',
    icon: <BookOpen className="w-5 h-5" />
  }
];

export default function NotraSidebar() {
  const pathname = usePathname();
  const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
  const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

  return (
    <>
      {/* 移动端菜单按钮 */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-20 left-4 z-40 bg-white shadow-md"
        onClick={toggleMobileOpen}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* 侧边栏 */}
      <aside className={`
        fixed top-nav-height left-0 z-30 h-[calc(100vh-var(--nav-height))] w-64 
        transform transition-transform duration-300 ease-in-out
        bg-white border-r border-gray-200 shadow-sm
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href === '/blog' && pathname.startsWith('/blog'));
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => useNotraSidebar.getState().setMobileOpen(false)} // 移动端点击后关闭菜单
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

      {/* 移动端遮罩层 */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleMobileOpen}
        />
      )}
    </>
  );
=======
import { MouseEventHandler, PropsWithChildren, useRef } from 'react';
import { create } from 'zustand';

import { cn } from '@/lib/utils';

type NotraSidebarStore = {
	mobileOpen: boolean;
	toggleMobileOpen: () => void;
	isResizing: boolean;
	setIsResizing: (isResizing: boolean) => void;
};

export const useNotraSidebar = create<NotraSidebarStore>((set) => ({
	mobileOpen: false,
	toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
	isResizing: false,
	setIsResizing: (isResizing) => set({ isResizing })
}));

export interface NotraSidebarProps extends PropsWithChildren {
	resizeable?: boolean;
	className?: string;
}

export default function NotraSidebar({
	children,
	resizeable = false,
	className
}: Readonly<NotraSidebarProps>) {
	const sidebarRef = useRef<HTMLElement>(null);
	const bodyCursor = useRef('');
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const setIsResizing = useNotraSidebar((state) => state.setIsResizing);

	const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.stopPropagation();
		e.preventDefault();

		setIsResizing(true);
		sidebarRef.current?.setAttribute('data-resizing', 'true');

		bodyCursor.current = document.body.style.cursor;
		document.body.style.cursor = 'col-resize';

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (event: MouseEvent) => {
		let newWidth = event.clientX;

		if (newWidth < 256) newWidth = 256;

		if (newWidth > 480) newWidth = 480;

		document.documentElement.style.setProperty(
			'--sidebar-width',
			`${newWidth}px`
		);
	};

	const handleMouseUp = () => {
		setIsResizing(false);
		sidebarRef.current?.removeAttribute('data-resizing');

		document.body.style.cursor = bodyCursor.current;

		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	};

	return (
		<aside
			ref={sidebarRef}
			className={cn(
				'group/sidebar bg-background fixed top-0 left-0 bottom-0 z-50 w-80 md:w-(--sidebar-width,256px) overscroll-contain transition-[translate,opacity] ease-[ease] duration-250 translate-x-[-100%] opacity-0 md:translate-x-0 md:opacity-100',
				mobileOpen &&
					'translate-x-0 opacity-100 md:translate-x-[-100%] md:opacity-0',
				className
			)}
		>
			<button
				className={cn(
					'invisible md:visible absolute h-full w-1.5 -right-1.5 top-0 after:transition-colors after:absolute after:top-0 after:bottom-0 after:right-1.5 after:w-px after:bg-border-light group-data-[resizing=true]/sidebar:after:bg-border',
					resizeable && 'md:cursor-col-resize md:hover:after:bg-border'
				)}
				onMouseDown={resizeable ? handleMouseDown : void 0}
			/>
			<nav className="flex size-full flex-col">{children}</nav>
		</aside>
	);
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
}
