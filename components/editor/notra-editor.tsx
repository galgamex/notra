'use client';

import { Plate } from '@udecode/plate/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Editor, EditorContainer } from './ui/editor';
import { useCreateEditor } from './use-create-editor';
import useEditorStore from './use-editor-store';

export interface NotraEditorProps {
	slug: string;
}

export default function NotraEditor({ slug }: Readonly<NotraEditorProps>) {
	const setSlug = useEditorStore((state) => state.setSlug);
	const editor = useCreateEditor();

	setSlug(slug);

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
