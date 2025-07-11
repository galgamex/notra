'use client';

import { useEditorRef, useSelectionFragmentProp } from '@udecode/plate/react';
import { type Alignment, setAlign } from '@udecode/plate-alignment';
import {
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon
} from 'lucide-react';
import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import { STRUCTURAL_TYPES } from '../transforms';
import { ToolbarButton } from './toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

const items = [
	{
		icon: AlignLeftIcon,
		value: 'left'
	},
	{
		icon: AlignCenterIcon,
		value: 'center'
	},
	{
		icon: AlignRightIcon,
		value: 'right'
	},
	{
		icon: AlignJustifyIcon,
		value: 'justify'
	}
];

const t = getTranslations('notra_editor');

export function AlignDropdownMenu(props: Readonly<DropdownMenuProps>) {
	const editor = useEditorRef();
	const value = useSelectionFragmentProp({
		defaultValue: 'start',
		structuralTypes: STRUCTURAL_TYPES,
		getProp: (node) => node.align
	});

	const [open, setOpen] = React.useState(false);
	const IconValue =
		items.find((item) => item.value === value)?.icon ?? AlignLeftIcon;

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					isDropdown
					pressed={open}
					tooltip={t('fixed_toolbar_align')}
				>
					<IconValue />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="min-w-0">
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(value) => {
						setAlign(editor, { value: value as Alignment });
						editor.tf.focus();
					}}
				>
					{items.map(({ icon: Icon, value: itemValue }) => (
						<DropdownMenuRadioItem
							key={itemValue}
							className="pl-2 *:first:[span]:hidden"
							value={itemValue}
						>
							<Icon />
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
