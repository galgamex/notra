'use client';

import { PanelLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useNotraSidebar } from '@/hooks/use-notra-sidebar';
import { cn } from '@/lib/utils';

export interface NotraSidebarTriggerProps {
	className?: string;
}

export default function NotraSidebarTrigger({
	className
}: NotraSidebarTriggerProps) {
	const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

	const handleClick = () => {
		toggleMobileOpen();
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className={cn('h-7 w-7', className)}
			onClick={handleClick}
		>
			<PanelLeftIcon />
			<span className="sr-only">Toggle Sidebar</span>
		</Button>
	);
}
