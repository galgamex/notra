'use client';

import Link from 'next/link';
import { MouseEventHandler, PropsWithChildren } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useNotraSidebar } from '@/stores/use-notra-sidebar';

export interface NotraSidebarButtonProps extends PropsWithChildren {
	href?: string;
	className?: string;
	isActive?: boolean;
	onClick?: () => void;
}

export default function NotraSidebarButton({
	children,
	href = '#',
	className,
	isActive,
	onClick
}: Readonly<NotraSidebarButtonProps>) {
	const isMobile = useIsMobile();
	const toggleSidebar = useNotraSidebar((state) => state.toggleMobileOpen);

	const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		if (isMobile) {
			toggleSidebar();
		}

		if (onClick) {
			e.preventDefault();
			onClick();
		}
	};

	return (
		<Link
			className={cn(
				'h-8 w-full rounded-sm text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200 flex items-center gap-2 px-2',
				className,
				isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
			)}
			href={href}
			onClick={handleClick}
		>
			{children}
		</Link>
	);
}
