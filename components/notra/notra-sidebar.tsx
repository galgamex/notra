'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { create } from 'zustand';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface NotraSidebarProps {
  children?: React.ReactNode;
  resizeable?: boolean;
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
  setResizing: (resizing: boolean) => set({ isResizing: resizing }),
}));

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

export default function NotraSidebar({ children, resizeable = false, className = '' }: NotraSidebarProps) {
  const pathname = usePathname();
  const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
  const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

  // 如果有children，渲染自定义内容，否则渲染默认导航
  if (children) {
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
          border-r border-gray-200 shadow-sm
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${className}
        `}>
          {children}
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
  }

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
        ${className}
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

      {/* 移动端遮罩层 */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleMobileOpen}
        />
      )}
    </>
  );
}
