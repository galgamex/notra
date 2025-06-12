import AccountAvatar from '@/components/account-avatar';
import NotraEditor from '@/components/editor/notra-editor';
import NotraInsetHeader from '@/components/notra/notra-inset-header';

import AutoSaveTip from './_components/auto-save-tip';
import HeaderEditableTitle from './_components/header-editable-title';

export default async function Page({
	params
}: Readonly<{
	params: Promise<{ doc: string }>;
}>) {
	const { doc: slug } = await params;

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

			<NotraEditor slug={slug} />
		</>
	);
}
