import {
	DragDropContext,
	Draggable,
	DraggableProvided,
	DraggableRubric,
	DraggableStateSnapshot,
	DragStart,
	DragUpdate,
	Droppable,
	DroppableProvided,
	DropResult
} from '@hello-pangea/dnd';
import { BookEntity, CatalogNodeEntity } from '@prisma/client';
import { useRef, useCallback, CSSProperties } from 'react';
import { FixedSizeList } from 'react-window';

import {
	prependChild as prependChildAction,
	moveAfter as moveAfterAction
} from '@/actions/catalog-node';
import { checkShouldMoveNode, moveNode } from '@/lib/catalog-node-utils/client';
import useCatalog from '@/stores/use-catalog';
import {
	CatalogNodeVoWithLevel,
	ExtendedCatalogNodeVo
} from '@/types/catalog-node';

import CatalogItem from './catalog-item';
import CloneCatalogItem from './clone-catalog-item';

export interface DragDropZoneProps {
	height: number;
	bookId: BookEntity['id'];
	draggableList: CatalogNodeVoWithLevel[];
	nodeMap: Map<number, ExtendedCatalogNodeVo>;
	mutateCatalog: (mutateFn?: () => Promise<CatalogNodeVoWithLevel[]>) => void;
}

export default function DragDropZone({
	height,
	bookId,
	draggableList,
	nodeMap,
	mutateCatalog
}: Readonly<DragDropZoneProps>) {
	const expandedKeysBeforeDrag = useRef<Set<number>>(new Set());
	const expandedKeys = useCatalog((state) => state.expandedKeys);
	const reachLevelMap = useCatalog((state) => state.reachLevelMap);
	const setExpandedKeys = useCatalog((state) => state.setExpandedKeys);
	const setIsDragging = useCatalog((state) => state.setIsDragging);
	const setCurrentDropNode = useCatalog((state) => state.setCurrentDropNode);
	const setReachLevelRange = useCatalog((state) => state.setReachLevelRange);

	const renderItem = useCallback(
		(props: {
			data: CatalogNodeVoWithLevel[];
			index: number;
			style: CSSProperties;
		}) => {
			const { data, index, style } = props;
			const item = data[index];

			return (
				<Draggable key={item.id} draggableId={item.id.toString()} index={index}>
					{(
						dragProvided: DraggableProvided,
						dragSnapshot: DraggableStateSnapshot
					) => (
						<CatalogItem
							dragProvided={dragProvided}
							dragSnapshot={dragSnapshot}
							item={item}
							style={style}
						/>
					)}
				</Draggable>
			);
		},
		[]
	);

	const renderCloneItem = useCallback(
		(
			dragProvided: DraggableProvided,
			dragSnapshot: DraggableStateSnapshot,
			rubric: DraggableRubric
		) => (
			<CloneCatalogItem
				dragProvided={dragProvided}
				dragSnapshot={dragSnapshot}
				item={draggableList[rubric.source.index]}
			/>
		),
		[draggableList]
	);

	const updateDropNode = ({
		dropNode,
		nodeAfterDropNode
	}: {
		dropNode?: ExtendedCatalogNodeVo | null;
		nodeAfterDropNode?: ExtendedCatalogNodeVo;
	}) => {
		if (!dropNode) {
			setCurrentDropNode(null);

			return;
		}

		const reachLevelRange: [number, number] = [
			dropNode.minReachLevel,
			dropNode.childId === null || expandedKeys.has(dropNode.id)
				? dropNode.maxReachLevel
				: dropNode.maxReachLevel - 1
		];

		if (nodeAfterDropNode) {
			reachLevelRange[0] = Math.max(
				reachLevelRange[0],
				nodeAfterDropNode.level
			);
		}

		setCurrentDropNode(dropNode);
		setReachLevelRange(dropNode.id, reachLevelRange);
	};

	const prependChild = ({
		nodeId,
		newParentId
	}: {
		nodeId: CatalogNodeEntity['id'];
		newParentId: CatalogNodeEntity['parentId'];
	}) => {
		const newPrevId = newParentId;

		const { shouldUpdateNode, node } = checkShouldMoveNode(nodeMap, {
			nodeId,
			newParentId,
			newPrevId
		});

		if (!shouldUpdateNode || !node) {
			return;
		}

		moveNode(nodeMap, {
			node,
			newParentId,
			newPrevId
		});

		if (newParentId) {
			expandedKeysBeforeDrag.current.add(newParentId);
		}

		mutateCatalog(async () => {
			const result = await prependChildAction({
				bookId,
				nodeId,
				targetId: newParentId
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});
	};

	const moveAfter = ({
		nodeId,
		newPrevId
	}: {
		nodeId: CatalogNodeEntity['id'];
		newPrevId: CatalogNodeEntity['id'];
	}) => {
		const newPrevNode = nodeMap.get(newPrevId);

		if (!newPrevNode) {
			return;
		}

		const { shouldUpdateNode, node } = checkShouldMoveNode(nodeMap, {
			nodeId,
			newParentId: newPrevNode.parentId,
			newPrevId
		});

		if (!shouldUpdateNode || !node) {
			return;
		}

		moveNode(nodeMap, {
			node,
			newParentId: newPrevNode.parentId,
			newPrevId
		});

		mutateCatalog(async () => {
			const result = await moveAfterAction({
				bookId,
				nodeId,
				targetId: newPrevId
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});
	};

	const handleBeforeCapture = () => {
		setIsDragging(true);
	};

	const handleBeforeDragStart = (start: DragStart) => {
		const dragNode = nodeMap.get(Number(start.draggableId));

		if (!dragNode) {
			return;
		}

		expandedKeysBeforeDrag.current = new Set(expandedKeys);

		const deleteKey = (key: number | null) => {
			if (!key) {
				return;
			}

			expandedKeys.delete(key);

			const node = nodeMap.get(key);

			if (!node) {
				return;
			}

			if (node.childId) {
				deleteKey(node.childId);
			}

			if (node.siblingId) {
				deleteKey(node.siblingId);
			}
		};

		expandedKeys.delete(dragNode.id);
		deleteKey(dragNode.childId);

		setExpandedKeys(expandedKeys);
	};

	const handleDragStart = (start: DragStart) => {
		if (start.source.index > 0) {
			updateDropNode({
				dropNode: nodeMap.get(draggableList[start.source.index - 1].id),
				nodeAfterDropNode:
					start.source.index < draggableList.length - 1
						? nodeMap.get(draggableList[start.source.index + 1].id)
						: void 0
			});
		}
	};

	const handleDragUpdate = (update: DragUpdate) => {
		if (update.destination?.index === 0 || update.combine) {
			setCurrentDropNode(null);

			return;
		}

		if (update.destination && update.destination.index > 0) {
			const dropNodeIndex =
				update.destination.index <= update.source.index
					? update.destination.index - 1
					: update.destination.index;
			const nodeAfterDropNodeIndex =
				update.destination.index <= update.source.index
					? update.destination.index
					: update.destination.index + 1;

			updateDropNode({
				dropNode: nodeMap.get(draggableList[dropNodeIndex].id),
				nodeAfterDropNode:
					update.destination.index < draggableList.length - 1
						? nodeMap.get(draggableList[nodeAfterDropNodeIndex].id)
						: void 0
			});
		}
	};

	const handleDragEnd = (result: DropResult) => {
		const nodeId = Number(result.draggableId);

		if (result.combine) {
			const newParentId = Number(result.combine.draggableId);

			prependChild({ nodeId, newParentId });
			setExpandedKeys(expandedKeysBeforeDrag.current);

			return;
		}

		if (!result.destination) {
			return;
		}

		if (result.destination.index === 0) {
			prependChild({ nodeId, newParentId: null });
			setExpandedKeys(expandedKeysBeforeDrag.current);

			return;
		}

		const dropNodeId =
			draggableList[
				result.destination.index <= result.source.index
					? result.destination.index - 1
					: result.destination.index
			].id;

		const dropNodeLevel = nodeMap.get(dropNodeId)?.level;
		const dropNodeReachLevel = reachLevelMap.get(dropNodeId);

		if (dropNodeLevel === void 0 || dropNodeReachLevel === void 0) {
			return;
		}

		if (dropNodeLevel < dropNodeReachLevel) {
			prependChild({ nodeId, newParentId: dropNodeId });
		} else if (dropNodeLevel === dropNodeReachLevel) {
			moveAfter({ nodeId, newPrevId: dropNodeId });
		} else {
			let diff = dropNodeLevel - dropNodeReachLevel;
			let tempNodeId = dropNodeId;

			while (diff > 0) {
				diff--;

				const parentId = nodeMap.get(tempNodeId)?.parentId;

				if (!parentId) {
					return;
				}

				tempNodeId = parentId;
			}

			moveAfter({ nodeId, newPrevId: tempNodeId });
		}

		setExpandedKeys(expandedKeysBeforeDrag.current);
	};

	return (
		<DragDropContext
			onBeforeCapture={handleBeforeCapture}
			onBeforeDragStart={handleBeforeDragStart}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			onDragUpdate={handleDragUpdate}
		>
			<Droppable
				isCombineEnabled
				droppableId="Catalog"
				mode="virtual"
				renderClone={renderCloneItem}
			>
				{(dropProvided: DroppableProvided) => (
					<FixedSizeList
						height={height}
						itemCount={draggableList.length}
						itemData={draggableList}
						itemSize={36}
						outerRef={dropProvided.innerRef}
						width="100%"
					>
						{renderItem}
					</FixedSizeList>
				)}
			</Droppable>
		</DragDropContext>
	);
}
