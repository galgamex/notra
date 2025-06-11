'use client';

import { DropdownMenuItemIndicator } from '@radix-ui/react-dropdown-menu';
import {
	ParagraphPlugin,
	useEditorRef,
	useSelectionFragmentProp
} from '@udecode/plate/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import {
	CheckIcon,
	ChevronRightIcon,
	Columns3Icon,
	FileCodeIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	Heading4Icon,
	Heading5Icon,
	Heading6Icon,
	ListIcon,
	ListOrderedIcon,
	PilcrowIcon,
	QuoteIcon,
	SquareIcon
} from 'lucide-react';
import * as React from 'react';

import {
	getBlockType,
	setBlockType,
	STRUCTURAL_TYPES
} from '@/components/editor/transforms';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import { ToolbarButton, ToolbarMenuGroup } from './toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import type { TElement } from '@udecode/plate';

const t = getTranslations('notra_editor');

const turnIntoItems = [
	{
		icon: <PilcrowIcon />,
		keywords: ['paragraph'],
		label: t('fixed_toolbar_text'),
		value: ParagraphPlugin.key
	},
	{
		icon: <Heading1Icon />,
		keywords: ['title', 'h1'],
		label: t('fixed_toolbar_heading_1'),
		value: HEADING_KEYS.h1
	},
	{
		icon: <Heading2Icon />,
		keywords: ['subtitle', 'h2'],
		label: t('fixed_toolbar_heading_2'),
		value: HEADING_KEYS.h2
	},
	{
		icon: <Heading3Icon />,
		keywords: ['subtitle', 'h3'],
		label: t('fixed_toolbar_heading_3'),
		value: HEADING_KEYS.h3
	},
	{
		icon: <Heading4Icon />,
		keywords: ['subtitle', 'h4'],
		label: t('fixed_toolbar_heading_4'),
		value: HEADING_KEYS.h4
	},
	{
		icon: <Heading5Icon />,
		keywords: ['subtitle', 'h5'],
		label: t('fixed_toolbar_heading_5'),
		value: HEADING_KEYS.h5
	},
	{
		icon: <Heading6Icon />,
		keywords: ['subtitle', 'h6'],
		label: t('fixed_toolbar_heading_6'),
		value: HEADING_KEYS.h6
	},
	{
		icon: <ListIcon />,
		keywords: ['unordered', 'ul', '-'],
		label: t('fixed_toolbar_bulleted_list'),
		value: ListStyleType.Disc
	},
	{
		icon: <ListOrderedIcon />,
		keywords: ['ordered', 'ol', '1'],
		label: t('fixed_toolbar_numbered_list'),
		value: ListStyleType.Decimal
	},
	{
		icon: <SquareIcon />,
		keywords: ['checklist', 'task', 'checkbox', '[]'],
		label: t('fixed_toolbar_todo_list'),
		value: INDENT_LIST_KEYS.todo
	},
	{
		icon: <ChevronRightIcon />,
		keywords: ['collapsible', 'expandable'],
		label: t('fixed_toolbar_toggle_list'),
		value: TogglePlugin.key
	},
	{
		icon: <FileCodeIcon />,
		keywords: ['```'],
		label: t('fixed_toolbar_code_block'),
		value: CodeBlockPlugin.key
	},
	{
		icon: <QuoteIcon />,
		keywords: ['citation', 'blockquote', '>'],
		label: t('fixed_toolbar_quote'),
		value: BlockquotePlugin.key
	},
	{
		icon: <Columns3Icon />,
		label: t('fixed_toolbar_3_columns'),
		value: 'action_three_columns'
	}
];

export function TurnIntoDropdownMenu(props: Readonly<DropdownMenuProps>) {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	const value = useSelectionFragmentProp({
		defaultValue: ParagraphPlugin.key,
		structuralTypes: STRUCTURAL_TYPES,
		getProp: (node) => getBlockType(node as TElement)
	});
	const selectedItem = React.useMemo(
		() =>
			turnIntoItems.find(
				(item) => item.value === (value ?? ParagraphPlugin.key)
			) ?? turnIntoItems[0],
		[value]
	);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					isDropdown
					className="min-w-[125px]"
					pressed={open}
					tooltip="Turn into"
				>
					{selectedItem.label}
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				// eslint-disable-next-line tailwindcss/no-custom-classname
				className="ignore-click-outside/toolbar min-w-0"
				onCloseAutoFocus={(e) => {
					e.preventDefault();
					editor.tf.focus();
				}}
			>
				<ToolbarMenuGroup
					label={t('fixed_toolbar_turn_into')}
					value={value}
					onValueChange={(type) => {
						setBlockType(editor, type);
					}}
				>
					{turnIntoItems.map(({ icon, label, value: itemValue }) => (
						<DropdownMenuRadioItem
							key={itemValue}
							className="min-w-[180px] pl-2 *:first:[span]:hidden"
							value={itemValue}
						>
							<span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
								<DropdownMenuItemIndicator>
									<CheckIcon />
								</DropdownMenuItemIndicator>
							</span>
							{icon}
							{label}
						</DropdownMenuRadioItem>
					))}
				</ToolbarMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
