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
	FontBackgroundColorPlugin,
	FontColorPlugin
} from '@udecode/plate-font/react';
import {
	BaselineIcon,
	BoldIcon,
	Code2Icon,
	ItalicIcon,
	PaintBucketIcon,
	StrikethroughIcon,
	UnderlineIcon
} from 'lucide-react';

import { getTranslations } from '@/i18n';

import { AlignDropdownMenu } from './align-dropdown-menu';
import { ColorDropdownMenu } from './color-dropdown-menu';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import {
	BulletedIndentListToolbarButton,
	NumberedIndentListToolbarButton
} from './indent-list-toolbar-button';
import { IndentTodoToolbarButton } from './indent-todo-toolbar-button';
import { IndentToolbarButton } from './indent-toolbar-button';
import { LineHeightDropdownMenu } from './line-height-dropdown-menu';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MoreDropdownMenu } from './more-dropdown-menu';
import { OutdentToolbarButton } from './outdent-toolbar-button';
import { TableDropdownMenu } from './table-dropdown-menu';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu';

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
						<TurnIntoDropdownMenu />
					</ToolbarGroup>

					<ToolbarGroup>
						<FontSizeToolbarButton />
					</ToolbarGroup>

					<ToolbarGroup>
						<ColorDropdownMenu
							nodeType={FontColorPlugin.key}
							tooltip={t('fixed_toolbar_text_color')}
						>
							<BaselineIcon />
						</ColorDropdownMenu>

						<ColorDropdownMenu
							nodeType={FontBackgroundColorPlugin.key}
							tooltip={t('fixed_toolbar_background_color')}
						>
							<PaintBucketIcon />
						</ColorDropdownMenu>
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

						<MoreDropdownMenu />
					</ToolbarGroup>

					<ToolbarGroup>
						<NumberedIndentListToolbarButton />
						<BulletedIndentListToolbarButton />
						<IndentTodoToolbarButton />
						<ToggleToolbarButton />
					</ToolbarGroup>

					<ToolbarGroup>
						<TableDropdownMenu />
					</ToolbarGroup>

					<ToolbarGroup>
						<AlignDropdownMenu />
						<OutdentToolbarButton />
						<IndentToolbarButton />
						<LineHeightDropdownMenu />
					</ToolbarGroup>
				</>
			)}
		</div>
	);
}
