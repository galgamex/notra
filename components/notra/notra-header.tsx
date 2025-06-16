import Link from 'next/link';

import { DEFAULT_SITE_TITLE } from '@/constants/default';
import SiteSettingsService from '@/services/site-settings';

import Logo from '../logo';

export default async function NotraHeader() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<header className="z-30 w-full md:fixed">
			<div className="h-nav-height w-full pr-2 pl-6 md:px-8">
				<div className="mx-auto flex h-full max-w-[1376px] justify-between font-semibold">
					<Link className="flex h-full items-center gap-2" href="/">
						<Logo size={24} />
						<span>{siteSettings?.title ?? DEFAULT_SITE_TITLE}</span>
					</Link>
				</div>
			</div>
		</header>
	);
}
