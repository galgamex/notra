import { Metadata } from 'next';

import AccountAvatar from '@/components/account-avatar';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import NotraSidebarHeader from '@/components/notra/notra-sidebar-header';
import { DEFAULT_SITE_TITLE } from '@/constants/default';
import { getTranslations } from '@/i18n';
import SiteSettingsService from '@/services/site-settings';

import DashboardBackButton from './_components/back-button';
import NavSettings from './_components/nav-settings';

export const generateMetadata = async (): Promise<Metadata> => {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const t = getTranslations('app_dashboard_settings_page');

	return {
		title: `${t('metadata_title')} - ${siteSettings?.title ?? DEFAULT_SITE_TITLE}`
	};
};

export default async function Layout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<NotraSidebar>
				<NotraSidebarHeader>
					<DashboardBackButton />
				</NotraSidebarHeader>

				<NotraSidebarContent>
					<NavSettings />
				</NotraSidebarContent>
			</NotraSidebar>
			<NotraInset>
				<NotraInsetHeader rightActions={<AccountAvatar />} />

				<div className="px-6 pt-6 pb-16">
					<div className="mx-auto max-w-5xl">
						<div className="max-w-2xl">{children}</div>
					</div>
				</div>
			</NotraInset>
		</>
	);
}
