import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { all, createLowlight } from 'lowlight';

import { FixedToolbarPlugin } from './plugins/fixed-toolbar-plugin';

const lowlight = createLowlight(all);

export const editorPlugins = [
	// basic nodes
	HeadingPlugin.configure({ options: { levels: 6 } }),
	BlockquotePlugin,
	CodeBlockPlugin.configure({ options: { lowlight } }),
	BasicMarksPlugin,
	HorizontalRulePlugin,

	// ui
	FixedToolbarPlugin
];
