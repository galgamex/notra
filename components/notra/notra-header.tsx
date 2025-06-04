'use client';

import { cn } from '@/lib/utils';
import { useNotraSidebar } from '@/stores/use-notra-sidebar';

import NotraSidebarTrigger from './notra-sidebar-trigger';

export interface NotraHeaderProps {
	leftActions?: React.ReactNode;
	rightActions?: React.ReactNode;
}

export default function NotraHeader({
	leftActions,
	rightActions
}: Readonly<NotraHeaderProps>) {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const isResizing = useNotraSidebar((state) => state.isResizing);

	return (
		<header
			className={cn(
				'h-14 border-b border-border-light px-4 fixed top-0 right-0 left-0 z-20 bg-background text-foreground md:left-(--sidebar-width,256px)',
				mobileOpen && 'md:left-0',
				!isResizing && 'transition-[left] ease-[ease] duration-250'
			)}
		>
			<div className="flex size-full justify-between">
				<div className="flex items-center gap-2">
					<NotraSidebarTrigger className="-ml-1" />
					{leftActions}
				</div>

				<div className="flex items-center gap-2">{rightActions}</div>
			</div>
		</header>
	);
}
