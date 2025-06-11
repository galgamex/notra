'use client';

import { PopoverAnchor } from '@radix-ui/react-popover';
import {
	type PlateElementProps,
	PlateElement,
	useEditorPlugin,
	useEditorRef,
	useEditorSelector,
	useElement,
	usePluginOption,
	useReadOnly,
	useRemoveNodeButton,
	useSelected,
	withHOC
} from '@udecode/plate/react';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import { setCellBackground } from '@udecode/plate-table';
import {
	TablePlugin,
	TableProvider,
	useTableBordersDropdownMenuContentState,
	useTableElement,
	useTableMergeState
} from '@udecode/plate-table/react';
import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	CombineIcon,
	EraserIcon,
	Grid2X2Icon,
	PaintBucketIcon,
	SquareSplitHorizontalIcon,
	Trash2Icon,
	XIcon
} from 'lucide-react';
import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

import { DEFAULT_COLORS } from './color-constants';
import { ColorDropdownMenuItems } from './color-dropdown-menu-items';
import {
	BorderAll,
	BorderBottom,
	BorderLeft,
	BorderNone,
	BorderRight,
	BorderTop
} from './table-icons';
import {
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	ToolbarMenuGroup
} from './toolbar';

import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { TTableElement } from '@udecode/plate-table';

const t = getTranslations('notra_editor');

export const TableElement = withHOC(
	TableProvider,
	function TableElement({
		children,
		...props
	}: PlateElementProps<TTableElement>) {
		const readOnly = useReadOnly();
		const isSelectionAreaVisible = usePluginOption(
			BlockSelectionPlugin,
			'isSelectionAreaVisible'
		);
		const hasControls = !readOnly && !isSelectionAreaVisible;
		const selected = useSelected();
		const {
			isSelectingCell,
			marginLeft,
			props: tableProps
		} = useTableElement();

		const content = (
			<PlateElement
				{...props}
				className={cn(
					'overflow-x-auto py-5',
					hasControls && '-ml-2 *:data-[slot=block-selection]:left-2'
				)}
				style={{ paddingLeft: marginLeft }}
			>
				<div className="group/table relative w-fit">
					<table
						className={cn(
							'mr-0 ml-px table h-px table-fixed border-collapse',
							isSelectingCell && 'selection:bg-transparent'
						)}
						{...tableProps}
					>
						<tbody className="min-w-full">{children}</tbody>
					</table>
				</div>
			</PlateElement>
		);

		if (readOnly || !selected) {
			return content;
		}

		return <TableFloatingToolbar>{content}</TableFloatingToolbar>;
	}
);

