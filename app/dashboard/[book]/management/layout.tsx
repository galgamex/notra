import { notFound } from 'next/navigation';

import AccountAvatar from '@/components/account-avatar';
import NotraHeader from '@/components/notra/notra-header';
import NotraInset from '@/components/notra/notra-inset';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import NotraSidebarHeader from '@/components/notra/notra-sidebar-header';
import BookService from '@/services/book';

import BackButton from './_components/back-button';
import NavManagement from './_components/nav-management';

interface PageProps {
	children: React.ReactNode;
	params: Promise<{ book: string }>;
}

export default async function Layout({ children, params }: PageProps) {
	const { book: slug } = await params;

	const { data: book } = await BookService.getBook(slug);

	if (!book) {
		notFound();
	}

	return (
		<>
			<NotraSidebar>
				<NotraSidebarHeader>
					<BackButton bookName={book.name} />
				</NotraSidebarHeader>

				<NotraSidebarContent>
					<NavManagement slug={book.slug} />
				</NotraSidebarContent>
			</NotraSidebar>
			<NotraInset>
				<NotraHeader rightActions={<AccountAvatar />} />

				<div className="px-6 pt-6 pb-16">
					<div className="mx-auto max-w-5xl">
						<div className="max-w-2xl">{children}</div>
					</div>
				</div>
			</NotraInset>
		</>
	);
}
