import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import {
	ChevronRight,
	MoreVertical,
	Plus,
	TextCursorInput,
	Trash
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { CSSProperties, useState } from 'react';
import { toast } from 'sonner';

import { deleteWithChildren, updateTitle } from '@/actions/catalog-node';
import useEditorStore from '@/components/editor/use-editor-store';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useMutateCatalog } from '@/hooks/use-mutate-catalog';
import { getTranslations } from '@/i18n';
import { deleteNodeWithChildren } from '@/lib/catalog-node-utils/client';
import { cn } from '@/lib/utils';
import { useBook } from '@/stores/use-book';
import useCatalog from '@/stores/use-catalog';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';

import CatalogItemWrapper from './catalog-item-wrapper';
import CreateDropdown from './create-dropdown';
import EditTitleForm from './edit-title-form';
import LevelIndicator from './level-indicator';

export interface CatalogItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	item: CatalogNodeVoWithLevel;
	style?: CSSProperties;
}

const t = getTranslations('app_dashboard_book_main_layout');

const CatalogItem = ({
	dragProvided,
	dragSnapshot,
	item,
	style
}: CatalogItemProps) => {
	const book = useBook();
	const nodeMap = useCatalog((state) => state.nodeMap);
	const expandedKeys = useCatalog((state) => state.expandedKeys);
	const setExpandedKeys = useCatalog((state) => state.setExpandedKeys);
	const mutateCatalog = useMutateCatalog(book.id);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const setTitleToUpdate = useEditorStore((state) => state.setTitleToUpdate);

	const pathname = usePathname();

	const isActive = pathname.includes(`/${book.slug}/${item.url}`);

	const toggleExpandedKey = (key: number) => {
		if (expandedKeys.has(key)) {
			expandedKeys.delete(key);
		} else {
			expandedKeys.add(key);
		}

		setExpandedKeys(expandedKeys);
	};

	const handleClick = () => {
		if (item.type === 'STACK') {
			toggleExpandedKey(item.id);
		} else if (item.type === 'DOC') {
			expandedKeys.add(item.id);
			setExpandedKeys(expandedKeys);
		}
	};

	const handleDelete = () => {
		deleteNodeWithChildren(nodeMap, item.id);
		mutateCatalog(async () => {
			const result = await deleteWithChildren({
				nodeId: item.id,
				bookId: book.id
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			toast.success('删除成功');

			return result.data;
		});
	};

	const handleRename = () => {
		setIsEditingTitle(true);
	};

	const handleSubmit = (title: string) => {
		if (title === item.title) {
			return;
		}

		if (title === '') {
			title = t('default_catalog_node_name');
		}

		const node = nodeMap.get(item.id);

		if (!node) {
			return;
		}

		node.title = title;

		mutateCatalog(async () => {
			setTitleToUpdate(title);
			const result = await updateTitle({
				id: item.id,
				title
			});

			if (!result.success || !result.data) {
				throw new Error(result.message);
			}

			return result.data;
		});

		setIsEditingTitle(false);
	};

	return (
		<div
			{...(isEditingTitle ? void 0 : dragProvided.draggableProps)}
			{...(isEditingTitle ? void 0 : dragProvided.dragHandleProps)}
			ref={dragProvided.innerRef}
			className="group/item"
			style={{
				...style,
				...dragProvided.draggableProps.style,
				cursor: 'pointer'
			}}
		>
			<CatalogItemWrapper
				className={cn(
					'w-full h-[34px] my-px rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center border-[1.5px] border-transparent pr-1.5',
					Boolean(dragSnapshot.combineTargetFor) && 'border-indicator',
					isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
				)}
				isEditingTitle={isEditingTitle}
				item={item}
				style={{ paddingLeft: 24 * item.level + 'px' }}
				onClick={handleClick}
			>
				<div className="mr-1 size-6">
					{item.childId !== null && (
						<Button
							data-prevent-progress
							className="size-6 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
							variant="ghost"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								toggleExpandedKey(item.id);
							}}
						>
							<ChevronRight
								className={cn(
									'transition-transform duration-200',
									expandedKeys.has(item.id) && 'rotate-90'
								)}
								size={16}
							/>
						</Button>
					)}
				</div>

				{isEditingTitle ? (
					<EditTitleForm
						key={item.id}
						defaultTitle={item.title}
						onSubmit={handleSubmit}
					/>
				) : (
					<div className="flex-1 truncate select-none">{item.title}</div>
				)}

				<div
					className={cn(
						'opacity-100 md:opacity-0 md:group-hover/item:opacity-100',
						isEditingTitle && 'invisible'
					)}
				>
					<div className="flex items-center gap-x-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									className="size-6 hover:bg-border"
									size="icon"
									variant="ghost"
								>
									<MoreVertical />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								onClick={(e) => e.stopPropagation()}
							>
								<DropdownMenuItem onClick={handleRename}>
									<TextCursorInput className="mr-2 h-4 w-4" />
									重命名
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleDelete}>
									<Trash className="mr-2 h-4 w-4" />
									删除
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<CreateDropdown parentCatalogNodeId={item.id}>
							<Button
								className="size-6 hover:bg-border"
								size="icon"
								variant="ghost"
							>
								<Plus />
							</Button>
						</CreateDropdown>
					</div>
				</div>
			</CatalogItemWrapper>

			<LevelIndicator id={item.id} />
		</div>
	);
};

export default CatalogItem;
