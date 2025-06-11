'use client';

import { useIndentButton } from '@udecode/plate-indent/react';
import { Indent } from 'lucide-react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

const t = getTranslations('notra_editor');

export function IndentToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const { props: buttonProps } = useIndentButton();

	return (
		<ToolbarButton
			{...props}
			{...buttonProps}
			tooltip={t('fixed_toolbar_indent')}
		>
			<Indent />
		</ToolbarButton>
	);
}
