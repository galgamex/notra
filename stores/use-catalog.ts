import { create } from 'zustand';

import {
	CatalogNodeVoWithLevel,
	ExtendedCatalogNodeVo
} from '@/types/catalog-node';

type CatalogStore = {
	nodeMap: Map<number, ExtendedCatalogNodeVo>;
	expandedKeys: Set<number>;
	isDragging: boolean;
	currentDropNode: ExtendedCatalogNodeVo | null;
	reachLevelMap: Map<number, number>;
	reachLevelRangeMap: Map<number, [number, number]>;
	setNodeMap: (data: CatalogNodeVoWithLevel[]) => void;
	setExpandedKeys: (expandedKeys: Set<number> | number[]) => void;
	setIsDragging: (isDragging: boolean) => void;
	setCurrentDropNode: (currentDropNode: ExtendedCatalogNodeVo | null) => void;
	setReachLevel: (nodeId: number, reachLevel: number) => void;
	setReachLevelRange: (
		nodeId: number,
		reachLevelRange: [number, number]
	) => void;
	setCurrentDropNodeReachLevel: (params: {
		x: number;
		initialLevel: number;
	}) => number;
};

const useCatalog = create<CatalogStore>((set, get) => ({
	nodeMap: new Map(),
	expandedKeys: new Set(),
	isDragging: false,
	currentDropNode: null,
	reachLevelMap: new Map(),
	reachLevelRangeMap: new Map(),
	setNodeMap: (data) =>
		set((state) => {
			state.nodeMap.clear();

			for (const node of data) {
				const minReachLevel = node.parentId
					? state.nodeMap.get(node.parentId)!.minReachLevel
					: node.level;
				const maxReachLevel = node.childId ? node.level + 1 : node.level;

				state.nodeMap.set(node.id, {
					...node,
					minReachLevel,
					maxReachLevel
				});
			}

			return {};
		}),
	setExpandedKeys: (expandedKeys) =>
		set({ expandedKeys: new Set(expandedKeys) }),
	setIsDragging: (isDragging) => set({ isDragging }),
	setCurrentDropNode: (currentDropNode) => set({ currentDropNode }),
	setReachLevel: (nodeId, reachLevel) =>
		set((state) => {
			state.reachLevelMap.set(nodeId, reachLevel);

			return {};
		}),
	setReachLevelRange: (nodeId, reachLevelRange) =>
		set((state) => {
			state.reachLevelRangeMap.set(nodeId, reachLevelRange);

			return {};
		}),
	setCurrentDropNodeReachLevel: ({ x, initialLevel }) => {
		const state = get();

		const currentDropNode = state.currentDropNode;

		if (!currentDropNode) {
			return initialLevel;
		}

		const reachLevelRange = state.reachLevelRangeMap.get(currentDropNode.id);

		if (!reachLevelRange) {
			return initialLevel;
		}

		let reachLevel = Math.round(x / 24) + initialLevel;

		reachLevel = Math.max(reachLevel, reachLevelRange[0]);
		reachLevel = Math.min(reachLevel, reachLevelRange[1]);
		state.reachLevelMap.set(currentDropNode.id, reachLevel);
		set({});

		return reachLevel;
	}
}));

export default useCatalog;
