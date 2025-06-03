import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DEFAULT_SITE_TITLE } from '@/constants/default';
import DocService from '@/services/doc';
import SiteSettingsService from '@/services/site-settings';

export const generateMetadata = async ({
	params
}: {
	params: Promise<{ doc: string }>;
}): Promise<Metadata> => {
	const { doc: slug } = await params;
	const { data: doc } = await DocService.getDoc(slug);
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return {
		title: `${doc?.title} - ${siteSettings?.title || DEFAULT_SITE_TITLE}`
	};
};

export default async function Layout({
	children,
	params
}: {
	children: React.ReactNode;
	params: Promise<{ doc: string }>;
}) {
	const { doc: slug } = await params;
	const { data: doc } = await DocService.getDoc(slug);

	if (!doc) {
		notFound();
	}

	return children;
}
