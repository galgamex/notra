'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

import NotraSidebarButton from '@/components/notra/notra-sidebar-button';

export type NotraBackButtonProps = PropsWithChildren;

export default function NotraBackButton({ children }: NotraBackButtonProps) {
	const router = useRouter();

	const handleClick = () => {
		router.back();
	};

	return (
		<NotraSidebarButton onClick={handleClick}>{children}</NotraSidebarButton>
	);
}
