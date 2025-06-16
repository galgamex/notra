import { notFound } from 'next/navigation';

import AccountAvatar from '@/components/account-avatar';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import DocService from '@/services/doc';

import AutoSaveTip from './_components/auto-save-tip';
import Editor from './_components/editor';
import HeaderEditableTitle from './_components/header-editable-title';

export default async function Page({
	params
}: Readonly<{
	params: Promise<{ doc: string }>;
}>) {
	const { doc: slug } = await params;

	const { data: doc } = await DocService.getDoc(slug);

	if (!doc) {
		notFound();
	}

	return (
		<>
			<NotraInsetHeader
				leftActions={
					<>
						<HeaderEditableTitle />
						<AutoSaveTip />
					</>
				}
				rightActions={<AccountAvatar />}
			/>
			<Editor doc={doc} slug={slug} />
		</>
	);
}
