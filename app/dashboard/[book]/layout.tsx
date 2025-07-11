import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DEFAULT_SITE_TITLE } from '@/constants/default';
import BookService from '@/services/book';
import SiteSettingsService from '@/services/site-settings';

export const generateMetadata = async ({
	params
}: {
	params: Promise<{ book: string }>;
}): Promise<Metadata> => {
	const { book: slug } = await params;
	const { data: book } = await BookService.getBook(slug);
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return {
		title: `${book?.name} - ${siteSettings?.title ?? DEFAULT_SITE_TITLE}`
	};
};

export default async function Layout({
	children,
	params
}: {
	children: React.ReactNode;
	params: Promise<{ book: string }>;
}) {
	const { book: slug } = await params;

	const { data: book } = await BookService.getBook(slug);

	if (!book) {
		notFound();
	}

	return children;
}

export const dynamic = 'force-static';
