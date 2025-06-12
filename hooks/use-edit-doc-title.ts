import { useCallback, useEffect } from 'react';

import { updateDocTitle } from '@/actions/doc';
import { useDocMetaQuery } from '@/apis/doc';
import useEditorStore from '@/components/editor/use-editor-store';
import { getTranslations } from '@/i18n';

import { useMutateCatalog } from './use-mutate-catalog';

const t = getTranslations('app_dashboard_book_main_doc_page');

export const useEditDocTitle = () => {
	const { data, mutate } = useDocMetaQuery();
	const mutateCatalog = useMutateCatalog(data?.bookId ?? -1);
	const setIsSaving = useEditorStore((state) => state.setIsSaving);
	const titleToUpdate = useEditorStore((state) => state.titleToUpdate);

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
		[data, mutate, mutateCatalog, setIsSaving]
	);

	useEffect(() => {
		if (titleToUpdate) {
			handleEditDocTitle(titleToUpdate);
		}
	}, [handleEditDocTitle, titleToUpdate]);

	return { data, handleEditDocTitle };
};
