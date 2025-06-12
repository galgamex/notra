import { createPlatePlugin } from '@udecode/plate/react';

import TitleTextarea from '@/components/editor/ui/title-textarea';

export const TitlePlugin = createPlatePlugin({
	key: 'title',
	render: {
		beforeEditable: () => {
			return <TitleTextarea />;
		}
	}
});
