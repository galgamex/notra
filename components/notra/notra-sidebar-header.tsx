import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export interface NotraSidebarHeaderProps extends PropsWithChildren {
	className?: string;
}

export default function NotraSidebarHeader({
	children,
	className
}: NotraSidebarHeaderProps) {
	return (
		<div className={cn('h-14 flex items-center px-4 md:px-2.5', className)}>
			{children}
		</div>
	);
}
