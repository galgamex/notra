import { ParagraphPlugin } from '@udecode/plate/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HEADING_LEVELS } from '@udecode/plate-heading';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';

import { FireLiComponent, FireMarker } from '../ui/indent-fire-marker';
import { TodoLi, TodoMarker } from '../ui/indent-todo-marker';

export const indentListPlugin = IndentListPlugin.extend({
	inject: {
		targetPlugins: [
			ParagraphPlugin.key,
			...HEADING_LEVELS,
			BlockquotePlugin.key,
			CodeBlockPlugin.key,
			TogglePlugin.key
		]
	},
	options: {
		listStyleTypes: {
			fire: {
				liComponent: FireLiComponent,
				markerComponent: FireMarker,
				type: 'fire'
			},
			todo: {
				liComponent: TodoLi,
				markerComponent: TodoMarker,
				type: 'todo'
			}
		}
	}
});
