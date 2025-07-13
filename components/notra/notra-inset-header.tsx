'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DEFAULT_SITE_LOGO, DEFAULT_SITE_LOGO_DARK } from '@/constants/default';
import { useIsDark } from '@/hooks/use-is-dark';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';

import { useNotraSidebar } from './notra-sidebar';

function LogoComponent() {
	const isDark = useIsDark();
	const mounted = useMounted();

	return (
		<Link className="hidden items-center gap-2 md:flex" href="/admin">
			<Image
				alt="Logo"
				className="h-8 w-auto"
				height={32}
				src={mounted ? (isDark ? DEFAULT_SITE_LOGO_DARK : DEFAULT_SITE_LOGO) : DEFAULT_SITE_LOGO}
				width={32}
			/>
		</Link>
	);
}

export interface NotraInsetHeaderProps {
	leftActions?: React.ReactNode;
	rightActions?: React.ReactNode;
}

export default function NotraInsetHeader({
	leftActions,
	rightActions
}: Readonly<NotraInsetHeaderProps>) {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);
	const isResizing = useNotraSidebar((state) => state.isResizing);

	return (
		<header
			className={cn(
				'h-14 border-b border-border-light px-4 fixed top-0 right-0 left-0 z-20 bg-background text-foreground',
				!isResizing && 'transition-[left] ease-[ease] duration-250'
			)}
		>
			<div className="flex size-full justify-between">
				<div className="flex items-center gap-2">
					{/* 网站logo */}
					<LogoComponent />
					{/* 移动端菜单按钮 */}
					<Button
						className="h-8 gap-1.5 rounded-md bg-white px-3 shadow-md has-[>svg]:px-2.5 md:hidden"
						size="sm"
						variant="ghost"
						onClick={toggleMobileOpen}
					>
						{mobileOpen ? (
							<X className="h-4 w-4" />
						) : (
							<Menu className="h-4 w-4" />
						)}
					</Button>
					{leftActions}
				</div>

				<div className="flex items-center gap-2">{rightActions}</div>
			</div>
		</header>
	);
}
