import { BookEntity } from '@prisma/client';
import { mutate } from 'swr';

import { flattenCatalogNodes } from '@/lib/utils';
import useCatalog from '@/stores/use-catalog';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';

export const useMutateCatalog = (bookId: BookEntity['id']) => {
	const nodeMap = useCatalog((state) => state.nodeMap);

	return (mutateFn?: () => Promise<CatalogNodeVoWithLevel[]>) => {
		mutate(
			`/api/catalog-nodes?book_id=${bookId}`,
			mutateFn ? mutateFn : (state) => state,
			{
				optimisticData: flattenCatalogNodes(Array.from(nodeMap.values())),
				revalidate: mutateFn ? false : true
			}
		);
	};
};
