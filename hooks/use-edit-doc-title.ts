import { useCallback } from 'react';

import { updateDocTitle } from '@/actions/doc';
import { useDocMetaQuery } from '@/apis/doc';
import useEditorStore from '@/components/editor/use-editor-store';
import { getTranslations } from '@/i18n';

import { useMutateCatalog } from './use-mutate-catalog';

const t = getTranslations('notra_editor');

export const useEditDocTitle = () => {
	const { data, mutate } = useDocMetaQuery();
	const mutateCatalog = useMutateCatalog(data?.bookId ?? -1);
	const setIsSaving = useEditorStore((state) => state.setIsSaving);
	const setTitle = useEditorStore((state) => state.setTitle);
	const setUpdatedAt = useEditorStore((state) => state.setUpdatedAt);

	const handleEditDocTitle = useCallback(
		(newTitle: string) => {
			if (!data) {
				return;
			}

			if (newTitle.length === 0) {
				newTitle = t('untitled');
			}

			if (newTitle !== data.title) {
				mutate(
					async () => {
						setIsSaving(true);

						const result = await updateDocTitle(data.id, newTitle);

						if (!result.success || !result.data) {
							setIsSaving(false);

							throw new Error(result.message);
						}

						setTitle(result.data.title);
						setUpdatedAt(result.data.updatedAt);
						mutateCatalog();
						setIsSaving(false);

						return result.data;
					},
					{
						optimisticData: {
							...data,
							title: newTitle
						},
						revalidate: false
					}
				);
			}
		},
		[data, mutate, mutateCatalog, setIsSaving, setTitle, setUpdatedAt]
	);

	return handleEditDocTitle;
};
