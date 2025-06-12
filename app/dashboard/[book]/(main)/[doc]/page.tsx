import AccountAvatar from '@/components/account-avatar';
import NotraEditor from '@/components/editor/notra-editor';
import AutoSaveTip from '@/components/editor/ui/auto-save-tip';
import NotraInsetHeader from '@/components/notra/notra-inset-header';

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

			{/* <div className="px-5 md:px-17.5">
				<div className="mt-6 pb-1 md:mr-[calc(50vw-445px)] md:ml-auto md:max-w-[750px]">
					<TitleTextarea />
				</div>

				<div className="pt-5">
					<Editor slug={slug} />
				</div>
			</div> */}

			<NotraEditor slug={slug} />
		</>
	);
}
