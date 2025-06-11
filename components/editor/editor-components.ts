import { withProps } from '@udecode/cn';
import { ParagraphPlugin, PlateLeaf } from '@udecode/plate/react';
import {
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	SubscriptPlugin,
	SuperscriptPlugin,
	UnderlinePlugin
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import {
	CodeBlockPlugin,
	CodeLinePlugin,
	CodeSyntaxPlugin
} from '@udecode/plate-code-block/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { SlashInputPlugin } from '@udecode/plate-slash-command/react';
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
	TablePlugin,
	TableRowPlugin
} from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';

import { BlockquoteElement } from './ui/blockquote-element';
import { CodeBlockElement } from './ui/code-block-element';
import { CodeLeaf } from './ui/code-leaf';
import { CodeLineElement } from './ui/code-line-element';
import { CodeSyntaxLeaf } from './ui/code-syntax-leaf';
import { HeadingElement } from './ui/heading-element';
import { HrElement } from './ui/hr-element';
import { KbdLeaf } from './ui/kbd-leaf';
import { ParagraphElement } from './ui/paragraph-element';
import { SlashInputElement } from './ui/slash-input-element';
import {
	TableCellElement,
	TableCellHeaderElement
} from './ui/table-cell-element';
import { TableElement } from './ui/table-element';
import { TableRowElement } from './ui/table-row-element';
import { TocElement } from './ui/toc-element';
import { ToggleElement } from './ui/toggle-element';

export const editorComponents = {
	// blocks
	[HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
	[HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
	[HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
	[HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
	[HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
	[HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
	[BlockquotePlugin.key]: BlockquoteElement,
	[CodeBlockPlugin.key]: CodeBlockElement,
	[HorizontalRulePlugin.key]: HrElement,

	// advanced blocks
	[TablePlugin.key]: TableElement,
	[TableRowPlugin.key]: TableRowElement,
	[TableCellPlugin.key]: TableCellElement,
	[TableCellHeaderPlugin.key]: TableCellHeaderElement,
	[TocPlugin.key]: TocElement,

	// lists
	[TogglePlugin.key]: ToggleElement,

	// marks
	[BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
	[ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
	[UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
	[StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
	[SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
	[SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
	[CodePlugin.key]: CodeLeaf,
	[KbdPlugin.key]: KbdLeaf,

	// format
	[CodeLinePlugin.key]: CodeLineElement,
	[CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
	[ParagraphPlugin.key]: ParagraphElement,

	// functionality
	[SlashInputPlugin.key]: SlashInputElement
};
