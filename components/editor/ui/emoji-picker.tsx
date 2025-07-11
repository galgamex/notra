'use client';

import { EmojiSettings } from '@udecode/plate-emoji';

import { cn } from '@/lib/utils';

import { EmojiPickerContent } from './emoji-picker-content';
import { EmojiPickerNavigation } from './emoji-picker-navigation';
import { EmojiPickerPreview } from './emoji-picker-preview';
import { EmojiPickerSearchAndClear } from './emoji-picker-search-and-clear';
import { EmojiPickerSearchBar } from './emoji-picker-search-bar';

import type { UseEmojiPickerType } from '@udecode/plate-emoji/react';

export function EmojiPicker({
	clearSearch,
	emoji,
	emojiLibrary,
	focusedCategory,
	hasFound,
	i18n,
	icons,
	isSearching,
	refs,
	searchResult,
	searchValue,
	setSearch,
	settings = EmojiSettings,
	visibleCategories,
	handleCategoryClick,
	onMouseOver,
	onSelectEmoji
}: Readonly<UseEmojiPickerType>) {
	return (
		<div
			className={cn(
				'flex flex-col rounded-xl bg-popover text-popover-foreground',
				'h-[23rem] w-80 border shadow-md'
			)}
		>
			<EmojiPickerNavigation
				emojiLibrary={emojiLibrary}
				focusedCategory={focusedCategory}
				i18n={i18n}
				icons={icons}
				onClick={handleCategoryClick}
			/>
			<EmojiPickerSearchBar
				i18n={i18n}
				searchValue={searchValue}
				setSearch={setSearch}
			>
				<EmojiPickerSearchAndClear
					clearSearch={clearSearch}
					i18n={i18n}
					searchValue={searchValue}
				/>
			</EmojiPickerSearchBar>
			<EmojiPickerContent
				emojiLibrary={emojiLibrary}
				i18n={i18n}
				isSearching={isSearching}
				refs={refs}
				searchResult={searchResult}
				settings={settings}
				visibleCategories={visibleCategories}
				onMouseOver={onMouseOver}
				onSelectEmoji={onSelectEmoji}
			/>
			<EmojiPickerPreview
				emoji={emoji}
				hasFound={hasFound}
				i18n={i18n}
				isSearching={isSearching}
			/>
		</div>
	);
}
