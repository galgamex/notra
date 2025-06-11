'use client';

import { DropdownMenuItemIndicator } from '@radix-ui/react-dropdown-menu';
import {
	useLineHeightDropdownMenu,
	useLineHeightDropdownMenuState
} from '@udecode/plate-line-height/react';
import { CheckIcon, WrapText } from 'lucide-react';
import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';

import { ToolbarButton } from './toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

const t = getTranslations('notra_editor');

export function LineHeightDropdownMenu({
	...props
}: Readonly<DropdownMenuProps>) {
	const [open, setOpen] = React.useState(false);
	const state = useLineHeightDropdownMenuState();
	const { radioGroupProps } = useLineHeightDropdownMenu(state);

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					isDropdown
					pressed={open}
					tooltip={t('fixed_toolbar_line_height')}
				>
					<WrapText />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="min-w-0">
				<DropdownMenuRadioGroup {...radioGroupProps}>
					{state.values.map((_value) => (
						<DropdownMenuRadioItem
							key={_value}
							className="min-w-[180px] pl-2 *:first:[span]:hidden"
							value={_value}
						>
							<span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
								<DropdownMenuItemIndicator>
									<CheckIcon />
								</DropdownMenuItemIndicator>
							</span>
							{_value}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
