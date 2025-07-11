import { createPlatePlugin } from '@udecode/plate/react';

import TitleTextarea from '../ui/title-textarea';

export const TitlePlugin = createPlatePlugin({
	key: 'title',
	render: {
		beforeEditable: () => {
			return <TitleTextarea />;
		}
	}
});
