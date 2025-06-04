'use client';

import { PartialBlock } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { useTheme } from 'next-themes';
import { useDebounceCallback } from 'usehooks-ts';

import { updateDocContent } from '@/actions/doc';
import { ENV_LOCALE } from '@/constants/env';
import { editorLocales } from '@/i18n/editor';
import { DocVo } from '@/types/doc';

import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import './editor-styles.css';

export interface EditorCoreProps {
	doc: DocVo;
}

export default function EditorCore({ doc }: Readonly<EditorCoreProps>) {
	const { resolvedTheme } = useTheme();
	const editor = useCreateBlockNote({
		dictionary: editorLocales[ENV_LOCALE],
		initialContent: doc.blockJson as PartialBlock[]
	});
	const debouncedUpdateDocContent = useDebounceCallback(() => {
		updateDocContent(doc.id, editor.document);
	}, 1000);

	const handleChange = () => {
		debouncedUpdateDocContent();
	};

	return (
		<BlockNoteView
			editor={editor}
			onChange={handleChange}
			theme={resolvedTheme as 'light' | 'dark' | undefined}
		/>
	);
}
