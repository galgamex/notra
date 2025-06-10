import { withProps } from '@udecode/cn';
import { PlateLeaf } from '@udecode/plate/react';
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

import { BlockquoteElement } from './ui/blockquote-element';
import { CodeBlockElement } from './ui/code-block-element';
import { CodeLeaf } from './ui/code-leaf';
import { CodeLineElement } from './ui/code-line-element';
import { CodeSyntaxLeaf } from './ui/code-syntax-leaf';
import { HeadingElement } from './ui/heading-element';

export const editorComponents = {
	// basic nodes
	[HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
	[HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
	[HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
	[HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
	[HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
	[HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
	[BlockquotePlugin.key]: BlockquoteElement,
	[CodeBlockPlugin.key]: CodeBlockElement,
	[CodeLinePlugin.key]: CodeLineElement,
	[CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
	[BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
	[ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
	[UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
	[StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
	[SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
	[SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
	[CodePlugin.key]: CodeLeaf
};
