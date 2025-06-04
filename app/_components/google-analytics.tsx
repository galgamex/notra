import { GoogleAnalytics as GoogleAnalyticsComponent } from '@next/third-parties/google';

import SiteSettingsService from '@/services/site-settings';

const GoogleAnalytics = async () => {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		process.env.NODE_ENV === 'production' &&
		siteSettings?.googleAnalyticsId && (
			<GoogleAnalyticsComponent gaId={siteSettings.googleAnalyticsId} />
		)
	);
};

export default GoogleAnalytics;