export function TableFloatingToolbar({
	children,
	...props
}: React.ComponentProps<typeof PopoverContent>) {
	const { tf } = useEditorPlugin(TablePlugin);
	const element = useElement<TTableElement>();
	const { props: buttonProps } = useRemoveNodeButton({ element });
	const collapsed = useEditorSelector((editor) => !editor.api.isExpanded(), []);

	const { canMerge, canSplit } = useTableMergeState();

	return (
		<Popover modal={false} open={canMerge || canSplit || collapsed}>
			<PopoverAnchor asChild>{children}</PopoverAnchor>
			<PopoverContent
				asChild
				contentEditable={false}
				onOpenAutoFocus={(e) => e.preventDefault()}
				{...props}
			>
				<Toolbar
					// eslint-disable-next-line tailwindcss/no-custom-classname
					className="scrollbar-hide flex w-auto max-w-[80vw] flex-row overflow-x-auto rounded-md border bg-popover p-1 shadow-md print:hidden"
					contentEditable={false}
				>
					<ToolbarGroup>
						<ColorDropdownMenu
							tooltip={t('table_floating_toolbar_background_color')}
						>
							<PaintBucketIcon />
						</ColorDropdownMenu>
						{canMerge && (
							<ToolbarButton
								tooltip={t('table_floating_toolbar_merge_cells')}
								onClick={() => tf.table.merge()}
								onMouseDown={(e) => e.preventDefault()}
							>
								<CombineIcon />
							</ToolbarButton>
						)}
						{canSplit && (
							<ToolbarButton
								tooltip={t('table_floating_toolbar_split_cell')}
								onClick={() => tf.table.split()}
								onMouseDown={(e) => e.preventDefault()}
							>
								<SquareSplitHorizontalIcon />
							</ToolbarButton>
						)}

						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<ToolbarButton
									tooltip={t('table_floating_toolbar_cell_borders')}
								>
									<Grid2X2Icon />
								</ToolbarButton>
							</DropdownMenuTrigger>

							<DropdownMenuPortal>
								<TableBordersDropdownMenuContent />
							</DropdownMenuPortal>
						</DropdownMenu>

						{collapsed && (
							<ToolbarGroup>
								<ToolbarButton
									tooltip={t('table_floating_toolbar_delete_table')}
									{...buttonProps}
								>
									<Trash2Icon />
								</ToolbarButton>
							</ToolbarGroup>
						)}
					</ToolbarGroup>

					{collapsed && (
						<ToolbarGroup>
							<ToolbarButton
								tooltip={t('table_floating_toolbar_insert_row_before')}
								onClick={() => {
									tf.insert.tableRow({ before: true });
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<ArrowUp />
							</ToolbarButton>
							<ToolbarButton
								tooltip={t('table_floating_toolbar_insert_row_after')}
								onClick={() => {
									tf.insert.tableRow();
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<ArrowDown />
							</ToolbarButton>
							<ToolbarButton
								tooltip={t('table_floating_toolbar_delete_row')}
								onClick={() => {
									tf.remove.tableRow();
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<XIcon />
							</ToolbarButton>
						</ToolbarGroup>
					)}

					{collapsed && (
						<ToolbarGroup>
							<ToolbarButton
								tooltip={t('table_floating_toolbar_insert_column_before')}
								onClick={() => {
									tf.insert.tableColumn({ before: true });
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<ArrowLeft />
							</ToolbarButton>
							<ToolbarButton
								tooltip={t('table_floating_toolbar_insert_column_after')}
								onClick={() => {
									tf.insert.tableColumn();
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<ArrowRight />
							</ToolbarButton>
							<ToolbarButton
								tooltip={t('table_floating_toolbar_delete_column')}
								onClick={() => {
									tf.remove.tableColumn();
								}}
								onMouseDown={(e) => e.preventDefault()}
							>
								<XIcon />
							</ToolbarButton>
						</ToolbarGroup>
					)}
				</Toolbar>
			</PopoverContent>
		</Popover>
	);
}

export function TableBordersDropdownMenuContent(
	props: React.ComponentProps<typeof DropdownMenuPrimitive.Content>
) {
	const editor = useEditorRef();
	const {
		getOnSelectTableBorder,
		hasBottomBorder,
		hasLeftBorder,
		hasNoBorders,
		hasOuterBorders,
		hasRightBorder,
		hasTopBorder
	} = useTableBordersDropdownMenuContentState();

	return (
		<DropdownMenuContent
			align="start"
			className="min-w-[220px]"
			side="right"
			sideOffset={0}
			onCloseAutoFocus={(e) => {
				e.preventDefault();
				editor.tf.focus();
			}}
			{...props}
		>
			<DropdownMenuGroup>
				<DropdownMenuCheckboxItem
					checked={hasTopBorder}
					onCheckedChange={getOnSelectTableBorder('top')}
				>
					<BorderTop />
					<div>{t('table_floating_toolbar_top_border')}</div>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={hasRightBorder}
					onCheckedChange={getOnSelectTableBorder('right')}
				>
					<BorderRight />
					<div>{t('table_floating_toolbar_right_border')}</div>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={hasBottomBorder}
					onCheckedChange={getOnSelectTableBorder('bottom')}
				>
					<BorderBottom />
					<div>{t('table_floating_toolbar_bottom_border')}</div>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={hasLeftBorder}
					onCheckedChange={getOnSelectTableBorder('left')}
				>
					<BorderLeft />
					<div>{t('table_floating_toolbar_left_border')}</div>
				</DropdownMenuCheckboxItem>
			</DropdownMenuGroup>

			<DropdownMenuGroup>
				<DropdownMenuCheckboxItem
					checked={hasNoBorders}
					onCheckedChange={getOnSelectTableBorder('none')}
				>
					<BorderNone />
					<div>{t('table_floating_toolbar_no_border')}</div>
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={hasOuterBorders}
					onCheckedChange={getOnSelectTableBorder('outer')}
				>
					<BorderAll />
					<div>{t('table_floating_toolbar_outside_borders')}</div>
				</DropdownMenuCheckboxItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	);
}

type ColorDropdownMenuProps = {
	children: React.ReactNode;
	tooltip: string;
};

function ColorDropdownMenu({
	children,
	tooltip
}: Readonly<ColorDropdownMenuProps>) {
	const [open, setOpen] = React.useState(false);

	const editor = useEditorRef();
	const selectedCells = usePluginOption(TablePlugin, 'selectedCells');

	const onUpdateColor = React.useCallback(
		(color: string) => {
			setOpen(false);
			setCellBackground(editor, { color, selectedCells: selectedCells ?? [] });
		},
		[selectedCells, editor]
	);

	const onClearColor = React.useCallback(() => {
		setOpen(false);
		setCellBackground(editor, {
			color: null,
			selectedCells: selectedCells ?? []
		});
	}, [selectedCells, editor]);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton tooltip={tooltip}>{children}</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start">
				<ToolbarMenuGroup label="Colors">
					<ColorDropdownMenuItems
						className="px-2"
						colors={DEFAULT_COLORS}
						updateColor={onUpdateColor}
					/>
				</ToolbarMenuGroup>
				<DropdownMenuGroup>
					<DropdownMenuItem className="p-2" onClick={onClearColor}>
						<EraserIcon />
						<span>Clear</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
