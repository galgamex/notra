import './globals.css';

import { Inter } from 'next/font/google';

import GoogleAnalytics from '@/app/_components/google-analytics';
import { Toaster } from '@/components/ui/sonner';
import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';
import { ENV_LOCALE } from '@/constants/env';
import SiteSettingsService from '@/services/site-settings';

import Providers from './providers';

import type { Metadata } from 'next';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter'
});

export const generateMetadata = async (): Promise<Metadata> => {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return {
		title: siteSettings?.title ?? DEFAULT_SITE_TITLE,
		description: siteSettings?.description,
		keywords: siteSettings?.keywords,
		icons: {
			icon: [
				{
					media: '(prefers-color-scheme: light)',
					url: siteSettings?.logo ?? siteSettings?.darkLogo ?? DEFAULT_SITE_LOGO
				},
				{
					media: '(prefers-color-scheme: dark)',
					url:
						siteSettings?.darkLogo ??
						siteSettings?.logo ??
						DEFAULT_SITE_LOGO_DARK
				}
			]
		}
	};
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang={ENV_LOCALE}>
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
