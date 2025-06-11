'use client';

import { useEditorRef } from '@udecode/plate/react';
import {
	SubscriptPlugin,
	SuperscriptPlugin
} from '@udecode/plate-basic-marks/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import {
	KeyboardIcon,
	MoreHorizontalIcon,
	SubscriptIcon,
	SuperscriptIcon
} from 'lucide-react';
import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

const t = getTranslations('notra_editor');

export function MoreDropdownMenu(props: Readonly<DropdownMenuProps>) {
	const editor = useEditorRef();
	const [open, setOpen] = React.useState(false);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					pressed={open}
					tooltip={t('fixed_toolbar_more_text_styles')}
				>
					<MoreHorizontalIcon />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				// eslint-disable-next-line tailwindcss/no-custom-classname
				className="ignore-click-outside/toolbar flex max-h-[500px] min-w-[180px] flex-col overflow-y-auto"
			>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onSelect={() => {
							editor.tf.toggleMark(KbdPlugin.key);
							editor.tf.collapse({ edge: 'end' });
							editor.tf.focus();
						}}
					>
						<KeyboardIcon />
						{t('fixed_toolbar_keyboard_input')}
					</DropdownMenuItem>

					<DropdownMenuItem
						onSelect={() => {
							editor.tf.toggleMark(SuperscriptPlugin.key, {
								remove: SubscriptPlugin.key
							});
							editor.tf.focus();
						}}
					>
						<SuperscriptIcon />
						{t('fixed_toolbar_superscript')}
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => {
							editor.tf.toggleMark(SubscriptPlugin.key, {
								remove: SuperscriptPlugin.key
							});
							editor.tf.focus();
						}}
					>
						<SubscriptIcon />
						{t('fixed_toolbar_subscript')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
