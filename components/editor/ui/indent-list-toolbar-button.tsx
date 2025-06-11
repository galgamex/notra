'use client';

import { useEditorRef, useEditorSelector } from '@udecode/plate/react';
import {
	ListStyleType,
	someIndentList,
	toggleIndentList
} from '@udecode/plate-indent-list';
import { List, ListOrdered } from 'lucide-react';
import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import {
	ToolbarSplitButton,
	ToolbarSplitButtonPrimary,
	ToolbarSplitButtonSecondary
} from './toolbar';

const t = getTranslations('notra_editor');

export function NumberedIndentListToolbarButton() {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	const pressed = useEditorSelector(
		(editor) =>
			someIndentList(editor, [
				ListStyleType.Decimal,
				ListStyleType.LowerAlpha,
				ListStyleType.UpperAlpha,
				ListStyleType.LowerRoman,
				ListStyleType.UpperRoman
			]),
		[]
	);

	return (
		<ToolbarSplitButton pressed={open}>
			<ToolbarSplitButtonPrimary
				className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
				data-state={pressed ? 'on' : 'off'}
				onClick={() =>
					toggleIndentList(editor, {
						listStyleType: ListStyleType.Decimal
					})
				}
			>
				<ListOrdered className="size-4" />
			</ToolbarSplitButtonPrimary>

			<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<ToolbarSplitButtonSecondary />
				</DropdownMenuTrigger>

				<DropdownMenuContent align="start" alignOffset={-32}>
					<DropdownMenuGroup>
						<DropdownMenuItem
							onSelect={() =>
								toggleIndentList(editor, {
									listStyleType: ListStyleType.Decimal
								})
							}
						>
							{t('fixed_toolbar_decimal')}
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								toggleIndentList(editor, {
									listStyleType: ListStyleType.LowerAlpha
								})
							}
						>
							{t('fixed_toolbar_lower_alpha')}
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								toggleIndentList(editor, {
									listStyleType: ListStyleType.UpperAlpha
								})
							}
						>
							{t('fixed_toolbar_upper_alpha')}
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								toggleIndentList(editor, {
									listStyleType: ListStyleType.LowerRoman
								})
							}
						>
							{t('fixed_toolbar_lower_roman')}
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								toggleIndentList(editor, {
									listStyleType: ListStyleType.UpperRoman
								})
							}
						>
							{t('fixed_toolbar_upper_roman')}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</ToolbarSplitButton>
	);
}

export function BulletedIndentListToolbarButton() {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	const pressed = useEditorSelector(
		(editor) =>
			someIndentList(editor, [
				ListStyleType.Disc,
				ListStyleType.Circle,
				ListStyleType.Square
			]),
		[]
	);

	return (
		<ToolbarSplitButton pressed={open}>
			<ToolbarSplitButtonPrimary
				className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
				data-state={pressed ? 'on' : 'off'}
				onClick={() => {
					toggleIndentList(editor, {
						listStyleType: ListStyleType.Disc
					});
				}}
			>
				<List className="size-4" />
			</ToolbarSplitButtonPrimary>

			<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<ToolbarSplitButtonSecondary />
				</DropdownMenuTrigger>

				<DropdownMenuContent align="start" alignOffset={-32}>
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() =>
								toggleIndentList(editor, {
									listStyleType: ListStyleType.Disc
								})
							}
						>
							<div className="flex items-center gap-2">
								<div className="size-2 rounded-full border border-current bg-current" />
								{t('fixed_toolbar_default')}
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								toggleIndentList(editor, {
									listStyleType: ListStyleType.Circle
								})
							}
						>
							<div className="flex items-center gap-2">
								<div className="size-2 rounded-full border border-current" />
								{t('fixed_toolbar_circle')}
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								toggleIndentList(editor, {
									listStyleType: ListStyleType.Square
								})
							}
						>
							<div className="flex items-center gap-2">
								<div className="size-2 border border-current bg-current" />
								{t('fixed_toolbar_square')}
							</div>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</ToolbarSplitButton>
	);
}
