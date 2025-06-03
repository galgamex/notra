'use client';

import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';
import { useNotraSidebar } from '@/stores/use-notra-sidebar';

export type NotraInsetProps = PropsWithChildren;

export default function NotraInset({ children }: NotraInsetProps) {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const isResizing = useNotraSidebar((state) => state.isResizing);

	return (
		<div
			className={cn(
				'md:pl-(--sidebar-width,256px) pt-14 size-full',
				mobileOpen && 'md:pl-0',
				!isResizing && 'transition-[padding-left] ease-[ease] duration-250'
			)}
		>
			{children}
		</div>
	);
}
