import { ExtendedCatalogNodeVo } from '@/types/catalog-node';

export const checkShouldMoveNode = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	{
		nodeId,
		newParentId,
		newPrevId
	}: {
		nodeId: ExtendedCatalogNodeVo['id'];
		newParentId: ExtendedCatalogNodeVo['parentId'];
		newPrevId: ExtendedCatalogNodeVo['prevId'];
	}
) => {
	const node = nodeMap.get(nodeId);

	return {
		shouldUpdateNode:
			node?.parentId !== newParentId || node?.prevId !== newPrevId,
		node
	};
};

const removeFirstChild = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	node: ExtendedCatalogNodeVo
) => {
	const parentNode = node.parentId ? nodeMap.get(node.parentId) : null;

	if (parentNode) {
		parentNode.childId = node.siblingId;
	}

	const siblingNode = node.siblingId ? nodeMap.get(node.siblingId) : null;

	if (siblingNode) {
		siblingNode.prevId = node.prevId;
	}
};

const removeNotFirstChild = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	node: ExtendedCatalogNodeVo
) => {
	const prevNode = node.prevId ? nodeMap.get(node.prevId) : null;

	if (prevNode) {
		prevNode.siblingId = node.siblingId;
	}

	const siblingNode = node.siblingId ? nodeMap.get(node.siblingId) : null;

	if (siblingNode) {
		siblingNode.prevId = node.prevId;
	}
};

const removeNodeFromOldPosition = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	node: ExtendedCatalogNodeVo
) => {
	if (node.parentId === node.prevId) {
		removeFirstChild(nodeMap, node);
	} else {
		removeNotFirstChild(nodeMap, node);
	}
};

const deleteChildren = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	nodeId: ExtendedCatalogNodeVo['id']
) => {
	const nodeIdsToDelete: number[] = [];

	const collectNodeIds = (parentId: number) => {
		for (const node of nodeMap.values()) {
			if (node.parentId === parentId) {
				nodeIdsToDelete.push(node.id);
				collectNodeIds(node.id);
			}
		}
	};

	collectNodeIds(nodeId);

	for (const id of nodeIdsToDelete) {
		nodeMap.delete(id);
	}
};

export const deleteNodeWithChildren = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	nodeId: ExtendedCatalogNodeVo['id']
) => {
	const deletedNode = nodeMap.get(nodeId);

	nodeMap.delete(nodeId);

	if (!deletedNode) {
		return;
	}

	removeNodeFromOldPosition(nodeMap, deletedNode);
	deleteChildren(nodeMap, deletedNode.id);
};

const insertNodeIntoFirstPosition = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	node: ExtendedCatalogNodeVo,
	newParentId: ExtendedCatalogNodeVo['parentId']
) => {
	if (newParentId) {
		const newParentNode = nodeMap.get(newParentId);

		if (!newParentNode) {
			return;
		}

		const newParentNodeChild = newParentNode.childId
			? nodeMap.get(newParentNode.childId)
			: null;

		newParentNode.childId = node.id;

		node.parentId = newParentId;
		node.prevId = null;
		node.siblingId = newParentNodeChild ? newParentNodeChild.id : null;
		node.level = newParentNode.level + 1;

		if (newParentNodeChild) {
			newParentNodeChild.prevId = node.id;
		}
	} else {
		const firstChildOfRoot = Array.from(nodeMap.values()).find(
			(node) => node.parentId === null && node.prevId === null
		);

		node.parentId = null;
		node.prevId = null;
		node.siblingId = firstChildOfRoot ? firstChildOfRoot.id : null;
		node.level = 0;

		if (firstChildOfRoot) {
			firstChildOfRoot.prevId = node.id;
		}
	}
};

const insertNodeIntoNotFirstPosition = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	node: ExtendedCatalogNodeVo,
	newPrevId: ExtendedCatalogNodeVo['prevId']
) => {
	const newPrevNode = newPrevId ? nodeMap.get(newPrevId) : null;

	if (!newPrevNode) {
		return;
	}

	const newPrevNodeSibling = newPrevNode.siblingId
		? nodeMap.get(newPrevNode.siblingId)
		: null;

	newPrevNode.siblingId = node.id;

	node.parentId = newPrevNode.parentId;
	node.prevId = newPrevNode.id;
	node.siblingId = newPrevNodeSibling ? newPrevNodeSibling.id : null;
	node.level = newPrevNode.level;

	if (newPrevNodeSibling) {
		newPrevNodeSibling.prevId = node.id;
	}
};

const insertNodeIntoNewPosition = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	{
		node,
		newParentId,
		newPrevId
	}: {
		node: ExtendedCatalogNodeVo;
		newParentId: ExtendedCatalogNodeVo['parentId'];
		newPrevId: ExtendedCatalogNodeVo['prevId'];
	}
) => {
	if (newParentId === newPrevId) {
		insertNodeIntoFirstPosition(nodeMap, node, newParentId);
	} else {
		insertNodeIntoNotFirstPosition(nodeMap, node, newPrevId);
	}
};

export const moveNode = (
	nodeMap: Map<number, ExtendedCatalogNodeVo>,
	{
		node,
		newParentId,
		newPrevId
	}: {
		node: ExtendedCatalogNodeVo;
		newParentId: ExtendedCatalogNodeVo['parentId'];
		newPrevId: ExtendedCatalogNodeVo['prevId'];
	}
) => {
	removeNodeFromOldPosition(nodeMap, node);
	insertNodeIntoNewPosition(nodeMap, {
		node,
		newParentId,
		newPrevId
	});
};
