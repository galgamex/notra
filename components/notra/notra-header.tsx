'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	DEFAULT_SITE_TITLE,
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK
} from '@/constants/default';

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
		<header className="z-30 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-background">
			<div className="h-14 w-full px-4 md:px-8">
				<div className="flex h-full  items-center justify-between font-semibold">
					<div className="flex items-center gap-2">
						{/* 移动端菜单按钮 */}
						<Button
							className="-ml-2 p-2 md:hidden"
							size="sm"
							variant="ghost"
							onClick={toggleMobileMenu}
						>
							{isMobileMenuOpen ? (
								<X className="h-4 w-4" />
							) : (
								<Menu className="h-4 w-4" />
							)}
						</Button>

						{/* Logo和标题 - 在移动端隐藏Logo */}
						<Link className="flex h-full items-center gap-2" href="/">
							<div className="hidden md:block">
								<LogoClient
									darkLogo={
										siteSettings?.darkLogo ??
										siteSettings?.logo ??
										DEFAULT_SITE_LOGO_DARK
									}
									logo={
										siteSettings?.logo ??
										siteSettings?.darkLogo ??
										DEFAULT_SITE_LOGO
									}
									size={24}
									title={siteSettings?.title ?? DEFAULT_SITE_TITLE}
								/>
							</div>
							<span className="font-semibold text-gray-900 dark:text-gray-100">
								{siteSettings?.title ?? DEFAULT_SITE_TITLE}
							</span>
						</Link>
					</div>

					<div className="ml-auto flex items-center">
						<NavbarAuth />
					</div>
				</div>
			</div>
		</header>
	);
}
