'use client';

import { EraserIcon } from 'lucide-react';
import * as React from 'react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

import {
	type TColor,
	ColorDropdownMenuItems
} from './color-dropdown-menu-items';
import { ColorCustom } from './colors-custom';
import { ToolbarMenuGroup } from './toolbar';

type ColorPickerContentProps = React.ComponentProps<'div'> & {
	colors: TColor[];
	customColors: TColor[];
	clearColor: () => void;
	updateColor: (color: string) => void;
	updateCustomColor: (color: string) => void;
	color?: string;
};

const t = getTranslations('notra_editor');

export function ColorPickerContent({
	className,
	clearColor,
	color,
	colors,
	customColors,
	updateColor,
	updateCustomColor,
	...props
}: ColorPickerContentProps) {
	return (
		<div className={cn('flex flex-col', className)} {...props}>
			<ToolbarMenuGroup label={t('color_picker_custom_colors')}>
				<ColorCustom
					className="px-2"
					color={color}
					colors={colors}
					customColors={customColors}
					updateColor={updateColor}
					updateCustomColor={updateCustomColor}
				/>
			</ToolbarMenuGroup>
			<ToolbarMenuGroup label={t('color_picker_default_colors')}>
				<ColorDropdownMenuItems
					className="px-2"
					color={color}
					colors={colors}
					updateColor={updateColor}
				/>
			</ToolbarMenuGroup>
			{color && (
				<ToolbarMenuGroup>
					<DropdownMenuItem className="p-2" onClick={clearColor}>
						<EraserIcon />
						<span>{t('color_picker_clear')}</span>
					</DropdownMenuItem>
				</ToolbarMenuGroup>
			)}
		</div>
	);
}

export const ColorPicker = React.memo(
	ColorPickerContent,
	(prev, next) =>
		prev.color === next.color &&
		prev.colors === next.colors &&
		prev.customColors === next.customColors
);
