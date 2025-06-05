'use client';

import Image from 'next/image';
import { useRef, RefObject } from 'react';
import { useResizeObserver } from 'usehooks-ts';

import { Skeleton } from '@/components/ui/skeleton';
import { useCatalogFetcher } from '@/hooks/use-catalog-fetcher';
import { useSetBook } from '@/stores/use-book';
import useCatalog from '@/stores/use-catalog';
import { BookVo } from '@/types/book';

import DragDropZone from './drag-drop-zone';

export interface CatalogProps {
	book: BookVo;
}

export default function Catalog({ book }: Readonly<CatalogProps>) {
	const ref = useRef<HTMLDivElement>(null);
	const { height = 9999 } = useResizeObserver({
		ref: ref as RefObject<HTMLElement>
	});

	useSetBook(book);
	const expandedKeys = useCatalog((state) => state.expandedKeys);
	const { data, isLoading, nodeMap, mutateCatalog } = useCatalogFetcher(
		book.id
	);
	const draggableList = data.filter(
		(node) =>
			node.level === 0 || (node.parentId && expandedKeys.has(node.parentId))
	);

	return (
		<div className="relative size-full">
			<div ref={ref} className="absolute h-full w-px"></div>

			{isLoading && (
				<div className="px-2">
					<div className="py-2.5">
						<Skeleton className="h-4" />
					</div>
					<div className="py-2.5">
						<Skeleton className="h-4" />
					</div>
					<div className="py-2.5">
						<Skeleton className="h-4" />
					</div>
				</div>
			)}

			{!isLoading && data.length === 0 && (
				<div className="flex h-[300px] w-full items-center justify-center">
					<Image alt="Empty" height={150} src="/empty-list.svg" width={200} />
				</div>
			)}

			{!isLoading && data.length > 0 && (
				<DragDropZone
					bookId={book.id}
					draggableList={draggableList}
					height={height}
					mutateCatalog={mutateCatalog}
					nodeMap={nodeMap}
				/>
			)}
		</div>
	);
}
