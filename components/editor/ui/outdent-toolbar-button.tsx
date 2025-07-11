'use client';

import { useOutdentButton } from '@udecode/plate-indent/react';
import { Outdent } from 'lucide-react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

const t = getTranslations('notra_editor');

export function OutdentToolbarButton(
	props: React.ComponentProps<typeof ToolbarButton>
) {
	const { props: buttonProps } = useOutdentButton();

	return (
		<ToolbarButton
			{...props}
			{...buttonProps}
			tooltip={t('fixed_toolbar_outdent')}
		>
			<Outdent />
		</ToolbarButton>
	);
}
