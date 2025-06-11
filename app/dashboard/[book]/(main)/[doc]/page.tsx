import AccountAvatar from '@/components/account-avatar';
import NotraInsetHeader from '@/components/notra/notra-inset-header';

import Editor from './_components/editor';
import HeaderEditableTitle from './_components/header-editable-title';
import TitleTextarea from './_components/title-textarea';

export default async function Page({
	params
}: Readonly<{
	params: Promise<{ doc: string }>;
}>) {
	const { doc: slug } = await params;

	return (
		<>
			<NotraInsetHeader
				leftActions={<HeaderEditableTitle />}
				rightActions={<AccountAvatar />}
			/>

			<div className="px-5 md:px-17.5">
				<div className="mt-6 pb-1 md:mr-[calc(50vw-445px)] md:ml-auto md:max-w-[750px]">
					<TitleTextarea />
				</div>

				<div className="pt-5">
					<Editor slug={slug} />
				</div>
			</div>

			{/* <NotraEditor /> */}
		</>
	);
}
