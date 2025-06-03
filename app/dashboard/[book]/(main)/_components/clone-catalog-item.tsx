import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import useCatalog from '@/stores/use-catalog';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';

export interface CatalogItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	item: CatalogNodeVoWithLevel;
}

const CloneCatalogItem = ({
	dragProvided,
	dragSnapshot,
	item
}: CatalogItemProps) => {
	const targetLevel = useRef(item.level);
	const setIsDragging = useCatalog((state) => state.setIsDragging);
	const setCurrentDropNodeReachLevel = useCatalog(
		(state) => state.setCurrentDropNodeReachLevel
	);

	useEffect(() => {
		if (
			dragProvided.draggableProps.style?.transform &&
			!dragSnapshot.isDropAnimating
		) {
			const pattern = /translate\(([^)]+)px,/;
			const match = dragProvided.draggableProps.style?.transform.match(pattern);

			if (match && match[1]) {
				const x = Number(match[1]);

				if (!Number.isNaN(x)) {
					targetLevel.current = setCurrentDropNodeReachLevel({
						x,
						initialLevel: item.level
					});
				}
			}
		}
	}, [
		dragProvided.draggableProps.style?.transform,
		dragSnapshot.isDropAnimating,
		item.level,
		setCurrentDropNodeReachLevel
	]);

	useEffect(() => {
		setIsDragging(!dragSnapshot.isDropAnimating);
	}, [dragSnapshot.isDropAnimating, setIsDragging]);

	return (
		<div
			{...dragProvided.draggableProps}
			{...dragProvided.dragHandleProps}
			style={{
				...dragProvided.draggableProps.style,
				cursor: 'pointer',
				...(dragSnapshot.isDropAnimating
					? {
							transform: `translate(${(targetLevel.current - item.level) * 24}px,${dragSnapshot.dropAnimation?.moveTo.y}px)`
						}
					: void 0)
			}}
			className="px-2"
		>
			<div
				className={cn(
					'h-full rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center border-1.5 border-transparent',
					dragSnapshot.isDragging &&
						'shadow-[0_1px_4px_-2px_rgba(0,0,0,.13),0_2px_8px_0_rgba(0,0,0,.08),0_8px_16px_4px_rgba(0,0,0,.04)] opacity-70'
				)}
				style={{ paddingLeft: 24 * item.level + 'px' }}
			>
				<div className="mr-1 size-6">
					{item.childId !== null && (
						<div className="flex h-full w-full items-center justify-center rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
							<ChevronRight
								className="transition-transform duration-200"
								size={16}
							/>
						</div>
					)}
				</div>
				{item.title}
			</div>
		</div>
	);
};

export default CloneCatalogItem;
