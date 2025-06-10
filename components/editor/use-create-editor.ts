import { usePlateEditor } from '@udecode/plate/react';

import { editorComponents } from './editor-components';
import { editorPlugins } from './editor-plugins';

export const useCreateEditor = () => {
	return usePlateEditor({
		components: editorComponents,
		plugins: editorPlugins
	});
};
