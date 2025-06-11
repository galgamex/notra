'use client';

import { DndPlugin } from '@udecode/plate-dnd';
import { PlaceholderPlugin } from '@udecode/plate-media/react';

import { DraggableAboveNodes } from '../ui/draggable';

export const dndPlugin = DndPlugin.configure({
	options: {
		enableScroller: true,
		onDropFiles: ({ dragItem, editor, target }) => {
			editor
				.getTransforms(PlaceholderPlugin)
				.insert.media(dragItem.files, { at: target, nextBlock: false });
		}
	},
	render: {
		aboveNodes: DraggableAboveNodes
	}
});
