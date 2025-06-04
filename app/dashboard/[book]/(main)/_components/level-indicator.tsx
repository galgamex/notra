import useCatalog from '@/stores/use-catalog';

export interface LevelIndicatorProps {
	id: number;
}

export default function LevelIndicator({ id }: LevelIndicatorProps) {
	const isDragging = useCatalog((state) => state.isDragging);
	const currentDropNode = useCatalog((state) => state.currentDropNode);
	const reachLevel = useCatalog((state) => state.reachLevelMap.get(id));
	const minReachLevel = useCatalog(
		(state) => state.reachLevelRangeMap.get(id)?.[0] || 0
	);

	if (!isDragging || currentDropNode?.id !== id || reachLevel === undefined) {
		return null;
	}

	return (
		<div
			className="absolute bottom-[-5px]"
			style={{
				width: `calc(100% - ${24 * reachLevel + 24 + 9.5}px)`,
				left: `${24 * reachLevel + 24 + 9.5}px`
			}}
		>
			{Array.from({
				length: reachLevel - minReachLevel
			}).map((_, i) => (
				<div
					key={`indicator-${id}-${i}`}
					className="absolute top-[3px] h-[1.5px] w-[22px] bg-indicator-light before:absolute before:top-[-1.5px] before:h-1 before:w-[2px] before:bg-indicator-light"
					style={{ left: `-${24 * (i + 1)}px` }}
				></div>
			))}

			<div className="z-50 rounded-[2px] border-t-3 border-r-3 border-b-3 border-l-4 border-transparent border-l-indicator">
				<div className="h-[1.5px] rounded-full bg-indicator"></div>
			</div>
		</div>
	);
}
