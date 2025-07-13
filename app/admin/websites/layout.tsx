import { Metadata } from 'next';

import AccountAvatar from '@/components/account-avatar';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import { DEFAULT_SITE_TITLE } from '@/constants/default';
import SiteSettingsService from '@/services/site-settings';

import DashboardSidebarHeader from '../_components/dashboard-sidebar-header';
import NavMain from '../_components/nav-main';

export const generateMetadata = async (): Promise<Metadata> => {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return {
		title: `网站管理 - ${siteSettings?.title ?? DEFAULT_SITE_TITLE}`
	};
};

export default function WebsitesLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<NotraSidebar className="bg-sidebar">
				<DashboardSidebarHeader />

				<NotraSidebarContent>
					<NavMain />
				</NotraSidebarContent>
			</NotraSidebar>
			<NotraInset>
				<NotraInsetHeader rightActions={<AccountAvatar />} />

				<div className="px-9 py-6">{children}</div>
			</NotraInset>
		</>
	);
}
