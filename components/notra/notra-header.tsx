'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { DEFAULT_SITE_TITLE, DEFAULT_SITE_LOGO, DEFAULT_SITE_LOGO_DARK } from '@/constants/default';
import { Button } from '@/components/ui/button';

import LogoClient from '../logo-client';
import NavbarAuth from '../navbar-auth';

// 创建一个全局状态来管理侧边栏
let sidebarToggleCallback: (() => void) | null = null;

export function setSidebarToggleCallback(callback: () => void) {
  sidebarToggleCallback = callback;
}

interface NotraHeaderProps {
  siteSettings: {
    title: string | null;
    description: string | null;
    logo: string | null;
    darkLogo: string | null;
    copyright: string | null;
    googleAnalyticsId: string | null;
  } | null;
}

export default function NotraHeader({ siteSettings }: NotraHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (sidebarToggleCallback) {
      sidebarToggleCallback();
    }
  };

  return (
    <header className="z-30 w-full bg-white border-b border-gray-200">
      <div className="h-14 w-full px-4 md:px-8">
        <div className="mx-auto flex h-full max-w-[1376px] justify-between items-center font-semibold">
          <div className="flex items-center gap-2">
            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            
            {/* Logo和标题 - 在移动端隐藏Logo */}
            <Link className="flex h-full items-center gap-2" href="/">
              <div className="hidden md:block">
                <LogoClient
                  size={24}
                  logo={siteSettings?.logo ?? siteSettings?.darkLogo ?? DEFAULT_SITE_LOGO}
                  darkLogo={siteSettings?.darkLogo ?? siteSettings?.logo ?? DEFAULT_SITE_LOGO_DARK}
                  title={siteSettings?.title ?? DEFAULT_SITE_TITLE}
                />
              </div>
              <span>{siteSettings?.title ?? DEFAULT_SITE_TITLE}</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <NavbarAuth />
          </div>
        </div>
      </div>
    </header>
  );
}
