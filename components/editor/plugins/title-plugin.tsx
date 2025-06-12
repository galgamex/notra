import { createPlatePlugin } from '@udecode/plate/react';

import TitleTextarea from '@/app/dashboard/[book]/(main)/[doc]/_components/title-textarea';

export const TitlePlugin = createPlatePlugin({
	key: 'title',
	render: {
		beforeEditable: () => {
			return <TitleTextarea />;
		}
	}
});
