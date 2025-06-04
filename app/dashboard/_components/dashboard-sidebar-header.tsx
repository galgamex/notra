import Link from 'next/link';

import NotraSidebarHeader from '@/components/notra/notra-sidebar-header';
import { DEFAULT_SITE_TITLE } from '@/constants/default';
import SiteSettingsService from '@/services/site-settings';

import DashboardLogo from './dashboard-logo';

export default async function DashboardSidebarHeader() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	const title = siteSettings?.title ?? DEFAULT_SITE_TITLE;

	return (
		<NotraSidebarHeader>
			<Link
				href="/dashboard"
				className="flex h-8 items-center gap-2 transition-opacity hover:opacity-60"
			>
				<div className="flex size-8 shrink-0 items-center justify-center">
					<DashboardLogo size={28} />
				</div>
				<span className="truncate text-base font-semibold">{title}</span>
			</Link>
		</NotraSidebarHeader>
	);
}
