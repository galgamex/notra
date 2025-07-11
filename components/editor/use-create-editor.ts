import { Value } from '@udecode/plate';
import { usePlateEditor } from '@udecode/plate/react';

import { editorComponents } from './editor-components';
import { editorPlugins } from './editor-plugins';
import { withPlaceholders } from './ui/placeholder';

export const useCreateEditor = (initialValue?: Value) => {
	return usePlateEditor({
		components: withPlaceholders(editorComponents),
		plugins: editorPlugins,
		value: initialValue
	});
};
