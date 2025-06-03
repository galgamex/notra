import { BookEntity } from '@prisma/client';
import { useEffect, useRef } from 'react';

import useCatalog from '@/stores/use-catalog';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';

import { useFetcher } from './use-fetcher';
import { useMutateCatalog } from './use-mutate-catalog';

export const useCatalogFetcher = (bookId: BookEntity['id']) => {
	const nodeMap = useCatalog((state) => state.nodeMap);
	const setNodeMap = useCatalog((state) => state.setNodeMap);
	const setExpandedKeys = useCatalog((state) => state.setExpandedKeys);
	const { data, isLoading } = useFetcher<CatalogNodeVoWithLevel[]>(
		`/api/catalog-nodes?book_id=${bookId}`
	);
	const mutateCatalog = useMutateCatalog(bookId);
	const hasDefaultExpandedKeysGenerated = useRef(false);

	useEffect(() => {
		if (data && !hasDefaultExpandedKeysGenerated.current) {
			hasDefaultExpandedKeysGenerated.current = true;
			const defaultExpandedKeys = data
				.filter((node) => node.level === 0)
				.map((node) => node.id);

			setExpandedKeys(defaultExpandedKeys);
		}
	}, [data, setExpandedKeys]);

	useEffect(() => {
		if (data) {
			setNodeMap(data);
		}
	}, [data, setNodeMap]);

	return {
		data: data || [],
		isLoading,
		nodeMap,
		mutateCatalog
	};
};
