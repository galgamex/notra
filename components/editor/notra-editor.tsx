'use client';

import { Plate } from '@udecode/plate/react';

import { Editor, EditorContainer } from './ui/editor';
import { useCreateEditor } from './use-create-editor';

export default function NotraEditor() {
	const editor = useCreateEditor();

	return (
		<Plate editor={editor}>
			<EditorContainer>
				<Editor />
			</EditorContainer>
		</Plate>
	);
}
