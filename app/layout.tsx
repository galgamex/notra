import './globals.css';

import { Inter } from 'next/font/google';

import GoogleAnalytics from '@/app/_components/google-analytics';
import { Toaster } from '@/components/ui/sonner';
import { ENV_LOCALE } from '@/constants/env';
import SiteSettingsService from '@/services/site-settings';

import Providers from './providers';

import type { Metadata } from 'next';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter'
});

export async function generateMetadata(): Promise<Metadata> {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return {
		title: {
			template: `%s | ${siteSettings?.title || 'Notra'}`,
			default: siteSettings?.title || 'Notra'
		},
		description: siteSettings?.description || ''
	};
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang={ENV_LOCALE}>
			<body className={`${inter.variable} font-sans`}>
				<Providers>
					<Toaster richColors position="top-center" />
					{children}
				</Providers>
			</body>
			<GoogleAnalytics />
		</html>
	);
}
