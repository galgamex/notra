'use client';

import {
	useToggleToolbarButton,
	useToggleToolbarButtonState
} from '@udecode/plate-toggle/react';
import { ListCollapseIcon } from 'lucide-react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

const t = getTranslations('notra_editor');

export function ToggleToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const state = useToggleToolbarButtonState();
	const { props: buttonProps } = useToggleToolbarButton(state);

	return (
		<ToolbarButton
			{...props}
			{...buttonProps}
			tooltip={t('fixed_toolbar_toggle')}
		>
			<ListCollapseIcon />
		</ToolbarButton>
	);
}
