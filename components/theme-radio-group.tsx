'use client';

import { useTheme } from 'next-themes';

import {
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { useTranslations } from '@/i18n';

export default function ThemeRadioGroup() {
	const { theme, setTheme } = useTheme();
	const t = useTranslations('app_dashboard_account_avatar');

	return (
		<DropdownMenuGroup>
			<DropdownMenuLabel>{t('theme_label')}</DropdownMenuLabel>

			<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
				<DropdownMenuRadioItem value="light">
					{t('light')}
				</DropdownMenuRadioItem>
				<DropdownMenuRadioItem value="dark">{t('dark')}</DropdownMenuRadioItem>
				<DropdownMenuRadioItem value="system">
					{t('system')}
				</DropdownMenuRadioItem>
			</DropdownMenuRadioGroup>
		</DropdownMenuGroup>
	);
}
