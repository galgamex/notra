import { Separator } from '@/components/ui/separator';
import { getTranslations } from '@/i18n';
import SiteSettingsService from '@/services/site-settings';

import AnalyticsForm from './_components/analytics-form';
import SiteSettingsForm from './_components/site-info-form';

export default async function Page() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const t = getTranslations('app_dashboard_settings_page');

	return (
		<>
			<h1 className="pb-7 text-xl font-medium">{t('title')}</h1>

			<h2 className="mb-4 font-medium">{t('site_info')}</h2>
			<SiteSettingsForm
				defaultCopyright={siteSettings?.copyright}
				defaultDarkLogo={siteSettings?.darkLogo}
				defaultDescription={siteSettings?.description}
				defaultLogo={siteSettings?.logo}
				defaultTitle={siteSettings?.title}
			/>
			<Separator className="my-7 bg-gray-100 dark:bg-secondary" />

			<h2 className="mb-4 font-medium">{t('site_analytics')}</h2>
			<AnalyticsForm
				defaultGoogleAnalyticsId={siteSettings?.googleAnalyticsId}
			/>
		</>
	);
}
