import Link from 'next/link';

import Logo from '@/components/logo';
import NotraSidebarHeader from '@/components/notra/notra-sidebar-header';
import { DEFAULT_SITE_TITLE } from '@/constants/default';
import SiteSettingsService from '@/services/site-settings';

export default async function DashboardSidebarHeader() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	const title = siteSettings?.title ?? DEFAULT_SITE_TITLE;

	return (
		<NotraSidebarHeader>
			<Link
				className="flex h-8 items-center gap-2 transition-opacity hover:opacity-60"
				href="/admin"
			>
				<div className="flex size-8 shrink-0 items-center justify-center">
					<Logo size={28} />
				</div>
				<span className="truncate text-base font-semibold">{title}</span>
			</Link>
		</NotraSidebarHeader>
	);
}
