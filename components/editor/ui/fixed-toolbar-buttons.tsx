'use client';

import { useEditorReadOnly } from '@udecode/plate/react';
import {
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	UnderlinePlugin
} from '@udecode/plate-basic-marks/react';
import {
	BoldIcon,
	Code2Icon,
	ItalicIcon,
	StrikethroughIcon,
	UnderlineIcon
} from 'lucide-react';

import { getTranslations } from '@/i18n';

import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { ToolbarGroup } from './toolbar';

const t = getTranslations('notra_editor');

export function FixedToolbarButtons() {
	const readOnly = useEditorReadOnly();

	return (
		<div className="flex w-full">
			{!readOnly && (
				<>
					<ToolbarGroup>
						<UndoToolbarButton />
						<RedoToolbarButton />
					</ToolbarGroup>

					<ToolbarGroup>
						<MarkToolbarButton
							nodeType={BoldPlugin.key}
							tooltip={t('fixed_toolbar_bold')}
						>
							<BoldIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={ItalicPlugin.key}
							tooltip={t('fixed_toolbar_italic')}
						>
							<ItalicIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={UnderlinePlugin.key}
							tooltip={t('fixed_toolbar_underline')}
						>
							<UnderlineIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={StrikethroughPlugin.key}
							tooltip={t('fixed_toolbar_strikethrough')}
						>
							<StrikethroughIcon />
						</MarkToolbarButton>

						<MarkToolbarButton
							nodeType={CodePlugin.key}
							tooltip={t('fixed_toolbar_code_inline')}
						>
							<Code2Icon />
						</MarkToolbarButton>
					</ToolbarGroup>
				</>
			)}
		</div>
	);
}
