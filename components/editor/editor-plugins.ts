import emojiMartData, { EmojiMartData } from '@emoji-mart/data';
import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CalloutPlugin } from '@udecode/plate-callout/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
	FontSizePlugin
} from '@udecode/plate-font/react';
import { HeadingPlugin, TocPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { SlashPlugin } from '@udecode/plate-slash-command/react';
import { BaseSuggestionPlugin } from '@udecode/plate-suggestion';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { all, createLowlight } from 'lowlight';

import { alignPlugin } from './plugins/align-plugin';
import { autoformatPlugin } from './plugins/autoformat-plugin';
import { blockSelectionPlugin } from './plugins/block-selection-plugins';
import { dndPlugin } from './plugins/dnd-plugin';
import { exitBreakPlugin } from './plugins/exit-break-plugin';
import { FixedToolbarPlugin } from './plugins/fixed-toolbar-plugin';
import { indentListPlugin } from './plugins/indent-list-plugin';
import { indentPlugin } from './plugins/indent-plugin';
import { lineHeightPlugin } from './plugins/line-height-plugin';
import { resetBlockTypePlugin } from './plugins/reset-block-type-plugin';
import { softBreakPlugin } from './plugins/soft-break-plugin';

const lowlight = createLowlight(all);

export const editorPlugins = [
	// basic blocks
	HeadingPlugin.configure({ options: { levels: 6 } }),
	BlockquotePlugin,
	CodeBlockPlugin.configure({ options: { lowlight } }),
	HorizontalRulePlugin,
	TablePlugin,
	CalloutPlugin,

	// advanced blocks
	TocPlugin.configure({
		options: {
			topOffset: 80
		}
	}),
	ColumnPlugin,

	// lists
	indentListPlugin,
	TogglePlugin,

	// marks
	BasicMarksPlugin,
	KbdPlugin,

	// font
	FontColorPlugin,
	FontBackgroundColorPlugin,
	FontSizePlugin,

	// format
	alignPlugin,
	autoformatPlugin,
	indentPlugin,
	lineHeightPlugin,

	// functionality
	blockSelectionPlugin,
	NodeIdPlugin,
	exitBreakPlugin,
	softBreakPlugin,
	dndPlugin,
	SlashPlugin.extend({
		options: {
			triggerQuery(editor) {
				return !editor.api.some({
					match: { type: editor.getType(CodeBlockPlugin) }
				});
			}
		}
	}),
	resetBlockTypePlugin,
	TrailingBlockPlugin,
	BaseSuggestionPlugin,
	EmojiPlugin.configure({ options: { data: emojiMartData as EmojiMartData } }),

	// ui
	FixedToolbarPlugin
];
