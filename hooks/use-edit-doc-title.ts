import { DocEntity } from '@prisma/client';

import { updateDocTitle } from '@/actions/doc';
import { useDocMetaQuery } from '@/apis/doc';
import { useTranslations } from '@/i18n';

import { useMutateCatalog } from './use-mutate-catalog';

export const useEditDocTitle = (slug?: DocEntity['slug']) => {
	const { data, mutate } = useDocMetaQuery({ slug });
	const mutateCatalog = useMutateCatalog(data?.bookId || -1);
	const t = useTranslations('app_dashboard_book_main_doc_page');

	const handleEditDocTitle = (newTitle: string) => {
		if (!data) {
			return;
		}

		if (newTitle.length === 0) {
			newTitle = t('untitled');
		}

		if (newTitle !== data.title) {
			mutate(
				async () => {
					const result = await updateDocTitle(data.id, newTitle);

					if (!result.success || !result.data) {
						throw new Error(result.message);
					}

					mutateCatalog();

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
	};

	return { data, handleEditDocTitle };
};
