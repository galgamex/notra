'use client';

import { PanelLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useNotraSidebar } from './notra-sidebar';

export interface NotraSidebarTriggerProps {
	className?: string;
}

export default function NotraSidebarTrigger({
	className
}: Readonly<NotraSidebarTriggerProps>) {
	const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

	const handleClick = () => {
		toggleMobileOpen();
	};

	return (
		<Button
			className={cn('h-7 w-7', className)}
			size="icon"
			variant="ghost"
			onClick={handleClick}
		>
			<PanelLeftIcon />
			<span className="sr-only">Toggle Sidebar</span>
		</Button>
	);
}
