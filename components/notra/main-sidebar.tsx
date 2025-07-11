'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen } from 'lucide-react';
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
    icon: <Home className="w-5 h-5" />
  },
  {
    title: '文章列表',
    href: '/blog',
    icon: <BookOpen className="w-5 h-5" />
  }
];

export default function MainSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 注册切换回调函数
    setSidebarToggleCallback(() => {
      setIsOpen(prev => !prev);
    });
  }, []);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 侧边栏 */}
      <aside className={`
        fixed top-nav-height left-0 z-30 h-[calc(100vh-56px)] w-64 
        transform transition-transform duration-300 ease-in-out
        bg-white border-r border-gray-200 shadow-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
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
                    onClick={closeSidebar} // 移动端点击后关闭菜单
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
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}