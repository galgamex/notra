'use client';

import { useEditorPlugin, useEditorSelector } from '@udecode/plate/react';
import { TablePlugin, useTableMergeState } from '@udecode/plate-table/react';
import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	Combine,
	Grid3x3Icon,
	Table,
	Trash2Icon,
	Ungroup,
	XIcon
} from 'lucide-react';
import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

import { ToolbarButton } from './toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

const t = getTranslations('notra_editor');

export function TableDropdownMenu(props: DropdownMenuProps) {
	const tableSelected = useEditorSelector(
		(editor) => editor.api.some({ match: { type: TablePlugin.key } }),
		[]
	);

	const { editor, tf } = useEditorPlugin(TablePlugin);
	const [open, setOpen] = React.useState(false);
	const mergeState = useTableMergeState();

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					isDropdown
					pressed={open}
					tooltip={t('fixed_toolbar_table')}
				>
					<Table />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				className="flex w-[180px] min-w-0 flex-col"
			>
				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="gap-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
							<Grid3x3Icon className="size-4" />
							<span>{t('fixed_toolbar_table')}</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="m-0 p-0">
							<TablePicker />
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger
							className="gap-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
							disabled={!tableSelected}
						>
							<div className="size-4" />
							<span>{t('fixed_toolbar_cell')}</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem
								className="min-w-[180px]"
								disabled={!mergeState.canMerge}
								onSelect={() => {
									tf.table.merge();
									editor.tf.focus();
								}}
							>
								<Combine />
								{t('fixed_toolbar_merge_cells')}
							</DropdownMenuItem>
							<DropdownMenuItem
								className="min-w-[180px]"
								disabled={!mergeState.canSplit}
								onSelect={() => {
									tf.table.split();
									editor.tf.focus();
								}}
							>
								<Ungroup />
								{t('fixed_toolbar_split_cell')}
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger
							className="gap-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
							disabled={!tableSelected}
						>
							<div className="size-4" />
							<span>{t('fixed_toolbar_row')}</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem
								className="min-w-[180px]"
								disabled={!tableSelected}
								onSelect={() => {
									tf.insert.tableRow({ before: true });
									editor.tf.focus();
								}}
							>
								<ArrowUp />
								{t('fixed_toolbar_insert_row_before')}
							</DropdownMenuItem>
							<DropdownMenuItem
								className="min-w-[180px]"
								disabled={!tableSelected}
								onSelect={() => {
									tf.insert.tableRow();
									editor.tf.focus();
								}}
							>
								<ArrowDown />
								{t('fixed_toolbar_insert_row_after')}
							</DropdownMenuItem>
							<DropdownMenuItem
								className="min-w-[180px]"
								disabled={!tableSelected}
								onSelect={() => {
									tf.remove.tableRow();
									editor.tf.focus();
								}}
							>
								<XIcon />
								{t('fixed_toolbar_delete_row')}
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger
							className="gap-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
							disabled={!tableSelected}
						>
							<div className="size-4" />
							<span>{t('fixed_toolbar_column')}</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem
								className="min-w-[180px]"
								disabled={!tableSelected}
								onSelect={() => {
									tf.insert.tableColumn({ before: true });
									editor.tf.focus();
								}}
							>
								<ArrowLeft />
								{t('fixed_toolbar_insert_column_before')}
							</DropdownMenuItem>
							<DropdownMenuItem
								className="min-w-[180px]"
								disabled={!tableSelected}
								onSelect={() => {
									tf.insert.tableColumn();
									editor.tf.focus();
								}}
							>
								<ArrowRight />
								{t('fixed_toolbar_insert_column_after')}
							</DropdownMenuItem>
							<DropdownMenuItem
								className="min-w-[180px]"
								disabled={!tableSelected}
								onSelect={() => {
									tf.remove.tableColumn();
									editor.tf.focus();
								}}
							>
								<XIcon />
								{t('fixed_toolbar_delete_column')}
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuItem
						className="min-w-[180px]"
						disabled={!tableSelected}
						onSelect={() => {
							tf.remove.table();
							editor.tf.focus();
						}}
					>
						<Trash2Icon />
						{t('fixed_toolbar_delete_table')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function TablePicker() {
	const { editor, tf } = useEditorPlugin(TablePlugin);

	const [tablePicker, setTablePicker] = React.useState({
		grid: Array.from({ length: 8 }, () => Array.from({ length: 8 }).fill(0)),
		size: { colCount: 0, rowCount: 0 }
	});

	const onCellMove = (rowIndex: number, colIndex: number) => {
		const newGrid = [...tablePicker.grid];

		for (let i = 0; i < newGrid.length; i++) {
			for (let j = 0; j < newGrid[i].length; j++) {
				newGrid[i][j] =
					i >= 0 && i <= rowIndex && j >= 0 && j <= colIndex ? 1 : 0;
			}
		}

		setTablePicker({
			grid: newGrid,
			size: { colCount: colIndex + 1, rowCount: rowIndex + 1 }
		});
	};

	return (
		<div
			className="m-0 flex! flex-col p-0"
			onClick={() => {
				tf.insert.table(tablePicker.size, { select: true });
				editor.tf.focus();
			}}
		>
			<div className="grid size-[130px] grid-cols-8 gap-0.5 p-1">
				{tablePicker.grid.map((rows, rowIndex) =>
					rows.map((value, columIndex) => {
						return (
							<div
								key={`(${rowIndex},${columIndex})`}
								className={cn(
									'col-span-1 size-3 border border-solid bg-secondary',
									!!value && 'border-current'
								)}
								onMouseMove={() => {
									onCellMove(rowIndex, columIndex);
								}}
							/>
						);
					})
				)}
			</div>

			<div className="text-center text-xs text-current">
				{tablePicker.size.rowCount} x {tablePicker.size.colCount}
			</div>
		</div>
	);
}
