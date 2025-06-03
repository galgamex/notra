import { notFound } from 'next/navigation';

import { getTranslations } from '@/i18n';
import BookService from '@/services/book';

import BookInfoForm from './_components/book-info-form';

interface PageProps {
	params: Promise<{ book: string }>;
}

export default async function Page({ params }: PageProps) {
	const { book: slug } = await params;

	const { data: book } = await BookService.getBook(slug);

	if (!book) {
		notFound();
	}

	const t = getTranslations('app_dashboard_book_management_settings_page');

	return (
		<>
			<h1 className="pb-7 text-xl font-medium">{t('title')}</h1>

			<BookInfoForm
				id={book.id}
				defaultName={book.name}
				defaultSlug={book.slug}
			/>
		</>
	);
}
