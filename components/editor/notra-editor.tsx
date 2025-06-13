'use client';

import { Plate } from '@udecode/plate/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Editor, EditorContainer } from './ui/editor';
import { useCreateEditor } from './use-create-editor';

// export interface NotraEditorProps {}

export default function NotraEditor() {
	const editor = useCreateEditor();

	return (
		<DndProvider backend={HTML5Backend}>
			<Plate editor={editor}>
				<EditorContainer>
					<Editor />
				</EditorContainer>
			</Plate>
		</DndProvider>
	);
}
