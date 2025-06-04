'use client';

import { MouseEventHandler, PropsWithChildren, useRef } from 'react';

import { cn } from '@/lib/utils';
import { useNotraSidebar } from '@/stores/use-notra-sidebar';

export interface NotraSidebarProps extends PropsWithChildren {
	resizeable?: boolean;
	className?: string;
}

export default function NotraSidebar({
	children,
	resizeable = false,
	className
}: Readonly<NotraSidebarProps>) {
	const sidebarRef = useRef<HTMLElement>(null);
	const bodyCursor = useRef('');
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const setIsResizing = useNotraSidebar((state) => state.setIsResizing);

	const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.stopPropagation();
		e.preventDefault();

		setIsResizing(true);
		sidebarRef.current?.setAttribute('data-resizing', 'true');

		bodyCursor.current = document.body.style.cursor;
		document.body.style.cursor = 'col-resize';

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (event: MouseEvent) => {
		let newWidth = event.clientX;

		if (newWidth < 256) newWidth = 256;

		if (newWidth > 480) newWidth = 480;

		document.documentElement.style.setProperty(
			'--sidebar-width',
			`${newWidth}px`
		);
	};

	const handleMouseUp = () => {
		setIsResizing(false);
		sidebarRef.current?.removeAttribute('data-resizing');

		document.body.style.cursor = bodyCursor.current;

		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	};

	return (
		<aside
			ref={sidebarRef}
			className={cn(
				'group/sidebar bg-background fixed top-0 left-0 bottom-0 z-50 w-80 md:w-(--sidebar-width,256px) overscroll-contain transition-[translate,opacity] ease-[ease] duration-250 translate-x-[-100%] opacity-0 md:translate-x-0 md:opacity-100',
				mobileOpen &&
					'translate-x-0 opacity-100 md:translate-x-[-100%] md:opacity-0',
				className
			)}
		>
			<button
				className={cn(
					'invisible md:visible absolute h-full w-1.5 -right-1.5 top-0 after:transition-colors after:absolute after:top-0 after:bottom-0 after:right-1.5 after:w-px after:bg-border-light group-data-[resizing=true]/sidebar:after:bg-border',
					resizeable && 'md:cursor-col-resize md:hover:after:bg-border'
				)}
				onMouseDown={resizeable ? handleMouseDown : void 0}
			/>
			<nav className="flex size-full flex-col">{children}</nav>
		</aside>
	);
}
