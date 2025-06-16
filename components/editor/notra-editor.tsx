'use client';

import { Value } from '@udecode/plate';
import { Plate } from '@udecode/plate/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Editor, EditorContainer } from './ui/editor';
import { useCreateEditor } from './use-create-editor';

export interface NotraEditorProps {
	initialValue?: Value;
	onValueChange?: (value: Value) => void;
}

export default function NotraEditor({
	initialValue,
	onValueChange
}: Readonly<NotraEditorProps>) {
	const editor = useCreateEditor(initialValue);

	const handleValueChange = ({ value }: { value: Value }) => {
		onValueChange?.(value);
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<Plate editor={editor} onValueChange={handleValueChange}>
				<EditorContainer>
					<Editor />
				</EditorContainer>
			</Plate>
		</DndProvider>
	);
}
