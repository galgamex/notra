'use client';

import {
	type PlateEditor,
	type PlateElementProps,
	ParagraphPlugin
} from '@udecode/plate/react';
import { PlateElement } from '@udecode/plate/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CalloutPlugin } from '@udecode/plate-callout/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import {
	EquationPlugin,
	InlineEquationPlugin
} from '@udecode/plate-math/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import {
	CalendarIcon,
	ChevronRightIcon,
	Code2,
	Columns3Icon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	Heading4Icon,
	Heading5Icon,
	Heading6Icon,
	LightbulbIcon,
	ListIcon,
	ListOrdered,
	PilcrowIcon,
	Quote,
	RadicalIcon,
	Square,
	Table,
	TableOfContentsIcon
} from 'lucide-react';
import * as React from 'react';

import {
	insertBlock,
	insertInlineElement
} from '@/components/editor/transforms';
import { getTranslations } from '@/i18n';

import {
	InlineCombobox,
	InlineComboboxContent,
	InlineComboboxEmpty,
	InlineComboboxGroup,
	InlineComboboxGroupLabel,
	InlineComboboxInput,
	InlineComboboxItem
} from './inline-combobox';

import type { TSlashInputElement } from '@udecode/plate-slash-command';

type Group = {
	group: string;
	items: Item[];
};

interface Item {
	icon: React.ReactNode;
	value: string;
	onSelect: (editor: PlateEditor, value: string) => void;
	className?: string;
	focusEditor?: boolean;
	keywords?: string[];
	label?: string;
}

const t = getTranslations('notra_editor');

const groups: Group[] = [
	// {
	// 	group: 'AI',
	// 	items: [
	// 		{
	// 			focusEditor: false,
	// 			icon: <SparklesIcon />,
	// 			value: 'AI',
	// 			onSelect: (editor) => {
	// 				editor.getApi(AIChatPlugin).aiChat.show();
	// 			}
	// 		}
	// 	]
	// },
	{
		group: t('slash_input_element_basic_blocks'),
		items: [
			{
				icon: <PilcrowIcon />,
				keywords: ['paragraph'],
				label: t('slash_input_element_text'),
				value: ParagraphPlugin.key
			},
			{
				icon: <Heading1Icon />,
				keywords: ['title', 'h1'],
				label: t('slash_input_element_heading_1'),
				value: HEADING_KEYS.h1
			},
			{
				icon: <Heading2Icon />,
				keywords: ['subtitle', 'h2'],
				label: t('slash_input_element_heading_2'),
				value: HEADING_KEYS.h2
			},
			{
				icon: <Heading3Icon />,
				keywords: ['subtitle', 'h3'],
				label: t('slash_input_element_heading_3'),
				value: HEADING_KEYS.h3
			},
			{
				icon: <Heading4Icon />,
				keywords: ['subtitle', 'h4'],
				label: t('slash_input_element_heading_4'),
				value: HEADING_KEYS.h4
			},
			{
				icon: <Heading5Icon />,
				keywords: ['subtitle', 'h5'],
				label: t('slash_input_element_heading_5'),
				value: HEADING_KEYS.h5
			},
			{
				icon: <Heading6Icon />,
				keywords: ['subtitle', 'h6'],
				label: t('slash_input_element_heading_6'),
				value: HEADING_KEYS.h6
			},
			{
				icon: <ListIcon />,
				keywords: ['unordered', 'ul', '-'],
				label: t('slash_input_element_bulleted_list'),
				value: ListStyleType.Disc
			},
			{
				icon: <ListOrdered />,
				keywords: ['ordered', 'ol', '1'],
				label: t('slash_input_element_numbered_list'),
				value: ListStyleType.Decimal
			},
			{
				icon: <Square />,
				keywords: ['checklist', 'task', 'checkbox', '[]'],
				label: t('slash_input_element_todo_list'),
				value: INDENT_LIST_KEYS.todo
			},
			{
				icon: <ChevronRightIcon />,
				keywords: ['collapsible', 'expandable'],
				label: t('slash_input_element_toggle_list'),
				value: TogglePlugin.key
			},
			{
				icon: <Code2 />,
				keywords: ['```'],
				label: t('slash_input_element_code_block'),
				value: CodeBlockPlugin.key
			},
			{
				icon: <Table />,
				label: t('slash_input_element_table'),
				value: TablePlugin.key
			},
			{
				icon: <Quote />,
				keywords: ['citation', 'blockquote', 'quote', '>'],
				label: t('slash_input_element_quote'),
				value: BlockquotePlugin.key
			},
			{
				description: 'Insert a highlighted block.',
				icon: <LightbulbIcon />,
				keywords: ['note'],
				label: t('slash_input_element_callout'),
				value: CalloutPlugin.key
			}
		].map((item) => ({
			...item,
			onSelect: (editor, value) => {
				insertBlock(editor, value);
			}
		}))
	},
	{
		group: t('slash_input_element_advanced_blocks'),
		items: [
			{
				icon: <TableOfContentsIcon />,
				keywords: ['toc'],
				label: t('slash_input_element_table_of_contents'),
				value: TocPlugin.key
			},
			{
				icon: <Columns3Icon />,
				label: t('slash_input_element_3_columns'),
				value: 'action_three_columns'
			},
			{
				focusEditor: false,
				icon: <RadicalIcon />,
				label: t('slash_input_element_equation'),
				value: EquationPlugin.key
			}
		].map((item) => ({
			...item,
			onSelect: (editor, value) => {
				insertBlock(editor, value);
			}
		}))
	},
	{
		group: t('slash_input_element_inline'),
		items: [
			{
				focusEditor: true,
				icon: <CalendarIcon />,
				keywords: ['time'],
				label: t('slash_input_element_date'),
				value: DatePlugin.key
			},
			{
				focusEditor: false,
				icon: <RadicalIcon />,
				label: t('slash_input_element_inline_equation'),
				value: InlineEquationPlugin.key
			}
		].map((item) => ({
			...item,
			onSelect: (editor, value) => {
				insertInlineElement(editor, value);
			}
		}))
	}
];

export function SlashInputElement(
	props: PlateElementProps<TSlashInputElement>
) {
	const { editor, element } = props;

	return (
		<PlateElement {...props} as="span" data-slate-value={element.value}>
			<InlineCombobox element={element} trigger="/">
				<InlineComboboxInput />

				<InlineComboboxContent>
					<InlineComboboxEmpty>No results</InlineComboboxEmpty>

					{groups.map(({ group, items }) => (
						<InlineComboboxGroup key={group}>
							<InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

							{items.map(
								({ focusEditor, icon, keywords, label, value, onSelect }) => (
									<InlineComboboxItem
										key={value}
										focusEditor={focusEditor}
										group={group}
										keywords={keywords}
										label={label}
										value={value}
										onClick={() => onSelect(editor, value)}
									>
										<div className="mr-2 text-muted-foreground">{icon}</div>
										{label ?? value}
									</InlineComboboxItem>
								)
							)}
						</InlineComboboxGroup>
					))}
				</InlineComboboxContent>
			</InlineCombobox>

			{props.children}
		</PlateElement>
	);
}
