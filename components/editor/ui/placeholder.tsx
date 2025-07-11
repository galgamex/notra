'use client';

import { ParagraphPlugin } from '@udecode/plate/react';
import {
	type PlaceholderProps,
	createNodeHOC,
	createNodesHOC,
	usePlaceholderState
} from '@udecode/plate/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import * as React from 'react';

import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

const t = getTranslations('notra_editor');

export const Placeholder = (props: PlaceholderProps) => {
	const { attributes, children, placeholder } = props;

	const { enabled } = usePlaceholderState(props);

	return React.Children.map(children, (child) => {
		return React.cloneElement(child, {
			attributes: {
				...attributes,
				className: cn(
					attributes.className,
					enabled &&
						'before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]'
				),
				placeholder
			}
		});
	});
};

export const withPlaceholder = createNodeHOC(Placeholder);

export const withPlaceholdersPrimitive = createNodesHOC(Placeholder);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPlaceholders = (components: any) =>
	withPlaceholdersPrimitive(components, [
		{
			key: ParagraphPlugin.key,
			hideOnBlur: true,
			placeholder: t('placeholder_paragraph'),
			query: {
				maxLevel: 1
			}
		},
		{
			key: HEADING_KEYS.h1,
			hideOnBlur: false,
			placeholder: t('placeholder_heading_1')
		}
	]);
