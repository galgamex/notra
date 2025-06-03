import AccountAvatar from '@/components/account-avatar';
import NotraHeader from '@/components/notra/notra-header';

import Editor from './_components/editor';
import HeaderEditableTitle from './_components/header-editable-title';
import TitleTextarea from './_components/title-textarea';

export default async function Page({
	params
}: {
	params: Promise<{ doc: string }>;
}) {
	const { doc: slug } = await params;

	return (
		<>
			<NotraHeader
				leftActions={<HeaderEditableTitle />}
				rightActions={<AccountAvatar />}
			/>

			<div className="px-12.5 md:mr-[calc(50vw-425px)] md:ml-auto md:max-w-[850px]">
				<div className="mt-6 pb-1">
					<TitleTextarea />
				</div>

				<div className="pt-5">
					<Editor slug={slug} />
				</div>
			</div>
		</>
	);
}
