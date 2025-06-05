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
}: Readonly<NotraLogoProps>) {
	const isDark = useIsDark();

	return (
		<Image
			alt={`${title} Logo`}
			height={size}
			src={isDark ? darkLogo : logo}
			width={size}
		/>
	);
}
