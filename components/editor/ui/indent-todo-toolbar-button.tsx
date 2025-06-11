'use client';

import {
	useIndentTodoToolBarButton,
	useIndentTodoToolBarButtonState
} from '@udecode/plate-indent-list/react';
import { ListTodoIcon } from 'lucide-react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

const t = getTranslations('notra_editor');

export function IndentTodoToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const state = useIndentTodoToolBarButtonState({ nodeType: 'todo' });
	const { props: buttonProps } = useIndentTodoToolBarButton(state);

	return (
		<ToolbarButton
			{...props}
			{...buttonProps}
			tooltip={t('fixed_toolbar_todo')}
		>
			<ListTodoIcon />
		</ToolbarButton>
	);
}
