'use client';

import { InputJsonValue } from '@prisma/client/runtime/library';
import { Value } from '@udecode/plate';
import { useDebounceCallback } from 'usehooks-ts';

import { updateDocContent } from '@/actions/doc';
import { useDocMetaQuery } from '@/apis/doc';
import NotraEditor from '@/components/editor/notra-editor';
import useEditorStore from '@/components/editor/use-editor-store';
import { DocVo } from '@/types/doc';

import EditorStoreProvider from './editor-store-provider';

export interface EditorProps {
	slug: string;
	doc: DocVo;
}

export default function Editor({ slug, doc }: Readonly<EditorProps>) {
	const setIsSaving = useEditorStore((state) => state.setIsSaving);
	const { mutate } = useDocMetaQuery();
	const debouncedUpdateDocContent = useDebounceCallback(
		async (value: Value) => {
			setIsSaving(true);
			await updateDocContent(doc.id, value as unknown as InputJsonValue);
			mutate();
			setIsSaving(false);
		},
		1000
	);

	const handleValueChange = (value: Value) => {
		debouncedUpdateDocContent(value);
	};

	return (
		<>
			<NotraEditor
				initialValue={doc.content ? (doc.content as unknown as Value) : void 0}
				onValueChange={handleValueChange}
			/>
			<EditorStoreProvider slug={slug} />
		</>
	);
}
