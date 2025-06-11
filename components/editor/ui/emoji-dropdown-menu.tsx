'use client';

import {
	type EmojiDropdownMenuOptions,
	useEmojiDropdownMenuState
} from '@udecode/plate-emoji/react';
import { Smile } from 'lucide-react';
import * as React from 'react';

import { getTranslations } from '@/i18n';

import { emojiCategoryIcons, emojiSearchIcons } from './emoji-icons';
import { EmojiPicker } from './emoji-picker';
import { EmojiToolbarDropdown } from './emoji-toolbar-dropdown';
import { ToolbarButton } from './toolbar';

type EmojiDropdownMenuProps = {
	options?: EmojiDropdownMenuOptions;
} & React.ComponentPropsWithoutRef<typeof ToolbarButton>;

const t = getTranslations('notra_editor');

export function EmojiDropdownMenu({
	options,
	...props
}: EmojiDropdownMenuProps) {
	const { emojiPickerState, isOpen, setIsOpen } =
		useEmojiDropdownMenuState(options);

	return (
		<EmojiToolbarDropdown
			control={
				<ToolbarButton
					isDropdown
					pressed={isOpen}
					tooltip={t('fixed_toolbar_emoji')}
					{...props}
				>
					<Smile />
				</ToolbarButton>
			}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<EmojiPicker
				{...emojiPickerState}
				icons={{
					categories: emojiCategoryIcons,
					search: emojiSearchIcons
				}}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				settings={options?.settings}
			/>
		</EmojiToolbarDropdown>
	);
}
