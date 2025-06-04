import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export interface NotraSidebarMenuProps extends PropsWithChildren {
	className?: string;
}

export default function NotraSidebarMenu({
	children,
	className
}: Readonly<NotraSidebarMenuProps>) {
	return <ul className={cn('space-y-0.5', className)}>{children}</ul>;
}
