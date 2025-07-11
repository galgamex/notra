'use client';

import {
	type Emoji,
	type GridRow,
	EmojiCategoryList,
	EmojiSettings
} from '@udecode/plate-emoji';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { UseEmojiPickerType } from '@udecode/plate-emoji/react';

export type EmojiButtonProps = {
	emoji: Emoji;
	index: number;
	onMouseOver: (emoji?: Emoji) => void;
	onSelect: (emoji: Emoji) => void;
};

export type EmojiPickerContentProps = Pick<
	UseEmojiPickerType,
	| 'emojiLibrary'
	| 'i18n'
	| 'isSearching'
	| 'onMouseOver'
	| 'onSelectEmoji'
	| 'refs'
	| 'searchResult'
	| 'settings'
	| 'visibleCategories'
>;

export type RowOfButtonsProps = {
	row: GridRow;
} & Pick<UseEmojiPickerType, 'emojiLibrary' | 'onMouseOver' | 'onSelectEmoji'>;

const Button = React.memo(
	({ emoji, index, onMouseOver, onSelect }: EmojiButtonProps) => {
		return (
			<button
				aria-label={emoji.skins[0].native}
				className="group relative flex size-9 cursor-pointer items-center justify-center border-none bg-transparent text-2xl leading-none"
				data-index={index}
				tabIndex={-1}
				type="button"
				onClick={() => onSelect(emoji)}
				onMouseEnter={() => onMouseOver(emoji)}
				onMouseLeave={() => onMouseOver()}
			>
				<div
					aria-hidden="true"
					className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
				/>
				<span
					className="relative"
					data-emoji-set="native"
					style={{
						fontFamily:
							'"Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", EmojiSymbols'
					}}
				>
					{emoji.skins[0].native}
				</span>
			</button>
		);
	}
);

Button.displayName = 'Button';

const RowOfButtons = React.memo(
	({ emojiLibrary, row, onMouseOver, onSelectEmoji }: RowOfButtonsProps) => (
		<div key={row.id} className="flex" data-index={row.id}>
			{row.elements.map((emojiId, index) => (
				<Button
					key={emojiId}
					emoji={emojiLibrary.getEmoji(emojiId)}
					index={index}
					onMouseOver={onMouseOver}
					onSelect={onSelectEmoji}
				/>
			))}
		</div>
	)
);

RowOfButtons.displayName = 'RowOfButtons';

export function EmojiPickerContent({
	emojiLibrary,
	i18n,
	isSearching = false,
	refs,
	searchResult,
	settings = EmojiSettings,
	visibleCategories,
	onMouseOver,
	onSelectEmoji
}: Readonly<EmojiPickerContentProps>) {
	const getRowWidth = settings.perLine.value * settings.buttonSize.value;

	const isCategoryVisible = React.useCallback(
		(categoryId: EmojiCategoryList) => {
			return visibleCategories.has(categoryId)
				? visibleCategories.get(categoryId)
				: false;
		},
		[visibleCategories]
	);

	const EmojiList = React.useCallback(() => {
		return emojiLibrary
			.getGrid()
			.sections()
			.map(({ id: categoryId }) => {
				const section = emojiLibrary.getGrid().section(categoryId);
				const { buttonSize } = settings;

				return (
					<div
						key={categoryId}
						ref={section.root}
						data-id={categoryId}
						style={{ width: getRowWidth }}
					>
						<div className="sticky -top-px z-1 bg-popover/90 p-1 py-2 text-sm font-semibold backdrop-blur-xs">
							{i18n.categories[categoryId]}
						</div>
						<div
							className="relative flex flex-wrap"
							style={{ height: section.getRows().length * buttonSize.value }}
						>
							{isCategoryVisible(categoryId) &&
								section
									.getRows()
									.map((row: GridRow) => (
										<RowOfButtons
											key={row.id}
											emojiLibrary={emojiLibrary}
											row={row}
											onMouseOver={onMouseOver}
											onSelectEmoji={onSelectEmoji}
										/>
									))}
						</div>
					</div>
				);
			});
	}, [
		emojiLibrary,
		getRowWidth,
		i18n.categories,
		isCategoryVisible,
		onSelectEmoji,
		onMouseOver,
		settings
	]);

	const SearchList = React.useCallback(() => {
		return (
			<div data-id="search" style={{ width: getRowWidth }}>
				<div className="sticky -top-px z-1 bg-popover/90 p-1 py-2 text-sm font-semibold text-card-foreground backdrop-blur-xs">
					{i18n.searchResult}
				</div>
				<div className="relative flex flex-wrap">
					{searchResult.map((emoji: Emoji, index: number) => (
						<Button
							key={emoji.id}
							emoji={emojiLibrary.getEmoji(emoji.id)}
							index={index}
							onMouseOver={onMouseOver}
							onSelect={onSelectEmoji}
						/>
					))}
				</div>
			</div>
		);
	}, [
		emojiLibrary,
		getRowWidth,
		i18n.searchResult,
		searchResult,
		onSelectEmoji,
		onMouseOver
	]);

	return (
		<div
			ref={refs.current.contentRoot}
			className={cn(
				'h-full min-h-[50%] overflow-x-hidden overflow-y-auto px-2',
				'[&::-webkit-scrollbar]:w-4',
				'[&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-button]:size-0',
				'[&::-webkit-scrollbar-thumb]:min-h-11 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/25',
				'[&::-webkit-scrollbar-thumb]:border-4 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-popover [&::-webkit-scrollbar-thumb]:bg-clip-padding'
			)}
			data-id="scroll"
		>
			<div ref={refs.current.content} className="h-full">
				{isSearching ? SearchList() : EmojiList()}
			</div>
		</div>
	);
}
