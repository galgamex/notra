import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';
import SiteSettingsService from '@/services/site-settings';

import LogoClient from './logo-client';

export interface LogoProps {
	size: number;
}

export default async function Logo({ size }: Readonly<LogoProps>) {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<LogoClient
			darkLogo={
				siteSettings?.darkLogo ?? siteSettings?.logo ?? DEFAULT_SITE_LOGO_DARK
			}
			logo={siteSettings?.logo ?? siteSettings?.darkLogo ?? DEFAULT_SITE_LOGO}
			size={size}
			title={siteSettings?.title ?? DEFAULT_SITE_TITLE}
		/>
	);
}
