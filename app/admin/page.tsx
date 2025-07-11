import { Metadata } from 'next';

import AccountAvatar from '@/components/account-avatar';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import { DEFAULT_SITE_TITLE } from '@/constants/default';
import { getTranslations } from '@/i18n';
import SiteSettingsService from '@/services/site-settings';

import DashboardSidebarHeader from './_components/dashboard-sidebar-header';
import NavMain from './_components/nav-main';

export const generateMetadata = async (): Promise<Metadata> => {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const t = getTranslations('app_dashboard_page');

	return {
		title: `${t('metadata_title')} - ${siteSettings?.title ?? DEFAULT_SITE_TITLE}`
	};
};

export default async function Page() {
	const t = getTranslations('app_dashboard_page');

	return (
		<>
			<NotraSidebar resizeable className="bg-sidebar">
				<DashboardSidebarHeader />

				<NotraSidebarContent>
					<NavMain />
				</NotraSidebarContent>
			</NotraSidebar>
			<NotraInset>
				<NotraInsetHeader rightActions={<AccountAvatar />} />

				<div className="px-9 py-6">
					<div className="mb-5 text-lg font-medium">{t('welcome')}</div>
					<p className="text-muted-foreground">
						{t('dashboard_description')}
					</p>
				</div>
			</NotraInset>
		</>
	);
}
