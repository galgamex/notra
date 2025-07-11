'use client';

import { useEffect } from 'react';

import { useDocMetaQuery } from '@/apis/doc';
import useEditorStore from '@/components/editor/use-editor-store';
import { useEditDocTitle } from '@/hooks/use-edit-doc-title';

export interface EditorStoreProviderProps {
	slug: string;
}

export default function EditorStoreProvider({
	slug
}: EditorStoreProviderProps) {
	const setSlug = useEditorStore((state) => state.setSlug);
	const setTitle = useEditorStore((state) => state.setTitle);
	const setUpdatedAt = useEditorStore((state) => state.setUpdatedAt);
	const title = useEditorStore((state) => state.title);
	const updatedAt = useEditorStore((state) => state.updatedAt);
	const { data } = useDocMetaQuery();
	const handleEditDocTitle = useEditDocTitle();

	useEffect(() => {
		setSlug(slug);
	}, [slug, setSlug]);

	useEffect(() => {
		if (data && updatedAt) {
			const lastUpdatedAt = new Date(data.updatedAt);

			if (lastUpdatedAt.getTime() > updatedAt.getTime()) {
				setTitle(data.title);
				setUpdatedAt(new Date(data.updatedAt));
			} else if (
				lastUpdatedAt.getTime() < updatedAt.getTime() &&
				title !== data.title
			) {
				handleEditDocTitle(title);
			}
		}
	}, [data, setTitle, updatedAt, setUpdatedAt, title, handleEditDocTitle]);

	return null;
}
