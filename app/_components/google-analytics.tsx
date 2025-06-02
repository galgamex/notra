import { GoogleAnalytics as _GoogleAnalytics } from '@next/third-parties/google';

import SiteSettingsService from '@/services/site-settings';

const GoogleAnalytics = async () => {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		process.env.NODE_ENV === 'production' &&
		siteSettings?.googleAnalyticsId && (
			<_GoogleAnalytics gaId={siteSettings.googleAnalyticsId} />
		)
	);
};

export default GoogleAnalytics;
