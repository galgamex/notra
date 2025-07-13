'use client';

import Image from 'next/image';

import { useIsDark } from '@/hooks/use-is-dark';
import { useMounted } from '@/hooks/use-mounted';

export interface LogoClientProps {
	size: number;
	logo: string;
	darkLogo: string;
	title: string;
}

export default function LogoClient({
	size,
	logo,
	darkLogo,
	title
}: Readonly<LogoClientProps>) {
	const isDark = useIsDark();
	const mounted = useMounted();

	// 在组件挂载前使用默认 logo 避免水合不匹配
	const logoSrc = mounted ? (isDark ? darkLogo : logo) : logo;

	return (
		<Image
			alt={`${title} Logo`}
			height={size}
			src={logoSrc}
			width={size}
		/>
	);
}
