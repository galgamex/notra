'use client';

import { cn } from '@/lib/utils';

import { useNotraSidebar } from './notra-sidebar';

export default function NotraBackdrop() {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

	const handleClick = () => {
		toggleMobileOpen();
	};

	return (
		<button
			className={cn(
				'fixed inset-0 z-20 bg-black/20 transition-[visibility,opacity] ease-[ease] duration-250 opacity-0 invisible',
				mobileOpen && 'opacity-100 visible md:opacity-0 md:invisible'
			)}
			onClick={handleClick}
		></button>
	);
}
