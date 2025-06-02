'use client';

import Image from 'next/image';

import { useIsDark } from '@/hooks/use-is-dark';

export interface NotraLogoProps {
	size: number;
	logo: string;
	darkLogo: string;
	title: string;
}

export default function NotraLogo({
	size,
	logo,
	darkLogo,
	title
}: NotraLogoProps) {
	const isDark = useIsDark();

	return (
		<Image
			src={isDark ? darkLogo : logo}
			alt={`${title} Logo`}
			width={size}
			height={size}
		/>
	);
}
