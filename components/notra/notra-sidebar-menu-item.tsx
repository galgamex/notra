import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export interface NotraSidebarMenuItemProps extends PropsWithChildren {
	className?: string;
}

export default function NotraSidebarMenuItem({
	children,
	className
}: NotraSidebarMenuItemProps) {
	return (
		<li className={cn('group/menu-item relative my-0.5', className)}>
			{children}
		</li>
	);
}
