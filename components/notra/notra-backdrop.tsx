'use client';

import { cn } from '@/lib/utils';
import { useNotraSidebar } from '@/stores/use-notra-sidebar';

export default function NotraBackdrop() {
	const mobileOpen = useNotraSidebar((state) => state.mobileOpen);
	const toggleMobileOpen = useNotraSidebar((state) => state.toggleMobileOpen);

	const handleClick = () => {
		toggleMobileOpen();
	};

	return (
		<div
			className={cn(
				'fixed top-0 left-0 right-0 bottom-0 z-40 bg-black/45 transition-[visibility,opacity] ease-[ease] duration-250 opacity-0 invisible',
				mobileOpen && 'opacity-100 visible md:opacity-0 md:invisible'
			)}
			onClick={handleClick}
		></div>
	);
}
