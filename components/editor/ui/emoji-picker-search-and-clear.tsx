'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { emojiSearchIcons } from './emoji-icons';

import type { UseEmojiPickerType } from '@udecode/plate-emoji/react';

export type EmojiPickerSearchAndClearProps = Pick<
	UseEmojiPickerType,
	'clearSearch' | 'i18n' | 'searchValue'
>;

export function EmojiPickerSearchAndClear({
	clearSearch,
	i18n,
	searchValue
}: Readonly<EmojiPickerSearchAndClearProps>) {
	return (
		<div className="flex items-center text-foreground">
			<div
				className={cn(
					'absolute top-1/2 left-2.5 z-10 flex size-5 -translate-y-1/2 items-center justify-center text-foreground'
				)}
			>
				{emojiSearchIcons.loupe}
			</div>
			{searchValue && (
				<Button
					aria-label="Clear"
					className={cn(
						'absolute top-1/2 right-0.5 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-popover-foreground hover:bg-transparent'
					)}
					size="icon"
					title={i18n.clear}
					type="button"
					variant="ghost"
					onClick={clearSearch}
				>
					{emojiSearchIcons.delete}
				</Button>
			)}
		</div>
	);
}
